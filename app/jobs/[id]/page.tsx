// app/jobs/[id]/page.tsx
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = supabaseServer();

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !job) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold">Job</h1>
        <p className="mt-4 text-sm text-red-600">
          {error?.message ?? "Job not found"}
        </p>
        <Link className="mt-6 inline-block underline" href="/jobs">
          Back to Jobs
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link className="text-sm underline" href="/jobs">
        ← Back to Jobs
      </Link>

      <h1 className="mt-4 text-2xl font-bold">
        {job.title ?? "Untitled role"}
      </h1>
      <p className="mt-1 text-gray-600">{job.company ?? "Unknown company"}</p>

      <div className="mt-6 rounded-2xl border bg-white p-5">
        <p className="text-sm text-gray-700">📍 {job.location_text ?? "—"}</p>
        {job.link ? (
          <p className="mt-2">
            <a className="underline" href={job.link} target="_blank" rel="noreferrer">
              Open posting
            </a>
          </p>
        ) : null}
      </div>

      {/* Optional: add actions here later (Prepare Resume, Prepare Apply Kit, etc.) */}
    </main>
  );
}
