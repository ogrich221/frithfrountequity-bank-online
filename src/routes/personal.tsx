import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/personal")({
  head: () => ({
    meta: [
      { title: "Personal Banking — frithfrontequity" },
      { name: "description", content: "No-fee checking, high-yield savings, credit cards, and personal loans from frithfrontequity." },
      { property: "og:title", content: "Personal Banking — frithfrontequity" },
      { property: "og:description", content: "No-fee checking, high-yield savings, credit cards, and personal loans from frithfrontequity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const ITEMS = [
  { title: "Checking", body: "Everyday checking with zero monthly fees and 55,000+ fee-free ATMs." },
  { title: "High-Yield Savings", body: "Grow every dollar with a market-leading 4.85% APY." },
  { title: "Credit Cards", body: "Rewards cards with no annual fee and 2% cash back on everything." },
  { title: "Personal Loans", body: "Fixed-rate loans for the big moments, funded as fast as same day." },
  { title: "Mortgages", body: "Competitive fixed and adjustable rates with a fully digital application." },
  { title: "Auto Loans", body: "Pre-approval in minutes and rates that keep your payment low." },
];

function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-brand-blue-deep to-brand-blue py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Link to="/" className="text-sm font-semibold text-brand-orange hover:underline">← Back home</Link>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Personal Banking</h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">Accounts and tools designed to make managing your money simple, secure, and rewarding.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {ITEMS.map((i) => (
            <div key={i.title} className="rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-blue/10">
              <h2 className="text-xl font-bold">{i.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{i.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
