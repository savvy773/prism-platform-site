# Decisions

- Keep the public introduction page static so GitHub Pages can serve it directly.
- Keep videos in `apps/video` and each script in a separate project folder so videos can be added or removed independently.
- Use SVG and React for the mascot and interface illustrations; no external image service is needed to render them.
- Use deterministic Remotion frame-based animation. Keep narration in scene data and generate optional MP3 audio per scene with a consistent TTS voice.
- Keep the 52-second landing intro distinct from the roughly two-minute default for future YouTube videos.
