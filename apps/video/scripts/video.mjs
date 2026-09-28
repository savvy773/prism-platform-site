// Video factory CLI: one folder per video under projects/<video-id>/.
//   script.ts          the only hand-written file
//   audio/             generated narration + manifest.json (Git-ignored)
//   output/            MP4, SRT, thumbnail, youtube.json (Git-ignored)
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { createServer } from "node:http";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { timeCaptions } from "../src/data/captions.ts";

const ROOT = resolve(import.meta.dirname, "..");
const PROJECTS = join(ROOT, "projects");
const TEMPLATE = join(ROOT, "templates", "script.ts");
const SECRETS = join(homedir(), ".config", "prism-video");
const AUDIO_TAIL_SEC = 0.9; // keep in sync with src/data/video-script.ts
const GEMINI_DEFAULT_MODEL = "gemini-3.8-flash-lite-tts";
// Used in order when the current model's quota or credits run out.
const GEMINI_FALLBACK_MODELS = ["gemini-3.8-flash-tts"];
const EDGE_DEFAULT_VOICE = "ko-KR-SunHiNeural";

const usage = `Usage: node scripts/video.mjs <command> [video-id...|--all] [options]

  list                     List video projects
  new <id>                 Create projects/<id>/script.ts from the template
  tts <id> [--force] [--provider=edge]  Generate narration (only changed scenes are billed)
  render <id>              Render output/<id>.mp4, .srt, description.txt, thumbnail.png
  make <id>                tts + render
  preview <id> [--frames=0-299]  Short half-resolution render for review
  still <id> [--frame=N]   Render one PNG frame
  site <id>                Copy the rendered MP4 and poster to the site's media/
  auth                     Authorize YouTube upload (one time)
  upload <id> [--force]    Upload to YouTube (privacy from script, default private)
  publish <id>             make + upload
  clean <id>               Delete generated audio and output
  remove <id>              Delete the whole project folder

Commands that take an ID also accept several IDs or --all.
GEMINI_API_KEY goes in apps/video/.env; YouTube OAuth files in ~/.config/prism-video/.`;

const [command, ...rest] = process.argv.slice(2);
const ids = rest.filter((arg) => !arg.startsWith("--"));
const flags = Object.fromEntries(
  rest
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, value] = arg.slice(2).split("=");
      return [key, value ?? true];
    }),
);

const run = (cmd, args, options = {}) =>
  new Promise((done, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", cwd: ROOT, ...options });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0 ? done() : reject(new Error(`${cmd} exited with ${code}`)),
    );
  });

const capture = (cmd, args) =>
  new Promise((done, reject) => {
    const child = spawn(cmd, args, { cwd: ROOT });
    let out = "";
    child.stdout.on("data", (chunk) => {
      out += chunk;
    });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0 ? done(out.trim()) : reject(new Error(`${cmd} failed`)),
    );
  });

const remotion = (args) =>
  run(join(ROOT, "node_modules", ".bin", "remotion"), args);

// GEMINI_API_KEY lives in apps/video/.env (Git-ignored); see .env.example.
for (const file of [join(ROOT, ".env"), join(SECRETS, ".env")]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

const allIds = async () =>
  (await readdir(PROJECTS))
    .filter((name) => existsSync(join(PROJECTS, name, "script.ts")))
    .sort();

const targetIds = async () => {
  const list = flags.all ? await allIds() : ids;
  if (!list.length) throw new Error(`A video ID is required.\n\n${usage}`);
  for (const value of list) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) {
      throw new Error(
        `Video IDs use lowercase letters, digits and dashes: ${value}`,
      );
    }
  }
  return list;
};

const projectDir = (videoId) => join(PROJECTS, videoId);

const loadScript = async (videoId) => {
  const file = join(projectDir(videoId), "script.ts");
  if (!existsSync(file)) throw new Error(`No script: ${file}`);
  const { videoScript } = await import(
    `${pathToFileURL(file).href}?t=${Date.now()}`
  );
  if (videoScript.id !== videoId) {
    throw new Error(
      `Script ID "${videoScript.id}" must match folder "${videoId}"`,
    );
  }
  return videoScript;
};

const compositionId = (script) =>
  script.compositionId ??
  script.id.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

