// ── Note & Chord Theory Engine ──

export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
export const NOTE_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

// Interval semitones from root
export const INTERVALS: Record<string, number> = {
  "P1": 0, "m2": 1, "M2": 2, "m3": 3, "M3": 4,
  "P4": 5, "A4": 6, "d5": 6, "P5": 7, "m6": 8,
  "M6": 9, "m7": 10, "M7": 11, "P8": 12,
  "b9": 13, "9": 14, "#9": 15, "11": 17, "#11": 18,
  "b13": 20, "13": 21,
};

export const INTERVAL_NAMES: Record<number, string> = {
  0: "ルート (P1)", 1: "短2度 (m2)", 2: "長2度 (M2)", 3: "短3度 (m3)",
  4: "長3度 (M3)", 5: "完全4度 (P4)", 6: "増4度/減5度 (A4/d5)",
  7: "完全5度 (P5)", 8: "短6度 (m6)", 9: "長6度 (M6)",
  10: "短7度 (m7)", 11: "長7度 (M7)",
};

// ── Chord Definitions ──
export interface ChordType {
  name: string;
  nameJa: string;
  symbol: string;
  intervals: number[];
  description: string;
  color: string;
}

export const CHORD_TYPES: Record<string, ChordType> = {
  major: {
    name: "Major", nameJa: "メジャー", symbol: "",
    intervals: [0, 4, 7],
    description: "明るく安定した響き。ルート + 長3度 + 完全5度",
    color: "var(--color-primary)",
  },
  minor: {
    name: "Minor", nameJa: "マイナー", symbol: "m",
    intervals: [0, 3, 7],
    description: "暗く哀愁のある響き。ルート + 短3度 + 完全5度",
    color: "var(--color-secondary)",
  },
  dim: {
    name: "Diminished", nameJa: "ディミニッシュ", symbol: "dim",
    intervals: [0, 3, 6],
    description: "不安定で緊張感のある響き。ルート + 短3度 + 減5度",
    color: "var(--color-accent-rose)",
  },
  aug: {
    name: "Augmented", nameJa: "オーギュメント", symbol: "aug",
    intervals: [0, 4, 8],
    description: "浮遊感のある不思議な響き。ルート + 長3度 + 増5度",
    color: "var(--color-accent-blue)",
  },
  sus2: {
    name: "Suspended 2nd", nameJa: "サスツー", symbol: "sus2",
    intervals: [0, 2, 7],
    description: "開放的でニュートラルな響き。3度の代わりに長2度",
    color: "var(--color-accent-green)",
  },
  sus4: {
    name: "Suspended 4th", nameJa: "サスフォー", symbol: "sus4",
    intervals: [0, 5, 7],
    description: "解決を求める緊張感。3度の代わりに完全4度",
    color: "var(--color-accent-green)",
  },
  maj7: {
    name: "Major 7th", nameJa: "メジャーセブンス", symbol: "M7",
    intervals: [0, 4, 7, 11],
    description: "おしゃれで都会的な響き。メジャー + 長7度",
    color: "var(--color-primary)",
  },
  min7: {
    name: "Minor 7th", nameJa: "マイナーセブンス", symbol: "m7",
    intervals: [0, 3, 7, 10],
    description: "柔らかく落ち着いた響き。マイナー + 短7度",
    color: "var(--color-secondary)",
  },
  dom7: {
    name: "Dominant 7th", nameJa: "ドミナントセブンス", symbol: "7",
    intervals: [0, 4, 7, 10],
    description: "解決感を生む響き。メジャー + 短7度",
    color: "var(--color-accent-blue)",
  },
  dim7: {
    name: "Diminished 7th", nameJa: "ディミニッシュセブンス", symbol: "dim7",
    intervals: [0, 3, 6, 9],
    description: "対称的で緊張感の強い響き。短3度の積み重ね",
    color: "var(--color-accent-rose)",
  },
  m7b5: {
    name: "Half-Diminished", nameJa: "ハーフディミニッシュ", symbol: "m7(b5)",
    intervals: [0, 3, 6, 10],
    description: "マイナーキーのII度で使われる。マイナー7th + 減5度",
    color: "var(--color-accent-rose)",
  },
  add9: {
    name: "Add 9th", nameJa: "アドナインス", symbol: "add9",
    intervals: [0, 4, 7, 14],
    description: "きらびやかで広がりのある響き。メジャー + 9度",
    color: "var(--color-primary)",
  },
};

