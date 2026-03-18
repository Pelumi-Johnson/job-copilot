import Card from "@/components/ui/Card";

export default function HowItWorks() {
  const steps = [
    { title: "1) Paste a job", desc: "Drop the job description. Add company, role, and link." },
    { title: "2) Get an apply packet", desc: "Fit score + bullets + cover letter + screening answers." },
    { title: "3) Track outcomes", desc: "Applied → Interview → Follow-up → Rejected, all in one place." },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-500">
              HOW IT WORKS
            </div>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Simple steps. Honest output. Everything remembered.
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Keep the workflow clean: job → packet → tracking. No noise, no shortcuts.
            </p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {steps.map((s, idx) => (
            <Card key={s.title} interactive>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-500">Step {idx + 1}</div>
                  <span className="text-xs font-semibold rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700">
                    ~30 sec
                  </span>
                </div>

                <div className="mt-3 font-bold text-slate-900">{s.title}</div>
                <div className="mt-2 text-sm text-slate-600">{s.desc}</div>

                <div className="mt-4 text-xs text-slate-500">
                  Built to keep you consistent.
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
