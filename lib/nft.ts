import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  walletAdapterIdentity,
} from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { getSupabase } from "./supabase";

const DEVNET_RPC = "https://api.devnet.solana.com";

export async function mintMemeNft(
  wallet: WalletContextState,
  walletAddress: string,
  imageUrl: string,
  caption: string
): Promise<string> {
  // Upload NFT metadata JSON to Supabase Storage alongside images
  const metadata = {
    name: caption.slice(0, 32),
    description: "Meme NFT — MemeDay on Solana",
    image: imageUrl,
    properties: {
      files: [{ uri: imageUrl, type: "image/jpeg" }],
      category: "image",
    },
  };

  const supabase = getSupabase();
  const metaPath = `metadata/${walletAddress}/${Date.now()}.json`;
  const metaBlob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });
  const { error: uploadError } = await supabase.storage
    .from("meme-images")
    .upload(metaPath, metaBlob, { contentType: "application/json" });
  if (uploadError) throw new Error(`Metadata upload failed: ${uploadError.message}`);
  const { data: urlData } = supabase.storage
    .from("meme-images")
    .getPublicUrl(metaPath);
  const metadataUri = urlData.publicUrl;

  // Mint NFT on devnet — Phantom will prompt the user to sign
  const umi = createUmi(DEVNET_RPC)
    .use(mplTokenMetadata())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .use(walletAdapterIdentity(wallet as any));

  const mint = generateSigner(umi);
  await createNft(umi, {
    mint,
    name: caption.slice(0, 32),
    symbol: "MDAY",
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(5),
    isMutable: false,
  }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

  return mint.publicKey.toString();
}