// ── Scale Definitions ──
export interface ScaleType {
  name: string;
  nameJa: string;
  intervals: number[];
  description: string;
}

export const SCALE_TYPES: Record<string, ScaleType> = {
  major: {
    name: "Major (Ionian)", nameJa: "メジャー（イオニアン）",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: "最も基本的なスケール。明るく安定した響き。",
  },
  natural_minor: {
    name: "Natural Minor (Aeolian)", nameJa: "ナチュラルマイナー（エオリアン）",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: "暗く哀愁のある響き。メジャーの6番目から始めたスケール。",
  },
  harmonic_minor: {
    name: "Harmonic Minor", nameJa: "ハーモニックマイナー",
    intervals: [0, 2, 3, 5, 7, 8, 11],
    description: "エキゾチックな響き。ナチュラルマイナーの7度を半音上げたもの。",
  },
  melodic_minor: {
    name: "Melodic Minor", nameJa: "メロディックマイナー",
    intervals: [0, 2, 3, 5, 7, 9, 11],
    description: "ジャズで多用。ナチュラルマイナーの6度と7度を半音上げたもの。",
  },
  dorian: {
    name: "Dorian", nameJa: "ドリアン",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: "マイナーだが明るさがある。ジャズ・ファンクで多用。",
  },
  mixolydian: {
    name: "Mixolydian", nameJa: "ミクソリディアン",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    description: "ブルージーな響き。ドミナント7thコードに対応。",
  },
  pentatonic_major: {
    name: "Major Pentatonic", nameJa: "メジャーペンタトニック",
    intervals: [0, 2, 4, 7, 9],
    description: "5音スケール。シンプルで使いやすい。ポップス・ロックの定番。",
  },
  pentatonic_minor: {
    name: "Minor Pentatonic", nameJa: "マイナーペンタトニック",
    intervals: [0, 3, 5, 7, 10],
    description: "ブルース・ロックの基本。ギターソロの定番スケール。",
  },
  blues: {
    name: "Blues", nameJa: "ブルース",
    intervals: [0, 3, 5, 6, 7, 10],
    description: "マイナーペンタに#4/b5を追加。ブルーノートが特徴。",
  },
};

// ── Diatonic Chord Functions ──
export type ChordFunction = "T" | "SD" | "D";

export interface DiatonicChord {
  degree: string;
  degreeNum: number;
  quality: string;
  function: ChordFunction;
  functionJa: string;
}

export const DIATONIC_MAJOR: DiatonicChord[] = [
  { degree: "I",   degreeNum: 0, quality: "major", function: "T",  functionJa: "トニック" },
  { degree: "II",  degreeNum: 1, quality: "minor", function: "SD", functionJa: "サブドミナント" },
  { degree: "III", degreeNum: 2, quality: "minor", function: "T",  functionJa: "トニック" },
  { degree: "IV",  degreeNum: 3, quality: "major", function: "SD", functionJa: "サブドミナント" },
  { degree: "V",   degreeNum: 4, quality: "major", function: "D",  functionJa: "ドミナント" },
  { degree: "VI",  degreeNum: 5, quality: "minor", function: "T",  functionJa: "トニック" },
  { degree: "VII", degreeNum: 6, quality: "dim",   function: "D",  functionJa: "ドミナント" },
];

export const DIATONIC_MAJOR_7TH: DiatonicChord[] = [
  { degree: "I",   degreeNum: 0, quality: "maj7",  function: "T",  functionJa: "トニック" },
  { degree: "II",  degreeNum: 1, quality: "min7",  function: "SD", functionJa: "サブドミナント" },
  { degree: "III", degreeNum: 2, quality: "min7",  function: "T",  functionJa: "トニック" },
  { degree: "IV",  degreeNum: 3, quality: "maj7",  function: "SD", functionJa: "サブドミナント" },
  { degree: "V",   degreeNum: 4, quality: "dom7",  function: "D",  functionJa: "ドミナント" },
  { degree: "VI",  degreeNum: 5, quality: "min7",  function: "T",  functionJa: "トニック" },
  { degree: "VII", degreeNum: 6, quality: "m7b5",  function: "D",  functionJa: "ドミナント" },
];

