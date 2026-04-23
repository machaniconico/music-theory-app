import type { Metadata } from "next";
import { EarTrainingClient } from "@/components/ear-training-client";

export const metadata: Metadata = {
  title: "耳コピ練習 - Music Theory Lab",
  description: "音程・コード・進行を聴いて当てるインタラクティブな耳トレ。難易度別に練習できます。",
};

export default function EarTrainingPage() {
  return <EarTrainingClient />;
}