const readJson = async (file, fallback) =>
  existsSync(file) ? JSON.parse(await readFile(file, "utf8")) : fallback;

const probeSeconds = async (file) =>
  Number(
    await capture(join(ROOT, "node_modules", ".bin", "remotion"), [
      "ffprobe",
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "csv=p=0",
      file,
    ]),
  );

// ---------------------------------------------------------------- TTS

const spokenText = (text, lexicon = {}) =>
  Object.entries(lexicon).reduce(
    (result, [word, spoken]) =>
      result.replace(
        new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        spoken,
      ),
    text,
  );

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

// Waits out short per-minute limits. A long wait means the quota is used up,
// so the response is returned and the caller moves to the next model.
const fetchWithRetry = async (url, init, attempts = 8) => {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, init);
    if (![429, 500, 503].includes(response.status) || attempt >= attempts) {
      return response;
    }
    const body = await response.clone().text();
    const hint = /retry in (\d+(?:\.\d+)?)s/i.exec(body);
    const wait = Math.ceil(Number(hint?.[1] ?? 20 * attempt)) + 2;
    if (response.status === 429 && (!hint || wait > 120)) return response;
    console.log(`  rate limited, retrying in ${wait}s...`);
    await sleep(wait * 1000);
  }
};

const geminiModels = (tts) => [
  ...new Set([
    tts.model ?? GEMINI_DEFAULT_MODEL,
    ...(tts.fallbackModels ?? GEMINI_FALLBACK_MODELS),
  ]),
];
let geminiModelIndex = 0;

const synthGemini = async ({ text, tts, target }) => {
  const models = geminiModels(tts);
  for (;;) {
    const model = models[geminiModelIndex];
    try {
      await synthGeminiWith({ text, tts, target, model });
      return model;
    } catch (error) {
      const exhausted = error.status === 402 || error.status === 429;
      if (!exhausted || geminiModelIndex >= models.length - 1) throw error;
      geminiModelIndex += 1;
      console.log(
        `  ${model} quota exhausted; switching to ${models[geminiModelIndex]}`,
      );
    }
  }
};

const synthGeminiWith = async ({ text, tts, target, model }) => {
  const response = await fetchWithRetry(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            type: "user_input",
            content: [
              {
                type: "text",
                text,
                annotations: tts.style
                  ? [{ type: "speech_metadata", style: tts.style }]
                  : [],
              },
            ],
          },
        ],
        response_format: { type: "audio" },
        generation_config: { speech_config: [{ voice: tts.voice }] },
      }),
    },
  );
  if (!response.ok) {
    const error = new Error(
      `Gemini TTS ${response.status} (${model}): ${await response.text()}`,
    );
    error.status = response.status;
    throw error;
  }
  const body = await response.json();
  const audio = (body.steps ?? [])
    .filter((step) => step.type === "model_output")
    .flatMap((step) => step.content ?? [])
    .filter((part) => part.type === "audio")
    .at(-1);
  if (!audio?.data) throw new Error("Gemini TTS returned no audio");
  const wav = `${target}.wav`;
  await writeFile(wav, Buffer.from(audio.data, "base64"));
  await run(join(ROOT, "node_modules", ".bin", "remotion"), [
    "ffmpeg",
    "-y",
    "-loglevel",
    "error",
    "-i",
    wav,
    "-codec:a",
    "libmp3lame",
    "-b:a",
    "160k",
    target,
  ]);
  await rm(wav);
};

const synthEdge = async ({ text, voice, tts, target }) => {
  await run("uv", [
    "tool",
    "run",
    "--from",
    "edge-tts",
    "edge-tts",
    "--voice",
    voice,
    `--rate=${tts.rate ?? "+0%"}`,
    `--pitch=${tts.pitch ?? "+0Hz"}`,
    "--text",
    text,
    "--write-media",
    target,
  ]);
};

