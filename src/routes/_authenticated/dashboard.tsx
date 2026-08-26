import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useId } from "react";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  PlusCircle,
  CreditCard,
  Wallet,
  TrendingUp,
  PiggyBank,
  ShieldCheck,
  Lock,
  Unlock,
  FileText,
  CheckCircle2,
  Building2,
  RefreshCw,
  Search,
  ChevronRight,
  X,
  DollarSign,
  Calendar,
  Sparkles,
  Bell,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BankLogo } from "@/components/bank-logo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Customer Dashboard — frithfrountequity Bank" },
      {
        name: "description",
        content:
          "Secure customer online banking dashboard. Manage your checking, savings, credit card, and investment balances.",
      },
      { property: "og:title", content: "Customer Dashboard — frithfrountequity Bank" },
      {
        property: "og:description",
        content:
          "Secure customer online banking dashboard. Manage your checking, savings, credit card, and investment balances.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

export type AccountKind = "Checking" | "Savings" | "Credit Card" | "Investment";

export type Account = {
  id: string;
  name: string;
  kind: AccountKind;
  accountNumber: string;
  last4: string;
  routingNumber: string;
  available: number;
  secondaryLabel: string;
  secondary: number;
  rateOrLimit?: string;
  accent: string;
  badge: string;
  cardLocked?: boolean;
};

export type Transaction = {
  id: string;
  accountId: string;
  accountLabel: string;
  date: string;
  description: string;
  category: "Income" | "Shopping" | "Food & Dining" | "Utilities" | "Investments" | "Transfer";
  amount: number; // positive = credit, negative = debit
  status: "Completed" | "Pending";
};

const INITIAL_ACCOUNTS: Account[] = [
  {
    id: "chk",
    name: "Everyday Checking",
    kind: "Checking",
    accountNumber: "40928174821",
    last4: "4821",
    routingNumber: "021000021",
    available: 8450.72,
    secondaryLabel: "Current ledger balance",
    secondary: 8612.05,
    rateOrLimit: "No monthly fees",
    accent: "from-brand-blue to-brand-blue-deep",
    badge: "Primary Checking",
  },
  {
    id: "sav",
    name: "High-Yield Savings",
    kind: "Savings",
    accountNumber: "88910249037",
    last4: "9037",
    routingNumber: "021000021",
    available: 24310.18,
    secondaryLabel: "Interest earned YTD",
    secondary: 612.44,
    rateOrLimit: "4.85% APY",
    accent: "from-brand-orange to-brand-orange-deep",
    badge: "4.85% APY Growth",
  },
  {
    id: "cc",
    name: "Platinum Rewards Card",
    kind: "Credit Card",
    accountNumber: "542199001156",
    last4: "1156",
    routingNumber: "N/A",
    available: 4180.0,
    secondaryLabel: "Current balance",
    secondary: 820.0,
    rateOrLimit: "Limit: $5,000.00",
    accent: "from-slate-700 via-slate-800 to-zinc-900",
    badge: "2% Unlimited Cash Back",
    cardLocked: false,
  },
  {
    id: "inv",
    name: "Growth Portfolio",
    kind: "Investment",
    accountNumber: "91028347742",
    last4: "7742",
    routingNumber: "021000021",
    available: 63920.55,
    secondaryLabel: "Today's return",
    secondary: 412.9,
    rateOrLimit: "+18.4% All-Time",
    accent: "from-emerald-600 via-teal-700 to-brand-blue-deep",
    badge: "Managed Wealth",
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    accountId: "chk",
    accountLabel: "Checking •••• 4821",
    date: "Today, 10:14 AM",
    description: "Apex Systems Payroll Direct Deposit",
    category: "Income",
    amount: 3250.0,
    status: "Completed",
  },
  {
    id: "tx-2",
    accountId: "cc",
    accountLabel: "Credit Card •••• 1156",
    date: "Yesterday, 7:32 PM",
    description: "Whole Foods Market #1042",
    category: "Food & Dining",
    amount: -124.5,
    status: "Completed",
  },
  {
    id: "tx-3",
    accountId: "sav",
    accountLabel: "Savings •••• 9037",
    date: "Aug 24, 2026",
    description: "High-Yield Monthly APY Interest Credit",
    category: "Income",
    amount: 98.15,
    status: "Completed",
  },
  {
    id: "tx-4",
    accountId: "cc",
    accountLabel: "Credit Card •••• 1156",
    date: "Aug 23, 2026",
    description: "Apple Inc. Cloud Services & Subscriptions",
    category: "Shopping",
    amount: -14.99,
    status: "Completed",
  },
  {
    id: "tx-5",
    accountId: "inv",
    accountLabel: "Investment •••• 7742",
    date: "Aug 22, 2026",
    description: "Vanguard S&P 500 Index Dividend Reinvestment",
    category: "Investments",
    amount: 142.3,
    status: "Completed",
  },
  {
    id: "tx-6",
    accountId: "chk",
    accountLabel: "Checking •••• 4821",
    date: "Aug 21, 2026",
    description: "National Grid Electric & Utilities AutoPay",
    category: "Utilities",
    amount: -85.2,
    status: "Completed",
  },
  {
    id: "tx-7",
    accountId: "chk",
    accountLabel: "Checking •••• 4821",
    date: "Aug 20, 2026",
    description: "Blue Bottle Coffee & Bakery",
    category: "Food & Dining",
    amount: -6.75,
    status: "Completed",
  },
];

const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function getGreetingTime(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function HiddenMask({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block tracking-[0.25em] font-mono text-muted-foreground select-none ${className}`}
      aria-label="Balance hidden"
    >
      ••••••
    </span>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("Sarah");
  const [userEmail, setUserEmail] = useState<string>("sarah.jenkins@example.com");
  const [hideBalances, setHideBalances] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);

  // Transfer modal state
  const [transferOpen, setTransferOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState("chk");
  const [toAccount, setToAccount] = useState("sav");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Account details modal
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  // Load hideBalances preference from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("ffe:hideBalances");
      if (stored === "1" || stored === "true") {
        setHideBalances(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Fetch real authenticated user profile or fallback to Sarah
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!active || !data.user) return;

        setUserEmail(data.user.email ?? "sarah.jenkins@example.com");

        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!active) return;
        const first =
          profile?.first_name?.trim() ||
          (data.user.user_metadata as { first_name?: string } | null)?.first_name ||
          (data.user.email ? data.user.email.split("@")[0] : "Sarah");

        if (first) {
          // Capitalize first letter
          const capitalized = first.charAt(0).toUpperCase() + first.slice(1);
          setUserName(capitalized);
        }
      } catch {
        /* fallback to demo default */
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  function togglePrivacy() {
    setHideBalances((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem("ffe:hideBalances", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  async function handleSignOut() {
    try {
      window.localStorage.removeItem("ffe:demo_mode");
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    navigate({ to: "/login", replace: true });
  }

  function handleCardLockToggle(accountId: string) {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          const nextLocked = !acc.cardLocked;
          showToast(
            nextLocked
              ? `Credit Card •••• ${acc.last4} has been locked.`
              : `Credit Card •••• ${acc.last4} has been unlocked.`
          );
          return { ...acc, cardLocked: nextLocked };
        }
        return acc;
      })
    );
  }

  function showToast(msg: string) {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  }

  function handleTransferSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = parseFloat(transferAmount);
    if (!amountNum || isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }

    if (fromAccount === toAccount) {
      alert("Source and destination accounts must be different.");
      return;
    }

    const sourceAcc = accounts.find((a) => a.id === fromAccount);
    if (!sourceAcc || sourceAcc.available < amountNum) {
      alert("Insufficient funds in the source account.");
      return;
    }

    // Execute transfer
    const destAcc = accounts.find((a) => a.id === toAccount);

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromAccount) {
          return { ...acc, available: acc.available - amountNum, secondary: acc.secondary - amountNum };
        }
        if (acc.id === toAccount) {
          return { ...acc, available: acc.available + amountNum, secondary: acc.secondary + amountNum };
        }
        return acc;
      })
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      accountId: fromAccount,
      accountLabel: `${sourceAcc.name} •••• ${sourceAcc.last4}`,
      date: "Just now",
      description: `Transfer to ${destAcc?.name || "Account"} ${transferNote ? `(${transferNote})` : ""}`,
      category: "Transfer",
      amount: -amountNum,
      status: "Completed",
    };

    setTransactions((prev) => [newTx, ...prev]);
    setTransferSuccess(true);
    showToast(`Successfully transferred ${formatCurrency(amountNum)} to ${destAcc?.name}!`);

    setTimeout(() => {
      setTransferSuccess(false);
      setTransferOpen(false);
      setTransferAmount("");
      setTransferNote("");
    }, 1500);
  }

  // Calculations
  const depositAccounts = accounts.filter((a) => a.kind !== "Credit Card");
  const totalBalance = depositAccounts.reduce((sum, a) => sum + a.available, 0);
  const netAvailable = accounts
    .filter((a) => a.kind === "Checking" || a.kind === "Savings")
    .reduce((sum, a) => sum + a.available, 0);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesCategory = selectedCategory === "all" || tx.accountId === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.accountLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50/80 text-foreground font-sans dark:bg-background">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Top Banking Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-blue-deep shadow-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="transition hover:opacity-90">
              <BankLogo className="[&_span]:!text-white [&_p]:!text-white" />
            </Link>
            <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 sm:inline-flex">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              256-Bit Encrypted Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={togglePrivacy}
              title={hideBalances ? "Show Balances" : "Hide Balances"}
              aria-label={hideBalances ? "Show Balances" : "Hide Balances"}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              {hideBalances ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              <span className="hidden md:inline">{hideBalances ? "Show Balances" : "Hide Balances"}</span>
            </button>

            <div className="hidden text-right lg:block">
              <p className="text-xs font-semibold text-white">{userName}</p>
              <p className="text-[11px] text-white/70 truncate max-w-[160px]">{userEmail}</p>
            </div>

            <button
              onClick={handleSignOut}
              className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/15"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10 space-y-10">
        {/* Welcome Greeting & Privacy Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
              <Calendar className="size-3.5" />
              <span>{currentDateFormatted}</span>
            </div>
            <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {getGreetingTime()}, {userName}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-muted-foreground">
              Welcome to your financial overview. Here is how your money is doing today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTransferOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange/25 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-deep active:translate-y-0"
            >
              <Send className="size-4" />
              Transfer Money
            </button>
            <button
              onClick={togglePrivacy}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition shadow-sm ${
                hideBalances
                  ? "border-brand-orange/40 bg-brand-orange/10 text-brand-orange-deep"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-border dark:bg-card dark:text-foreground"
              }`}
            >
              {hideBalances ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              <span>{hideBalances ? "Show balances" : "Hide balances"}</span>
            </button>
          </div>
        </div>

        {/* Hero Balance Cards */}
        <section className="grid gap-5 md:grid-cols-2">
          {/* Card 1: Total Balance */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue-deep via-brand-blue to-blue-700 p-8 text-white shadow-xl shadow-brand-blue-deep/20 transition hover:shadow-2xl">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 size-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                Total Balance / Net Worth
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                <TrendingUp className="size-3.5" />
                +2.4% this month
              </span>
            </div>

            <div className="mt-4">
              <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {hideBalances ? <HiddenMask className="text-white/70" /> : formatCurrency(totalBalance)}
              </p>
              <p className="mt-2 text-xs text-white/75 font-medium">
                Combined balance across Checking, Savings, and Investment portfolios
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-white/85">
              <span>FDIC-Insured Security</span>
              <span className="font-semibold">{accounts.length} Active Accounts</span>
            </div>
          </div>

          {/* Card 2: Net Available Balance */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-orange via-brand-orange-deep to-amber-600 p-8 text-white shadow-xl shadow-brand-orange/20 transition hover:shadow-2xl">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 size-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                Net Available Balance
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                Instant Liquidity
              </span>
            </div>

            <div className="mt-4">
              <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {hideBalances ? <HiddenMask className="text-white/80" /> : formatCurrency(netAvailable)}
              </p>
              <p className="mt-2 text-xs text-white/90 font-medium">
                Ready to spend, withdraw, or transfer right now (Checking + Savings)
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-xs text-white">
              <span>Zero Overdraft Fees</span>
              <button
                onClick={() => setTransferOpen(true)}
                className="font-bold underline underline-offset-2 hover:text-white/80"
              >
                Send Money Now →
              </button>
            </div>
          </div>
        </section>

        {/* Quick Actions Panel */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-muted-foreground">
            Quick Actions
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            <button
              onClick={() => setTransferOpen(true)}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-center transition hover:border-brand-orange/50 hover:bg-brand-orange/5 hover:text-brand-orange-deep dark:border-border dark:bg-background"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Send className="size-5" />
              </div>
              <span className="text-xs font-bold">Transfer Money</span>
            </button>

            <button
              onClick={() => showToast("Deposit feature ready: Capture check front & back.")}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-center transition hover:border-brand-blue/50 hover:bg-brand-blue/5 hover:text-brand-blue-deep dark:border-border dark:bg-background"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                <PlusCircle className="size-5" />
              </div>
              <span className="text-xs font-bold">Deposit Check</span>
            </button>

            <button
              onClick={() => showToast("Bill Pay system ready: 0 pending bills.")}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-center transition hover:border-brand-blue/50 hover:bg-brand-blue/5 hover:text-brand-blue-deep dark:border-border dark:bg-background"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Building2 className="size-5" />
              </div>
              <span className="text-xs font-bold">Pay Bills</span>
            </button>

            <button
              onClick={() => handleCardLockToggle("cc")}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-center transition hover:border-slate-400 hover:bg-slate-100 dark:border-border dark:bg-background"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {accounts.find((a) => a.id === "cc")?.cardLocked ? (
                  <Lock className="size-5 text-red-500" />
                ) : (
                  <Unlock className="size-5 text-emerald-600" />
                )}
              </div>
              <span className="text-xs font-bold">
                {accounts.find((a) => a.id === "cc")?.cardLocked ? "Unlock Card" : "Freeze Card"}
              </span>
            </button>

            <button
              onClick={() => showToast("Your latest August e-Statement PDF is ready.")}
              className="col-span-2 sm:col-span-4 lg:col-span-1 flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-center transition hover:border-brand-blue/50 hover:bg-brand-blue/5 hover:text-brand-blue-deep dark:border-border dark:bg-background"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <FileText className="size-5" />
              </div>
              <span className="text-xs font-bold">Statements</span>
            </button>
          </div>
        </section>

        {/* 4 Accounts Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Your Accounts
              </h2>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Select an account for full routing details, statements, or transfers
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              4 of 4 accounts connected
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {accounts.map((acc) => {
              const isCredit = acc.kind === "Credit Card";
              const isInvestment = acc.kind === "Investment";
              const isSavings = acc.kind === "Savings";

              return (
                <div
                  key={acc.id}
                  onClick={() => setActiveAccount(acc)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-xl dark:border-border dark:bg-card"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${acc.accent} text-white shadow-md`}
                      >
                        {isCredit && <CreditCard className="size-6" />}
                        {isSavings && <PiggyBank className="size-6" />}
                        {isInvestment && <TrendingUp className="size-6" />}
                        {!isCredit && !isSavings && !isInvestment && <Wallet className="size-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-blue-deep dark:text-white dark:group-hover:text-brand-orange">
                            {acc.name}
                          </h3>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-muted-foreground">
                          {acc.kind} •••• {acc.last4}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {acc.badge}
                    </span>
                  </div>

                  {/* Balance Display */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-muted-foreground">
                      {isCredit ? "Available Credit" : isInvestment ? "Portfolio Value" : "Available Balance"}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {hideBalances ? <HiddenMask /> : formatCurrency(acc.available)}
                      </p>
                    </div>
                  </div>

                  {/* Secondary info & footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-border">
                    <span className="text-slate-500 dark:text-muted-foreground">
                      {acc.secondaryLabel}:{" "}
                      <span className="font-bold text-slate-800 dark:text-white">
                        {hideBalances ? (
                          <HiddenMask className="text-xs" />
                        ) : (
                          formatCurrency(acc.secondary)
                        )}
                      </span>
                    </span>

                    <div className="flex items-center gap-1 font-bold text-brand-orange-deep group-hover:translate-x-0.5 transition-transform">
                      <span>View details</span>
                      <ChevronRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Transactions Section */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-border dark:bg-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Recent Transactions
              </h2>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Real-time debit, deposit, and investment activities
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs font-medium outline-none transition focus:border-brand-orange focus:bg-white dark:border-border dark:bg-background"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none transition focus:border-brand-orange dark:border-border dark:bg-background"
              >
                <option value="all">All Accounts</option>
                <option value="chk">Checking (•••• 4821)</option>
                <option value="sav">Savings (•••• 9037)</option>
                <option value="cc">Credit Card (•••• 1156)</option>
                <option value="inv">Investment (•••• 7742)</option>
              </select>
            </div>
          </div>

          {/* Transactions List */}
          <div className="mt-6 divide-y divide-slate-100 dark:divide-border">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                No transactions matching your search criteria.
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const isPositive = tx.amount > 0;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-4 transition hover:bg-slate-50/70 -mx-3 px-3 rounded-2xl dark:hover:bg-slate-900/50"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex size-10 items-center justify-center rounded-xl font-bold ${
                          isPositive
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowDownLeft className="size-5" />
                        ) : (
                          <ArrowUpRight className="size-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-muted-foreground">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span>{tx.accountLabel}</span>
                          <span className="hidden sm:inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {tx.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-sm font-extrabold ${
                          isPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {hideBalances ? (
                          <HiddenMask className="text-xs" />
                        ) : (
                          `${isPositive ? "+" : ""}${formatCurrency(tx.amount)}`
                        )}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Transfer Funds Modal */}
      {transferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <Send className="size-4" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground">Transfer Funds</h3>
              </div>
              <button
                onClick={() => setTransferOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {transferSuccess ? (
              <div className="py-8 text-center animate-in zoom-in">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="size-8" />
                </div>
                <h4 className="mt-4 text-lg font-bold">Transfer Complete!</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  The funds were transferred immediately.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTransferSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    From Account
                  </label>
                  <select
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-brand-orange"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} (Available: {formatCurrency(a.available)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    To Account
                  </label>
                  <select
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-brand-orange"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} (•••• {a.last4})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Transfer Amount (USD)
                  </label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-3 text-base font-bold outline-none transition focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Memo / Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Savings allocation"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTransferOpen(false)}
                    className="w-1/2 rounded-xl border border-border py-3 text-sm font-bold transition hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 rounded-xl bg-brand-orange py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange/30 transition hover:bg-brand-orange-deep"
                  >
                    Confirm Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Account Details Drawer / Modal */}
      {activeAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${activeAccount.accent} text-white shadow-md`}
                >
                  {activeAccount.kind === "Credit Card" && <CreditCard className="size-6" />}
                  {activeAccount.kind === "Savings" && <PiggyBank className="size-6" />}
                  {activeAccount.kind === "Investment" && <TrendingUp className="size-6" />}
                  {activeAccount.kind === "Checking" && <Wallet className="size-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">{activeAccount.name}</h3>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    {activeAccount.kind} Account
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveAccount(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-muted/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Available Balance
              </p>
              <p className="mt-1 text-3xl font-extrabold text-foreground">
                {hideBalances ? <HiddenMask /> : formatCurrency(activeAccount.available)}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-mono font-bold">
                  {hideBalances ? "•••• •••• " + activeAccount.last4 : activeAccount.accountNumber}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Routing Number (ABA)</span>
                <span className="font-mono font-bold">{activeAccount.routingNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Account Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                  <CheckCircle2 className="size-4" /> Active & Verified
                </span>
              </div>
              {activeAccount.rateOrLimit && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Terms / Limits</span>
                  <span className="font-bold text-foreground">{activeAccount.rateOrLimit}</span>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setActiveAccount(null);
                  setFromAccount(activeAccount.id);
                  setTransferOpen(true);
                }}
                className="w-1/2 rounded-xl bg-brand-blue py-3 text-sm font-bold text-white transition hover:bg-brand-blue-deep"
              >
                Transfer Funds
              </button>
              <button
                onClick={() => {
                  setActiveAccount(null);
                  showToast(`Statements for ${activeAccount.name} sent to your email.`);
                }}
                className="w-1/2 rounded-xl border border-border py-3 text-sm font-bold transition hover:bg-muted"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
