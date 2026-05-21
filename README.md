# MemeDay

Memes become assets. Creators become founders. Fans become co-owners.

MemeDay is a Solana-based meme platform built as a creator economy flywheel. Creators post memes and receive SOL tips instantly via Solana Pay. Fans earn platform tokens through engagement. Creators launch individual meme tokens via the Bags SDK. Viral memes become NFTs via Metaplex.

Built with Next.js 14, Supabase, and the Solana wallet ecosystem.

## What works today

- Meme upload, browsing, and voting
- Comments with Supabase persistence
- Solana wallet connection (Phantom)
- Solana Pay QR tipping: scan to send SOL directly to the creator's wallet
- Creator leaderboard and trending tokens page
- Daily featured meme

## In development

- Creator token launch via Bags SDK (UI in place, on-chain transaction next)
- NFT minting via Metaplex (UI in place, on-chain transaction next)
- Platform engagement token with 30-day vesting

## Tech stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Postgres + Storage), @solana/web3.js, Solana Wallet Adapter, Solana Pay, Bags SDK, Metaplex, Zustand

## Setup

Requires Node.js 22 LTS.

npm install

cp .env.example .env.local

Fill in .env.local:
- NEXT_PUBLIC_SUPABASE_URL:        Your Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY:   Your Supabase anon/public key
- SUPABASE_SERVICE_ROLE_KEY:       Your Supabase service role key
- TEST_SOLANA_PRIVATE_KEY:         Your Solana dev net key for automation test

Find Supabase keys in your Supabase dashboard under Project Settings > API.
Create a public Storage bucket named meme-images in your Supabase project. Database definitions are in Supabase folder (run migrations in `supabase/migrations/`, including `nft_metadata` for NFT minting).



npm run dev

Open http://localhost:3000

## CI

GitHub Actions workflow runs unit tests on push. See .github/workflows/ci.yml.
