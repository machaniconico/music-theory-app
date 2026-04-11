"use client";

import { useState } from "react";
import { NOTE_NAMES, DIATONIC_MAJOR, CHORD_TYPES, SCALE_TYPES, PRESET_PROGRESSIONS, getDiatonicChordName, getChordMidiNotes } from "@/lib/music-theory";
import { playChord, playProgression, stopAll } from "@/lib/audio-engine";
import Link from "next/link";

export default function ProgressionsPage() {
  const [key, setKey] = useState("C");
  const [playingPreset, setPlayingPreset] = useState<string | null>(null);

  const diatonic = DIATONIC_MAJOR;
  const majorScale = SCALE_TYPES.major;
  const rootIdx = NOTE_NAMES.indexOf(key as never);

  const handlePlayPreset = async (preset: typeof PRESET_PROGRESSIONS[0]) => {
    if (playingPreset) {
      await stopAll();
      setPlayingPreset(null);
      return;
    }

    setPlayingPreset(preset.name);
    const chordsMidi = preset.degrees.map((d) => {
      const chordRootSemitone = rootIdx + majorScale.intervals[d];
      const quality = diatonic[d].quality;
      const chordType = CHORD_TYPES[quality];
      const rootMidi = 48 + (chordRootSemitone % 12);
      return chordType.intervals.map((i) => rootMidi + i);
    });

    await playProgression(chordsMidi, 100);
    setPlayingPreset(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          レッスン 5
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>コード進行</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          コード進行は音楽のストーリー。定番パターンを知れば、作曲の引き出しが一気に広がります。
        </p>
      </div>

      {/* 基本 */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>コード進行の基本</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          コード進行とは、コードを時間に沿って並べたものです。
          <strong style={{ color: "var(--color-text)" }}>トニック → サブドミナント → ドミナント → トニック</strong>
          という緊張と解決の流れが基本です。
        </p>
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
        >
          <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
            {[
              { label: "T (安定)", color: "var(--color-primary)" },
              { label: "→" },
              { label: "SD (動き)", color: "var(--color-accent-blue)" },
              { label: "→" },
              { label: "D (緊張)", color: "var(--color-accent-rose)" },
              { label: "→" },
              { label: "T (解決)", color: "var(--color-primary)" },
            ].map((item, i) =>
              item.color ? (
                <span key={i} className="px-3 py-2 rounded-lg font-bold" style={{ background: `${item.color}20`, color: item.color }}>
                  {item.label}
                </span>
              ) : (
                <span key={i} style={{ color: "var(--color-text-tertiary)" }}>{item.label}</span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ディグリーネーム */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>ディグリーネーム（度数表記）</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          コード進行はローマ数字（I, II, III...）で表記します。
          これにより<strong style={{ color: "var(--color-text)" }}>キーに関係なく進行のパターン</strong>を表現できます。
          「IV→V→IIIm→I」と書けば、どのキーでも同じ雰囲気の進行になります。
        </p>
      </section>

      {/* Key Selector */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>定番コード進行</h2>
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-xs mr-2" style={{ color: "var(--color-text-tertiary)" }}>キー:</span>
          {NOTE_NAMES.map((note) => (
            <button
              key={note}
              onClick={() => setKey(note)}
              className="px-2 py-1 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                background: key === note ? "var(--color-primary)" : "var(--color-bg)",
                color: key === note ? "oklch(0.15 0.02 75)" : "var(--color-text-secondary)",
                border: `1px solid ${key === note ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              {note}
            </button>
          ))}
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_PROGRESSIONS.map((preset) => {
            const chordNames = preset.degrees.map((d) => getDiatonicChordName(key, d, false));
            const isPlaying = playingPreset === preset.name;

            return (
              <button
                key={preset.name}
                onClick={() => handlePlayPreset(preset)}
                className="flex flex-col items-start gap-3 p-5 rounded-xl cursor-pointer transition-all duration-200 border-0 text-left w-full"
                style={{
                  background: isPlaying ? "var(--color-primary-muted)" : "var(--color-bg-elevated)",
                  border: `1px solid ${isPlaying ? "var(--color-primary)" : "var(--color-border-subtle)"}`,
                }}
                onMouseEnter={(e) => {
                  if (!isPlaying) {
                    e.currentTarget.style.borderColor = "var(--color-secondary)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isPlaying) {
                    e.currentTarget.style.borderColor = "var(--color-border-subtle)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold" style={{ color: "var(--color-text)" }}>
                    {preset.nameJa}
                  </span>
                  {isPlaying && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--color-primary)", color: "oklch(0.15 0.02 75)" }}>
                      再生中
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {chordNames.map((name, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="px-2 py-1 rounded text-sm font-mono font-bold" style={{ background: "var(--color-surface)", color: "var(--color-primary)" }}>
                        {name}
                      </span>
                      {i < chordNames.length - 1 && (
                        <span style={{ color: "var(--color-text-tertiary)" }}>→</span>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono" style={{ color: "var(--color-text-tertiary)" }}>
                    {preset.degrees.map((d) => diatonic[d].degree).join("→")}
                  </span>
                </div>
                <p className="text-xs m-0" style={{ color: "var(--color-text-secondary)" }}>
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section
        className="rounded-xl p-6 text-center space-y-3"
        style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
      >
        <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
          自分だけのコード進行を作ってみよう
        </p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all duration-200"
          style={{ background: "var(--color-secondary)", color: "oklch(0.95 0.01 290)" }}
        >
          コード進行ビルダーへ
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link href="/learn/diatonic" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline" style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4l-4 4 4 4" /></svg>
          前へ
        </Link>
        <Link href="/learn/tensions" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline" style={{ background: "var(--color-primary)", color: "oklch(0.15 0.02 75)" }}>
          次へ: テンション
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
        </Link>
      </div>
    </div>
  );
}
