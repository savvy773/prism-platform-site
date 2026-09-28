import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { landing } from "../theme/landing";

export const SceneHeading = ({
  title,
  subtitle,
  label,
  width = 700,
}: {
  title: string;
  subtitle: string;
  label: string;
  width?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });

  return (
    <div
      style={{
        width,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 36}px)`,
      }}
    >
      <div
        style={{
          color: landing.mint,
          fontFamily: landing.mono,
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: "0.2em",
          marginBottom: 26,
        }}
      >
        {label}
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: 86,
          lineHeight: 1.08,
          letterSpacing: "-0.066em",
          fontWeight: 760,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          margin: "23px 0 0",
          color: landing.muted,
          fontSize: 31,
          lineHeight: 1.4,
          letterSpacing: "-0.022em",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
