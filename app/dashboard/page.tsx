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
  follow_up_date?: string | null; // YYYY-MM-DD
  status_updated_at?: string | null;
};

function normalizeStatus(s: any): JobStatus {
  const v = String(s || "saved").toLowerCase().trim();
  if (
    v === "applied" ||
    v === "interview" ||
    v === "rejected" ||
    v === "followup" ||
    v === "saved"
  ) {
    return v;
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

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [savingById, setSavingById] = useState<Record<string, boolean>>({});

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load jobs");

      const nextJobs: JobRow[] = (data.jobs || [])
        .filter((j: JobRow) => Boolean(j?.id))
        .map((j: JobRow) => ({ ...j, status: normalizeStatus(j.status) }));

      setJobs(nextJobs);

      if (selectedJobId && !nextJobs.some((j) => j.id === selectedJobId)) {
        setSelectedJobId(null);
      }
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const c = { applied: 0, interview: 0, rejected: 0 };
    for (const j of jobs) {
      const s = normalizeStatus(j.status);
      if (s === "applied") c.applied++;
      if (s === "interview") c.interview++;
      if (s === "rejected") c.rejected++;
    }
    return c;
  }, [jobs]);

  const companies = useMemo(() => {
    const set = new Set<string>();
    for (const j of jobs) {
      const name = (j.company || "").trim();
      if (name) set.add(name);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = jobs;

    if (statusFilter !== "all") {
      list = list.filter((j) => normalizeStatus(j.status) === statusFilter);
    }

    if (companyFilter !== "all") {
      list = list.filter((j) => (j.company || "").trim() === companyFilter);
    }

    if (!q) return list;

    return list.filter((j) => {
      const c = (j.company || "").toLowerCase();
      const t = (j.title || "").toLowerCase();
      const l = (j.location_text || "").toLowerCase();
      return c.includes(q) || t.includes(q) || l.includes(q);
    });
  }, [jobs, query, statusFilter, companyFilter]);

  useEffect(() => {
    if (!selectedJobId) return;
    if (!filtered.some((j) => j.id === selectedJobId)) setSelectedJobId(null);
  }, [filtered, selectedJobId]);

  async function updateJob(
    id: string,
    patch: { status?: JobStatus; follow_up_date?: string | null }
  ) {
    setError(null);

    const before = jobs;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, ...patch, status: patch.status ?? j.status } : j
      )
    );

    setSavingById((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update");

      if (data?.job?.id) {
        const serverJob: JobRow = {
          ...data.job,
          status: normalizeStatus(data.job.status),
        };
        setJobs((prev) => prev.map((j) => (j.id === id ? serverJob : j)));
      }
    } catch (e: any) {
      setJobs(before);
      setError(e?.message || "Unknown error");
    } finally {
      setSavingById((s) => ({ ...s, [id]: false }));
    }
  }

  function toggleStatus(next: JobStatus) {
    setStatusFilter((prev) => (prev === next ? "all" : next));
  }

  return (
    <main style={{ width: "100%", padding: "14px 24px 40px" }}>
      <div style={shell}>
        {/* MAP */}
        <div style={mapWrap}>
          <Map
            jobs={filtered}
            variant="hero"
            selectedJobId={selectedJobId}
            onSelectJob={(id) => setSelectedJobId(id)}
          />

          {/* Light veil (unchanged) */}
          <div style={mapVeil} />

          {/* Top-left pill */}
          <div style={mapTopLeftPill}>
            <span style={pillDot} />
            <span style={pillText}>Job Map</span>
          </div>

          {/* Top-right controls */}
          <div style={mapTopRight}>
            <button onClick={load} style={btnLight} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <Link href="/generate" style={btnDark}>
              New Apply Packet →
            </Link>
          </div>
        </div>

        {/* ✅ Divider line: Map ends → divider → status container begins */}
        <div style={mapToStatusDivider} />

        {/* ✅ Status container directly BELOW map (flush, no overlap, no float) */}
        <div style={statusRow}>
          <div style={statusContainer}>
            <button
              style={trackerChip(statusFilter === "applied")}
              onClick={() => toggleStatus("applied")}
              type="button"
            >
              <span style={{ ...chipDot, background: "#f2c14d" }} />
              Applied
            </button>

            <span style={pillDivider} />

            <button
              style={trackerChip(statusFilter === "interview")}
              onClick={() => toggleStatus("interview")}
              type="button"
            >
              <span style={{ ...chipDot, background: "#3b82f6" }} />
              Interview
            </button>

            <span style={pillDivider} />

            <button
              style={trackerChip(statusFilter === "rejected")}
              onClick={() => toggleStatus("rejected")}
              type="button"
            >
              <span style={{ ...chipDot, background: "#ef4444" }} />
              Rejected
            </button>

            <span style={pillDivider} />

            <button
              style={trackerChip(statusFilter === "followup")}
              onClick={() => toggleStatus("followup")}
              type="button"
            >
              <span style={{ ...chipDot, background: "#22c55e" }} />
              Follow-up
            </button>
          </div>
        </div>

        {/* HEADER (sits below status container) */}
        <div style={tableHeaderRow}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div style={selectWrap}>
              <span style={selectIcon}>≡</span>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                style={companySelect}
              >
                <option value="all">All Companies</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div style={miniSummary}>
              {counts.applied} applied / {counts.interview} interviews / {counts.rejected} rejected
            </div>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            style={searchBox}
          />
        </div>

        {/* TABLE */}
        <div style={tableWrap}>
          {error ? (
            <div style={errorBox}>
              <b>Error:</b> {error}
            </div>
          ) : null}

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
              {loading ? (
                <tr>
                  <td style={tdEmpty} colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td style={tdEmpty} colSpan={5}>
                    No rows match.
                  </td>
                </tr>
              ) : (
                filtered.map((job) => {
                  const status = normalizeStatus(job.status);
                  const isSaving = !!savingById[job.id];

                  return (
                    <tr
                      key={job.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedJobId(job.id)}
                      title="Click to focus on map"
                    >
                      <td style={tdLeft}>
                        <div style={{ fontWeight: 900 }}>{job.company || "Unknown company"}</div>
                        <div style={{ opacity: 0.82, marginTop: 4, fontWeight: 700 }}>
                          {job.title || "Untitled role"}
                        </div>
                        {job.location_text ? (
                          <div style={{ opacity: 0.62, marginTop: 6, fontSize: 13 }}>
                            {job.location_text}
                          </div>
                        ) : null}
                      </td>

                      <td style={td}>
                        <span style={scorePill}>
                          {typeof job.score === "number" ? `${job.score}/100` : "—"}
                        </span>
                      </td>

                      <td style={td}>
                        <select
                          value={status}
                          disabled={isSaving}
                          onChange={(e) =>
                            updateJob(job.id, { status: normalizeStatus(e.target.value) })
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={selectControl}
                        >
                          <option value="saved">Saved</option>
                          <option value="applied">Applied</option>
                          <option value="interview">Interview</option>
                          <option value="rejected">Rejected</option>
                          <option value="followup">Follow-up</option>
                        </select>
                      </td>

                      <td style={td}>
                        <input
                          type="date"
                          value={job.follow_up_date ?? ""}
                          disabled={isSaving}
                          onChange={(e) =>
                            updateJob(job.id, { follow_up_date: e.target.value || null })
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={dateControl}
                        />
                      </td>

                      <td style={tdRight} onClick={(e) => e.stopPropagation()}>
                        <div style={actionsWrap}>
                          <Link
                            href={`/dashboard/${encodeURIComponent(job.id)}`}
                            style={btnActionDark}
                          >
                            View Packet
                          </Link>

                          {job.link ? (
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noreferrer"
                              style={btnActionLight}
                            >
                              Job Link
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

/* ---------------- Styles ---------------- */

const shell: React.CSSProperties = {
  width: "100%",
  maxWidth: 1120,
  margin: "0 auto",
  border: "1px solid #eee",
  borderRadius: 18,
  overflow: "hidden",
  background: "#fff",
  boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
};

const mapWrap: React.CSSProperties = {
  position: "relative",
  height: 340,
  background: "#f6f6f6",
  // NOTE: divider moved outside mapWrap to satisfy “map ends → divider → container”
};

const mapVeil: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "linear-gradient(to bottom, rgba(255,255,255,0.00), rgba(255,255,255,0.06), rgba(255,255,255,0.18))",
};

const mapTopLeftPill: React.CSSProperties = {
  position: "absolute",
  top: 18,
  left: 18,
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  height: 44,
  padding: "0 14px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.80)",
  border: "1px solid rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
};

const pillDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: "rgba(17,17,17,0.45)",
};

const pillText: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 850,
  color: "rgba(17,17,17,0.82)",
};

const mapTopRight: React.CSSProperties = {
  position: "absolute",
  top: 18,
  right: 18,
  display: "inline-flex",
  gap: 10,
  padding: 8,
  borderRadius: 18,
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(255,255,255,0.95)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 14px 28px rgba(0,0,0,0.16)",
};

/* ✅ Thin divider line between map and status container */
const mapToStatusDivider: React.CSSProperties = {
  height: 1,
  background: "#e9e9e9",
  width: "100%",
};

/* ✅ Row that holds the rounded status container (directly below divider) */
const statusRow: React.CSSProperties = {
  background: "#fff",
  padding: "14px 16px",
};

/* ✅ The single rounded container (does NOT overlap map) */
const statusContainer: React.CSSProperties = {
  width: "min(880px, 100%)",
  margin: "0 auto",
  height: 54,
  borderRadius: 18,
  background: "rgba(255,255,255,0.76)",
  border: "1px solid rgba(0,0,0,0.06)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  boxShadow: "0 14px 30px rgba(0,0,0,0.14)",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "0 14px",
};

/* ✅ Subtle vertical separators between pills */
const pillDivider: React.CSSProperties = {
  width: 1,
  height: 22,
  background: "rgba(0,0,0,0.10)",
  opacity: 0.35,
};

const trackerChip = (active: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  height: 34,
  padding: "0 12px",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.06)",
  background: active ? "rgba(17,17,17,0.07)" : "rgba(255,255,255,0.72)",
  fontWeight: 850,
  fontSize: 14,
  cursor: "pointer",
  whiteSpace: "nowrap",
});

const chipDot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
};

const tableHeaderRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "center",
  padding: "14px 16px",
  background: "#f7f7f8",
  borderBottom: "1px solid #eee",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
};

const selectWrap: React.CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
};

const selectIcon: React.CSSProperties = {
  position: "absolute",
  left: 12,
  opacity: 0.55,
  fontWeight: 900,
  transform: "translateY(-0.5px)",
  pointerEvents: "none",
};

const companySelect: React.CSSProperties = {
  height: 42,
  minWidth: 270,
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.06)",
  padding: "0 14px 0 34px",
  fontWeight: 900,
  background: "rgba(255,255,255,0.92)",
  outline: "none",
  boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
};

const miniSummary: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.72,
  fontWeight: 750,
};

