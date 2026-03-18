import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="bg-white border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
          <div className="text-xs font-semibold tracking-wide text-slate-500">
            READY WHEN YOU ARE
          </div>

          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Ready to apply with clarity?
          </h2>

          <p className="mt-3 text-slate-700 max-w-2xl mx-auto">
            Build packets, track outcomes, and move forward without compromising integrity.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/generate" variant="primary">
              Try Generator →
            </Button>
            <Button href="/dashboard" variant="secondary">
              View Dashboard
            </Button>
          </div>

          <div className="mt-5 text-xs text-slate-500">
            No auto-apply. No spam. Just organized effort.
          </div>
        </div>
      </div>
    </section>
  );
}
