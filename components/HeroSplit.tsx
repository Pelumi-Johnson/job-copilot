import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

function MiniCard({
  title,
  subtitle,
  right,
  accent,
}: {
  title: string;
  subtitle: string;
  right?: string;
  accent?: boolean;
}) {
  return (
    <Card>
      <div
        className={`p-4 flex items-start justify-between gap-3 transition ${
          accent ? "ring-2 ring-blue-500/30" : ""
        }`}
      >
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600">{subtitle}</div>
        </div>
        {right ? (
          <div
            className={`text-xs font-semibold rounded-full px-2 py-1 ${
              accent
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "border border-gray-200 text-gray-700"
            }`}
          >
            {right}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default function HeroSplit() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold">
            ETHICAL • NO AUTO-APPLY
            <span className="text-gray-500 font-medium">
              Your applications, your voice.
            </span>
          </div>

          <h1 className="mt-7 text-5xl leading-[1.05] font-black tracking-tight text-gray-900">
            Apply smarter —
            <br />
            stay truthful, stay organized.
          </h1>

          <p className="mt-5 text-lg text-gray-700 max-w-xl">
            Score job fit, generate an apply packet, and track every application
            in one place — without spam, deception, or auto-submitting forms.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/generate" variant="primary">
              Try the Generator →
            </Button>
            <Button href="/dashboard" variant="secondary">
              View Dashboard
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-700">
            <span>✅ ATS-friendly output</span>
            <span>✅ Saves jobs + packets</span>
            <span>✅ Built for clarity</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          {/* soft backdrop */}
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-gray-50 to-white" />

          <div className="relative grid gap-4">
            <MiniCard
              title="Morgan Stanley"
              subtitle="Security Intern"
              right="85/100"
              accent
            />

            <MiniCard
              title="Apply Packet"
              subtitle="Bullets • Cover Letter • Screening Answers"
              right="Ready"
            />

            <MiniCard
              title="Tracker"
              subtitle="Follow-up: Apr 29 • Status: Applied"
              right="Open"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-800">
                Mini Map Preview
              </div>
              <div className="mt-3 h-28 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                (map tile placeholder)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
