"use client";

import { ChordDisplay } from "@/components/chord-display";
import Link from "next/link";

export default function TensionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          レッスン 6
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>テンション & 代理コード</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          9th, 11th, 13thなどのテンションノートと代理コードで、表現の幅を広げよう。
        </p>
      </div>

      {/* テンションとは */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>テンションノートとは</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          テンションノートとは、基本の四和音（1, 3, 5, 7度）の上に
          <strong style={{ color: "var(--color-text)" }}>さらに3度ずつ積み重ねた音</strong>です。
          コードに緊張感や色彩を加えます。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "9th（ナインス）",
              desc: "ルートの長2度上（オクターブ上）。きらびやかで開放的な響き。ポップスで多用。",
              example: "CM9 = C E G B D",
              color: "var(--color-primary)",
            },
            {
              name: "11th（イレブンス）",
              desc: "ルートの完全4度上（オクターブ上）。浮遊感がある。マイナー系で効果的。",
              example: "Cm11 = C Eb G Bb F",
              color: "var(--color-accent-blue)",
            },
            {
              name: "13th（サーティーンス）",
              desc: "ルートの長6度上（オクターブ上）。温かみと広がり。ジャズの定番。",
              example: "C13 = C E G Bb A",
              color: "var(--color-secondary)",
            },
          ].map((tension) => (
            <div
              key={tension.name}
              className="rounded-xl p-5 space-y-2"
              style={{ background: "var(--color-bg-elevated)", borderTop: `3px solid ${tension.color}` }}
            >
              <h4 className="text-base font-bold m-0" style={{ color: tension.color }}>{tension.name}</h4>
              <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>{tension.desc}</p>
              <p className="text-xs font-mono m-0" style={{ color: "var(--color-text-tertiary)" }}>{tension.example}</p>
            </div>
          ))}
        </div>
      </section>

      {/* オルタードテンション */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>オルタードテンション</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          テンションに#や♭をつけた変化テンション。ドミナント7thコードで特に効果的です。
        </p>
        <div
          className="rounded-xl p-5 space-y-3"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              { name: "b9", desc: "不穏・緊張感", color: "var(--color-accent-rose)" },
              { name: "#9", desc: "ブルージー", color: "var(--color-accent-rose)" },
              { name: "#11", desc: "リディアン的・浮遊", color: "var(--color-accent-blue)" },
              { name: "b13", desc: "暗い色彩", color: "var(--color-secondary)" },
            ].map((alt) => (
              <div key={alt.name} className="rounded-lg p-3" style={{ background: "var(--color-surface)" }}>
                <div className="font-bold font-mono" style={{ color: alt.color }}>{alt.name}</div>
                <div className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>{alt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 代理コード */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>代理コード</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          同じ機能（T/SD/D）を持つコード同士は入れ替えが可能です。
          これを<strong style={{ color: "var(--color-text)" }}>代理コード</strong>と呼びます。
        </p>
        <div className="space-y-3">
          {[
            {
              title: "トニック代理",
              desc: "I → IIIm, VIm。Iの代わりに使うと新鮮な響きに。",
              example: "C → Em, Am",
              color: "var(--color-primary)",
            },
            {
              title: "サブドミナント代理",
              desc: "IV → IIm。IIm7→V7→Iは最も美しい解決の1つ。",
              example: "F → Dm",
              color: "var(--color-accent-blue)",
            },
            {
              title: "トライトーン代理（裏コード）",
              desc: "V7の代わりにルートが半音上の7thコードを使う。ジャズの必須テクニック。",
              example: "G7 → Db7（Cキーの場合）",
              color: "var(--color-accent-rose)",
            },
          ].map((sub) => (
            <div
              key={sub.title}
              className="rounded-xl p-5 space-y-1"
              style={{ background: "var(--color-bg-elevated)", borderLeft: `3px solid ${sub.color}` }}
            >
              <h4 className="text-base font-bold m-0" style={{ color: sub.color }}>{sub.title}</h4>
              <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>{sub.desc}</p>
              <p className="text-xs font-mono m-0" style={{ color: "var(--color-text-tertiary)" }}>{sub.example}</p>
            </div>
          ))}
        </div>
      </section>

      {/* セカンダリードミナント */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>セカンダリードミナント</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          ダイアトニック外の音を使って、次のコードへの解決感を強める技法です。
          あるコードの<strong style={{ color: "var(--color-text)" }}>完全5度上のドミナント7th</strong>を
          直前に挿入します。
        </p>
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
        >
          <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
            例: Cキーで Am に向かう前に E7 を挿入
            <br />
            <span className="font-mono" style={{ color: "var(--color-text)" }}>
              C → E7 → Am → F → G → C
            </span>
            <br />
            E7 は Am のセカンダリードミナント（V7/VIと表記）
          </p>
        </div>
      </section>

      {/* Try it */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>テンションを聴いてみよう</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          add9コードを試してみましょう。通常のメジャーと比べて、きらびやかさが加わります。
        </p>
        <ChordDisplay initialRoot="C" initialType="add9" />
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link href="/learn/progressions" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline" style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4l-4 4 4 4" /></svg>
          前へ
        </Link>
        <Link href="/builder" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline" style={{ background: "var(--color-secondary)", color: "oklch(0.95 0.01 290)" }}>
          進行ビルダーで実践
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
        </Link>
      </div>
    </div>
  );
}
