"use client";

import * as Tone from "tone";
import { DRUM_PATTERNS, RhythmPattern } from "./rhythm";

let synth: Tone.PolySynth | null = null;
let kick: Tone.MembraneSynth | null = null;
let snare: Tone.NoiseSynth | null = null;
let hat: Tone.MetalSynth | null = null;
let bass: Tone.MonoSynth | null = null;
let reverb: Tone.Reverb | null = null;
let isInitialized = false;

function getReverbBus(): Tone.Reverb {
  if (!reverb) {
    reverb = new Tone.Reverb({ decay: 3, wet: 0.2 }).toDestination();
  }
  return reverb;
}

export function setReverbWet(wet: number): void {
  const r = getReverbBus();
  r.wet.value = Math.max(0, Math.min(1, wet));
}

export function getReverbWet(): number {
  if (!reverb) return 0.2;
  return typeof reverb.wet.value === "number" ? reverb.wet.value : 0.2;
}

async function ensureContext() {
  if (Tone.getContext().state !== "running") {
    await Tone.start();
  }
}

function getSynth(): Tone.PolySynth {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle8" as const },
      envelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.4,
        release: 1.2,
      },
      volume: -8,
    });
    synth.connect(getReverbBus());
    isInitialized = true;
  }
  return synth;
}

function getDrumKit() {
  if (!kick) {
    kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
      volume: -4,
    }).toDestination();
  }
  if (!snare) {
    snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.18, sustain: 0 },
      volume: -14,
    }).toDestination();
  }
  if (!hat) {
    hat = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.08, release: 0.02 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
      volume: -28,
    }).toDestination();
  }
  if (!bass) {
    bass = new Tone.MonoSynth({
      oscillator: { type: "sawtooth" },
      filter: { Q: 2, type: "lowpass", rolloff: -24 },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.4 },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.3,
        release: 0.5,
        baseFrequency: 200,
        octaves: 3,
      },
      volume: -10,
    }).toDestination();
  }
  return { kick, snare, hat, bass };
}

