import {
  CHORD_TYPES,
  NOTE_NAMES,
  PRESET_PROGRESSIONS,
  SCALE_TYPES,
  getChordMidiNotes,
  getDiatonicChordName,
  noteIndex,
  noteName,
} from "./music-theory";
import { playChord, playNote, playProgression } from "./audio-engine";

export type EarTrainingMode = "interval" | "chord" | "progression";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuizOption {
  id: string;
  label: string;
  sublabel?: string;
}

export interface Quiz {
  mode: EarTrainingMode;
  prompt: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
  play: () => Promise<void>;
}

// ── Interval pools ──
const INTERVAL_POOLS: Record<Difficulty, { semitones: number; label: string }[]> = {
  easy: [
    { semitones: 4, label: "長3度 (M3)" },
    { semitones: 7, label: "完全5度 (P5)" },
    { semitones: 12, label: "オクターブ (P8)" },
    { semitones: 3, label: "短3度 (m3)" },
  ],
  medium: [
    { semitones: 2, label: "長2度 (M2)" },
    { semitones: 3, label: "短3度 (m3)" },
    { semitones: 4, label: "長3度 (M3)" },
    { semitones: 5, label: "完全4度 (P4)" },
    { semitones: 7, label: "完全5度 (P5)" },
    { semitones: 9, label: "長6度 (M6)" },
    { semitones: 12, label: "オクターブ (P8)" },
  ],
  hard: [
    { semitones: 1, label: "短2度 (m2)" },
    { semitones: 2, label: "長2度 (M2)" },
    { semitones: 3, label: "短3度 (m3)" },
    { semitones: 4, label: "長3度 (M3)" },
    { semitones: 5, label: "完全4度 (P4)" },
    { semitones: 6, label: "増4度 (A4/d5)" },
    { semitones: 7, label: "完全5度 (P5)" },
    { semitones: 8, label: "短6度 (m6)" },
    { semitones: 9, label: "長6度 (M6)" },
    { semitones: 10, label: "短7度 (m7)" },
    { semitones: 11, label: "長7度 (M7)" },
    { semitones: 12, label: "オクターブ (P8)" },
  ],
};

// ── Chord type pools ──
const CHORD_POOLS: Record<Difficulty, string[]> = {
  easy: ["major", "minor"],
  medium: ["major", "minor", "dim", "aug", "maj7", "min7", "dom7"],
  hard: [
    "major",
    "minor",
    "dim",
    "aug",
    "sus2",
    "sus4",
    "maj7",
    "min7",
    "dom7",
    "dim7",
    "m7b5",
    "add9",
  ],
};

