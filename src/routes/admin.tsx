import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  DollarSign,
  Edit,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  KeyRound,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  LogIn,
  Trash2,
  LogOut,
} from "lucide-react";
import { BankLogo } from "@/components/bank-logo";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Portal — frithfrountequity Bank" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DirectAdminDashboard,
});

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  // Status & Approval
  status: "Active" | "Frozen";
  approvalStatus: "Approved" | "Pending Approval" | "Rejected";
  // Balances
  checkingBalance: number;
  checkingAccNumber: string;
  savingsBalance: number;
  savingsAccNumber: string;
  creditBalance: number;
  creditLimit: number;
  // Codes & Tax Details
  routingNumber: string;
  swiftCode: string;
  taxId: string; // SSN / EIN
  taxClearanceCode: string;
  cotCode: string; // Cost of Transfer
  imfCode: string; // IMF clearance code
};

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: "usr-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace",
    city: "New York, NY",
    postalCode: "10001",
    status: "Active",
    approvalStatus: "Approved",
    checkingBalance: 8450.72,
    checkingAccNumber: "40928174821",
    savingsBalance: 24310.18,
    savingsAccNumber: "88910249037",
    creditBalance: 820.0,
    creditLimit: 5000.0,
    routingNumber: "021000021",
    swiftCode: "FFEUS33NY",
    taxId: "984-21-9901",
    taxClearanceCode: "TXC-88219-US",
    cotCode: "COT-49201",
    imfCode: "IMF-7721",
  },
  {
    id: "usr-2",
    name: "Marcus Vance",
    email: "m.vance@enterprise-group.io",
    phone: "+1 (555) 872-9102",
    address: "100 Wall Street, Suite 400",
    city: "New York, NY",
    postalCode: "10005",
    status: "Active",
    approvalStatus: "Approved",
    checkingBalance: 142500.0,
    checkingAccNumber: "40928173391",
    savingsBalance: 450200.5,
    savingsAccNumber: "88910248841",
    creditBalance: 0.0,
    creditLimit: 25000.0,
    routingNumber: "021000021",
    swiftCode: "FFEUS33NY",
    taxId: "84-2991044",
    taxClearanceCode: "TXC-90412-CORP",
    cotCode: "COT-99012",
    imfCode: "IMF-8804",
  },
  {
    id: "usr-3",
    name: "Elena Rostova",
    email: "elena.rostova@techsolutions.com",
    phone: "+1 (555) 639-4411",
    address: "120 Biscayne Blvd",
    city: "Miami, FL",
    postalCode: "33132",
    status: "Active",
    approvalStatus: "Pending Approval",
    checkingBalance: 18940.25,
    checkingAccNumber: "40928179912",
    savingsBalance: 5000.0,
    savingsAccNumber: "88910249912",
    creditBalance: 0.0,
    creditLimit: 10000.0,
    routingNumber: "021000021",
    swiftCode: "FFEUS33NY",
    taxId: "442-19-8802",
    taxClearanceCode: "TXC-11049-INTL",
    cotCode: "COT-33019",
    imfCode: "IMF-9912",
  },
  {
    id: "usr-4",
    name: "David Chen",
    email: "dchen.crypto@quantum.dev",
    phone: "+1 (555) 301-7782",
    address: "504 Colorado St",
    city: "Austin, TX",
    postalCode: "78701",
    status: "Frozen",
    approvalStatus: "Rejected",
    checkingBalance: 340.12,
    checkingAccNumber: "40928176620",
    savingsBalance: 0.0,
    savingsAccNumber: "88910246620",
    creditBalance: 2950.0,
    creditLimit: 3000.0,
    routingNumber: "021000021",
    swiftCode: "FFEUS33NY",
    taxId: "582-90-1149",
    taxClearanceCode: "TXC-HOLD-44",
    cotCode: "COT-HOLD",
    imfCode: "IMF-BLOCKED",
  },
];

