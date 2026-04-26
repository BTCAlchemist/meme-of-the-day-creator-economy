"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { X, Upload, Zap, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import {
  createBagsProject,
  createBagsToken,
} from "@/lib/bags";

interface Props {
  onClose: () => void;
}

export function PostMemeModal({ onClose }: Props) {
  const { publicKey } = useWallet();
  const { addToast, emitBagsEvent, myBagsProjectId, myTokenSymbol, setMyBagsProject } =
    useAppStore();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNftPrice] = useState("0.5");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "creating">("form");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasCreatorToken = !!myBagsProjectId;

  useEffect(() => {
    if (!selectedImage) {
      setImagePreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      addToast("Please upload a PNG, JPG, or GIF image.", "error");
      event.target.value = "";
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      addToast("Image is too large. Maximum size is 10MB.", "error");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
  };

  const handleSubmit = async () => {
    if (!publicKey || !title.trim()) return;
    setLoading(true);
    setStep("creating");

    try {
      let projectId = myBagsProjectId;
      let symbol = myTokenSymbol;

      // First-time creator: create Bags project + token
      if (!hasCreatorToken && tokenSymbol) {
        // 1. Create project
        const project = await createBagsProject(
          publicKey.toBase58(),
          title.slice(0, 20)
        );
        projectId = project.projectId;
        emitBagsEvent({ type: "project_created", projectId: project.projectId });
        addToast(
          `Your creator project was created on Bags (ID: ${project.projectId.slice(0, 12)}...)`,
          "bags"
        );

        // 2. Create token
        const token = await createBagsToken(
          project.projectId,
          `${tokenSymbol} Token`,
          tokenSymbol
        );
        symbol = token.symbol;
        emitBagsEvent({
          type: "token_created",
          symbol: token.symbol,
          projectId: project.projectId,
        });
        addToast(
          `Your creator token $${token.symbol} is live on Bags!`,
          "bags"
        );

        setMyBagsProject(project.projectId, token.symbol);
      }

      // Simulate posting the meme
      await new Promise((r) => setTimeout(r, 800));
      addToast(`Meme posted! "${title.slice(0, 30)}…"`, "success");
      onClose();
    } catch {
      addToast("Failed to post meme. Please try again.", "error");
    } finally {
      setLoading(false);
      setStep("form");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="font-bold text-white text-lg">Post a Meme</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Image upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-border hover:border-accent/50 rounded-xl p-5 text-center cursor-pointer transition-colors group"
          >
            {imagePreviewUrl ? (
              <div className="space-y-3">
                <img
                  src={imagePreviewUrl}
                  alt="Selected meme preview"
                  className="mx-auto max-h-56 w-auto rounded-lg object-contain"
                />
                <p className="text-xs text-gray-400">
                  {selectedImage?.name} - click to choose another image
                </p>
              </div>
            ) : (
              <>
                <Upload
                  size={28}
                  className="mx-auto text-gray-500 group-hover:text-accent-light mb-2 transition-colors"
                />
                <p className="text-sm text-gray-400">
                  Drop your meme here or{" "}
                  <span className="text-accent-light">browse</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">PNG, JPG, GIF up to 10MB</p>
              </>
            )}
          </button>

          {/* Title */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="When your transaction confirms before your eyes open…"
              className="w-full bg-bg/60 border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent placeholder:text-gray-600"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="solana, defi, nft"
              className="w-full bg-bg/60 border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent placeholder:text-gray-600"
            />
          </div>

          {/* NFT toggle */}
          <div className="flex items-center justify-between bg-bg/60 border border-border/50 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Mint as NFT</p>
              <p className="text-xs text-gray-500">
                Set a price and earn from sales
              </p>
            </div>
            <button
              onClick={() => setIsNFT(!isNFT)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isNFT ? "bg-accent" : "bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isNFT ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {isNFT && (
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                NFT Price (SOL)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={nftPrice}
                onChange={(e) => setNftPrice(e.target.value)}
                className="w-full bg-bg/60 border border-border rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-accent"
              />
            </div>
          )}

          {/* Creator token (first-time) */}
          {!hasCreatorToken && (
            <div className="bg-bags/10 border border-bags/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-bags" />
                <p className="text-sm font-bold text-bags">
                  Launch Your Creator Token on Bags
                </p>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                First-time creators automatically get a Bags project and a
                fungible creator token. Fans can invest in you directly.
              </p>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                Token Symbol (2-6 chars, e.g. MLRD)
              </label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) =>
                  setTokenSymbol(e.target.value.toUpperCase().slice(0, 6))
                }
                placeholder="MYTKN"
                maxLength={6}
                className="w-full bg-bg/80 border border-bags/30 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-bags placeholder:text-gray-600"
              />
            </div>
          )}

          {hasCreatorToken && (
            <div className="flex items-center gap-2 bg-green-900/20 border border-green-700/30 rounded-xl px-4 py-2.5 text-sm text-green-400">
              <Zap size={14} />
              Creator token ${myTokenSymbol} active on Bags
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 pt-0">
          {step === "creating" ? (
            <div className="w-full py-3.5 rounded-xl bg-bags/20 border border-bags/30 flex items-center justify-center gap-2 text-bags font-semibold">
              <Loader2 size={18} className="animate-spin" />
              Creating on Bags & posting…
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !selectedImage || loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Post Meme{!hasCreatorToken && tokenSymbol ? " & Launch Token" : ""}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
