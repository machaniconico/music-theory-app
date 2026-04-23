"use client";

import { useState } from "react";
import { NOTE_NAMES, CHORD_TYPES, getChordNotes, getChordMidiNotes, INTERVAL_NAMES } from "@/lib/music-theory";
import { playChord, playArpeggio } from "@/lib/audio-engine";
import { PianoKeyboard } from "./piano-keyboard";
import { StaffNotation } from "./staff-notation";

interface ChordDisplayProps {
  initialRoot?: string;
  initialType?: string;
}

export function ChordDisplay({ initialRoot = "C", initialType = "major" }: ChordDisplayProps) {
  const [root, setRoot] = useState(initialRoot);
  const [chordType, setChordType] = useState(initialType);

  const chord = CHORD_TYPES[chordType];
  const chordNotes = getChordNotes(root, chordType);
  const midiNotes = getChordMidiNotes(root, 4, chordType);

  const handlePlayChord = () => playChord(midiNotes);
  const handlePlayArpeggio = () => playArpeggio(midiNotes);

  return (
    <div
      className="rounded-2xl p-6 space-y-6"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Root selector */}
        <div className="space-y-1.5">
          <label
            className="block text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            ルート音
          </label>
          <div className="flex flex-wrap gap-1">
            {NOTE_NAMES.map((note) => (
              <button
                key={note}
                onClick={() => setRoot(note)}
                className="px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: root === note ? "var(--color-primary)" : "var(--color-bg)",
                  color: root === note ? "oklch(0.15 0.02 75)" : "var(--color-text-secondary)",
                  border: `1px solid ${root === note ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        {/* Chord type selector */}
        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label
            className="block text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            コードタイプ
          </label>
          <div className="flex flex-wrap gap-1">
            {Object.entries(CHORD_TYPES).map(([key, ct]) => (
              <button
                key={key}
                onClick={() => setChordType(key)}
                className="px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: chordType === key ? "var(--color-secondary)" : "var(--color-bg)",
                  color: chordType === key ? "oklch(0.95 0.01 290)" : "var(--color-text-secondary)",
                  border: `1px solid ${chordType === key ? "var(--color-secondary)" : "var(--color-border)"}`,
                }}
              >
                {ct.symbol || ct.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chord Name & Info */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <h3
          className="text-3xl font-bold m-0"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {root}{chord.symbol}
        </h3>
        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {chord.nameJa}
        </span>
      </div>

      <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {chord.description}
      </p>

      {/* Chord Notes */}
      <div className="flex flex-wrap gap-3">
        {chordNotes.map((note, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl"
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              minWidth: "64px",
            }}
          >
            <span className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
              {note}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              {INTERVAL_NAMES[chord.intervals[i]] || `+${chord.intervals[i]}半音`}
            </span>
          </div>
        ))}
      </div>

      {/* Staff Notation */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border-subtle)" }}
      >
        <StaffNotation chords={[midiNotes]} height={140} />
      </div>

      {/* Piano Visualization */}
      <PianoKeyboard
        startMidi={48}
        endMidi={72}
        highlightedNotes={midiNotes}
        onNoteClick={(midi) => {
          import("@/lib/audio-engine").then((m) => m.playNote(midi));
        }}
        compact
      />

      {/* Play buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePlayChord}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0"
          style={{
            background: "var(--color-primary)",
            color: "oklch(0.15 0.02 75)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-primary-hover)";
            e.currentTarget.style.boxShadow = "0 0 20px var(--color-primary-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-primary)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2.5v11l9-5.5z" />
          </svg>
          コードを鳴らす
        </button>
        <button
          onClick={handlePlayArpeggio}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: "transparent",
            color: "var(--color-primary)",
            border: "1px solid var(--color-primary-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-primary)";
            e.currentTarget.style.background = "var(--color-primary-muted)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-primary-muted)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 12L5 6L8 9L14 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          アルペジオ
        </button>
      </div>
    </div>
  );
}
