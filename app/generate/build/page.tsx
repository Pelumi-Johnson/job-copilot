"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GenerateSteps from "@/components/GenerateSteps";

const LS_KEY = "jobcopilot_generate";

type Draft = {
  company: string;
  title: string;
  link: string;
  workplaceType: "On-site" | "Hybrid" | "Remote";
  location: string;
  description: string;

  resumeText: string;
  experienceLevel: "Junior" | "Mid" | "Senior";
  skillFocus: string[];
};

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function GenerateBuildStepPage() {
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    setDraft(readDraft());
  }, []);

  const missing = useMemo(() => {
    if (!draft) return true;
    return !draft.description || draft.description.trim().length < 30;
  }, [draft]);

  if (!draft) {
    return (
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "50px 24px" }}>
        <div style={{ opacity: 0.75 }}>Loading…</div>
      </main>
    );
  }

  if (missing) {
    return (
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "50px 24px" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>Step 3 needs Step 1</h1>
        <p style={{ marginTop: 10, opacity: 0.75, lineHeight: 1.6 }}>
          Go back and add a job description first.
        </p>
        <Link href="/generate" style={btnPrimary}>
          ← Back to Step 1
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 34, letterSpacing: -0.6, fontWeight: 950 }}>
            Generate Apply Packet
          </h1>
          <p style={{ marginTop: 10, marginBottom: 0, opacity: 0.75, lineHeight: 1.6 }}>
            Step 3 of 3 — Build.
          </p>
          <GenerateSteps step={3} />
        </div>

        <Link href="/dashboard" style={btnSecondary}>
          ← Dashboard
        </Link>
      </div>

      <section style={{ marginTop: 22, display: "grid", gap: 14 }}>
        <div style={panel}>
          <h2 style={panelTitle}>Summary</h2>
          <div style={{ display: "grid", gap: 8, opacity: 0.85 }}>
            <div><b>Company:</b> {draft.company || "—"}</div>
            <div><b>Title:</b> {draft.title || "—"}</div>
            <div><b>Workplace:</b> {draft.workplaceType}</div>
            <div><b>Location:</b> {draft.location || "—"}</div>
            <div><b>Experience:</b> {draft.experienceLevel || "—"}</div>
            <div><b>Skill focus:</b> {(draft.skillFocus || []).length ? draft.skillFocus.join(", ") : "—"}</div>
          </div>
        </div>

        <div style={panel}>
          <h2 style={panelTitle}>Build actions</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <button style={btnPrimary} onClick={() => alert("Next step: wire to API to save job + create packet + generate bullets.")}>
              ✨ Generate Resume Bullets
            </button>
            <button style={btnPrimary} onClick={() => alert("Next step: wire to API to generate cover letter.")}>
              ✨ Generate Cover Letter
            </button>
            <button style={btnPrimary} onClick={() => alert("Next step: wire to API to generate screening answers.")}>
              ✨ Generate Screening Answers
            </button>
          </div>

          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.7, lineHeight: 1.5 }}>
            These buttons are wired next: they will save the job, create a packet, call OpenAI, store results in Supabase, then redirect you to the packet page.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/generate/profile" style={btnSecondary}>
            ← Back
          </Link>
        </div>
      </section>
    </main>
  );
}

const panel: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 18,
  background: "#fff",
};

const panelTitle: React.CSSProperties = {
  margin: 0,
  marginBottom: 12,
  fontSize: 15,
  fontWeight: 950,
  letterSpacing: -0.2,
  opacity: 0.9,
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 16px",
  borderRadius: 12,
  background: "#111",
  color: "#fff",
  border: "none",
  textDecoration: "none",
  fontWeight: 900,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 14px",
  borderRadius: 12,
  background: "#fff",
  color: "#111",
  border: "1px solid #eee",
  textDecoration: "none",
  fontWeight: 900,
  cursor: "pointer",
};
