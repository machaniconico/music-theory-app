"use client";

import { useEffect, useState } from "react";
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
} from "@/lib/achievements";

export function AchievementsClient() {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    setUnlocked(new Set(getUnlockedAchievements()));
    const handler = () => setUnlocked(new Set(getUnlockedAchievements()));
    window.addEventListener("achievement-unlocked", handler);
    return () => window.removeEventListener("achievement-unlocked", handler);
  }, []);

  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = unlocked.size;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="text-5xl mb-2">🏆</div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>アチーブメント</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          学習と演奏の成果を集めよう。
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <div
            className="w-48 h-2 rounded-full overflow-hidden"
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
            className="text-sm font-mono"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {unlockedCount} / {totalCount} 獲得
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className="rounded-2xl p-5 space-y-2 transition-all"
              style={{
                background: isUnlocked ? "var(--color-surface)" : "var(--color-bg-elevated)",
                border: `1px solid ${
                  isUnlocked ? "var(--color-primary)" : "var(--color-border-subtle)"
                }`,
                opacity: isUnlocked ? 1 : 0.45,
                boxShadow: isUnlocked ? "0 0 20px var(--color-primary-glow)" : "none",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl" style={{ filter: isUnlocked ? "none" : "grayscale(1)" }}>
                  {a.icon}
                </span>
                <div className="flex-1">
                  <div
                    className="text-sm font-bold mb-0.5"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: isUnlocked ? "var(--color-primary)" : "var(--color-text)",
                    }}
                  >
                    {a.title}
                  </div>
                  <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {a.description}
                  </div>
                </div>
                {isUnlocked && (
                  <span
                    className="text-[10px] uppercase font-bold px-2 py-0.5 rounded"
                    style={{
                      background: "var(--color-primary)",
                      color: "oklch(0.15 0.02 75)",
                    }}
                  >
                    獲得
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="text-center text-xs"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        各機能を実際に使うとバッジがアンロックされます。
      </div>
    </div>
  );
}
