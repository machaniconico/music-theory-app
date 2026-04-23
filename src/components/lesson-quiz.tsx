"use client";

import { useEffect, useState } from "react";
import { LESSON_QUIZZES } from "@/lib/lesson-quizzes";
import {
  getCompletedLessons,
  LESSON_IDS,
  markLessonCompleted,
} from "@/lib/lesson-progress";
import { unlockAchievement } from "@/lib/achievements";

interface LessonQuizProps {
  lessonId: keyof typeof LESSON_QUIZZES;
}

export function LessonQuiz({ lessonId }: LessonQuizProps) {
  const quiz = LESSON_QUIZZES[lessonId];
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(quiz.questions.length).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);

  const correctCount = answers.reduce<number>((acc, ans, i) => {
    return acc + (ans === (quiz?.questions[i]?.correct ?? -1) ? 1 : 0);
  }, 0);

  useEffect(() => {
    if (submitted && quiz && correctCount > 0) {
      unlockAchievement("first-quiz");
    }
    if (submitted && quiz && correctCount === quiz.questions.length) {
      markLessonCompleted(lessonId);
      const done = getCompletedLessons();
      if (LESSON_IDS.every((id) => done.includes(id))) {
        unlockAchievement("all-lessons");
      }
    }
  }, [submitted, correctCount, quiz, lessonId]);

  if (!quiz) return null;

  const allAnswered = answers.every((a) => a !== null);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers(Array(quiz.questions.length).fill(null));
    setSubmitted(false);
  };

  return (
    <section
      className="rounded-2xl p-6 md:p-8 space-y-6"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-2xl">🧩</span>
        <h2 className="m-0" style={{ fontFamily: "var(--font-display)" }}>
          {quiz.title}
        </h2>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, qIdx) => {
          const selected = answers[qIdx];
          return (
            <div key={qIdx} className="space-y-3">
              <div
                className="text-base font-semibold"
                style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
              >
                Q{qIdx + 1}. {question.q}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options.map((opt, optIdx) => {
                  const isSelected = selected === optIdx;
                  const isCorrect = optIdx === question.correct;
                  const showResult = submitted;

                  let bg = "var(--color-bg)";
                  let borderCol = "var(--color-border)";
                  let textCol = "var(--color-text)";

                  if (isSelected && !showResult) {
                    bg = "var(--color-primary-muted)";
                    borderCol = "var(--color-primary)";
                    textCol = "var(--color-primary)";
                  } else if (showResult) {
                    if (isCorrect) {
                      bg = "oklch(0.72 0.17 155 / 0.15)";
                      borderCol = "var(--color-accent-green)";
                      textCol = "var(--color-accent-green)";
                    } else if (isSelected && !isCorrect) {
                      bg = "oklch(0.65 0.20 15 / 0.15)";
                      borderCol = "var(--color-accent-rose)";
                      textCol = "var(--color-accent-rose)";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      disabled={submitted}
                      className="text-left p-3 rounded-xl text-sm cursor-pointer border-0 transition-all disabled:cursor-not-allowed"
                      style={{
                        background: bg,
                        border: `1px solid ${borderCol}`,
                        color: textCol,
                      }}
                    >
                      <span className="font-semibold">{"ABCD"[optIdx]}.</span> {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && selected !== question.correct && question.hint && (
                <div
                  className="text-sm rounded-xl p-3"
                  style={{
                    background: "oklch(0.65 0.20 15 / 0.08)",
                    border: "1px solid oklch(0.65 0.20 15 / 0.3)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  💡 ヒント: {question.hint}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--color-primary)",
              color: "oklch(0.15 0.02 75)",
            }}
          >
            答え合わせ
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div
            className="rounded-xl p-5 text-center"
            style={{
              background:
                correctCount === quiz.questions.length
                  ? "oklch(0.72 0.17 155 / 0.12)"
                  : "var(--color-bg-elevated)",
              border: `1px solid ${
                correctCount === quiz.questions.length
                  ? "var(--color-accent-green)"
                  : "var(--color-border)"
              }`,
            }}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{
                fontFamily: "var(--font-display)",
                color:
                  correctCount === quiz.questions.length
                    ? "var(--color-accent-green)"
                    : "var(--color-text)",
              }}
            >
              {correctCount} / {quiz.questions.length} 正解
            </div>
            <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
              {correctCount === quiz.questions.length
                ? "🎉 全問正解！よく理解できています。"
                : correctCount >= Math.ceil(quiz.questions.length * 0.6)
                  ? "👍 もう一息！間違えた問題を振り返ってみよう。"
                  : "📖 レッスンをもう一度読み直してみよう。"}
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-0"
              style={{
                background: "transparent",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              もう一度挑戦
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
