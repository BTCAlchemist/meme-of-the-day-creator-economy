"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, MessageCircle, ShoppingCart, TrendingUp, Zap, Flame } from "lucide-react";
import { Meme, Creator } from "@/lib/types";
import { getCreatorById } from "@/lib/data";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAppStore } from "@/lib/store";
import { InvestModal } from "./InvestModal";
import { formatDistanceToNow } from "date-fns";

interface Props {
  meme: Meme;
  featured?: boolean;
}

export function MemeCard({ meme, featured = false }: Props) {
  const creator = getCreatorById(meme.creatorId)!;
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { votedMemes, voteOnMeme, addToast } = useAppStore();
  const [investOpen, setInvestOpen] = useState(false);

  const hasVoted = votedMemes.has(meme.id);
  const voteCount = meme.votes + (hasVoted ? 1 : 0);

  const handleVote = () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }
    if (!hasVoted) {
      voteOnMeme(meme.id);
      addToast(`Voted for "${meme.title.slice(0, 30)}…"`, "success");
    }
  };

  return (
    <>
      <div
        className={`group bg-surface border border-border rounded-2xl overflow-hidden transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 ${
          featured ? "ring-2 ring-bags ring-offset-2 ring-offset-bg" : ""
        }`}
      >
        {/* Featured badge */}
        {featured && (
          <div className="flex items-center gap-1.5 bg-bags px-4 py-1.5 text-white text-xs font-bold">
            <Flame size={12} />
            MEME OF THE DAY
          </div>
        )}

        {/* Image */}
        <Link href={`/meme/${meme.id}`} className="block relative">
          <div
            className={`relative w-full overflow-hidden bg-gray-900 ${
              featured ? "h-72" : "h-48"
            }`}
          >
            <Image
              src={meme.imageUrl}
              alt={meme.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {meme.isNFT && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm border border-accent/50 text-accent-light text-xs font-bold px-2 py-0.5 rounded-lg">
                NFT · {meme.nftPrice} SOL
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <Link href={`/meme/${meme.id}`}>
            <h3 className="font-bold text-white text-sm leading-snug mb-2 hover:text-accent-light transition-colors line-clamp-2">
              {meme.title}
            </h3>
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {meme.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-bg/60 text-gray-400 px-2 py-0.5 rounded-full border border-border/50"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Creator row */}
          <div className="flex items-center justify-between">
            <Link
              href={`/creator/${creator.id}`}
              className="flex items-center gap-2 group/creator"
            >
              <Image
                src={creator.avatarUrl}
                alt={creator.username}
                width={24}
                height={24}
                className="rounded-full bg-gray-800"
              />
              <div>
                <p className="text-xs font-semibold text-white group-hover/creator:text-accent-light transition-colors">
                  {creator.username}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-bags font-mono font-bold">
                    ${creator.token.symbol}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      creator.token.priceChange24h > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {creator.token.priceChange24h > 0 ? "+" : ""}
                    {creator.token.priceChange24h}%
                  </span>
                  {creator.token.spiking && (
                    <span className="text-xs bg-hot/20 text-hot font-bold px-1 rounded animate-spike">
                      🔥 SPIKE
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(meme.postedAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
            {/* Vote */}
            <button
              onClick={handleVote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                hasVoted
                  ? "bg-accent/20 text-accent-light border border-accent/50"
                  : "bg-bg/60 text-gray-400 hover:text-white hover:bg-white/10 border border-border/50"
              }`}
            >
              <ArrowUp size={14} />
              {voteCount.toLocaleString()}
            </button>

            {/* Comments */}
            <Link
              href={`/meme/${meme.id}#comments`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white bg-bg/60 hover:bg-white/10 border border-border/50 transition-colors"
            >
              <MessageCircle size={14} />
              {meme.comments.length}
            </Link>

            {/* Buy NFT */}
            {meme.isNFT && (
              <button
                onClick={() =>
                  publicKey ? addToast("NFT purchase coming soon!", "success") : setVisible(true)
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-accent-light bg-bg/60 hover:bg-accent/10 border border-border/50 hover:border-accent/50 transition-colors"
              >
                <ShoppingCart size={14} />
                Buy
              </button>
            )}

            {/* Invest in creator */}
            <button
              onClick={() => setInvestOpen(true)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-bags bg-bags/10 hover:bg-bags/20 border border-bags/30 hover:border-bags/60 transition-all hover:scale-105"
            >
              <Zap size={12} />
              Invest
            </button>
          </div>
        </div>
      </div>

      {investOpen && (
        <InvestModal creator={creator} onClose={() => setInvestOpen(false)} />
      )}
    </>
  );
}
