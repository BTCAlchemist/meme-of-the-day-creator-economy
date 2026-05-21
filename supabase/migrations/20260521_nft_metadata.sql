-- Short-lived NFT metadata records for Metaplex (on-chain URI max ~200 chars).

create table if not exists public.nft_metadata (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  description text not null default 'Meme NFT — MemeDay on Solana',
  created_at timestamptz not null default now()
);

alter table public.nft_metadata enable row level security;

create policy "Public read nft metadata"
  on public.nft_metadata for select
  using (true);
