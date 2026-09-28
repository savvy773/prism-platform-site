import { Composition } from "remotion";
import { ScriptVideo } from "./compositions/ScriptVideo";
import { videoProjects } from "./data/registry";
import { durationFrames } from "./data/video-script";

export const Root = () => (
  <>
    {videoProjects.map((script) => (
      <Composition
        key={script.id}
        id={script.compositionId}
        component={ScriptVideo}
        defaultProps={{ script }}
        width={script.width}
        height={script.height}
        fps={script.fps}
        durationInFrames={durationFrames(script)}
      />
    ))}
  </>
);
