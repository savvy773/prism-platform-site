# PRISM page repository instructions

## Boundaries

- Public GitHub Pages site: keep the root page static and free of private code, credentials, and real business data.
- `apps/video` is an independent video factory. Do not touch the separate WEB, ERP, or Auth applications from here.
- Illustrated dashboards are labeled `예시 화면`; screenshots must show example data only. No invented metrics, internal hostnames, emails, or real business figures.
- Guides and decisions go in `docs/`; keep the root README short.

## Video factory

- Current focus: internal promotional videos for YouTube. Scenario-folder restructuring and a signature main character are planned later (`docs/VIDEO_WORKFLOW.md`, 앞으로의 방향); until then use the generic Prism Guide and coworker.
- Content about the product may come from the private PRISM repository docs. Carry over feature descriptions only: no hostnames, ports, emails, vendor contracts, sample business data, or code.

- One folder per video: `apps/video/projects/<video-id>/script.ts` is the only hand-written file. `audio/` (narration + manifest) is committed so every machine reuses the same voice without re-billing; `output/` is Git-ignored. Deleting the folder (`just video remove <id>`) leaves nothing behind. Projects are discovered automatically; there is no registry to edit.
- Start from `apps/video/templates/script.ts` (`just video new <id>`). Scripts import only types (`import type`), because the CLI loads them directly with Node.
- Videos are Korean by default: Korean narration, on-screen text, and YouTube metadata.
- Each scene holds its ID, type, `visualVariant`, title, subtitle, narration, and `items`/`pairs`. Narration, labels, and module names live in scripts, never in components. `durationSec` is a minimum; scene length follows the measured narration.
- Shared visuals live in `apps/video/src/illustrated/` (flat 2D style, Prism Guide mascot and coworker character). Add a new layout there when a script needs one instead of special-casing a single video. Keep characters present in most scenes.
- Motion must be deterministic: `Sequence`, `interpolate`, `spring`, `useCurrentFrame`. No CSS keyframes or timers.
- Default format is 1920×1080, 30 fps. Long videos (10–30 min) are fine; mark sections with `chapter` so YouTube chapters are generated.
- TTS: Gemini `gemini-3.8-flash-lite-tts` by default, switching to `gemini-3.8-flash-tts` when its quota runs out. Without `GEMINI_API_KEY` the CLI stops; Edge TTS runs only with an explicit `--provider=edge`. Only changed scenes are regenerated.
- Secrets: `GEMINI_API_KEY` in `apps/video/.env` (Git-ignored; template `.env.example`); YouTube OAuth files in `~/.config/prism-video/`. Never commit either.
- Sound effects are synthesized by `scripts/make-sfx.mjs` into `src/illustrated/sfx/`; layouts trigger them through `<Sfx>`.
- Real app screenshots may appear (`screenshot` variant, file in the project's `assets/`) only when they show example data; they carry the `실제 화면 · 예시 데이터` badge.
- Upload with `just video upload <id>`; the default privacy is `private`. Do not upload or publish unless the user asks.

## Commands and validation

- `just video` opens Studio. `just video <command> <id...|--all>` runs the factory (`list`, `new`, `tts`, `make`, `render`, `preview`, `still`, `site`, `upload`, `publish`, `clean`, `remove`). `just video check` runs typecheck, lint, and composition loading.
- Before reporting video work complete: `just video check`, a `preview` render, and a look at stills of the changed layouts for layout and Korean legibility.
- `just com` / `just push` commit and push; do not run them merely to validate.
