import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In — frithfrontequity" },
      { name: "description", content: "Secure sign in to your frithfrontequity online banking account." },
      { property: "og:title", content: "Log In — frithfrontequity" },
      { property: "og:description", content: "Secure sign in to your frithfrontequity online banking account." },
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
      setError(signInError.message);
      return;
    }

    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-blue-deep via-brand-blue to-brand-orange px-5 py-10">
      <div className="w-full max-w-md rounded-[2rem] bg-card p-8 shadow-2xl ring-1 ring-white/20">
        <Link to="/" className="text-sm font-semibold text-brand-orange-deep hover:underline">
          ← Back home
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to your frithfrontequity account.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" defaultChecked className="accent-brand-orange" />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-semibold text-brand-orange-deep hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-orange py-3.5 font-bold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-brand-blue-deep hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
