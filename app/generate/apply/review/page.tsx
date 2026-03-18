"use client";

import { useMemo, useState } from "react";
import WizardShell, { useApplyWizard } from "@/components/wizard/WizardShell";
import { clearApplyWizard } from "@/components/wizard/wizardStore";

type ApplyResult = {
  fit_score: number;
  tailored_resume_bullets: string[];
  cover_letter: string;
  screening_answers: {
    authorized_to_work_in_us: string;
    need_sponsorship: string;
    why_this_role: string;
    why_this_company: string;
    availability: string;
  };
  saved?: boolean;
  packet_id?: string | null;
};

export default function ApplyReview() {
  const { data } = useApplyWizard();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<ApplyResult | null>(null);

  const canGenerate = useMemo(() => {
    return (
      (data.resumeText ?? "").trim().length >= 80 &&
      (data.jobDescription ?? "").trim().length >= 120 &&
      (data.desiredTitles?.length ?? 0) > 0 &&
      !!data.workAuthUS &&
      !!data.sponsorshipNeeded
    );
  }, [data]);

  async function onGenerate() {
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/apply/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizard: data }),
      });

      const out = await res.json();
      if (!res.ok) throw new Error(out?.error || `HTTP ${res.status}`);
      setResult(out as ApplyResult);
    } catch (e: any) {
      setErr(e?.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  const saveHint =
    data.jobId
      ? "This will auto-save your packet to the job (because you selected a saved job)."
      : "Tip: If you want auto-save, select a saved job on Step 5 (so we can attach the packet to a job).";

  return (
    <WizardShell
      stepIndex={6}
      totalSteps={7}
      title="Review & generate"
      subtitle="Truth first — then strong tailoring."
      onBack={() => (window.location.href = "/generate/apply/step-5")}
      onNext={onGenerate}
      nextDisabled={!canGenerate || loading}
      nextLabel={loading ? "Generating..." : "Generate"}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <Card label="Selected jobId" value={data.jobId ? data.jobId : "— (not selected)"} />
        <Card label="Desired titles" value={(data.desiredTitles ?? []).join(", ") || "—"} />
        <Card label="Work authorization (US)" value={data.workAuthUS ?? "—"} />
        <Card label="Sponsorship" value={data.sponsorshipNeeded ?? "—"} />
        <Card label="Resume length" value={`${(data.resumeText ?? "").trim().length} characters`} />
        <Card label="Job description length" value={`${(data.jobDescription ?? "").trim().length} characters`} />

        <div style={{ fontSize: 12, opacity: 0.7 }}>{saveHint}</div>

        {err ? (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: 14,
              padding: 14,
              color: "rgba(0,0,0,0.85)",
            }}
          >
            <b>Generation error:</b> {err}
          </div>
        ) : null}

        {result ? (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={box}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>Fit score</div>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{result.fit_score}/100</div>
                </div>

                <div style={{ textAlign: "right", fontSize: 12, opacity: 0.8 }}>
                  {result.saved ? (
                    <>
                      <div style={{ fontWeight: 900 }}>Saved ✅</div>
                      <div>packet_id: {result.packet_id ?? "—"}</div>
                    </>
                  ) : (
                    <div>Not saved (no job selected)</div>
                  )}
                </div>
              </div>
            </div>

            <div style={box}>
              <div style={h}>Tailored resume bullets</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {(result.tailored_resume_bullets ?? []).map((b, i) => (
                  <li key={i} style={{ marginBottom: 8, lineHeight: 1.4 }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div style={box}>
              <div style={h}>Cover letter</div>
              <pre style={pre}>{result.cover_letter}</pre>
            </div>

            <div style={box}>
              <div style={h}>Screening answers</div>
              <QA q="Authorized to work in US" a={result.screening_answers?.authorized_to_work_in_us} />
              <QA q="Need sponsorship" a={result.screening_answers?.need_sponsorship} />
              <QA q="Why this role" a={result.screening_answers?.why_this_role} />
              <QA q="Why this company" a={result.screening_answers?.why_this_company} />
              <QA q="Availability" a={result.screening_answers?.availability} />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                style={btn}
              >
                Go to Dashboard
              </button>

              <button
                onClick={() => {
                  clearApplyWizard();
                  window.location.href = "/generate";
                }}
                style={btn}
              >
                Reset flow
              </button>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 12, opacity: 0.65 }}>After you generate, results will appear here.</div>
        )}
      </div>
    </WizardShell>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div style={box}>
      <div style={{ fontWeight: 800, marginBottom: 6 }}>{label}</div>
      <div style={{ opacity: 0.8 }}>{value}</div>
    </div>
  );
}

function QA({ q, a }: { q: string; a?: string }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontWeight: 800 }}>{q}</div>
      <div style={{ opacity: 0.85, marginTop: 4 }}>{a || "—"}</div>
    </div>
  );
}

const box: React.CSSProperties = {
  background: "white",
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 14,
  padding: 14,
};

const h: React.CSSProperties = { fontWeight: 900, marginBottom: 8 };

const pre: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  margin: 0,
  lineHeight: 1.45,
  fontFamily: "inherit",
  opacity: 0.9,
};

const btn: React.CSSProperties = {
  borderRadius: 12,
  padding: "10px 12px",
  border: "1px solid rgba(0,0,0,0.12)",
  background: "white",
  cursor: "pointer",
  fontWeight: 900,
};
