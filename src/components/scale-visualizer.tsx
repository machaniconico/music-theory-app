"use client";

import { useState } from "react";
import { NOTE_NAMES, SCALE_TYPES, getScaleNotes, getScaleMidiNotes } from "@/lib/music-theory";
import { playNote } from "@/lib/audio-engine";
import { PianoKeyboard } from "./piano-keyboard";

interface ScaleVisualizerProps {
  initialRoot?: string;
  initialScale?: string;
}

export function ScaleVisualizer({ initialRoot = "C", initialScale = "major" }: ScaleVisualizerProps) {
  const [root, setRoot] = useState(initialRoot);
  const [scaleType, setScaleType] = useState(initialScale);

  const scale = SCALE_TYPES[scaleType];
  const scaleNotes = getScaleNotes(root, scaleType);
  const midiNotes = getScaleMidiNotes(root, 4, scaleType);

  const handlePlayScale = async () => {
    const { playNote: pn } = await import("@/lib/audio-engine");
    const allMidi = [...midiNotes, midiNotes[0] + 12];
    for (let i = 0; i < allMidi.length; i++) {
      setTimeout(() => pn(allMidi[i], "8n"), i * 250);
    }
  };

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
        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
            キー
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

        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label className="block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
            スケール
          </label>
          <div className="flex flex-wrap gap-1">
            {Object.entries(SCALE_TYPES).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setScaleType(key)}
                className="px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: scaleType === key ? "var(--color-accent-blue)" : "var(--color-bg)",
                  color: scaleType === key ? "oklch(0.95 0.01 240)" : "var(--color-text-secondary)",
                  border: `1px solid ${scaleType === key ? "var(--color-accent-blue)" : "var(--color-border)"}`,
                }}
              >
                {s.nameJa.split("（")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scale Name */}
      <div>
        <h3 className="text-2xl font-bold m-0" style={{ fontFamily: "var(--font-display)" }}>
          {root} {scale.nameJa}
        </h3>
        <p className="text-sm mt-1 mb-0" style={{ color: "var(--color-text-secondary)" }}>
          {scale.description}
        </p>
      </div>

      {/* Scale Notes */}
      <div className="flex flex-wrap gap-2">
        {scaleNotes.map((note, i) => (
          <button
            key={i}
            onClick={() => playNote(midiNotes[i])}
            className="flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 border-0"
            style={{
              background: i === 0 ? "var(--color-primary-muted)" : "var(--color-bg)",
              border: `1px solid ${i === 0 ? "var(--color-primary)" : "var(--color-border)"}`,
              minWidth: "56px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px oklch(0 0 0 / 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{i + 1}</span>
            <span className="text-lg font-bold" style={{ color: i === 0 ? "var(--color-primary)" : "var(--color-text)" }}>
              {note}
            </span>
          </button>
        ))}
      </div>

      {/* Piano */}
      <PianoKeyboard
        startMidi={48}
        endMidi={72}
        highlightedNotes={midiNotes}
        highlightColor="var(--color-accent-blue)"
        onNoteClick={(midi) => playNote(midi)}
        compact
      />

      {/* Play button */}
      <button
        onClick={handlePlayScale}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0"
        style={{ background: "var(--color-accent-blue)", color: "oklch(0.95 0.01 240)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 0 20px oklch(0.65 0.18 240 / 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2.5v11l9-5.5z" />
        </svg>
        スケールを再生
      </button>
    </div>
  );
}
