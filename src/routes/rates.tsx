import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/rates")({
  head: () => ({
    meta: [
      { title: "Rates — frithfrontequity" },
      { name: "description", content: "Current savings, money market, and CD rates from frithfrontequity. Updated daily." },
      { property: "og:title", content: "Rates — frithfrontequity" },
      { property: "og:description", content: "Current savings, money market, and CD rates from frithfrontequity. Updated daily." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const RATES = [
  { label: "High-Yield Savings", apy: "4.85%", min: "$0", term: "Variable" },
  { label: "Money Market", apy: "4.35%", min: "$2,500", term: "Variable" },
  { label: "Rewards Checking", apy: "2.50%", min: "$0", term: "Up to $25k" },
  { label: "6-Month CD", apy: "4.30%", min: "$500", term: "6 months" },
  { label: "12-Month CD", apy: "4.60%", min: "$500", term: "12 months" },
  { label: "24-Month CD", apy: "4.45%", min: "$500", term: "24 months" },
  { label: "Auto Loan", apr: "From 5.99%", min: "—", term: "Up to 72 mo" },
  { label: "Home Equity", apr: "From 7.25%", min: "—", term: "Fixed" },
];

function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-brand-orange-deep to-brand-blue py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Link to="/" className="text-sm font-semibold text-white/90 hover:underline">← Back home</Link>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Rates</h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">Transparent, competitive rates updated daily. No games, no fine print.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-border">
          <div className="grid grid-cols-4 gap-4 bg-brand-blue-deep px-6 py-4 text-xs font-bold uppercase tracking-widest text-white">
            <span>Product</span><span>Rate</span><span>Minimum</span><span>Term</span>
          </div>
          {RATES.map((r) => (
            <div key={r.label} className="grid grid-cols-4 gap-4 border-t border-border bg-card px-6 py-4 text-sm">
              <span className="font-semibold">{r.label}</span>
              <span className="font-bold text-brand-orange-deep">{r.apy ?? r.apr}</span>
              <span className="text-muted-foreground">{r.min}</span>
              <span className="text-muted-foreground">{r.term}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Rates are subject to change. APY = Annual Percentage Yield. APRs reflect typical ranges as of today.</p>
      </section>
    </div>
  );
}
