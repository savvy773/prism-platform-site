import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import {
  audioPathOf,
  sceneFrames as fallbackFrames,
  type VideoScript,
} from "../data/video-script";
import { IllustratedScene } from "../illustrated/IllustratedScene";
import { IllustratedShell } from "../illustrated/IllustratedShell";

export type ScriptVideoProps = {
  script: VideoScript;
  sceneFrames?: number[];
  speechSec?: number[];
};

export const ScriptVideo = ({
  script,
  sceneFrames,
  speechSec,
}: ScriptVideoProps) => {
  let cursor = 0;
  return (
    <AbsoluteFill>
      {script.scenes.map((scene, index) => {
        const from = cursor;
        const durationInFrames =
          sceneFrames?.[index] ?? fallbackFrames(script, scene);
        const audioPath = audioPathOf(script, scene);
        cursor += durationInFrames;
        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={durationInFrames}
          >
            <IllustratedShell
              scene={scene}
              index={index}
              total={script.scenes.length}
              durationFrames={durationInFrames}
              speechSec={speechSec?.[index] ?? 0}
              brand={script.brand ?? "PRISM"}
            >
              <IllustratedScene
                scene={scene}
                brand={script.brand ?? "PRISM"}
                projectId={script.id}
                durationFrames={durationInFrames}
              />
            </IllustratedShell>
            {audioPath && speechSec?.[index] ? (
              <Audio src={staticFile(audioPath)} />
            ) : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
