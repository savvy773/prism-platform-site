---
name: make-video
description: Turn a raw script, outline, or topic into a finished video with the apps/video factory (Korean narration, 2D illustrated scenes, captions, chapters) and optionally upload it to YouTube. Use when the user gives a script or asks to make, lengthen, remake, or upload a video.
---

# Make a video from a script

1. Pick a kebab-case ID. Run `just video new <id>` (or edit the existing project when remaking).
2. Convert the user's text into `apps/video/projects/<id>/script.ts`:
   - Korean narration written for the ear: short sentences, friendly, a little playful. Keep the user's facts; never invent metrics, customers, or dates.
   - One idea per scene, roughly 8–15 s of speech (about 50–90 Korean syllables). Mix layouts so no two neighbouring scenes share one, and keep the Prism Guide or coworker on screen in most scenes.
   - Layouts and icons are listed at the top of `apps/video/templates/script.ts`. Put labels in `items`/`pairs`, not in narration only.
   - Mark sections with `chapter` (the first scene too). For 10–30 minute videos, split scenes into `part-N.ts` files in the same folder and import them with `.ts` extensions.
   - Real screenshots: copy them into the project's `assets/` and use `type: "dashboard", visualVariant: "screenshot", image: "assets/<file>.png"`. Only captures that show example data.
   - Fill `youtube` (title, description, tags, `privacy: "private"`).
   - Length target: ~12 scenes ≈ 3 min. To lengthen, add scenes (examples, a recap, a day-in-the-life timeline) rather than padding sentences.
3. `just video check`, then `just video tts <id>` (Gemini Flash Lite, Flash on quota exhaustion; key in `apps/video/.env`) and read the estimated length. Gemini speaks about 8 Korean characters per second; trim or add scenes if the total misses the target.
4. Render stills of each distinct layout (`just video still <id> --frame=N`) and look at them: no clipped text, no overlap with captions, Korean renders.
5. `just video make <id>`. Report the output path and length.
6. Upload only when the user asks: `just video upload <id>` (private by default). If `~/.config/prism-video/client_secret.json` or the token is missing, tell the user to follow the secrets section of `docs/VIDEO_WORKFLOW.md` and run `! just video auth`.

For several scripts, create each project, then `just video make <id1> <id2> ...` or `--all`.
