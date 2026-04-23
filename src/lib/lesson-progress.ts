"use client";

const STORAGE_KEY = "music-theory-lab.lesson-progress.v1";

export const LESSON_IDS = [
  "chord-basics",
  "chord-types",
  "scales",
  "diatonic",
  "progressions",
  "tensions",
] as const;

export type LessonId = (typeof LESSON_IDS)[number];

function readSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((v): v is string => typeof v === "string"));
  } catch {
    return new Set();
  }
}

function writeSet(set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // noop
  }
}

export function markLessonCompleted(id: LessonId | string): void {
  const set = readSet();
  if (set.has(id)) return;
  set.add(id);
  writeSet(set);
}

export function isLessonCompleted(id: LessonId | string): boolean {
  return readSet().has(id);
}

export function getCompletedLessons(): string[] {
  return [...readSet()];
}

export function getCompletedCount(): number {
  return readSet().size;
}
