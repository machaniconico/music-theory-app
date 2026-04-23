"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { NOTE_NAMES, DIATONIC_MAJOR, DIATONIC_MAJOR_7TH, CHORD_TYPES, SCALE_TYPES } from "@/lib/music-theory";
import { analyzeProgression } from "@/lib/analyzer";
import { playProgression } from "@/lib/audio-engine";

const FUNCTION_COLOR: Record<string, string> = {
  T: "var(--color-primary)",
  SD: "var(--color-accent-blue)",
  D: "var(--color-accent-rose)",
};

export default function AnalyzePage() {
  const [key, setKey] = useState("C");
  const [useSeventh, setUseSeventh] = useState(false);
  const [degrees, setDegrees] = useState<number[]>([0, 4, 5, 3]);

  const diatonic = useSeventh ? DIATONIC_MAJOR_7TH : DIATONIC_MAJOR;
  const majorScale = SCALE_TYPES.major;
  const rootIdx = NOTE_NAMES.indexOf(key as never);

  const analysis = useMemo(() => analyzeProgression(degrees, key, useSeventh), [degrees, key, useSeventh]);

  const chordsMidi = useMemo(
    () =>
      degrees.map((d) => {
        const quality = diatonic[d].quality;
        const chordType = CHORD_TYPES[quality];
        const rootMidi = 48 + ((rootIdx + majorScale.intervals[d]) % 12);
        return chordType.intervals.map((i) => rootMidi + i);
      }),
    [degrees, diatonic, majorScale, rootIdx],
  );

  const handlePlay = () => {
    playProgression(chordsMidi, 90);
  };

  const append = (deg: number) => setDegrees((prev) => [...prev, deg]);
  const removeAt = (idx: number) => setDegrees((prev) => prev.filter((_, i) => i !== idx));
  const clear = () => setDegrees([]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          Phase 6 · ツール
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>🔎 楽曲解析モード</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          コード進行を入力すると、<strong style={{ color: "var(--color-text)" }}>機能 (T/SD/D)・カデンツ・特徴的な進行パターン</strong>
          を自動で判定します。耳コピしたコード進行の構造が一目で分かります。
        </p>
      </div>

      {/* Controls */}
      <section
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
              キー
            </label>
            <div className="flex flex-wrap gap-1">
              {NOTE_NAMES.map((note) => (
                <button
                  key={note}
                  onClick={() => setKey(note)}
                  className="px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
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
          </div>
          <button
            onClick={() => setUseSeventh(!useSeventh)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              background: useSeventh ? "var(--color-secondary)" : "var(--color-bg)",
              color: useSeventh ? "oklch(0.95 0.01 290)" : "var(--color-text-secondary)",
              border: `1px solid ${useSeventh ? "var(--color-secondary)" : "var(--color-border)"}`,
            }}
          >
            {useSeventh ? "7thコード ON" : "3和音"}
          </button>
          <div className="ml-auto flex gap-2">
            <button
              onClick={clear}
              className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-0"
              style={{ background: "var(--color-bg)", color: "var(--color-text-tertiary)", border: "1px solid var(--color-border)" }}
            >
              クリア
            </button>
            <button
              onClick={handlePlay}
              disabled={degrees.length === 0}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0 disabled:opacity-40"
              style={{ background: "var(--color-accent-green)", color: "oklch(0.15 0.02 155)" }}
            >
              ▶ 再生
            </button>
          </div>
        </div>

        {/* Input: append chord buttons */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
            コードを追加
          </label>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {diatonic.map((d, i) => {
              const funcColor = FUNCTION_COLOR[d.function];
              return (
                <button
                  key={i}
                  onClick={() => append(i)}
                  className="flex flex-col items-center gap-0.5 p-2 rounded-lg cursor-pointer transition-all duration-150 border-0"
                  style={{
                    background: "var(--color-bg)",
                    border: `1px solid ${funcColor}44`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = funcColor; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${funcColor}44`; }}
                >
                  <span className="text-[10px] font-bold" style={{ color: funcColor }}>{d.degree}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                    {analysis.chordNames[0] !== undefined ? "" : ""}
                    {d.degree}
                  </span>
                  <span className="text-[9px]" style={{ color: "var(--color-text-tertiary)" }}>
                    {d.functionJa}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progression display */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
            現在の進行 ({degrees.length} コード)
          </label>
          {degrees.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              上のコードを押して進行を作成
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {degrees.map((d, i) => {
                const chord = diatonic[d];
                const funcColor = FUNCTION_COLOR[chord.function];
                return (
                  <div
                    key={i}
                    className="group relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl"
                    style={{
                      background: "var(--color-bg)",
                      border: `2px solid ${funcColor}44`,
                      minWidth: 72,
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: funcColor }}>{chord.degree}</span>
                    <span className="text-base font-bold" style={{ color: "var(--color-text)" }}>
                      {analysis.chordNames[i]}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: `${funcColor}22`, color: funcColor }}
                    >
                      {chord.function}
                    </span>
                    <button
                      onClick={() => removeAt(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0"
                      style={{ background: "var(--color-accent-rose)", color: "white" }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Analysis Results */}
      {degrees.length > 0 && (
        <section className="space-y-6">
          <h2 style={{ fontFamily: "var(--font-display)" }}>📊 解析結果</h2>

          {/* Summary */}
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--color-bg-elevated)", borderLeft: "3px solid var(--color-primary)" }}
          >
            <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
              {analysis.summary}
            </p>
          </div>

          {/* Function flow */}
          <div className="space-y-3">
            <h3 className="text-base font-bold m-0" style={{ fontFamily: "var(--font-display)" }}>
              機能の流れ
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {analysis.functions.map((f, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: `${FUNCTION_COLOR[f]}22`,
                      color: FUNCTION_COLOR[f],
                    }}
                  >
                    {f}
                  </span>
                  {i < analysis.functions.length - 1 && (
                    <span style={{ color: "var(--color-text-tertiary)" }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Cadences */}
          {analysis.cadences.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold m-0" style={{ fontFamily: "var(--font-display)" }}>
                カデンツ（終止形）
              </h3>
              <div className="space-y-2">
                {analysis.cadences.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 space-y-1"
                    style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-accent-blue)" }}
                  >
                    <p className="text-sm font-bold m-0" style={{ color: "var(--color-accent-blue)" }}>
                      {c.label} <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>（位置: {c.position + 1}〜{c.position + 2} 番目）</span>
                    </p>
                    <p className="text-xs m-0" style={{ color: "var(--color-text-secondary)" }}>{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special patterns */}
          {analysis.specialProgressions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold m-0" style={{ fontFamily: "var(--font-display)" }}>
                検出された定番進行
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.specialProgressions.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 space-y-2"
                    style={{ background: "var(--color-bg-elevated)", borderLeft: "3px solid var(--color-secondary)" }}
                  >
                    <p className="text-sm font-bold m-0" style={{ color: "var(--color-secondary)" }}>
                      {p.nameJa}
                    </p>
                    <p className="text-xs m-0" style={{ color: "var(--color-text-secondary)" }}>{p.description}</p>
                    <p className="text-[10px] m-0" style={{ color: "var(--color-text-tertiary)" }}>
                      位置: {p.range[0] + 1} 〜 {p.range[1] + 1} 番目
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4l-4 4 4 4" />
          </svg>
          ホームへ
        </Link>
      </div>
    </div>
  );
}
