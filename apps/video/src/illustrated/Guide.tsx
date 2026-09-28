import { useCurrentFrame, useVideoConfig } from "remotion";
import type { GuideMood } from "../data/video-script";
import { pop } from "./motion";
import { Sfx } from "./Sfx";
import { ink, toon } from "./theme";

// Prism Guide: a chubby rounded gem with big shiny eyes, a star antenna and
// stubby limbs. Same mint/sky palette as the brand prism.

const Eye = ({
  cx,
  mood,
  blink,
  right,
}: {
  cx: number;
  mood: GuideMood;
  blink: boolean;
  right: boolean;
}) => {
  const cy = 150;
  if (blink || (mood === "wink" && right)) {
    return (
      <path
        d={`M${cx - 13} ${cy + 2} Q${cx} ${cy - 10} ${cx + 13} ${cy + 2}`}
        fill="none"
        stroke={ink}
        strokeWidth={6}
        strokeLinecap="round"
      />
    );
  }
  if (mood === "proud") {
    return (
      <path
        d={`M${cx - 14} ${cy + 4} Q${cx} ${cy - 14} ${cx + 14} ${cy + 4}`}
        fill="none"
        stroke={ink}
        strokeWidth={7}
        strokeLinecap="round"
      />
    );
  }
  const big = mood === "surprised" ? 1.18 : 1;
  const look = mood === "thinking" ? -6 : 0;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={15 * big} ry={19 * big} fill={ink} />
      <circle cx={cx + 5} cy={cy - 7 + look} r={6} fill={toon.white} />
      <circle cx={cx - 5} cy={cy + 7 + look} r={2.8} fill={toon.white} />
    </g>
  );
};

