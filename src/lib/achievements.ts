"use client";

const STORAGE_KEY = "music-theory-lab.achievements.v1";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-quiz",
    title: "初めての正解",
    description: "レッスンクイズで初めて正解した",
    icon: "🎯",
  },
  {
    id: "all-lessons",
    title: "知識の達人",
    description: "全レッスンのクイズに合格",
    icon: "🎓",
  },
  {
    id: "first-save",
    title: "作曲家のはじまり",
    description: "初めて進行を保存した",
    icon: "💾",
  },
  {
    id: "first-melody",
    title: "メロディメイカー",
    description: "初めてメロディを録音した",
    icon: "🎤",
  },
  {
    id: "first-midi",
    title: "MIDIスター",
    description: "初めてMIDIで書き出した",
    icon: "💿",
  },
  {
    id: "first-ear-correct",
    title: "耳を澄ませて",
    description: "耳コピ練習で初めて正解した",
    icon: "👂",
  },
  {
    id: "streak-10",
    title: "連続王",
    description: "耳コピで10連続正解した",
    icon: "🔥",
  },
  {
    id: "inversion-master",
    title: "転回の魔術師",
    description: "進行ビルダーで3つ以上のコードを転回形にした",
    icon: "♻️",
  },
  {
    id: "week-master",
    title: "週間達人",
    description: "7日連続でアプリを使った",
    icon: "📅",
  },
];

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

type AchievementListener = (id: string) => void;
const listeners: AchievementListener[] = [];

export function onAchievementUnlocked(fn: AchievementListener): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export function unlockAchievement(id: string): boolean {
  const set = readSet();
  if (set.has(id)) return false;
  set.add(id);
  writeSet(set);
  listeners.forEach((fn) => fn(id));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("achievement-unlocked", { detail: id }));
  }
  return true;
}

export function isAchievementUnlocked(id: string): boolean {
  return readSet().has(id);
}

export function getUnlockedAchievements(): string[] {
  return [...readSet()];
}

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
