import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = String(params?.id || "").trim();
    if (!id) {
      return NextResponse.json({ error: "Missing job id." }, { status: 400 });
    }

    const sb = supabaseServer();

    const { data: job, error: jobErr } = await sb
      .from("jobs")
      .select("id, company, title, link, description, score, created_at, location_text")
      .eq("id", id)
      .single();

    if (jobErr) {
      return NextResponse.json({ error: jobErr.message }, { status: 500 });
    }

    const { data: packet, error: pktErr } = await sb
      .from("packets")
      .select("id, job_id, resume_bullets, cover_letter, screening_answers, created_at")
      .eq("job_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pktErr) {
      return NextResponse.json({ error: pktErr.message }, { status: 500 });
    }

    return NextResponse.json({ job, packet: packet ?? null }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
