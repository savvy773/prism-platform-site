import { Easing, interpolate } from "remotion";

export const easeOut = Easing.out(Easing.cubic);

export const enter = (frame: number, start = 0, length = 18) =>
  interpolate(frame, [start, start + length], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
