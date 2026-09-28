# Decisions

- Keep the public introduction page static so GitHub Pages can serve it directly.
- Treat `apps/video` as a factory: one self-contained folder per video, auto-discovered, with generated audio and output Git-ignored so deletion leaves nothing behind.
- Keep Remotion. It is the most mature code-first renderer (React, deterministic frames, parallel rendering, Studio preview). Motion Canvas and Revideo have smaller ecosystems, and ffmpeg-only pipelines cannot express these layouts.
- One visual style, flat 2D illustration in SVG and React, so every script yields a video of the same quality. New needs become shared layouts, not per-video components.
- Scene length follows measured narration; `durationSec` is only a minimum.
- Gemini TTS for natural Korean; Edge TTS only on explicit request, never as a silent fallback; cache by content hash so only changed scenes are billed.
- 1080p at 30 fps: sharp on YouTube, half the render cost of 60 fps.
- The 52-second English landing video was retired in favor of the Korean illustrated video.
- Focus now: internal promotional videos for YouTube. Folder layout (scenario folders, possibly a separate factory repo) and a signature main character come later; see "앞으로의 방향" in VIDEO_WORKFLOW.md.
- Sound effects are synthesized in code (no third-party samples) so they are license-free and reproducible.
- Gemini `gemini-3.8-flash-lite-tts` is the default voice model, with `gemini-3.8-flash-tts` as the quota fallback.
