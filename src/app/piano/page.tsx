"use client";

import { useState } from "react";
import { PianoKeyboard } from "@/components/piano-keyboard";
import { ChordDisplay } from "@/components/chord-display";
import { ScaleVisualizer } from "@/components/scale-visualizer";
import { playNote } from "@/lib/audio-engine";

export default function PianoPage() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [tab, setTab] = useState<"chord" | "scale">("chord");

  const handleNoteClick = (midi: number) => {
    playNote(midi);
    setActiveNotes((prev) => {
      if (prev.includes(midi)) return prev.filter((n) => n !== midi);
      return [...prev, midi];
    });
    setTimeout(() => {
      setActiveNotes((prev) => prev.filter((n) => n !== midi));
    }, 300);
  };

  const tabs = [
    { key: "chord" as const, label: "コード" },
    { key: "scale" as const, label: "スケール" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 style={{ fontFamily: "var(--font-display)" }}>
          インタラクティブピアノ
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          鍵盤をクリックして音を鳴らそう。コードやスケールの構成音を視覚的に確認できます。
        </p>
      </div>

      {/* Full Piano */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <PianoKeyboard
          startMidi={48}
          endMidi={84}
          activeNotes={activeNotes}
          onNoteClick={handleNoteClick}
          showLabels
        />
      </div>

      {/* Tab Switch */}
      <div className="flex justify-center gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-0 cursor-pointer"
            style={{
              background: tab === t.key ? "var(--color-primary)" : "var(--color-surface)",
              color: tab === t.key ? "oklch(0.15 0.02 75)" : "var(--color-text-secondary)",
              border: `1px solid ${tab === t.key ? "var(--color-primary)" : "var(--color-border)"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "chord" ? <ChordDisplay /> : <ScaleVisualizer />}
    </div>
  );
}
