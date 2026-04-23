"use client";

import { useCallback, useEffect, useState } from "react";
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
  /** Enable QWERTY keyboard input (a/s/d/f/g/h/j/k/l = white, w/e/t/y/u = black) */
  enableKeyboard?: boolean;
}

// QWERTY → semitones from the lowest C in the mapped octave
const KEY_SEMITONE_MAP: Record<string, number> = {
  a: 0,   // C
  w: 1,   // C#
  s: 2,   // D
  e: 3,   // D#
  d: 4,   // E
  f: 5,   // F
  t: 6,   // F#
  g: 7,   // G
  y: 8,   // G#
  h: 9,   // A
  u: 10,  // A#
  j: 11,  // B
  k: 12,  // C + oct
  l: 14,  // D + oct
};

// Reverse lookup: semitone → QWERTY key
const SEMITONE_TO_KEY: Record<number, string> = Object.fromEntries(
  Object.entries(KEY_SEMITONE_MAP).map(([k, semi]) => [semi, k]),
);

export function PianoKeyboard({
  startMidi = 48, // C3
  endMidi = 72,   // C5
  highlightedNotes = [],
  activeNotes = [],
  highlightColor = "var(--piano-highlight)",
  onNoteClick,
  showLabels = true,
  compact = false,
  enableKeyboard = false,
}: PianoKeyboardProps) {
  const [kbdActive, setKbdActive] = useState<number[]>([]);

  useEffect(() => {
    if (!enableKeyboard) return;

    const octaveBase = Math.ceil(startMidi / 12) * 12; // first C >= startMidi
    const pressed = new Set<number>();

    const isEditableTarget = (target: EventTarget | null): boolean => {
      return (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      );
    };

    const keydown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      const semi = KEY_SEMITONE_MAP[k];
      if (semi === undefined) return;
      const midi = octaveBase + semi;
      if (midi < startMidi || midi > endMidi) return;
      if (pressed.has(midi)) return;
      pressed.add(midi);
      setKbdActive((prev) => [...prev, midi]);
      onNoteClick?.(midi);
      e.preventDefault();
    };

    const keyup = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const semi = KEY_SEMITONE_MAP[k];
      if (semi === undefined) return;
      const midi = octaveBase + semi;
      pressed.delete(midi);
      setKbdActive((prev) => prev.filter((n) => n !== midi));
    };

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    };
  }, [enableKeyboard, startMidi, endMidi, onNoteClick]);

  const combinedActive = kbdActive.length > 0 ? [...activeNotes, ...kbdActive] : activeNotes;

  const qwertyLabelFor = (midi: number): string | null => {
    if (!enableKeyboard) return null;
    const octaveBase = Math.ceil(startMidi / 12) * 12;
    const semi = midi - octaveBase;
    return SEMITONE_TO_KEY[semi] ?? null;
  };
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
    (midi: number) => combinedActive.includes(midi),
    [combinedActive]
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
              onTouchStart={(e) => {
                e.preventDefault();
                e.currentTarget.style.transform = "translateY(1px)";
                onNoteClick?.(midi);
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onTouchCancel={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
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
                touchAction: "manipulation",
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
              {qwertyLabelFor(midi) && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 font-mono font-bold uppercase"
                  style={{
                    bottom: compact ? 18 : 22,
                    color: "oklch(0.35 0.05 260)",
                    fontSize: compact ? "10px" : "12px",
                  }}
                >
                  {qwertyLabelFor(midi)}
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
              onTouchStart={(e) => {
                e.preventDefault();
                e.currentTarget.style.transform = "translateY(1px)";
                onNoteClick?.(midi);
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onTouchCancel={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
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
                touchAction: "manipulation",
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
              {qwertyLabelFor(midi) && (
                <span
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono font-bold uppercase"
                  style={{
                    color: highlighted ? "oklch(0.20 0.02 75)" : "oklch(0.85 0.04 75)",
                    fontSize: "10px",
                  }}
                >
                  {qwertyLabelFor(midi)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
