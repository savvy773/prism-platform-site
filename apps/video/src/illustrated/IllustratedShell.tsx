import type { ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { timeCaptions } from "../data/captions";
import { AUDIO_TAIL_SEC, type VideoScene } from "../data/video-script";
import { fonts } from "./fonts";
import { Sfx } from "./Sfx";
import { ink, toon } from "./theme";

const blobs = [
  { x: 6, y: 12, r: 260, color: toon.mintSoft, speed: 70 },
  { x: 88, y: 18, r: 220, color: toon.sunSoft, speed: 90 },
  { x: 80, y: 86, r: 300, color: toon.coralSoft, speed: 110 },
  { x: 14, y: 90, r: 200, color: toon.lilacSoft, speed: 80 },
];

const Backdrop = ({ seed }: { seed: number }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: toon.paper, overflow: "hidden" }}>
      {blobs.map((blob, index) => (
        <div
          key={blob.color}
          style={{
            position: "absolute",
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: blob.r * 2,
            height: blob.r * 2,
            marginLeft: -blob.r,
            marginTop: -blob.r,
            borderRadius: "46% 54% 60% 40% / 50% 42% 58% 50%",
            background: blob.color,
            transform: `translate(${Math.sin((frame + seed * 40) / blob.speed + index) * 30}px, ${Math.cos((frame + seed * 40) / blob.speed) * 24}px) rotate(${(frame + seed * 30) / (blob.speed / 8)}deg)`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          opacity: 0.35,
          backgroundImage: `radial-gradient(${toon.gray} 2.4px, transparent 2.6px)`,
          backgroundSize: "46px 46px",
        }}
      />
    </AbsoluteFill>
  );
};

const Caption = ({
  scene,
  speechSec,
  durationFrames,
}: {
  scene: VideoScene;
  speechSec: number;
  durationFrames: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const spoken = speechSec || durationFrames / fps - AUDIO_TAIL_SEC;
  const captions = timeCaptions(scene.narration, spoken);
  const current = captions.find(
    (caption) => seconds >= caption.start && seconds < caption.end,
  );
  if (!current) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 58,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          padding: "14px 34px",
          borderRadius: 18,
          background: `${ink}e6`,
          color: toon.white,
          fontFamily: fonts.body,
          fontSize: 40,
          lineHeight: 1.35,
          textAlign: "center",
          wordBreak: "keep-all",
        }}
      >
        {current.text}
      </div>
    </div>
  );
};

export const IllustratedShell = ({
  scene,
  index,
  total,
  durationFrames,
  speechSec,
  brand = "PRISM",
  children,
}: {
  scene: VideoScene;
  index: number;
  total: number;
  durationFrames: number;
  speechSec: number;
  brand?: string;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  // A quick iris wipe between scenes keeps long videos feeling continuous.
  const open = interpolate(frame, [0, 14], [0, 150], {
    extrapolateRight: "clamp",
  });
  const close =
    scene.type === "outro"
      ? 150
      : interpolate(frame, [durationFrames - 10, durationFrames], [150, 0], {
          extrapolateLeft: "clamp",
        });
  const radius = Math.min(open, close);

  return (
    <AbsoluteFill style={{ background: ink }}>
      <AbsoluteFill
        style={{
          clipPath: `circle(${radius}% at 50% 50%)`,
          overflow: "hidden",
        }}
      >
        <Backdrop seed={index} />
        {index > 0 && <Sfx name="whoosh" />}
        <AbsoluteFill>{children}</AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 56,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "8px 22px 8px 12px",
            borderRadius: 999,
            background: toon.white,
            border: `4px solid ${ink}`,
            fontFamily: fonts.display,
            fontSize: 30,
            color: ink,
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: toon.mint,
              border: `3px solid ${ink}`,
              transform: "rotate(45deg)",
            }}
          />
          {brand}
          {scene.chapter && (
            <span
              style={{
                fontFamily: fonts.body,
                color: toon.inkSoft,
                fontSize: 26,
              }}
            >
              · {scene.chapter}
            </span>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 12,
            background: toon.graySoft,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((index + frame / durationFrames) / total) * 100}%`,
              background: toon.coral,
            }}
          />
        </div>
        <Caption
          scene={scene}
          speechSec={speechSec}
          durationFrames={durationFrames}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
