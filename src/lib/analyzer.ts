import { DIATONIC_MAJOR, ChordFunction, getDiatonicChordName } from "./music-theory";

export interface Cadence {
  type: "perfect" | "plagal" | "deceptive" | "half" | "imperfect";
  label: string;
  description: string;
  /** Position of the cadence (index of the first chord of the cadence pair) */
  position: number;
}

export interface SpecialProgression {
  name: string;
  nameJa: string;
  description: string;
  /** Matched chord range [start, end] inclusive */
  range: [number, number];
}

export interface AnalysisResult {
  key: string;
  chordNames: string[];
  functions: ChordFunction[];
  functionLabels: string[];
  cadences: Cadence[];
  specialProgressions: SpecialProgression[];
  summary: string;
}

const SPECIAL_PATTERNS: { degrees: number[]; name: string; nameJa: string; description: string }[] = [
  {
    degrees: [0, 4, 5, 3],
    name: "Axis",
    nameJa: "Axis進行 (I-V-vi-IV)",
    description: "Let It Be など、洋楽ポップの大定番。最強の普遍性。",
  },
  {
    degrees: [3, 4, 2, 5],
    name: "Royal Road",
    nameJa: "王道進行 (IV-V-iii-vi)",
    description: "J-POP の大定番。感情の昇華が美しい。",
  },
  {
    degrees: [5, 3, 4, 0],
    name: "Komuro",
    nameJa: "小室進行 (vi-IV-V-I)",
    description: "90年代J-POPの定番。TRF, globeなど。",
  },
  {
    degrees: [3, 2, 0, 5],
    name: "Just The Two of Us",
    nameJa: "丸サ進行 (IVM7-IIIm7-VIm)",
    description: "シティポップ・R&Bの大定番。おしゃれ。",
  },
  {
    degrees: [1, 4, 0],
    name: "II-V-I",
    nameJa: "ツーファイブワン",
    description: "ジャズの最重要進行。",
  },
  {
    degrees: [0, 4, 5, 2, 3, 0, 3, 4],
    name: "Canon",
    nameJa: "カノン進行",
    description: "パッヘルベルのカノン。普遍的な美しさ。",
  },
  {
    degrees: [0, 5, 3, 4],
    name: "Pop Punk",
    nameJa: "50s進行 (I-vi-IV-V)",
    description: "50年代ポップスの定番。ドゥーワップ。",
  },
  {
    degrees: [0, 4, 3, 0],
    name: "Rock",
    nameJa: "I-V-IV-I (ロック)",
    description: "ロックの王道。La Bamba 的。",
  },
];

function matchSubsequence(haystack: number[], needle: number[]): number {
  if (needle.length > haystack.length) return -1;
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let ok = true;
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        ok = false;
        break;
      }
    }
    if (ok) return i;
  }
  return -1;
}

function detectCadences(degrees: number[]): Cadence[] {
  const cadences: Cadence[] = [];
  for (let i = 0; i < degrees.length - 1; i++) {
    const cur = degrees[i];
    const next = degrees[i + 1];
    if (cur === 4 && next === 0) {
      cadences.push({
        type: "perfect",
        label: "V → I 完全終止",
        description: "最も強い解決感。ドミナントからトニックへ。",
        position: i,
      });
    } else if (cur === 3 && next === 0) {
      cadences.push({
        type: "plagal",
        label: "IV → I 変格終止（アーメン終止）",
        description: "穏やかな解決。教会音楽で「アーメン」に使われる。",
        position: i,
      });
    } else if (cur === 4 && next === 5) {
      cadences.push({
        type: "deceptive",
        label: "V → vi 偽終止",
        description: "解決しそうで違う方向へ。意外性を演出。",
        position: i,
      });
    }
  }
  if (degrees.length > 0 && degrees[degrees.length - 1] === 4) {
    cadences.push({
      type: "half",
      label: "... → V 半終止",
      description: "ドミナントで区切りをつける。続きの期待を作る。",
      position: degrees.length - 1,
    });
  }
  return cadences;
}

function detectSpecials(degrees: number[]): SpecialProgression[] {
  const matches: SpecialProgression[] = [];
  for (const p of SPECIAL_PATTERNS) {
    const idx = matchSubsequence(degrees, p.degrees);
    if (idx >= 0) {
      matches.push({
        name: p.name,
        nameJa: p.nameJa,
        description: p.description,
        range: [idx, idx + p.degrees.length - 1],
      });
    }
  }
  return matches;
}

export function analyzeProgression(degrees: number[], key: string, useSeventh = false): AnalysisResult {
  const validDegrees = degrees.filter((d) => d >= 0 && d < 7);
  const chordNames = validDegrees.map((d) => getDiatonicChordName(key, d, useSeventh));
  const functions = validDegrees.map((d) => DIATONIC_MAJOR[d].function);
  const functionLabels = validDegrees.map((d) => DIATONIC_MAJOR[d].functionJa);

  const cadences = detectCadences(validDegrees);
  const specialProgressions = detectSpecials(validDegrees);

  // Summary
  const parts: string[] = [];
  if (specialProgressions.length > 0) {
    parts.push(`定番進行: ${specialProgressions.map((s) => s.nameJa).join("、")}`);
  }
  if (cadences.length > 0) {
    parts.push(`カデンツ: ${cadences.length}個`);
  }
  const tCount = functions.filter((f) => f === "T").length;
  const sdCount = functions.filter((f) => f === "SD").length;
  const dCount = functions.filter((f) => f === "D").length;
  parts.push(`機能バランス: T=${tCount} SD=${sdCount} D=${dCount}`);

  const summary = parts.join(" / ");

  return {
    key,
    chordNames,
    functions,
    functionLabels,
    cadences,
    specialProgressions,
    summary,
  };
}
