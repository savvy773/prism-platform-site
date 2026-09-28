// Shared by the Remotion bundle and scripts/video.mjs (loaded by Node with
// type stripping), so keep this file free of imports and non-erasable syntax.

export type Caption = { start: number; end: number; text: string };

export type AudioManifest = {
  voice: string;
  scenes: Record<string, { hash: string; durationSec: number }>;
};

const MAX_CAPTION_CHARS = 34;

/** Split narration into short caption lines at sentence and clause breaks. */
export const splitCaptions = (narration: string): string[] => {
  const sentences = narration
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?。…])\s+/)
    .filter(Boolean);
  const lines: string[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= MAX_CAPTION_CHARS) {
      lines.push(sentence);
      continue;
    }
    let current = "";
    for (const part of sentence.split(/(?<=,)\s+/)) {
      if (current && (current + part).length > MAX_CAPTION_CHARS) {
        lines.push(current.trim());
        current = "";
      }
      current += `${part} `;
    }
    if (current.trim()) lines.push(current.trim());
  }
  return lines;
};

/**
 * Time caption lines across the spoken length, weighted by character count.
 * Times are seconds relative to the start of the scene.
 */
export const timeCaptions = (
  narration: string,
  speechSec: number,
): Caption[] => {
  const lines = splitCaptions(narration);
  const weights = lines.map((line) => line.replace(/\s/g, "").length + 4);
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = 0;
  return lines.map((text, index) => {
    const start = cursor;
    cursor += (weights[index] / total) * speechSec;
    return { start, end: cursor, text };
  });
};
