import Card from "@/components/ui/Card";

export default function FeatureGrid() {
  const items = [
    ["Fit Score", "See match strength at a glance."],
    ["Tailored Bullets", "ATS-friendly, role-aligned bullets."],
    ["Cover Letter Draft", "Clean, editable drafts in seconds."],
    ["Screening Answers", "Fast, consistent responses."],
    ["Saved Job Library", "Everything searchable and reusable."],
    ["Tracker + Follow-ups", "Never lose the thread again."],
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-500">
            FEATURES
          </div>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Built for clarity</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Everything you need — nothing you don’t. Clean outputs, clean organization.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {items.map(([t, d]) => (
            <Card key={t} interactive>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="font-bold text-slate-900">{t}</div>
                  <span className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 text-sm">
                    ✓
                  </span>
                </div>

                <div className="mt-2 text-sm text-slate-600">{d}</div>

                <div className="mt-4 text-xs text-slate-500">
                  Consistent. Professional. Trackable.
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
