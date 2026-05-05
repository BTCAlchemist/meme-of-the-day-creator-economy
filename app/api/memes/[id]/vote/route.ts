import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();
  const { id } = params;
  const { data, error: fetchError } = await supabase
    .from("memes")
    .select("total_votes")
    .eq("id", id)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 404 });

  const { error } = await supabase
    .from("memes")
    .update({ total_votes: (data.total_votes ?? 0) + 1 })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, total_votes: (data.total_votes ?? 0) + 1 });
}
