"use client";

import { useEffect, useState } from "react";
import { PianoKeyboard } from "@/components/piano-keyboard";
import { ChordDisplay } from "@/components/chord-display";
import { ScaleVisualizer } from "@/components/scale-visualizer";
import {
  InstrumentPreset,
  INSTRUMENT_LABELS,
  playNote,
  setInstrument,
  setReverbWet,
} from "@/lib/audio-engine";

export default function PianoPage() {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [tab, setTab] = useState<"chord" | "scale">("chord");
  const [reverbWet, setReverbWetState] = useState(20);
  const [instrument, setInstrumentState] = useState<InstrumentPreset>("piano");

  useEffect(() => {
    setReverbWet(reverbWet / 100);
  }, [reverbWet]);

  useEffect(() => {
    setInstrument(instrument);
  }, [instrument]);

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
        <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
          ⌨ <span className="font-mono">a s d f g h j k l</span>（白鍵） / <span className="font-mono">w e t y u</span>（黒鍵） でも演奏できます
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
          enableKeyboard
        />
      </div>

      {/* FX */}
      <div className="flex justify-center items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            音色
          </span>
          <select
            value={instrument}
            onChange={(e) => setInstrumentState(e.target.value as InstrumentPreset)}
            className="px-2 py-1.5 rounded-lg text-sm"
            style={{
              background: "var(--color-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            {(Object.keys(INSTRUMENT_LABELS) as InstrumentPreset[]).map((p) => (
              <option key={p} value={p}>
                {INSTRUMENT_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            🌊 Reverb
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={reverbWet}
            onChange={(e) => setReverbWetState(Number(e.target.value))}
            className="w-40 accent-amber-400"
          />
          <span
            className="text-xs font-mono w-8"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {reverbWet}%
          </span>
        </div>
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
