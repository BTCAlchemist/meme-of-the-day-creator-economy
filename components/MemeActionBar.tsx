"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, ShoppingCart, Zap, Gift } from "lucide-react";
import { DbMeme, Creator } from "@/lib/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAppStore } from "@/lib/store";
import { InvestModal } from "./InvestModal";
import { TipModal } from "./TipModal";

interface Props {
  meme: DbMeme;
  creator: Creator;
  commentCount?: number;
}

export function MemeActionBar({ meme, creator, commentCount = 0 }: Props) {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { votedMemes, hydrateVotedMemes, voteOnMeme, addToast } = useAppStore();
  const [investOpen, setInvestOpen] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [votes, setVotes] = useState(meme.total_votes);

  const wallet = publicKey?.toBase58() ?? null;

  useEffect(() => {
    hydrateVotedMemes(wallet);
  }, [hydrateVotedMemes, wallet]);

  const hasVoted = votedMemes.has(meme.id);
  const displayVotes = votes;

  const handleVote = async () => {
    if (!publicKey) { setVisible(true); return; }
    if (hasVoted) return;
    voteOnMeme(wallet, meme.id);
    setVotes((v) => v + 1);
    const res = await fetch(`/api/memes/${meme.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet_address: wallet }),
    });
    if (!res.ok) throw new Error("Vote failed");
    addToast("Vote recorded!", "success");
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
          {displayVotes.toLocaleString()} votes
        </button>

        <a
          href="#comments"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-bg/60 text-gray-300 hover:text-white hover:bg-white/10 border border-border transition-colors"
        >
          <MessageCircle size={16} />
          {commentCount} comments
        </a>

        {meme.is_nft && meme.price && (
          <button
            onClick={() => publicKey ? addToast("NFT purchase coming soon!", "success") : setVisible(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-accent/10 text-accent-light hover:bg-accent/20 border border-accent/30 transition-colors"
          >
            <ShoppingCart size={16} />
            Buy NFT · {meme.price} SOL
          </button>
        )}

        <button
          onClick={() => setTipOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-bg/60 text-gray-300 hover:text-accent-light hover:bg-accent/10 border border-border hover:border-accent/50 transition-colors"
        >
          <Gift size={16} />
          Tip Creator
        </button>

        <button
          onClick={() => setInvestOpen(true)}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-bags hover:bg-bags-light transition-all hover:scale-105 active:scale-95"
        >
          <Zap size={16} />
          Trade meme token
        </button>
      </div>

      {investOpen && (
        <InvestModal creator={creator} onClose={() => setInvestOpen(false)} />
      )}

      {tipOpen && (
        <TipModal
          creatorWallet={meme.creator_wallet}
          memeCaption={meme.caption}
          onClose={() => setTipOpen(false)}
        />
      )}
    </>
  );
}
