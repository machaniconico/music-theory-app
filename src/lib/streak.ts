"use client";

const STORAGE_KEY = "music-theory-lab.streak.v1";

interface StreakState {
  lastDate: string; // YYYY-MM-DD
  current: number;
  best: number;
}

function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readState(): StreakState {
  if (typeof window === "undefined") {
    return { lastDate: "", current: 0, best: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastDate: "", current: 0, best: 0 };
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.lastDate === "string" &&
      typeof parsed?.current === "number" &&
      typeof parsed?.best === "number"
    ) {
      return parsed;
    }
    return { lastDate: "", current: 0, best: 0 };
  } catch {
    return { lastDate: "", current: 0, best: 0 };
  }
}

function writeState(state: StreakState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // noop
  }
}

/**
 * Call once on app load. Updates streak:
 * - Same day as lastDate: no change
 * - Day after lastDate: +1 day
 * - Other: reset to 1
 */
export function recordVisit(): StreakState {
  const state = readState();
  const t = today();

  if (state.lastDate === t) {
    return state;
  }

  const y = yesterday();
  const next: StreakState =
    state.lastDate === y
      ? { lastDate: t, current: state.current + 1, best: Math.max(state.best, state.current + 1) }
      : { lastDate: t, current: 1, best: Math.max(state.best, 1) };
  writeState(next);
  return next;
}

export function getStreak(): StreakState {
  return readState();
}
