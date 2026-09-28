# Video workflow

## Run and export

```bash
cd apps/video
pnpm install
pnpm dev
pnpm render
pnpm typecheck
pnpm lint
```

From the repository root, the equivalent shortcuts are `just video`, `just video render`, `just video typecheck`, and `just video lint`. `just video render:site` writes a publishable MP4 to root `media/`. The regular MP4 goes to `apps/video/projects/prism-landing-intro/output/`, which Git ignores.

## New video

Create `apps/video/projects/<video-id>/script.ts` and an `output/` folder, reuse shared visuals from `apps/video/src/`, and add the script to `src/data/registry.ts`. Keep every scene's visual type, duration, title, subtitle, narration, and items in the script. Removing the project folder and registry entry removes that video. New YouTube videos start near two minutes; the script may add scenes at either end.

## Narration and TTS

The landing script contains spoken text and an Edge TTS voice setting. Run `just video tts` (or `pnpm tts` in `apps/video`) to generate an MP3 for each scene under its project `audio/` folder. The generator uses `uv tool run --from edge-tts` and needs an internet connection. Remotion serves project assets through its configured public directory and plays each MP3 inside its scene `Sequence`.

Each recording starts with its scene and is trimmed at the scene boundary. Check generated audio lengths against `durationSec` and adjust timing if speech needs more room. A scene may set `audioFile` to override the generated path. Keep credentials and private recordings out of this public repository.
