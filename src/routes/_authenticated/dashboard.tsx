import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BankLogo } from "@/components/bank-logo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — frithfrountequity" },
      {
        name: "description",
        content: "View your checking, savings, credit card and investment balances at a glance.",
      },
      { property: "og:title", content: "Your Dashboard — frithfrountequity" },
      {
        property: "og:description",
        content: "View your checking, savings, credit card and investment balances at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type Account = {
  id: string;
  name: string;
  kind: "Checking" | "Savings" | "Credit Card" | "Investment";
  last4: string;
  available: number;
  secondaryLabel: string;
  secondary: number;
  accent: string;
};

const ACCOUNTS: Account[] = [
  {
    id: "chk",
    name: "Everyday Checking",
    kind: "Checking",
    last4: "4821",
    available: 8450.72,
    secondaryLabel: "Current balance",
    secondary: 8612.05,
    accent: "from-brand-blue to-brand-blue-deep",
  },
  {
    id: "sav",
    name: "High-Yield Savings",
    kind: "Savings",
    last4: "9037",
    available: 24310.18,
    secondaryLabel: "Interest earned YTD",
    secondary: 612.44,
    accent: "from-brand-orange to-brand-orange-deep",
  },
  {
    id: "cc",
    name: "Silver Rewards Card",
    kind: "Credit Card",
    last4: "1156",
    available: 4180.0,
    secondaryLabel: "Current statement",
    secondary: -820.0,
    accent: "from-slate-400 to-slate-600",
  },
  {
    id: "inv",
    name: "Growth Portfolio",
    kind: "Investment",
    last4: "7742",
    available: 63920.55,
    secondaryLabel: "Today's change",
    secondary: 412.9,
    accent: "from-emerald-500 to-brand-blue-deep",
  },
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Hidden() {
  return <span className="tracking-[0.2em]">••••••</span>;
}

function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("ffe:hideBalances");
      if (stored === "1") setHidden(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active || !data.user) return;
      setEmail(data.user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", data.user.id)
        .maybeSingle();
      if (!active) return;
      const first =
        profile?.first_name?.trim() ||
        (data.user.user_metadata as { first_name?: string } | null)?.first_name ||
        (data.user.email ?? "").split("@")[0];
      setName(first ?? "");
    })();
    return () => {
      active = false;
    };
  }, []);

  function toggleHidden() {
    setHidden((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem("ffe:hideBalances", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  const deposits = ACCOUNTS.filter((a) => a.kind !== "Credit Card");
  const totalBalance = deposits.reduce((sum, a) => sum + a.available, 0);
  const netAvailable = deposits
    .filter((a) => a.kind !== "Investment")
    .reduce((sum, a) => sum + a.available, 0);

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-white/10 bg-brand-blue-deep">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/">
            <BankLogo className="[&_span]:!text-white [&_p]:!text-white" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[180px] truncate text-sm font-medium text-white/80 sm:inline">
              {email}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {greeting()}
              {name ? `, ${name}` : ""}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's how your money is doing today.
            </p>
          </div>
          <button
            onClick={toggleHidden}
            aria-pressed={hidden}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:bg-accent"
          >
            {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            {hidden ? "Show balances" : "Hide balances"}
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-brand-blue-deep to-brand-blue p-7 text-white shadow-xl">
            <p className="text-sm font-medium text-white/75">Total balance</p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight">
              {hidden ? <Hidden /> : money(totalBalance)}
            </p>
            <p className="mt-2 text-xs text-white/70">Across savings, checking and investments</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-brand-orange to-brand-orange-deep p-7 text-white shadow-xl">
            <p className="text-sm font-medium text-white/80">Net available balance</p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight">
              {hidden ? <Hidden /> : money(netAvailable)}
            </p>
            <p className="mt-2 text-xs text-white/80">Ready to spend or transfer right now</p>
          </div>
        </section>

        <h2 className="mt-12 text-xl font-bold tracking-tight">Your accounts</h2>
        <section className="mt-4 grid gap-4 md:grid-cols-2">
          {ACCOUNTS.map((a) => (
            <article
              key={a.id}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {a.kind} •••• {a.last4}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{a.name}</h3>
                </div>
                <span
                  className={`inline-block h-10 w-16 rounded-lg bg-gradient-to-br ${a.accent} shadow-inner`}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                {a.kind === "Credit Card" ? "Available credit" : "Available balance"}
              </p>
              <p className="text-3xl font-extrabold tracking-tight">
                {hidden ? <Hidden /> : money(a.available)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {a.secondaryLabel}:{" "}
                <span className="font-semibold text-foreground">
                  {hidden ? <Hidden /> : money(a.secondary)}
                </span>
              </p>
            </article>
          ))}
        </section>

        <p className="mt-10 text-xs text-muted-foreground">
          Balances shown are illustrative demo figures for this account preview.
        </p>
      </main>
    </div>
  );
}
