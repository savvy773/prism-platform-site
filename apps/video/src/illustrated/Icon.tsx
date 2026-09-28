import type { ReactNode } from "react";
import { ink, toon } from "./theme";

export const iconNames = [
  "doc",
  "folder",
  "chart",
  "calendar",
  "chat",
  "bell",
  "box",
  "cart",
  "truck",
  "gear",
  "people",
  "search",
  "check",
  "clock",
  "link",
  "star",
  "tab",
  "sheet",
  "board",
  "home",
] as const;

export type IconName = (typeof iconNames)[number];

const stroke = {
  stroke: ink,
  strokeWidth: 4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const shapes: Record<IconName, (fill: string) => ReactNode> = {
  doc: (fill) => (
    <>
      <path d="M16 6 H40 L50 16 V58 H16 Z" fill={fill} {...stroke} />
      <path d="M40 6 V16 H50" fill={toon.white} {...stroke} />
      <path d="M23 28 H43 M23 37 H43 M23 46 H35" {...stroke} />
    </>
  ),
  folder: (fill) => (
    <>
      <path d="M6 16 H26 L31 22 H58 V52 H6 Z" fill={fill} {...stroke} />
      <path d="M6 28 H58" {...stroke} />
    </>
  ),
  chart: (fill) => (
    <>
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="8"
        fill={toon.white}
        {...stroke}
      />
      <rect x="15" y="34" width="8" height="16" fill={fill} {...stroke} />
      <rect x="28" y="24" width="8" height="26" fill={fill} {...stroke} />
      <rect x="41" y="15" width="8" height="35" fill={fill} {...stroke} />
    </>
  ),
  calendar: (fill) => (
    <>
      <rect
        x="7"
        y="12"
        width="50"
        height="45"
        rx="7"
        fill={toon.white}
        {...stroke}
      />
      <path d="M7 24 H57" {...stroke} />
      <rect
        x="7"
        y="12"
        width="50"
        height="12"
        rx="6"
        fill={fill}
        {...stroke}
      />
      <path d="M20 6 V16 M44 6 V16" {...stroke} />
      <circle cx="22" cy="37" r="3" fill={ink} />
      <circle cx="32" cy="37" r="3" fill={ink} />
      <circle cx="42" cy="47" r="3" fill={ink} />
    </>
  ),
  chat: (fill) => (
    <>
      <path d="M8 12 H56 V44 H28 L16 55 V44 H8 Z" fill={fill} {...stroke} />
      <circle cx="22" cy="28" r="3" fill={ink} />
      <circle cx="32" cy="28" r="3" fill={ink} />
      <circle cx="42" cy="28" r="3" fill={ink} />
    </>
  ),
  bell: (fill) => (
    <>
      <path
        d="M14 46 C18 40 16 30 18 24 C20 15 26 11 32 11 C38 11 44 15 46 24 C48 30 46 40 50 46 Z"
        fill={fill}
        {...stroke}
      />
      <path d="M26 52 C28 57 36 57 38 52" {...stroke} fill="none" />
    </>
  ),
  box: (fill) => (
    <>
      <path d="M8 20 L32 8 L56 20 V46 L32 58 L8 46 Z" fill={fill} {...stroke} />
      <path d="M8 20 L32 32 L56 20 M32 32 V58" {...stroke} fill="none" />
    </>
  ),
  cart: (fill) => (
    <>
      <path d="M4 10 H13 L19 42 H50 L56 20 H16" fill="none" {...stroke} />
      <path d="M17 20 H55 L50 42 H20 Z" fill={fill} {...stroke} />
      <circle cx="24" cy="52" r="5" fill={toon.white} {...stroke} />
      <circle cx="46" cy="52" r="5" fill={toon.white} {...stroke} />
    </>
  ),
  truck: (fill) => (
    <>
      <rect
        x="4"
        y="16"
        width="34"
        height="28"
        rx="3"
        fill={fill}
        {...stroke}
      />
      <path d="M38 24 H50 L58 34 V44 H38 Z" fill={toon.white} {...stroke} />
      <circle cx="16" cy="48" r="6" fill={toon.white} {...stroke} />
      <circle cx="47" cy="48" r="6" fill={toon.white} {...stroke} />
    </>
  ),
  gear: (fill) => (
    <>
      <path
        d="M28 4 H36 L38 12 L45 15 L52 10 L57 16 L52 23 L55 30 L62 32 V40 L55 42 L52 49 L57 56 L51 61 L44 56 L37 59 L35 64 H28 L26 57 L19 54 L12 59 L7 53 L12 46 L9 39 L2 37 V29 L9 27 L12 20 L7 13 L13 8 L20 13 L27 10 Z"
        transform="translate(0 -2) scale(0.95)"
        fill={fill}
        {...stroke}
      />
      <circle cx="31" cy="31" r="9" fill={toon.white} {...stroke} />
    </>
  ),
  people: (fill) => (
    <>
      <circle cx="22" cy="20" r="9" fill={toon.white} {...stroke} />
      <circle cx="43" cy="22" r="8" fill={toon.white} {...stroke} />
      <path d="M6 56 C6 40 38 40 38 56 Z" fill={fill} {...stroke} />
      <path d="M34 46 C38 38 58 38 58 54 H40" fill={fill} {...stroke} />
    </>
  ),
  search: (fill) => (
    <>
      <circle cx="27" cy="27" r="17" fill={fill} {...stroke} />
      <path d="M40 40 L56 56" {...stroke} strokeWidth={7} />
    </>
  ),
  check: (fill) => (
    <>
      <circle cx="32" cy="32" r="26" fill={fill} {...stroke} />
      <path d="M19 33 L28 42 L46 23" fill="none" {...stroke} strokeWidth={6} />
    </>
  ),
  clock: (fill) => (
    <>
      <circle cx="32" cy="32" r="26" fill={fill} {...stroke} />
      <path d="M32 16 V32 L43 39" fill="none" {...stroke} />
    </>
  ),
  link: (fill) => (
    <>
      <rect
        x="6"
        y="22"
        width="30"
        height="20"
        rx="10"
        fill={fill}
        {...stroke}
      />
      <rect
        x="28"
        y="22"
        width="30"
        height="20"
        rx="10"
        fill="none"
        {...stroke}
      />
    </>
  ),
  star: (fill) => (
    <path
      d="M32 5 L40 23 L59 25 L45 38 L49 57 L32 47 L15 57 L19 38 L5 25 L24 23 Z"
      fill={fill}
      {...stroke}
    />
  ),
  tab: (fill) => (
    <>
      <path d="M6 20 V14 C6 11 8 9 11 9 H26 L30 20" fill={fill} {...stroke} />
      <rect
        x="6"
        y="20"
        width="52"
        height="36"
        rx="5"
        fill={toon.white}
        {...stroke}
      />
      <path d="M14 32 H48 M14 42 H36" {...stroke} />
    </>
  ),
  sheet: (fill) => (
    <>
      <rect
        x="7"
        y="7"
        width="50"
        height="50"
        rx="6"
        fill={toon.white}
        {...stroke}
      />
      <rect x="7" y="7" width="50" height="13" rx="6" fill={fill} {...stroke} />
      <path d="M7 32 H57 M7 44 H57 M24 20 V57 M40 20 V57" {...stroke} />
    </>
  ),
  board: (fill) => (
    <>
      <rect
        x="5"
        y="8"
        width="54"
        height="48"
        rx="6"
        fill={toon.white}
        {...stroke}
      />
      <rect
        x="11"
        y="15"
        width="12"
        height="16"
        rx="3"
        fill={fill}
        {...stroke}
      />
      <rect
        x="27"
        y="15"
        width="12"
        height="26"
        rx="3"
        fill={fill}
        {...stroke}
      />
      <rect
        x="43"
        y="15"
        width="10"
        height="11"
        rx="3"
        fill={fill}
        {...stroke}
      />
    </>
  ),
  home: (fill) => (
    <>
      <path d="M6 30 L32 8 L58 30" fill="none" {...stroke} />
      <path d="M13 26 V56 H51 V26" fill={fill} {...stroke} />
      <rect
        x="26"
        y="38"
        width="12"
        height="18"
        fill={toon.white}
        {...stroke}
      />
    </>
  ),
};

export const Icon = ({
  name,
  size = 64,
  fill = toon.sun,
}: {
  name: IconName;
  size?: number;
  fill?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    {shapes[name](fill)}
  </svg>
);
