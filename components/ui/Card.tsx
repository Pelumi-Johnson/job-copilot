import React from "react";

export default function Card({
  children,
  interactive = false,
}: {
  children: React.ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white",
        "border-slate-200",
        "shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.04)]",
        interactive
          ? "transition-transform hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(15,23,42,0.08)]"
          : "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
