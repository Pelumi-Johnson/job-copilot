import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

function Pin({ label }: { label: string }) {
  return (
    <div className="group absolute">
      <div className="h-3 w-3 rounded-full bg-slate-900 shadow-sm" />
      <div className="absolute left-4 -top-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition">
        {label}
      </div>
    </div>
  );
}

export default function MapSpotlight() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pb-14 grid lg:grid-cols-2 gap-10 items-center">
        {/* Copy */}
        <div>
          <h3 className="text-3xl font-black text-slate-900">
            See opportunities by location. Keep the search grounded.
          </h3>

          <p className="mt-4 text-slate-700">
            Saved jobs become map-ready pins. Click a pin, open the packet, and move with clarity.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/dashboard" variant="primary">
              Explore Job Map →
            </Button>
            <Button href="/generate" variant="secondary">
              Generate Packet
            </Button>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Calm visibility — nothing noisy, nothing hidden.
          </div>
        </div>

        {/* Map panel preview */}
        <Card>
          <div className="p-6">
            {/* Top overlay bar */}
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-800">
                <span className="h-2 w-2 rounded-full bg-slate-900/70" />
                Job Map
              </span>

              <div className="flex items-center gap-2">
                <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                  Refresh
                </span>
                <span className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm font-semibold">
                  New Apply Packet →
                </span>
              </div>
            </div>

            {/* Map preview */}
            <div className="mt-4 relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {/* Soft “map texture” */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.06),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(15,23,42,0.05),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(15,23,42,0.04),transparent_55%)]" />
              </div>

              {/* “Road lines” (subtle) */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute left-6 top-10 h-[2px] w-40 bg-slate-300 rounded" />
                <div className="absolute left-20 top-24 h-[2px] w-56 bg-slate-300 rounded" />
                <div className="absolute left-10 top-36 h-[2px] w-44 bg-slate-300 rounded" />
                <div className="absolute left-32 top-16 h-32 w-[2px] bg-slate-300 rounded" />
                <div className="absolute left-52 top-6 h-44 w-[2px] bg-slate-300 rounded" />
                <div className="absolute right-20 top-20 h-32 w-[2px] bg-slate-300 rounded" />
              </div>

              {/* Pins */}
              <div className="relative h-52">
                <div className="absolute left-10 top-16">
                  <Pin label="Saved • 80/100" />
                </div>
                <div className="absolute left-40 top-28">
                  <Pin label="Job ready • 85/100" />
                </div>
                <div className="absolute right-16 top-20">
                  <Pin label="Mapped • 70/100" />
                </div>

                {/* Tiny control stack bottom-right */}
                <div className="absolute right-3 bottom-3 flex flex-col gap-2">
                  <span className="h-9 w-9 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-700">
                    +
                  </span>
                  <span className="h-9 w-9 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-700">
                    −
                  </span>
                </div>

                {/* Footer strip inside map (optional “alive” cue) */}
                <div className="absolute left-3 bottom-3 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                  Pins update when jobs are saved
                </div>
              </div>
            </div>

            {/* Small caption */}
            <div className="mt-3 text-xs text-slate-500">
              Preview only — your dashboard map will be fully interactive.
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
