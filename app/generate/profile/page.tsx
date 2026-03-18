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

function writeDraft(next: Draft) {
  localStorage.setItem(LS_KEY, JSON.stringify(next));
}

const SKILLS = ["Security Monitoring", "SIEM", "Incident Response", "Cloud", "Linux", "Networking", "Compliance", "Scripting"];

export default function GenerateProfileStepPage() {
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    const d = readDraft();
    setDraft(d);
  }, []);

  const missingStep1 = useMemo(() => {
    if (!draft) return true;
    return !draft.description || draft.description.trim().length < 30;
  }, [draft]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    if (!draft) return;
    const next = { ...draft, [key]: value };
    setDraft(next);
    writeDraft(next);
  }

  function toggleSkill(skill: string) {
    if (!draft) return;
    const has = draft.skillFocus?.includes(skill);
    const nextSkills = has ? draft.skillFocus.filter((s) => s !== skill) : [...(draft.skillFocus || []), skill];
    update("skillFocus", nextSkills);
  }

  if (!draft) {
    return (
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "50px 24px" }}>
        <div style={{ opacity: 0.75 }}>Loading…</div>
      </main>
    );
  }

  if (missingStep1) {
    return (
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "50px 24px" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>Step 2 needs Step 1</h1>
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
            Step 2 of 3 — Your profile.
          </p>
          <GenerateSteps step={2} />
        </div>

        <Link href="/dashboard" style={btnSecondary}>
          ← Dashboard
        </Link>
      </div>

      <section style={{ marginTop: 22, display: "grid", gap: 14 }}>
        <div style={panel}>
          <h2 style={panelTitle}>Resume</h2>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>
            Paste your resume text here (we’ll support uploads later).
          </div>
          <textarea
            value={draft.resumeText || ""}
            onChange={(e) => update("resumeText", e.target.value)}
            placeholder="Paste resume text…"
            style={{ ...input, minHeight: 220, resize: "vertical" }}
          />
        </div>

        <div style={panel}>
          <h2 style={panelTitle}>Experience level</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {(["Junior", "Mid", "Senior"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => update("experienceLevel", lvl)}
                style={{
                  ...chip,
                  background: draft.experienceLevel === lvl ? "#111" : "#fff",
                  color: draft.experienceLevel === lvl ? "#fff" : "#111",
                  borderColor: draft.experienceLevel === lvl ? "#111" : "#eee",
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div style={panel}>
          <h2 style={panelTitle}>Skill focus</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {SKILLS.map((s) => {
              const active = (draft.skillFocus || []).includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  style={{
                    ...chip,
                    background: active ? "#111" : "#fff",
                    color: active ? "#fff" : "#111",
                    borderColor: active ? "#111" : "#eee",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/generate" style={btnSecondary}>
            ← Back
          </Link>
          <Link href="/generate/build" style={btnPrimary}>
            Continue →
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

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid #eee",
  outline: "none",
  fontSize: 14,
  background: "#fff",
};

const chip: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid #eee",
  fontWeight: 900,
  cursor: "pointer",
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
