import { spawn } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const id = process.argv[2];
if (!id || !/^[a-z0-9][a-z0-9-]*$/.test(id)) {
  throw new Error("Usage: node scripts/tts.mjs <video-id>");
}

const projectDir = resolve("projects", id);
const { videoScript } = await import(
  pathToFileURL(resolve(projectDir, "script.ts")).href
);
if (videoScript.id !== id)
  throw new Error(`Script ID does not match folder: ${id}`);

const audioDir = resolve(projectDir, "audio");
await mkdir(audioDir, { recursive: true });
const voice = videoScript.tts?.voice ?? "en-US-AndrewMultilingualNeural";
const rate = videoScript.tts?.rate ?? "+0%";

for (const scene of videoScript.scenes) {
  if (!scene.narration?.trim())
    throw new Error(`Missing narration: ${scene.id}`);
  const target = resolve(audioDir, `${scene.id}.mp3`);
  const args = [
    "tool",
    "run",
    "--from",
    "edge-tts",
    "edge-tts",
    "--voice",
    voice,
    "--rate",
    rate,
    "--text",
    scene.narration,
    "--write-media",
    target,
  ];
  await new Promise((done, reject) => {
    const child = spawn("uv", args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0
        ? done()
        : reject(new Error(`TTS failed for ${scene.id}: ${code}`)),
    );
  });
  const info = await stat(target);
  if (info.size < 1024)
    throw new Error(`TTS output is unexpectedly small: ${target}`);
  console.log(`${scene.id}: ${(info.size / 1024).toFixed(0)} KiB`);
}

console.log(`Voice files ready in ${audioDir}`);
