"use client";

import WizardShell, { useApplyWizard } from "@/components/wizard/WizardShell";

export default function ApplyStep4() {
  const { data, patch } = useApplyWizard();
  const resume = data.resumeText ?? "";

  return (
    <WizardShell
      stepIndex={4}
      totalSteps={7}
      title="Paste your resume"
      subtitle="Paste your current resume text. You can refine it later."
      onBack={() => (window.location.href = "/generate/apply/step-3")}
      onNext={() => (window.location.href = "/generate/apply/step-5")}
      nextDisabled={resume.trim().length < 80}
      nextLabel="Continue"
    >
      <textarea
        value={resume}
        onChange={(e) => patch({ resumeText: e.target.value })}
        placeholder="Paste resume text here…"
        style={{
          width: "100%",
          minHeight: 260,
          padding: 14,
          borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.12)",
          outline: "none",
          resize: "vertical",
          background: "white",
        }}
      />
      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>Minimum: ~80 characters so we can tailor properly.</div>
    </WizardShell>
  );
}
