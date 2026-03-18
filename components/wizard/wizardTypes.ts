export type ApplyWizardData = {
  // Step 0
  employmentStatus?: "unemployed_need" | "unemployed_ok" | "employed_bad" | "employed_open";

  // Step 1
  desiredTitles?: string[]; // e.g., ["Cybersecurity Analyst", "SOC Analyst"]

  // Step 2
  workAuthUS?: "yes" | "no" | "unsure";
  sponsorshipNeeded?: "no" | "yes_now" | "yes_future" | "unsure";

  // Step 3
  workPreference?: "remote" | "hybrid" | "onsite" | "open";
  location?: string; // city/state
  salaryRange?: string; // optional text

  // Step 4
  resumeText?: string; // paste for now

  // Step 5
  jobDescription?: string;

  // Optional job metadata (if you pick from Dashboard later)
  jobId?: string;
  jobCompany?: string;
  jobTitle?: string;
  jobLink?: string;
};