const searchBox: React.CSSProperties = {
  height: 42,
  width: 380,
  maxWidth: "100%",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.06)",
  padding: "0 14px",
  outline: "none",
  background: "rgba(255,255,255,0.92)",
  fontWeight: 750,
};

const tableWrap: React.CSSProperties = {
  background: "#fff",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
};

const thBase: React.CSSProperties = {
  textAlign: "left",
  fontSize: 13,
  letterSpacing: 0.2,
  opacity: 0.75,
  fontWeight: 900,
  padding: "14px 16px",
  borderBottom: "1px solid #eee",
  background: "#fff",
};

const thLeft: React.CSSProperties = { ...thBase, paddingLeft: 18 };
const thRight: React.CSSProperties = { ...thBase, textAlign: "right", paddingRight: 18 };
const th: React.CSSProperties = thBase;

const tdBase: React.CSSProperties = {
  padding: "18px 16px",
  borderBottom: "1px solid #f0f0f0",
  verticalAlign: "middle",
  background: "#fff",
};

const tdLeft: React.CSSProperties = { ...tdBase, paddingLeft: 18 };
const tdRight: React.CSSProperties = { ...tdBase, textAlign: "right", paddingRight: 18 };
const td: React.CSSProperties = tdBase;

const tdEmpty: React.CSSProperties = {
  padding: 22,
  opacity: 0.65,
  borderBottom: "1px solid #f0f0f0",
};

