import { BankLogo } from "../components/bank-logo";
import heroWoman from "../assets/banking-woman-desk.jpg";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

/* ------------------------------- navigation ------------------------------ */

const NAV_LINKS = [
  { label: "Personal", href: "/personal" },
  { label: "Business", href: "/business" },
  { label: "Products", href: "/products" },
  { label: "Rates", href: "/rates" },
  { label: "Help & Support", href: "/help" },
];

function useSession() {
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return user;
}

function Nav() {
  const navigate = useNavigate();
  const user = useSession();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-blue-deep/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <BankLogo className="[&_span]:!text-white [&_p]:!text-white" />
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href as never}
              className="text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden max-w-[180px] truncate text-sm font-medium text-white/85 sm:inline">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="hidden rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                Sign Out
              </button>
              <Link
                to="/"
                className="inline-flex items-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:text-white sm:inline-flex"
              >
                Log In
              </Link>
              <Link
                to="/open-account"
                className="inline-flex items-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep"
              >
                Open an Account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* --------------------------------- hero ---------------------------------- */

function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden text-white">
      {/* Full-bleed background photo — she is the backdrop of the page */}
      <img
        src={heroWoman}
        alt="Customer managing her frithfrontequity accounts on a desktop computer"
        width={1024}
        height={1024}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      {/* readability overlay — a taller, darker fade on mobile since the copy
          spans the full width; a horizontal fade once the card sits beside it */}
      <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(8,18,43,0.94)_0%,rgba(8,18,43,0.82)_48%,rgba(255,112,22,0.38)_100%)] lg:bg-[linear-gradient(115deg,rgba(8,18,43,0.92)_0%,rgba(8,18,43,0.72)_45%,rgba(255,112,22,0.35)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background/95 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:34px_34px]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:min-h-[92vh] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-orange" />
            Banking built for everyday life
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Money that moves as{" "}
            <span className="bg-gradient-to-r from-brand-orange to-amber-300 bg-clip-text text-transparent">
              fast as you do
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
            Checking, savings, and business banking with no hidden fees, 24/7
            support, and rates that put your money to work.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#open"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-orange/40 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Open an Account
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Explore Products
            </a>
          </div>
          <div className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {[
              ["4.85%", "Savings APY"],
              ["0", "Monthly fees"],
              ["24/7", "Live support"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-extrabold">{v}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-white/70">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Silver card — centered and level below the copy on mobile, floating
            over the monitor on the right once there's room */}
        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:ml-auto">
          <div className="absolute -inset-6 rounded-[3rem] bg-white/10 blur-3xl lg:-inset-8" />
          <div className="relative rotate-0 rounded-2xl bg-[linear-gradient(115deg,#f7f8fa_0%,#c9ced6_28%,#eef1f5_50%,#aeb4bd_74%,#dfe3e8_100%)] p-6 text-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] ring-1 ring-white/60 sm:rotate-[-4deg]">
            <div className="flex items-start justify-between">
              <div className="h-9 w-12 rounded-md bg-[linear-gradient(135deg,#e6c98a,#b9963f)] ring-1 ring-amber-700/30" />
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-slate-500">
                Silver Debit
              </span>
            </div>
            <p className="mt-6 font-mono text-xl tracking-[0.18em] text-slate-700 sm:text-2xl">
              5487 •••• •••• 2219
            </p>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-[0.55rem] uppercase tracking-wider text-slate-500">
                  Cardholder
                </p>
                <p className="mt-0.5 text-sm font-semibold">A. Morgan</p>
              </div>
              <p className="text-base font-bold italic text-slate-600">VISA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- features ------------------------------- */

const FEATURES = [
  {
    title: "No-fee checking",
    body: "Everyday checking with zero monthly fees and 55,000+ fee-free ATMs nationwide.",
    icon: "M12 3l7 4v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V7l7-4z",
  },
  {
    title: "High-yield savings",
    body: "Watch your balance grow with a market-leading 4.85% APY on every dollar you save.",
    icon: "M12 3v18M17 7a5 5 0 0 0-5-3 5 5 0 0 0-5 3c0 5 10 3 10 8a5 5 0 0 1-5 3 5 5 0 0 1-5-3",
  },
  {
    title: "24/7 fraud protection",
    body: "Real-time alerts, instant card freeze, and $0 fraud liability keep your money safe.",
    icon: "M12 2l7 4v5c0 5-3.5 9-7 11-3.5-2-7-6-7-11V6l7-4zm-2 14l6-6-1.5-1.5L10 13l-2.5-2.5L6 12l4 4z",
  },
];

function Features() {
  return (
    <section id="products" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-orange-deep">
            Why frithfrontequity
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need. Nothing you don't.
          </h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-blue/10"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-orange shadow-lg shadow-brand-blue/25">
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.icon} />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- rates band ------------------------------ */

const RATES = [
  { label: "High-Yield Savings", apy: "4.85%", note: "Variable, monthly" },
  { label: "Money Market", apy: "4.35%", note: "From $2,500" },
  { label: "12-Month CD", apy: "4.60%", note: "Fixed rate" },
  { label: "Rewards Checking", apy: "2.50%", note: "On up to $25k" },
];

function Rates() {
  return (
    <section className="bg-brand-blue-deep py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
              Current rates
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Rates worth switching for
            </h2>
          </div>
          <Link to="/rates" className="text-sm font-semibold text-brand-orange underline-offset-4 hover:underline">
            View all rates →
          </Link>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RATES.map((r) => (
            <div
              key={r.label}
              className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur transition-colors hover:bg-white/10"
            >
              <p className="text-sm font-medium text-white/70">{r.label}</p>
              <p className="mt-3 text-4xl font-extrabold text-brand-orange">{r.apy}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-white/50">{r.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- CTA ----------------------------------- */

function Cta() {
  return (
    <section id="open" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-orange via-brand-orange-deep to-brand-blue px-8 py-16 text-center text-white sm:px-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-brand-blue-deep/40 blur-3xl" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Open an account in minutes — right from your phone
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/85">
            No paperwork, no branch visits. Just a few taps and your money starts
            working harder.
          </p>
          <a
            href="#open"
            className="relative mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-blue-deep shadow-xl transition-all hover:-translate-y-0.5"
          >
            Get Started — It's Free
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- footer --------------------------------- */

function Footer() {
  const cols = [
    {
      title: "Personal",
      links: ["Checking", "Savings", "Credit Cards", "Mortgages", "Loans"],
    },
    {
      title: "Business",
      links: ["Business Checking", "Merchant Services", "Payroll", "Lending"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Newsroom", "Investor Relations"],
    },
  ];
  return (
    <footer className="border-t border-white/10 bg-brand-blue-deep text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <BankLogo className="[&_span]:!text-white [&_p]:!text-white" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Member-focused banking that blends the personal touch of a local
              institution with the technology of the modern age.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
                {c.title}
              </p>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/75 transition-colors hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <p>© 2026 frithfrontequity. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Disclosures</a>
            <a href="#" className="hover:text-white">FDIC</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Rates />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
