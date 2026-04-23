import type { Metadata } from "next";
import { MelodyClient } from "@/components/melody-client";

export const metadata: Metadata = {
  title: "メロディ入力 - Music Theory Lab",
  description: "コード進行の上にピアノでメロディを重ねよう。録音して伴奏と同時再生できます。",
};

export default function MelodyPage() {
  return <MelodyClient />;
}
