import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoScene } from "../data/video-script";
import { fonts } from "./fonts";
import { Guide } from "./Guide";
import { Icon } from "./Icon";
import { type Item, parseItem } from "./items";
import { clamp01, pop, rise, staggerAt, wobble } from "./motion";
import {
  Bubble,
  ExampleBadge,
  Headline,
  ItemTile,
  Person,
  Sticker,
} from "./Parts";
import { Sfx } from "./Sfx";
import { accentAt, ink, toon } from "./theme";

type LayoutProps = {
  scene: VideoScene;
  brand: string;
  projectId: string;
  items: Item[];
  durationFrames: number;
};

const Place = ({
  x,
  y,
  children,
  center = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  center?: boolean;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: center ? "translate(-50%, -50%)" : undefined,
    }}
  >
    {children}
  </div>
);

const Confetti = ({
  count = 26,
  delay = 0,
}: {
  count?: number;
  delay?: number;
}) => {
  const frame = useCurrentFrame() - delay;
  if (frame < 0) return null;
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const x = (index * 373) % 1920;
        const speed = 5 + (index % 5);
        const y = -60 + ((frame * speed + index * 97) % 1200);
        const accent = accentAt(index);
        return (
          <div
            key={x}
            style={{
              position: "absolute",
              left: x + Math.sin((frame + index * 11) / 14) * 30,
              top: y,
              width: index % 3 ? 22 : 16,
              height: index % 3 ? 12 : 16,
              borderRadius: index % 3 ? 3 : 999,
              background: accent.main,
              border: `3px solid ${ink}`,
              transform: `rotate(${frame * (4 + (index % 4)) + index * 40}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- title / outro

const TitleLayout = ({ scene, items, durationFrames }: LayoutProps) => {
  const outro = scene.type === "outro";
  return (
    <>
      <Confetti delay={outro ? 20 : 6} count={outro ? 30 : 22} />
      <Sfx name="tada" at={outro ? 18 : 4} />
      <Place x={960} y={outro ? 380 : 420} center>
        <Headline
          title={scene.title}
          subtitle={scene.subtitle}
          align="center"
          width={1200}
          size={outro ? 120 : 180}
        />
      </Place>
      <Place x={outro ? 110 : 90} y={outro ? 560 : 540}>
        <Guide
          size={outro ? 300 : 320}
          mood={scene.mood ?? (outro ? "wink" : "happy")}
          wave
          delay={8}
        />
      </Place>
      {items.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: outro ? 640 : 700,
            display: "flex",
            justifyContent: "center",
            gap: 30,
          }}
        >
          {items.map((item, index) => (
            <ItemTile
              key={item.label}
              item={item}
              index={index}
              size="sm"
              delay={staggerAt(index, items.length, durationFrames, 24, 0.4)}
            />
          ))}
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- character

const chaosSpots = [
  { x: 900, y: 200, tilt: -6 },
  { x: 1330, y: 170, tilt: 6 },
  { x: 1010, y: 390, tilt: 4 },
  { x: 1380, y: 460, tilt: -5 },
  { x: 880, y: 600, tilt: 7 },
  { x: 1300, y: 700, tilt: -4 },
];

const ChaosLayout = ({ scene, items, durationFrames }: LayoutProps) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Place x={110} y={150}>
        <Headline
          title={scene.title}
          subtitle={scene.subtitle}
          size={84}
          width={760}
        />
      </Place>
      <Place x={250} y={470}>
        <Person mood="stressed" size={330} />
      </Place>
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 820,
          width: 520,
          height: 40,
          borderRadius: 12,
          background: toon.paperDeep,
          border: `${toon.outline}px solid ${ink}`,
        }}
      />
      {items.map((item, index) => {
        const spot = chaosSpots[index % chaosSpots.length];
        const shake = wobble(frame, index, 6);
        return (
          <Place key={item.label} x={spot.x} y={spot.y + shake}>
            <ItemTile
              item={item}
              index={index}
              tilt={spot.tilt + wobble(frame, index + 3, 3)}
              delay={staggerAt(index, items.length, durationFrames, 10, 0.5)}
            />
          </Place>
        );
      })}
    </>
  );
};

const TalkLayout = ({ scene, items, durationFrames }: LayoutProps) => (
  <>
    <Place x={170} y={300}>
      <Guide size={400} mood={scene.mood ?? "happy"} wave delay={0} />
    </Place>
    <Place x={700} y={230}>
      <Bubble delay={10} style={{ maxWidth: 1050 }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 88,
            color: ink,
            lineHeight: 1.15,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: fonts.body,
            fontSize: 40,
            color: toon.inkSoft,
          }}
        >
          {scene.subtitle}
        </div>
      </Bubble>
    </Place>
    <div
      style={{
        position: "absolute",
        left: 700,
        top: 620,
        display: "flex",
        gap: 26,
        flexWrap: "wrap",
        width: 1100,
      }}
    >
      {items.map((item, index) => (
        <ItemTile
          key={item.label}
          item={item}
          index={index}
          size="sm"
          delay={staggerAt(index, items.length, durationFrames, 30, 0.5)}
        />
      ))}
    </div>
  </>
);

// ---------------------------------------------------------------- dashboard

const MiniBars = ({ delay }: { delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heights = [0.45, 0.7, 0.55, 0.9, 0.75, 1];
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 150 }}
    >
      {heights.map((h, index) => (
        <div
          key={h}
          style={{
            width: 46,
            height: 150 * h * rise(frame, fps, delay + index * 4),
            background: accentAt(index).main,
            border: `4px solid ${ink}`,
            borderRadius: 10,
          }}
        />
      ))}
    </div>
  );
};

const MiniProgress = ({ delay }: { delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "grid", gap: 18, width: 380 }}>
      {[0.8, 0.55, 0.35].map((value, index) => (
        <div
          key={value}
          style={{
            height: 30,
            borderRadius: 999,
            border: `4px solid ${ink}`,
            background: toon.white,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${value * 100 * rise(frame, fps, delay + index * 6)}%`,
              height: "100%",
              background: accentAt(index + 1).main,
            }}
          />
        </div>
      ))}
    </div>
  );
};

