export type VideoSceneType =
  | "character"
  | "title"
  | "dashboard"
  | "diagram"
  | "code"
  | "outro";

export type VideoScene = {
  id: string;
  type: VideoSceneType;
  durationSec: number;
  title: string;
  subtitle: string;
  narration: string;
  items?: readonly string[];
  code?: string;
  audioFile?: string;
  visualVariant?: "workspace" | "erp" | "flow" | "report";
  onScreenText?: readonly string[];
  visualDirection?: string;
  animationNotes?: string;
};

export type VideoScript = {
  id: string;
  compositionId: string;
  title: string;
  width: number;
  height: number;
  fps: number;
  scenes: readonly VideoScene[];
  tts?: { enabled: boolean; voice: string; rate: string };
  format?: string;
  totalDurationApproxSec?: number;
  voiceStyle?: object;
  character?: object;
};

export const durationFrames = (script: VideoScript) =>
  script.scenes.reduce(
    (sum, scene) => sum + Math.round(scene.durationSec * script.fps),
    0,
  );
