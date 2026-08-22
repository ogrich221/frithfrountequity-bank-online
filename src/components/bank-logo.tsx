import { Link } from "@tanstack/react-router";

export function BankLogo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-3 ${className}`}>
      {/* Emblem */}
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-lg shadow-brand-blue/30 ring-1 ring-white/40">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-orange via-brand-orange-deep to-brand-blue transition-transform duration-300 group-hover:scale-105" />
        <svg
          viewBox="0 0 40 40"
          className="relative h-6 w-6 text-white"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 8h16v5H17v5h9v5h-9v9h-5V8Z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M24 8h4v25h-4z"
            fill="currentColor"
            opacity="0.75"
          />
        </svg>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-orange ring-2 ring-white" />
      </span>

      {/* Wordmark */}
      <span className="flex flex-col leading-none">
        <span className="text-[1.35rem] font-bold tracking-tight text-foreground sm:text-2xl">
          <span className="text-brand-blue-deep dark:text-brand-orange">frithfront</span>
          <span className="text-brand-orange-deep dark:text-brand-blue">equity</span>
        </span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Member Banking
        </span>
      </span>
    </Link>
  );
}
