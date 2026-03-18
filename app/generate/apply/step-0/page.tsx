"use client";

import WizardShell, { useApplyWizard } from "@/components/wizard/WizardShell";

export default function ApplyStep0() {
  const { data, patch } = useApplyWizard();
  const value = data.employmentStatus;

  return (
    <WizardShell
      stepIndex={0}
      totalSteps={7}
      title="Describe your current employment status"
      subtitle="This helps us tailor tone and urgency. You can change it later."
      onBack={() => (window.location.href = "/generate")}
      onNext={() => (window.location.href = "/generate/apply/step-1")}
      nextDisabled={!value}
    >
      <div style={{ display: "grid", gap: 12 }}>
        {[
          ["unemployed_need", "Unemployed and really need a job"],
          ["unemployed_ok", "Unemployed but not stressed about it"],
          ["employed_bad", "Badly employed and need a job switch"],
          ["employed_open", "Employed but open to greener pastures"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => patch({ employmentStatus: k as any })}
            style={{
              textAlign: "left",
              borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid rgba(0,0,0,0.10)",
              background: value === k ? "rgba(14,165,233,0.14)" : "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