const resolveEngine = (tts) => {
  const wanted = flags.provider ?? tts.provider ?? "gemini";
  if (wanted === "gemini" && process.env.GEMINI_API_KEY) {
    return {
      name: "gemini",
      voice: `${tts.model ?? GEMINI_DEFAULT_MODEL}/${tts.voice}`,
    };
  }
  if (wanted === "gemini") {
    // Never switch voices silently: a mixed or unexpected voice ruins a video.
    throw new Error(
      "GEMINI_API_KEY is not set (apps/video/.env, see .env.example). Pass --provider=edge to use Edge TTS instead.",
    );
  }
  // tts.voice names a Gemini voice when the script targets Gemini.
  const voice =
    (tts.provider ?? "gemini") === "gemini"
      ? (tts.fallbackVoice ?? EDGE_DEFAULT_VOICE)
      : (tts.voice ?? EDGE_DEFAULT_VOICE);
  return { name: "edge", voice };
};

const tts = async (videoId) => {
  const script = await loadScript(videoId);
  const config = script.tts;
  if (!config?.enabled) {
    console.log("TTS is disabled in this script.");
    return;
  }
  const audioDir = join(projectDir(videoId), "audio");
  await mkdir(audioDir, { recursive: true });
  const manifestFile = join(audioDir, "manifest.json");
  const previous = await readJson(manifestFile, { scenes: {} });
  const engine = resolveEngine(config);
  const manifest = { voice: `${engine.name}:${engine.voice}`, scenes: {} };

  const jobs = script.scenes.map((scene) => async () => {
    if (!scene.narration?.trim())
      throw new Error(`Missing narration: ${scene.id}`);
    const text = spokenText(scene.narration, config.lexicon);
    const hash = createHash("sha256")
      .update(
        JSON.stringify([
          manifest.voice,
          config.style,
          config.rate,
          config.pitch,
          text,
        ]),
      )
      .digest("hex")
      .slice(0, 16);
    const target = join(audioDir, `${scene.id}.mp3`);
    const cached = previous.scenes[scene.id];
    if (!flags.force && cached?.hash === hash && existsSync(target)) {
      manifest.scenes[scene.id] = cached;
      console.log(`${scene.id}: unchanged`);
      return;
    }
    const synth = engine.name === "gemini" ? synthGemini : synthEdge;
    const model = await synth({
      text,
      voice: engine.voice,
      tts: config,
      target,
    });
    if ((await stat(target)).size < 1024) {
      throw new Error(`TTS output is unexpectedly small: ${target}`);
    }
    const durationSec = await probeSeconds(target);
    manifest.scenes[scene.id] = { hash, durationSec, ...(model && { model }) };
    // Save after every clip so an interrupted run never pays for it twice.
    previous.scenes[scene.id] = manifest.scenes[scene.id];
    await writeFile(manifestFile, `${JSON.stringify(previous, null, 2)}\n`);
    console.log(
      `${scene.id}: ${durationSec.toFixed(1)}s (${model ?? engine.name})`,
    );
  });

  // Gemini runs one request at a time to respect rate limits; Edge runs four.
  const queue = [...jobs];
  await Promise.all(
    Array.from({ length: engine.name === "gemini" ? 1 : 4 }, async () => {
      while (queue.length) await queue.shift()();
    }),
  );

  // Drop clips for scenes that no longer exist so the folder holds no leftovers.
  const keep = new Set(script.scenes.map((scene) => `${scene.id}.mp3`));
  for (const file of await readdir(audioDir)) {
    if (file.endsWith(".mp3") && !keep.has(file))
      await rm(join(audioDir, file));
  }
  await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

  const total = script.scenes.reduce(
    (sum, scene) =>
      sum +
      Math.max(
        scene.durationSec,
        (manifest.scenes[scene.id]?.durationSec ?? 0) + AUDIO_TAIL_SEC,
      ),
    0,
  );
  console.log(`Narration ready. Estimated length ${total.toFixed(0)}s.`);
};

// ---------------------------------------------------------------- Render

const srtTime = (seconds) => {
  const ms = Math.round(seconds * 1000);
  const pad = (value, size = 2) => String(value).padStart(size, "0");
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};

const sceneTimeline = async (script) => {
  const manifest = await readJson(
    join(projectDir(script.id), "audio", "manifest.json"),
    { scenes: {} },
  );
  let offset = 0;
  return script.scenes.map((scene) => {
    const speech = manifest.scenes[scene.id]?.durationSec ?? 0;
    const frames = Math.ceil(
      Math.max(scene.durationSec, speech ? speech + AUDIO_TAIL_SEC : 0) *
        script.fps,
    );
    const entry = { scene, start: offset, speech };
    offset += frames / script.fps;
    return entry;
  });
};

