import { NOTE_NAMES, noteIndex, noteName, CHORD_TYPES, SCALE_TYPES } from "./music-theory";

export interface BorrowedChord {
  /** Roman numeral label, e.g. "bIII", "iv", "bVI", "bVII" */
  degreeLabel: string;
  /** Chord symbol, e.g. "Eb", "Fm", "Ab", "Bb" */
  chordSymbol: string;
  /** Root of the borrowed chord */
  root: string;
  /** Chord quality key from CHORD_TYPES */
  quality: string;
  /** MIDI notes (relative to C4=60 range) */
  midiNotes: number[];
  /** Origin description */
  description: string;
}

export interface PresetProgression {
  name: string;
  description: string;
  /** 描画時の表示用テキスト */
  chordLabels: string[];
  /** 再生用の MIDI 配列 */
  chordsMidi: number[][];
}

/**
 * Return common borrowed chords from parallel minor for a given major key.
 * Targets: iv, bIII, bVI, bVII, ii°, and minor i (as I-i surprise).
 */
export function getBorrowedChords(key: string): BorrowedChord[] {
  const rootIdx = noteIndex(key);

  const make = (semiOffset: number, quality: string, degreeLabel: string, description: string): BorrowedChord => {
    const rootSemi = (rootIdx + semiOffset + 12) % 12;
    const root = noteName(rootSemi);
    const chordType = CHORD_TYPES[quality];
    const baseMidi = 60 + rootSemi;
    const midiNotes = chordType.intervals.map((i) => baseMidi + i);
    return {
      degreeLabel,
      chordSymbol: `${root}${chordType.symbol}`,
      root,
      quality,
      midiNotes,
      description,
    };
  };

  return [
    make(0, "minor", "i", "同主調マイナーのトニック。I→i で切なさを演出。"),
    make(3, "major", "bIII", "マイナー由来のトニック代理。ロック・シューゲイザーで定番。"),
    make(5, "minor", "iv", "「ピカルディ進行」の逆。IV→iv でメランコリック。"),
    make(8, "major", "bVI", "サブメディアントの借用。Creep 進行（I-III-IV-iv）と並ぶ代表。"),
    make(10, "major", "bVII", "モーダルミクスチャーの定番。ロック・ポップで多用。"),
    make(2, "dim", "ii°", "マイナーのIIから借用。II-V-i のマイナー風入り口。"),
  ];
}

/**
 * Classic preset progressions that showcase modal interchange.
 */
export function getPresetProgressions(key: string): PresetProgression[] {
  const rootIdx = noteIndex(key);
  const scale = SCALE_TYPES.major;

  const chordAt = (semiOffset: number, quality: string): number[] => {
    const rootSemi = (rootIdx + semiOffset + 12) % 12;
    const baseMidi = 60 + rootSemi;
    return CHORD_TYPES[quality].intervals.map((i) => baseMidi + i);
  };

  const degreeChord = (degree: number, quality: string): number[] => {
    return chordAt(scale.intervals[degree], quality);
  };

  const degreeName = (degree: number, quality: string): string => {
    const rootSemi = (rootIdx + scale.intervals[degree]) % 12;
    return `${noteName(rootSemi)}${CHORD_TYPES[quality].symbol}`;
  };

  const offsetName = (offset: number, quality: string): string => {
    const rootSemi = (rootIdx + offset + 12) % 12;
    return `${noteName(rootSemi)}${CHORD_TYPES[quality].symbol}`;
  };

  return [
    {
      name: "Creep 進行 (I-III-IV-iv)",
      description: "Radiohead「Creep」の有名な進行。IV→iv で借用の影が落ちる。",
      chordLabels: [
        degreeName(0, "major"),
        offsetName(4, "major"),
        degreeName(3, "major"),
        offsetName(5, "minor"),
      ],
      chordsMidi: [
        degreeChord(0, "major"),
        chordAt(4, "major"),
        degreeChord(3, "major"),
        chordAt(5, "minor"),
      ],
    },
    {
      name: "I-bVII-IV-I (ロックの定番)",
      description: "The Beatles「With a Little Help」的な動き。bVII の開放感が特徴。",
      chordLabels: [
        degreeName(0, "major"),
        offsetName(10, "major"),
        degreeName(3, "major"),
        degreeName(0, "major"),
      ],
      chordsMidi: [
        degreeChord(0, "major"),
        chordAt(10, "major"),
        degreeChord(3, "major"),
        degreeChord(0, "major"),
      ],
    },
    {
      name: "I-bVI-bVII-I (Epic)",
      description: "映画音楽で多用される「アンセム進行」。bVI-bVII で盛り上がる。",
      chordLabels: [
        degreeName(0, "major"),
        offsetName(8, "major"),
        offsetName(10, "major"),
        degreeName(0, "major"),
      ],
      chordsMidi: [
        degreeChord(0, "major"),
        chordAt(8, "major"),
        chordAt(10, "major"),
        degreeChord(0, "major"),
      ],
    },
  ];
}

/** Utility: guard for supported key. */
export function isSupportedKey(key: string): boolean {
  return NOTE_NAMES.includes(key as never);
}
