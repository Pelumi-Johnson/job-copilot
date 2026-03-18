import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="text-sm text-slate-600">
          © {new Date().getFullYear()} <span className="font-semibold text-slate-800">Job Co-Pilot</span>
        </div>

        <div className="flex gap-4 text-sm">
          <Link className="text-slate-600 hover:text-slate-900 transition-colors" href="/privacy">
            Privacy
          </Link>
          <Link className="text-slate-600 hover:text-slate-900 transition-colors" href="/terms">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
