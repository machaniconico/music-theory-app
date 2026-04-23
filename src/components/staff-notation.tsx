"use client";

import { useEffect, useRef } from "react";
import {
  Accidental,
  Formatter,
  Renderer,
  Stave,
  StaveNote,
  Voice,
} from "vexflow";

interface StaffNotationProps {
  /** 表示するコードの集合。各要素は MIDI番号の配列。複数なら横並び。 */
  chords: number[][];
  /** キャンバス幅（px）。未指定は親幅。 */
  width?: number;
  /** キャンバス高さ（px）。 */
  height?: number;
}

// MIDI → VexFlow key (e.g., 60 -> "c/4"), returns { key, accidental }
function midiToVexKey(midi: number): { key: string; accidental: string | null } {
  const letters = ["c", "c", "d", "d", "e", "f", "f", "g", "g", "a", "a", "b"];
  const accidentals = ["", "#", "", "#", "", "", "#", "", "#", "", "#", ""];
  const idx = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const letter = letters[idx];
  const accidental = accidentals[idx] || null;
  const suffix = accidental ?? "";
  return {
    key: `${letter}${suffix}/${octave}`,
    accidental,
  };
}

export function StaffNotation({
  chords,
  width,
  height = 140,
}: StaffNotationProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    host.innerHTML = "";

    const targetWidth = width ?? Math.max(host.clientWidth || 260, 200);
    const staveCount = Math.max(chords.length, 1);
    const staveWidth = Math.floor((targetWidth - 20) / staveCount);

    const renderer = new Renderer(host, Renderer.Backends.SVG);
    renderer.resize(targetWidth, height);
    const context = renderer.getContext();

    // Dark theme colors
    const strokeColor = "rgba(230, 230, 240, 0.85)";
    const fillColor = "rgba(230, 230, 240, 0.95)";
    context.setFillStyle(fillColor);
    context.setStrokeStyle(strokeColor);

    chords.forEach((midiNotes, i) => {
      const x = 10 + i * staveWidth;
      const stave = new Stave(x, 20, staveWidth);
      if (i === 0) stave.addClef("treble");
      stave.setContext(context).draw();

      if (midiNotes.length === 0) return;

      // Sort ascending and dedupe octave
      const sortedMidi = [...midiNotes].sort((a, b) => a - b);
      const vexInfos = sortedMidi.map(midiToVexKey);

      const staveNote = new StaveNote({
        keys: vexInfos.map((v) => v.key),
        duration: "w",
      });

      vexInfos.forEach((info, keyIdx) => {
        if (info.accidental) {
          staveNote.addModifier(new Accidental(info.accidental), keyIdx);
        }
      });

      const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false);
      voice.addTickables([staveNote]);

      new Formatter().joinVoices([voice]).format([voice], staveWidth - 40);
      voice.draw(context, stave);
    });

    // Force text/stroke colors on all rendered SVG elements
    const svg = host.querySelector("svg");
    if (svg) {
      svg.style.maxWidth = "100%";
      svg.style.height = "auto";
      svg.querySelectorAll<SVGElement>("[fill]").forEach((el) => {
        const current = el.getAttribute("fill");
        if (current && current !== "none" && current !== "transparent") {
          el.setAttribute("fill", fillColor);
        }
      });
      svg.querySelectorAll<SVGElement>("[stroke]").forEach((el) => {
        const current = el.getAttribute("stroke");
        if (current && current !== "none" && current !== "transparent") {
          el.setAttribute("stroke", strokeColor);
        }
      });
    }
  }, [chords, width, height]);

  return (
    <div
      ref={hostRef}
      className="w-full overflow-x-auto"
      style={{ minHeight: height }}
    />
  );
}