const DashboardLayout = ({ scene, items, durationFrames }: LayoutProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const win = pop(frame, fps, 6);
  const columns = items.length > 4 ? 3 : 2;
  const chartDelay = staggerAt(
    items.length,
    items.length + 1,
    durationFrames,
    20,
    0.6,
  );
  return (
    <>
      <Place x={110} y={170}>
        <Headline
          title={scene.title}
          subtitle={scene.subtitle}
          size={96}
          width={600}
        />
      </Place>
      <Place x={90} y={600}>
        <Person size={210} />
      </Place>
      <Place x={380} y={560}>
        <Guide size={230} mood={scene.mood ?? "happy"} point delay={16} />
      </Place>
      <div
        style={{
          position: "absolute",
          left: 770,
          top: 140,
          width: 1060,
          height: 740,
          background: toon.white,
          border: `${toon.outline}px solid ${ink}`,
          borderRadius: 30,
          boxShadow: `12px 12px 0 ${ink}`,
          transform: `scale(${win}) rotate(${(1 - win) * 3}deg)`,
          opacity: Math.min(1, win * 2),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            height: 64,
            padding: "0 26px",
            borderBottom: `${toon.outline}px solid ${ink}`,
            background: toon.paperDeep,
          }}
        >
          {[toon.coral, toon.sun, toon.mint].map((color) => (
            <span
              key={color}
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                background: color,
                border: `3px solid ${ink}`,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 16,
              fontFamily: fonts.display,
              fontSize: 30,
              color: ink,
            }}
          >
            {scene.title}
          </span>
          <span style={{ marginLeft: "auto" }}>
            <ExampleBadge />
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 26,
            padding: 34,
          }}
        >
          {items.map((item, index) => (
            <ItemTile
              key={item.label}
              item={item}
              index={index}
              size={columns === 3 ? "sm" : "md"}
              delay={staggerAt(index, items.length, durationFrames, 18, 0.55)}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 34,
            right: 34,
            bottom: 30,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            opacity: clamp01(frame, chartDelay, chartDelay + 10),
          }}
        >
          {scene.visualVariant === "workspace" ? (
            <MiniProgress delay={chartDelay} />
          ) : (
            <MiniBars delay={chartDelay} />
          )}
          <Icon
            name={scene.visualVariant === "workspace" ? "calendar" : "chart"}
            size={130}
            fill={toon.sun}
          />
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- diagrams

const TopHeadline = ({ scene }: { scene: VideoScene }) => (
  <Place x={110} y={140}>
    <Headline
      title={scene.title}
      subtitle={scene.subtitle}
      size={84}
      width={1700}
    />
  </Place>
);

const FlowLayout = ({ scene, items, durationFrames }: LayoutProps) => {
  const frame = useCurrentFrame();
  const count = items.length;
  const left = 200;
  const right = 1720;
  const y = 600;
  const step = (right - left) / Math.max(1, count - 1);
  const reveal = (index: number) =>
    staggerAt(index, count, durationFrames, 16, 0.6);
  const travel = interpolate(
    frame,
    [reveal(0) + 10, reveal(count - 1) + 20],
    [0, count - 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <>
      <TopHeadline scene={scene} />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        {items.slice(1).map((item, index) => {
          const x1 = left + index * step;
          const grow = clamp01(
            frame,
            reveal(index + 1) - 6,
            reveal(index + 1) + 8,
          );
          return (
            <line
              key={item.label}
              x1={x1 + 90}
              y1={y}
              x2={x1 + 90 + (step - 180) * grow}
              y2={y}
              stroke={ink}
              strokeWidth={7}
              strokeDasharray="4 18"
              strokeLinecap="round"
              strokeDashoffset={-frame * 2}
            />
          );
        })}
      </svg>
      {items.map((item, index) => (
        <Place key={item.label} x={left + index * step} y={y} center>
          <Sticker
            delay={reveal(index)}
            background={accentAt(index).soft}
            style={{
              width: 230,
              padding: "26px 10px",
              display: "grid",
              justifyItems: "center",
              gap: 12,
            }}
          >
            {item.icon && (
              <Icon name={item.icon} size={90} fill={accentAt(index).main} />
            )}
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: 38,
                color: ink,
                textAlign: "center",
              }}
            >
              {item.label}
            </span>
          </Sticker>
        </Place>
      ))}
      <Place x={left + travel * step - 70} y={330}>
        <Guide size={140} mood={scene.mood ?? "happy"} delay={reveal(0)} />
      </Place>
    </>
  );
};

const HubLayout = ({ scene, brand, items, durationFrames }: LayoutProps) => {
  const frame = useCurrentFrame();
  const cx = 1250;
  const cy = 540;
  const radius = 330;
  const points = items.map((_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / items.length;
    return {
      x: cx + Math.cos(angle) * radius * 1.25,
      y: cy + Math.sin(angle) * radius,
    };
  });
  const reveal = (index: number) =>
    staggerAt(index, items.length, durationFrames, 24, 0.55);
  return (
    <>
      <Place x={110} y={220}>
        <Headline
          title={scene.title}
          subtitle={scene.subtitle}
          size={84}
          width={560}
        />
      </Place>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        {points.map((point, index) => {
          const on = clamp01(frame, reveal(index), reveal(index) + 10);
          const t = ((frame - reveal(index)) / 40) % 1;
          return (
            <g key={items[index].label} opacity={on}>
              <line
                x1={cx}
                y1={cy}
                x2={point.x}
                y2={point.y}
                stroke={ink}
                strokeWidth={6}
                strokeDasharray="2 16"
                strokeLinecap="round"
              />
              {frame > reveal(index) && (
                <circle
                  cx={cx + (point.x - cx) * t}
                  cy={cy + (point.y - cy) * t}
                  r={11}
                  fill={accentAt(index).main}
                  stroke={ink}
                  strokeWidth={4}
                />
              )}
            </g>
          );
        })}
      </svg>
      <Place x={cx} y={cy} center>
        <Sticker
          delay={6}
          background={toon.mintSoft}
          style={{
            padding: "18px 34px 10px",
            display: "grid",
            justifyItems: "center",
          }}
        >
          <Guide size={150} mood={scene.mood ?? "proud"} delay={10} />
          <span style={{ fontFamily: fonts.display, fontSize: 44, color: ink }}>
            {brand}
          </span>
        </Sticker>
      </Place>
      {items.map((item, index) => (
        <Place key={item.label} x={points[index].x} y={points[index].y} center>
          <ItemTile item={item} index={index} size="sm" delay={reveal(index)} />
        </Place>
      ))}
    </>
  );
};

const CardsLayout = ({ scene, items, durationFrames }: LayoutProps) => (
  <>
    <TopHeadline scene={scene} />
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        top: 430,
        display: "flex",
        justifyContent: "center",
        gap: 60,
      }}
    >
      {items.map((item, index) => (
        <Sticker
          key={item.label}
          delay={staggerAt(index, items.length, durationFrames, 16, 0.5)}
          tilt={index % 2 ? 3 : -3}
          background={accentAt(index).soft}
          style={{
            width: 460,
            height: 380,
            display: "grid",
            placeItems: "center",
            alignContent: "center",
            gap: 26,
          }}
        >
          {item.icon && (
            <Icon name={item.icon} size={150} fill={accentAt(index).main} />
          )}
          <span style={{ fontFamily: fonts.display, fontSize: 58, color: ink }}>
            {item.label}
          </span>
        </Sticker>
      ))}
    </div>
    <Place x={1560} y={110}>
      <Guide size={190} mood={scene.mood ?? "wink"} wave delay={20} />
    </Place>
  </>
);

