import Link from "next/link";
import React from "react";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  disabled?: boolean;
};

export default function Button({
  href,
  variant = "primary",
  children,
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all border focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 disabled:opacity-50 disabled:pointer-events-none";

  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 active:bg-slate-900"
      : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50 active:bg-white";

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${base} ${styles}`} disabled={disabled}>
      {children}
    </button>
  );
}
