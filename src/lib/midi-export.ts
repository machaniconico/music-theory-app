import { Midi } from "@tonejs/midi";
import type { MelodyNote } from "./audio-engine";

/**
 * Build a MIDI Blob from chord progression + melody.
 * Chord track & melody track are separated so DAWs can isolate them.
 */
export function exportArrangementToMidi(
  chordsMidi: number[][],
  melody: MelodyNote[],
  tempo: number,
): Blob {
  const midi = new Midi();
  midi.header.setTempo(tempo);

  const chordSpan = (60 / tempo) * 2;

  const chordTrack = midi.addTrack();
  chordTrack.name = "Chords";
  chordsMidi.forEach((chord, i) => {
    const startTime = i * chordSpan;
    chord.forEach((noteMidi) => {
      chordTrack.addNote({
        midi: noteMidi,
        time: startTime,
        duration: chordSpan * 0.95,
        velocity: 0.7,
      });
    });
  });

  if (melody.length > 0) {
    const melodyTrack = midi.addTrack();
    melodyTrack.name = "Melody";
    melody.forEach((n) => {
      melodyTrack.addNote({
        midi: n.midi,
        time: n.time,
        duration: Math.max(0.05, n.duration),
        velocity: 0.85,
      });
    });
  }

  const bytes = midi.toArray();
  return new Blob([new Uint8Array(bytes)], { type: "audio/midi" });
}

export function downloadMidi(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".mid") ? filename : `${filename}.mid`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
