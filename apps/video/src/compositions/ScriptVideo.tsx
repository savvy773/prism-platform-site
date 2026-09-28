import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SceneShell } from "../components/SceneShell";
import type { VideoScript } from "../data/video-script";
import { LandingScene } from "../scenes/LandingScenes";

export const ScriptVideo = ({ script }: { script: VideoScript }) => {
  let cursor = 0;
  return (
    <AbsoluteFill>
      {script.scenes.map((scene, index) => {
        const from = cursor;
        const durationInFrames = Math.round(scene.durationSec * script.fps);
        const audioPath =
          scene.audioFile ??
          (script.tts?.enabled ? `${script.id}/audio/${scene.id}.mp3` : null);
        cursor += durationInFrames;
        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={durationInFrames}
          >
            <SceneShell
              scene={scene}
              index={index}
              durationFrames={durationInFrames}
            >
              <LandingScene scene={scene} />
            </SceneShell>
            {audioPath && <Audio src={staticFile(audioPath)} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
