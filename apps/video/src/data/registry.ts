import type { VideoScript } from "./video-script";

// Every projects/<video-id>/script.ts is registered automatically, so adding
// or deleting a project folder is the only step needed to add or remove a video.
const context = require.context(
  "../../projects",
  true,
  /^\.\/[^/]+\/script\.ts$/,
);

export const videoProjects: VideoScript[] = context
  .keys()
  .map((key) => (context(key) as { videoScript: VideoScript }).videoScript)
  .sort((a, b) => a.id.localeCompare(b.id));
