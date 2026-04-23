"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CHORD_TYPES,
  DIATONIC_MAJOR,
  NOTE_NAMES,
  PRESET_PROGRESSIONS,
  SCALE_TYPES,
  getDiatonicChordName,
  midiToNoteName,
  midiToOctave,
} from "@/lib/music-theory";
import {
  MelodyNote,
  playArrangement,
  playNote,
  stopAll,
} from "@/lib/audio-engine";
import { RHYTHM_LABELS, RhythmPattern } from "@/lib/rhythm";
import { downloadMidi, exportArrangementToMidi } from "@/lib/midi-export";
import { PianoKeyboard } from "./piano-keyboard";

type TransportStatus = "idle" | "recording" | "playing";

export function MelodyClient() {
  const [key, setKey] = useState("C");
  const [presetIndex, setPresetIndex] = useState(0);
  const [tempo, setTempo] = useState(96);
  const [melody, setMelody] = useState<MelodyNote[]>([]);
  const [status, setStatus] = useState<TransportStatus>("idle");
  const [playingChordIdx, setPlayingChordIdx] = useState(-1);
  const [rhythm, setRhythm] = useState<RhythmPattern>("eight-beat");
  const recordingStartRef = useRef<number>(0);
  const lastNoteTimeRef = useRef<number>(0);

  const preset = PRESET_PROGRESSIONS[presetIndex];
  const majorScale = SCALE_TYPES.major.intervals;
  const rootIdx = NOTE_NAMES.indexOf(key as never);

  // Compute chord progression MIDI
  const chordsMidi = preset.degrees.map((d) => {
    const chordRootSemi = rootIdx + majorScale[d];
    const quality = DIATONIC_MAJOR[d].quality;
    const chordType = CHORD_TYPES[quality];
    const rootMidi = 48 + (chordRootSemi % 12);
    return chordType.intervals.map((i) => rootMidi + i);
  });

  const handleStartRecording = useCallback(() => {
    setMelody([]);
    recordingStartRef.current = Date.now();
    lastNoteTimeRef.current = 0;
    setStatus("recording");
  }, []);

  const handleStop = useCallback(async () => {
    await stopAll();
    setStatus("idle");
    setPlayingChordIdx(-1);
  }, []);

  const handlePlay = useCallback(async () => {
    if (melody.length === 0 && chordsMidi.length === 0) return;
    setStatus("playing");
    await playArrangement({
      chordsMidi,
      tempo,
      pattern: rhythm,
      melody,
      onChordChange: (idx) => setPlayingChordIdx(idx),
    });
    setStatus("idle");
    setPlayingChordIdx(-1);
  }, [melody, chordsMidi, tempo, rhythm]);

  const handleClear = useCallback(() => {
    setMelody([]);
  }, []);

  const handleExport = useCallback(() => {
    if (melody.length === 0 && chordsMidi.length === 0) return;
    const blob = exportArrangementToMidi(chordsMidi, melody, tempo);
    const baseName = preset.name.toLowerCase().replace(/\s+/g, "-");
    const filename = `${baseName}-${key}-${tempo}bpm`;
    downloadMidi(blob, filename);
  }, [chordsMidi, melody, tempo, preset.name, key]);

  const handleNoteClick = useCallback(
    (midi: number) => {
      playNote(midi, "8n");
      if (status === "recording") {
        const now = Date.now();
        const offsetSec = (now - recordingStartRef.current) / 1000;
        // Close previous note's duration
        setMelody((prev) => {
          const next = [...prev];
          if (next.length > 0) {
            const last = next[next.length - 1];
            if (last.duration === 0) {
              next[next.length - 1] = {
                ...last,
                duration: Math.max(0.1, offsetSec - last.time),
              };
            }
          }
          next.push({ midi, time: offsetSec, duration: 0.4 });
          return next;
        });
        lastNoteTimeRef.current = now;
      }
    },
    [status],
  );

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="text-5xl mb-2">🎤</div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>メロディ入力</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          コード進行の上にピアノでメロディを重ねよう。録音して伴奏と同時再生できます。
        </p>
      </div>

      {/* Settings */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
              キー
            </label>
            <div className="flex flex-wrap gap-1">
              {NOTE_NAMES.map((note) => (
                <button
                  key={note}
                  onClick={() => setKey(note)}
                  disabled={status !== "idle"}
                  className="px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-60"
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
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              BPM
            </label>
            <input
              type="range"
              min={60}
              max={180}
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              disabled={status !== "idle"}
              className="w-28 accent-amber-400"
            />
            <span className="text-sm font-mono w-10" style={{ color: "var(--color-text-secondary)" }}>
              {tempo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              伴奏
            </label>
            <select
              value={rhythm}
              onChange={(e) => setRhythm(e.target.value as RhythmPattern)}
              disabled={status !== "idle"}
              className="px-2 py-1.5 rounded-lg text-sm disabled:opacity-60"
              style={{
                background: "var(--color-bg)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              {(Object.keys(RHYTHM_LABELS) as RhythmPattern[]).map((p) => (
                <option key={p} value={p}>
                  {RHYTHM_LABELS[p]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
            コード進行（プリセット）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PRESET_PROGRESSIONS.map((p, i) => {
              const active = presetIndex === i;
              return (
                <button
                  key={p.name}
                  onClick={() => setPresetIndex(i)}
                  disabled={status !== "idle"}
                  className="p-3 rounded-xl text-left text-sm transition-all duration-150 border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: active ? "var(--color-secondary-muted)" : "var(--color-bg)",
                    border: `1px solid ${active ? "var(--color-secondary)" : "var(--color-border)"}`,
                    color: active ? "var(--color-secondary)" : "var(--color-text)",
                  }}
                >
                  <div className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {p.nameJa}
                  </div>
                  <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--color-text-tertiary)" }}>
                    {p.degrees.map((d) => getDiatonicChordName(key, d, false)).join(" → ")}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline / Chord Strip */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
      >
        <h3 className="text-lg font-bold m-0" style={{ fontFamily: "var(--font-display)" }}>
          進行とメロディ
        </h3>
        <div className="flex flex-wrap gap-2">
          {preset.degrees.map((d, i) => {
            const active = playingChordIdx === i;
            return (
              <div
                key={i}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: active ? "var(--color-primary)" : "var(--color-bg)",
                  color: active ? "oklch(0.15 0.02 75)" : "var(--color-text)",
                  border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                  transform: active ? "scale(1.05)" : "scale(1)",
                }}
              >
                {getDiatonicChordName(key, d, false)}
              </div>
            );
          })}
        </div>
        <div>
          <div
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            録音したメロディ（{melody.length}音）
          </div>
          {melody.length === 0 ? (
            <div className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              まだ録音されていません。「録音」ボタンを押してピアノをクリックしてください。
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {melody.map((n, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    background: "var(--color-primary-muted)",
                    color: "var(--color-primary)",
                    border: "1px solid var(--color-primary)",
                  }}
                >
                  {midiToNoteName(n.midi)}
                  {midiToOctave(n.midi)} @ {n.time.toFixed(1)}s
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        {status === "recording" ? (
          <button
            onClick={handleStop}
            className="px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all"
            style={{
              background: "var(--color-accent-rose)",
              color: "oklch(0.95 0.01 15)",
              boxShadow: "0 0 20px oklch(0.65 0.20 15 / 0.4)",
            }}
          >
            ■ 録音停止
          </button>
        ) : (
          <button
            onClick={handleStartRecording}
            disabled={status === "playing"}
            className="px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all disabled:opacity-50"
            style={{
              background: "var(--color-accent-rose)",
              color: "oklch(0.95 0.01 15)",
            }}
          >
            ● 録音開始
          </button>
        )}

        {status === "playing" ? (
          <button
            onClick={handleStop}
            className="px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer border-0"
            style={{
              background: "var(--color-bg-elevated)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            ⏹ 再生停止
          </button>
        ) : (
          <button
            onClick={handlePlay}
            disabled={status === "recording"}
            className="px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer border-0 disabled:opacity-50 glow-primary"
            style={{
              background: "var(--color-primary)",
              color: "oklch(0.15 0.02 75)",
            }}
          >
            ▶ 伴奏と再生
          </button>
        )}

        <button
          onClick={handleClear}
          disabled={status !== "idle" || melody.length === 0}
          className="px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer border-0 disabled:opacity-50"
          style={{
            background: "transparent",
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          クリア
        </button>

        <button
          onClick={handleExport}
          disabled={status !== "idle" || (melody.length === 0 && chordsMidi.length === 0)}
          className="px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer border-0 disabled:opacity-50"
          style={{
            background: "transparent",
            color: "var(--color-accent-green)",
            border: "1px solid var(--color-accent-green)",
          }}
          title="進行+メロディをMIDIファイルでダウンロード"
        >
          💾 MIDI書き出し
        </button>
      </div>

      {/* Piano */}
      <div
        className="rounded-2xl p-4 md:p-6"
        style={{
          background: status === "recording"
            ? "oklch(0.65 0.20 15 / 0.08)"
            : "var(--color-surface)",
          border: `1px solid ${
            status === "recording"
              ? "var(--color-accent-rose)"
              : "var(--color-border-subtle)"
          }`,
          transition: "all 250ms",
        }}
      >
        {status === "recording" && (
          <div
            className="text-center text-xs mb-3 font-semibold"
            style={{ color: "var(--color-accent-rose)" }}
          >
            ● 録音中 — ピアノをクリックしてメロディを入力
          </div>
        )}
        <PianoKeyboard
          startMidi={60}
          endMidi={84}
          activeNotes={[]}
          onNoteClick={handleNoteClick}
          compact
          enableKeyboard
        />
      </div>

      {/* Tips */}
      <div
        className="rounded-2xl p-5 text-sm"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border-subtle)",
          color: "var(--color-text-secondary)",
        }}
      >
        <h4
          className="mb-2 text-sm font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          💡 使い方
        </h4>
        <ol className="list-decimal pl-5 space-y-1 m-0">
          <li>キーとコード進行プリセットを選ぶ</li>
          <li>「録音開始」を押して、ピアノの鍵盤をタイミング良くクリック</li>
          <li>「録音停止」で録音終了</li>
          <li>「伴奏と再生」でコード進行とメロディが同時に鳴る</li>
          <li>録音の代わりに「クリア」で最初からやり直せる</li>
        </ol>
      </div>
    </div>
  );
}
