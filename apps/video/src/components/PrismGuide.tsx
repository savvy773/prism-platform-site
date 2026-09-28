import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type PrismGuideProps = { size?: number; still?: boolean; tilt?: number };

export const PrismGuide = ({
  size = 220,
  still = false,
  tilt = 0,
}: PrismGuideProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const bob = still ? 0 : Math.sin(frame / 18) * 8;
  const rotate = still ? 0 : Math.sin(frame / 28) * 2;

  return (
    <div
      style={{
        width: size,
        height: size * 1.13,
        transform: `translateY(${bob + (1 - appear) * 34}px) rotate(${tilt + rotate}deg) scale(${0.82 + appear * 0.18})`,
        opacity: appear,
        filter: "drop-shadow(0 30px 28px #040b18a8)",
      }}
    >
      <svg
        viewBox="0 0 240 272"
        width="100%"
        height="100%"
        role="img"
        aria-label="Prism Guide mascot"
      >
        <defs>
          <linearGradient id="guide-front" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b7f5e8" />
            <stop offset="0.5" stopColor="#70d9ce" />
            <stop offset="1" stopColor="#3b83a8" />
          </linearGradient>
          <linearGradient id="guide-side" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#64bdd1" />
            <stop offset="1" stopColor="#526ba1" />
          </linearGradient>
          <linearGradient id="guide-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e0fff1" />
            <stop offset="1" stopColor="#88e4d6" />
          </linearGradient>
        </defs>
        <ellipse
          cx="120"
          cy="256"
          rx="58"
          ry="9"
          fill="#56b9c7"
          opacity="0.25"
        />
        <path
          d="M54 118 C30 111 26 142 44 152"
          fill="none"
          stroke="#8ddbd1"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="43" cy="151" r="9" fill="#b6f2e4" />
        <path
          d="M188 118 C210 106 219 129 207 143"
          fill="none"
          stroke="#83cddd"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="207" cy="143" r="9" fill="#b6f2e4" />
        <path
          d="M85 209 L78 226"
          stroke="#74c7cf"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M156 209 L162 226"
          stroke="#74c7cf"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M120 17 L195 72 L184 190 L120 226 L55 190 L45 72 Z"
          fill="url(#guide-side)"
          stroke="#b5f7e8"
          strokeWidth="3"
        />
        <path d="M120 17 L195 72 L120 96 L45 72 Z" fill="url(#guide-top)" />
        <path d="M45 72 L120 96 L120 226 L55 190 Z" fill="url(#guide-front)" />
        <path d="M120 96 L195 72 L184 190 L120 226 Z" fill="url(#guide-side)" />
        <path
          d="M67 93 L120 110 L120 206 L70 179 Z"
          fill="#e5fff1"
          opacity="0.13"
        />
        <ellipse cx="91" cy="143" rx="7" ry="10" fill="#17364d" />
        <ellipse cx="147" cy="143" rx="7" ry="10" fill="#17364d" />
        <circle cx="94" cy="140" r="2" fill="#ffffff" />
        <circle cx="150" cy="140" r="2" fill="#ffffff" />
        <path
          d="M108 170 Q120 180 132 170"
          fill="none"
          stroke="#194b5a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="66" cy="161" r="7" fill="#f4a88a" opacity="0.6" />
        <circle cx="174" cy="161" r="7" fill="#f4a88a" opacity="0.5" />
      </svg>
    </div>
  );
};
