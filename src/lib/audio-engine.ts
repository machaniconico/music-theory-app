"use client";

import * as Tone from "tone";

let synth: Tone.PolySynth | null = null;
let isInitialized = false;

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
    }).toDestination();
    isInitialized = true;
  }
  return synth;
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
