"use client";

import { ScaleVisualizer } from "@/components/scale-visualizer";
import { LessonQuiz } from "@/components/lesson-quiz";
import Link from "next/link";

export default function ScalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          レッスン 3
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>スケールとモード</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          スケール（音階）はメロディとコードの土台。キーの中で使える音の集合を理解しよう。
        </p>
      </div>

      {/* スケールとは */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>スケールとは</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          スケールとは、ある規則に従って並べられた音の集合です。
          最も基本的な<strong style={{ color: "var(--color-text)" }}>メジャースケール</strong>は
          「全・全・半・全・全・全・半」の間隔で7つの音が並びます。
        </p>
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
        >
          <h4 className="text-sm font-bold mb-3" style={{ color: "var(--color-accent-blue)" }}>
            Cメジャースケールの構造
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
            {["C", "全", "D", "全", "E", "半", "F", "全", "G", "全", "A", "全", "B", "半", "C"].map((item, i) => {
              const isNote = !["全", "半"].includes(item);
              return (
                <span
                  key={i}
                  className={`px-2 py-1 rounded ${isNote ? "font-bold" : "text-xs"}`}
                  style={{
                    background: isNote ? "var(--color-accent-blue)" : "transparent",
                    color: isNote ? "oklch(0.95 0.01 240)" : "var(--color-text-tertiary)",
                  }}
                >
                  {item}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* モード */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>チャーチモード</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          メジャースケールの各音から始めると、異なる雰囲気のスケール（モード）が得られます。
          ジャズやゲーム音楽で多用されます。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "イオニアン (I)", desc: "= メジャースケール。明るく安定。", color: "var(--color-primary)" },
            { name: "ドリアン (II)", desc: "マイナーだが明るさがある。ファンク・ジャズ。", color: "var(--color-secondary)" },
            { name: "フリジアン (III)", desc: "エキゾチック・スパニッシュ。暗く神秘的。", color: "var(--color-accent-rose)" },
            { name: "リディアン (IV)", desc: "浮遊感・きらびやかさ。映画音楽。", color: "var(--color-accent-blue)" },
            { name: "ミクソリディアン (V)", desc: "ブルージー・ロック。ドミナント感。", color: "var(--color-accent-green)" },
            { name: "エオリアン (VI)", desc: "= ナチュラルマイナー。暗く哀愁。", color: "var(--color-secondary)" },
            { name: "ロクリアン (VII)", desc: "最も不安定。減5度が特徴。", color: "var(--color-accent-rose)" },
          ].map((mode) => (
            <div
              key={mode.name}
              className="rounded-xl p-4"
              style={{ background: "var(--color-bg-elevated)", borderLeft: `3px solid ${mode.color}` }}
            >
              <div className="text-sm font-bold" style={{ color: mode.color }}>{mode.name}</div>
              <div className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{mode.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ペンタトニック */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>ペンタトニック & ブルース</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          5音スケールの<strong style={{ color: "var(--color-text)" }}>ペンタトニック</strong>は、
          音が少ない分シンプルで使いやすく、ポップス・ロック・ブルースの基盤です。
          ブルーノート（b5）を加えた<strong style={{ color: "var(--color-text)" }}>ブルーススケール</strong>は
          泥臭い独特の味わいがあります。
        </p>
      </section>

      {/* Interactive */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>スケールを弾いてみよう</h2>
        <ScaleVisualizer initialRoot="C" initialScale="major" />
      </section>

      {/* Quiz */}
      <LessonQuiz lessonId="scales" />

      {/* Navigation */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link
          href="/learn/chord-types"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4l-4 4 4 4" />
          </svg>
          前へ
        </Link>
        <Link
          href="/learn/diatonic"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ background: "var(--color-primary)", color: "oklch(0.15 0.02 75)" }}
        >
          次へ: ダイアトニックコード
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
