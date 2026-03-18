"use client";

import { useEffect, useMemo, useState } from "react";
import type { ApplyWizardData } from "./wizardTypes";
import { loadApplyWizard, saveApplyWizard } from "./wizardStore";

type Props = {
  stepIndex: number;        // 0..5
  totalSteps: number;       // 6
  title: string;
  subtitle?: string;
  children: React.ReactNode;

  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
};

export default function WizardShell({
  stepIndex,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue",
}: Props) {
  const pct = useMemo(() => {
    const denom = Math.max(1, totalSteps - 1);
    return Math.round((stepIndex / denom) * 100);
  }, [stepIndex, totalSteps]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 16px",
      }}
    >
      <div
        style={{
          width: "min(920px, 100%)",
          borderRadius: 18,
          background: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          padding: 22,
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onBack}
            disabled={!onBack}
            style={{
              opacity: onBack ? 1 : 0.45,
              borderRadius: 999,
              padding: "10px 14px",
              border: "1px solid rgba(0,0,0,0.10)",
              background: "white",
              cursor: onBack ? "pointer" : "not-allowed",
            }}
          >
            ← Back
          </button>

          <div style={{ flex: 1 }} />

          <div style={{ width: 220 }}>
            <div
              style={{
                height: 10,
                borderRadius: 999,
                background: "rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 999,
                  background: "#0ea5e9",
                  transition: "width 200ms ease",
                }}
              />
            </div>
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7, textAlign: "right" }}>
              Step {stepIndex + 1} of {totalSteps}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "18px 6px 8px" }}>
          <h1 style={{ fontSize: 34, margin: "10px 0 6px" }}>{title}</h1>
          {subtitle ? <div style={{ opacity: 0.7, marginBottom: 18 }}>{subtitle}</div> : null}

          <div style={{ marginTop: 10 }}>{children}</div>

          {/* Bottom actions */}
          <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
            <button
              onClick={onNext}
              disabled={!onNext || !!nextDisabled}
              style={{
                width: "min(420px, 100%)",
                borderRadius: 999,
                padding: "14px 18px",
                fontWeight: 700,
                fontSize: 16,
                border: "1px solid rgba(0,0,0,0.10)",
                background: nextDisabled ? "rgba(14,165,233,0.35)" : "#0ea5e9",
                color: "white",
                cursor: !onNext || nextDisabled ? "not-allowed" : "pointer",
              }}
            >
              {nextLabel} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Small helper hook you’ll use inside step pages
 */
export function useApplyWizard() {
  const [data, setData] = useState<ApplyWizardData>({});

  useEffect(() => {
    setData(loadApplyWizard());
  }, []);

  function patch(p: Partial<ApplyWizardData>) {
    setData((prev) => {
      const next = { ...prev, ...p };
      saveApplyWizard(next);
      return next;
    });
  }

  return { data, patch };
}
