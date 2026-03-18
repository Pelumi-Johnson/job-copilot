import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const tabs = ["Applied", "Interview", "Rejected", "Follow-up"] as const;

function StatusDot({ status }: { status: (typeof tabs)[number] }) {
  // restrained, enterprise-friendly tones (no neon)
  const cls =
    status === "Applied"
      ? "bg-slate-500"
      : status === "Interview"
      ? "bg-blue-600"
      : status === "Follow-up"
      ? "bg-emerald-600"
      : "bg-rose-600";

  return <span className={`inline-block h-2 w-2 rounded-full ${cls}`} />;
}

export default function TrackerSpotlight() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left: Tracker preview */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-600">Application Tracker</div>
                <div className="mt-1 text-xs text-slate-500">
                  A calm place to record progress and keep follow-ups honest.
                </div>
              </div>

              <span className="text-xs font-semibold rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
                Today
              </span>
            </div>

            {/* Tabs (segmented control vibe) */}
            <div className="mt-4 inline-flex overflow-hidden rounded-xl border border-slate-200 bg-white">
              {tabs.map((t, idx) => (
                <span
                  key={t}
                  className={[
                    "px-3 py-2 text-sm text-slate-700 flex items-center gap-2",
                    idx !== 0 ? "border-l border-slate-200" : "",
                    t === "Applied" ? "bg-slate-50 font-semibold" : "bg-white",
                  ].join(" ")}
                >
                  <StatusDot status={t} />
                  {t}
                </span>
              ))}
            </div>

            {/* Table */}
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-5 bg-slate-50 text-xs font-semibold text-slate-600 px-4 py-3">
                <div>Company</div>
                <div>Role</div>
                <div>Status</div>
                <div>Score</div>
                <div>Follow-up</div>
              </div>

              {[
                ["EchoStar", "Sales Rep", "Applied", "65/100", "Apr 27"],
                ["Stripe", "PM", "Interview", "70/100", "Apr 29"],
                ["Google", "AE", "Follow-up", "80/100", "May 1"],
              ].map((r, idx) => {
                const status = r[2] as (typeof tabs)[number];
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-5 px-4 py-3 text-sm border-t border-slate-100 bg-white hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="text-slate-900 font-medium">{r[0]}</div>
                    <div className="text-slate-700">{r[1]}</div>
                    <div className="text-slate-700 inline-flex items-center gap-2">
                      <StatusDot status={status} />
                      {status}
                    </div>
                    <div className="text-slate-700">{r[3]}</div>
                    <div className="text-slate-700">{r[4]}</div>
                  </div>
                );
              })}
            </div>

            {/* Tiny actions row (feels real) */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Tip: keep follow-up dates realistic and consistent.</span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Updated just now
              </span>
            </div>
          </div>
        </Card>

        {/* Right: Copy */}
        <div>
          <h3 className="text-3xl font-black text-slate-900">
            The tracker that remembers what you promised yourself.
          </h3>

          <p className="mt-4 text-slate-700">
            Follow-up dates, statuses, packets, and job links — organized so you never lose momentum.
          </p>

          <ul className="mt-5 space-y-2 text-slate-700">
            <li className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate-900/70" />
              Status tabs: Applied / Interview / Rejected / Follow-up
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate-900/70" />
              Follow-up dates you can actually act on
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate-900/70" />
              One click opens packet + job link
            </li>
          </ul>

          <div className="mt-7 flex items-center gap-3">
            <Button href="/tracker" variant="primary">
              Open Tracker →
            </Button>
            <Button href="/dashboard" variant="secondary">
              View Dashboard
            </Button>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Clarity wins. Small faithful steps, consistently taken.
          </div>
        </div>
      </div>
    </section>
  );
}
