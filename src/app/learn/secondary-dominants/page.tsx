"use client";

import { useState } from "react";
import Link from "next/link";
import { NOTE_NAMES } from "@/lib/music-theory";
import { getSecondaryDominants } from "@/lib/secondary-dominants";
import { playChord, playProgression } from "@/lib/audio-engine";
import { LessonQuiz } from "@/components/lesson-quiz";

export default function SecondaryDominantsPage() {
  const [key, setKey] = useState("C");
  const seconds = getSecondaryDominants(key);

  const playOne = (midiNotes: number[]) => {
    playChord(midiNotes, "4n");
  };

  const playResolution = async (chord: number[], target: number[]) => {
    await playProgression([chord, target], 80);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          Phase 6 · レッスン 7
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>セカンダリードミナント</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          ダイアトニックコード以外のドミナント7thを使って、
          <strong style={{ color: "var(--color-text)" }}>一時的に別の和音を「仮のトニック」として強調する</strong>
          テクニックです。強進行（完全5度下行）で行き先のコードに推進力を与えます。
        </p>
      </div>

      {/* 解説 */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>基本のしくみ</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          例えばCメジャーキーでは、<strong style={{ color: "var(--color-text)" }}>Vコード = G7</strong>。
          ここに<strong style={{ color: "var(--color-text)" }}>「Dmの直前にA7」</strong>を置くと、A7→Dm の関係が
          G7→C と同じ「V→I」構造になるので、Dmが一瞬「仮のトニック」として輝きます。
        </p>
        <div
          className="rounded-xl p-4 space-y-1"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
        >
          <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
            <strong style={{ color: "var(--color-text)" }}>V/X</strong> = 「X度のVコード」の意味。
            X度をマイナーやメジャーに関わらず、<strong style={{ color: "var(--color-text)" }}>ドミナント7th</strong>として組み立てます。
          </p>
        </div>
      </section>

      {/* Key selector */}
      <section className="space-y-3">
        <label className="block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
          キーを選んで試聴
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
      </section>

      {/* Secondary Dominant list */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>{key}メジャーキーのセカンダリードミナント</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seconds.map((sec) => (
            <div
              key={sec.targetDegree}
              className="rounded-xl p-5 space-y-3"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
                >
                  V/{sec.targetDegree}
                </span>
                <span className="text-xl font-bold" style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}>
                  {sec.chordSymbol}
                </span>
                <span style={{ color: "var(--color-text-tertiary)" }}>→</span>
                <span className="text-lg" style={{ color: "var(--color-secondary)" }}>
                  {sec.targetChordSymbol}
                </span>
              </div>
              <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
                {sec.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => playOne(sec.midiNotes)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0"
                  style={{ background: "var(--color-bg)", color: "var(--color-primary)", border: "1px solid var(--color-primary)" }}
                >
                  ▶ {sec.chordSymbol}
                </button>
                <button
                  onClick={() => playOne(sec.targetMidiNotes)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0"
                  style={{ background: "var(--color-bg)", color: "var(--color-secondary)", border: "1px solid var(--color-secondary)" }}
                >
                  ▶ {sec.targetChordSymbol}
                </button>
                <button
                  onClick={() => playResolution(sec.midiNotes, sec.targetMidiNotes)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0"
                  style={{ background: "var(--color-accent-green)", color: "oklch(0.15 0.02 155)" }}
                >
                  ▶ 解決 {sec.chordSymbol}→{sec.targetChordSymbol}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tip */}
      <section className="space-y-3">
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--color-bg-elevated)", borderLeft: "3px solid var(--color-accent-blue)" }}
        >
          <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
            <strong style={{ color: "var(--color-text)" }}>応用:</strong>{" "}
            II-V-I でおなじみの進行も、実は <code style={{ color: "var(--color-accent-blue)" }}>Dm → G7 → C</code> の
            Dmの前に <code style={{ color: "var(--color-accent-blue)" }}>A7</code> を置けば
            <code style={{ color: "var(--color-primary)" }}> A7 → Dm → G7 → C </code>
            となり、二重のドミナントモーション（secondary dominant + primary dominant）でジャズライクな推進力に。
          </p>
        </div>
      </section>

      {/* Quiz */}
      <LessonQuiz lessonId="secondary-dominants" />

      {/* Navigation */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link
          href="/learn/tensions"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4l-4 4 4 4" />
          </svg>
          前へ
        </Link>
        <Link
          href="/learn/modal-interchange"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ background: "var(--color-primary)", color: "oklch(0.15 0.02 75)" }}
        >
          次へ: モーダルインターチェンジ
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
