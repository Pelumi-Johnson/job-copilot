export type ApplyWizard = {
  employment_status?: string; // step-0
  desired_titles?: string[]; // step-1
  experience_level?: "Entry" | "Junior" | "Mid" | "Senior";
  work_type?: "Remote" | "Hybrid" | "On-site" | "Open";

  location_pref?: string; // step-2
  salary_range?: string;
  industry_pref?: string;
  sponsorship_needed?: "Yes" | "No" | "Not sure";
  clearance?: "None" | "Eligible" | "Active";

  resume_text?: string; // step-3
  top_skills?: string[];
  certifications?: string[];
  projects?: string[];
  links?: { github?: string; portfolio?: string; linkedin?: string };
};

const KEY = "jobcopilot_apply_wizard";

export function readApplyWizard(): ApplyWizard {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function writeApplyWizard(next: ApplyWizard) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function patchApplyWizard(patch: Partial<ApplyWizard>) {
  const cur = readApplyWizard();
  const next = { ...cur, ...patch };
  writeApplyWizard(next);
  return next;
}
