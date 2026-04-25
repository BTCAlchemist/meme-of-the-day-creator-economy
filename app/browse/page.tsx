"use client";

import { useState } from "react";
import { MOCK_MEMES, getMemesThisWeek } from "@/lib/data";
import { MemeCard } from "@/components/MemeCard";
import { Tab } from "@/lib/types";
import { LayoutGrid } from "lucide-react";

const TABS: { id: Tab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "all", label: "All Memes" },
];

export default function BrowsePage() {
  const [tab, setTab] = useState<Tab>("today");

  const memes =
    tab === "today"
      ? MOCK_MEMES.filter((m) => {
          const posted = new Date(m.postedAt);
          const today = new Date();
          return posted.toDateString() === today.toDateString();
        })
      : tab === "week"
      ? getMemesThisWeek()
      : MOCK_MEMES;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <LayoutGrid size={24} className="text-accent-light" />
        <h1 className="text-2xl font-black text-white">Browse Memes</h1>
        <span className="text-sm text-gray-500">
          — no login required to browse
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-surface border border-border rounded-xl p-1.5 w-fit">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === id
                ? "bg-accent text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {memes.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🫙</p>
          <p className="font-semibold text-lg">No memes yet for this period</p>
          <p className="text-sm mt-1">Be the first to post today!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {memes.map((m) => (
            <MemeCard key={m.id} meme={m} featured={m.isMemeOfDay} />
          ))}
        </div>
      )}
    </div>
  );
}
