"use client";

import WizardShell, { useApplyWizard } from "@/components/wizard/WizardShell";

export default function ApplyStep2() {
  const { data, patch } = useApplyWizard();

  const workAuthUS = data.workAuthUS;
  const sponsorshipNeeded = data.sponsorshipNeeded;

  const canContinue = !!workAuthUS && !!sponsorshipNeeded;

  return (
    <WizardShell
      stepIndex={2}
      totalSteps={7}
      title="Work authorization & sponsorship"
      subtitle="We ask this to keep everything truthful and aligned with employer requirements."
      onBack={() => (window.location.href = "/generate/apply/step-1")}
      onNext={() => (window.location.href = "/generate/apply/step-3")}
      nextDisabled={!canContinue}
    >
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14, padding: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Are you authorized to work in the U.S.?</div>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              ["yes", "Yes"],
              ["no", "No"],
              ["unsure", "Not sure"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => patch({ workAuthUS: k as any })}
                style={{
                  textAlign: "left",
                  borderRadius: 12,
                  padding: "12px 14px",
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: workAuthUS === k ? "rgba(14,165,233,0.14)" : "white",
                  cursor: "pointer",
                  fontWeight: 650,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14, padding: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Will you need visa sponsorship?</div>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              ["no", "No"],
              ["yes_now", "Yes, now"],
              ["yes_future", "Yes, in the future"],
              ["unsure", "Not sure"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => patch({ sponsorshipNeeded: k as any })}
                style={{
                  textAlign: "left",
                  borderRadius: 12,
                  padding: "12px 14px",
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: sponsorshipNeeded === k ? "rgba(14,165,233,0.14)" : "white",
                  cursor: "pointer",
                  fontWeight: 650,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </WizardShell>
  );
}
