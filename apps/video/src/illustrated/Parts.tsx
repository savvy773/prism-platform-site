import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "./fonts";
import { Icon } from "./Icon";
import type { Item } from "./items";
import { pop, rise } from "./motion";
import { Sfx, type SfxName } from "./Sfx";
import { accentAt, ink, toon } from "./theme";

/** Outlined card with the hard offset shadow of a sticker. */
export const Sticker = ({
  children,
  delay = 0,
  tilt = 0,
  background = toon.white,
  sound = "pop",
  style,
}: {
  children: ReactNode;
  delay?: number;
  tilt?: number;
  background?: string;
  sound?: SfxName | null;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay);
  return (
    <div
      style={{
        background,
        border: `${toon.outline}px solid ${ink}`,
        borderRadius: 26,
        boxShadow: toon.shadow,
        opacity: Math.min(1, p * 2),
        transform: `scale(${p}) rotate(${tilt * p}deg)`,
        ...style,
      }}
    >
      {sound && <Sfx name={sound} at={delay} />}
      {children}
    </div>
  );
};

/** Icon + label tile used by most layouts. */
export const ItemTile = ({
  item,
  index,
  delay,
  size = "md",
  tilt = 0,
  style,
}: {
  item: Item;
  index: number;
  delay: number;
  size?: "sm" | "md" | "lg";
  tilt?: number;
  style?: CSSProperties;
}) => {
  const accent = accentAt(index);
  const scale = { sm: 0.8, md: 1, lg: 1.3 }[size];
  return (
    <Sticker
      delay={delay}
      tilt={tilt}
      background={accent.soft}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20 * scale,
        padding: `${20 * scale}px ${30 * scale}px`,
        ...style,
      }}
    >
      {item.icon && (
        <Icon name={item.icon} size={70 * scale} fill={accent.main} />
      )}
      <span
        style={{
          fontFamily: fonts.display,
          fontSize: 44 * scale,
          color: ink,
          whiteSpace: "nowrap",
        }}
      >
        {item.label}
      </span>
    </Sticker>
  );
};

