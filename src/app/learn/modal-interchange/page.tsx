"use client";

import { useState } from "react";
import Link from "next/link";
import { NOTE_NAMES } from "@/lib/music-theory";
import { getBorrowedChords, getPresetProgressions } from "@/lib/modal-interchange";
import { playChord, playProgression } from "@/lib/audio-engine";
import { LessonQuiz } from "@/components/lesson-quiz";

export default function ModalInterchangePage() {
  const [key, setKey] = useState("C");
  const borrowed = getBorrowedChords(key);
  const presets = getPresetProgressions(key);

  const playOne = (midiNotes: number[]) => playChord(midiNotes, "4n");
  const playPreset = (chordsMidi: number[][]) => playProgression(chordsMidi, 90);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          Phase 6 · レッスン 8
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>モーダルインターチェンジ（借用和音）</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          同じルートの<strong style={{ color: "var(--color-text)" }}>別モード（主にマイナー）からコードを借りてくる</strong>
          手法。メジャーキーの中に一瞬マイナーの陰を落とすことで、感情の深みが出せます。
        </p>
      </div>

      {/* 解説 */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>しくみ</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Cメジャーのダイアトニックは C Dm Em F G Am B° の7つ。
          これに対し、<strong style={{ color: "var(--color-text)" }}>Cマイナー</strong>のダイアトニック
          Cm Ddim Eb Fm Gm Ab Bb から<strong style={{ color: "var(--color-text)" }}>気に入ったコードを借りて差し込む</strong>と、
          借用感のある響きになります。代表的なのが <code>iv</code>, <code>bIII</code>, <code>bVI</code>, <code>bVII</code>。
        </p>
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

      {/* Borrowed chords */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>{key}メジャーで使える代表的な借用和音</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {borrowed.map((b) => (
            <div
              key={b.degreeLabel}
              className="rounded-xl p-5 space-y-3"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: "var(--color-secondary-muted)", color: "var(--color-secondary)" }}
                >
                  {b.degreeLabel}
                </span>
                <span className="text-xl font-bold" style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}>
                  {b.chordSymbol}
                </span>
              </div>
              <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
                {b.description}
              </p>
              <button
                onClick={() => playOne(b.midiNotes)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0"
                style={{ background: "var(--color-bg)", color: "var(--color-secondary)", border: "1px solid var(--color-secondary)" }}
              >
                ▶ {b.chordSymbol}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Preset progressions */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>借用を使った名進行</h2>
        <div className="space-y-3">
          {presets.map((p) => (
            <div
              key={p.name}
              className="rounded-xl p-5 space-y-3"
              style={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-base font-bold m-0" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                    {p.name}
                  </h3>
                  <p className="text-sm m-0 mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    {p.description}
                  </p>
                </div>
                <button
                  onClick={() => playPreset(p.chordsMidi)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border-0"
                  style={{ background: "var(--color-accent-green)", color: "oklch(0.15 0.02 155)" }}
                >
                  ▶ 再生
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.chordLabels.map((label, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 rounded-lg text-sm font-bold"
                    style={{
                      background: "var(--color-bg)",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz */}
      <LessonQuiz lessonId="modal-interchange" />

      {/* Navigation */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link
          href="/learn/secondary-dominants"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4l-4 4 4 4" />
          </svg>
          前へ
        </Link>
        <Link
          href="/learn/modulation"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ background: "var(--color-primary)", color: "oklch(0.15 0.02 75)" }}
        >
          次へ: 転調
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
