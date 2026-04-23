import { DIATONIC_MAJOR } from "./music-theory";

/**
 * メジャーキーの機能分類:
 * T (tonic):        I(0), III(2), VI(5)
 * SD (subdominant): II(1), IV(3)
 * D (dominant):     V(4), VII(6)
 */
const FUNCTIONAL_DEGREES = {
  T: [0, 2, 5],
  SD: [1, 3],
  D: [4, 6],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 自然な機能進行パターンを確率的にブレンドして生成。
 * - 基本は T → SD → D → T の流れ
 * - 長さに応じて SD/T のバリエーション差し込み
 */
export function generateRandomProgression(length: number = 4): number[] {
  const safeLength = Math.max(2, Math.min(8, length));
  const progression: number[] = [];

  for (let i = 0; i < safeLength; i++) {
    const position = i / (safeLength - 1 || 1);

    let fn: "T" | "SD" | "D";
    if (i === 0) {
      fn = "T";
    } else if (i === safeLength - 1) {
      fn = "T";
    } else if (position > 0.55 && position < 0.85) {
      fn = "D";
    } else if (position > 0.3) {
      fn = Math.random() < 0.6 ? "SD" : "T";
    } else {
      fn = Math.random() < 0.5 ? "SD" : "T";
    }

    // 直前と同じ度数を避ける
    let degree = pickRandom(FUNCTIONAL_DEGREES[fn]);
    let attempts = 0;
    while (progression.length > 0 && degree === progression[progression.length - 1] && attempts < 5) {
      degree = pickRandom(FUNCTIONAL_DEGREES[fn]);
      attempts++;
    }

    progression.push(degree);
  }

  return progression;
}

/** デバッグ用、ダイアトニック度数名で表示 */
export function describeProgression(degrees: number[]): string {
  return degrees.map((d) => DIATONIC_MAJOR[d].degree).join(" → ");
}