/** Big playful headline with a marker-style highlight under the text. */
export const Headline = ({
  title,
  subtitle,
  align = "left",
  size = 96,
  width,
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  size?: number;
  width?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 2);
  const s = rise(frame, fps, 10);
  return (
    <div style={{ width, textAlign: align, wordBreak: "keep-all" }}>
      <div
        style={{
          display: "inline-block",
          position: "relative",
          fontFamily: fonts.display,
          fontSize: size,
          lineHeight: 1.12,
          color: ink,
          transform: `scale(${0.6 + p * 0.4}) rotate(${(1 - p) * -4}deg)`,
          transformOrigin: align === "center" ? "center" : "left center",
          opacity: Math.min(1, p * 2),
        }}
      >
        <span
          style={{
            position: "absolute",
            left: -12,
            right: -12,
            bottom: size * 0.06,
            height: size * 0.34,
            background: toon.sun,
            borderRadius: 14,
            zIndex: -1,
            transform: `scaleX(${s})`,
            transformOrigin: "left",
          }}
        />
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            marginTop: 22,
            fontFamily: fonts.body,
            fontSize: size * 0.4,
            lineHeight: 1.4,
            color: toon.inkSoft,
            opacity: s,
            transform: `translateY(${(1 - s) * 20}px)`,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

export const Bubble = ({
  children,
  delay = 0,
  tail = "left",
  style,
}: {
  children: ReactNode;
  delay?: number;
  tail?: "left" | "right" | "bottom";
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay);
  const tailStyle: CSSProperties =
    tail === "bottom"
      ? { left: 60, bottom: -30, transform: "rotate(45deg)" }
      : tail === "left"
        ? { left: -30, top: 50, transform: "rotate(-45deg)" }
        : { right: -30, top: 50, transform: "rotate(135deg)" };
  return (
    <div
      style={{
        position: "relative",
        wordBreak: "keep-all",
        background: toon.white,
        border: `${toon.outline}px solid ${ink}`,
        borderRadius: 40,
        padding: "34px 44px",
        boxShadow: toon.shadow,
        transform: `scale(${p})`,
        transformOrigin: tail === "right" ? "right center" : "left center",
        opacity: Math.min(1, p * 2),
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          background: toon.white,
          borderLeft: `${toon.outline}px solid ${ink}`,
          borderTop: `${toon.outline}px solid ${ink}`,
          ...tailStyle,
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

/** Small tag that marks a visual as an example, not a real product screen. */
export const ExampleBadge = ({ label = "예시 화면" }: { label?: string }) => (
  <span
    style={{
      padding: "6px 18px",
      borderRadius: 999,
      background: ink,
      color: toon.white,
      fontFamily: fonts.body,
      fontSize: 24,
    }}
  >
    {label}
  </span>
);

/** Chibi office worker (the "김 대리" of the scripts). */
export const Person = ({
  mood = "happy",
  size = 300,
  shirt = toon.sky,
}: {
  mood?: "happy" | "stressed";
  size?: number;
  shirt?: string;
}) => {
  const frame = useCurrentFrame();
  const stressed = mood === "stressed";
  const shake = stressed ? Math.sin(frame / 2.2) * 2.5 : 0;
  const bounce = stressed ? 0 : Math.abs(Math.sin(frame / 11)) * 6;
  const tuft = Math.sin(frame / 6) * 8;
  const blink = !stressed && frame % 90 > 85;
  const eye = (cx: number) =>
    blink ? (
      <path
        d={`M${cx - 8} 110 Q${cx} 104 ${cx + 8} 110`}
        fill="none"
        stroke={ink}
        strokeWidth={4}
        strokeLinecap="round"
      />
    ) : (
      <g>
        <ellipse cx={cx} cy={108} rx={8} ry={10} fill={ink} />
        <circle cx={cx + 3} cy={104} r={3.2} fill={toon.white} />
      </g>
    );
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 200 240"
      aria-hidden="true"
      style={{ transform: `translate(${shake}px, ${-bounce}px)` }}
    >
      <ellipse cx={100} cy={234} rx={48} ry={6} fill={ink} opacity={0.12} />
      {/* small round body */}
      <path
        d="M58 232 C56 196 72 176 100 176 C128 176 144 196 142 232 Z"
        fill={shirt}
        stroke={ink}
        strokeWidth={5}
      />
      <path
        d="M90 176 L100 192 L110 176"
        fill={toon.white}
        stroke={ink}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <rect
        x={96}
        y={190}
        width={8}
        height={24}
        rx={4}
        fill={toon.coral}
        stroke={ink}
        strokeWidth={3}
      />
      {/* big head */}
      <circle
        cx={100}
        cy={100}
        r={70}
        fill="#ffe0c4"
        stroke={ink}
        strokeWidth={5}
      />
      <path
        d="M32 96 C28 44 70 22 104 26 C140 30 172 54 168 98 C156 74 132 60 106 62 C82 64 60 74 48 92 C44 96 38 98 32 96 Z"
        fill={ink}
      />
      <path
        d={`M100 30 Q${108 + tuft} 6 ${122 + tuft} 14`}
        fill="none"
        stroke={ink}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {stressed ? (
        <>
          <path
            d="M66 102 L82 110 L66 118 M134 102 L118 110 L134 118"
            fill="none"
            stroke={ink}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M86 140 Q93 132 100 140 Q107 148 114 140"
            fill="none"
            stroke={ink}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d="M162 70 Q176 88 164 98 Q154 88 162 70 Z"
            fill={toon.sky}
            stroke={ink}
            strokeWidth={3}
          />
          <path
            d="M150 48 Q160 40 170 48 M174 58 Q182 52 190 58"
            fill="none"
            stroke={ink}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {eye(76)}
          {eye(124)}
          <path d="M88 134 Q100 148 112 134 Z" fill={ink} />
          <ellipse
            cx={58}
            cy={128}
            rx={11}
            ry={7}
            fill={toon.coral}
            opacity={0.55}
          />
          <ellipse
            cx={142}
            cy={128}
            rx={11}
            ry={7}
            fill={toon.coral}
            opacity={0.55}
          />
        </>
      )}
    </svg>
  );
};
