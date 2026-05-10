import { getCreatorsWithMemeCounts } from "@/lib/db";
import { MOCK_CREATORS, creatorFromDbUser } from "@/lib/data";
import { LeaderboardClient } from "./LeaderboardClient";
import { Creator } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  let realCreators: Creator[] = [];
  try {
    const dbUsers = await getCreatorsWithMemeCounts();
    realCreators = dbUsers
      .filter((u) => u.memeCount > 0)
      .map(creatorFromDbUser);
  } catch {
    // fall back to mock-only if DB is unavailable
  }

  const allCreators = [...MOCK_CREATORS, ...realCreators].sort(
    (a, b) => b.token.totalVolume - a.token.totalVolume
  );

  return <LeaderboardClient creators={allCreators} />;
}
