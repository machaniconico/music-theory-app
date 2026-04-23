"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { NOTE_NAMES } from "@/lib/music-theory";
import { generateDirectModulation, generatePivotModulation, ModulationProgression } from "@/lib/modulation";
import { playProgression } from "@/lib/audio-engine";
import { LessonQuiz } from "@/components/lesson-quiz";

const MOD_TYPES = ["pivot", "direct-semi", "direct-whole"] as const;
type ModType = (typeof MOD_TYPES)[number];

const MOD_TYPE_LABEL: Record<ModType, string> = {
  pivot: "ピボットコード転調",
  "direct-semi": "半音上げ直接転調",
  "direct-whole": "全音上げ直接転調",
};

export default function ModulationPage() {
  const [fromKey, setFromKey] = useState("C");
  const [toKey, setToKey] = useState("G");
  const [type, setType] = useState<ModType>("pivot");

  const progression = useMemo<ModulationProgression>(() => {
    if (type === "pivot") return generatePivotModulation(fromKey, toKey);
    if (type === "direct-semi") return generateDirectModulation(fromKey, 1);
    return generateDirectModulation(fromKey, 2);
  }, [fromKey, toKey, type]);

  const handlePlay = () => {
    playProgression(
      progression.steps.map((s) => s.midiNotes),
      90,
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          Phase 6 · レッスン 9
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>転調（モジュレーション）</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          曲の途中で<strong style={{ color: "var(--color-text)" }}>キー（調）を切り替える</strong>
          テクニック。クライマックスで感情を高めたり、雰囲気を一新するのに使います。
        </p>
      </div>

      {/* 解説 */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>代表的な2つの方法</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5 space-y-2"
            style={{ background: "var(--color-bg-elevated)", borderLeft: "3px solid var(--color-primary)" }}
          >
            <h3 className="text-base font-bold m-0" style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}>
              ピボットコード転調
            </h3>
            <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
              両キーに共通するコードを「蝶番」として使い、滑らかに移行する。<br />
              例: Cキーの vi(Am) → Fキーの iii(Am) として解釈し直す。
            </p>
          </div>
          <div
            className="rounded-xl p-5 space-y-2"
            style={{ background: "var(--color-bg-elevated)", borderLeft: "3px solid var(--color-accent-rose)" }}
          >
            <h3 className="text-base font-bold m-0" style={{ color: "var(--color-accent-rose)", fontFamily: "var(--font-display)" }}>
              直接転調 (Direct Modulation)
            </h3>
            <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
              前ぶれなしに半音/全音上げる。サビ繰り返しでの「キー上げ」が最も身近。<br />
              効果は劇的で、感情のピークを作るのに最適。
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>転調を試す</h2>
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
        >
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                転調の種類
              </label>
              <div className="flex flex-wrap gap-2">
                {MOD_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      background: type === t ? "var(--color-primary)" : "var(--color-bg)",
                      color: type === t ? "oklch(0.15 0.02 75)" : "var(--color-text-secondary)",
                      border: `1px solid ${type === t ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    {MOD_TYPE_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                開始キー
              </label>
              <div className="flex flex-wrap gap-1">
                {NOTE_NAMES.map((note) => (
                  <button
                    key={note}
                    onClick={() => setFromKey(note)}
                    className="px-2 py-1 rounded text-xs font-medium transition-all duration-150"
                    style={{
                      background: fromKey === note ? "var(--color-primary)" : "var(--color-bg)",
                      color: fromKey === note ? "oklch(0.15 0.02 75)" : "var(--color-text-secondary)",
                      border: `1px solid ${fromKey === note ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            {type === "pivot" && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-text-tertiary)" }}>
                  目標キー
                </label>
                <div className="flex flex-wrap gap-1">
                  {NOTE_NAMES.map((note) => (
                    <button
                      key={note}
                      onClick={() => setToKey(note)}
                      className="px-2 py-1 rounded text-xs font-medium transition-all duration-150"
                      style={{
                        background: toKey === note ? "var(--color-secondary)" : "var(--color-bg)",
                        color: toKey === note ? "oklch(0.95 0.01 290)" : "var(--color-text-secondary)",
                        border: `1px solid ${toKey === note ? "var(--color-secondary)" : "var(--color-border)"}`,
                      }}
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-base font-bold m-0" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                {progression.title}
              </h3>
              <p className="text-sm m-0 mt-1" style={{ color: "var(--color-text-secondary)" }}>
                {progression.description}
              </p>
            </div>
            <button
              onClick={handlePlay}
              className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border-0"
              style={{ background: "var(--color-accent-green)", color: "oklch(0.15 0.02 155)" }}
            >
              ▶ 再生
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {progression.steps.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl"
                style={{
                  background: "var(--color-bg)",
                  border: `1px solid ${step.inTargetKey ? "var(--color-accent-rose)" : "var(--color-border)"}`,
                }}
              >
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: step.inTargetKey ? "var(--color-accent-rose)" : "var(--color-text-tertiary)" }}
                >
                  {step.label}
                </span>
                <span className="text-base font-bold" style={{ color: "var(--color-text)" }}>
                  {step.chordSymbol}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz */}
      <LessonQuiz lessonId="modulation" />

      {/* Navigation */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link
          href="/learn/modal-interchange"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4l-4 4 4 4" />
          </svg>
          前へ
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ background: "var(--color-primary)", color: "oklch(0.15 0.02 75)" }}
        >
          ホームへ
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
