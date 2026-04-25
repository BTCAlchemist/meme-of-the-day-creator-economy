import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCreatorById, MOCK_MEMES } from "@/lib/data";
import { MemeCard } from "@/components/MemeCard";
import { CreatorInvestButton } from "@/components/CreatorInvestButton";
import { PoweredByBagsBadge } from "@/components/BagsToast";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  ImageIcon,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  params: { id: string };
}

export default function CreatorPage({ params }: Props) {
  const creator = getCreatorById(params.id);
  if (!creator) notFound();

  const memes = MOCK_MEMES.filter((m) => m.creatorId === params.id);
  const positive = creator.token.priceChange24h > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={creator.avatarUrl}
              alt={creator.username}
              width={72}
              height={72}
              className="rounded-full bg-gray-800 border-2 border-border"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white">
                  {creator.username}
                </h1>
                {creator.token.spiking && (
                  <span className="flex items-center gap-1 bg-hot/15 border border-hot/40 text-hot text-xs font-bold px-2 py-0.5 rounded-lg">
                    <AlertTriangle size={10} />
                    SPIKE
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm max-w-md">{creator.bio}</p>
              <p className="text-xs text-gray-600 mt-1">
                Joined{" "}
                {formatDistanceToNow(new Date(creator.joinedAt), {
                  addSuffix: true,
                })}
                · {creator.memeCount} memes
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <PoweredByBagsBadge />
            <CreatorInvestButton creator={creator} />
          </div>
        </div>

        {/* Token stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          {[
            {
              icon: BarChart3,
              label: "Token Price",
              value: `${creator.token.price} SOL`,
              mono: true,
            },
            {
              icon: positive ? TrendingUp : TrendingDown,
              label: "24h Change",
              value: `${positive ? "+" : ""}${creator.token.priceChange24h}%`,
              color: positive ? "text-green-400" : "text-red-400",
            },
            {
              icon: Users,
              label: "Holders",
              value: creator.token.holders.toLocaleString(),
            },
            {
              icon: Zap,
              label: "Volume (SOL)",
              value: creator.token.totalVolume.toFixed(1),
              color: "text-bags",
            },
          ].map(({ icon: Icon, label, value, color, mono }) => (
            <div
              key={label}
              className="bg-bg/60 border border-border/50 rounded-xl p-4"
            >
              <Icon size={16} className="text-gray-500 mb-2" />
              <p
                className={`text-lg font-bold ${color ?? "text-white"} ${mono ? "font-mono" : ""}`}
              >
                {value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Bags project link */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <Zap size={12} className="text-bags" />
          <span>
            Bags Project ID:{" "}
            <span className="font-mono text-bags">{creator.bagsProjectId}</span>
          </span>
        </div>
      </div>

      {/* Memes */}
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon size={18} className="text-accent-light" />
        <h2 className="text-xl font-black text-white">
          Memes by {creator.username}
        </h2>
      </div>

      {memes.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No memes yet.</p>
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
