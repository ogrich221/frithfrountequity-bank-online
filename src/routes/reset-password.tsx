import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Choose a New Password — frithfrountequity" },
      {
        name: "description",
        content: "Set a new password for your frithfrountequity online banking account.",
      },
      { property: "og:title", content: "Choose a New Password — frithfrountequity" },
      {
        property: "og:description",
        content: "Set a new password for your frithfrountequity online banking account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
  { label: "One special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

function Page() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [linkValid, setLinkValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const hashError = hash.get("error_description") ?? url.searchParams.get("error_description");
      const code = url.searchParams.get("code");

      if (hashError) {
        if (!active) return;
        setError(hashError);
        setReady(true);
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError && active) setError(exchangeError.message);
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setLinkValid(Boolean(data.session));
      setReady(true);
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && active) {
        setLinkValid(true);
        setReady(true);
      }
    });

    void bootstrap();
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!RULES.every((r) => r.test(password))) {
      setError("Your password does not meet all the requirements below.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    await supabase.auth.signOut();
    setTimeout(() => navigate({ to: "/login" }), 2500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-blue-deep via-brand-blue to-brand-orange px-5 py-10">
      <div className="w-full max-w-md rounded-[2rem] bg-card p-8 shadow-2xl ring-1 ring-white/20">
        <Link to="/login" className="text-sm font-semibold text-brand-orange-deep hover:underline">
          ← Back to log in
        </Link>

        {!ready ? (
          <p className="mt-6 text-sm text-muted-foreground">Verifying your reset link…</p>
        ) : done ? (
          <>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Password updated</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              You can now log in with your new password. Taking you to the login page…
            </p>
          </>
        ) : !linkValid ? (
          <>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Link expired</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {error ?? "This password reset link is invalid or has already been used."}
            </p>
            <Link
              to="/forgot-password"
              className="mt-6 inline-block rounded-xl bg-brand-orange px-6 py-3 font-bold text-white shadow-lg shadow-brand-orange/30 transition-colors hover:bg-brand-orange-deep"
            >
              Request a new link
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Choose a new password</h1>
            <p className="mt-1 text-sm text-muted-foreground">Make it strong — you&apos;ll use it to bank.</p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="text-sm font-semibold" htmlFor="password">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="confirm">
                  Confirm new password
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <ul className="grid gap-2 rounded-2xl bg-muted/50 p-4">
                {RULES.map((r) => {
                  const ok = r.test(password);
                  return (
                    <li
                      key={r.label}
                      className={`flex items-center gap-2 text-sm ${
                        ok ? "font-semibold text-brand-blue-deep" : "text-muted-foreground"
                      }`}
                    >
                      <span aria-hidden="true">{ok ? "✓" : "○"}</span>
                      {r.label}
                    </li>
                  );
                })}
              </ul>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-orange py-3.5 font-bold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
