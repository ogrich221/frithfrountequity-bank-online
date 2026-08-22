import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Business Banking — frithfrontequity" },
      { name: "description", content: "Business checking, merchant services, payroll, and lending built for growing companies." },
      { property: "og:title", content: "Business Banking — frithfrontequity" },
      { property: "og:description", content: "Business checking, merchant services, payroll, and lending built for growing companies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const ITEMS = [
  { title: "Business Checking", body: "Free digital checking with unlimited transactions and no minimums." },
  { title: "Merchant Services", body: "Accept cards online and in person with next-day settlement." },
  { title: "Payroll", body: "Automated payroll, taxes, and contractor payments in a few clicks." },
  { title: "Business Lending", body: "Lines of credit and term loans to fund growth when you need it." },
  { title: "Treasury", body: "Cash management, sweeps, and multi-user approvals with full control." },
  { title: "Invoicing", body: "Send branded invoices and get paid faster with online payments." },
];

function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-brand-orange-deep to-brand-orange py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Link to="/" className="text-sm font-semibold text-white/90 hover:underline">← Back home</Link>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Business Banking</h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">Powerful tools that help your business collect, manage, and grow its money.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {ITEMS.map((i) => (
            <div key={i.title} className="rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-orange/10">
              <h2 className="text-xl font-bold">{i.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{i.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
