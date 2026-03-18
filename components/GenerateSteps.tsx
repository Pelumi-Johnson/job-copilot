"use client";

import Link from "next/link";

export default function GenerateSteps({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <StepPill active={step === 1} label="1. Job" href="/generate" />
      <Divider />
      <StepPill active={step === 2} label="2. You" href="/generate/profile" />
      <Divider />
      <StepPill active={step === 3} label="3. Build" href="/generate/build" />
    </div>
  );
}

function StepPill({ active, label, href }: { active: boolean; label: string; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 999,
        border: "1px solid #eee",
        textDecoration: "none",
        fontWeight: 900,
        background: active ? "#111" : "#fff",
        color: active ? "#fff" : "#111",
        opacity: active ? 1 : 0.75,
      }}
    >
      {label}
    </Link>
  );
}

function Divider() {
  return <span style={{ width: 18, height: 1, background: "#eee", display: "inline-block" }} />;
}
