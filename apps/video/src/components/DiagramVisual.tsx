import { interpolate, useCurrentFrame } from "remotion";
import type { VideoScene } from "../data/video-script";
import { enter } from "../lib/landing-motion";
import { landing } from "../theme/landing";
import { PrismGuide } from "./PrismGuide";

const flowColors = [
  landing.coral,
  landing.blue,
  landing.mint,
  landing.blue,
  landing.coral,
];

const FlowVisual = ({ scene }: { scene: VideoScene }) => {
  const frame = useCurrentFrame();
  const items = scene.items ?? [];
  const travel = interpolate(frame, [30, 220], [195, 1515], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 132,
          top: 194,
          width: 1500,
          fontSize: 79,
          fontWeight: 760,
          letterSpacing: "-0.055em",
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          position: "absolute",
          left: 135,
          top: 300,
          color: landing.muted,
          fontSize: 31,
        }}
      >
        {scene.subtitle}
      </div>
      <div
        style={{
          position: "absolute",
          left: travel,
          top: 387,
          transform: "translateX(-50%)",
        }}
      >
        <PrismGuide size={112} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 522,
          width: 1680,
          height: 230,
        }}
      >
        <svg
          width="1680"
          height="230"
          viewBox="0 0 1680 230"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          aria-hidden="true"
        >
          {items.slice(0, -1).map((item, index) => {
            const progress = enter(frame, 31 + index * 28, 26);
            const x1 = 260 + index * 330;
            const x2 = 330 + index * 330;
            const pulse = (Math.max(frame - 50 - index * 28, 0) % 46) / 46;
            return (
              <g key={item}>
                <line
                  x1={x1}
                  x2={x2}
                  y1="112"
                  y2="112"
                  stroke={landing.line}
                  strokeWidth="4"
                />
                <line
                  x1={x1}
                  x2={x1 + (x2 - x1) * progress}
                  y1="112"
                  y2="112"
                  stroke={landing.mint}
                  strokeWidth="4"
                />
                <path
                  d={`M${x2 - 12} 102 L${x2} 112 L${x2 - 12} 122`}
                  fill="none"
                  stroke={landing.mint}
                  strokeWidth="4"
                  opacity={progress}
                />
                {frame > 50 + index * 28 && (
                  <circle
                    cx={x1 + (x2 - x1) * pulse}
                    cy="112"
                    r="6"
                    fill={landing.text}
                    opacity={0.8}
                  />
                )}
              </g>
            );
          })}
        </svg>
        {items.map((item, index) => {
          const progress = enter(frame, 7 + index * 28, 20);
          return (
            <div
              key={item}
              style={{
                position: "absolute",
                left: index * 330,
                top: 35,
                width: 260,
                height: 155,
                padding: "28px 25px",
                border: `1px solid ${landing.line}`,
                borderTop: `4px solid ${flowColors[index % flowColors.length]}`,
                borderRadius: 16,
                background: landing.panel,
                boxShadow: "0 24px 55px #020b1885",
                opacity: progress,
                transform: `translateY(${(1 - progress) * 32}px)`,
              }}
            >
              <div
                style={{
                  color: flowColors[index % flowColors.length],
                  fontFamily: landing.mono,
                  fontSize: 16,
                  letterSpacing: "0.12em",
                }}
              >
                {String(index + 1).padStart(2, "0")} / 05
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontSize: item.length > 16 ? 24 : 29,
                  fontWeight: 720,
                  letterSpacing: "-0.04em",
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 133,
          top: 828,
          color: landing.mint,
          fontFamily: landing.mono,
          fontSize: 20,
          letterSpacing: "0.14em",
        }}
      >
        ONE CONNECTED SYSTEM
      </div>
    </>
  );
};

