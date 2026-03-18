// app/jobs/page.tsx
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

type Job = {
  id: string;
  company: string | null;
  title: string | null;
  location_text: string | null;
  link: string | null;
  score: number | null;
  created_at: string;
};

export default async function JobsPage() {
  const supabase = supabaseServer();

  // If you use Supabase Auth and RLS, this ensures only the user's jobs show
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, company, title, location_text, link, score, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <p className="mt-4 text-sm text-red-600">Error: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-sm text-gray-600">
            Showing {jobs?.length ?? 0} recent jobs
          </p>
        </div>

        <Link
          href="/dashboard"
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {(jobs ?? []).map((j: Job) => (
          <div
            key={j.id}
            className="rounded-2xl border bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <div className="font-semibold">
                {j.title ?? "Untitled role"}{" "}
                <span className="text-gray-500 font-normal">
                  — {j.company ?? "Unknown company"}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                📍 {j.location_text ?? "No location"}{" "}
                {typeof j.score === "number" ? `• ⭐ ${j.score}` : ""}
              </div>

              <div className="mt-2 flex gap-2">
                <Link
                  href={`/jobs/${j.id}`}
                  className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  View
                </Link>

                {j.link ? (
                  <a
                    href={j.link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    Open posting
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
