import type { VideoScript } from "../../src/data/video-script";

// Scene types and variants:
//   title | outro                         big headline, guide, confetti
//   character   (default)                 guide + speech bubble + chips
//   character   visualVariant "chaos"     stressed coworker + flying stickers
//   dashboard   "workspace" | "erp" | "report"   example app window
//   diagram     "flow" | "hub" | "cards" | "compare" | "checklist" | "timeline"
//   dashboard   "screenshot" + image: "assets/<file>.png" (real UI, example data only)
// items: "icon:label" (icons: doc folder chart calendar chat bell box cart truck
//   gear people search check clock link star tab sheet board home).
// timeline items: "09:00 label". compare uses `pairs`.
// Scene length follows the narration automatically; durationSec is a minimum.
export const videoScript = {
  id: "__VIDEO_ID__",
  title: "__VIDEO_ID__",
  brand: "PRISM",
  width: 1920,
  height: 1080,
  fps: 30,
  tts: {
    enabled: true,
    provider: "gemini",
    model: "gemini-3.8-flash-lite-tts", // falls back to gemini-3.8-flash-tts
    voice: "Kore",
    style: "밝고 경쾌한 한국어 유튜브 진행자, 또렷하고 친근하게",
    fallbackVoice: "ko-KR-SunHiNeural",
    rate: "+15%",
    lexicon: { PRISM: "프리즘", ERP: "이알피" },
  },
  youtube: {
    title: "제목",
    description: "설명",
    tags: [],
    privacy: "private",
    language: "ko",
  },
  scenes: [
    {
      id: "hello",
      type: "character",
      chapter: "인트로",
      durationSec: 4,
      title: "안녕하세요!",
      subtitle: "한 줄 소개",
      narration: "안녕하세요! 내레이션을 여기에 적어 주세요.",
    },
    {
      id: "bye",
      type: "outro",
      durationSec: 5,
      title: "고마워요!",
      subtitle: "마무리 한 줄",
      narration: "시청해 주셔서 고마워요.",
    },
  ],
} satisfies VideoScript;