const ReportingVisual = ({ scene }: { scene: VideoScene }) => {
  const frame = useCurrentFrame();
  const items = scene.items ?? [];
  const bars = [45, 60, 54, 77, 69, 87, 100, 88, 110, 121];
  return (
    <>
      <div style={{ position: "absolute", left: 130, top: 286, width: 455 }}>
        <div
          style={{
            color: landing.mint,
            fontFamily: landing.mono,
            fontSize: 19,
            letterSpacing: "0.2em",
            marginBottom: 26,
          }}
        >
          VISIBILITY / REPORTING
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 83,
            lineHeight: 1.1,
            letterSpacing: "-0.06em",
          }}
        >
          {scene.title}
          <br />
          <span style={{ color: landing.mint }}>{scene.subtitle}</span>
        </h1>
        <p
          style={{
            color: landing.muted,
            fontSize: 27,
            lineHeight: 1.45,
            marginTop: 28,
          }}
        >
          Shared context makes every next step easier.
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          left: 462,
          top: 654,
          transform: "rotate(-7deg)",
        }}
      >
        <PrismGuide size={135} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 665,
          top: 175,
          width: 1120,
          height: 715,
          padding: 28,
          border: `1px solid ${landing.line}`,
          borderRadius: 27,
          background: "#152539ed",
          boxShadow: "0 45px 100px #020b18b3",
          transform: `scale(${0.96 + enter(frame, 0, 25) * 0.04})`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 52,
            borderBottom: `1px solid ${landing.line}`,
            color: landing.muted,
            fontFamily: landing.mono,
            fontSize: 18,
            letterSpacing: "0.12em",
          }}
        >
          <span>PRISM / SHARED OVERVIEW</span>
          <span style={{ color: landing.mint }}>● LIVE VIEW</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 20,
            marginTop: 22,
            height: 555,
          }}
        >
          <div
            style={{ display: "grid", gridTemplateRows: "1fr 0.62fr", gap: 18 }}
          >
            <div
              style={{
                padding: 27,
                border: `1px solid ${landing.line}`,
                borderRadius: 17,
                background: landing.panel,
              }}
            >
              <div style={{ fontSize: 25, fontWeight: 700 }}>
                Operations at a glance
              </div>
              <div style={{ color: landing.muted, marginTop: 8, fontSize: 17 }}>
                A single, current view of the work
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  gap: 17,
                  height: 204,
                  marginTop: 24,
                  borderBottom: `1px solid ${landing.line}`,
                }}
              >
                {bars.map((height, index) => (
                  <div
                    key={height}
                    style={{
                      width: 35,
                      height: height * enter(frame, 14 + index * 4, 24),
                      borderRadius: "7px 7px 0 0",
                      background:
                        index === 9 ? landing.mint : `${landing.blue}9a`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 25,
                border: `1px solid ${landing.line}`,
                borderRadius: 17,
                background: landing.panel,
                display: "flex",
                flexDirection: "column",
                gap: 19,
              }}
            >
              {items.slice(0, 2).map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                    opacity: enter(frame, 28 + index * 13),
                  }}
                >
                  <span
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 3,
                      background: index ? landing.coral : landing.mint,
                    }}
                  />
                  <span style={{ fontSize: 20 }}>{item}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      color: landing.muted,
                      fontFamily: landing.mono,
                      fontSize: 16,
                    }}
                  >
                    {index ? "IN VIEW" : "ON TRACK"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateRows: "repeat(2, 1fr)",
              gap: 18,
            }}
          >
            {items.slice(2).map((item, index) => {
              const progress = enter(frame, 21 + index * 14);
              return (
                <div
                  key={item}
                  style={{
                    padding: 29,
                    border: `1px solid ${landing.line}`,
                    borderRadius: 17,
                    background: landing.panel,
                    opacity: progress,
                    transform: `translateY(${(1 - progress) * 22}px)`,
                  }}
                >
                  <span
                    style={{
                      color: landing.muted,
                      fontFamily: landing.mono,
                      fontSize: 16,
                      letterSpacing: "0.1em",
                    }}
                  >
                    0{index + 3} / OVERVIEW
                  </span>
                  <div style={{ fontSize: 29, fontWeight: 700, marginTop: 22 }}>
                    {item}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 9,
                      marginTop: 26,
                      background: landing.line,
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        width: `${(index ? 63 : 84) * enter(frame, 35 + index * 15)}%`,
                        height: "100%",
                        borderRadius: 8,
                        background: index ? landing.coral : landing.mint,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export const DiagramVisual = ({ scene }: { scene: VideoScene }) =>
  scene.visualVariant === "report" ? (
    <ReportingVisual scene={scene} />
  ) : (
    <FlowVisual scene={scene} />
  );
