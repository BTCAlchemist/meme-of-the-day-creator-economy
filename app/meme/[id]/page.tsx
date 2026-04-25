import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMemeById, getCreatorById } from "@/lib/data";
import { CommentSection } from "@/components/CommentSection";
import { MemeActionBar } from "@/components/MemeActionBar";
import { ArrowLeft, ExternalLink, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  params: { id: string };
}

export default function MemePage({ params }: Props) {
  const meme = getMemeById(params.id);
  if (!meme) notFound();

  const creator = getCreatorById(meme.creatorId)!;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/browse"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to browse
      </Link>

      {/* Featured badge */}
      {meme.isMemeOfDay && (
        <div className="inline-flex items-center gap-1.5 bg-bags text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          <Flame size={12} />
          MEME OF THE DAY
        </div>
      )}

      <h1 className="text-2xl font-black text-white mb-4 leading-tight">
        {meme.title}
      </h1>

      {/* Image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 mb-6 border border-border">
        <Image
          src={meme.imageUrl}
          alt={meme.title}
          fill
          className="object-cover"
          priority
        />
        {meme.isNFT && (
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm border border-accent/50 text-accent-light text-sm font-bold px-3 py-1.5 rounded-xl">
            NFT · {meme.nftPrice} SOL
          </div>
        )}
      </div>

      {/* Creator + metadata */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/creator/${creator.id}`}
          className="flex items-center gap-3 group"
        >
          <Image
            src={creator.avatarUrl}
            alt={creator.username}
            width={44}
            height={44}
            className="rounded-full bg-gray-800 border-2 border-border group-hover:border-accent/50 transition-colors"
          />
          <div>
            <p className="font-bold text-white group-hover:text-accent-light transition-colors">
              {creator.username}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-bags font-mono font-bold">
                ${creator.token.symbol}
              </span>
              <span>·</span>
              <span>
                {formatDistanceToNow(new Date(meme.postedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </Link>

        {meme.isNFT && meme.mintAddress && (
          <a
            href={`https://explorer.solana.com/address/${meme.mintAddress}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-light border border-border hover:border-accent/50 px-3 py-2 rounded-lg transition-colors"
          >
            <ExternalLink size={12} />
            View on Solana
          </a>
        )}
      </div>

      {/* Description */}
      {meme.description && (
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {meme.description}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {meme.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-surface text-gray-400 px-3 py-1 rounded-full border border-border"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Action bar (votes, buy, invest) */}
      <MemeActionBar meme={meme} creator={creator} />

      {/* Comments */}
      <div className="mt-8 pt-8 border-t border-border">
        <CommentSection meme={meme} />
      </div>
    </div>
  );
}
