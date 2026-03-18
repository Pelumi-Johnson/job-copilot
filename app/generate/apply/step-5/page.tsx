"use client";

import { useEffect, useMemo, useState } from "react";
import WizardShell, { useApplyWizard } from "@/components/wizard/WizardShell";

type JobRow = {
  id: string;
  company: string | null;
  title: string | null;
  link: string | null;
  description: string | null;
  created_at?: string;
};

export default function ApplyStep5() {
  const { data, patch } = useApplyWizard();

  // Optional: pick from saved jobs
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const jd = data.jobDescription ?? "";

  const jdOk = jd.trim().length >= 120;

  useEffect(() => {
    // Load jobs list (optional helper UI)
    (async () => {
      setJobsLoading(true);
      setJobsError(null);
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = (await res.json()) as JobRow[];
        setJobs(Array.isArray(arr) ? arr : []);
      } catch (e: any) {
        setJobsError(e?.message || "Failed to load jobs");
      } finally {
        setJobsLoading(false);
      }
    })();
  }, []);

  const selectedJob = useMemo(() => {
    if (!data.jobId) return null;
    return jobs.find((j) => j.id === data.jobId) ?? null;
  }, [jobs, data.jobId]);

  function selectJob(id: string) {
    const j = jobs.find((x) => x.id === id);
    if (!j) return;

    patch({
      jobId: j.id,
      jobCompany: j.company ?? "",
      jobTitle: j.title ?? "",
      jobLink: j.link ?? "",
      jobDescription: j.description ?? "",
    });
  }

  return (
    <WizardShell
      stepIndex={5}
      totalSteps={7}
      title="Paste the job description"
      subtitle="We’ll tailor your packet to the actual posting. No guessing — just accuracy."
      onBack={() => (window.location.href = "/generate/apply/step-4")}
      onNext={() => (window.location.href = "/generate/apply/review")}
      nextDisabled={!jdOk}
      nextLabel="Review"
    >
      {/* Optional job picker */}
      <div
        style={{
          background: "white",
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: 14,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Use a saved job (optional)</div>

        {jobsLoading ? (
          <div style={{ opacity: 0.7 }}>Loading saved jobs…</div>
        ) : jobsError ? (
          <div style={{ opacity: 0.8 }}>Could not load saved jobs: {jobsError}</div>
        ) : jobs.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No saved jobs found. You can paste a job description below.</div>
        ) : (
          <select
            value={data.jobId ?? ""}
            onChange={(e) => selectJob(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              outline: "none",
            }}
          >
            <option value="">Select a saved job…</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {(j.title ?? "Untitled")} — {(j.company ?? "Unknown")}
              </option>
            ))}
          </select>
        )}

        {selectedJob ? (
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
            Selected: <b>{selectedJob.title ?? "Untitled"}</b> at{" "}
            <b>{selectedJob.company ?? "Unknown"}</b>
          </div>
        ) : null}
      </div>

      {/* Job description input */}
      <textarea
        value={jd}
        onChange={(e) => patch({ jobDescription: e.target.value })}
        placeholder="Paste the full job description here…"
        style={{
          width: "100%",
          minHeight: 280,
          padding: 14,
          borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.12)",
          outline: "none",
          resize: "vertical",
          background: "white",
        }}
      />
      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
        Minimum: ~120 characters so tailoring is meaningful.
      </div>
    </WizardShell>
  );
}
