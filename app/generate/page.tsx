"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Choice = "resume" | "apply" | "interview";

const LS_KEY = "jobcopilot_generate_choice";

// ✅ BACK TO THE BLUE/CYAN LOOK (like your 2nd screenshot)
const ACCENT = "#0ea5e9";
const ACCENT_SOFT = "rgba(14, 165, 233, 0.18)";
const ACCENT_GLOW = "rgba(14, 165, 233, 0.35)";

export default function GenerateChooserPage() {
  const [choice, setChoice] = useState<Choice>("apply");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY) as Choice | null;
      if (saved === "resume" || saved === "apply" || saved === "interview") setChoice(saved);
    } catch {}
  }, []);

  const helperLine = useMemo(() => {
    if (choice === "resume") return "Polish your resume content and generate sharper bullets.";
    if (choice === "interview") return "Practice structured answers and tighten your story.";
    return "Create a complete apply packet from a job description in minutes.";
  }, [choice]);

  function onContinue() {
    try {
      localStorage.setItem(LS_KEY, choice);
    } catch {}

    if (choice === "apply") window.location.href = "/generate/apply/step-0";
    else if (choice === "resume") window.location.href = "/generate/resume/step-0";
    else window.location.href = "/generate/interview/step-0";
  }

  return (
    <main style={page}>
      {/* top bar */}
      <div style={topBar}>
        <Link href="/dashboard" style={btnGhost}>
          ← Back
        </Link>

        {/* ✅ REMOVED the centered "Job Co-Pilot" to avoid redundancy */}
        <div style={{ width: 66 }} />
      </div>

      {/* headline */}
      <div style={hero}>
        <h1 style={h1}>What would you like to do?</h1>
        <p style={sub}>Choose a starting point. You can switch paths any time.</p>
      </div>

      {/* cards */}
      <div style={cards}>
        <OptionCard
          active={choice === "resume"}
          title="Resume Builder"
          desc="Strengthen wording, clarity, and impact for the roles you want."
          icon="📄"
          onClick={() => setChoice("resume")}
          accent={ACCENT}
          glow={ACCENT_GLOW}
          preview={
            <PreviewBox>
              <div style={miniTitle}>Resume Snapshot</div>
              <div style={miniText}>
                • ATS-friendly bullets
                <br />
                • Measurable impact
                <br />
                • Clean structure
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                <MiniLine w="78%" />
                <MiniLine w="64%" />
                <MiniLine w="72%" />
              </div>
            </PreviewBox>
          }
        />

        <OptionCard
          active={choice === "apply"}
          title="Apply Packet Builder"
          desc="Generate tailored bullets, a cover letter, and screening answers."
          icon="🧭"
          onClick={() => setChoice("apply")}
          accent={ACCENT}
          glow={ACCENT_GLOW}
          preview={
            <PreviewBox>
              <div style={{ display: "grid", gap: 10 }}>
                <SmallRow left="Cybersecurity Analyst" right="Great fit" tag="Ready" />
                <SmallRow left="HR Manager, Microsoft" right="Applied" tag="Saved" />
                <SmallRow left="Revenue Analyst, Meta" right="Applied" tag="Saved" />
              </div>
            </PreviewBox>
          }
        />

        <OptionCard
          active={choice === "interview"}
          title="Interview Prep"
          desc="Practice answers with structure, confidence, and clarity."
          icon="🎙️"
          onClick={() => setChoice("interview")}
          accent={ACCENT}
          glow={ACCENT_GLOW}
          preview={
            <PreviewBox>
              <div style={miniTitle}>Practice Prompt</div>
              <div style={{ marginTop: 8, opacity: 0.78, fontSize: 13, lineHeight: 1.5 }}>
                Interviewer: “Tell me about a challenge…”
                <br />
                You: “Here’s the situation, what I did, and the result…”
              </div>

              <div style={audioBar}>
                <div style={dot} />
                <div style={wave} />
              </div>
            </PreviewBox>
          }
        />
      </div>

      {/* continue */}
      <div style={ctaWrap}>
        <button onClick={onContinue} style={btnPrimary}>
          Continue
        </button>
        <div style={helper}>{helperLine}</div>
      </div>
    </main>
  );
}

