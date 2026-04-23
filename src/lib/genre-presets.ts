import { RhythmPattern } from "./rhythm";

export interface GenrePreset {
  name: string;
  /** Roman degree indices (0 = I, 1 = II, ...) */
  degrees: number[];
  useSeventh: boolean;
  rhythm: RhythmPattern;
  tempo: number;
  /** Suggested chord-length in beats */
  beatsPerChord: number;
  description: string;
}

export const GENRE_PRESETS: Record<string, GenrePreset[]> = {
  Pop: [
    {
      name: "王道進行 (J-POP)",
      degrees: [3, 4, 2, 5],
      useSeventh: false,
      rhythm: "eight-beat",
      tempo: 110,
      beatsPerChord: 2,
      description: "IV→V→IIIm→VIm。J-POPで最も使われる進行。",
    },
    {
      name: "小室進行",
      degrees: [5, 3, 4, 0],
      useSeventh: false,
      rhythm: "eight-beat",
      tempo: 125,
      beatsPerChord: 2,
      description: "VIm→IV→V→I。90年代J-POPの定番。",
    },
    {
      name: "カノン進行",
      degrees: [0, 4, 5, 2, 3, 0, 3, 4],
      useSeventh: false,
      rhythm: "eight-beat",
      tempo: 100,
      beatsPerChord: 2,
      description: "パッヘルベルのカノンから。普遍的に美しい。",
    },
    {
      name: "Axis 進行",
      degrees: [0, 4, 3, 5],
      useSeventh: false,
      rhythm: "eight-beat",
      tempo: 120,
      beatsPerChord: 2,
      description: "I→V→IV→VIm。Let It Be など名曲多数。",
    },
  ],
  Jazz: [
    {
      name: "II-V-I",
      degrees: [1, 4, 0],
      useSeventh: true,
      rhythm: "off",
      tempo: 130,
      beatsPerChord: 4,
      description: "ジャズの最重要進行。IIm7→V7→IM7。",
    },
    {
      name: "I-VI-II-V (リズム・チェンジ)",
      degrees: [0, 5, 1, 4],
      useSeventh: true,
      rhythm: "off",
      tempo: 180,
      beatsPerChord: 2,
      description: "スタンダード曲の定番ループ。Anthropology 等。",
    },
    {
      name: "Autumn Leaves 系",
      degrees: [1, 4, 0, 3, 5, 4, 0, 0],
      useSeventh: true,
      rhythm: "off",
      tempo: 110,
      beatsPerChord: 2,
      description: "マイナーIIm-V-Iを含むスタンダード定番循環。",
    },
    {
      name: "Blues in Major",
      degrees: [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4],
      useSeventh: true,
      rhythm: "off",
      tempo: 120,
      beatsPerChord: 4,
      description: "12小節ブルース。ドミナント7thで展開。",
    },
  ],
  "R&B": [
    {
      name: "丸サ進行",
      degrees: [3, 2, 0, 5],
      useSeventh: true,
      rhythm: "eight-beat",
      tempo: 95,
      beatsPerChord: 2,
      description: "IVM7→IIIm7→VIm。シティポップ・R&Bの大定番。",
    },
    {
      name: "Neo-Soul Loop",
      degrees: [1, 4, 0, 0],
      useSeventh: true,
      rhythm: "eight-beat",
      tempo: 85,
      beatsPerChord: 2,
      description: "IIm7→V7→IM7 をループ。D'Angelo 系のグルーヴ。",
    },
    {
      name: "Doo-Wop (50s)",
      degrees: [0, 5, 3, 4],
      useSeventh: false,
      rhythm: "eight-beat",
      tempo: 90,
      beatsPerChord: 4,
      description: "I→VIm→IV→V。オールディーズ定番。",
    },
  ],
  Bossa: [
    {
      name: "Girl from Ipanema 風",
      degrees: [0, 1, 4, 0],
      useSeventh: true,
      rhythm: "bossa",
      tempo: 125,
      beatsPerChord: 4,
      description: "IM7→IIm7→V7→IM7。A.C.Jobimの定番循環。",
    },
    {
      name: "Corcovado 風",
      degrees: [0, 5, 1, 4],
      useSeventh: true,
      rhythm: "bossa",
      tempo: 110,
      beatsPerChord: 2,
      description: "IM7→VIm7→IIm7→V7。しっとりボサ。",
    },
    {
      name: "Samba Loop",
      degrees: [0, 4, 5, 4],
      useSeventh: true,
      rhythm: "bossa",
      tempo: 140,
      beatsPerChord: 2,
      description: "I→V→VIm→V で推進感。軽快なサンバ。",
    },
  ],
  Blues: [
    {
      name: "12 Bar Blues",
      degrees: [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4],
      useSeventh: true,
      rhythm: "four-on-floor",
      tempo: 105,
      beatsPerChord: 4,
      description: "定番の12小節構造。I7-IV7-V7。",
    },
    {
      name: "Quick Change Blues",
      degrees: [0, 3, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4],
      useSeventh: true,
      rhythm: "four-on-floor",
      tempo: 110,
      beatsPerChord: 4,
      description: "2小節目でIVへ早変わりするバリエーション。",
    },
    {
      name: "Minor Blues",
      degrees: [5, 5, 5, 5, 1, 1, 5, 5, 4, 1, 5, 4],
      useSeventh: true,
      rhythm: "four-on-floor",
      tempo: 90,
      beatsPerChord: 4,
      description: "マイナーキーのブルース。スローで渋い。",
    },
  ],
  "Lo-Fi": [
    {
      name: "Study Lofi Loop",
      degrees: [0, 2, 3, 4],
      useSeventh: true,
      rhythm: "eight-beat",
      tempo: 72,
      beatsPerChord: 2,
      description: "IM7→IIIm7→IVM7→V7。勉強用BGMの定番。",
    },
    {
      name: "Mellow Jazz-Hop",
      degrees: [1, 4, 2, 5],
      useSeventh: true,
      rhythm: "eight-beat",
      tempo: 80,
      beatsPerChord: 2,
      description: "IIm7→V7→IIIm7→VIm。Lo-Fi Hip-Hop。",
    },
    {
      name: "Dreamy Pad",
      degrees: [3, 0, 5, 4],
      useSeventh: true,
      rhythm: "off",
      tempo: 70,
      beatsPerChord: 4,
      description: "IVM7→IM7→VIm7→V7。ゆったり浮遊感。",
    },
  ],
};

export const GENRE_NAMES = Object.keys(GENRE_PRESETS);
