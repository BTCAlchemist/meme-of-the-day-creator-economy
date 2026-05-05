-- Server-side vote enforcement: one vote per wallet per meme.
-- Apply this in Supabase SQL editor or via Supabase CLI migrations.

create table if not exists public.meme_votes (
  id uuid primary key default gen_random_uuid(),
  meme_id uuid not null references public.memes(id) on delete cascade,
  wallet_address text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists meme_votes_meme_wallet_uq
  on public.meme_votes (meme_id, wallet_address);

-- Optional: helpful for analytics / lookups.
create index if not exists meme_votes_wallet_idx
  on public.meme_votes (wallet_address);

-- Atomic voting function:
-- - inserts into meme_votes (fails if duplicate due to unique index)
-- - increments memes.total_votes exactly once
create or replace function public.vote_on_meme(p_meme_id uuid, p_wallet_address text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total integer;
begin
  insert into public.meme_votes (meme_id, wallet_address)
  values (p_meme_id, p_wallet_address);

  update public.memes
  set total_votes = coalesce(total_votes, 0) + 1
  where id = p_meme_id
  returning total_votes into v_total;

  return v_total;
exception
  when unique_violation then
    -- Already voted: return current total without incrementing.
    select total_votes into v_total from public.memes where id = p_meme_id;
    return coalesce(v_total, 0);
end;
$$;

