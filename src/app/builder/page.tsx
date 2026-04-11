"use client";

import { ProgressionBuilder } from "@/components/progression-builder";

export default function BuilderPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 style={{ fontFamily: "var(--font-display)" }}>
          コード進行ビルダー
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          ダイアトニックコードを組み合わせて、オリジナルのコード進行を作ろう。
          <br />
          定番プリセットから始めて、自分だけの進行を見つけよう。
        </p>
      </div>

      <ProgressionBuilder />
    </div>
  );
}
