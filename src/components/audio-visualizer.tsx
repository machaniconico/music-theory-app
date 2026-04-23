"use client";

import { useEffect, useRef, useState } from "react";
import { getFftAnalyser, getWaveformAnalyser } from "@/lib/audio-engine";

type Mode = "fft" | "waveform";

export interface AudioVisualizerProps {
  /** Height in px. Width = 100%. */
  height?: number;
  /** Initial mode */
  initialMode?: Mode;
  /** Primary color for drawing */
  color?: string;
}

export function AudioVisualizer({
  height = 120,
  initialMode = "fft",
  color = "var(--color-primary)",
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const fft = getFftAnalyser();
    const wave = getWaveformAnalyser();

    // Read the live computed color from the canvas each frame so CSS var changes
    // (theme toggle, etc.) propagate without remounting the component.
    canvas.style.color = color;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const resolvedColor = getComputedStyle(canvas).color;
      ctx.clearRect(0, 0, w, h);

      if (mode === "fft") {
        const values = fft.getValue() as Float32Array;
        const barWidth = w / values.length;
        for (let i = 0; i < values.length; i++) {
          const db = values[i];
          const norm = Math.max(0, (db + 100) / 100);
          const barH = norm * h;
          ctx.fillStyle = resolvedColor;
          ctx.globalAlpha = 0.3 + norm * 0.6;
          ctx.fillRect(i * barWidth, h - barH, Math.max(1, barWidth - 1), barH);
        }
        ctx.globalAlpha = 1;
      } else {
        const values = wave.getValue() as Float32Array;
        ctx.strokeStyle = resolvedColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < values.length; i++) {
          const x = (i / values.length) * w;
          const y = h / 2 - values[i] * (h / 2);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [mode, color]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
          🎚 ビジュアライザー
        </span>
        <div className="flex gap-1">
          {(["fft", "waveform"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 border-0 cursor-pointer"
              style={{
                background: mode === m ? "var(--color-primary)" : "var(--color-bg)",
                color: mode === m ? "oklch(0.15 0.02 75)" : "var(--color-text-secondary)",
                border: `1px solid ${mode === m ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              {m === "fft" ? "スペクトラム" : "波形"}
            </button>
          ))}
        </div>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border-subtle)", height }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
    </div>
  );
}
