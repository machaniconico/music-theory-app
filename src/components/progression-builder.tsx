"use client";

import { useState, useCallback, useEffect } from "react";
import {
  NOTE_NAMES, CHORD_TYPES, DIATONIC_MAJOR, DIATONIC_MAJOR_7TH,
  SCALE_TYPES, PRESET_PROGRESSIONS, getDiatonicChordName,
} from "@/lib/music-theory";
import { playArrangement, playChord, setReverbWet, stopAll } from "@/lib/audio-engine";
import {
  SavedProgression,
  deleteProgression,
  getProgressions,
  saveProgression,
} from "@/lib/storage";
import { RHYTHM_LABELS, RhythmPattern } from "@/lib/rhythm";
import { generateRandomProgression } from "@/lib/progression-generator";
import { copyToClipboard, decodeBuilderState, encodeBuilderState } from "@/lib/share-url";
import { StaffNotation } from "./staff-notation";

interface BuilderChord {
  degreeIndex: number;
  name: string;
}

export function ProgressionBuilder() {
  const [key, setKey] = useState("C");
  const [useSeventh, setUseSeventh] = useState(false);
  const [tempo, setTempo] = useState(100);
  const [progression, setProgression] = useState<BuilderChord[]>([
    { degreeIndex: 0, name: getDiatonicChordName("C", 0, false) },
    { degreeIndex: 4, name: getDiatonicChordName("C", 4, false) },
    { degreeIndex: 5, name: getDiatonicChordName("C", 5, false) },
    { degreeIndex: 3, name: getDiatonicChordName("C", 3, false) },
  ]);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedList, setSavedList] = useState<SavedProgression[]>([]);
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [rhythm, setRhythm] = useState<RhythmPattern>("off");
  const [shareMessage, setShareMessage] = useState("");
  const [reverbPct, setReverbPct] = useState(20);

  useEffect(() => {
    setReverbWet(reverbPct / 100);
  }, [reverbPct]);

  const diatonic = useSeventh ? DIATONIC_MAJOR_7TH : DIATONIC_MAJOR;
  const majorScale = SCALE_TYPES.major;

  useEffect(() => {
    setSavedList(getProgressions());

    // Hash-based state restore
    if (typeof window !== "undefined" && window.location.hash) {
      const decoded = decodeBuilderState(window.location.hash);
      if (decoded) {
        setKey(decoded.key);
        setUseSeventh(decoded.useSeventh);
        setTempo(decoded.tempo);
        setRhythm(decoded.rhythm);
        setProgression(
          decoded.degrees.map((d) => ({
            degreeIndex: d,
            name: getDiatonicChordName(decoded.key, d, decoded.useSeventh),
          })),
        );
      }
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const hash = encodeBuilderState({
      key,
      useSeventh,
      tempo,
      degrees: progression.map((c) => c.degreeIndex),
      rhythm,
    });
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    const ok = await copyToClipboard(url);
    setShareMessage(ok ? "📋 URLをコピーしました" : "⚠️ コピーに失敗しました");
    window.history.replaceState(null, "", `#${hash}`);
    setTimeout(() => setShareMessage(""), 2400);
  }, [key, useSeventh, tempo, progression, rhythm]);

  const refreshSaved = useCallback(() => {
    setSavedList(getProgressions());
  }, []);

  const handleSave = useCallback(() => {
    const name = saveName.trim() || `無題の進行 ${new Date().toLocaleString("ja-JP")}`;
    saveProgression({
      name,
      key,
      useSeventh,
      tempo,
      chords: progression.map((c) => ({ degreeIndex: c.degreeIndex })),
    });
    setSaveName("");
    setShowSaveInput(false);
    refreshSaved();
  }, [saveName, key, useSeventh, tempo, progression, refreshSaved]);

  const handleLoad = useCallback((saved: SavedProgression) => {
    setKey(saved.key);
    setUseSeventh(saved.useSeventh);
    setTempo(saved.tempo);
    setProgression(
      saved.chords.map((c) => ({
        degreeIndex: c.degreeIndex,
        name: getDiatonicChordName(saved.key, c.degreeIndex, saved.useSeventh),
      })),
    );
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteProgression(id);
      refreshSaved();
    },
    [refreshSaved],
  );

  const updateProgression = useCallback(
    (newKey: string, seventh: boolean) => {
      setProgression((prev) =>
        prev.map((c) => ({
          ...c,
          name: getDiatonicChordName(newKey, c.degreeIndex, seventh),
        }))
      );
    },
    []
  );

  const handleKeyChange = (newKey: string) => {
    setKey(newKey);
    updateProgression(newKey, useSeventh);
  };

  const handleSeventhToggle = () => {
    const next = !useSeventh;
    setUseSeventh(next);
    updateProgression(key, next);
  };

  const addChord = (degreeIndex: number) => {
    const name = getDiatonicChordName(key, degreeIndex, useSeventh);
    setProgression((prev) => [...prev, { degreeIndex, name }]);
  };

  const removeChord = (index: number) => {
    setProgression((prev) => prev.filter((_, i) => i !== index));
  };

  const loadPreset = (degrees: number[]) => {
    setProgression(
      degrees.map((d) => ({
        degreeIndex: d,
        name: getDiatonicChordName(key, d, useSeventh),
      }))
    );
  };

  const handleRandomize = () => {
    const randomLength = [4, 4, 4, 6, 8][Math.floor(Math.random() * 5)];
    const degrees = generateRandomProgression(randomLength);
    loadPreset(degrees);
  };

  const handlePlay = async () => {
    if (isPlaying) {
      await stopAll();
      setIsPlaying(false);
      setPlayingIndex(-1);
      return;
    }

    setIsPlaying(true);
    await playArrangement({
      chordsMidi,
      tempo,
      pattern: rhythm,
      onChordChange: (idx) => setPlayingIndex(idx),
    });
    setIsPlaying(false);
    setPlayingIndex(-1);
  };

  const handleChordClick = (degreeIndex: number) => {
    const rootIdx = NOTE_NAMES.indexOf(key as never);
    const chordRootSemitone = rootIdx + majorScale.intervals[degreeIndex];
    const quality = diatonic[degreeIndex].quality;
    const chordType = CHORD_TYPES[quality];
    const rootMidi = 48 + (chordRootSemitone % 12);
    const midiNotes = chordType.intervals.map((i) => rootMidi + i);
    playChord(midiNotes, "4n");
  };

  const functionColors: Record<string, string> = {
    T: "var(--color-primary)",
    SD: "var(--color-accent-blue)",
    D: "var(--color-accent-rose)",
  };

  const chordsMidi = progression.map((c) => {
    const rootIdx = NOTE_NAMES.indexOf(key as never);
    const chordRootSemitone = rootIdx + majorScale.intervals[c.degreeIndex];
    const quality = diatonic[c.degreeIndex].quality;
    const chordType = CHORD_TYPES[quality];
    const rootMidi = 48 + (chordRootSemitone % 12);
    return chordType.intervals.map((i) => rootMidi + i);
  });

  return (
    <div className="space-y-8">
      {/* Key & Settings */}
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
                  onClick={() => handleKeyChange(note)}
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
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSeventhToggle}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: useSeventh ? "var(--color-secondary)" : "var(--color-bg)",
                color: useSeventh ? "oklch(0.95 0.01 290)" : "var(--color-text-secondary)",
                border: `1px solid ${useSeventh ? "var(--color-secondary)" : "var(--color-border)"}`,
              }}
            >
              {useSeventh ? "7thコード ON" : "3和音"}
            </button>

            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>BPM</label>
              <input
                type="range"
                min={60}
                max={180}
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
                className="w-24 accent-amber-400"
              />
              <span className="text-sm font-mono w-8" style={{ color: "var(--color-text-secondary)" }}>
                {tempo}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>伴奏</label>
              <select
                value={rhythm}
                onChange={(e) => setRhythm(e.target.value as RhythmPattern)}
                className="px-2 py-1.5 rounded-lg text-sm"
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

            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>🌊 Reverb</label>
              <input
                type="range"
                min={0}
                max={100}
                value={reverbPct}
                onChange={(e) => setReverbPct(Number(e.target.value))}
                className="w-20 accent-amber-400"
              />
              <span className="text-xs font-mono w-8" style={{ color: "var(--color-text-secondary)" }}>
                {reverbPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Diatonic Chord Palette */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
      >
        <h3 className="text-lg font-bold m-0" style={{ fontFamily: "var(--font-display)" }}>
          ダイアトニックコード（{key}メジャー）
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {diatonic.map((d, i) => {
            const chordName = getDiatonicChordName(key, i, useSeventh);
            const funcColor = functionColors[d.function];
            return (
              <button
                key={i}
                onClick={() => handleChordClick(i)}
                onDoubleClick={() => addChord(i)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl cursor-pointer transition-all duration-200 border-0"
                style={{
                  background: "var(--color-bg)",
                  border: `1px solid var(--color-border)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = funcColor;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 4px 16px oklch(0 0 0 / 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                title="クリックで試聴、ダブルクリックで追加"
              >
                <span className="text-xs font-bold" style={{ color: funcColor }}>
                  {d.degree}
                </span>
                <span className="text-base font-bold" style={{ color: "var(--color-text)" }}>
                  {chordName}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  {d.functionJa}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs m-0" style={{ color: "var(--color-text-tertiary)" }}>
          クリックで試聴 / ダブルクリックで進行に追加
        </p>
      </div>

      {/* Progression Timeline */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold m-0" style={{ fontFamily: "var(--font-display)" }}>
            コード進行
          </h3>
          <div className="flex gap-2 flex-wrap items-center">
            {shareMessage && (
              <span
                className="text-xs px-2 py-1 rounded-md animate-fade-in"
                style={{
                  background: "var(--color-accent-blue)",
                  color: "oklch(0.15 0.02 240)",
                }}
              >
                {shareMessage}
              </span>
            )}
            <button
              onClick={handleRandomize}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border-0 cursor-pointer"
              style={{ background: "var(--color-bg)", color: "var(--color-secondary)", border: "1px solid var(--color-secondary)" }}
              title="T→SD→D→T の機能進行でランダム生成"
            >
              🎲 ランダム
            </button>
            <button
              onClick={() => setProgression([])}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border-0 cursor-pointer"
              style={{ background: "var(--color-bg)", color: "var(--color-text-tertiary)", border: "1px solid var(--color-border)" }}
            >
              クリア
            </button>
            <button
              onClick={() => setShowSaveInput((v) => !v)}
              disabled={progression.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--color-bg)", color: "var(--color-accent-green)", border: "1px solid var(--color-accent-green)" }}
            >
              💾 保存
            </button>
            <button
              onClick={handleShare}
              disabled={progression.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--color-bg)", color: "var(--color-accent-blue)", border: "1px solid var(--color-accent-blue)" }}
              title="現在の進行状態をURLに埋め込んでコピー"
            >
              🔗 URLコピー
            </button>
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-0"
              style={{
                background: isPlaying ? "var(--color-accent-rose)" : "var(--color-primary)",
                color: isPlaying ? "oklch(0.95 0.01 15)" : "oklch(0.15 0.02 75)",
              }}
            >
              {isPlaying ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="2" y="2" width="4" height="10" rx="1" />
                    <rect x="8" y="2" width="4" height="10" rx="1" />
                  </svg>
                  停止
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M3 1.5v11l9-5.5z" />
                  </svg>
                  再生
                </>
              )}
            </button>
          </div>
        </div>

        {progression.length === 0 ? (
          <div
            className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-tertiary)" }}
          >
            <span className="text-sm">上のコードをダブルクリックして追加、またはプリセットを選択</span>
          </div>
        ) : (
          <>
          <div
            className="rounded-xl px-3 py-2 overflow-x-auto"
            style={{ background: "var(--color-bg)", border: "1px solid var(--color-border-subtle)" }}
          >
            <StaffNotation
              chords={chordsMidi}
              width={Math.max(260, progression.length * 130)}
              height={130}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {progression.map((chord, i) => {
              const d = diatonic[chord.degreeIndex];
              const funcColor = functionColors[d.function];
              const playing = playingIndex === i;
              return (
                <div
                  key={i}
                  className="group relative flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition-all duration-200"
                  style={{
                    background: playing ? funcColor : "var(--color-bg)",
                    border: `2px solid ${playing ? funcColor : "var(--color-border)"}`,
                    boxShadow: playing ? `0 0 20px ${funcColor}60` : "none",
                    transform: playing ? "scale(1.05)" : "scale(1)",
                    minWidth: "72px",
                  }}
                >
                  <span className="text-xs font-bold" style={{ color: playing ? "oklch(0.15 0.02 0)" : funcColor }}>
                    {d.degree}
                  </span>
                  <span className="text-lg font-bold" style={{ color: playing ? "oklch(0.15 0.02 0)" : "var(--color-text)" }}>
                    {chord.name}
                  </span>
                  <button
                    onClick={() => removeChord(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer border-0"
                    style={{ background: "var(--color-accent-rose)", color: "white" }}
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>
          </>
        )}
      </div>

      {/* Save Input */}
      {showSaveInput && (
        <div
          className="rounded-2xl p-5 space-y-3 animate-fade-in"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-accent-green)",
          }}
        >
          <label
            className="block text-xs uppercase tracking-wider"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            進行の名前
          </label>
          <div className="flex gap-2 flex-wrap">
            <input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="例: 丸サ風Aメロ"
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg text-sm"
              style={{
                background: "var(--color-bg)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border-0"
              style={{
                background: "var(--color-accent-green)",
                color: "oklch(0.15 0.02 155)",
              }}
            >
              保存する
            </button>
            <button
              onClick={() => {
                setShowSaveInput(false);
                setSaveName("");
              }}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer border-0"
              style={{
                background: "var(--color-bg)",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* Saved Progressions */}
      {savedList.length > 0 && (
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <h3 className="text-lg font-bold m-0" style={{ fontFamily: "var(--font-display)" }}>
            保存した進行
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedList.map((saved) => (
              <div
                key={saved.id}
                className="rounded-xl p-4 space-y-2"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="text-sm font-bold flex-1 min-w-0 break-words"
                    style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
                  >
                    {saved.name}
                  </span>
                  <button
                    onClick={() => handleDelete(saved.id)}
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer border-0"
                    style={{
                      background: "transparent",
                      color: "var(--color-accent-rose)",
                      border: "1px solid var(--color-accent-rose)",
                    }}
                    aria-label="削除"
                  >
                    ×
                  </button>
                </div>
                <div className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  {saved.key}
                  {saved.useSeventh ? " / 7th" : ""} · {saved.tempo} BPM · {saved.chords.length}
                  コード
                </div>
                <div className="text-xs font-mono" style={{ color: "var(--color-text-secondary)" }}>
                  {saved.chords
                    .map((c) =>
                      getDiatonicChordName(saved.key, c.degreeIndex, saved.useSeventh),
                    )
                    .join(" → ")}
                </div>
                <button
                  onClick={() => handleLoad(saved)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0"
                  style={{
                    background: "var(--color-primary-muted)",
                    color: "var(--color-primary)",
                    border: "1px solid var(--color-primary)",
                  }}
                >
                  読み込む
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presets */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
      >
        <h3 className="text-lg font-bold m-0" style={{ fontFamily: "var(--font-display)" }}>
          定番プリセット
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_PROGRESSIONS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset.degrees)}
              className="flex flex-col items-start gap-1.5 p-4 rounded-xl text-left cursor-pointer transition-all duration-200 border-0"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-secondary)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px oklch(0 0 0 / 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                {preset.nameJa}
              </span>
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {preset.degrees.map((d) => diatonic[d].degree).join(" → ")}
              </span>
              <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