const Mouth = ({ mood }: { mood: GuideMood }) => {
  switch (mood) {
    case "surprised":
      return <ellipse cx={120} cy={186} rx={9} ry={11} fill={ink} />;
    case "proud":
      return (
        <g>
          <path d="M102 176 Q120 204 138 176 Z" fill={ink} />
          <path
            d="M110 188 Q120 198 130 188 Q120 184 110 188 Z"
            fill={toon.coral}
          />
        </g>
      );
    case "thinking":
      return (
        <path
          d="M110 184 Q116 179 122 184 Q128 189 134 183"
          fill="none"
          stroke={ink}
          strokeWidth={5}
          strokeLinecap="round"
        />
      );
    default:
      // Little cat-like "w" smile.
      return (
        <path
          d="M106 178 Q113 188 120 179 Q127 188 134 178"
          fill="none"
          stroke={ink}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
  }
};

const Sparkle = ({
  x,
  y,
  size,
  color,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
}) => (
  <path
    d={`M${x} ${y - size} Q${x + size * 0.18} ${y - size * 0.18} ${x + size} ${y} Q${x + size * 0.18} ${y + size * 0.18} ${x} ${y + size} Q${x - size * 0.18} ${y + size * 0.18} ${x - size} ${y} Q${x - size * 0.18} ${y - size * 0.18} ${x} ${y - size} Z`}
    fill={color}
    stroke={ink}
    strokeWidth={3}
    strokeLinejoin="round"
  />
);

export const Guide = ({
  size = 260,
  mood = "happy",
  delay = 0,
  wave = false,
  point = false,
  flip = false,
}: {
  size?: number;
  mood?: GuideMood;
  delay?: number;
  wave?: boolean;
  point?: boolean;
  flip?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = pop(frame, fps, delay);
  const t = frame - delay;
  const hop = Math.abs(Math.sin(t / 10)) * 14;
  const squash = 1 + Math.sin(t / 5) * 0.025;
  const blink = t % 84 > 79;
  const leftArm = wave ? Math.sin(t / 3) * 34 - 20 : Math.sin(t / 12) * 8;
  const rightArm = point ? -70 : Math.sin(t / 12 + 1) * 8;
  const antenna = Math.sin(t / 7) * 10;
  const twinkle = 0.75 + Math.sin(t / 4) * 0.25;

  return (
    <div
      style={{
        width: size,
        height: size * 1.13,
        opacity: Math.min(1, enter * 1.5),
        transform: `translateY(${-hop + (1 - enter) * 80}px) scale(${enter * (flip ? -1 : 1)}, ${enter * squash})`,
        transformOrigin: "50% 100%",
      }}
    >
      {mood === "surprised" && <Sfx name="boop" at={delay + 6} />}
      <svg viewBox="0 0 240 272" width="100%" height="100%" aria-hidden="true">
        <ellipse
          cx={120}
          cy={262}
          rx={60 - hop}
          ry={8}
          fill={ink}
          opacity={0.14}
        />
        {/* feet */}
        <ellipse
          cx={94}
          cy={242}
          rx={20}
          ry={12}
          fill={toon.mint}
          stroke={ink}
          strokeWidth={5}
        />
        <ellipse
          cx={146}
          cy={242}
          rx={20}
          ry={12}
          fill={toon.mint}
          stroke={ink}
          strokeWidth={5}
        />
        {/* antenna */}
        <g transform={`rotate(${antenna} 120 44)`}>
          <path
            d="M120 44 Q116 26 122 12"
            fill="none"
            stroke={ink}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <g
            transform={`translate(122 10) scale(${twinkle}) translate(-122 -10)`}
          >
            <Sparkle x={122} y={10} size={15} color={toon.sun} />
          </g>
        </g>
        {/* stubby arms */}
        <g transform={`rotate(${leftArm} 44 150)`}>
          <ellipse
            cx={26}
            cy={150}
            rx={20}
            ry={15}
            fill={toon.mint}
            stroke={ink}
            strokeWidth={5}
          />
        </g>
        <g transform={`rotate(${rightArm} 196 150)`}>
          <ellipse
            cx={214}
            cy={150}
            rx={20}
            ry={15}
            fill={toon.sky}
            stroke={ink}
            strokeWidth={5}
          />
        </g>
        {/* body: a chubby rounded gem */}
        <path
          d="M120 40 C156 40 198 62 206 100 C214 138 206 180 186 204 C168 226 146 238 120 238 C94 238 72 226 54 204 C34 180 26 138 34 100 C42 62 84 40 120 40 Z"
          fill={toon.mint}
          stroke={ink}
          strokeWidth={6}
        />
        <path
          d="M120 40 C156 40 198 62 206 100 L120 118 L34 100 C42 62 84 40 120 40 Z"
          fill="#b8f5e7"
          stroke={ink}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path
          d="M120 118 L206 100 C214 138 206 180 186 204 C168 226 146 238 120 238 Z"
          fill={toon.sky}
          opacity={0.4}
        />
        <ellipse
          cx={72}
          cy={82}
          rx={16}
          ry={9}
          fill={toon.white}
          opacity={0.75}
          transform="rotate(-24 72 82)"
        />
        <circle cx={96} cy={70} r={4} fill={toon.white} opacity={0.75} />
        {/* face */}
        <ellipse
          cx={66}
          cy={178}
          rx={14}
          ry={9}
          fill={toon.coral}
          opacity={0.6}
        />
        <ellipse
          cx={174}
          cy={178}
          rx={14}
          ry={9}
          fill={toon.coral}
          opacity={0.6}
        />
        <Eye cx={92} mood={mood} blink={blink} right={false} />
        <Eye cx={148} mood={mood} blink={blink} right />
        <Mouth mood={mood} />
        {(mood === "proud" || mood === "wink") && (
          <g opacity={twinkle}>
            <Sparkle x={222} y={60} size={11} color={toon.sun} />
            <Sparkle x={16} y={96} size={8} color={toon.coral} />
          </g>
        )}
      </svg>
    </div>
  );
};
