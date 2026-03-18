"use client";

import { useState } from "react";
import WizardShell, { useApplyWizard } from "@/components/wizard/WizardShell";

export default function ApplyStep1() {
  const { data, patch } = useApplyWizard();
  const titles = data.desiredTitles ?? [];
  const [input, setInput] = useState("");

  const canContinue = titles.length > 0;

  function addTitle() {
    const t = input.trim();
    if (!t) return;
    if (titles.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setInput("");
      return;
    }
    patch({ desiredTitles: [...titles, t] });
    setInput("");
  }

  function removeTitle(t: string) {
    patch({ desiredTitles: titles.filter((x) => x !== t) });
  }

  return (
    <WizardShell
      stepIndex={1}
      totalSteps={7}
      title="What's your desired job title?"
      subtitle="Add one or more specific titles (e.g., SOC Analyst, GRC Analyst, Security Analyst)."
      onBack={() => (window.location.href = "/generate/apply/step-0")}
      onNext={() => (window.location.href = "/generate/apply/step-2")}
      nextDisabled={!canContinue}
    >
      <div
        style={{
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: 14,
          padding: 14,
          background: "white",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          {titles.map((t) => (
            <span
              key={t}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 999,
                background: "rgba(14,165,233,0.14)",
                border: "1px solid rgba(14,165,233,0.22)",
                fontWeight: 600,
              }}
            >
              {t}
              <button
                onClick={() => removeTitle(t)}
                style={{ border: "none", background: "transparent", cursor: "pointer", fontWeight: 900 }}
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTitle();
              }
            }}
            placeholder="Type a job title…"
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              outline: "none",
            }}
          />
          <button
            onClick={addTitle}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            + Add
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
          Tip: avoid vague titles like “Student” or “Developer.” Specific titles help better matching.
        </div>
      </div>
    </WizardShell>
  );
}