const CompareLayout = ({ scene, durationFrames }: LayoutProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pairs = scene.pairs ?? [];
  const rowAt = (index: number) =>
    staggerAt(index, pairs.length, durationFrames, 30, 0.7);
  return (
    <>
      <Place x={110} y={120}>
        <Headline
          title={scene.title}
          subtitle={scene.subtitle}
          size={76}
          width={1700}
        />
      </Place>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 320,
          width: 1700,
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 110px 1fr",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: fonts.display,
              fontSize: 46,
              color: toon.inkSoft,
            }}
          >
            <Person mood="stressed" size={80} shirt={toon.gray} /> 예전에는
          </div>
          <span />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: fonts.display,
              fontSize: 46,
              color: ink,
            }}
          >
            <Guide size={80} mood="happy" /> PRISM과 함께
          </div>
        </div>
        {pairs.map((pair, index) => {
          const shown = rowAt(index);
          const after = pop(frame, fps, shown + 12);
          return (
            <div
              key={pair.before}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 110px 1fr",
                alignItems: "center",
              }}
            >
              <Sticker
                delay={shown}
                background={toon.graySoft}
                style={{ padding: "14px 30px", boxShadow: `6px 6px 0 ${ink}` }}
              >
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 38,
                    color: toon.inkSoft,
                    textDecoration: after > 0.5 ? "line-through" : "none",
                  }}
                >
                  {pair.before}
                </span>
              </Sticker>
              <div
                style={{
                  justifySelf: "center",
                  fontFamily: fonts.display,
                  fontSize: 64,
                  color: toon.coral,
                  transform: `scale(${after}) translateX(${Math.sin(frame / 6) * 4}px)`,
                }}
              >
                →
              </div>
              <Sticker
                delay={shown + 12}
                background={accentAt(index).soft}
                style={{ padding: "14px 30px", boxShadow: `6px 6px 0 ${ink}` }}
              >
                <span
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 40,
                    color: ink,
                  }}
                >
                  {pair.after}
                </span>
              </Sticker>
            </div>
          );
        })}
      </div>
    </>
  );
};

