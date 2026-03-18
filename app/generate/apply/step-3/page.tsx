"use client";

import WizardShell, { useApplyWizard } from "@/components/wizard/WizardShell";

export default function ApplyStep3() {
  const { data, patch } = useApplyWizard();
  const canContinue = !!data.workPreference;

  return (
    <WizardShell
      stepIndex={3}
      totalSteps={7}
      title="Work preferences"
      subtitle="This helps tailor your application language and filters."
      onBack={() => (window.location.href = "/generate/apply/step-2")}
      onNext={() => (window.location.href = "/generate/apply/step-4")}
      nextDisabled={!canContinue}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ fontWeight: 800 }}>Preferred work setup</div>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              ["remote", "Remote"],
              ["hybrid", "Hybrid"],
              ["onsite", "On-site"],
              ["open", "Open to any"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => patch({ workPreference: k as any })}
                style={{
                  textAlign: "left",
                  borderRadius: 12,
                  padding: "12px 14px",
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: data.workPreference === k ? "rgba(14,165,233,0.14)" : "white",
                  cursor: "pointer",
                  fontWeight: 650,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14, padding: 14, display: "grid", gap: 10 }}>
          <div style={{ fontWeight: 800 }}>Location (optional)</div>
          <input
            value={data.location ?? ""}
            onChange={(e) => patch({ location: e.target.value })}
            placeholder="City, State (e.g., Newark, NJ)"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)", outline: "none" }}
          />

          <div style={{ fontWeight: 800 }}>Salary range (optional)</div>
          <input
            value={data.salaryRange ?? ""}
            onChange={(e) => patch({ salaryRange: e.target.value })}
            placeholder="e.g., $70k–$95k"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)", outline: "none" }}
          />
        </div>
      </div>
    </WizardShell>
  );
}