const writeSrt = async (script, timeline) => {
  const cues = timeline.flatMap(({ scene, start, speech }) =>
    timeCaptions(
      scene.narration,
      speech || scene.durationSec - AUDIO_TAIL_SEC,
    ).map((caption) => ({
      ...caption,
      start: caption.start + start,
      end: caption.end + start,
    })),
  );
  const srt = cues
    .map(
      (cue, index) =>
        `${index + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${cue.text}\n`,
    )
    .join("\n");
  await writeFile(
    join(projectDir(script.id), "output", `${script.id}.srt`),
    srt,
  );
};

const clock = (seconds) => {
  const total = Math.floor(seconds);
  const pad = (value) => String(value).padStart(2, "0");
  return total >= 3600
    ? `${Math.floor(total / 3600)}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`
    : `${Math.floor(total / 60)}:${pad(total % 60)}`;
};

// YouTube turns "0:00 Title" lines into chapters when there are at least three.
const writeDescription = async (script, timeline) => {
  const chapters = timeline
    .filter(({ scene }) => scene.chapter)
    .map(({ scene, start }) => `${clock(start)} ${scene.chapter}`);
  if (chapters.length && !chapters[0].startsWith("0:00 ")) {
    chapters.unshift("0:00 시작");
  }
  const text = [
    script.youtube?.description ?? script.title,
    chapters.length >= 3 ? chapters.join("\n") : "",
  ]
    .filter(Boolean)
    .join("\n\n");
  await writeFile(
    join(projectDir(script.id), "output", "description.txt"),
    `${text}\n`,
  );
};

const render = async (videoId) => {
  const script = await loadScript(videoId);
  const out = join(projectDir(videoId), "output");
  await mkdir(out, { recursive: true });
  await remotion([
    "render",
    "src/index.ts",
    compositionId(script),
    join(out, `${videoId}.mp4`),
  ]);
  // Thumbnail: 2 s into the first title scene (or --thumb=<frame>).
  const timeline = await sceneTimeline(script);
  const cover = timeline.find(({ scene }) => scene.type === "title");
  const thumbFrame =
    flags.thumb ?? Math.round(((cover?.start ?? 0) + 2) * script.fps);
  await remotion([
    "still",
    "src/index.ts",
    compositionId(script),
    join(out, "thumbnail.png"),
    `--frame=${thumbFrame}`,
  ]);
  await writeSrt(script, timeline);
  await writeDescription(script, timeline);
  console.log(`Output ready in ${out}`);
};

const preview = async (videoId) => {
  const script = await loadScript(videoId);
  await remotion([
    "render",
    "src/index.ts",
    compositionId(script),
    join(projectDir(videoId), "output", "preview.mp4"),
    `--frames=${flags.frames ?? "0-299"}`,
    "--scale=0.5",
  ]);
};

const still = async (videoId) => {
  const script = await loadScript(videoId);
  const frame = flags.frame ?? 60;
  await remotion([
    "still",
    "src/index.ts",
    compositionId(script),
    join(projectDir(videoId), "output", `still-${frame}.png`),
    `--frame=${frame}`,
  ]);
};

// ---------------------------------------------------------------- YouTube

const CLIENT_FILE = join(SECRETS, "client_secret.json");
const TOKEN_FILE = join(SECRETS, "youtube-token.json");
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.force-ssl",
];

const oauthClient = async () => {
  if (!existsSync(CLIENT_FILE)) {
    throw new Error(
      `Save a Google OAuth "Desktop app" client JSON to ${CLIENT_FILE} first (see docs/VIDEO_WORKFLOW.md).`,
    );
  }
  const json = JSON.parse(await readFile(CLIENT_FILE, "utf8"));
  return json.installed ?? json.web;
};

