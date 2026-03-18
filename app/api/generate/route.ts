import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

async function geocodeLocation(locationText: string) {
  const key = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!key) {
    return {
      ok: false,
      status: "NO_KEY",
      error_message: "Missing GOOGLE_GEOCODING_API_KEY",
      lat: null as number | null,
      lng: null as number | null,
    };
  }

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json" +
    `?address=${encodeURIComponent(locationText)}` +
    `&key=${encodeURIComponent(key)}`;

  const res = await fetch(url, { method: "GET" });
  const data = await res.json();

  if (!res.ok) {
    return {
      ok: false,
      status: "HTTP_ERROR",
      error_message: `HTTP ${res.status}`,
      lat: null,
      lng: null,
    };
  }

  if (data.status !== "OK" || !data.results?.length) {
    return {
      ok: false,
      status: data.status || "UNKNOWN",
      error_message: data.error_message || null,
      lat: null,
      lng: null,
    };
  }

  const top = data.results[0];
  const loc = top.geometry?.location;

  return {
    ok: true,
    status: "OK",
    error_message: null,
    lat: typeof loc?.lat === "number" ? loc.lat : null,
    lng: typeof loc?.lng === "number" ? loc.lng : null,
    formatted_address: top.formatted_address as string | null,
  };
}

function guessLocationFromDescription(desc: string) {
  const remote = desc.match(/\b(remote|hybrid)\b/i);
  if (remote) return remote[0];

  const cityState = desc.match(/\b([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*),\s([A-Z]{2})\b/);
  if (cityState) return `${cityState[1]}, ${cityState[2]}`;

  return "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const company = (body.company ?? "").toString().trim() || null;
    const title = (body.title ?? "").toString().trim() || null;
    const link = (body.link ?? "").toString().trim() || null;
    const description = (body.description ?? "").toString().trim();
    const locationInput = (body.location ?? "").toString().trim();

    if (!description) {
      return NextResponse.json({ error: "Job description is required." }, { status: 400 });
    }

    // 1) choose location_text
    const location_text = locationInput || guessLocationFromDescription(description) || null;

    // 2) geocode
    let lat: number | null = null;
    let lng: number | null = null;

    let geocode_status: string | null = null;
    let geocode_error_message: string | null = null;

    if (location_text) {
      const g = await geocodeLocation(location_text);
      geocode_status = g.status;
      geocode_error_message = (g as any).error_message ?? null;
      if (g.ok) {
        lat = (g as any).lat ?? null;
        lng = (g as any).lng ?? null;
      }
    } else {
      geocode_status = "NO_LOCATION";
    }

    // 3) TEMP mock packet (until your OpenAI logic is re-inserted)
    // Keep this stable so the UI flow works.
    const score = 70;
    const resume_bullets = "";
    const cover_letter = "";
    const screening_answers = "";

    const sb = supabaseServer();

    // 4) insert job
    const { data: job, error: jobErr } = await sb
      .from("jobs")
      .insert({
        company,
        title,
        link,
        description,
        score,
        location_text,
        lat,
        lng,
        status: "saved",
      })
      .select("id")
      .single();

    if (jobErr) throw jobErr;

    // 5) insert packet
    const { error: pktErr } = await sb.from("packets").insert({
      job_id: job.id,
      resume_bullets,
      cover_letter,
      screening_answers,
    });

    if (pktErr) throw pktErr;

    return NextResponse.json(
      {
        saved: true,
        job_id: job.id,
        score,
        resume_bullets,
        cover_letter,
        screening_answers,
        location_text,
        lat,
        lng,
        geocode_status,
        geocode_error_message,
        geocode_key_present: Boolean(process.env.GOOGLE_GEOCODING_API_KEY),
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
