// Synthesizes the shared sound effects into src/illustrated/sfx/*.wav.
// Everything is generated from code (no samples), so there are no license
// questions and the output is identical on every run.
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const RATE = 44100;
const OUT = resolve(import.meta.dirname, "..", "src", "illustrated", "sfx");

const wav = (samples) => {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((value, index) => {
    const clipped = Math.max(-1, Math.min(1, value));
    data.writeInt16LE(Math.round(clipped * 32767), index * 2);
  });
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
};

const render = (seconds, fn) =>
  Array.from({ length: Math.round(seconds * RATE) }, (_, i) => fn(i / RATE));

// Deterministic noise.
let seed = 7;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return (seed / 4294967296) * 2 - 1;
};

const bell = (freq, t, decay) =>
  Math.exp(-t / decay) *
  (Math.sin(2 * Math.PI * freq * t) * 0.6 +
    Math.sin(2 * Math.PI * freq * 2.01 * t) * 0.25 +
    Math.sin(2 * Math.PI * freq * 3.02 * t) * 0.1);

const sounds = {
  // Bubbly pop for stickers appearing.
  pop: () => {
    let phase = 0;
    return render(0.12, (t) => {
      const freq = 380 + 900 * Math.exp(-t / 0.018);
      phase += (2 * Math.PI * freq) / RATE;
      return (
        Math.sin(phase) * Math.exp(-t / 0.035) * Math.min(1, t / 0.002) * 0.9
      );
    });
  },
  // Airy swoosh for scene transitions.
  whoosh: () => {
    let low = 0;
    const length = 0.42;
    return render(length, (t) => {
      const sweep = 0.02 + 0.25 * Math.sin((Math.PI * t) / length);
      low += sweep * (noise() - low);
      const envelope = Math.sin((Math.PI * t) / length) ** 2;
      return low * envelope * 1.6;
    });
  },
  // Bright ding for checks.
  ding: () => render(0.7, (t) => bell(1318.5, t, 0.18) * 0.8),
  // Rising arpeggio and chord for titles and endings.
  tada: () => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    return render(1.3, (t) => {
      let value = 0;
      notes.forEach((freq, index) => {
        const start = index * 0.08;
        if (t >= start) value += bell(freq, t - start, 0.45) * 0.32;
      });
      return value;
    });
  },
  // Soft two-note boop for surprised or thinking moments.
  boop: () => {
    let phase = 0;
    return render(0.3, (t) => {
      const freq = t < 0.12 ? 660 : 880;
      phase += (2 * Math.PI * freq) / RATE;
      const local = t < 0.12 ? t : t - 0.12;
      return (
        Math.sin(phase) *
        Math.exp(-local / 0.06) *
        Math.min(1, local / 0.003) *
        0.6
      );
    });
  },
};

await mkdir(OUT, { recursive: true });
for (const [name, make] of Object.entries(sounds)) {
  await writeFile(join(OUT, `${name}.wav`), wav(make()));
  console.log(`${name}.wav`);
}