const ChecklistLayout = ({ scene, items, durationFrames }: LayoutProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Place x={110} y={190}>
        <Headline
          title={scene.title}
          subtitle={scene.subtitle}
          size={92}
          width={640}
        />
      </Place>
      <Place x={90} y={600}>
        <Person size={210} shirt={toon.lilac} />
      </Place>
      <Place x={380} y={560}>
        <Guide size={250} mood={scene.mood ?? "proud"} delay={10} />
      </Place>
      <div
        style={{
          position: "absolute",
          left: 820,
          top: 160,
          width: 1000,
          display: "grid",
          gap: 26,
        }}
      >
        {items.map((item, index) => {
          const at = staggerAt(index, items.length, durationFrames, 18, 0.7);
          const check = pop(frame, fps, at + 10);
          return (
            <Sticker
              key={item.label}
              delay={at}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                padding: "22px 34px",
              }}
            >
              <Sfx name="ding" at={at + 10} />
              <div
                style={{
                  width: 64,
                  height: 64,
                  flexShrink: 0,
                  borderRadius: 16,
                  border: `${toon.outline}px solid ${ink}`,
                  background: accentAt(index).soft,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <svg
                  width={48}
                  height={48}
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  style={{ transform: `scale(${check})` }}
                >
                  <path
                    d="M8 25 L19 36 L41 11"
                    fill="none"
                    stroke={toon.coral}
                    strokeWidth={9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {item.icon && (
                <Icon name={item.icon} size={60} fill={accentAt(index).main} />
              )}
              <span
                style={{ fontFamily: fonts.display, fontSize: 46, color: ink }}
              >
                {item.label}
              </span>
            </Sticker>
          );
        })}
      </div>
    </>
  );
};

