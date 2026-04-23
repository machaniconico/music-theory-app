"use client";

import * as Tone from "tone";
import { DRUM_PATTERNS, RhythmPattern } from "./rhythm";
import type { MelodyNote } from "./audio-engine";

export interface RenderParams {
  chordsMidi: number[][];
  tempo: number;
  pattern: RhythmPattern;
  melody?: MelodyNote[];
  beatsPerChord?: number;
}

function midiToNote(midi: number): string {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const n = names[midi % 12];
  const o = Math.floor(midi / 12) - 1;
  return `${n}${o}`;
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bytesPerSample = 2;
  const dataLength = buffer.length * numChannels * bytesPerSample;
  const byteLength = 44 + dataLength;
  const out = new ArrayBuffer(byteLength);
  const view = new DataView(out);

  let offset = 0;
  const writeString = (s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset++, s.charCodeAt(i));
  };
  const writeUint32 = (v: number) => {
    view.setUint32(offset, v, true);
    offset += 4;
  };
  const writeUint16 = (v: number) => {
    view.setUint16(offset, v, true);
    offset += 2;
  };

  writeString("RIFF");
  writeUint32(byteLength - 8);
  writeString("WAVE");
  writeString("fmt ");
  writeUint32(16);
  writeUint16(1);
  writeUint16(numChannels);
  writeUint32(sampleRate);
  writeUint32(sampleRate * numChannels * bytesPerSample);
  writeUint16(numChannels * bytesPerSample);
  writeUint16(16);
  writeString("data");
  writeUint32(dataLength);

  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) channels.push(buffer.getChannelData(ch));

  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([out], { type: "audio/wav" });
}

/**
 * Render a progression+melody arrangement to a WAV Blob using Tone.Offline.
 */
export async function renderArrangementToWav(params: RenderParams): Promise<Blob> {
  const { chordsMidi, tempo, pattern, melody = [], beatsPerChord = 2 } = params;
  const beatDuration = 60 / tempo;
  const chordSpan = beatDuration * beatsPerChord;
  const sixteenth = beatDuration / 4;
  const stepsPerChord = beatsPerChord * 4;
  const totalChordTime = chordsMidi.length * chordSpan;
  const totalMelodyTime =
    melody.length > 0 ? melody[melody.length - 1].time + melody[melody.length - 1].duration : 0;
  const duration = Math.max(totalChordTime, totalMelodyTime) + 1;

  const toneBuffer = await Tone.Offline(() => {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle8" as never },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 },
      volume: -8,
    }).toDestination();

    const useDrums = pattern !== "off";
    const kick = useDrums
      ? new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 6,
          oscillator: { type: "sine" },
          envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
          volume: -4,
        }).toDestination()
      : null;
    const snare = useDrums
      ? new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.18, sustain: 0 },
          volume: -14,
        }).toDestination()
      : null;
    const hat = useDrums
      ? new Tone.MetalSynth({
          envelope: { attack: 0.001, decay: 0.08, release: 0.02 },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5,
          volume: -28,
        }).toDestination()
      : null;
    const bass = useDrums
      ? new Tone.MonoSynth({
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
        }).toDestination()
      : null;

    chordsMidi.forEach((chord, i) => {
      const time = i * chordSpan;
      const notes = chord.map(midiToNote);
      synth.triggerAttackRelease(notes, chordSpan * 0.9, time);

      if (useDrums && kick && snare && hat && bass) {
        const p = DRUM_PATTERNS[pattern as Exclude<RhythmPattern, "off">];
        const rootMidi = chord[0] - 12;
        const bassNote = midiToNote(Math.max(24, rootMidi));
        p.bassBeats.forEach((beat) => {
          const t = time + beat * beatDuration;
          bass.triggerAttackRelease(bassNote, beatDuration * 0.8, t);
        });
        p.kick.forEach((step) => {
          if (step >= stepsPerChord) return;
          kick.triggerAttackRelease("C1", "8n", time + step * sixteenth);
        });
        p.snare.forEach((step) => {
          if (step >= stepsPerChord) return;
          snare.triggerAttackRelease("8n", time + step * sixteenth);
        });
        p.hat.forEach((step) => {
          if (step >= stepsPerChord) return;
          hat.triggerAttackRelease("C5", "32n", time + step * sixteenth);
        });
      }
    });

    melody.forEach((note) => {
      synth.triggerAttackRelease(midiToNote(note.midi), note.duration, note.time);
    });
  }, duration);

  return audioBufferToWav(toneBuffer.get()!);
}

/** Trigger a browser download for a WAV Blob. */
export function downloadWav(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".wav") ? filename : `${filename}.wav`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
