"use client";

import { useEffect, useState } from "react";
import { getAchievement } from "@/lib/achievements";

interface ActiveToast {
  key: number;
  id: string;
}

export function AchievementToast() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    let counter = 0;

    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>;
      const id = custom.detail;
      if (!id) return;
      const item: ActiveToast = { key: ++counter, id };
      setToasts((prev) => [...prev, item]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.key !== item.key));
      }, 4000);
    };

    window.addEventListener("achievement-unlocked", handler);
    return () => window.removeEventListener("achievement-unlocked", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: "min(360px, calc(100vw - 2rem))" }}
    >
      {toasts.map((t) => {
        const a = getAchievement(t.id);
        if (!a) return null;
        return (
          <div
            key={t.key}
            className="rounded-xl p-3 flex items-center gap-3 animate-fade-in"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-primary)",
              boxShadow: "0 8px 32px oklch(0 0 0 / 0.4), 0 0 20px var(--color-primary-glow)",
              pointerEvents: "auto",
            }}
          >
            <span className="text-3xl">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] uppercase tracking-wider font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                🏆 アチーブメント獲得
              </div>
              <div
                className="text-sm font-bold truncate"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
              >
                {a.title}
              </div>
              <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {a.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
