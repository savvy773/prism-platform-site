import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { VideoScene } from "../data/video-script";
import { landing } from "../theme/landing";

export const SceneShell = ({
  scene,
  index,
  durationFrames,
  children,
}: {
  scene: VideoScene;
  index: number;
  durationFrames: number;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut =
    scene.type === "outro"
      ? 1
      : interpolate(frame, [durationFrames - 12, durationFrames - 1], [1, 0], {
          extrapolateLeft: "clamp",
        });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: landing.bg,
        color: landing.text,
        fontFamily: landing.font,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 76% 40%, #23526475 0%, transparent 38%), radial-gradient(circle at 18% 86%, #a35d5050 0%, transparent 33%), linear-gradient(135deg, #0b1422, #102436 67%, #0b1726)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.11,
          backgroundImage:
            "linear-gradient(#9dc8d9 1px, transparent 1px), linear-gradient(90deg, #9dc8d9 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "linear-gradient(90deg, transparent, black 36%, black)",
        }}
      />
      <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
        {children}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 74,
          display: "flex",
          gap: 15,
          alignItems: "center",
          fontFamily: landing.mono,
          fontSize: 18,
          letterSpacing: "0.17em",
          color: landing.muted,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: landing.mint,
            boxShadow: "0 0 22px #69d9c8",
          }}
        />
        PRISM / INTRODUCTION
      </div>
      <div
        style={{
          position: "absolute",
          top: 43,
          right: 74,
          color: landing.muted,
          fontFamily: landing.mono,
          fontSize: 18,
          letterSpacing: "0.14em",
        }}
      >
        WORKSPACE + ERP
      </div>
      <div
        style={{
          position: "absolute",
          right: 74,
          bottom: 43,
          left: 74,
          display: "flex",
          justifyContent: "space-between",
          borderTop: `1px solid ${landing.line}`,
          paddingTop: 19,
          color: landing.muted,
          fontFamily: landing.mono,
          fontSize: 17,
          letterSpacing: "0.13em",
        }}
      >
        <span>
          {String(index + 1).padStart(2, "0")} / 07 —{" "}
          {scene.id.replaceAll("-", " ").toUpperCase()}
        </span>
        <span>PRISM PLATFORM</span>
      </div>
    </AbsoluteFill>
  );
};
