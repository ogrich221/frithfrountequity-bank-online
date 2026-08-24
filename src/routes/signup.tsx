import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your Account — frithfrountequity" },
      {
        name: "description",
        content:
          "Sign up for frithfrountequity online banking: add your name, contact details, security questions and a strong password.",
      },
      { property: "og:title", content: "Create Your Account — frithfrountequity" },
      {
        property: "og:description",
        content:
          "Sign up for frithfrountequity online banking: add your name, contact details, security questions and a strong password.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the make of your first car?",
  "What was the name of your first school?",
  "What is your favourite book?",
];

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
  { label: "One special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand-orange";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

function Page() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    q1: SECURITY_QUESTIONS[0]!,
    a1: "",
    q2: SECURITY_QUESTIONS[1]!,
    a2: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const passwordOk = RULES.every((r) => r.test(form.password));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const email = form.email.trim();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.phone.trim().replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (form.q1 === form.q2) {
      setError("Please choose two different security questions.");
      return;
    }
    if (!form.a1.trim() || !form.a2.trim()) {
      setError("Please answer both security questions.");
      return;
    }
    if (!passwordOk) {
      setError("Your password does not meet all the requirements below.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postal_code: form.postalCode.trim(),
          security_question_1: form.q1,
          security_answer_1: form.a1.trim().toLowerCase(),
          security_question_2: form.q2,
          security_answer_2: form.a2.trim().toLowerCase(),
        },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/" });
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-blue-deep via-brand-blue to-brand-orange px-5 py-16">
        <div className="w-full max-w-md rounded-[2rem] bg-card p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-extrabold tracking-tight">Check your email</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We sent a confirmation link to <strong>{form.email.trim()}</strong>. Click it to activate your
            frithfrountequity account, then log in.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-brand-orange px-6 py-3 font-bold text-white shadow-lg shadow-brand-orange/30 transition-colors hover:bg-brand-orange-deep"
          >
            Go to Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-deep via-brand-blue to-brand-orange px-5 py-14">
      <div className="mx-auto w-full max-w-3xl">
        <Link to="/" className="text-sm font-semibold text-white/90 hover:underline">
          ← Back home
        </Link>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Create your account
        </h1>
        <p className="mt-3 max-w-xl text-white/80">
          It takes about two minutes. Your details are encrypted and your deposits are FDIC insured up to
          $250,000.
        </p>

        <form
          className="mt-10 space-y-10 rounded-[2rem] bg-card p-8 shadow-2xl sm:p-10"
          onSubmit={handleSubmit}
          noValidate
        >
          <section>
            <h2 className="text-lg font-bold">1. Personal details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input
                  className={inputClass}
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => set("firstName")(e.target.value)}
                  maxLength={60}
                  placeholder="Jane"
                />
              </Field>
              <Field label="Last name">
                <input
                  className={inputClass}
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => set("lastName")(e.target.value)}
                  maxLength={60}
                  placeholder="Doe"
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold">2. Contact details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Email address">
                <input
                  className={inputClass}
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  maxLength={255}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone number">
                <input
                  className={inputClass}
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  maxLength={25}
                  placeholder="+1 555 000 1234"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Street address">
                  <input
                    className={inputClass}
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => set("address")(e.target.value)}
                    maxLength={160}
                    placeholder="120 Market Street"
                  />
                </Field>
              </div>
              <Field label="City">
                <input
                  className={inputClass}
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => set("city")(e.target.value)}
                  maxLength={80}
                  placeholder="San Francisco"
                />
              </Field>
              <Field label="ZIP / Postal code">
                <input
                  className={inputClass}
                  autoComplete="postal-code"
                  value={form.postalCode}
                  onChange={(e) => set("postalCode")(e.target.value)}
                  maxLength={16}
                  placeholder="94103"
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold">3. Security questions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We use these to verify you if you ever lose access to your account.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Question 1">
                <select
                  className={inputClass}
                  value={form.q1}
                  onChange={(e) => set("q1")(e.target.value)}
                >
                  {SECURITY_QUESTIONS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Answer 1">
                <input
                  className={inputClass}
                  value={form.a1}
                  onChange={(e) => set("a1")(e.target.value)}
                  maxLength={100}
                  autoComplete="off"
                />
              </Field>
              <Field label="Question 2">
                <select
                  className={inputClass}
                  value={form.q2}
                  onChange={(e) => set("q2")(e.target.value)}
                >
                  {SECURITY_QUESTIONS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Answer 2">
                <input
                  className={inputClass}
                  value={form.a2}
                  onChange={(e) => set("a2")(e.target.value)}
                  maxLength={100}
                  autoComplete="off"
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold">4. Password</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Password">
                <input
                  className={inputClass}
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set("password")(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>
              <Field label="Confirm password">
                <input
                  className={inputClass}
                  type="password"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) => set("confirm")(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>
            </div>
            <ul className="mt-5 grid gap-2 rounded-2xl bg-muted/50 p-4 sm:grid-cols-2">
              {RULES.map((r) => {
                const ok = r.test(form.password);
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
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-orange py-4 font-bold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-brand-blue-deep hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
