"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Map from "@/components/Map";

type JobStatus = "saved" | "applied" | "interview" | "rejected" | "followup";
type StatusFilter = JobStatus | "all";

type JobRow = {
  id: string;
  company: string | null;
  title: string | null;
  link: string | null;
  score: number | null;
  created_at: string;
  lat?: number | null;
  lng?: number | null;
  location_text?: string | null;
  status?: JobStatus | null;
  follow_up_date?: string | null;
};

function normalizeStatus(s: any): JobStatus {
  const v = String(s || "saved").toLowerCase().trim();
  if (["applied", "interview", "rejected", "followup", "saved"].includes(v)) {
    return v as JobStatus;
  }
  return "saved";
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e: any) {
      setError(e?.message || "Error loading jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const q = query.toLowerCase();
      const status = normalizeStatus(j.status);

      const matchesQuery =
        (j.company || "").toLowerCase().includes(q) ||
        (j.title || "").toLowerCase().includes(q) ||
        (j.location_text || "").toLowerCase().includes(q);

      const matchesCompany =
        companyFilter === "all" || (j.company || "") === companyFilter;

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesQuery && matchesCompany && matchesStatus;
    });
  }, [jobs, query, companyFilter, statusFilter]);

  const companies = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.company) set.add(j.company);
    });
    return Array.from(set).sort();
  }, [jobs]);

  function trackerChipStyle(active: boolean) {
    return {
      ...trackerChip,
      background: active ? "rgba(17,17,17,0.08)" : "rgba(255,255,255,0.82)",
      border: active ? "1px solid #cfd6df" : "1px solid #dcdfe4",
      color: "#111827",
    } as React.CSSProperties;
  }

  return (
    <main style={page}>
      <div style={shell}>
        <div style={mapWrap}>
          <Map jobs={filtered} variant="hero" />

          <div style={mapVeil} />

          <div style={mapTopLeftPill}>
            <span style={pillDot} />
            <span style={pillText}>Job Map</span>
          </div>

          <div style={mapTopRight}>
            <button
              onClick={load}
              style={{ ...btnLight, opacity: 1, color: "#111827" }}
              disabled={loading}
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>

            <Link href="/generate" style={btnDark}>
              New Apply Packet →
            </Link>
          </div>
        </div>

        <div style={divider} />

        <div style={statusRow}>
          <div style={statusContainer}>
            <button
              style={trackerChipStyle(statusFilter === "applied")}
              onClick={() =>
                setStatusFilter((prev) => (prev === "applied" ? "all" : "applied"))
              }
            >
              <span style={{ ...chipDot, background: "#f2c14d" }} />
              Applied
            </button>

            <button
              style={trackerChipStyle(statusFilter === "interview")}
              onClick={() =>
                setStatusFilter((prev) => (prev === "interview" ? "all" : "interview"))
              }
            >
              <span style={{ ...chipDot, background: "#3b82f6" }} />
              Interview
            </button>

            <button
              style={trackerChipStyle(statusFilter === "rejected")}
              onClick={() =>
                setStatusFilter((prev) => (prev === "rejected" ? "all" : "rejected"))
              }
            >
              <span style={{ ...chipDot, background: "#ef4444" }} />
              Rejected
            </button>

            <button
              style={trackerChipStyle(statusFilter === "followup")}
              onClick={() =>
                setStatusFilter((prev) => (prev === "followup" ? "all" : "followup"))
              }
            >
              <span style={{ ...chipDot, background: "#22c55e" }} />
              Follow-up
            </button>
          </div>
        </div>

        <div style={tableHeaderRow}>
          <div style={headerLeft}>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              style={companySelect}
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>

            <div style={miniSummary}>
              {jobs.filter((j) => normalizeStatus(j.status) === "applied").length} applied /{" "}
              {jobs.filter((j) => normalizeStatus(j.status) === "interview").length} interviews /{" "}
              {jobs.filter((j) => normalizeStatus(j.status) === "rejected").length} rejected
            </div>
          </div>

          <input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={searchBox}
          />
        </div>

        <div style={tableWrap}>
          {error ? <div style={errorBox}>{error}</div> : null}

          <table style={table}>
            <thead>
              <tr>
                <th style={thLeft}>Company / Role</th>
                <th style={th}>Score</th>
                <th style={th}>Status</th>
                <th style={th}>Follow-up date</th>
                <th style={thRight}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((job, index) => (
                <tr key={job.id}>
                  <td style={{ ...tdLeft, borderBottom: rowBorder(index, filtered.length) }}>
                    <div style={{ fontWeight: 900, color: "#111827" }}>
                      {job.company || "Unknown company"}
                    </div>
                    <div style={{ color: "#374151", marginTop: 4, fontWeight: 700 }}>
                      {job.title || "Untitled role"}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>
                      {job.location_text || ""}
                    </div>
                  </td>

                  <td style={{ ...td, borderBottom: rowBorder(index, filtered.length) }}>
                    <span style={scorePill}>
                      {typeof job.score === "number" ? `${job.score}/100` : "—"}
                    </span>
                  </td>

                  <td style={{ ...td, borderBottom: rowBorder(index, filtered.length) }}>
                    <select style={selectControl} defaultValue={normalizeStatus(job.status)}>
                      <option value="saved">Saved</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                      <option value="followup">Follow-up</option>
                    </select>
                  </td>

                  <td style={{ ...td, borderBottom: rowBorder(index, filtered.length) }}>
                    <input type="date" defaultValue={job.follow_up_date || ""} style={dateControl} />
                  </td>

                  <td style={{ ...tdRight, borderBottom: rowBorder(index, filtered.length) }}>
                    <div style={actionsWrap}>
                      <button style={btnActionDark}>View Packet</button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={emptyState}>
                    No matching jobs found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function rowBorder(index: number, total: number) {
  return index === total - 1 ? "none" : "1px solid #eceff3";
}

/* styles */

const page: React.CSSProperties = {
  padding: "20px",
};

const shell: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  background: "#fff",
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid #eceff3",
  boxShadow: "0 8px 30px rgba(15,23,42,0.04)",
};

const mapWrap: React.CSSProperties = {
  height: 340,
  position: "relative",
};

const mapVeil: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "linear-gradient(to bottom, rgba(255,255,255,0.00), rgba(255,255,255,0.04), rgba(255,255,255,0.10))",
};

const mapTopLeftPill: React.CSSProperties = {
  position: "absolute",
  top: 20,
  left: 20,
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
  padding: "12px 16px",
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const mapTopRight: React.CSSProperties = {
  position: "absolute",
  top: 20,
  right: 20,
  display: "flex",
  gap: 12,
  padding: 8,
  borderRadius: 18,
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(255,255,255,0.95)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 14px 28px rgba(0,0,0,0.12)",
};

const pillDot: React.CSSProperties = {
  width: 8,
  height: 8,
  background: "#6b7280",
  borderRadius: 999,
};

const pillText: React.CSSProperties = {
  fontWeight: 900,
  color: "#111827",
  fontSize: 15,
};

const divider: React.CSSProperties = {
  height: 1,
  background: "#e8edf3",
};

const statusRow: React.CSSProperties = {
  padding: "14px 18px",
  background: "#fff",
};

const statusContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  background: "rgba(255,255,255,0.76)",
  border: "1px solid rgba(0,0,0,0.06)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
  borderRadius: 18,
  padding: "12px 14px",
};

const trackerChip: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 999,
  fontWeight: 900,
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  cursor: "pointer",
};