const scorePill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 34,
  padding: "0 12px",
  borderRadius: 999,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 950,
};

const selectControl: React.CSSProperties = {
  height: 40,
  borderRadius: 12,
  border: "1px solid #eee",
  padding: "0 12px",
  fontWeight: 900,
  background: "#fff",
  outline: "none",
  cursor: "pointer",
};

const dateControl: React.CSSProperties = {
  height: 40,
  borderRadius: 12,
  border: "1px solid #eee",
  padding: "0 12px",
  fontWeight: 850,
  background: "#fff",
  outline: "none",
};

const btnLight: React.CSSProperties = {
  height: 44,
  padding: "0 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.95)",
  fontWeight: 900,
  cursor: "pointer",
};

const btnDark: React.CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 14,
  background: "#111",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 900,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
};

const actionsWrap: React.CSSProperties = {
  display: "flex",
  gap: 10,
  justifyContent: "flex-end",
  flexWrap: "wrap",
};

const btnActionDark: React.CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 999,
  background: "#111",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 900,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
};

const btnActionLight: React.CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 999,
  border: "1px solid #e9e9e9",
  background: "#fff",
  color: "#111",
  textDecoration: "none",
  fontWeight: 900,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
};

const errorBox: React.CSSProperties = {
  margin: 16,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #f3c2c2",
  background: "#fff7f7",
  color: "#a40000",
  fontWeight: 800,
};
