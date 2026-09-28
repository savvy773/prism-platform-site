import { loadFont } from "@remotion/fonts";
import gowunUrl from "./fonts/GowunDodum-Regular.woff2";
import juaUrl from "./fonts/Jua-Regular.woff2";

// Bundled OFL fonts (see fonts/OFL-*.txt) keep renders offline and identical.
// loadFont delays rendering until the glyphs are ready.
loadFont({ family: "Jua", url: juaUrl, weight: "400" });
loadFont({ family: "Gowun Dodum", url: gowunUrl, weight: "400" });

export const fonts = {
  display: '"Jua", "Noto Sans KR", sans-serif',
  body: '"Gowun Dodum", "Noto Sans KR", sans-serif',
} as const;