function OptionCard({
  active,
  title,
  desc,
  icon,
  onClick,
  preview,
  accent,
  glow,
}: {
  active: boolean;
  title: string;
  desc: string;
  icon: string;
  onClick: () => void;
  preview: React.ReactNode;
  accent: string;
  glow: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...card,
        border: active ? `2px solid ${accent}` : "1px solid #e9e9e9",
        boxShadow: active
          ? `0 14px 40px rgba(0,0,0,0.08), 0 0 0 6px ${ACCENT_SOFT}`
          : "0 10px 28px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
      }}
    >
      <div style={cardTop}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={iconBox}>{icon}</div>

          <div>
            <div style={cardTitle}>{title}</div>
            <div style={cardDesc}>{desc}</div>
          </div>
        </div>

        <div
          style={{
            ...radio,
            border: active ? `2px solid ${accent}` : "2px solid #d6d6d6",
            boxShadow: active ? `0 0 0 4px ${ACCENT_SOFT}` : "none",
          }}
        >
          {active ? <div style={{ width: 10, height: 10, borderRadius: 999, background: accent }} /> : null}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>{preview}</div>

      {active ? <div style={{ ...glowEdge, boxShadow: `0 0 44px ${glow}` }} /> : null}
    </button>
  );
}

function PreviewBox({ children }: { children: React.ReactNode }) {
  return <div style={previewBox}>{children}</div>;
}

function SmallRow({ left, right, tag }: { left: string; right: string; tag: string }) {
  return (
    <div style={row}>
      <div style={{ display: "grid", gap: 4 }}>
        <div style={rowLeft}>{left}</div>
        <div style={rowTag}>{tag}</div>
      </div>

      <div style={rowRight}>{right}</div>
    </div>
  );
}

function MiniLine({ w }: { w: string }) {
  return <div style={{ height: 10, borderRadius: 999, background: "#ececec", width: w }} />;
}

/* ---------- styles ---------- */

const page: React.CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "46px 24px 58px",
};

const topBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const hero: React.CSSProperties = {
  marginTop: 26,
  textAlign: "center",
};

const h1: React.CSSProperties = {
  margin: 0,
  fontSize: 34,
  letterSpacing: -0.9,
  fontWeight: 990,
};

const sub: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  opacity: 0.7,
  lineHeight: 1.6,
};

const cards: React.CSSProperties = {
  marginTop: 22,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
  gap: 14,
};

const card: React.CSSProperties = {
  textAlign: "left",
  borderRadius: 22,
  padding: 16,
  cursor: "pointer",
  background: "#fff",
  position: "relative",
  minHeight: 276,
  transition: "transform 140ms ease, box-shadow 140ms ease, border 140ms ease",
};

const cardTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "center",
};

const iconBox: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 14,
  border: "1px solid #eaeaea",
  display: "grid",
  placeItems: "center",
  fontSize: 18,
  background: "linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%)",
};

const cardTitle: React.CSSProperties = {
  fontWeight: 980,
  letterSpacing: -0.2,
};

const cardDesc: React.CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  opacity: 0.72,
  lineHeight: 1.45,
};

const radio: React.CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  background: "#fff",
};

const previewBox: React.CSSProperties = {
  border: "1px solid #ededed",
  borderRadius: 18,
  padding: 14,
  background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
  minHeight: 170,
};

const miniTitle: React.CSSProperties = {
  fontWeight: 950,
  letterSpacing: -0.1,
};

const miniText: React.CSSProperties = {
  marginTop: 8,
  opacity: 0.78,
  fontSize: 13,
  lineHeight: 1.5,
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "center",
  border: "1px solid #ededed",
  borderRadius: 16,
  padding: "10px 12px",
  background: "#fff",
};

const rowLeft: React.CSSProperties = {
  fontWeight: 900,
  fontSize: 13,
  opacity: 0.92,
};

const rowTag: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  opacity: 0.6,
};

const rowRight: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  opacity: 0.7,
};

const ctaWrap: React.CSSProperties = {
  marginTop: 20,
  display: "grid",
  justifyItems: "center",
  gap: 8,
};

const btnPrimary: React.CSSProperties = {
  width: 260,
  padding: "13px 16px",
  borderRadius: 999,
  background: `linear-gradient(90deg, ${ACCENT} 0%, #38bdf8 50%, ${ACCENT} 100%)`,
  color: "#fff",
  border: "none",
  fontWeight: 980,
  cursor: "pointer",
  boxShadow: "0 16px 40px rgba(14,165,233,0.25)",
};

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

const helper: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.65,
  textAlign: "center",
};

const glowEdge: React.CSSProperties = {
  position: "absolute",
  inset: -6,
  borderRadius: 28,
  pointerEvents: "none",
  opacity: 0.16,
};

const audioBar: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #ededed",
  borderRadius: 999,
  padding: "10px 12px",
  background: "#fff",
};

const dot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
  background: ACCENT,
};

const wave: React.CSSProperties = {
  height: 10,
  flex: 1,
  borderRadius: 999,
  background: "linear-gradient(90deg, #e5e5e5 0%, #f1f1f1 50%, #e5e5e5 100%)",
};