const formatMoney = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export function DirectAdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeErr, setPasscodeErr] = useState<string | null>(null);

  const [customers, setCustomers] = useState<Customer[]>(DEFAULT_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  // Modal 1: Credit / Debit Balance
  const [balanceModal, setBalanceModal] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");
  const [alterType, setAlterType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [alterAmount, setAlterAmount] = useState("");
  const [alterMemo, setAlterMemo] = useState("");

  // Modal 2: Edit Info & Tax/Routing Codes
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Customer | null>(null);

  // Modal 3: Add New User
  const [addModal, setAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    status: "Active",
    approvalStatus: "Approved",
    checkingBalance: 1000.0,
    checkingAccNumber: `4092817${Math.floor(1000 + Math.random() * 9000)}`,
    savingsBalance: 5000.0,
    savingsAccNumber: `8891024${Math.floor(1000 + Math.random() * 9000)}`,
    creditBalance: 0,
    creditLimit: 5000.0,
    routingNumber: "021000021",
    swiftCode: "FFEUS33NY",
    taxId: "123-45-6789",
    taxClearanceCode: `TXC-${Math.floor(10000 + Math.random() * 90000)}`,
    cotCode: `COT-${Math.floor(10000 + Math.random() * 90000)}`,
    imfCode: `IMF-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  // Modal 4: Delete Confirmation
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<Customer | null>(null);

  // Load persisted customers from localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("ffe:admin_customers");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomers(parsed);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  function saveCustomers(updated: Customer[]) {
    setCustomers(updated);
    try {
      window.localStorage.setItem("ffe:admin_customers", JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handlePasscode(e: React.FormEvent) {
    e.preventDefault();
    if (passcode === "1234" || passcode.toLowerCase() === "admin") {
      setIsAuthenticated(true);
      setPasscodeErr(null);
    } else {
      setPasscodeErr("Invalid PIN. (Demo: 1234)");
    }
  }

  // --- ACTIONS ---

  // 1. Log In as User (Impersonation)
  function handleLoginAsUser(customer: Customer) {
    try {
      window.localStorage.setItem("ffe:impersonate_user", JSON.stringify(customer));
      window.localStorage.setItem("ffe:demo_mode", "true");
    } catch {
      /* ignore */
    }
    showToast(`Logging into ${customer.name}'s customer dashboard...`);
    setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 400);
  }

  // 2. Delete User
  function handleDeleteUser(customer: Customer) {
    const updated = customers.filter((c) => c.id !== customer.id);
    saveCustomers(updated);
    setDeleteConfirmUser(null);
    showToast(`Deleted customer "${customer.name}".`);
  }

  // 3. Freeze / Unfreeze
function toggleFreeze(customer: Customer) {
    const nextStatus: Customer["status"] = customer.status === "Active" ? "Frozen" : "Active";
    const updated = customers.map((c) =>
      c.id === customer.id ? { ...c, status: nextStatus } : c
    );
    saveCustomers(updated);
    showToast(`${customer.name} is now ${nextStatus === "Frozen" ? "FROZEN (Locked)" : "ACTIVE (Unlocked)"}.`);
  }

  // 4. User Approval Status
  function setApproval(customer: Customer, newApproval: Customer["approvalStatus"]) {
    const updated = customers.map((c) =>
      c.id === customer.id ? { ...c, approvalStatus: newApproval } : c
    );
    saveCustomers(updated);
    showToast(`${customer.name} approval status set to ${newApproval}.`);
  }

  // 5. Submit Credit / Debit Balance
  function handleBalanceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeCustomer) return;
    const amt = parseFloat(alterAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const delta = alterType === "CREDIT" ? amt : -amt;

    const updated = customers.map((c) => {
      if (c.id === activeCustomer.id) {
        if (accountType === "checking") {
          const newBal = Math.max(0, c.checkingBalance + delta);
          return { ...c, checkingBalance: newBal };
        } else {
          const newBal = Math.max(0, c.savingsBalance + delta);
          return { ...c, savingsBalance: newBal };
        }
      }
      return c;
    });

    saveCustomers(updated);
    setBalanceModal(false);
    setAlterAmount("");
    setAlterMemo("");
    showToast(
      `Successfully ${alterType === "CREDIT" ? "Credited (+)" : "Debited (-)"} ${formatMoney(amt)} to ${activeCustomer.name}'s ${accountType.toUpperCase()} account.`
    );
  }

  // 6. Save Personal Info & Codes
  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm) return;

    const updated = customers.map((c) => (c.id === editForm.id ? editForm : c));
    saveCustomers(updated);
    setEditModal(false);
    showToast(`Updated personal info & banking codes for ${editForm.name}.`);
  }

  // 7. Add New Customer
  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) {
      alert("Name and email are required.");
      return;
    }

    const created: Customer = {
      id: `usr-${Date.now()}`,
      name: newCustomer.name || "Customer",
      email: newCustomer.email || "email@example.com",
      phone: newCustomer.phone || "+1 (555) 000-0000",
      address: newCustomer.address || "123 Main St",
      city: newCustomer.city || "New York, NY",
      postalCode: newCustomer.postalCode || "10001",
      status: (newCustomer.status as Customer["status"]) || "Active",
      approvalStatus: (newCustomer.approvalStatus as Customer["approvalStatus"]) || "Approved",
      checkingBalance: Number(newCustomer.checkingBalance) || 0,
      checkingAccNumber: newCustomer.checkingAccNumber || `4092817${Math.floor(1000 + Math.random() * 9000)}`,
      savingsBalance: Number(newCustomer.savingsBalance) || 0,
      savingsAccNumber: newCustomer.savingsAccNumber || `8891024${Math.floor(1000 + Math.random() * 9000)}`,
      creditBalance: Number(newCustomer.creditBalance) || 0,
      creditLimit: Number(newCustomer.creditLimit) || 5000,
      routingNumber: newCustomer.routingNumber || "021000021",
      swiftCode: newCustomer.swiftCode || "FFEUS33NY",
      taxId: newCustomer.taxId || "000-00-0000",
      taxClearanceCode: newCustomer.taxClearanceCode || "TXC-00000",
      cotCode: newCustomer.cotCode || "COT-00000",
      imfCode: newCustomer.imfCode || "IMF-0000",
    };

    const updated = [created, ...customers];
    saveCustomers(updated);
    setAddModal(false);
    showToast(`Added new customer: ${created.name}`);
  }

  const filtered = customers.filter((c) => {
    const matchSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.checkingAccNumber.includes(search) ||
      c.taxId.includes(search);
    const matchStatus = filterStatus === "all" || c.status === filterStatus || c.approvalStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  // --- PASSCODE GATE ---
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
        <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xs font-bold text-brand-orange hover:underline">
              ← Back Home
            </Link>
            <span className="text-xs font-bold text-red-400 flex items-center gap-1">
              <ShieldAlert className="size-3.5" /> Staff Only
            </span>
          </div>

          <div className="mt-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-orange/20 text-brand-orange">
              <KeyRound className="size-6" />
            </div>
            <h1 className="mt-3 text-2xl font-black">Admin Access</h1>
            <p className="mt-1 text-xs text-slate-400">Enter Admin PIN to manage & control users.</p>
          </div>

          <form onSubmit={handlePasscode} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="PIN (1234)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-white outline-none focus:border-brand-orange"
            />
            {passcodeErr && (
              <p className="text-center text-xs font-bold text-red-400">{passcodeErr}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-orange py-3 text-sm font-bold text-white transition hover:bg-brand-orange-deep"
            >
              Sign In to Admin Console
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsAuthenticated(true)}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <Sparkles className="size-3.5 text-brand-orange" />
            Instant Admin Bypass
          </button>
        </div>
      </div>
    );
  }

  // --- DIRECT ADMIN CONTROL CENTER ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-brand-orange/50 bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-2xl">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link to="/">
              <BankLogo className="[&_span]:!text-white [&_p]:!text-white" />
            </Link>
            <span className="rounded-full bg-brand-orange/20 px-2.5 py-0.5 text-[11px] font-black uppercase text-brand-orange">
              Admin Master Control
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-orange-deep transition"
            >
              <Plus className="size-4" /> Add User
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white"
            >
              Exit Console
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 space-y-6">
        {/* Top Summary Counter Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Customers</p>
            <p className="mt-2 text-2xl font-black text-white">{customers.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Checking Balances</p>
            <p className="mt-2 text-2xl font-black text-emerald-400">
              {formatMoney(customers.reduce((s, c) => s + c.checkingBalance, 0))}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Savings Balances</p>
            <p className="mt-2 text-2xl font-black text-brand-orange">
              {formatMoney(customers.reduce((s, c) => s + c.savingsBalance, 0))}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Approvals</p>
            <p className="mt-2 text-2xl font-black text-yellow-400">
              {customers.filter((c) => c.approvalStatus === "Pending Approval").length}
            </p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name, email, account #, Tax ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs font-medium text-white outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-brand-orange"
            >
              <option value="all">All Customers</option>
              <option value="Active">Active Only</option>
              <option value="Frozen">Frozen Only</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* DIRECT USER CONTROL TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Customer / Contact</th>
                <th className="px-4 py-3.5">Account Balances</th>
                <th className="px-4 py-3.5">Codes (Tax / Routing / COT)</th>
                <th className="px-4 py-3.5">Status & Approval</th>
                <th className="px-4 py-3.5 text-right">Actions & Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/50 transition">
                  {/* Customer Info */}
                  <td className="px-4 py-4">
                    <div className="font-bold text-sm text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400">{c.email}</div>
                    <div className="text-[10px] text-slate-500">{c.phone} • {c.city}</div>
                  </td>

                  {/* Balances */}
                  <td className="px-4 py-4 space-y-1">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Checking: </span>
                      <span className="font-mono font-black text-emerald-400 text-sm">{formatMoney(c.checkingBalance)}</span>
                      <span className="text-[10px] text-slate-500 ml-1">(•••• {c.checkingAccNumber.slice(-4)})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Savings: </span>
                      <span className="font-mono font-black text-brand-orange">{formatMoney(c.savingsBalance)}</span>
                      <span className="text-[10px] text-slate-500 ml-1">(•••• {c.savingsAccNumber.slice(-4)})</span>
                    </div>
                  </td>

                  {/* Codes (Routing, Tax ID, COT, IMF) */}
                  <td className="px-4 py-4 font-mono text-[11px] space-y-0.5">
                    <div><span className="text-slate-400 font-sans text-[10px]">Routing:</span> <span className="text-white font-bold">{c.routingNumber}</span></div>
                    <div><span className="text-slate-400 font-sans text-[10px]">Tax ID/SSN:</span> <span className="text-cyan-300 font-bold">{c.taxId}</span></div>
                    <div><span className="text-slate-400 font-sans text-[10px]">COT / IMF:</span> <span className="text-amber-300">{c.cotCode}</span> | <span className="text-purple-300">{c.imfCode}</span></div>
                  </td>

                  {/* Status & Approval */}
                  <td className="px-4 py-4 space-y-2">
                    {/* Freeze / Unfreeze Toggle */}
                    <div>
                      <button
                        onClick={() => toggleFreeze(c)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold transition ${
                          c.status === "Frozen"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400"
                        }`}
                      >
                        {c.status === "Frozen" ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                        <span>{c.status === "Frozen" ? "FROZEN" : "ACTIVE"}</span>
                      </button>
                    </div>

                    {/* Approval Dropdown */}
                    <div>
                      <select
                        value={c.approvalStatus}
                        onChange={(e) => setApproval(c, e.target.value as Customer["approvalStatus"])}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold outline-none border ${
                          c.approvalStatus === "Approved"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                            : c.approvalStatus === "Pending Approval"
                            ? "bg-yellow-950 text-yellow-400 border-yellow-800"
                            : "bg-red-950 text-red-400 border-red-800"
                        }`}
                      >
                        <option value="Approved">Approved</option>
                        <option value="Pending Approval">Pending</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </td>

                  {/* Direct Action Buttons & Login as User */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end flex-wrap gap-1.5">
                      {/* 1. Log In As User */}
                      <button
                        onClick={() => handleLoginAsUser(c)}
                        className="rounded-xl bg-blue-600 px-2.5 py-1.5 text-xs font-black text-white hover:bg-blue-500 transition flex items-center gap-1 shadow-md"
                        title="Log in to customer dashboard as this user"
                      >
                        <LogIn className="size-3.5" /> Log In as User
                      </button>

                      {/* 2. Credit / Debit */}
                      <button
                        onClick={() => {
                          setActiveCustomer(c);
                          setAccountType("checking");
                          setAlterType("CREDIT");
                          setBalanceModal(true);
                        }}
                        className="rounded-xl bg-emerald-500/20 px-2.5 py-1.5 text-xs font-black text-emerald-400 hover:bg-emerald-500 hover:text-white transition flex items-center gap-1"
                        title="Credit or Debit Balance"
                      >
                        <DollarSign className="size-3" /> ± $
                      </button>

                      {/* 3. Edit Info & Codes */}
                      <button
                        onClick={() => {
                          setEditForm({ ...c });
                          setEditModal(true);
                        }}
                        className="rounded-xl bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-brand-orange hover:text-white transition flex items-center gap-1"
                        title="Edit Personal Info & Codes"
                      >
                        <Edit className="size-3" /> Edit
                      </button>

                      {/* 4. Delete User */}
                      <button
                        onClick={() => setDeleteConfirmUser(c)}
                        className="rounded-xl bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500 hover:text-white transition"
                        title="Delete User"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL 1: DIRECT CREDIT / DEBIT ACCOUNT */}
      {balanceModal && activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <DollarSign className="size-5" />
                </div>
                <h3 className="text-xl font-black">Credit / Debit Account</h3>
              </div>
              <button onClick={() => setBalanceModal(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Customer: <span className="font-bold text-white">{activeCustomer.name}</span> ({activeCustomer.email})
            </p>

            <form onSubmit={handleBalanceSubmit} className="mt-6 space-y-4">
              {/* Account Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Account</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType("checking")}
                    className={`rounded-xl py-2.5 text-xs font-bold border transition ${
                      accountType === "checking"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    Checking: {formatMoney(activeCustomer.checkingBalance)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("savings")}
                    className={`rounded-xl py-2.5 text-xs font-bold border transition ${
                      accountType === "savings"
                        ? "border-brand-orange bg-brand-orange/20 text-brand-orange"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    Savings: {formatMoney(activeCustomer.savingsBalance)}
                  </button>
                </div>
              </div>

              {/* Action Type */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Action</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAlterType("CREDIT")}
                    className={`rounded-xl py-3 text-xs font-black transition flex items-center justify-center gap-1 ${
                      alterType === "CREDIT"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-950 text-slate-400 border border-slate-800"
                    }`}
                  >
                    <ArrowDownLeft className="size-4" /> + CREDIT (Deposit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlterType("DEBIT")}
                    className={`rounded-xl py-3 text-xs font-black transition flex items-center justify-center gap-1 ${
                      alterType === "DEBIT"
                        ? "bg-red-500 text-white"
                        : "bg-slate-950 text-slate-400 border border-slate-800"
                    }`}
                  >
                    <ArrowUpRight className="size-4" /> - DEBIT (Deduct)
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="e.g. 5000.00"
                  value={alterAmount}
                  onChange={(e) => setAlterAmount(e.target.value)}
                  autoFocus
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg font-black text-white outline-none focus:border-brand-orange"
                />
              </div>

              {/* Memo */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Reason / Memo (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Wire Settlement, Tax Refund, Administrative Credit"
                  value={alterMemo}
                  onChange={(e) => setAlterMemo(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white outline-none focus:border-brand-orange"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBalanceModal(false)}
                  className="w-1/2 rounded-xl border border-slate-800 py-3 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-brand-orange py-3 text-xs font-black text-white hover:bg-brand-orange-deep shadow-lg"
                >
                  Apply Balance Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PERSONAL INFO & TAX / ROUTING CODES */}
      {editModal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="size-5 text-brand-orange" />
                <h3 className="text-xl font-black">Edit Customer Info & Banking Codes</h3>
              </div>
              <button onClick={() => setEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-6">
              {/* SECTION A: PERSONAL INFO */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-orange">1. Personal Details</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Street Address</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">City, State</label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Postal / Zip Code</label>
                    <input
                      type="text"
                      value={editForm.postalCode}
                      onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: BANKING & CLEARANCE CODES */}
              <div className="border-t border-slate-800 pt-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400">2. Banking & Tax Clearance Codes</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Routing Number (ABA)</label>
                    <input
                      type="text"
                      value={editForm.routingNumber}
                      onChange={(e) => setEditForm({ ...editForm, routingNumber: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">SWIFT / BIC Code</label>
                    <input
                      type="text"
                      value={editForm.swiftCode}
                      onChange={(e) => setEditForm({ ...editForm, swiftCode: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Tax ID / SSN / EIN</label>
                    <input
                      type="text"
                      value={editForm.taxId}
                      onChange={(e) => setEditForm({ ...editForm, taxId: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Tax Clearance Code</label>
                    <input
                      type="text"
                      value={editForm.taxClearanceCode}
                      onChange={(e) => setEditForm({ ...editForm, taxClearanceCode: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">COT Code (Cost of Transfer)</label>
                    <input
                      type="text"
                      value={editForm.cotCode}
                      onChange={(e) => setEditForm({ ...editForm, cotCode: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-amber-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">IMF Clearance Code</label>
                    <input
                      type="text"
                      value={editForm.imfCode}
                      onChange={(e) => setEditForm({ ...editForm, imfCode: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-purple-300"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: ACCOUNT NUMBERS */}
              <div className="border-t border-slate-800 pt-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">3. Account Numbers</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Checking Account #</label>
                    <input
                      type="text"
                      value={editForm.checkingAccNumber}
                      onChange={(e) => setEditForm({ ...editForm, checkingAccNumber: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Savings Account #</label>
                    <input
                      type="text"
                      value={editForm.savingsAccNumber}
                      onChange={(e) => setEditForm({ ...editForm, savingsAccNumber: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="w-1/2 rounded-xl border border-slate-800 py-3 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-brand-orange py-3 text-xs font-black text-white hover:bg-brand-orange-deep shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW USER */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="size-5 text-brand-orange" />
                <h3 className="text-xl font-black">Add New Banking Customer</h3>
              </div>
              <button onClick={() => setAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newCustomer.name || ""}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={newCustomer.email || ""}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Opening Checking Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="1000.00"
                    value={newCustomer.checkingBalance || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, checkingBalance: parseFloat(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Opening Savings Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="5000.00"
                    value={newCustomer.savingsBalance || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, savingsBalance: parseFloat(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Tax ID / SSN</label>
                  <input
                    type="text"
                    value={newCustomer.taxId || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, taxId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Routing Number</label>
                  <input
                    type="text"
                    value={newCustomer.routingNumber || "021000021"}
                    onChange={(e) => setNewCustomer({ ...newCustomer, routingNumber: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="w-1/2 rounded-xl border border-slate-800 py-3 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-brand-orange py-3 text-xs font-black text-white hover:bg-brand-orange-deep"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl text-white text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-400">
              <Trash2 className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black">Delete Customer?</h3>
            <p className="mt-1 text-xs text-slate-400">
              Are you sure you want to permanently delete <strong className="text-white">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})? All balances and account codes will be permanently removed.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="w-1/2 rounded-xl border border-slate-800 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmUser)}
                className="w-1/2 rounded-xl bg-red-600 py-2.5 text-xs font-black text-white hover:bg-red-500 shadow-lg shadow-red-600/30"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectAdminDashboard;
