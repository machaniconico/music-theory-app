"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCompletedLessons, LESSON_IDS } from "@/lib/lesson-progress";
import { recordVisit } from "@/lib/streak";
import { unlockAchievement } from "@/lib/achievements";

const SECTIONS = [
  {
    title: "コードの基礎",
    description: "音程・和音の構造を理解する",
    href: "/learn/chord-basics",
    icon: "🎵",
    color: "var(--color-primary)",
  },
  {
    title: "コードの種類",
    description: "Major, Minor, 7thなど各コードの響き",
    href: "/learn/chord-types",
    icon: "🎶",
    color: "var(--color-secondary)",
  },
  {
    title: "スケール",
    description: "メジャー・マイナー・モードを学ぶ",
    href: "/learn/scales",
    icon: "🎼",
    color: "var(--color-accent-blue)",
  },
  {
    title: "ダイアトニックコード",
    description: "キーの中で使えるコードと機能",
    href: "/learn/diatonic",
    icon: "🏗️",
    color: "var(--color-accent-green)",
  },
  {
    title: "コード進行",
    description: "定番パターンを学んで使いこなす",
    href: "/learn/progressions",
    icon: "🔄",
    color: "var(--color-accent-rose)",
  },
  {
    title: "テンション",
    description: "9th, 11th, 13thで響きを豊かに",
    href: "/learn/tensions",
    icon: "✨",
    color: "var(--color-secondary)",
  },
  {
    title: "セカンダリードミナント",
    description: "V/X で一時的に別のコードをトニック化する",
    href: "/learn/secondary-dominants",
    icon: "🎯",
    color: "var(--color-primary)",
  },
  {
    title: "モーダルインターチェンジ",
    description: "同主調マイナーから借用和音を持ってくる",
    href: "/learn/modal-interchange",
    icon: "🔀",
    color: "var(--color-accent-blue)",
  },
  {
    title: "転調",
    description: "ピボット/直接転調で曲の調を切り替える",
    href: "/learn/modulation",
    icon: "🚀",
    color: "var(--color-accent-rose)",
  },
];

const TOOLS = [
  {
    title: "インタラクティブピアノ",
    description: "コードやスケールを視覚と音で確認できるピアノ",
    href: "/piano",
    gradient: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
  },
  {
    title: "コード進行ビルダー",
    description: "ダイアトニックコードを並べてオリジナルの進行を作ろう",
    href: "/builder",
    gradient: "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-green))",
  },
  {
    title: "耳コピ練習",
    description: "音程・コード・進行を聴いて当てる耳トレモード",
    href: "/ear-training",
    gradient: "linear-gradient(135deg, var(--color-accent-rose), var(--color-primary))",
  },
  {
    title: "メロディ入力",
    description: "コード進行の上にピアノでメロディを録音・再生",
    href: "/melody",
    gradient: "linear-gradient(135deg, var(--color-secondary), var(--color-accent-blue))",
  },
  {
    title: "楽曲解析",
    description: "コード進行を入力して機能・カデンツ・定番進行を自動判定",
    href: "/analyze",
    gradient: "linear-gradient(135deg, var(--color-primary), var(--color-accent-blue))",
  },
];

export default function Home() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [streakCurrent, setStreakCurrent] = useState(0);

  useEffect(() => {
    setCompleted(new Set(getCompletedLessons()));
    const s = recordVisit();
    setStreakCurrent(s.current);
    if (s.current >= 7) {
      unlockAchievement("week-master");
    }
  }, []);

  const totalLessons = LESSON_IDS.length;
  const doneCount = completed.size;
  const pct = Math.round((doneCount / totalLessons) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-20">
      {/* Hero */}
      <section className="text-center space-y-6 pt-8">
        <div className="text-6xl mb-4">🎹</div>
        <h1
          className="text-gradient"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
        >
          Music Theory Lab
        </h1>
        <p
          className="text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          コード理論をインタラクティブに学ぼう。
          <br />
          視覚と音で、音楽の仕組みを直感的に理解できます。
        </p>
        {streakCurrent > 0 && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-accent-rose)",
              color: "var(--color-accent-rose)",
            }}
          >
            <span>🔥</span>
            <span>
              {streakCurrent}日連続練習中
            </span>
          </div>
        )}
      </section>

      {/* Tools */}
      <section className="space-y-6">
        <h2
          className="text-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          ツール
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative overflow-hidden rounded-2xl p-8 no-underline transition-all duration-300"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: tool.gradient }}
              />
              <div className="relative z-10">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                >
                  {tool.title}
                </h3>
                <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
                  {tool.description}
                </p>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: tool.gradient }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Learning Sections */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <h2
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            学ぶ
          </h2>
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              進捗
            </span>
            <div
              className="relative w-40 h-2 rounded-full overflow-hidden"
              style={{ background: "var(--color-bg-elevated)" }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                }}
              />
            </div>
            <span
              className="text-xs font-mono"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {doneCount}/{totalLessons} 完了
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((section, i) => {
            const lessonId = section.href.replace("/learn/", "");
            const done = completed.has(lessonId);
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-2xl p-6 no-underline transition-all duration-300 animate-fade-in relative"
                style={{
                  background: "var(--color-surface)",
                  border: `1px solid ${done ? "var(--color-accent-green)" : "var(--color-border-subtle)"}`,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {done && (
                  <span
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "var(--color-accent-green)",
                      color: "oklch(0.15 0.02 155)",
                    }}
                    title="完了"
                  >
                    ✓
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{section.icon}</span>
                  <div>
                    <h3
                      className="text-base font-bold mb-1 group-hover:translate-x-1 transition-transform duration-200"
                      style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                    >
                      {section.title}
                    </h3>
                    <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
                      {section.description}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: section.color }}
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8" style={{ color: "var(--color-text-tertiary)" }}>
        <p className="text-sm">Music Theory Lab</p>
      </footer>
    </div>
  );
}