const TimelineLayout = ({ scene, items, durationFrames }: LayoutProps) => {
  const frame = useCurrentFrame();
  const left = 230;
  const right = 1690;
  const y = 560;
  const step = (right - left) / Math.max(1, items.length - 1);
  const at = (index: number) =>
    staggerAt(index, items.length, durationFrames, 16, 0.75);
  const walk = interpolate(
    frame,
    items.map((_, index) => at(index)),
    items.map((_, index) => index),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <>
      <TopHeadline scene={scene} />
      <div
        style={{
          position: "absolute",
          left,
          top: y - 8,
          width: (right - left) * clamp01(frame, 6, at(items.length - 1) + 10),
          height: 16,
          borderRadius: 999,
          background: ink,
        }}
      />
      {items.map((item, index) => {
        const [time, ...rest] = item.label.split(" ");
        return (
          <Place key={item.label} x={left + index * step} y={y} center>
            <div style={{ display: "grid", justifyItems: "center" }}>
              <Sticker
                delay={at(index)}
                background={accentAt(index).main}
                style={{
                  padding: "8px 22px",
                  borderRadius: 999,
                  fontFamily: fonts.display,
                  fontSize: 40,
                  color: ink,
                }}
              >
                {time}
              </Sticker>
              <Sticker
                delay={at(index) + 6}
                background={accentAt(index).soft}
                style={{
                  marginTop: 34,
                  width: 300,
                  padding: "20px 16px",
                  display: "grid",
                  justifyItems: "center",
                  gap: 10,
                }}
              >
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size={70}
                    fill={accentAt(index).main}
                  />
                )}
                <span
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 36,
                    color: ink,
                    textAlign: "center",
                  }}
                >
                  {rest.join(" ")}
                </span>
              </Sticker>
            </div>
          </Place>
        );
      })}
      <Place x={left + walk * step - 75} y={y - 330}>
        <Guide size={150} mood={scene.mood ?? "happy"} />
      </Place>
    </>
  );
};

// Real app screenshot (dark UI) framed so it sits softly on the light scene:
// translucent frame, faded edges, fitted to the frame width, and a slow
// vertical pan when the capture is taller than the frame.
const FRAME = { left: 700, top: 120, width: 1150, maxHeight: 760, pad: 16 };

const useImageRatio = (src: string | null) => {
  const [ratio, setRatio] = useState<number | null>(null);
  const [handle] = useState(() =>
    src ? delayRender(`Measuring ${src}`) : null,
  );
  useEffect(() => {
    if (!src || handle === null) return;
    const image = new Image();
    image.onload = () => {
      setRatio(image.naturalHeight / image.naturalWidth);
      continueRender(handle);
    };
    image.onerror = () => cancelRender(new Error(`Cannot load ${src}`));
    image.src = src;
  }, [src, handle]);
  return ratio;
};

