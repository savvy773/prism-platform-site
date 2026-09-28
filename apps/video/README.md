# PRISM video factory

Script in, video out. From the repo root: `just video make <id>`; here: `node scripts/video.mjs make <id>`.

- Setup: `pnpm install`, then `cp .env.example .env` and set `GEMINI_API_KEY`.
- Studio: `pnpm dev` · checks: `pnpm check` · commands: `node scripts/video.mjs` (no args).
- Guide: [video workflow](../../docs/VIDEO_WORKFLOW.md) · [git sync](../../docs/GIT_SYNC.md)
