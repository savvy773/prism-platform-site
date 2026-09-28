# PRISM page repository instructions

## Boundaries

- This repository is a public GitHub Pages introduction site. Keep the root page static and free of private code, credentials, and real business data.
- `apps/video` is an independent Remotion app. Do not change the separate WEB, ERP, or Auth applications while working here.
- Preview dashboards are illustrative. Label them as examples rather than product screenshots.
- Put guides and implementation decisions in `docs/`; keep the root README short.

## Video projects

- Put each video's script and project-specific assets under `apps/video/projects/<video-id>/`. Keep generated MP4s and stills in that project's `output/`, which Git ignores. To remove a video, delete its project folder and its entry in `apps/video/src/data/registry.ts`.
- Shared mascot, diagrams, dashboard visuals, animation utilities, and theme belong in `apps/video/src/`.
- Each scene stores its ID, visual type, duration, title, subtitle, narration, and content items in the project script. Do not embed narration or module names in React scene components.
- Support title, character, dashboard, diagram, code, and outro scene types. Prefer `Sequence`, `interpolate`, `spring`, and `useCurrentFrame`; animations must be deterministic. Do not use CSS keyframes or timers for video motion.
- The current `prism-landing-intro` has an explicit 52-second brief at 1920×1080 and 30 fps. For new YouTube videos, plan about two minutes by default; the script may add opening or closing scenes. Derive composition length from scene durations.
- Narration text is required even without a voice recording. `just video tts` generates per-scene MP3s in the same project folder; `audioFile` can override a generated path.
- Keep generated video files out of Git unless a site-facing export is deliberately placed in root `media/`.

## Commands and validation

- `just video` starts Studio; `just video render` exports MP4. `just video typecheck` and `just video lint` validate the app.
- Before reporting video work complete, run typecheck, lint, composition loading, Studio startup, and a short MP4 render. Inspect at least one rendered frame for layout and legibility.
- `just com` stages all changes and creates a commit message; `just push` runs that commit step and pushes. Do not run either merely to validate a change.