const auth = async () => {
  const client = await oauthClient();
  const server = createServer();
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const redirect = `http://127.0.0.1:${server.address().port}`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: redirect,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
  }).toString();
  console.log(`Open this URL and approve access:\n\n${url}\n`);
  const code = await new Promise((done) => {
    server.on("request", (req, res) => {
      const value = new URL(req.url, redirect).searchParams.get("code");
      res.end(value ? "Authorized. You can close this tab." : "Missing code.");
      if (value) done(value);
    });
  });
  server.close();
  const token = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      code,
      client_id: client.client_id,
      client_secret: client.client_secret,
      redirect_uri: redirect,
      grant_type: "authorization_code",
    }),
  }).then((res) => res.json());
  if (!token.refresh_token)
    throw new Error(`No refresh token: ${JSON.stringify(token)}`);
  await mkdir(SECRETS, { recursive: true, mode: 0o700 });
  await writeFile(
    TOKEN_FILE,
    JSON.stringify({ refresh_token: token.refresh_token }),
    {
      mode: 0o600,
    },
  );
  console.log(`Saved YouTube token to ${TOKEN_FILE}`);
};

const accessToken = async () => {
  const client = await oauthClient();
  const { refresh_token } = await readJson(TOKEN_FILE, {});
  if (!refresh_token) throw new Error("Run `just video auth` first.");
  const token = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      refresh_token,
      client_id: client.client_id,
      client_secret: client.client_secret,
      grant_type: "refresh_token",
    }),
  }).then((res) => res.json());
  if (!token.access_token)
    throw new Error(`Token refresh failed: ${JSON.stringify(token)}`);
  return token.access_token;
};

