"use client";

import { useCallback } from "react";
import { isBlackKey, midiToNoteName, midiToOctave } from "@/lib/music-theory";

interface PianoKeyboardProps {
  startMidi?: number;
  endMidi?: number;
  highlightedNotes?: number[];
  activeNotes?: number[];
  highlightColor?: string;
  onNoteClick?: (midi: number) => void;
  showLabels?: boolean;
  compact?: boolean;
}

export function PianoKeyboard({
  startMidi = 48, // C3
  endMidi = 72,   // C5
  highlightedNotes = [],
  activeNotes = [],
  highlightColor = "var(--piano-highlight)",
  onNoteClick,
  showLabels = true,
  compact = false,
}: PianoKeyboardProps) {
  const whiteKeys: number[] = [];
  const blackKeys: { midi: number; position: number }[] = [];

  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (!isBlackKey(midi % 12)) {
      whiteKeys.push(midi);
    }
  }

  const whiteKeyWidth = compact ? 32 : 44;
  const whiteKeyHeight = compact ? 120 : 180;
  const blackKeyWidth = compact ? 22 : 28;
  const blackKeyHeight = compact ? 75 : 110;
  const totalWidth = whiteKeys.length * whiteKeyWidth;

  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (isBlackKey(midi % 12)) {
      const prevWhiteIndex = whiteKeys.findIndex(
        (w) => w === midi - 1 || (midi % 12 === 6 && w === midi - 1) || w > midi
      );
      const whiteIdx = whiteKeys.filter((w) => w < midi).length;
      const x = whiteIdx * whiteKeyWidth - blackKeyWidth / 2;
      blackKeys.push({ midi, position: x });
    }
  }

  const isHighlighted = useCallback(
    (midi: number) => highlightedNotes.includes(midi),
    [highlightedNotes]
  );

  const isActive = useCallback(
    (midi: number) => activeNotes.includes(midi),
    [activeNotes]
  );

  return (
    <div
      className="relative select-none overflow-x-auto"
      style={{ maxWidth: "100%", paddingBottom: "8px" }}
    >
      <div
        className="relative mx-auto"
        style={{
          width: `${totalWidth}px`,
          height: `${whiteKeyHeight}px`,
        }}
      >
        {/* White Keys */}
        {whiteKeys.map((midi, i) => {
          const highlighted = isHighlighted(midi);
          const active = isActive(midi);
          const noteName = midiToNoteName(midi);
          const isC = midi % 12 === 0;

          return (
            <button
              key={midi}
              onClick={() => onNoteClick?.(midi)}
              className="absolute top-0 border-0 cursor-pointer transition-all"
              style={{
                left: `${i * whiteKeyWidth}px`,
                width: `${whiteKeyWidth - 1}px`,
                height: `${whiteKeyHeight}px`,
                background: active
                  ? "var(--piano-white-active)"
                  : highlighted
                  ? `linear-gradient(180deg, ${highlightColor} 0%, oklch(0.70 0.12 75) 100%)`
                  : "linear-gradient(180deg, var(--piano-white) 0%, oklch(0.90 0.005 80) 100%)",
                borderRadius: "0 0 6px 6px",
                boxShadow: highlighted
                  ? `0 2px 8px ${highlightColor}40, inset 0 -4px 8px oklch(0 0 0 / 0.1)`
                  : active
                  ? "inset 0 2px 4px oklch(0 0 0 / 0.15)"
                  : "inset 0 -4px 8px oklch(0 0 0 / 0.08), 0 2px 4px oklch(0 0 0 / 0.15)",
                transitionDuration: "var(--duration-fast)",
                transitionTimingFunction: "var(--ease-out)",
                zIndex: 1,
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(1px)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {showLabels && (
                <span
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium"
                  style={{
                    color: highlighted
                      ? "oklch(0.20 0.02 75)"
                      : "oklch(0.50 0.01 260)",
                    fontSize: compact ? "9px" : "11px",
                  }}
                >
                  {isC ? `${noteName}${midiToOctave(midi)}` : noteName}
                </span>
              )}
            </button>
          );
        })}

        {/* Black Keys */}
        {blackKeys.map(({ midi, position }) => {
          const highlighted = isHighlighted(midi);
          const active = isActive(midi);
          const noteName = midiToNoteName(midi);

          return (
            <button
              key={midi}
              onClick={() => onNoteClick?.(midi)}
              className="absolute top-0 border-0 cursor-pointer transition-all"
              style={{
                left: `${position}px`,
                width: `${blackKeyWidth}px`,
                height: `${blackKeyHeight}px`,
                background: active
                  ? "var(--piano-black-active)"
                  : highlighted
                  ? `linear-gradient(180deg, ${highlightColor} 0%, oklch(0.60 0.12 75) 100%)`
                  : "linear-gradient(180deg, oklch(0.25 0.01 260) 0%, var(--piano-black) 100%)",
                borderRadius: "0 0 4px 4px",
                boxShadow: highlighted
                  ? `0 2px 12px ${highlightColor}50`
                  : active
                  ? "inset 0 1px 3px oklch(0 0 0 / 0.4)"
                  : "0 3px 6px oklch(0 0 0 / 0.5), inset 0 -2px 4px oklch(0 0 0 / 0.3)",
                transitionDuration: "var(--duration-fast)",
                transitionTimingFunction: "var(--ease-out)",
                zIndex: 2,
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(1px)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {showLabels && !compact && (
                <span
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs"
                  style={{
                    color: highlighted
                      ? "oklch(0.20 0.02 75)"
                      : "oklch(0.60 0.01 260)",
                    fontSize: "9px",
                  }}
                >
                  {noteName}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
