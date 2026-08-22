import { createFileRoute, Link } from "@tanstack/react-router";

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
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-blue-deep via-brand-blue to-brand-orange px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-card p-8 shadow-2xl ring-1 ring-white/20">
        <Link to="/" className="text-sm font-semibold text-brand-orange-deep hover:underline">← Back home</Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to your frithfrontequity account.</p>
        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-sm font-semibold" htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="accent-brand-orange" /> Remember me</label>
            <a href="#" className="font-semibold text-brand-orange-deep hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full rounded-xl bg-brand-orange py-3.5 font-bold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep">
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/open-account" className="font-semibold text-brand-blue-deep hover:underline">Open an account</Link>
        </p>
      </div>
    </div>
  );
}
