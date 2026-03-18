export default function SocialProofStrip() {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-500">
            TRUSTED WORKFLOW
          </div>
          <div className="mt-1 text-sm text-slate-700">
            Built for clarity. Designed for serious applicants.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {["Company", "Company", "Company", "Company"].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500"
            >
              {t} Logo
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
