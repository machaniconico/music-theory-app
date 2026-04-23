export type RhythmPattern = "off" | "eight-beat" | "bossa" | "four-on-floor";

export const RHYTHM_LABELS: Record<RhythmPattern, string> = {
  "off": "伴奏なし",
  "eight-beat": "8ビート",
  "bossa": "ボサノバ",
  "four-on-floor": "4つ打ち",
};

export interface DrumPatternSteps {
  kick: number[];
  snare: number[];
  hat: number[];
  /** Bass pattern: beat offsets within 2 beats (a chord), relative to chord start */
  bassBeats: number[];
}

export const DRUM_PATTERNS: Record<Exclude<RhythmPattern, "off">, DrumPatternSteps> = {
  "eight-beat": {
    kick: [0, 10],
    snare: [4, 12],
    hat: [0, 2, 4, 6, 8, 10, 12, 14],
    bassBeats: [0, 1],
  },
  "bossa": {
    kick: [0, 6, 10],
    snare: [3, 10, 13],
    hat: [0, 2, 4, 6, 8, 10, 12, 14],
    bassBeats: [0, 0.75, 1.25],
  },
  "four-on-floor": {
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hat: [2, 6, 10, 14],
    bassBeats: [0, 1],
  },
};
