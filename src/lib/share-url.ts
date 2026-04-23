import type { RhythmPattern } from "./rhythm";

export interface ShareableBuilderState {
  key: string;
  useSeventh: boolean;
  tempo: number;
  degrees: number[];
  rhythm: RhythmPattern;
}

/** URL-safe base64 encoding of a compact JSON. */
export function encodeBuilderState(state: ShareableBuilderState): string {
  const compact = {
    k: state.key,
    s: state.useSeventh ? 1 : 0,
    t: state.tempo,
    d: state.degrees,
    r: state.rhythm,
  };
  const json = JSON.stringify(compact);
  const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(json))) : "";
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBuilderState(hash: string): ShareableBuilderState | null {
  try {
    if (!hash) return null;
    const stripped = hash.startsWith("#") ? hash.slice(1) : hash;
    const b64 = stripped.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = typeof atob === "function"
      ? decodeURIComponent(escape(atob(padded)))
      : "";
    const parsed = JSON.parse(json);
    if (
      typeof parsed === "object" &&
      parsed &&
      typeof parsed.k === "string" &&
      typeof parsed.t === "number" &&
      Array.isArray(parsed.d)
    ) {
      return {
        key: parsed.k,
        useSeventh: parsed.s === 1,
        tempo: parsed.t,
        degrees: parsed.d.filter((n: unknown) => typeof n === "number" && n >= 0 && n <= 6),
        rhythm:
          parsed.r === "eight-beat" ||
          parsed.r === "bossa" ||
          parsed.r === "four-on-floor" ||
          parsed.r === "off"
            ? parsed.r
            : "off",
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
