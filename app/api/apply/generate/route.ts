import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body?.wizard ?? body?.data ?? body ?? {};

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY in environment." }, { status: 500 });
    }

    const resumeText = (data.resumeText ?? "").trim();
    const jobDescription = (data.jobDescription ?? "").trim();
    const desiredTitles = Array.isArray(data.desiredTitles) ? data.desiredTitles : [];

    if (resumeText.length < 80) {
      return NextResponse.json({ error: "Resume text is too short." }, { status: 400 });
    }
    if (jobDescription.length < 120) {
      return NextResponse.json({ error: "Job description is too short." }, { status: 400 });
    }
    if (desiredTitles.length < 1) {
      return NextResponse.json({ error: "At least one desired title is required." }, { status: 400 });
    }

    const system = `
You are Job Co-Pilot, an ethical job-application assistant.

Rules:
- NEVER fabricate experience, employers, degrees, certifications, metrics, or security clearances.
- Only use what the user provided in resumeText.
- If something is unknown, do NOT invent it; write in a truthful, general way.
- Respect work authorization and sponsorship fields: do not contradict them.
- Output MUST be valid JSON only (no markdown).
`;

    const user = `
Create an "Apply Packet" tailored to the job.

User context:
- employmentStatus: ${data.employmentStatus ?? "unknown"}
- desiredTitles: ${desiredTitles.join(", ")}
- workAuthUS: ${data.workAuthUS ?? "unknown"}
- sponsorshipNeeded: ${data.sponsorshipNeeded ?? "unknown"}
- workPreference: ${data.workPreference ?? "unknown"}
- location: ${data.location ?? "unknown"}
- salaryRange: ${data.salaryRange ?? "unknown"}
- job meta: company="${data.jobCompany ?? ""}", title="${data.jobTitle ?? ""}", link="${data.jobLink ?? ""}"
- jobId (if present): "${data.jobId ?? ""}"

Resume text:
${resumeText}

Job description:
${jobDescription}

Return JSON with exactly these keys:
{
  "fit_score": number,
  "tailored_resume_bullets": string[],
  "cover_letter": string,
  "screening_answers": {
    "authorized_to_work_in_us": string,
    "need_sponsorship": string,
    "why_this_role": string,
    "why_this_company": string,
    "availability": string
  }
}
`;

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          { role: "system", content: system.trim() },
          { role: "user", content: user.trim() },
        ],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json(
        { error: "OpenAI request failed", details: errText.slice(0, 2000) },
        { status: 500 }
      );
    }

    const json = await resp.json();
    const text = json?.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(text);

    if (!parsed) {
      return NextResponse.json(
        { error: "Model did not return valid JSON", raw: text.slice(0, 4000) },
        { status: 500 }
      );
    }

    // ✅ Optional auto-save to Supabase "packets" table when jobId exists
    let saved = false;
    let packet_id: string | null = null;

    const jobId = (data.jobId ?? "").trim();
    if (jobId) {
      try {
        const supabase = supabaseServer();

        const insertPayload = {
          job_id: jobId,
          resume_bullets: JSON.stringify(parsed.tailored_resume_bullets ?? []),
          cover_letter: String(parsed.cover_letter ?? ""),
          screening_answers: JSON.stringify(parsed.screening_answers ?? {}),
        };

        const { data: row, error } = await supabase
          .from("packets")
          .insert(insertPayload)
          .select("id")
          .single();

        if (!error && row?.id) {
          saved = true;
          packet_id = row.id as string;
        }
      } catch {
        // If saving fails, we still return the generated content
      }
    }

    return NextResponse.json({
      ...parsed,
      saved,
      packet_id,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
