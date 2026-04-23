import { NOTE_NAMES, noteIndex, noteName, CHORD_TYPES, SCALE_TYPES } from "./music-theory";

export interface SecondaryDominant {
  /** Target degree (roman numeral) in the key, e.g. "II", "III", "IV", "V", "VI" */
  targetDegree: string;
  /** Target scale degree index (0-indexed, 0 = I) */
  targetIndex: number;
  /** Chord symbol for the V/X, e.g. "A7" for V/II in C major */
  chordSymbol: string;
  /** Root of the V/X chord */
  root: string;
  /** Dominant 7th chord MIDI notes relative to C4 (60) */
  midiNotes: number[];
  /** Target chord symbol after resolution, e.g. "Dm" */
  targetChordSymbol: string;
  /** Target chord MIDI notes */
  targetMidiNotes: number[];
  /** Short description */
  description: string;
}

const DIATONIC_MINOR_TARGETS = new Set([1, 2, 5]); // II(m), III(m), VI(m)
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

/**
 * Return secondary dominants V/II, V/III, V/IV, V/V, V/VI for a major key.
 * V/I (just the V) and V/VII are excluded.
 */
export function getSecondaryDominants(key: string): SecondaryDominant[] {
  const rootIdx = noteIndex(key);
  const majorScale = SCALE_TYPES.major;
  const targets = [1, 2, 3, 4, 5]; // II, III, IV, V, VI

  return targets.map((deg) => {
    const targetSemi = (rootIdx + majorScale.intervals[deg]) % 12;
    const vRootSemi = (targetSemi + 7) % 12;
    const vRoot = noteName(vRootSemi);

    const dom7 = CHORD_TYPES.dom7;
    const baseMidi = 60 + vRootSemi;
    const midiNotes = dom7.intervals.map((i) => baseMidi + i);

    const isMinorTarget = DIATONIC_MINOR_TARGETS.has(deg);
    const targetQuality = isMinorTarget ? "minor" : "major";
    const targetChord = CHORD_TYPES[targetQuality];
    const targetBaseMidi = 60 + targetSemi;
    const targetMidiNotes = targetChord.intervals.map((i) => targetBaseMidi + i);
    const targetRoot = noteName(targetSemi);
    const targetSymbol = `${targetRoot}${targetChord.symbol}`;

    const descriptions: Record<number, string> = {
      1: "II度マイナーを一時的にトニック化。II-V-I のII側に V/II を差し込むとジャズっぽい響きに。",
      2: "III度マイナーを一時的にトニック化。Fly Me to the Moon などで登場。",
      3: "IV度メジャーをトニック化。「I → V/IV → IV」でブルージーな動き。",
      4: "V度メジャーをトニック化。「I → V/V → V → I」で強い推進力。",
      5: "VI度マイナーをトニック化。Autumn Leaves などマイナー系楽曲の入口として定番。",
    };

    return {
      targetDegree: ROMAN[deg] + (isMinorTarget ? "m" : ""),
      targetIndex: deg,
      chordSymbol: `${vRoot}7`,
      root: vRoot,
      midiNotes,
      targetChordSymbol: targetSymbol,
      targetMidiNotes,
      description: descriptions[deg] ?? "",
    };
  });
}

/** For a target degree, return MIDI for the V/X resolution sequence. */
export function getResolutionProgression(key: string, targetIndex: number): number[][] {
  const seconds = getSecondaryDominants(key);
  const sec = seconds.find((s) => s.targetIndex === targetIndex);
  if (!sec) return [];
  return [sec.midiNotes, sec.targetMidiNotes];
}

/** Check that a given key is one of the 12 supported note names. */
export function isSupportedKey(key: string): boolean {
  return NOTE_NAMES.includes(key as never);
}