const upload = async (videoId) => {
  const script = await loadScript(videoId);
  const meta = script.youtube;
  if (!meta) throw new Error("Add a `youtube` block to the script first.");
  const out = join(projectDir(videoId), "output");
  const video = join(out, `${videoId}.mp4`);
  const record = join(out, "youtube.json");
  if (!existsSync(video)) throw new Error(`Render first: ${video}`);
  if (existsSync(record) && !flags.force) {
    const { url } = JSON.parse(await readFile(record, "utf8"));
    throw new Error(`Already uploaded (${url}). Use --force to upload again.`);
  }
  const token = await accessToken();
  const auth = { Authorization: `Bearer ${token}` };
  const size = (await stat(video)).size;
  const start = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        ...auth,
        "Content-Type": "application/json",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": String(size),
      },
      body: JSON.stringify({
        snippet: {
          title: meta.title,
          description: existsSync(join(out, "description.txt"))
            ? await readFile(join(out, "description.txt"), "utf8")
            : meta.description,
          tags: meta.tags ?? [],
          categoryId: meta.categoryId ?? "28",
          defaultLanguage: meta.language ?? "ko",
          defaultAudioLanguage: meta.language ?? "ko",
        },
        status: {
          privacyStatus: meta.privacy ?? "private",
          selfDeclaredMadeForKids: false,
        },
      }),
    },
  );
  if (!start.ok)
    throw new Error(`Upload init ${start.status}: ${await start.text()}`);
  console.log(`Uploading ${(size / 1048576).toFixed(1)} MiB...`);
  const done = await fetch(start.headers.get("location"), {
    method: "PUT",
    headers: {
      ...auth,
      "Content-Type": "video/mp4",
      "Content-Length": String(size),
    },
    body: await readFile(video),
  });
  if (!done.ok) throw new Error(`Upload ${done.status}: ${await done.text()}`);
  const { id: youtubeId } = await done.json();
  const url = `https://youtu.be/${youtubeId}`;
  await writeFile(
    record,
    `${JSON.stringify({ youtubeId, url, uploadedAt: new Date().toISOString() }, null, 2)}\n`,
  );
  console.log(`Uploaded: ${url} (${meta.privacy ?? "private"})`);

  // Captions and thumbnail are best-effort: a failure should not hide the upload.
  const srt = join(out, `${videoId}.srt`);
  if (existsSync(srt)) {
    const boundary = `prism${Date.now()}`;
    const body = [
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`,
      JSON.stringify({
        snippet: {
          videoId: youtubeId,
          language: meta.language ?? "ko",
          name: "",
        },
      }),
      `\r\n--${boundary}\r\nContent-Type: application/x-subrip\r\n\r\n`,
      await readFile(srt, "utf8"),
      `\r\n--${boundary}--`,
    ].join("");
    const res = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/captions?uploadType=multipart&part=snippet",
      {
        method: "POST",
        headers: {
          ...auth,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );
    console.log(
      res.ok ? "Captions uploaded." : `Captions skipped: ${res.status}`,
    );
  }
  const thumb = join(out, "thumbnail.png");
  if (existsSync(thumb)) {
    const res = await fetch(
      `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${youtubeId}&uploadType=media`,
      {
        method: "POST",
        headers: { ...auth, "Content-Type": "image/png" },
        body: await readFile(thumb),
      },
    );
    console.log(
      res.ok
        ? "Thumbnail set."
        : `Thumbnail skipped (channel may need verification): ${res.status}`,
    );
  }
};

// ---------------------------------------------------------------- Projects

const list = async () => {
  for (const name of (await readdir(PROJECTS)).sort()) {
    if (!existsSync(join(PROJECTS, name, "script.ts"))) continue;
    const script = await loadScript(name);
    const out = join(PROJECTS, name, "output");
    const rendered = existsSync(join(out, `${name}.mp4`)) ? "rendered" : "-";
    const record = await readJson(join(out, "youtube.json"), null);
    console.log(
      `${name.padEnd(28)} ${compositionId(script).padEnd(28)} ${String(script.scenes.length).padStart(3)} scenes  ${rendered.padEnd(8)} ${record?.url ?? ""}`,
    );
  }
};

const create = async (videoId) => {
  const dir = projectDir(videoId);
  if (existsSync(dir)) throw new Error(`Already exists: ${dir}`);
  await mkdir(dir, { recursive: true });
  const template = await readFile(TEMPLATE, "utf8");
  await writeFile(
    join(dir, "script.ts"),
    template.replaceAll("__VIDEO_ID__", videoId),
  );
  console.log(`Created ${join(dir, "script.ts")}`);
};

const clean = async (videoId) => {
  for (const sub of ["audio", "output"]) {
    await rm(join(projectDir(videoId), sub), { recursive: true, force: true });
  }
  console.log(`Removed generated files for ${videoId}`);
};

const remove = async (videoId) => {
  if (!existsSync(projectDir(videoId)))
    throw new Error(`No project: ${videoId}`);
  await rm(projectDir(videoId), { recursive: true });
  console.log(`Removed project ${videoId}`);
};

const site = async (videoId) => {
  const out = join(projectDir(videoId), "output");
  const media = resolve(ROOT, "..", "..", "media");
  // The site copy is re-encoded smaller; YouTube gets the full-quality file.
  await run(join(ROOT, "node_modules", ".bin", "remotion"), [
    "ffmpeg",
    "-y",
    "-loglevel",
    "error",
    "-i",
    join(out, `${videoId}.mp4`),
    "-c:v",
    "libx264",
    "-crf",
    "28",
    "-preset",
    "slow",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    join(media, `${videoId}.mp4`),
  ]);
  await copyFile(join(out, "thumbnail.png"), join(media, `${videoId}.png`));
  // Browsers want WebVTT for <track>; convert the SRT captions.
  const srt = await readFile(join(out, `${videoId}.srt`), "utf8");
  await writeFile(
    join(media, `${videoId}.vtt`),
    `WEBVTT\n\n${srt.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, "$1.$2")}`,
  );
  console.log(
    `Copied MP4, poster and captions to ${media}; add the film to index.html.`,
  );
};

const perVideo = {
  new: create,
  tts,
  render,
  make: async (videoId) => {
    await tts(videoId);
    await render(videoId);
  },
  preview,
  still,
  site,
  upload,
  publish: async (videoId) => {
    await tts(videoId);
    await render(videoId);
    await upload(videoId);
  },
  clean,
  remove,
};

const main = async () => {
  if (command === "list") return list();
  if (command === "auth") return auth();
  const action = perVideo[command];
  if (!action) {
    console.log(usage);
    process.exit(command ? 1 : 0);
  }
  const failed = [];
  for (const videoId of await targetIds()) {
    console.log(`\n=== ${command} ${videoId}`);
    // One broken script should not stop a batch; report it at the end.
    await action(videoId).catch((error) => {
      console.error(`${videoId}: ${error.message}`);
      failed.push(videoId);
    });
  }
  if (failed.length) {
    console.error(`\nFailed: ${failed.join(", ")}`);
    process.exit(1);
  }
};

await main();