// ── Preset Progressions ──
export interface ChordProgression {
  name: string;
  nameJa: string;
  degrees: number[];
  description: string;
}

export const PRESET_PROGRESSIONS: ChordProgression[] = [
  { name: "Canon", nameJa: "カノン進行", degrees: [0, 4, 5, 2, 3, 0, 3, 4], description: "パッヘルベルのカノンで有名。J-POPの定番。" },
  { name: "Royal Road", nameJa: "王道進行", degrees: [3, 4, 2, 0], description: "IV→V→IIIm→I。J-POPで最も使われる進行。" },
  { name: "Just the Two of Us", nameJa: "丸サ進行", degrees: [3, 2, 0, 5], description: "IVM7→IIIm7→VIm。シティポップ・R&Bの定番。" },
  { name: "Komuro", nameJa: "小室進行", degrees: [5, 3, 4, 0], description: "VIm→IV→V→I。90年代J-POPの定番。" },
  { name: "Pop Punk", nameJa: "ポップパンク進行", degrees: [0, 4, 5, 3], description: "I→V→VIm→IV。洋楽ポップの大定番。" },
  { name: "Blues", nameJa: "12小節ブルース", degrees: [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4], description: "ブルース・ロックの基本形。" },
  { name: "Jazz II-V-I", nameJa: "ツーファイブワン", degrees: [1, 4, 0], description: "ジャズの最重要進行。IIm7→V7→IM7。" },
  { name: "Axis", nameJa: "Axis進行", degrees: [0, 4, 3, 5], description: "I→V→IV→VIm。Let It Beなど名曲多数。" },
];

// ── Utility Functions ──

export function noteIndex(note: string): number {
  const idx = NOTE_NAMES.indexOf(note as NoteName);
  if (idx >= 0) return idx;
  return NOTE_NAMES_FLAT.indexOf(note as never);
}

export function noteName(index: number, preferFlat = false): string {
  const i = ((index % 12) + 12) % 12;
  return preferFlat ? NOTE_NAMES_FLAT[i] : NOTE_NAMES[i];
}

export function midiToNoteName(midi: number): string {
  return NOTE_NAMES[midi % 12];
}

export function midiToOctave(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

export function noteToMidi(note: string, octave: number): number {
  return (octave + 1) * 12 + noteIndex(note);
}

export function getChordNotes(root: string, chordType: string): string[] {
  const chord = CHORD_TYPES[chordType];
  if (!chord) return [];
  const rootIdx = noteIndex(root);
  return chord.intervals.map(i => noteName(rootIdx + i));
}

export function getChordMidiNotes(root: string, octave: number, chordType: string): number[] {
  const chord = CHORD_TYPES[chordType];
  if (!chord) return [];
  const rootMidi = noteToMidi(root, octave);
  return chord.intervals.map(i => rootMidi + i);
}

export function getScaleNotes(root: string, scaleType: string): string[] {
  const scale = SCALE_TYPES[scaleType];
  if (!scale) return [];
  const rootIdx = noteIndex(root);
  return scale.intervals.map(i => noteName(rootIdx + i));
}

export function getScaleMidiNotes(root: string, octave: number, scaleType: string): number[] {
  const scale = SCALE_TYPES[scaleType];
  if (!scale) return [];
  const rootMidi = noteToMidi(root, octave);
  return scale.intervals.map(i => rootMidi + i);
}

export function getDiatonicChordName(key: string, degreeIndex: number, useSeventh: boolean): string {
  const scale = SCALE_TYPES.major;
  const rootIdx = noteIndex(key);
  const chordRoot = noteName(rootIdx + scale.intervals[degreeIndex]);
  const diatonic = useSeventh ? DIATONIC_MAJOR_7TH : DIATONIC_MAJOR;
  const chord = diatonic[degreeIndex];
  const chordType = CHORD_TYPES[chord.quality];
  return `${chordRoot}${chordType.symbol}`;
}

export function isBlackKey(noteIdx: number): boolean {
  return [1, 3, 6, 8, 10].includes(noteIdx % 12);
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function formatNoteName(midi: number): string {
  return `${midiToNoteName(midi)}${midiToOctave(midi)}`;
}
