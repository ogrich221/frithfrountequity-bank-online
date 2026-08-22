import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — frithfrontequity" },
      { name: "description", content: "Explore checking, savings, credit cards, loans, and business accounts from frithfrontequity." },
      { property: "og:title", content: "Products — frithfrontequity" },
      { property: "og:description", content: "Explore checking, savings, credit cards, loans, and business accounts from frithfrontequity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const GROUPS = [
  { name: "Everyday", items: ["Rewards Checking", "No-Fee Checking", "Teen & Student", "High-Yield Savings"] },
  { name: "Borrow", items: ["Credit Cards", "Personal Loans", "Auto Loans", "Mortgages", "Home Equity"] },
  { name: "Business", items: ["Business Checking", "Merchant Services", "Payroll", "Business Lending", "Treasury"] },
];

function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-brand-blue-deep to-brand-blue py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Link to="/" className="text-sm font-semibold text-brand-orange hover:underline">← Back home</Link>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Products</h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">A complete suite of banking products to earn, spend, and borrow.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {GROUPS.map((g) => (
            <div key={g.name} className="rounded-3xl border border-border bg-card p-8">
              <h2 className="text-xl font-bold text-brand-orange-deep">{g.name}</h2>
              <ul className="mt-5 space-y-3">
                {g.items.map((i) => (
                  <li key={i} className="flex items-center gap-3 border-b border-border pb-3 last:border-0">
                    <span className="grid h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                    <span className="text-muted-foreground">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
