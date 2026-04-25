"use client";

import { useState } from "react";
import { ArrowUp, MessageCircle, ShoppingCart, Zap } from "lucide-react";
import { Meme, Creator } from "@/lib/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAppStore } from "@/lib/store";
import { InvestModal } from "./InvestModal";

interface Props {
  meme: Meme;
  creator: Creator;
}

export function MemeActionBar({ meme, creator }: Props) {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { votedMemes, voteOnMeme, addToast } = useAppStore();
  const [investOpen, setInvestOpen] = useState(false);

  const hasVoted = votedMemes.has(meme.id);
  const voteCount = meme.votes + (hasVoted ? 1 : 0);

  const handleVote = () => {
    if (!publicKey) { setVisible(true); return; }
    if (!hasVoted) { voteOnMeme(meme.id); addToast("Vote recorded!", "success"); }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 bg-surface border border-border rounded-2xl p-4">
        <button
          onClick={handleVote}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
            hasVoted
              ? "bg-accent text-white"
              : "bg-bg/60 text-gray-300 hover:text-white hover:bg-white/10 border border-border"
          }`}
        >
          <ArrowUp size={16} />
          {voteCount.toLocaleString()} votes
        </button>

        <a
          href="#comments"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-bg/60 text-gray-300 hover:text-white hover:bg-white/10 border border-border transition-colors"
        >
          <MessageCircle size={16} />
          {meme.comments.length} comments
        </a>

        {meme.isNFT && (
          <button
            onClick={() => publicKey ? addToast("NFT purchase coming soon!", "success") : setVisible(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-accent/10 text-accent-light hover:bg-accent/20 border border-accent/30 transition-colors"
          >
            <ShoppingCart size={16} />
            Buy NFT · {meme.nftPrice} SOL
          </button>
        )}

        <button
          onClick={() => setInvestOpen(true)}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-bags hover:bg-bags-light transition-all hover:scale-105 active:scale-95"
        >
          <Zap size={16} />
          Invest in {creator.username}
        </button>
      </div>

      {investOpen && (
        <InvestModal creator={creator} onClose={() => setInvestOpen(false)} />
      )}
    </>
  );
}
