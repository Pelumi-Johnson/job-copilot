import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type JobStatus = "saved" | "applied" | "interview" | "rejected" | "followup";

function normalizeStatus(s: any): JobStatus {
  const v = String(s || "saved").toLowerCase().trim();
  if (v === "applied" || v === "interview" || v === "rejected" || v === "followup" || v === "saved") {
    return v;
  }
  return "saved";
}

export async function GET() {
  try {
    const sb = supabaseServer();

    const { data, error } = await sb
      .from("jobs")
      .select(
        "id, company, title, link, score, created_at, lat, lng, location_text, status, follow_up_date, status_updated_at"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ jobs: data ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = String(body?.id || "").trim();
    if (!id) {
      return NextResponse.json({ error: "Missing job id." }, { status: 400 });
    }

    const status = body?.status != null ? normalizeStatus(body.status) : undefined;
    const follow_up_date =
      body?.follow_up_date === "" ? null : (body?.follow_up_date ?? undefined);

    const patch: any = {};
    if (status !== undefined) patch.status = status;
    if (follow_up_date !== undefined) patch.follow_up_date = follow_up_date;

    // update timestamp when tracker changes
    if (Object.keys(patch).length) {
      patch.status_updated_at = new Date().toISOString();
    }

    const sb = supabaseServer();

    const { data: job, error } = await sb
      .from("jobs")
      .update(patch)
      .eq("id", id)
      .select(
        "id, company, title, link, score, created_at, lat, lng, location_text, status, follow_up_date, status_updated_at"
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
