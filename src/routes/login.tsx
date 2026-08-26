import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BankLogo } from "@/components/bank-logo";
import { Lock, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In — frithfrountequity Bank" },
      {
        name: "description",
        content: "Secure sign in to your frithfrountequity online banking dashboard.",
      },
      { property: "og:title", content: "Log In — frithfrountequity Bank" },
      {
        property: "og:description",
        content: "Secure sign in to your frithfrountequity online banking dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        navigate({ to: "/dashboard", replace: true });
      }
    });
  }, [navigate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    setLoading(false);

    if (signInError) {
      const msg = signInError.message.toLowerCase();
      if (msg.includes("invalid login credentials")) {
        setError(
          "That email and password don't match an account. Check your password, or try demo sign in below."
        );
      } else if (msg.includes("email not confirmed")) {
        setError("Please confirm your email first — check your inbox for the activation link.");
      } else {
        setError(signInError.message);
      }
      return;
    }

    // Set demo flag to false and go to dashboard
    try {
      window.localStorage.removeItem("ffe:demo_mode");
    } catch {
      /* ignore */
    }
    navigate({ to: "/dashboard" });
  }

  function handleDemoSignIn() {
    try {
      window.localStorage.setItem("ffe:demo_mode", "true");
    } catch {
      /* ignore */
    }
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-blue-deep via-brand-blue to-brand-orange px-5 py-12">
      <div className="w-full max-w-md rounded-[2.5rem] bg-card p-8 sm:p-10 shadow-2xl ring-1 ring-white/20">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xs font-bold uppercase tracking-wider text-brand-orange-deep hover:underline"
          >
            ← Back Home
          </Link>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Lock className="size-3" /> Secure SSL
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex justify-center">
            <BankLogo />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Sign In</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Access your accounts, balances, transfers, and investments.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah.jenkins@example.com"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 font-medium text-muted-foreground">
              <input type="checkbox" defaultChecked className="accent-brand-orange rounded" />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="font-bold text-brand-orange-deep hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-orange py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? "Signing in…" : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-card px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Instant Demo Preview
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoSignIn}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-blue/30 bg-brand-blue/5 py-3 text-xs font-bold text-brand-blue-deep transition hover:bg-brand-blue/10 dark:text-brand-orange"
        >
          <Sparkles className="size-4" />
          <span>Launch Customer Dashboard (Sarah)</span>
          <ArrowRight className="size-3.5" />
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don't have an account yet?{" "}
          <Link to="/open-account" className="font-bold text-brand-blue-deep hover:underline dark:text-brand-orange">
            Open an Account
          </Link>
        </p>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <Link
            to="/admin"
            className="text-[11px] font-semibold text-muted-foreground hover:text-brand-orange hover:underline transition"
          >
            Bank Staff & Auditor Console →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page;
