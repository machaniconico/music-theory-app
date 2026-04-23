"use client";

import { ChordDisplay } from "@/components/chord-display";
import { LessonQuiz } from "@/components/lesson-quiz";
import Link from "next/link";

export default function ChordBasicsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          レッスン 1
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>コードの基礎</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          コード（和音）の構造を理解し、音楽の土台を築こう。
        </p>
      </div>

      {/* 音程とは */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>音程（インターバル）とは</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          音程とは、2つの音の高さの差のことです。ピアノの鍵盤で隣り合う音（白鍵・黒鍵含む）の差を
          <strong style={{ color: "var(--color-text)" }}>半音（semitone）</strong>、
          半音2つ分を<strong style={{ color: "var(--color-text)" }}>全音（whole tone）</strong>と呼びます。
        </p>
        <div
          className="rounded-xl p-5 space-y-3"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
        >
          <h4 className="text-sm font-bold m-0" style={{ color: "var(--color-primary)" }}>主な音程</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              ["P1 (ユニゾン)", "0半音", "C → C"],
              ["m2 (短2度)", "1半音", "C → C#"],
              ["M2 (長2度)", "2半音", "C → D"],
              ["m3 (短3度)", "3半音", "C → Eb"],
              ["M3 (長3度)", "4半音", "C → E"],
              ["P4 (完全4度)", "5半音", "C → F"],
              ["P5 (完全5度)", "7半音", "C → G"],
              ["M7 (長7度)", "11半音", "C → B"],
              ["P8 (オクターブ)", "12半音", "C → C"],
            ].map(([name, semitones, example]) => (
              <div key={name} className="flex flex-col gap-0.5">
                <span style={{ color: "var(--color-text)" }}>{name}</span>
                <span style={{ color: "var(--color-text-tertiary)" }}>{semitones} — {example}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* コードとは */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>コード（和音）とは</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          コードとは、<strong style={{ color: "var(--color-text)" }}>3つ以上の音を同時に鳴らしたもの</strong>です。
          最も基本的なコードは3つの音で構成される<strong style={{ color: "var(--color-text)" }}>トライアド（三和音）</strong>です。
        </p>
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
        >
          <h4 className="text-sm font-bold m-0" style={{ color: "var(--color-primary)" }}>トライアドの構成</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "ルート (Root)", desc: "コードの基準となる音。コード名にもなる。", color: "var(--color-primary)" },
              { label: "3度 (3rd)", desc: "メジャー/マイナーを決める重要な音。", color: "var(--color-secondary)" },
              { label: "5度 (5th)", desc: "コードの安定感を支える音。", color: "var(--color-accent-blue)" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex-1 min-w-[160px] rounded-xl p-4"
                style={{ background: "var(--color-surface)", border: `1px solid ${item.color}40` }}
              >
                <div className="text-sm font-bold mb-1" style={{ color: item.color }}>{item.label}</div>
                <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* メジャーとマイナー */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>メジャーとマイナーの違い</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          3度の音が<strong style={{ color: "var(--color-text)" }}>長3度（4半音）</strong>ならメジャー、
          <strong style={{ color: "var(--color-text)" }}>短3度（3半音）</strong>ならマイナーになります。
          この1半音の違いが、明るい/暗いの印象を決めます。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5 space-y-2"
            style={{ background: "var(--color-bg-elevated)", borderLeft: "3px solid var(--color-primary)" }}
          >
            <h4 className="text-base font-bold m-0" style={{ color: "var(--color-primary)" }}>Cメジャー (C)</h4>
            <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
              C + E + G（ルート + 長3度 + 完全5度）
            </p>
            <p className="text-sm m-0" style={{ color: "var(--color-text-tertiary)" }}>
              → 明るく安定した響き
            </p>
          </div>
          <div
            className="rounded-xl p-5 space-y-2"
            style={{ background: "var(--color-bg-elevated)", borderLeft: "3px solid var(--color-secondary)" }}
          >
            <h4 className="text-base font-bold m-0" style={{ color: "var(--color-secondary)" }}>Cマイナー (Cm)</h4>
            <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
              C + Eb + G（ルート + 短3度 + 完全5度）
            </p>
            <p className="text-sm m-0" style={{ color: "var(--color-text-tertiary)" }}>
              → 暗く哀愁のある響き
            </p>
          </div>
        </div>
      </section>

      {/* Interactive */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>実際に聴いてみよう</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          ルート音とコードタイプを変えて、構成音と響きの違いを確認してみましょう。
        </p>
        <ChordDisplay initialRoot="C" initialType="major" />
      </section>

      {/* Quiz */}
      <LessonQuiz lessonId="chord-basics" />

      {/* Navigation */}
      <div className="flex justify-end pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link
          href="/learn/chord-types"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all duration-200"
          style={{ background: "var(--color-primary)", color: "oklch(0.15 0.02 75)" }}
        >
          次へ: コードの種類
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
