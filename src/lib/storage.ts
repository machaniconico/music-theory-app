"use client";

const STORAGE_KEY = "music-theory-lab.progressions.v1";

export interface SavedProgressionChord {
  degreeIndex: number;
}

export interface SavedProgression {
  id: string;
  name: string;
  key: string;
  useSeventh: boolean;
  tempo: number;
  chords: SavedProgressionChord[];
  createdAt: number;
  updatedAt: number;
}

function safeGetAll(): SavedProgression[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedProgression);
  } catch {
    return [];
  }
}

function safeSetAll(list: SavedProgression[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // quota exceeded or private mode — fail silently
  }
}

function isSavedProgression(v: unknown): v is SavedProgression {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.key === "string" &&
    typeof o.tempo === "number" &&
    Array.isArray(o.chords)
  );
}

function newId(): string {
  return `prog-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getProgressions(): SavedProgression[] {
  return safeGetAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveProgression(
  input: Omit<SavedProgression, "id" | "createdAt" | "updatedAt">,
): SavedProgression {
  const list = safeGetAll();
  const now = Date.now();
  const record: SavedProgression = {
    ...input,
    id: newId(),
    createdAt: now,
    updatedAt: now,
  };
  list.push(record);
  safeSetAll(list);
  return record;
}

export function updateProgression(
  id: string,
  patch: Partial<Omit<SavedProgression, "id" | "createdAt">>,
): SavedProgression | null {
  const list = safeGetAll();
  const idx = list.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  const merged: SavedProgression = {
    ...list[idx],
    ...patch,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: Date.now(),
  };
  list[idx] = merged;
  safeSetAll(list);
  return merged;
}

export function renameProgression(id: string, name: string): SavedProgression | null {
  return updateProgression(id, { name });
}

export function deleteProgression(id: string): boolean {
  const list = safeGetAll();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return false;
  safeSetAll(next);
  return true;
}

export function clearProgressions(): void {
  safeSetAll([]);
}
