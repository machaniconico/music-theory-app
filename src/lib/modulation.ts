import { NOTE_NAMES, noteIndex, noteName, CHORD_TYPES, SCALE_TYPES } from "./music-theory";

export interface ModulationStep {
  label: string;
  chordSymbol: string;
  midiNotes: number[];
  /** Whether this chord is in the target key (annotation) */
  inTargetKey: boolean;
}

export interface ModulationProgression {
  fromKey: string;
  toKey: string;
  type: "pivot" | "direct";
  title: string;
  description: string;
  steps: ModulationStep[];
}

function chordFor(keyRoot: string, degree: number, quality: string): {
  symbol: string;
  midi: number[];
} {
  const scale = SCALE_TYPES.major;
  const keyIdx = noteIndex(keyRoot);
  const rootSemi = (keyIdx + scale.intervals[degree]) % 12;
  const root = noteName(rootSemi);
  const chordType = CHORD_TYPES[quality];
  const baseMidi = 60 + rootSemi;
  const midi = chordType.intervals.map((i) => baseMidi + i);
  return { symbol: `${root}${chordType.symbol}`, midi };
}

/**
 * Pivot chord modulation: uses a chord that exists diatonically in both keys.
 * Returns a 5-step progression: fromKey I - IV - (pivot) - V(toKey) - I(toKey).
 */
export function generatePivotModulation(fromKey: string, toKey: string): ModulationProgression {
  const fromI = chordFor(fromKey, 0, "major");
  const fromIV = chordFor(fromKey, 3, "major");

  // pivot = vi of fromKey (which is ii of a different key typically)
  const pivot = chordFor(fromKey, 5, "minor");

  const toV = chordFor(toKey, 4, "major");
  const toI = chordFor(toKey, 0, "major");

  return {
    fromKey,
    toKey,
    type: "pivot",
    title: `${fromKey} → ${toKey}: ピボットコード転調`,
    description:
      "両キーに共通するコード（ピボット）を経由して、自然に別のキーへ移動する。ピボットは両キーでダイアトニックなので違和感が少ない。",
    steps: [
      { label: "I", chordSymbol: fromI.symbol, midiNotes: fromI.midi, inTargetKey: false },
      { label: "IV", chordSymbol: fromIV.symbol, midiNotes: fromIV.midi, inTargetKey: false },
      { label: "vi (pivot)", chordSymbol: pivot.symbol, midiNotes: pivot.midi, inTargetKey: false },
      { label: "V (new key)", chordSymbol: toV.symbol, midiNotes: toV.midi, inTargetKey: true },
      { label: "I (new key)", chordSymbol: toI.symbol, midiNotes: toI.midi, inTargetKey: true },
    ],
  };
}

/**
 * Direct modulation: just shift the final section up by N semitones.
 * Returns: fromKey I-V-I, toKey(+semitones) I-V-I.
 */
export function generateDirectModulation(fromKey: string, semitones: number): ModulationProgression {
  const fromIdx = noteIndex(fromKey);
  const toIdx = (fromIdx + semitones + 12) % 12;
  const toKey = noteName(toIdx);

  const fI = chordFor(fromKey, 0, "major");
  const fV = chordFor(fromKey, 4, "major");
  const fI2 = chordFor(fromKey, 0, "major");
  const tI = chordFor(toKey, 0, "major");
  const tV = chordFor(toKey, 4, "major");
  const tI2 = chordFor(toKey, 0, "major");

  // shift target octave up so the lift is audible
  const raise = (notes: number[]) => notes.map((n) => n + 12);

  return {
    fromKey,
    toKey,
    type: "direct",
    title: `${fromKey} → ${toKey}: 直接転調 (+${semitones}半音)`,
    description:
      "前ぶれなしに次の小節から別キーへ跳ね上げる手法。サビ繰り返しでのキー上げ（半音/全音）で感情のクライマックスを作る。",
    steps: [
      { label: "I", chordSymbol: fI.symbol, midiNotes: fI.midi, inTargetKey: false },
      { label: "V", chordSymbol: fV.symbol, midiNotes: fV.midi, inTargetKey: false },
      { label: "I", chordSymbol: fI2.symbol, midiNotes: fI2.midi, inTargetKey: false },
      { label: "I (new!)", chordSymbol: tI.symbol, midiNotes: raise(tI.midi), inTargetKey: true },
      { label: "V", chordSymbol: tV.symbol, midiNotes: raise(tV.midi), inTargetKey: true },
      { label: "I", chordSymbol: tI2.symbol, midiNotes: raise(tI2.midi), inTargetKey: true },
    ],
  };
}

export function isSupportedKey(key: string): boolean {
  return NOTE_NAMES.includes(key as never);
}
