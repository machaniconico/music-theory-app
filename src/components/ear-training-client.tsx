"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DIFFICULTY_META,
  Difficulty,
  EarTrainingMode,
  MODE_META,
  Quiz,
  generateQuiz,
} from "@/lib/ear-training";

type Status = "setup" | "playing" | "answering" | "feedback";

interface Score {
  correct: number;
  total: number;
  streak: number;
  bestStreak: number;
}

const INITIAL_SCORE: Score = { correct: 0, total: 0, streak: 0, bestStreak: 0 };

export function EarTrainingClient() {
  const [mode, setMode] = useState<EarTrainingMode>("interval");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [status, setStatus] = useState<Status>("setup");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState<Score>(INITIAL_SCORE);

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  const startQuiz = useCallback(async () => {
    const q = generateQuiz(mode, difficulty);
    setQuiz(q);
    setSelectedId(null);
    setStatus("playing");
    await q.play();
    setStatus("answering");
  }, [mode, difficulty]);

  const replay = useCallback(async () => {
    if (!quiz) return;
    setStatus("playing");
    await quiz.play();
    setStatus("answering");
  }, [quiz]);

  const answer = useCallback(
    (id: string) => {
      if (!quiz || status !== "answering") return;
      setSelectedId(id);
      setStatus("feedback");
      const isCorrect = id === quiz.correctId;
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
        streak: isCorrect ? prev.streak + 1 : 0,
        bestStreak: isCorrect ? Math.max(prev.bestStreak, prev.streak + 1) : prev.bestStreak,
      }));
    },
    [quiz, status],
  );

  const nextQuiz = useCallback(async () => {
    await startQuiz();
  }, [startQuiz]);

  const resetSession = useCallback(() => {
    setScore(INITIAL_SCORE);
    setQuiz(null);
    setSelectedId(null);
    setStatus("setup");
  }, []);

  // モード/難易度変更時は状態リセット
  useEffect(() => {
    if (status !== "setup") {
      setQuiz(null);
      setSelectedId(null);
      setStatus("setup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, difficulty]);

  // キーボードショートカット
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (status === "setup") {
          void startQuiz();
        } else if (status === "answering") {
          void replay();
        }
      } else if (status === "answering" && quiz && /^Digit[1-4]$/.test(e.code)) {
        const idx = Number(e.code.replace("Digit", "")) - 1;
        if (idx < quiz.options.length) {
          answer(quiz.options[idx].id);
        }
      } else if (status === "feedback" && (e.code === "Enter" || e.key.toLowerCase() === "n")) {
        void nextQuiz();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status, quiz, startQuiz, replay, answer, nextQuiz]);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="text-5xl mb-2">👂</div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>耳コピ練習</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          音程・コード・進行を聴いて当てよう。耳を鍛えればコピーも作曲もグッと楽になります。
        </p>
      </div>

      {/* Score bar */}
      <div
        className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <ScoreTile label="正答率" value={`${accuracy}%`} />
        <ScoreTile label="正解" value={`${score.correct} / ${score.total}`} />
        <ScoreTile label="連続正解" value={String(score.streak)} highlight={score.streak >= 3} />
        <ScoreTile label="最高連続" value={String(score.bestStreak)} />
        <button
          onClick={resetSession}
          className="text-sm px-3 py-1.5 rounded-lg cursor-pointer border-0"
          style={{
            background: "transparent",
            color: "var(--color-text-tertiary)",
            border: "1px solid var(--color-border)",
          }}
        >
          リセット
        </button>
      </div>

      {/* Mode & Difficulty Selector */}
      <section className="space-y-4">
        <h3 style={{ fontFamily: "var(--font-display)" }}>モード</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(MODE_META) as EarTrainingMode[]).map((m) => {
            const meta = MODE_META[m];
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="text-left p-4 rounded-xl cursor-pointer transition-all duration-200 border-0"
                style={{
                  background: active ? "var(--color-primary-muted)" : "var(--color-surface)",
                  border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border-subtle)"}`,
                  boxShadow: active ? "0 0 20px var(--color-primary-glow)" : "none",
                }}
              >
                <div className="text-2xl mb-1">{meta.icon}</div>
                <div
                  className="font-semibold text-sm"
                  style={{
                    color: active ? "var(--color-primary)" : "var(--color-text)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {meta.label}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                  {meta.description}
                </div>
              </button>
            );
          })}
        </div>

        <h3 style={{ fontFamily: "var(--font-display)" }} className="pt-2">
          難易度
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(DIFFICULTY_META) as Difficulty[]).map((d) => {
            const meta = DIFFICULTY_META[d];
            const active = difficulty === d;
            return (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="p-3 rounded-xl cursor-pointer transition-all duration-200 border-0"
                style={{
                  background: active ? "var(--color-secondary-muted)" : "var(--color-surface)",
                  border: `1px solid ${active ? "var(--color-secondary)" : "var(--color-border-subtle)"}`,
                }}
              >
                <div
                  className="font-semibold text-sm"
                  style={{
                    color: active ? "var(--color-secondary)" : "var(--color-text)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {meta.label}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                  {meta.description}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quiz Area */}
      <section
        className="rounded-2xl p-6 md:p-8 space-y-6 animate-fade-in"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
          minHeight: "320px",
        }}
      >
        {status === "setup" && (
          <div className="text-center py-12 space-y-4">
            <p style={{ color: "var(--color-text-secondary)" }}>
              モードと難易度を選んで「問題スタート」を押してください。
            </p>
            <button
              onClick={startQuiz}
              className="px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0 glow-primary"
              style={{
                background: "var(--color-primary)",
                color: "oklch(0.15 0.02 75)",
              }}
            >
              ▶ 問題スタート
            </button>
          </div>
        )}

        {quiz && status !== "setup" && (
          <>
            <div className="text-center space-y-2">
              <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                Q{score.total + (status === "feedback" ? 0 : 1)}
              </p>
              <p className="text-base" style={{ color: "var(--color-text)" }}>
                {quiz.prompt}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={replay}
                disabled={status === "playing"}
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0 disabled:opacity-50"
                style={{
                  background: "var(--color-bg-elevated)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {status === "playing" ? "🎵 再生中..." : "🔁 もう一度聴く"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quiz.options.map((opt) => {
                const isCorrect = opt.id === quiz.correctId;
                const isSelected = selectedId === opt.id;
                const showFeedback = status === "feedback";

                let background = "var(--color-bg-elevated)";
                let borderColor = "var(--color-border)";
                let textColor = "var(--color-text)";

                if (showFeedback) {
                  if (isCorrect) {
                    background = "oklch(0.72 0.17 155 / 0.18)";
                    borderColor = "var(--color-accent-green)";
                    textColor = "var(--color-accent-green)";
                  } else if (isSelected && !isCorrect) {
                    background = "oklch(0.65 0.20 15 / 0.18)";
                    borderColor = "var(--color-accent-rose)";
                    textColor = "var(--color-accent-rose)";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => answer(opt.id)}
                    disabled={status !== "answering"}
                    className="p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border-0 disabled:cursor-not-allowed"
                    style={{
                      background,
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                    }}
                  >
                    <div className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                      {opt.label}
                    </div>
                    {opt.sublabel && (
                      <div className="text-xs mt-1 font-mono" style={{ opacity: 0.7 }}>
                        {opt.sublabel}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {status === "feedback" && (
              <div className="space-y-4 animate-fade-in">
                <div
                  className="rounded-xl p-4 text-center"
                  style={{
                    background:
                      selectedId === quiz.correctId
                        ? "oklch(0.72 0.17 155 / 0.1)"
                        : "oklch(0.65 0.20 15 / 0.1)",
                    border: `1px solid ${
                      selectedId === quiz.correctId
                        ? "var(--color-accent-green)"
                        : "var(--color-accent-rose)"
                    }`,
                  }}
                >
                  <div
                    className="text-lg font-bold mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      color:
                        selectedId === quiz.correctId
                          ? "var(--color-accent-green)"
                          : "var(--color-accent-rose)",
                    }}
                  >
                    {selectedId === quiz.correctId ? "⭕ 正解！" : "❌ 不正解"}
                  </div>
                  <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
                    {quiz.explanation}
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={nextQuiz}
                    className="px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0 glow-primary"
                    style={{
                      background: "var(--color-primary)",
                      color: "oklch(0.15 0.02 75)",
                    }}
                  >
                    次の問題 →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Tips */}
      <section
        className="rounded-2xl p-5 text-sm"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border-subtle)",
          color: "var(--color-text-secondary)",
        }}
      >
        <h4
          className="mb-2 text-sm font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          💡 練習のコツ
        </h4>
        <ul className="list-disc pl-5 space-y-1 m-0">
          <li>初級からスタート。連続正解5回で次の難易度へ。</li>
          <li>「もう一度聴く」は何度使ってもOK。響きを覚えるほうが大事。</li>
          <li>コードは<strong>3度の響き</strong>（明るい／暗い）から聴き取ると早い。</li>
          <li>進行は<strong>最後の解決感</strong>に注目。終止形で判別できる。</li>
        </ul>
      </section>

      {/* Keyboard Shortcuts */}
      <section
        className="rounded-2xl p-5 text-sm"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border-subtle)",
          color: "var(--color-text-secondary)",
        }}
      >
        <h4
          className="mb-3 text-sm font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          ⌨ キーボードショートカット
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { keys: ["Space"], action: "再生 / もう一度聴く" },
            { keys: ["1", "2", "3", "4"], action: "選択肢 A / B / C / D を選ぶ" },
            { keys: ["Enter", "N"], action: "次の問題へ" },
          ].map((item) => (
            <div key={item.action} className="flex items-center gap-2">
              <div className="flex gap-1">
                {item.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 rounded font-mono text-[11px]"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                      boxShadow: "0 1px 2px oklch(0 0 0 / 0.2)",
                    }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
              <span>{item.action}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ScoreTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex-1 min-w-[80px]">
      <div
        className="text-xs uppercase tracking-wider mb-1"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        {label}
      </div>
      <div
        className="text-xl font-bold"
        style={{
          fontFamily: "var(--font-display)",
          color: highlight ? "var(--color-primary)" : "var(--color-text)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
