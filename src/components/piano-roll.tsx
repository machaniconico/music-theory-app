"use client";

import type { MelodyNote } from "@/lib/audio-engine";
import { midiToNoteName, midiToOctave } from "@/lib/music-theory";

interface PianoRollProps {
  melody: MelodyNote[];
  height?: number;
  highlightTime?: number | null;
}

export function PianoRoll({ melody, height = 140, highlightTime = null }: PianoRollProps) {
  if (melody.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl text-xs"
        style={{
          height,
          background: "var(--color-bg)",
          border: "1px dashed var(--color-border)",
          color: "var(--color-text-tertiary)",
        }}
      >
        （録音なし）
      </div>
    );
  }

  // Bounds
  const minMidi = Math.min(...melody.map((n) => n.midi));
  const maxMidi = Math.max(...melody.map((n) => n.midi));
  const pitchRange = Math.max(6, maxMidi - minMidi + 2);

  const endTime = Math.max(
    ...melody.map((n) => n.time + n.duration),
    1,
  );
  const width = 800;
  const pad = 8;
  const contentW = width - pad * 2;
  const contentH = height - pad * 2;

  const xOf = (t: number) => pad + (t / endTime) * contentW;
  const yOf = (midi: number) => {
    const rel = 1 - (midi - (minMidi - 1)) / pitchRange;
    return pad + rel * contentH;
  };

  const wOf = (dur: number) => Math.max(3, (dur / endTime) * contentW);
  const rowH = contentH / pitchRange;

  // Vertical lines every second
  const gridLines = [];
  for (let t = 1; t < endTime; t++) {
    gridLines.push(t);
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--color-bg)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height, display: "block" }}
      >
        {/* horizontal grid: every semitone */}
        {Array.from({ length: pitchRange + 1 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={pad}
            y1={pad + (i / pitchRange) * contentH}
            x2={width - pad}
            y2={pad + (i / pitchRange) * contentH}
            stroke="oklch(0.25 0.01 260)"
            strokeWidth={i % 12 === (minMidi - 1) % 12 ? 1 : 0.3}
          />
        ))}
        {/* vertical grid: every 1s */}
        {gridLines.map((t) => (
          <line
            key={`v${t}`}
            x1={xOf(t)}
            y1={pad}
            x2={xOf(t)}
            y2={height - pad}
            stroke="oklch(0.25 0.01 260)"
            strokeWidth={0.5}
          />
        ))}
        {/* notes */}
        {melody.map((n, i) => {
          const x = xOf(n.time);
          const y = yOf(n.midi) - rowH / 2;
          const w = wOf(n.duration);
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={Math.max(4, rowH * 0.8)}
                rx={2}
                fill="oklch(0.80 0.16 75)"
                stroke="oklch(0.95 0.1 75)"
                strokeWidth={0.6}
                opacity={0.95}
              />
            </g>
          );
        })}
        {/* playhead */}
        {highlightTime !== null && highlightTime > 0 && (
          <line
            x1={xOf(highlightTime)}
            y1={pad}
            x2={xOf(highlightTime)}
            y2={height - pad}
            stroke="oklch(0.65 0.20 15)"
            strokeWidth={1.5}
          />
        )}
      </svg>
      <div
        className="px-3 py-1.5 text-[10px] flex justify-between"
        style={{
          background: "var(--color-bg-elevated)",
          borderTop: "1px solid var(--color-border-subtle)",
          color: "var(--color-text-tertiary)",
        }}
      >
        <span>
          {melody.length}音 · {endTime.toFixed(1)}秒
        </span>
        <span>
          最低: {midiToNoteName(minMidi)}{midiToOctave(minMidi)} / 最高:{" "}
          {midiToNoteName(maxMidi)}{midiToOctave(maxMidi)}
        </span>
      </div>
    </div>
  );
}
