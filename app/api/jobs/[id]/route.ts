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

    // 1) Fetch job (include description here)
    const { data: job, error: jobError } = await sb
      .from("jobs")
      .select(
        "id, company, title, link, description, score, created_at, lat, lng, location_text, status, follow_up_date, status_updated_at"
      )
      .eq("id", id)
      .single();

    if (jobError) {
      return NextResponse.json({ error: jobError.message }, { status: 500 });
    }

    // 2) Fetch latest packet for that job (if any)
    const { data: packet, error: packetError } = await sb
      .from("packets")
      .select("id, job_id, resume_bullets, cover_letter, screening_answers, created_at")
      .eq("job_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (packetError) {
      return NextResponse.json({ error: packetError.message }, { status: 500 });
    }

    return NextResponse.json({ job, packet: packet ?? null }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
