import Link from "next/link";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/generate", label: "Generate" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tracker", label: "Tracker" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-slate-900">
          <span className="text-lg">🚀</span>
          <span>Job Co-Pilot</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button href="/generate" variant="primary">
            Try Generator →
          </Button>
        </div>
      </div>
    </header>
  );
}
