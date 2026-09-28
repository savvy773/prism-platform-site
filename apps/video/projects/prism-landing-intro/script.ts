import type { VideoScript } from "../../src/data/video-script";

export const prismIntroVideoScript = {
  id: "prism-landing-intro",
  compositionId: "PrismLandingIntro",
  title: "PRISM Intro Video",
  width: 1920,
  height: 1080,
  format: "16:9",
  fps: 30,
  totalDurationApproxSec: 52,
  tts: { enabled: true, voice: "en-US-AndrewMultilingualNeural", rate: "+0%" },
  voiceStyle: {
    tone: "modern, confident, friendly, slightly witty",
    pace: "clear and energetic",
    accent: "neutral international English",
    avoid: ["overly dramatic", "cartoony", "salesy hype"],
  },
  character: {
    name: "Prism Guide",
    concept:
      "A small floating prism-shaped assistant mascot with a soft geometric body, expressive eyes, subtle glow, and minimal limbs. Friendly, clever, modern, and helpful.",
    personality: [
      "smart",
      "calm",
      "helpful",
      "lightly playful",
      "not childish",
    ],
  },
  scenes: [
    {
      id: "hook-chaos",
      type: "character",
      durationSec: 6,
      title: "Too many tools.",
      subtitle: "Too many tabs. Too much chasing updates.",
      items: [
        "Spreadsheets",
        "Documents",
        "Messages",
        "Notifications",
        "Browser tabs",
      ],
      onScreenText: [
        "Too many tools.",
        "Too many tabs.",
        "Too much chasing updates.",
      ],
      narration:
        "Too many tools. Too many tabs. Too much time spent chasing updates.",
      visualDirection:
        "Show a cluttered floating interface of disconnected tools, notifications, spreadsheets, chat bubbles, and browser tabs. The Prism Guide appears, looks around knowingly, and snaps the chaos into order.",
      animationNotes:
        "Start with messy floating cards. Slight jitter. Then smooth cleanup transition as the mascot gestures and elements align.",
    },
    {
      id: "introduce-prism",
      type: "title",
      durationSec: 6,
      title: "PRISM",
      subtitle: "One connected platform for internal work.",
      onScreenText: ["Meet PRISM", "One connected platform for internal work"],
      narration:
        "Meet PRISM — one connected platform for the way your team actually works.",
      visualDirection:
        "Reveal PRISM logo/title with the character floating beside it. Background becomes clean and premium with subtle gradient and depth.",
      animationNotes:
        "Bold title build-in, elegant scale/fade, soft glow line behind character.",
    },
    {
      id: "workspace-overview",
      type: "dashboard",
      durationSec: 8,
      title: "Workspace",
      subtitle: "The work your team shares, in one place.",
      visualVariant: "workspace",
      items: ["Documents", "Weekly Reports", "Projects", "Team Schedule"],
      onScreenText: [
        "Workspace",
        "Docs · Weekly Reports · Projects · Schedules",
      ],
      narration:
        "Workspace brings documents, weekly reports, projects, and schedules into one place.",
      visualDirection:
        "Animate a clean workspace UI: document hub, weekly report cards, team schedule calendar, project board. Character points to each area.",
      animationNotes:
        "Use card-by-card reveal. Add subtle emphasis rings around active modules.",
    },
    {
      id: "erp-overview",
      type: "dashboard",
      durationSec: 8,
      title: "ERP",
      subtitle: "A clearer view of daily operations.",
      visualVariant: "erp",
      items: [
        "Sales",
        "Purchasing",
        "Inventory",
        "Production",
        "HR",
        "Reports",
      ],
      onScreenText: ["ERP", "Sales · Purchasing · Inventory · Production · HR"],
      narration:
        "ERP connects the operational side — sales, purchasing, inventory, production, HR, and reporting.",
      visualDirection:
        "Show a modular ERP dashboard with metrics, tables, inventory blocks, purchase flow, production status, and HR summary widgets.",
      animationNotes:
        "Smooth horizontal camera movement across ERP modules, with animated counters and chart highlights.",
    },
    {
      id: "connected-flow",
      type: "diagram",
      durationSec: 9,
      title: "Connected by design",
      subtitle: "People → Work → Data → Decisions",
      visualVariant: "flow",
      items: [
        "People",
        "Workspace",
        "ERP",
        "Shared data",
        "Reports & decisions",
      ],
      onScreenText: ["Connected by design", "People → Work → Data → Decisions"],
      narration:
        "The real value is connection. People, work, data, and decisions flowing through one system.",
      visualDirection:
        "Build a clean animated system diagram. Show employees, workspace, ERP, shared database, and reporting layer connected with flowing lines and arrows. The character travels along the flow path.",
      animationNotes:
        "Animate boxes in sequence, then arrows, then pulsing data particles moving along paths.",
    },
    {
      id: "visibility-reporting",
      type: "diagram",
      durationSec: 7,
      title: "More visibility.",
      subtitle: "Less guessing.",
      visualVariant: "report",
      items: ["Weekly status", "Project progress", "Operations", "Team view"],
      onScreenText: ["More visibility", "Less guessing"],
      narration:
        "Clearer reporting, easier collaboration, and a lot less guessing.",
      visualDirection:
        "Transition into charts, status boards, weekly summaries, and a management overview screen. Character gives a small approving gesture.",
      animationNotes:
        "Use graph rise animation, status chips, and a dashboard zoom-out into a cohesive control center.",
    },
    {
      id: "closing",
      type: "outro",
      durationSec: 8,
      title: "PRISM",
      subtitle: "Less chaos. More clarity.",
      items: ["Workspace + ERP, together."],
      onScreenText: [
        "PRISM",
        "Less chaos. More clarity.",
        "Workspace + ERP, together.",
      ],
      narration:
        "PRISM brings scattered work into one clear system. Less chaos. More clarity.",
      visualDirection:
        "Return to a clean hero composition with the character mascot, PRISM title, and subtle background diagram lines. End in a polished landing-page style frame.",
      animationNotes:
        "Elegant settle animation. Keep final frame stable for a moment so it works well as a hero video ending.",
    },
  ],
} satisfies VideoScript;

export const videoScript: VideoScript = prismIntroVideoScript;
