import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — frithfrontequity" },
      { name: "description", content: "24/7 support, FAQs, and contact options from frithfrontequity." },
      { property: "og:title", content: "Help & Support — frithfrontequity" },
      { property: "og:description", content: "24/7 support, FAQs, and contact options from frithfrontequity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const FAQS = [
  { q: "How do I open an account?", a: "Download the app or apply online in minutes. You'll need a valid ID and basic personal details." },
  { q: "Are there any monthly fees?", a: "Our checking accounts have no monthly fees and no minimum balance requirements." },
  { q: "How do I freeze my card?", a: "Open the app, tap your card, and select Freeze. It takes one second and you can unfreeze anytime." },
  { q: "Is my money protected?", a: "Deposits are FDIC insured up to $250,000 per depositor, and every account has $0 fraud liability." },
];

function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-brand-blue-deep to-brand-blue py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Link to="/" className="text-sm font-semibold text-brand-orange hover:underline">← Back home</Link>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Help & Support</h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">Real humans, available 24/7 by phone, chat, or email.</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card p-6">
              <summary className="cursor-pointer list-none text-lg font-semibold">{f.q}</summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 rounded-3xl bg-brand-blue-deep p-8 text-center text-white">
          <h2 className="text-xl font-bold">Still need help?</h2>
          <p className="mt-2 text-white/70">Call us 24/7 at <span className="font-semibold text-brand-orange">1-800-FRITH</span> or start a chat.</p>
        </div>
      </section>
    </div>
  );
}
