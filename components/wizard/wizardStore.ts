import type { ApplyWizardData } from "./wizardTypes";

const KEY = "jobcopilot_apply_wizard_v1";

export function loadApplyWizard(): ApplyWizardData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ApplyWizardData) : {};
  } catch {
    return {};
  }
}

export function saveApplyWizard(data: ApplyWizardData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function clearApplyWizard() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
