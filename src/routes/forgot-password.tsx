import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Your Password — frithfrountequity" },
      {
        name: "description",
        content: "Request a secure password reset link for your frithfrountequity online banking account.",
      },
      { property: "og:title", content: "Reset Your Password — frithfrountequity" },
      {
        property: "og:description",
        content: "Request a secure password reset link for your frithfrountequity online banking account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-blue-deep via-brand-blue to-brand-orange px-5 py-10">
      <div className="w-full max-w-md rounded-[2rem] bg-card p-8 shadow-2xl ring-1 ring-white/20">
        <Link to="/login" className="text-sm font-semibold text-brand-orange-deep hover:underline">
          ← Back to log in
        </Link>

        {sent ? (
          <>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Check your email</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If an account exists for <strong>{email.trim()}</strong>, we&apos;ve sent a password reset link.
              Open it on this device to choose a new password. The link expires in one hour.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Forgot your password?</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a secure reset link.
            </p>

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
                {loading ? "Sending link…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