const ScreenshotLayout = ({
  scene,
  items,
  projectId,
  durationFrames,
}: LayoutProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = pop(frame, fps, 6);
  const src = scene.image ? staticFile(`${projectId}/${scene.image}`) : null;
  const ratio = useImageRatio(src) ?? 0.6;
  const inner = FRAME.width - FRAME.pad * 2;
  const imageHeight = inner * ratio;
  const viewHeight = Math.min(imageHeight, FRAME.maxHeight - FRAME.pad * 2);
  const overflow = imageHeight - viewHeight;
  const pan = interpolate(frame, [30, durationFrames - 20], [0, overflow], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const frameHeight = viewHeight + FRAME.pad * 2;
  const top = FRAME.top + (FRAME.maxHeight - frameHeight) / 2;
  return (
    <>
      <Place x={100} y={150}>
        <Headline
          title={scene.title}
          subtitle={scene.subtitle}
          size={72}
          width={560}
        />
      </Place>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 470,
          display: "grid",
          gap: 18,
        }}
      >
        {items.map((item, index) => (
          <ItemTile
            key={item.label}
            item={item}
            index={index}
            size="sm"
            delay={staggerAt(index, items.length, durationFrames, 30, 0.6)}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: FRAME.left,
          top,
          width: FRAME.width,
          height: frameHeight,
          padding: FRAME.pad,
          borderRadius: 34,
          background: `${ink}b3`,
          border: `${toon.outline}px solid ${ink}`,
          boxShadow: `12px 12px 0 ${ink}55, 0 30px 80px ${toon.lilac}66`,
          transform: `scale(${enter}) rotate(${(1 - enter) * 2}deg)`,
          opacity: Math.min(1, enter * 2),
        }}
      >
        <div
          style={{
            position: "relative",
            width: inner,
            height: viewHeight,
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {src && (
            <Img
              src={src}
              style={{
                position: "absolute",
                left: 0,
                top: -pan,
                width: inner,
                height: imageHeight,
                opacity: 0.93,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: `inset 0 0 50px 12px ${ink}`,
              background:
                overflow > 0
                  ? `linear-gradient(180deg, transparent 80%, ${ink}cc)`
                  : undefined,
            }}
          />
        </div>
        <div style={{ position: "absolute", left: 28, top: -22 }}>
          <ExampleBadge label="실제 화면 · 예시 데이터" />
        </div>
      </div>
      <Place x={1680} y={top + frameHeight - 150}>
        <Guide size={200} mood={scene.mood ?? "happy"} point delay={20} />
      </Place>
    </>
  );
};

// ---------------------------------------------------------------- dispatch

export const IllustratedScene = ({
  scene,
  brand,
  projectId,
  durationFrames,
}: {
  scene: VideoScene;
  brand: string;
  projectId: string;
  durationFrames: number;
}) => {
  const props: LayoutProps = {
    scene,
    brand,
    projectId,
    items: (scene.items ?? []).map(parseItem),
    durationFrames,
  };
  switch (scene.type) {
    case "title":
    case "outro":
      return <TitleLayout {...props} />;
    case "character":
      return scene.visualVariant === "chaos" ? (
        <ChaosLayout {...props} />
      ) : (
        <TalkLayout {...props} />
      );
    case "dashboard":
      return scene.visualVariant === "screenshot" ? (
        <ScreenshotLayout {...props} />
      ) : (
        <DashboardLayout {...props} />
      );
    case "diagram":
      switch (scene.visualVariant) {
        case "hub":
          return <HubLayout {...props} />;
        case "cards":
          return <CardsLayout {...props} />;
        case "compare":
          return <CompareLayout {...props} />;
        case "checklist":
          return <ChecklistLayout {...props} />;
        case "timeline":
          return <TimelineLayout {...props} />;
        case "screenshot":
          return <ScreenshotLayout {...props} />;
        default:
          return <FlowLayout {...props} />;
      }
  }
};
