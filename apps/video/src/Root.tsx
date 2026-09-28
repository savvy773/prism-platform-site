import {
  type CalculateMetadataFunction,
  Composition,
  staticFile,
} from "remotion";
import { ScriptVideo, type ScriptVideoProps } from "./compositions/ScriptVideo";
import type { AudioManifest } from "./data/captions";
import { videoProjects } from "./data/registry";
import { compositionIdOf, sceneFrames } from "./data/video-script";

// Scene lengths follow the narration measured by `video tts`, so a script
// never needs hand-tuned timings. Without audio, durationSec is used as is.
const fitToAudio: CalculateMetadataFunction<ScriptVideoProps> = async ({
  props,
}) => {
  const { script } = props;
  const manifest: AudioManifest | null = script.tts?.enabled
    ? await fetch(staticFile(`${script.id}/audio/manifest.json`))
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null)
    : null;
  const speechSec = script.scenes.map(
    (scene) => manifest?.scenes[scene.id]?.durationSec ?? 0,
  );
  const frames = script.scenes.map((scene, index) =>
    sceneFrames(script, scene, speechSec[index]),
  );
  return {
    durationInFrames: frames.reduce((sum, value) => sum + value, 0),
    props: { ...props, sceneFrames: frames, speechSec },
  };
};

export const Root = () => (
  <>
    {videoProjects.map((script) => (
      <Composition
        key={script.id}
        id={compositionIdOf(script)}
        component={ScriptVideo}
        defaultProps={{ script }}
        calculateMetadata={fitToAudio}
        width={script.width}
        height={script.height}
        fps={script.fps}
        durationInFrames={1}
      />
    ))}
  </>
);
