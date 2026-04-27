import { supabase } from "./supabase";
import { DbComment, DbMeme, DbUser } from "./types";
import { unstable_noStore as noStore } from "next/cache";

export async function getMemes(): Promise<DbMeme[]> {
  noStore();
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMemesToday(): Promise<DbMeme[]> {
  noStore();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMemesThisWeek(): Promise<DbMeme[]> {
  noStore();
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .gte("created_at", weekAgo.toISOString())
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMemeOfDay(): Promise<DbMeme | null> {
  noStore();
  const { data } = await supabase
    .from("memes")
    .select("*")
    .order("total_votes", { ascending: false })
    .limit(1)
    .single();
  return data ?? null;
}

export async function getMemeById(id: string): Promise<DbMeme | null> {
  noStore();
  const { data } = await supabase
    .from("memes")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}

export async function getMemesByCreator(wallet: string): Promise<DbMeme[]> {
  noStore();
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .eq("creator_wallet", wallet)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createMeme(
  meme: Omit<DbMeme, "id" | "created_at" | "total_votes">
): Promise<DbMeme> {
  const { data, error } = await supabase
    .from("memes")
    .insert({ ...meme, total_votes: 0 })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getComments(memeId: string): Promise<DbComment[]> {
  noStore();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("meme_id", memeId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addComment(
  comment: Pick<DbComment, "meme_id" | "user_wallet" | "text">
): Promise<DbComment> {
  const { data, error } = await supabase
    .from("comments")
    .insert({ ...comment, likes: 0 })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function upsertUser(
  user: Partial<DbUser> & { wallet_address: string }
): Promise<DbUser> {
  const { data, error } = await supabase
    .from("users")
    .upsert(user, { onConflict: "wallet_address" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserByWallet(wallet: string): Promise<DbUser | null> {
  noStore();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", wallet)
    .single();
  return data ?? null;
}
