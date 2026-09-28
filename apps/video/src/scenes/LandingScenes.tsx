import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DashboardVisual } from "../components/DashboardVisual";
import { DiagramVisual } from "../components/DiagramVisual";
import { PrismGuide } from "../components/PrismGuide";
import { SceneHeading } from "../components/SceneHeading";
import type { VideoScene } from "../data/video-script";
import { enter } from "../lib/landing-motion";
import { landing } from "../theme/landing";

const cardPositions = [
  { x: 1000, y: 224, rotate: -8 },
  { x: 1294, y: 170, rotate: 7 },
  { x: 1490, y: 390, rotate: -5 },
  { x: 1050, y: 616, rotate: 8 },
  { x: 1380, y: 690, rotate: -7 },
];

export const CharacterScene = ({ scene }: { scene: VideoScene }) => {
  const frame = useCurrentFrame();
  const tidy = enter(frame, 116, 38);
  return (
    <>
      <div style={{ position: "absolute", left: 124, top: 283 }}>
        <SceneHeading
          title={scene.title}
          subtitle={scene.subtitle}
          label="01 / THE PROBLEM"
          width={760}
        />
      </div>
      {(scene.items ?? []).map((item, index) => {
        const position = cardPositions[index % cardPositions.length];
        const reveal = enter(frame, 8 + index * 7);
        const jitter = Math.sin(frame / 7 + index * 2) * 5 * (1 - tidy);
        return (
          <div
            key={item}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: 255,
              height: 120,
              padding: 22,
              border: `1px solid ${landing.line}`,
              borderRadius: 15,
              background: landing.panel,
              boxShadow: "0 24px 48px #020a16aa",
              opacity: reveal * (1 - tidy * 0.22),
              transform: `translate(${(1260 - position.x) * tidy * 0.32}px, ${(466 - position.y) * tidy * 0.3 + jitter}px) rotate(${position.rotate * (1 - tidy)}deg) scale(${1 - tidy * 0.16})`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: landing.text,
                fontSize: 23,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: index % 2 ? landing.blue : landing.coral,
                  color: landing.bg,
                  fontSize: 17,
                }}
              >
                {item[0]}
              </span>
              {item}
            </div>
            <div
              style={{
                height: 8,
                width: "78%",
                marginTop: 20,
                borderRadius: 5,
                background: landing.line,
              }}
            />
            <div
              style={{
                height: 8,
                width: "53%",
                marginTop: 9,
                borderRadius: 5,
                background: landing.line,
              }}
            />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 1285,
          top: 400,
          transform: `scale(${0.92 + tidy * 0.08})`,
        }}
      >
        <PrismGuide size={245} tilt={-7 + tidy * 7} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 130,
          bottom: 191,
          color: landing.mint,
          fontFamily: landing.mono,
          fontSize: 20,
          letterSpacing: "0.13em",
          opacity: enter(frame, 127),
        }}
      >
        LET'S MAKE THIS SIMPLE.
      </div>
    </>
  );
};

export const TitleScene = ({ scene }: { scene: VideoScene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame, fps, config: { damping: 200, mass: 0.9 } });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 166,
          top: 294,
          color: landing.mint,
          fontFamily: landing.mono,
          fontSize: 23,
          letterSpacing: "0.22em",
          opacity: enter(frame, 0),
        }}
      >
        MEET YOUR NEW WAY TO WORK
      </div>
      <h1
        style={{
          position: "absolute",
          left: 153,
          top: 332,
          margin: 0,
          fontSize: 192,
          lineHeight: 1,
          letterSpacing: "-0.09em",
          fontWeight: 800,
          opacity: title,
          transform: `translateY(${(1 - title) * 50}px) scale(${0.93 + title * 0.07})`,
        }}
      >
        {scene.title}
      </h1>
      <div
        style={{
          position: "absolute",
          left: 165,
          top: 587,
          height: 4,
          width: 560 * enter(frame, 18, 35),
          borderRadius: 4,
          background: `linear-gradient(90deg, ${landing.coral}, ${landing.mint})`,
        }}
      />
      <p
        style={{
          position: "absolute",
          left: 165,
          top: 630,
          color: landing.muted,
          fontSize: 38,
          letterSpacing: "-0.025em",
          opacity: enter(frame, 21),
        }}
      >
        {scene.subtitle}
      </p>
      <div style={{ position: "absolute", right: 176, top: 275 }}>
        <PrismGuide size={405} />
      </div>
    </>
  );
};