// ── Progression pools ──
const PROGRESSION_POOLS: Record<Difficulty, number[]> = {
  easy: [0, 1, 3], // Canon, Royal Road, Komuro
  medium: [0, 1, 2, 3, 4, 7], // + 丸サ + ポップパンク + Axis
  hard: [0, 1, 2, 3, 4, 5, 6, 7], // all
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Interval Quiz ──
export function generateIntervalQuiz(difficulty: Difficulty): Quiz {
  const pool = INTERVAL_POOLS[difficulty];
  const correct = pickRandom(pool);
  const rootMidi = 60 + Math.floor(Math.random() * 5); // C4〜F4
  const intervalMidi = rootMidi + correct.semitones;

  // 4択（重複なし）
  const distractors = shuffle(pool.filter((p) => p.semitones !== correct.semitones)).slice(0, 3);
  const optionsRaw = shuffle([correct, ...distractors]);

  const options: QuizOption[] = optionsRaw.map((opt) => ({
    id: String(opt.semitones),
    label: opt.label,
  }));

  return {
    mode: "interval",
    prompt: "2つの音が順番に鳴ります。音程を当ててください。",
    options,
    correctId: String(correct.semitones),
    explanation: `正解は ${correct.label}。ルートから${correct.semitones}半音上です。`,
    play: async () => {
      await playNote(rootMidi, "4n");
      await new Promise((r) => setTimeout(r, 700));
      await playNote(intervalMidi, "4n");
    },
  };
}

// ── Chord Type Quiz ──
export function generateChordQuiz(difficulty: Difficulty): Quiz {
  const pool = CHORD_POOLS[difficulty];
  const correctType = pickRandom(pool);
  const rootIdx = Math.floor(Math.random() * 12);
  const root = NOTE_NAMES[rootIdx];
  const midiNotes = getChordMidiNotes(root, 4, correctType);

  const distractors = shuffle(pool.filter((t) => t !== correctType)).slice(0, 3);
  const optionsRaw = shuffle([correctType, ...distractors]);

  const options: QuizOption[] = optionsRaw.map((type) => {
    const chord = CHORD_TYPES[type];
    return {
      id: type,
      label: chord.nameJa,
      sublabel: chord.symbol || "(M)",
    };
  });

  const correctChord = CHORD_TYPES[correctType];

  return {
    mode: "chord",
    prompt: "コードが鳴ります。コードの種類を当ててください。",
    options,
    correctId: correctType,
    explanation: `正解は ${root}${correctChord.symbol}（${correctChord.nameJa}）。${correctChord.description}`,
    play: async () => {
      await playChord(midiNotes, "1n");
    },
  };
}

// ── Progression Quiz ──
export function generateProgressionQuiz(difficulty: Difficulty): Quiz {
  const poolIndices = PROGRESSION_POOLS[difficulty];
  const correctIdx = pickRandom(poolIndices);
  const correct = PRESET_PROGRESSIONS[correctIdx];

  // Cメジャーキーで固定（聞き取りやすさ優先）
  const key = "C";
  const majorScale = SCALE_TYPES.major.intervals;
  const rootIdx = noteIndex(key);

  const chordsMidi = correct.degrees.map((degree) => {
    const chordRoot = noteName(rootIdx + majorScale[degree]);
    return getChordMidiNotes(chordRoot, 3, getQualityForDegree(degree));
  });

  const distractorIndices = shuffle(poolIndices.filter((i) => i !== correctIdx)).slice(0, 3);
  const optionIndices = shuffle([correctIdx, ...distractorIndices]);

  const options: QuizOption[] = optionIndices.map((idx) => {
    const prog = PRESET_PROGRESSIONS[idx];
    return {
      id: String(idx),
      label: prog.nameJa,
      sublabel: prog.degrees
        .map((d) => getDiatonicChordName(key, d, false))
        .join(" → "),
    };
  });

  return {
    mode: "progression",
    prompt: "コード進行が鳴ります。どの進行か当ててください（キーはC）。",
    options,
    correctId: String(correctIdx),
    explanation: `正解は「${correct.nameJa}」。${correct.description}`,
    play: async () => {
      await playProgression(chordsMidi, 92);
    },
  };
}

function getQualityForDegree(degree: number): string {
  // メジャーキーのダイアトニックトライアド
  const qualities = ["major", "minor", "minor", "major", "major", "minor", "dim"];
  return qualities[degree];
}

// ── Dispatcher ──
export function generateQuiz(mode: EarTrainingMode, difficulty: Difficulty): Quiz {
  switch (mode) {
    case "interval":
      return generateIntervalQuiz(difficulty);
    case "chord":
      return generateChordQuiz(difficulty);
    case "progression":
      return generateProgressionQuiz(difficulty);
  }
}

export const MODE_META: Record<EarTrainingMode, { label: string; icon: string; description: string }> = {
  interval: {
    label: "音程",
    icon: "📏",
    description: "2音の音程差を聴き分ける",
  },
  chord: {
    label: "コード種別",
    icon: "🎶",
    description: "コードの響きから種類を判別",
  },
  progression: {
    label: "コード進行",
    icon: "🔄",
    description: "定番進行を聴き分ける",
  },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; description: string }> = {
  easy: { label: "初級", description: "基本的な選択肢" },
  medium: { label: "中級", description: "選択肢が増える" },
  hard: { label: "上級", description: "全選択肢でテスト" },
};

