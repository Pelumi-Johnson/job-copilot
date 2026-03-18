"use client";

import Link from "next/link";

export default function WizardShell({
  title,
  subtitle,
  stepLabel,
  progress, // 0..1
  backHref,
  children,
}: {
  title: string;
  subtitle?: string;
  stepLabel: string;
  progress: number;
  backHref: string;
  children: React.ReactNode;
}) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "42px 24px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <Link href={backHref} style={btnGhost}>
          ← Back
        </Link>

        <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.65 }}>{stepLabel}</div>

        <div style={{ width: 66 }} />
      </div>

      <div style={{ marginTop: 18, display: "grid", justifyItems: "center", textAlign: "center", gap: 8 }}>
        <h1 style={{ margin: 0, fontSize: 34, letterSpacing: -0.9, fontWeight: 990 }}>{title}</h1>
        {subtitle ? <p style={{ margin: 0, opacity: 0.7, lineHeight: 1.6 }}>{subtitle}</p> : null}
      </div>

      <div style={{ marginTop: 18, display: "grid", justifyItems: "center" }}>
        <div style={progressWrap}>
          <div style={{ ...progressFill, width: `${pct}%` }} />
        </div>
      </div>

      <div style={{ marginTop: 22, display: "grid", justifyItems: "center" }}>
        <div style={card}>{children}</div>
      </div>
    </main>
  );
}

const btnGhost: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid #ededed",
  background: "#fff",
  textDecoration: "none",
  color: "#111",
  fontWeight: 900,
};

const progressWrap: React.CSSProperties = {
  width: "min(640px, 100%)",
  height: 12,
  borderRadius: 999,
  background: "#efeffa",
  border: "1px solid #e8e8f5",
  overflow: "hidden",
};

const progressFill: React.CSSProperties = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg, #0ea5e9 0%, #38bdf8 50%, #0ea5e9 100%)",
};

const card: React.CSSProperties = {
  width: "min(720px, 100%)",
  background: "#fff",
  border: "1px solid #ededed",
  borderRadius: 22,
  padding: 18,
  boxShadow: "0 18px 60px rgba(0,0,0,0.06)",
};
