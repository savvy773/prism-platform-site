export type VideoSceneType =
  | "character"
  | "title"
  | "dashboard"
  | "diagram"
  | "outro";

export type GuideMood = "happy" | "wink" | "surprised" | "thinking" | "proud";

export type VisualVariant =
  | "workspace"
  | "erp"
  | "flow"
  | "report"
  | "chaos"
  | "cards"
  | "compare"
  | "checklist"
  | "timeline"
  | "hub"
  | "screenshot";

export type VideoScene = {
  id: string;
  type: VideoSceneType;
  /** Minimum length. With generated audio the scene grows to fit the voice. */
  durationSec: number;
  title: string;
  subtitle: string;
  narration: string;
  /** Plain labels, or "icon:label" for illustrated scenes (see Icon names). */
  items?: readonly string[];
  /** Before/after rows for the "compare" variant. */
  pairs?: readonly { before: string; after: string }[];
  /** Screenshot for the "screenshot" variant, relative to the project folder. */
  image?: string;
  mood?: GuideMood;
  /** Starts a YouTube chapter at this scene; shown in the illustrated header. */
  chapter?: string;
  visualVariant?: VisualVariant;
  /** Free-form notes for whoever edits visuals; not rendered. */
  notes?: string;
};

export type TtsConfig = {
  enabled: boolean;
  /** "gemini" needs GEMINI_API_KEY; `--provider=edge` switches a run to Edge TTS. */
  provider?: "gemini" | "edge"; // default "gemini"
  /** Voice for the chosen provider (Gemini: "Kore", Edge: "ko-KR-SunHiNeural"). */
  voice: string;
  /** Gemini model ID. Default: gemini-3.8-flash-lite-tts. */
  model?: string;
  /** Tried in order when the model's quota runs out. Default: gemini-3.8-flash-tts. */
  fallbackModels?: readonly string[];
  /** Gemini delivery direction, e.g. "bright, cheerful Korean presenter". */
  style?: string;
  /** Edge voice used with `--provider=edge`. */
  fallbackVoice?: string;
  /** Edge speaking rate, e.g. "+5%". */
  rate?: string;
  pitch?: string;
  /** Spoken replacements applied before synthesis, e.g. { ERP: "이알피" }. */
  lexicon?: Readonly<Record<string, string>>;
};

export type YouTubeMeta = {
  title: string;
  description: string;
  tags?: readonly string[];
  /** YouTube category ID; 28 = Science & Technology. */
  categoryId?: string;
  privacy?: "private" | "unlisted" | "public";
  language?: string;
};

export type VideoScript = {
  id: string;
  /** Defaults to the PascalCase form of `id`. */
  compositionId?: string;
  title: string;
  /** Label in the top-left chip of every scene. */
  brand?: string;
  width: number;
  height: number;
  fps: number;
  scenes: readonly VideoScene[];
  tts?: TtsConfig;
  youtube?: YouTubeMeta;
};

/** Seconds of silence kept after each narration clip. */
export const AUDIO_TAIL_SEC = 0.9;

export const compositionIdOf = (script: VideoScript) =>
  script.compositionId ??
  script.id.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());

export const audioPathOf = (script: VideoScript, scene: VideoScene) =>
  script.tts?.enabled ? `${script.id}/audio/${scene.id}.mp3` : null;

export const sceneFrames = (
  script: VideoScript,
  scene: VideoScene,
  audioSec?: number,
) =>
  Math.ceil(
    Math.max(scene.durationSec, audioSec ? audioSec + AUDIO_TAIL_SEC : 0) *
      script.fps,
  );
