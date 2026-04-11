"use client";

import { useState } from "react";
import { NOTE_NAMES, DIATONIC_MAJOR, DIATONIC_MAJOR_7TH, CHORD_TYPES, SCALE_TYPES, getDiatonicChordName, getChordMidiNotes } from "@/lib/music-theory";
import { playChord } from "@/lib/audio-engine";
import Link from "next/link";

export default function DiatonicPage() {
  const [key, setKey] = useState("C");
  const [useSeventh, setUseSeventh] = useState(false);

  const diatonic = useSeventh ? DIATONIC_MAJOR_7TH : DIATONIC_MAJOR;
  const majorScale = SCALE_TYPES.major;
  const rootIdx = NOTE_NAMES.indexOf(key as never);

  const functionColors: Record<string, string> = {
    T: "var(--color-primary)",
    SD: "var(--color-accent-blue)",
    D: "var(--color-accent-rose)",
  };

  const handlePlayChord = (degreeIndex: number) => {
    const chordRootSemitone = rootIdx + majorScale.intervals[degreeIndex];
    const quality = diatonic[degreeIndex].quality;
    const chordType = CHORD_TYPES[quality];
    const rootMidi = 48 + (chordRootSemitone % 12);
    const midiNotes = chordType.intervals.map((i) => rootMidi + i);
    playChord(midiNotes, "4n");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          レッスン 4
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>ダイアトニックコード</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          キーの中で自然に使えるコードの集合。作曲・アレンジの基本ツールキットです。
        </p>
      </div>

      {/* 解説 */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>ダイアトニックコードとは</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          メジャースケールの各音をルートにして、
          <strong style={{ color: "var(--color-text)" }}>スケール内の音だけで3度ずつ積み重ねた</strong>コードが
          ダイアトニックコードです。どのキーでも同じ構造（メジャー・マイナー・ディミニッシュの並び）になります。
        </p>
      </section>

      {/* コード機能 */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>3つの機能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              func: "トニック (T)",
              desc: "安定・解決。曲の「家」。I, IIIm, VIm。",
              color: functionColors.T,
              degrees: "I, III, VI",
            },
            {
              func: "サブドミナント (SD)",
              desc: "やや不安定。動き出しの力。IIm, IV。",
              color: functionColors.SD,
              degrees: "II, IV",
            },
            {
              func: "ドミナント (D)",
              desc: "最も不安定。トニックへ解決したがる。V, VIIdim。",
              color: functionColors.D,
              degrees: "V, VII",
            },
          ].map((item) => (
            <div
              key={item.func}
              className="rounded-xl p-5 space-y-2"
              style={{ background: "var(--color-bg-elevated)", borderTop: `3px solid ${item.color}` }}
            >
              <h4 className="text-base font-bold m-0" style={{ color: item.color }}>{item.func}</h4>
              <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
              <p className="text-xs m-0 font-mono" style={{ color: "var(--color-text-tertiary)" }}>{item.degrees}</p>
            </div>
          ))}
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
        >
          <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
            基本の動き: <strong style={{ color: "var(--color-text)" }}>T → SD → D → T</strong>
            <br />
            例: I → IV → V → I（最も基本的なコード進行）
          </p>
        </div>
      </section>

      {/* Interactive Table */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "var(--font-display)" }}>ダイアトニックコード表</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-wrap gap-1">
            {NOTE_NAMES.map((note) => (
              <button
                key={note}
                onClick={() => setKey(note)}
                className="px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: key === note ? "var(--color-primary)" : "var(--color-bg)",
                  color: key === note ? "oklch(0.15 0.02 75)" : "var(--color-text-secondary)",
                  border: `1px solid ${key === note ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                {note}
              </button>
            ))}
          </div>
          <button
            onClick={() => setUseSeventh(!useSeventh)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              background: useSeventh ? "var(--color-secondary)" : "var(--color-bg)",
              color: useSeventh ? "oklch(0.95 0.01 290)" : "var(--color-text-secondary)",
              border: `1px solid ${useSeventh ? "var(--color-secondary)" : "var(--color-border)"}`,
            }}
          >
            {useSeventh ? "7thコード" : "3和音"}
          </button>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {diatonic.map((d, i) => {
            const chordName = getDiatonicChordName(key, i, useSeventh);
            const funcColor = functionColors[d.function];
            return (
              <button
                key={i}
                onClick={() => handlePlayChord(i)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all duration-200 border-0"
                style={{ background: "var(--color-bg-elevated)", border: `1px solid var(--color-border-subtle)` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = funcColor;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 6px 20px oklch(0 0 0 / 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-subtle)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span className="text-xs font-bold" style={{ color: funcColor }}>{d.degree}</span>
                <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>{chordName}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${funcColor}20`, color: funcColor }}
                >
                  {d.functionJa}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          各コードをクリックすると音が鳴ります
        </p>
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <Link href="/learn/scales" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline" style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4l-4 4 4 4" /></svg>
          前へ
        </Link>
        <Link href="/learn/progressions" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold no-underline" style={{ background: "var(--color-primary)", color: "oklch(0.15 0.02 75)" }}>
          次へ: コード進行
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
        </Link>
      </div>
    </div>
  );
}
