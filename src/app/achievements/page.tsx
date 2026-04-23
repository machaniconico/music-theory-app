import type { Metadata } from "next";
import { AchievementsClient } from "@/components/achievements-client";

export const metadata: Metadata = {
  title: "アチーブメント - Music Theory Lab",
  description: "学習と演奏の成果を集めよう。",
};

export default function AchievementsPage() {
  return <AchievementsClient />;
}
