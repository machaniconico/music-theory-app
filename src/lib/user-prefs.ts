"use client";

import type { RhythmPattern } from "./rhythm";
import type { InstrumentPreset } from "./audio-engine";

const STORAGE_KEY = "music-theory-lab.builder-prefs.v1";

export interface BuilderPrefs {
  key: string;
  useSeventh: boolean;
  tempo: number;
  rhythm: RhythmPattern;
  reverbPct: number;
  beatsPerChord: number;
  instrument: InstrumentPreset;
}

export const DEFAULT_PREFS: BuilderPrefs = {
  key: "C",
  useSeventh: false,
  tempo: 100,
  rhythm: "off",
  reverbPct: 20,
  beatsPerChord: 2,
  instrument: "piano",
};

export function saveBuilderPrefs(prefs: Partial<BuilderPrefs>): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadBuilderPrefs();
    const merged = { ...existing, ...prefs };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // noop
  }
}

export function loadBuilderPrefs(): BuilderPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PREFS;
    const validRhythm: RhythmPattern[] = ["off", "eight-beat", "bossa", "four-on-floor"];
    const validInstrument: InstrumentPreset[] = ["piano", "electric-piano", "organ", "strings", "guitar"];
    return {
      key: typeof parsed.key === "string" ? parsed.key : DEFAULT_PREFS.key,
      useSeventh: typeof parsed.useSeventh === "boolean" ? parsed.useSeventh : DEFAULT_PREFS.useSeventh,
      tempo: typeof parsed.tempo === "number" ? parsed.tempo : DEFAULT_PREFS.tempo,
      rhythm: validRhythm.includes(parsed.rhythm) ? parsed.rhythm : DEFAULT_PREFS.rhythm,
      reverbPct: typeof parsed.reverbPct === "number" ? parsed.reverbPct : DEFAULT_PREFS.reverbPct,
      beatsPerChord: typeof parsed.beatsPerChord === "number" ? parsed.beatsPerChord : DEFAULT_PREFS.beatsPerChord,
      instrument: validInstrument.includes(parsed.instrument) ? parsed.instrument : DEFAULT_PREFS.instrument,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}
