import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/open-account")({
  head: () => ({
    meta: [
      { title: "Open an Account — frithfrontequity" },
      { name: "description", content: "Open a frithfrontequity checking or savings account in minutes. No fees, no minimums." },
      { property: "og:title", content: "Open an Account — frithfrontequity" },
      { property: "og:description", content: "Open a frithfrontequity checking or savings account in minutes. No fees, no minimums." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

const PLANS = [
  { name: "Checking", desc: "No-fee everyday checking with a debit card and mobile deposit.", tag: "Most popular" },
  { name: "High-Yield Savings", desc: "Earn a market-leading 4.85% APY with no minimums.", tag: "Best rate" },
  { name: "Business", desc: "Digital business checking with payroll and merchant tools.", tag: "For business" },
];

function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-deep via-brand-blue to-brand-orange px-5 py-16">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="text-sm font-semibold text-white/90 hover:underline">← Back home</Link>
        <h1 className="mt-4 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Open an Account</h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-white/80">Choose an account and get started in minutes. It's free and takes just a few taps.</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className="relative flex flex-col rounded-3xl bg-card p-7 shadow-2xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                {p.tag}
              </span>
              <h2 className="mt-2 text-xl font-bold">{p.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <button className="mt-6 w-full rounded-xl bg-brand-blue-deep py-3 font-bold text-white transition-colors hover:bg-brand-blue">
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>

        <form className="mt-12 rounded-3xl bg-card p-8 shadow-2xl" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-xl font-bold">Your details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input placeholder="First name" className="rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-orange" />
            <input placeholder="Last name" className="rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-orange" />
            <input placeholder="Email" type="email" className="rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-orange" />
            <input placeholder="Phone" type="tel" className="rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <button type="submit" className="mt-6 w-full rounded-xl bg-brand-orange py-3.5 font-bold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep">
            Continue Application
          </button>
          <p className="mt-4 text-center text-xs text-muted-foreground">Opening an account is subject to identity verification and approval. FDIC insured up to $250,000.</p>
        </form>
      </div>
    </div>
  );
}
