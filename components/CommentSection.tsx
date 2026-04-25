"use client";

import { useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { Comment, Meme } from "@/lib/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAppStore } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";

interface Props {
  meme: Meme;
}

export function CommentSection({ meme }: Props) {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { comments: storeComments, addComment, addToast } = useAppStore();
  const [body, setBody] = useState("");

  const allComments = [
    ...meme.comments,
    ...(storeComments[meme.id] ?? []),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      setVisible(true);
      return;
    }
    if (!body.trim()) return;

    const addr = publicKey.toBase58();
    const comment: Comment = {
      id: Math.random().toString(36).slice(2),
      authorId: addr,
      authorUsername: `${addr.slice(0, 4)}…${addr.slice(-4)}`,
      authorAvatar: `https://api.dicebear.com/8.x/bottts/svg?seed=${addr}`,
      body: body.trim(),
      postedAt: new Date().toISOString(),
    };
    addComment(meme.id, comment);
    setBody("");
    addToast("Comment posted!", "success");
  };

  return (
    <div id="comments" className="space-y-4">
      <h3 className="font-bold text-white text-lg">
        Comments ({allComments.length})
      </h3>

      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              publicKey ? "Add a comment…" : "Connect wallet to comment"
            }
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent placeholder:text-gray-600"
            onClick={() => !publicKey && setVisible(true)}
          />
        </div>
        <button
          type="submit"
          disabled={!body.trim()}
          className="px-4 py-3 bg-accent hover:bg-accent-light disabled:opacity-40 text-white rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          <Send size={16} />
        </button>
      </form>

      {/* Comment list */}
      {allComments.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {allComments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Image
                src={c.authorAvatar}
                alt={c.authorUsername}
                width={32}
                height={32}
                className="rounded-full bg-gray-800 flex-shrink-0"
              />
              <div className="bg-surface border border-border/50 rounded-xl px-4 py-3 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white">
                    {c.authorUsername}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(c.postedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
