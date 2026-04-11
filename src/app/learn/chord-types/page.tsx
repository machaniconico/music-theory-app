"use client";

import { CHORD_TYPES, getChordNotes, getChordMidiNotes } from "@/lib/music-theory";
import { playChord } from "@/lib/audio-engine";
import Link from "next/link";

function ChordCard({ chordKey, root = "C" }: { chordKey: string; root?: string }) {
  const chord = CHORD_TYPES[chordKey];
  const notes = getChordNotes(root, chordKey);
  const midiNotes = getChordMidiNotes(root, 4, chordKey);

  return (
    <button
      onClick={() => playChord(midiNotes)}
      className="flex flex-col items-start gap-2 p-5 rounded-xl cursor-pointer transition-all duration-200 border-0 text-left w-full"
      style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = chord.color;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 16px oklch(0 0 0 / 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border-subtle)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: chord.color }}>
          {root}{chord.symbol}
        </span>
        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          {chord.nameJa}
        </span>
      </div>
      <div className="flex gap-1.5">
        {notes.map((note, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded text-xs font-mono font-bold"
            style={{ background: `${chord.color}20`, color: chord.color }}
          >
            {note}
          </span>
        ))}
      </div>
      <p className="text-xs m-0 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {chord.description}
      </p>
      <span className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
        クリックで試聴
      </span>
    </button>
  );
}

export default function ChordTypesPage() {
  const triads = ["major", "minor", "dim", "aug", "sus2", "sus4"];
  const sevenths = ["maj7", "min7", "dom7", "dim7", "m7b5", "add9"];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          レッスン 2
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>コードの種類</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          様々なコードの構成と響きを学ぼう。各カードをクリックすると音が鳴ります。
        </p>
      </div>

      {/* Triads */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>三和音（トライアド）</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          3つの音で構成される基本的なコード。3度の積み重ねで作られます。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {triads.map((key) => (
            <ChordCard key={key} chordKey={key} />
          ))}
        </div>
      </section>

      {/* Sevenths */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>四和音（セブンスコード）</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          トライアドに7度の音を加えた4音構成のコード。よりリッチで複雑な響きになります。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sevenths.map((key) => (
            <ChordCard key={key} chordKey={key} />
          ))}
        </div>
      </section>

      {/* Key Point */}
      <section
        className="rounded-xl p-6 space-y-3"
        style={{ background: "var(--color-bg-elevated)", borderLeft: "3px solid var(--color-primary)" }}
      >
        <h3 className="text-base font-bold m-0" style={{ color: "var(--color-primary)" }}>
          ポイント
        </h3>
        <ul className="space-y-2 m-0 pl-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <li><strong style={{ color: "var(--color-text)" }}>3度</strong>がメジャー/マイナーの明暗を決める</li>
          <li><strong style={{ color: "var(--color-text)" }}>5度</strong>が完全5度なら安定、減5度/増5度なら不安定</li>
          <li><strong style={{ color: "var(--color-text)" }}>7度</strong>を加えるとコードの色彩が豊かになる</li>
          <li>sus系は3度がなく、解決を求める浮遊感がある</li>
        </ul>
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link
          href="/learn/chord-basics"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4l-4 4 4 4" />
          </svg>
          前へ
        </Link>
        <Link
          href="/learn/scales"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ background: "var(--color-primary)", color: "oklch(0.15 0.02 75)" }}
        >
          次へ: スケール
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
