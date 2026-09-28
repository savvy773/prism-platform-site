import { interpolate, spring } from "remotion";

/** Bouncy pop-in, 0 → 1 with a little overshoot. */
export const pop = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 11, stiffness: 160, mass: 0.7 },
  });

/** Calm ease-in, 0 → 1 without overshoot. */
export const rise = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 200 } });

export const clamp01 = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/**
 * Spread `count` reveals across the first part of a scene so items appear
 * while the narrator talks about them, whatever the scene length is.
 */
export const staggerAt = (
  index: number,
  count: number,
  durationFrames: number,
  start = 14,
  share = 0.55,
) =>
  start +
  Math.round(
    (index * Math.max(0, durationFrames * share - start)) / Math.max(1, count),
  );

export const wobble = (frame: number, seed = 0, amount = 1) =>
  Math.sin(frame / 9 + seed * 1.7) * amount;
