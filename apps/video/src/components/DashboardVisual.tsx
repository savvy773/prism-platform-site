import { interpolate, useCurrentFrame } from "remotion";
import type { VideoScene } from "../data/video-script";
import { enter } from "../lib/landing-motion";
import { landing } from "../theme/landing";

const bars = [38, 62, 48, 77, 56, 90, 71];
const calendarCells = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
];

const MiniVisual = ({
  index,
  frame,
  active,
}: {
  index: number;
  frame: number;
  active: boolean;
}) => {
  const color = active ? landing.mint : landing.blue;
  if (index % 3 === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "end",
          gap: 9,
          height: 82,
          paddingTop: 10,
        }}
      >
        {bars.map((height, bar) => (
          <div
            key={height}
            style={{
              flex: 1,
              height: `${height * enter(frame, 12 + bar * 3, 23)}%`,
              borderRadius: "5px 5px 2px 2px",
              background: bar === 5 ? color : `${color}70`,
            }}
          />
        ))}
      </div>
    );
  }
  if (index % 3 === 1) {
    return (
      <div style={{ display: "grid", gap: 13, marginTop: 14 }}>
        {[77, 58, 88].map((width, row) => (
          <div
            key={width}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: 3,
                background: row === 0 ? color : landing.line,
              }}
            />
            <span
              style={{
                width: `${width * enter(frame, 14 + row * 7)}%`,
                height: 8,
                borderRadius: 10,
                background: `${color}${row === 0 ? "aa" : "55"}`,
              }}
            />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 5,
        marginTop: 15,
      }}
    >
      {calendarCells.map((cell, index) => (
        <span
          key={cell}
          style={{
            height: 29,
            borderRadius: 5,
            background: index % 5 === 0 ? `${color}bb` : `${landing.line}88`,
            opacity: enter(frame, 12 + index * 2),
          }}
        />
      ))}
    </div>
  );
};

export const DashboardVisual = ({ scene }: { scene: VideoScene }) => {
  const frame = useCurrentFrame();
  const items = scene.items ?? [];
  const erp = scene.visualVariant === "erp";
  const drift = interpolate(
    frame,
    [0, scene.durationSec * 30],
    [erp ? 18 : -18, erp ? -18 : 18],
    { extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 665,
        top: 172,
        width: 1140,
        height: 735,
        padding: 22,
        border: `1px solid ${landing.line}`,
        borderRadius: 28,
        background: "#152539ed",
        boxShadow: "0 50px 100px #020b18b3, inset 0 1px #ffffff25",
        transform: `translateX(${drift}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          height: 53,
          padding: "0 8px 18px",
          color: landing.muted,
          fontFamily: landing.mono,
          fontSize: 16,
          letterSpacing: "0.12em",
        }}
      >
        <span style={{ display: "flex", gap: 6, marginRight: 10 }}>
          <i
            style={{
              width: 9,
              height: 9,
              borderRadius: 10,
              background: landing.coral,
            }}
          />
          <i
            style={{
              width: 9,
              height: 9,
              borderRadius: 10,
              background: landing.blue,
            }}
          />
          <i
            style={{
              width: 9,
              height: 9,
              borderRadius: 10,
              background: landing.mint,
            }}
          />
        </span>
        PRISM / {scene.title.toUpperCase()}
        <span
          style={{
            marginLeft: "auto",
            border: `1px solid ${landing.line}`,
            borderRadius: 8,
            padding: "6px 12px",
          }}
        >
          OVERVIEW
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: erp ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
          gridTemplateRows: erp ? "repeat(2, 1fr)" : "repeat(2, 1fr)",
          gap: 14,
          height: 632,
        }}
      >
        {items.map((item, index) => {
          const reveal = enter(frame, 8 + index * 13, 22);
          const active =
            Math.floor(Math.max(0, frame - 18) / 36) %
              Math.max(items.length, 1) ===
            index;
          return (
            <div
              key={item}
              style={{
                padding: erp ? 25 : 30,
                border: `1px solid ${active ? landing.mint : landing.line}`,
                borderRadius: 18,
                background: active ? "#1c3746" : landing.panel,
                boxShadow: active ? "0 0 28px #69d9c822" : "none",
                opacity: reveal,
                transform: `translateY(${(1 - reveal) * 28}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    color: landing.bg,
                    background: active ? landing.mint : landing.blue,
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  {item[0]}
                </span>
                <span
                  style={{
                    color: landing.text,
                    fontSize: erp ? 23 : 27,
                    fontWeight: 680,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {item}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    color: active ? landing.mint : landing.muted,
                    fontFamily: landing.mono,
                    fontSize: 13,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div
                style={{
                  height: 1,
                  background: landing.line,
                  margin: erp ? "20px 0 10px" : "27px 0 17px",
                }}
              />
              <MiniVisual index={index} frame={frame} active={active} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
