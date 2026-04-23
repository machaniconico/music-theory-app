import { DIATONIC_MAJOR, ChordFunction } from "./music-theory";

export interface ChordSuggestion {
  /** Roman-numeral index (0 = I) */
  degreeIndex: number;
  /** Confidence 0..1 */
  score: number;
  /** Reason label shown in UI */
  reason: string;
}

/**
 * Function transition weights. Higher = more natural.
 * Keys are "fromFunction" and values map "toFunction" -> weight.
 */
const FUNCTION_TRANSITIONS: Record<ChordFunction, Record<ChordFunction, number>> = {
  T: { T: 0.2, SD: 0.6, D: 0.4 },
  SD: { T: 0.3, SD: 0.2, D: 0.7 },
  D: { T: 0.9, SD: 0.15, D: 0.2 },
};

/**
 * Per-degree preference within each target function.
 * Based on common usage (I, V, vi, IV most common).
 */
const DEGREE_WEIGHT: Record<number, number> = {
  0: 1.0, // I
  1: 0.6, // ii
  2: 0.4, // iii
  3: 0.9, // IV
  4: 0.95, // V
  5: 0.85, // vi
  6: 0.3, // vii°
};

/**
 * Suggest up to `max` next-chord candidates for a progression.
 * If progression is empty, returns common starter chords.
 */
export function suggestNextChords(degreesSoFar: number[], max = 3): ChordSuggestion[] {
  if (degreesSoFar.length === 0) {
    return [
      { degreeIndex: 0, score: 1, reason: "定番のスタート: I (トニック)" },
      { degreeIndex: 5, score: 0.7, reason: "切なく始める: vi (マイナー・トニック代理)" },
      { degreeIndex: 4, score: 0.6, reason: "強く始める: V (ドミナント)" },
    ];
  }

  const last = degreesSoFar[degreesSoFar.length - 1];
  if (last < 0 || last >= DIATONIC_MAJOR.length) return [];
  const lastFunction = DIATONIC_MAJOR[last].function;
  const transitions = FUNCTION_TRANSITIONS[lastFunction];

  const candidates: ChordSuggestion[] = DIATONIC_MAJOR.map((chord, idx) => {
    const fnWeight = transitions[chord.function] ?? 0;
    const degWeight = DEGREE_WEIGHT[idx] ?? 0.4;
    let score = fnWeight * degWeight;

    // Prefer moves that DON'T repeat the last degree
    if (idx === last) score *= 0.3;

    // V → I bonus (perfect cadence)
    if (last === 4 && idx === 0) score += 0.15;
    // vi → IV bonus (common in J-POP)
    if (last === 5 && idx === 3) score += 0.1;
    // IV → V bonus
    if (last === 3 && idx === 4) score += 0.1;

    score = Math.min(1, Math.max(0, score));

    return {
      degreeIndex: idx,
      score,
      reason: `${chord.degree}（${chord.functionJa}）`,
    };
  });

  candidates.sort((a, b) => b.score - a.score);

  // Build reason strings with context
  const lastDegree = DIATONIC_MAJOR[last].degree;
  return candidates.slice(0, max).map((c) => {
    const d = DIATONIC_MAJOR[c.degreeIndex];
    let reason = `${lastDegree}→${d.degree}：${d.functionJa}へ`;
    if (last === 4 && c.degreeIndex === 0) reason = `${lastDegree}→${d.degree}：完全終止（強い解決）`;
    else if (last === 3 && c.degreeIndex === 4) reason = `${lastDegree}→${d.degree}：IV→V の王道動き`;
    else if (last === 5 && c.degreeIndex === 3) reason = `${lastDegree}→${d.degree}：J-POP定番の動き`;
    return { ...c, reason };
  });
}