function midiToNote(midi: number): string {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const note = noteNames[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

export async function playNote(midi: number, duration = "8n") {
  await ensureContext();
  const s = getSynth();
  const note = midiToNote(midi);
  s.triggerAttackRelease(note, duration);
}

export async function playChord(midiNotes: number[], duration = "2n") {
  await ensureContext();
  const s = getSynth();
  const notes = midiNotes.map(midiToNote);
  s.triggerAttackRelease(notes, duration);
}

export async function playArpeggio(midiNotes: number[], tempo = 120) {
  await ensureContext();
  const s = getSynth();
  const interval = 60 / tempo;

  midiNotes.forEach((midi, i) => {
    const note = midiToNote(midi);
    const time = Tone.now() + i * interval * 0.5;
    s.triggerAttackRelease(note, "8n", time);
  });
}

export async function playProgression(
  chordsMidi: number[][],
  tempo = 100,
  onChordChange?: (index: number) => void
): Promise<void> {
  await ensureContext();
  const s = getSynth();
  const beatDuration = 60 / tempo;

  return new Promise((resolve) => {
    chordsMidi.forEach((chord, i) => {
      const time = Tone.now() + i * beatDuration * 2;
      const notes = chord.map(midiToNote);

      Tone.getTransport().scheduleOnce(() => {
        s.triggerAttackRelease(notes, `${beatDuration * 1.8}`, time);
        onChordChange?.(i);
      }, time);
    });

    const totalTime = chordsMidi.length * beatDuration * 2;
    Tone.getTransport().scheduleOnce(() => {
      onChordChange?.(-1);
      resolve();
    }, Tone.now() + totalTime);

    Tone.getTransport().start();
  });
}

export interface MelodyNote {
  midi: number;
  /** Offset from start in seconds */
  time: number;
  /** Duration in seconds */
  duration: number;
}

/**
 * Play a progression of chords AND a melody simultaneously.
 * Returns a promise that resolves when everything finished.
 */
export async function playMelodyWithChords(
  chordsMidi: number[][],
  tempo: number,
  melody: MelodyNote[],
  onChordChange?: (index: number) => void,
): Promise<void> {
  await ensureContext();
  const s = getSynth();
  const beatDuration = 60 / tempo;
  const chordSpan = beatDuration * 2;

  return new Promise((resolve) => {
    const startAt = Tone.now() + 0.1;

    chordsMidi.forEach((chord, i) => {
      const time = startAt + i * chordSpan;
      const notes = chord.map(midiToNote);
      Tone.getTransport().scheduleOnce(() => {
        s.triggerAttackRelease(notes, `${chordSpan * 0.9}`, time);
        onChordChange?.(i);
      }, time);
    });

    melody.forEach((note) => {
      const time = startAt + note.time;
      Tone.getTransport().scheduleOnce(() => {
        s.triggerAttackRelease(midiToNote(note.midi), note.duration, time);
      }, time);
    });

    const totalChordTime = chordsMidi.length * chordSpan;
    const totalMelodyTime = melody.length > 0
      ? melody[melody.length - 1].time + melody[melody.length - 1].duration
      : 0;
    const total = Math.max(totalChordTime, totalMelodyTime) + 0.5;

    Tone.getTransport().scheduleOnce(() => {
      onChordChange?.(-1);
      resolve();
    }, startAt + total);

    Tone.getTransport().start();
  });
}

/**
 * Play chords + optional drum pattern + optional bass + optional melody.
 */
export async function playArrangement(params: {
  chordsMidi: number[][];
  tempo: number;
  pattern: RhythmPattern;
  melody?: MelodyNote[];
  onChordChange?: (i: number) => void;
  /** Beats per chord. Default 2. */
  beatsPerChord?: number;
}): Promise<void> {
  const {
    chordsMidi,
    tempo,
    pattern,
    melody = [],
    onChordChange,
    beatsPerChord = 2,
  } = params;
  await ensureContext();
  const s = getSynth();
  const k = pattern !== "off" ? getDrumKit() : null;

  const beatDuration = 60 / tempo;
  const sixteenth = beatDuration / 4;
  const chordSpan = beatDuration * beatsPerChord;
  const stepsPerChord = beatsPerChord * 4;

  const startAt = Tone.now() + 0.15;

  return new Promise((resolve) => {
    chordsMidi.forEach((chord, i) => {
      const time = startAt + i * chordSpan;
      const notes = chord.map(midiToNote);
      Tone.getTransport().scheduleOnce(() => {
        s.triggerAttackRelease(notes, `${chordSpan * 0.9}`, time);
        onChordChange?.(i);
      }, time);

      if (k && pattern !== "off") {
        const p = DRUM_PATTERNS[pattern];

        // Bass: root an octave below, or at chord[0]-12 if low enough
        const rootMidi = chord[0] - 12;
        const bassNote = midiToNote(Math.max(24, rootMidi));
        p.bassBeats.forEach((beat) => {
          const t = time + beat * beatDuration;
          Tone.getTransport().scheduleOnce(() => {
            k.bass!.triggerAttackRelease(bassNote, beatDuration * 0.8, t);
          }, t);
        });

        p.kick.forEach((step) => {
          if (step >= stepsPerChord) return;
          const t = time + step * sixteenth;
          Tone.getTransport().scheduleOnce(() => {
            k.kick!.triggerAttackRelease("C1", "8n", t);
          }, t);
        });
        p.snare.forEach((step) => {
          if (step >= stepsPerChord) return;
          const t = time + step * sixteenth;
          Tone.getTransport().scheduleOnce(() => {
            k.snare!.triggerAttackRelease("8n", t);
          }, t);
        });
        p.hat.forEach((step) => {
          if (step >= stepsPerChord) return;
          const t = time + step * sixteenth;
          Tone.getTransport().scheduleOnce(() => {
            k.hat!.triggerAttackRelease("C5", "32n", t);
          }, t);
        });
      }
    });

    melody.forEach((note) => {
      const t = startAt + note.time;
      Tone.getTransport().scheduleOnce(() => {
        s.triggerAttackRelease(midiToNote(note.midi), note.duration, t);
      }, t);
    });

    const totalChordTime = chordsMidi.length * chordSpan;
    const totalMelodyTime =
      melody.length > 0
        ? melody[melody.length - 1].time + melody[melody.length - 1].duration
        : 0;
    const total = Math.max(totalChordTime, totalMelodyTime) + 0.5;

    Tone.getTransport().scheduleOnce(() => {
      onChordChange?.(-1);
      resolve();
    }, startAt + total);

    Tone.getTransport().start();
  });
}

export async function stopAll() {
  if (synth) {
    synth.releaseAll();
  }
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
}

export function isAudioInitialized(): boolean {
  return isInitialized;
}