export const DashboardScene = ({ scene }: { scene: VideoScene }) => (
  <>
    <div style={{ position: "absolute", left: 130, top: 266 }}>
      <SceneHeading
        title={scene.title}
        subtitle={scene.subtitle}
        label={
          scene.visualVariant === "erp"
            ? "03 / OPERATIONS"
            : "02 / COLLABORATION"
        }
        width={475}
      />
    </div>
    <div
      style={{
        position: "absolute",
        left: 364,
        top: 665,
        transform: "rotate(-8deg)",
      }}
    >
      <PrismGuide size={165} />
    </div>
    <DashboardVisual scene={scene} />
  </>
);

export const CodeScene = ({ scene }: { scene: VideoScene }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 130, top: 228 }}>
        <SceneHeading
          title={scene.title}
          subtitle={scene.subtitle}
          label="PRISM / CODE"
          width={700}
        />
      </div>
      <pre
        style={{
          position: "absolute",
          left: 835,
          top: 230,
          width: 890,
          minHeight: 500,
          padding: 48,
          border: `1px solid ${landing.line}`,
          borderRadius: 22,
          background: landing.panel,
          color: landing.mint,
          fontFamily: landing.mono,
          fontSize: 28,
          lineHeight: 1.6,
          opacity: enter(frame, 12),
        }}
      >
        {scene.code ?? ""}
      </pre>
      <div style={{ position: "absolute", left: 545, top: 630 }}>
        <PrismGuide size={180} />
      </div>
    </>
  );
};

export const OutroScene = ({ scene }: { scene: VideoScene }) => {
  const frame = useCurrentFrame();
  const settled = enter(frame, 15, 34);
  const accent = interpolate(frame, [0, 55], [0, 465], {
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 252,
          top: 222,
          opacity: settled,
          transform: `translateY(${(1 - settled) * 22}px)`,
        }}
      >
        <div
          style={{
            color: landing.mint,
            fontFamily: landing.mono,
            fontSize: 22,
            letterSpacing: "0.2em",
          }}
        >
          WORKSPACE + ERP / TOGETHER
        </div>
        <h1
          style={{
            margin: "38px 0 0",
            fontSize: 176,
            lineHeight: 1,
            letterSpacing: "-0.08em",
            fontWeight: 800,
          }}
        >
          {scene.title}
        </h1>
        <div
          style={{
            marginTop: 34,
            width: accent,
            height: 4,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${landing.coral}, ${landing.mint})`,
          }}
        />
        <p
          style={{
            margin: "45px 0 0",
            fontSize: 67,
            fontWeight: 710,
            lineHeight: 1.2,
            letterSpacing: "-0.05em",
          }}
        >
          {scene.subtitle}
        </p>
        <p style={{ margin: "28px 0 0", color: landing.muted, fontSize: 32 }}>
          {scene.items?.[0]}
        </p>
      </div>
      <div style={{ position: "absolute", left: 1320, top: 335 }}>
        <PrismGuide size={330} still />
      </div>
    </>
  );
};

export const LandingScene = ({ scene }: { scene: VideoScene }) => {
  if (scene.type === "character") return <CharacterScene scene={scene} />;
  if (scene.type === "title") return <TitleScene scene={scene} />;
  if (scene.type === "dashboard") return <DashboardScene scene={scene} />;
  if (scene.type === "diagram") return <DiagramVisual scene={scene} />;
  if (scene.type === "code") return <CodeScene scene={scene} />;
  return <OutroScene scene={scene} />;
};