const chipDot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
};

const tableHeaderRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  padding: "16px 18px",
  background: "#f9fafb",
  borderTop: "1px solid #eceff3",
  borderBottom: "1px solid #eceff3",
};

const headerLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
};

const companySelect: React.CSSProperties = {
  border: "1px solid #dcdfe4",
  background: "#fff",
  padding: "12px 16px",
  borderRadius: 14,
  color: "#111827",
  fontWeight: 800,
  minWidth: 220,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
};

const searchBox: React.CSSProperties = {
  border: "1px solid #dcdfe4",
  background: "#fff",
  padding: "12px 16px",
  borderRadius: 14,
  color: "#111827",
  minWidth: 240,
  fontWeight: 700,
};

const miniSummary: React.CSSProperties = {
  color: "#4b5563",
  fontSize: 14,
  fontWeight: 700,
};

const tableWrap: React.CSSProperties = {
  width: "100%",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thBase: React.CSSProperties = {
  textAlign: "left",
  color: "#4b5563",
  fontWeight: 900,
  fontSize: 14,
  padding: "14px 18px",
  background: "#fff",
};

const thLeft: React.CSSProperties = {
  ...thBase,
  paddingLeft: 22,
};

const thRight: React.CSSProperties = {
  ...thBase,
  textAlign: "right",
  paddingRight: 22,
};

const th: React.CSSProperties = {
  ...thBase,
};

const tdBase: React.CSSProperties = {
  padding: "20px 18px",
  verticalAlign: "middle",
  background: "#fff",
};

const tdLeft: React.CSSProperties = {
  ...tdBase,
  paddingLeft: 22,
};

const tdRight: React.CSSProperties = {
  ...tdBase,
  paddingRight: 22,
  textAlign: "right",
};

const td: React.CSSProperties = {
  ...tdBase,
};

const scorePill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #dcdfe4",
  padding: "8px 14px",
  borderRadius: 999,
  color: "#111827",
  background: "#fff",
  fontWeight: 900,
};

const selectControl: React.CSSProperties = {
  border: "1px solid #dcdfe4",
  padding: "10px 14px",
  borderRadius: 12,
  color: "#111827",
  background: "#fff",
  fontWeight: 800,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
};

const dateControl: React.CSSProperties = {
  border: "1px solid #dcdfe4",
  padding: "10px 14px",
  borderRadius: 12,
  color: "#111827",
  background: "#fff",
  fontWeight: 800,
};

const btnLight: React.CSSProperties = {
  border: "1px solid #d1d5db",
  background: "#fff",
  padding: "12px 18px",
  borderRadius: 14,
  color: "#111827",
  fontWeight: 900,
  cursor: "pointer",
};

const btnDark: React.CSSProperties = {
  background: "#111827",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 900,
  display: "inline-flex",
  alignItems: "center",
};

const btnActionDark: React.CSSProperties = {
  background: "#111827",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: 999,
  border: "none",
  fontWeight: 900,
  cursor: "pointer",
};

const actionsWrap: React.CSSProperties = {
  display: "flex",
  gap: 10,
  justifyContent: "flex-end",
  flexWrap: "wrap",
};

const errorBox: React.CSSProperties = {
  margin: 18,
  padding: 14,
  borderRadius: 12,
  background: "#fff7f7",
  border: "1px solid #f3c2c2",
  color: "#a40000",
  fontWeight: 800,
};

const emptyState: React.CSSProperties = {
  padding: 30,
  textAlign: "center",
  color: "#6b7280",
  fontWeight: 700,
};