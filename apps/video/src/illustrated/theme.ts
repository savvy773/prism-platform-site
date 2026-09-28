// Bright flat 2D palette for the illustrated style.
export const ink = "#2a2440";

export const toon = {
  paper: "#fff7e8",
  paperDeep: "#ffe9c7",
  ink,
  inkSoft: "#5d5577",
  white: "#ffffff",
  mint: "#5fd3bf",
  mintSoft: "#c9f3ea",
  coral: "#ff8a6b",
  coralSoft: "#ffd9cd",
  sun: "#ffc94d",
  sunSoft: "#fff0c2",
  sky: "#6fb4ff",
  skySoft: "#d6e9ff",
  lilac: "#a98bff",
  lilacSoft: "#e7deff",
  gray: "#b8b3c7",
  graySoft: "#ecebf1",
  outline: 5,
  shadow: `8px 8px 0 ${ink}`,
} as const;

export const accents = [
  { main: toon.mint, soft: toon.mintSoft },
  { main: toon.coral, soft: toon.coralSoft },
  { main: toon.sky, soft: toon.skySoft },
  { main: toon.sun, soft: toon.sunSoft },
  { main: toon.lilac, soft: toon.lilacSoft },
] as const;

export const accentAt = (index: number) => accents[index % accents.length];
