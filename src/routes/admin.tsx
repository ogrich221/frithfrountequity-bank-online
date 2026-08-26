import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Users,
  DollarSign,
  ArrowLeftRight,
  History,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  PlusCircle,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  Download,
  Building2,
  TrendingUp,
  CreditCard,
  Wallet,
  PiggyBank,
  Check,
  X,
  FileSpreadsheet,
  KeyRound,
  ShieldCheck,
  UserCheck,
  UserX,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { BankLogo } from "@/components/bank-logo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal & Control Center — frithfrountequity Bank" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

export type UserStatus = "Active" | "Frozen" | "Suspended" | "Flagged";
export type KycTier = "Tier 1 (Basic)" | "Tier 2 (Verified)" | "Tier 3 (Enhanced)" | "Pending Review" | "Rejected";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type AdminUserAccount = {
  id: string;
  name: string;
  kind: "Checking" | "Savings" | "Credit Card" | "Investment";
  last4: string;
  accountNumber: string;
  available: number;
  secondary: number;
  limitOrApy?: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  status: UserStatus;
  kycTier: KycTier;
  riskLevel: RiskLevel;
  accounts: AdminUserAccount[];
  lastLogin: string;
  ipAddress: string;
  notes?: string;
};

export type AdminTransaction = {
  id: string;
  userId: string;
  userName: string;
  accountId: string;
  accountLabel: string;
  date: string;
  description: string;
  category: string;
  amount: number; // positive = credit/deposit, negative = debit/spend
  status: "Completed" | "Pending" | "Under Review" | "Declined" | "Reversed";
  referenceCode: string;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  adminUser: string;
  actionType: "BALANCE_ALTERATION" | "ACCOUNT_FREEZE" | "ACCOUNT_UNFREEZE" | "TX_REVERSAL" | "TX_APPROVAL" | "KYC_UPDATE" | "MANUAL_TX_INJECT" | "RISK_UPDATE";
  targetUser: string;
  description: string;
  reason: string;
};

const INITIAL_USERS: AdminUser[] = [
  {
    id: "usr-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+1 (555) 234-5678",
    joinedDate: "Jan 14, 2024",
    status: "Active",
    kycTier: "Tier 2 (Verified)",
    riskLevel: "Low",
    lastLogin: "Today, 10:14 AM",
    ipAddress: "192.0.2.45 (New York, US)",
    accounts: [
      {
        id: "chk-1",
        name: "Everyday Checking",
        kind: "Checking",
        last4: "4821",
        accountNumber: "40928174821",
        available: 8450.72,
        secondary: 8612.05,
      },
      {
        id: "sav-1",
        name: "High-Yield Savings",
        kind: "Savings",
        last4: "9037",
        accountNumber: "88910249037",
        available: 24310.18,
        secondary: 612.44,
        limitOrApy: "4.85% APY",
      },
      {
        id: "cc-1",
        name: "Platinum Rewards Card",
        kind: "Credit Card",
        last4: "1156",
        accountNumber: "542199001156",
        available: 4180.0,
        secondary: 820.0,
        limitOrApy: "Limit: $5,000.00",
      },
      {
        id: "inv-1",
        name: "Growth Portfolio",
        kind: "Investment",
        last4: "7742",
        accountNumber: "91028347742",
        available: 63920.55,
        secondary: 412.9,
        limitOrApy: "+18.4% YTD",
      },
    ],
  },
  {
    id: "usr-2",
    name: "Marcus Vance",
    email: "m.vance@enterprise-group.io",
    phone: "+1 (555) 872-9102",
    joinedDate: "Mar 02, 2024",
    status: "Active",
    kycTier: "Tier 3 (Enhanced)",
    riskLevel: "Low",
    lastLogin: "Yesterday, 4:20 PM",
    ipAddress: "198.51.100.12 (Chicago, US)",
    accounts: [
      {
        id: "chk-2",
        name: "Commercial Premier Checking",
        kind: "Checking",
        last4: "3391",
        accountNumber: "40928173391",
        available: 142500.0,
        secondary: 142500.0,
      },
      {
        id: "sav-2",
        name: "Treasury Money Market",
        kind: "Savings",
        last4: "8841",
        accountNumber: "88910248841",
        available: 450200.5,
        secondary: 12400.0,
        limitOrApy: "5.15% APY",
      },
    ],
  },
  {
    id: "usr-3",
    name: "Elena Rostova",
    email: "elena.rostova@techsolutions.com",
    phone: "+1 (555) 639-4411",
    joinedDate: "Nov 19, 2024",
    status: "Flagged",
    kycTier: "Pending Review",
    riskLevel: "High",
    lastLogin: "2 hours ago",
    ipAddress: "203.0.113.88 (Miami, US)",
    notes: "Sudden international wire attempts flagged by automated AML rules.",
    accounts: [
      {
        id: "chk-3",
        name: "Individual Checking",
        kind: "Checking",
        last4: "9912",
        accountNumber: "40928179912",
        available: 18940.25,
        secondary: 18940.25,
      },
    ],
  },
  {
    id: "usr-4",
    name: "David Chen",
    email: "dchen.crypto@quantum.dev",
    phone: "+1 (555) 301-7782",
    joinedDate: "Feb 10, 2025",
    status: "Frozen",
    kycTier: "Tier 1 (Basic)",
    riskLevel: "Critical",
    lastLogin: "3 days ago",
    ipAddress: "192.0.2.199 (Austin, US)",
    notes: "Account frozen due to chargeback disputes and unverified source of funds.",
    accounts: [
      {
        id: "chk-4",
        name: "Standard Checking",
        kind: "Checking",
        last4: "6620",
        accountNumber: "40928176620",
        available: 340.12,
        secondary: 340.12,
      },
      {
        id: "cc-4",
        name: "Gold Visa Card",
        kind: "Credit Card",
        last4: "4419",
        accountNumber: "542199004419",
        available: 0.0,
        secondary: 2950.0,
        limitOrApy: "Limit: $3,000.00",
      },
    ],
  },
  {
    id: "usr-5",
    name: "Aisha Al-Mansoor",
    email: "aisha.mansoor@globalcapital.ae",
    phone: "+1 (555) 912-3344",
    joinedDate: "May 22, 2025",
    status: "Active",
    kycTier: "Tier 3 (Enhanced)",
    riskLevel: "Low",
    lastLogin: "10 mins ago",
    ipAddress: "198.51.100.77 (London, UK)",
    accounts: [
      {
        id: "chk-5",
        name: "Private Wealth Checking",
        kind: "Checking",
        last4: "8801",
        accountNumber: "40928178801",
        available: 890000.0,
        secondary: 890000.0,
      },
      {
        id: "inv-5",
        name: "Global Sovereign Portfolio",
        kind: "Investment",
        last4: "5512",
        accountNumber: "91028345512",
        available: 2150000.0,
        secondary: 14500.0,
      },
    ],
  },
];

const INITIAL_ADMIN_TRANSACTIONS: AdminTransaction[] = [
  {
    id: "tx-101",
    userId: "usr-1",
    userName: "Sarah Jenkins",
    accountId: "chk-1",
    accountLabel: "Checking •••• 4821",
    date: "2026-08-26 10:14 AM",
    description: "Apex Systems Payroll Direct Deposit",
    category: "Income",
    amount: 3250.0,
    status: "Completed",
    referenceCode: "ACH-9948210-CR",
  },
  {
    id: "tx-102",
    userId: "usr-1",
    userName: "Sarah Jenkins",
    accountId: "cc-1",
    accountLabel: "Credit Card •••• 1156",
    date: "2026-08-25 07:32 PM",
    description: "Whole Foods Market #1042",
    category: "Food & Dining",
    amount: -124.5,
    status: "Completed",
    referenceCode: "POS-115609-DB",
  },
  {
    id: "tx-103",
    userId: "usr-3",
    userName: "Elena Rostova",
    accountId: "chk-3",
    accountLabel: "Checking •••• 9912",
    date: "2026-08-26 02:45 PM",
    description: "Outbound International Wire Transfer (Cyprus)",
    category: "Wire Transfer",
    amount: -15000.0,
    status: "Pending",
    referenceCode: "SWIFT-CY-88912",
  },
  {
    id: "tx-104",
    userId: "usr-4",
    userName: "David Chen",
    accountId: "cc-4",
    accountLabel: "Credit Card •••• 4419",
    date: "2026-08-23 03:12 AM",
    description: "BitForge Digital Asset Purchase",
    category: "Crypto Exchange",
    amount: -1850.0,
    status: "Under Review",
    referenceCode: "POS-441908-FL",
  },
  {
    id: "tx-105",
    userId: "usr-2",
    userName: "Marcus Vance",
    accountId: "chk-2",
    accountLabel: "Commercial •••• 3391",
    date: "2026-08-26 08:30 AM",
    description: "Vendor Settlement Batch — Alpha Tech LLC",
    category: "Commercial B2B",
    amount: -45000.0,
    status: "Completed",
    referenceCode: "FEDWIRE-20260826-09",
  },
  {
    id: "tx-106",
    userId: "usr-5",
    userName: "Aisha Al-Mansoor",
    accountId: "inv-5",
    accountLabel: "Investment •••• 5512",
    date: "2026-08-24 11:00 AM",
    description: "Private Equity Capital Call Tranche B",
    category: "Investments",
    amount: -250000.0,
    status: "Completed",
    referenceCode: "INV-551209-TR",
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-1",
    timestamp: "2026-08-26 09:15:22",
    adminUser: "SuperAdmin [AUTH-ID-01]",
    actionType: "RISK_UPDATE",
    targetUser: "David Chen",
    description: "Elevated risk score to Critical following multiple chargeback notices.",
    reason: "Fraud Risk Mitigation Policy §4.2",
  },
  {
    id: "log-2",
    timestamp: "2026-08-26 09:16:00",
    adminUser: "SuperAdmin [AUTH-ID-01]",
    actionType: "ACCOUNT_FREEZE",
    targetUser: "David Chen",
    description: "Frozen all active accounts and disabled debit/credit cards.",
    reason: "Administrative security lock",
  },
  {
    id: "log-3",
    timestamp: "2026-08-25 14:20:11",
    adminUser: "ComplianceOfficer [AUTH-ID-04]",
    actionType: "KYC_UPDATE",
    targetUser: "Marcus Vance",
    description: "Approved Tier 3 (Enhanced Commercial Verification) documents.",
    reason: "Corporate Certificate of Incorporation Verified",
  },
];

const formatCurrency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export function AdminDashboard() {
  const navigate = useNavigate();

  // Admin authentication gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Core administrative states
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [transactions, setTransactions] = useState<AdminTransaction[]>(INITIAL_ADMIN_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"users" | "balances" | "transactions" | "logs">("users");

  // Search & filters
  const [userSearch, setUserSearch] = useState<string>("");
  const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
  const [txSearch, setTxSearch] = useState<string>("");
  const [txStatusFilter, setTxStatusFilter] = useState<string>("all");

  // Balance Alteration Modal State
  const [balanceModalOpen, setBalanceModalOpen] = useState<boolean>(false);
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<AdminUser>(INITIAL_USERS[0]!);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(INITIAL_USERS[0]!.accounts[0]!.id);
  const [alterAction, setAlterAction] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [alterAmount, setAlterAmount] = useState<string>("");
  const [alterReason, setAlterReason] = useState<string>("Administrative Correction");
  const [alterCustomNote, setAlterCustomNote] = useState<string>("");

  // Transaction Edit / Reversal Modal State
  const [editTxModalOpen, setEditTxModalOpen] = useState<boolean>(false);
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null);
  const [editTxStatus, setEditTxStatus] = useState<AdminTransaction["status"]>("Completed");
  const [editTxDesc, setEditTxDesc] = useState<string>("");

  // Manual Injected Transaction Modal State
  const [injectTxModalOpen, setInjectTxModalOpen] = useState<boolean>(false);
  const [injectUserId, setInjectUserId] = useState<string>(INITIAL_USERS[0]!.id);
  const [injectAccountId, setInjectAccountId] = useState<string>(INITIAL_USERS[0]!.accounts[0]!.id);
  const [injectType, setInjectType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [injectAmount, setInjectAmount] = useState<string>("");
  const [injectDescription, setInjectDescription] = useState<string>("Administrative Wire Credit");
  const [injectCategory, setInjectCategory] = useState<string>("Wire Transfer");

  // User Edit KYC/Risk Modal State
  const [editUserModalOpen, setEditUserModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editKycTier, setEditKycTier] = useState<KycTier>("Tier 2 (Verified)");
  const [editRiskLevel, setEditRiskLevel] = useState<RiskLevel>("Low");
  const [editUserNotes, setEditUserNotes] = useState<string>("");

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function triggerToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 4000);
  }

  function handlePasscodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passcode === "1234" || passcode.toLowerCase() === "admin") {
      setIsAuthenticated(true);
      setPasscodeError(null);
      triggerToast("Admin authorization verified. Welcome to Master Control.");
    } else {
      setPasscodeError("Invalid Admin Access Key. (Demo PIN: 1234)");
    }
  }

  function bypassAuth() {
    setIsAuthenticated(true);
    triggerToast("Admin Master Key Bypass Activated.");
  }

  // --- ACTIONS: USER STATUS & FREEZE ---
  function toggleUserFreeze(user: AdminUser) {
    const nextStatus: UserStatus = user.status === "Frozen" ? "Active" : "Frozen";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminUser: "SuperAdmin [AUTH-ID-01]",
      actionType: nextStatus === "Frozen" ? "ACCOUNT_FREEZE" : "ACCOUNT_UNFREEZE",
      targetUser: user.name,
      description: `${nextStatus === "Frozen" ? "Frozen" : "Unfrozen"} all banking accounts and cards.`,
      reason: nextStatus === "Frozen" ? "Admin Manual Security Freeze" : "Security Verification Cleared",
    };

    setAuditLogs((prev) => [log, ...prev]);
    triggerToast(`Customer ${user.name} status updated to [${nextStatus}].`);
  }

  // --- ACTIONS: SAVE USER KYC & RISK ---
  function handleSaveUserEdits(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              kycTier: editKycTier,
              riskLevel: editRiskLevel,
              notes: editUserNotes,
            }
          : u
      )
    );

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminUser: "SuperAdmin [AUTH-ID-01]",
      actionType: "KYC_UPDATE",
      targetUser: editingUser.name,
      description: `Updated KYC to ${editKycTier} and Risk Rating to ${editRiskLevel}.`,
      reason: "Administrative Review & Compliance Override",
    };

    setAuditLogs((prev) => [log, ...prev]);
    setEditUserModalOpen(false);
    triggerToast(`Customer ${editingUser.name} profile successfully updated.`);
  }

  // --- ACTIONS: ALTER BALANCE ---
  function handleAlterBalanceSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountVal = parseFloat(alterAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert("Please enter a valid dollar amount.");
      return;
    }

    const delta = alterAction === "CREDIT" ? amountVal : -amountVal;

    // Update account in user state
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === selectedUserForBalance.id) {
          const updatedAccounts = u.accounts.map((acc) => {
            if (acc.id === selectedAccountId) {
              const newAvailable = Math.max(0, acc.available + delta);
              const newSecondary = Math.max(0, acc.secondary + delta);
              return { ...acc, available: newAvailable, secondary: newSecondary };
            }
            return acc;
          });
          return { ...u, accounts: updatedAccounts };
        }
        return u;
      })
    );

    // Create a transaction record reflecting the alteration
    const targetAccount = selectedUserForBalance.accounts.find((a) => a.id === selectedAccountId);
    const newTx: AdminTransaction = {
      id: `tx-adm-${Date.now()}`,
      userId: selectedUserForBalance.id,
      userName: selectedUserForBalance.name,
      accountId: selectedAccountId,
      accountLabel: `${targetAccount?.name || "Account"} •••• ${targetAccount?.last4 || "0000"}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      description: `Admin ${alterAction === "CREDIT" ? "Credit" : "Debit"}: ${alterReason} ${alterCustomNote ? `(${alterCustomNote})` : ""}`,
      category: "Administrative Adjustment",
      amount: delta,
      status: "Completed",
      referenceCode: `ADM-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Create audit log entry
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminUser: "SuperAdmin [AUTH-ID-01]",
      actionType: "BALANCE_ALTERATION",
      targetUser: selectedUserForBalance.name,
      description: `${alterAction === "CREDIT" ? "Credited" : "Debited"} ${formatCurrency(amountVal)} into ${targetAccount?.name} (•••• ${targetAccount?.last4}).`,
      reason: `${alterReason} ${alterCustomNote ? `— ${alterCustomNote}` : ""}`,
    };

    setAuditLogs((prev) => [logEntry, ...prev]);
    setBalanceModalOpen(false);
    setAlterAmount("");
    setAlterCustomNote("");
    triggerToast(
      `Successfully ${alterAction === "CREDIT" ? "credited" : "debited"} ${formatCurrency(amountVal)} for ${selectedUserForBalance.name}.`
    );
  }

  // --- ACTIONS: ALTER / REVERSE TRANSACTION ---
  function handleReversal(tx: AdminTransaction) {
    if (tx.status === "Reversed") {
      alert("This transaction is already reversed.");
      return;
    }

    const confirmRev = window.confirm(
      `Are you sure you want to reverse transaction "${tx.description}" (${formatCurrency(tx.amount)}) for ${tx.userName}?`
    );
    if (!confirmRev) return;

    // Refund or claw back the amount from customer account
    const reverseAmount = -tx.amount; // opposite of transaction

    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === tx.userId) {
          const updatedAccounts = u.accounts.map((acc) => {
            if (acc.id === tx.accountId) {
              return {
                ...acc,
                available: acc.available + reverseAmount,
                secondary: acc.secondary + reverseAmount,
              };
            }
            return acc;
          });
          return { ...u, accounts: updatedAccounts };
        }
        return u;
      })
    );

    // Update tx status
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: "Reversed" } : t))
    );

    // Audit log
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminUser: "SuperAdmin [AUTH-ID-01]",
      actionType: "TX_REVERSAL",
      targetUser: tx.userName,
      description: `Reversed transaction "${tx.description}" (${formatCurrency(tx.amount)}) and refunded funds.`,
      reason: "Administrative Chargeback & Reversal Authorization",
    };

    setAuditLogs((prev) => [log, ...prev]);
    triggerToast(`Transaction ${tx.referenceCode} reversed. Account balance adjusted.`);
  }

  function handleSaveTxEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTx) return;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTx.id
          ? {
              ...t,
              status: editTxStatus,
              description: editTxDesc || t.description,
            }
          : t
      )
    );

    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminUser: "SuperAdmin [AUTH-ID-01]",
      actionType: "TX_APPROVAL",
      targetUser: selectedTx.userName,
      description: `Altered transaction ${selectedTx.referenceCode}: status set to ${editTxStatus}.`,
      reason: "Manual Transaction Status Override",
    };

    setAuditLogs((prev) => [log, ...prev]);
    setEditTxModalOpen(false);
    triggerToast(`Transaction ${selectedTx.referenceCode} updated.`);
  }

  // --- ACTIONS: INJECT MANUAL TRANSACTION ---
  function handleInjectTxSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(injectAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const targetUser = users.find((u) => u.id === injectUserId);
    const targetAccount = targetUser?.accounts.find((a) => a.id === injectAccountId);
    const delta = injectType === "CREDIT" ? amt : -amt;

    // Update user balance
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === injectUserId) {
          const updatedAccounts = u.accounts.map((acc) => {
            if (acc.id === injectAccountId) {
              return {
                ...acc,
                available: acc.available + delta,
                secondary: acc.secondary + delta,
              };
            }
            return acc;
          });
          return { ...u, accounts: updatedAccounts };
        }
        return u;
      })
    );

    // Create tx
    const newTx: AdminTransaction = {
      id: `tx-inj-${Date.now()}`,
      userId: injectUserId,
      userName: targetUser?.name || "Customer",
      accountId: injectAccountId,
      accountLabel: `${targetAccount?.name || "Account"} •••• ${targetAccount?.last4 || "0000"}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      description: injectDescription,
      category: injectCategory,
      amount: delta,
      status: "Completed",
      referenceCode: `WIRE-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Audit log
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminUser: "SuperAdmin [AUTH-ID-01]",
      actionType: "MANUAL_TX_INJECT",
      targetUser: targetUser?.name || "Customer",
      description: `Injected manual ${injectType} of ${formatCurrency(amt)} (${injectDescription}).`,
      reason: "Manual Wire / Settlement Posting",
    };

    setAuditLogs((prev) => [log, ...prev]);
    setInjectTxModalOpen(false);
    setInjectAmount("");
    triggerToast(`Manual ${injectType} of ${formatCurrency(amt)} posted successfully.`);
  }

  // --- AGGREGATE PLATFORM STATS ---
  const totalPlatformAssets = users.reduce((sum, u) => {
    return sum + u.accounts.reduce((accSum, acc) => accSum + acc.available, 0);
  }, 0);

  const totalActiveUsers = users.filter((u) => u.status === "Active").length;
  const totalFrozenUsers = users.filter((u) => u.status === "Frozen" || u.status === "Suspended").length;
  const totalFlaggedUsers = users.filter((u) => u.status === "Flagged").length;

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      userSearch === "" ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch);
    const matchStatus = userStatusFilter === "all" || u.status === userStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredTxs = transactions.filter((t) => {
    const matchSearch =
      txSearch === "" ||
      t.description.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.userName.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.referenceCode.toLowerCase().includes(txSearch.toLowerCase());
    const matchStatus = txStatusFilter === "all" || t.status === txStatusFilter;
    return matchSearch && matchStatus;
  });

  // --- PASSCODE GATE UI ---
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-850 to-brand-blue-deep px-4 py-12 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline">
              ← Return Home
            </Link>
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
              <ShieldAlert className="size-3.5" /> High Privilege Zone
            </span>
          </div>

          <div className="mt-6 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-orange/20 text-brand-orange">
              <KeyRound className="size-7" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Admin Control Center</h1>
            <p className="mt-1 text-xs text-slate-400">
              Enter the master security key or PIN to access user activity alteration & oversight tools.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Admin Master PIN
              </label>
              <input
                type="password"
                placeholder="Enter PIN (e.g. 1234)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-slate-800 px-4 py-3 text-center text-lg font-mono tracking-widest text-white outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            {passcodeError && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400">
                {passcodeError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-orange py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange/30 transition hover:bg-brand-orange-deep"
            >
              Authorize & Enter Portal
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quick Demonstration Bypass
            </span>
          </div>

          <button
            type="button"
            onClick={bypassAuth}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold text-white transition hover:bg-white/10"
          >
            <Sparkles className="size-4 text-brand-orange" />
            <span>Instant Admin Access (Bypass)</span>
          </button>
        </div>
      </div>
    );
  }

  // --- FULL ADMIN CONTROL PANEL UI ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-brand-orange/40 bg-slate-900 px-5 py-4 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <BankLogo className="[&_span]:!text-white [&_p]:!text-white" />
            </Link>
            <span className="hidden items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-red-400 sm:inline-flex">
              <ShieldAlert className="size-3.5" /> Master Administrator
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedUserForBalance(users[0]!);
                setSelectedAccountId(users[0]!.accounts[0]!.id);
                setBalanceModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-orange/20 transition hover:bg-brand-orange-deep"
            >
              <DollarSign className="size-3.5" />
              <span>Alter Balances</span>
            </button>

            <button
              onClick={() => setInjectTxModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
            >
              <PlusCircle className="size-3.5" />
              <span>Inject Wire / Tx</span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-400 transition hover:text-white"
            >
              Lock Console
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Console Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 space-y-8">
        {/* KPI Platform Overview */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Platform Assets</span>
              <Building2 className="size-4 text-brand-orange" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-white">{formatCurrency(totalPlatformAssets)}</p>
            <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="size-3" /> Live Managed Reserves
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Active Customers</span>
              <Users className="size-4 text-emerald-400" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-white">{totalActiveUsers}</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">
              {totalFrozenUsers} Frozen • {totalFlaggedUsers} Flagged
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">24h Transaction Volume</span>
              <ArrowLeftRight className="size-4 text-cyan-400" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-white">{formatCurrency(384120.0)}</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">{transactions.length} Total Processed</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">AML & Risk Alerts</span>
              <AlertTriangle className="size-4 text-amber-400" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-amber-400">2 Critical</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">Requires Admin Review</p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === "users"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="size-3.5" /> User Control Center ({users.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("balances")}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === "balances"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <DollarSign className="size-3.5" /> Balance Alteration Tool
              </span>
            </button>

            <button
              onClick={() => setActiveTab("transactions")}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === "transactions"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <ArrowLeftRight className="size-3.5" /> Transaction Ledger & Reversals ({transactions.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === "logs"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <History className="size-3.5" /> Audit Trail ({auditLogs.length})
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: USER CONTROL CENTER */}
        {activeTab === "users" && (
          <section className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Customer Account Directory</h2>
                <p className="text-xs text-slate-400">
                  Override KYC tiers, freeze accounts, inspect sub-accounts, and alter user balances.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name, email, phone…"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs font-medium text-white outline-none transition focus:border-brand-orange"
                  />
                </div>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-white outline-none transition focus:border-brand-orange"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Flagged">Flagged</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Customer / Identity</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">KYC Level</th>
                    <th className="px-5 py-3.5">Risk Rating</th>
                    <th className="px-5 py-3.5">Total Balances</th>
                    <th className="px-5 py-3.5">Sub-Accounts</th>
                    <th className="px-5 py-3.5 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredUsers.map((u) => {
                    const totalUserBalance = u.accounts.reduce((s, a) => s + a.available, 0);

                    return (
                      <tr key={u.id} className="transition hover:bg-slate-850/50">
                        <td className="px-5 py-4">
                          <div className="font-bold text-white text-sm">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">IP: {u.ipAddress}</div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              u.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : u.status === "Frozen"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : u.status === "Flagged"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {u.status === "Frozen" && <Lock className="size-3" />}
                            {u.status === "Active" && <Check className="size-3" />}
                            {u.status === "Flagged" && <AlertTriangle className="size-3" />}
                            {u.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-300">
                          {u.kycTier}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`font-bold ${
                              u.riskLevel === "Low"
                                ? "text-emerald-400"
                                : u.riskLevel === "Medium"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {u.riskLevel}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-extrabold text-white text-sm">
                          {formatCurrency(totalUserBalance)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            {u.accounts.map((acc) => (
                              <div key={acc.id} className="text-[11px] text-slate-400">
                                <span className="font-semibold text-slate-300">{acc.name}</span> (•••• {acc.last4}):{" "}
                                <span className="text-white font-mono">{formatCurrency(acc.available)}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedUserForBalance(u);
                                setSelectedAccountId(u.accounts[0]!.id);
                                setBalanceModalOpen(true);
                              }}
                              className="rounded-lg bg-brand-orange/10 px-3 py-1.5 text-xs font-bold text-brand-orange hover:bg-brand-orange hover:text-white transition"
                              title="Alter Balances"
                            >
                              Alter $
                            </button>

                            <button
                              onClick={() => toggleUserFreeze(u)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                u.status === "Frozen"
                                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                                  : "bg-slate-800 text-slate-300 hover:bg-red-500 hover:text-white"
                              }`}
                              title={u.status === "Frozen" ? "Unfreeze Account" : "Freeze Account"}
                            >
                              {u.status === "Frozen" ? "Unfreeze" : "Freeze"}
                            </button>

                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setEditKycTier(u.kycTier);
                                setEditRiskLevel(u.riskLevel);
                                setEditUserNotes(u.notes || "");
                                setEditUserModalOpen(true);
                              }}
                              className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                              title="Edit KYC / Risk Profile"
                            >
                              <Edit3 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: BALANCE & FINANCIAL ALTERATION */}
        {activeTab === "balances" && (
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Direct Balance Adjustment Panel */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <DollarSign className="size-5 text-brand-orange" />
                  Financial Balance Alteration Engine
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Credit or debit funds directly into customer checking, savings, credit, or investment accounts with audit documentation.
                </p>
              </div>

              <form onSubmit={handleAlterBalanceSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Target Customer
                    </label>
                    <select
                      value={selectedUserForBalance.id}
                      onChange={(e) => {
                        const userObj = users.find((u) => u.id === e.target.value);
                        if (userObj) {
                          setSelectedUserForBalance(userObj);
                          setSelectedAccountId(userObj.accounts[0]!.id);
                        }
                      }}
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-brand-orange"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Sub-Account
                    </label>
                    <select
                      value={selectedAccountId}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-brand-orange"
                    >
                      {selectedUserForBalance.accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} (•••• {acc.last4}) — Current: {formatCurrency(acc.available)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Action Type
                    </label>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAlterAction("CREDIT")}
                        className={`rounded-xl py-2.5 text-xs font-bold transition ${
                          alterAction === "CREDIT"
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                            : "bg-slate-950 text-slate-400 hover:text-white"
                        }`}
                      >
                        + Credit (Deposit)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAlterAction("DEBIT")}
                        className={`rounded-xl py-2.5 text-xs font-bold transition ${
                          alterAction === "DEBIT"
                            ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                            : "bg-slate-950 text-slate-400 hover:text-white"
                        }`}
                      >
                        - Debit (Withdraw)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Adjustment Amount (USD)
                    </label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        placeholder="1000.00"
                        value={alterAmount}
                        onChange={(e) => setAlterAmount(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-4 py-2.5 text-sm font-bold text-white outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Mandatory Audit Reason
                  </label>
                  <select
                    value={alterReason}
                    onChange={(e) => setAlterReason(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-brand-orange"
                  >
                    <option value="Administrative Correction">Administrative Correction</option>
                    <option value="Wire Settlement Funding">Wire Settlement Funding</option>
                    <option value="Fraud & Dispute Reimbursement">Fraud & Dispute Reimbursement</option>
                    <option value="Promotional Loyalty Bonus">Promotional Loyalty Bonus</option>
                    <option value="Fee Waiver / Correction">Fee Waiver / Correction</option>
                    <option value="Judicial / Court Order Adjustment">Judicial / Court Order Adjustment</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Administrative Memo / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Case #88491 - Approved by Chief Risk Officer"
                    value={alterCustomNote}
                    onChange={(e) => setAlterCustomNote(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white outline-none focus:border-brand-orange"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand-orange py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange/30 transition hover:bg-brand-orange-deep"
                >
                  Execute Balance Alteration
                </button>
              </form>
            </div>

            {/* Target User Account Snapshot */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Selected Customer Snapshot
              </h3>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-extrabold text-base text-white">{selectedUserForBalance.name}</p>
                <p className="text-xs text-slate-400">{selectedUserForBalance.email}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-400">{selectedUserForBalance.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sub-Account Balances</p>
                {selectedUserForBalance.accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className={`rounded-xl border p-3 transition ${
                      acc.id === selectedAccountId
                        ? "border-brand-orange/50 bg-brand-orange/10"
                        : "border-slate-800 bg-slate-950"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{acc.name}</span>
                      <span className="font-mono text-slate-400">•••• {acc.last4}</span>
                    </div>
                    <p className="mt-1 text-lg font-extrabold text-white">
                      {formatCurrency(acc.available)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: TRANSACTION LEDGER & REVERSAL CONTROL */}
        {activeTab === "transactions" && (
          <section className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Global Transaction Management</h2>
                <p className="text-xs text-slate-400">
                  Inspect, alter, approve, or execute chargebacks and reversals across all accounts.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setInjectTxModalOpen(true)}
                  className="rounded-xl bg-brand-orange px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-brand-orange/20 hover:bg-brand-orange-deep transition"
                >
                  + Manual Wire Injection
                </button>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search tx ID, merchant, user…"
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    className="rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs font-medium text-white outline-none focus:border-brand-orange"
                  />
                </div>

                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-brand-orange"
                >
                  <option value="all">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Reversed">Reversed</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Ref Code / Date</th>
                    <th className="px-5 py-3.5">Customer & Account</th>
                    <th className="px-5 py-3.5">Description / Merchant</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Alteration Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredTxs.map((t) => {
                    const isPositive = t.amount > 0;

                    return (
                      <tr key={t.id} className="transition hover:bg-slate-850/50">
                        <td className="px-5 py-4">
                          <div className="font-mono font-bold text-brand-orange text-[11px]">{t.referenceCode}</div>
                          <div className="text-[10px] text-slate-500">{t.date}</div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-bold text-white">{t.userName}</div>
                          <div className="text-[11px] text-slate-400">{t.accountLabel}</div>
                        </td>

                        <td className="px-5 py-4 font-medium text-white max-w-[220px] truncate">
                          {t.description}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                            {t.category}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-extrabold text-sm">
                          <span className={isPositive ? "text-emerald-400" : "text-white"}>
                            {isPositive ? "+" : ""}{formatCurrency(t.amount)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              t.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : t.status === "Pending"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : t.status === "Reversed"
                                ? "bg-purple-500/10 text-purple-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {t.status !== "Reversed" && (
                              <button
                                onClick={() => handleReversal(t)}
                                className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold text-purple-400 hover:bg-purple-500 hover:text-white transition"
                                title="Reverse transaction and refund balance"
                              >
                                Reverse
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedTx(t);
                                setEditTxStatus(t.status);
                                setEditTxDesc(t.description);
                                setEditTxModalOpen(true);
                              }}
                              className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                              title="Edit transaction details"
                            >
                              <Edit3 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === "logs" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Administrative Security Audit Trail</h2>
                <p className="text-xs text-slate-400">
                  Immutable chronological ledger of all customer account alterations and overrides.
                </p>
              </div>
              <button
                onClick={() => triggerToast("Audit logs exported to CSV & compliance format.")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
              >
                <Download className="size-3.5" /> Export Audit CSV
              </button>
            </div>

            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">{log.timestamp}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-brand-orange">
                        {log.actionType}
                      </span>
                      <span className="text-xs font-bold text-white">Target: {log.targetUser}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200">{log.description}</p>
                    <p className="text-[11px] text-slate-400">Reason: {log.reason}</p>
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-500 shrink-0">
                    By: {log.adminUser}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* MODAL: ALTER BALANCE */}
      {balanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-brand-orange/20 text-brand-orange">
                  <DollarSign className="size-5" />
                </div>
                <h3 className="text-xl font-extrabold">Alter Customer Balance</h3>
              </div>
              <button
                onClick={() => setBalanceModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAlterBalanceSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Customer
                </label>
                <p className="text-sm font-bold text-brand-orange mt-0.5">{selectedUserForBalance.name}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Account
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-brand-orange"
                >
                  {selectedUserForBalance.accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (•••• {acc.last4}) — Current: {formatCurrency(acc.available)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAlterAction("CREDIT")}
                  className={`rounded-xl py-3 text-xs font-bold transition ${
                    alterAction === "CREDIT"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-950 text-slate-400"
                  }`}
                >
                  + Credit Funds
                </button>
                <button
                  type="button"
                  onClick={() => setAlterAction("DEBIT")}
                  className={`rounded-xl py-3 text-xs font-bold transition ${
                    alterAction === "DEBIT"
                      ? "bg-red-500 text-white"
                      : "bg-slate-950 text-slate-400"
                  }`}
                >
                  - Debit Funds
                </button>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="500.00"
                  value={alterAmount}
                  onChange={(e) => setAlterAmount(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-base font-bold text-white outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Audit Reason
                </label>
                <select
                  value={alterReason}
                  onChange={(e) => setAlterReason(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-brand-orange"
                >
                  <option value="Administrative Correction">Administrative Correction</option>
                  <option value="Wire Settlement Funding">Wire Settlement Funding</option>
                  <option value="Fraud & Dispute Reimbursement">Fraud & Dispute Reimbursement</option>
                  <option value="Promotional Loyalty Bonus">Promotional Loyalty Bonus</option>
                  <option value="Fee Waiver / Correction">Fee Waiver / Correction</option>
                </select>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBalanceModalOpen(false)}
                  className="w-1/2 rounded-xl border border-slate-800 py-3 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-brand-orange py-3 text-xs font-bold text-white shadow-lg hover:bg-brand-orange-deep"
                >
                  Confirm Alteration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TRANSACTION */}
      {editTxModalOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Edit Transaction {selectedTx.referenceCode}</h3>
              <button onClick={() => setEditTxModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTxEdit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400">Customer</label>
                <p className="text-sm font-bold text-white">{selectedTx.userName}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400">Status Override</label>
                <select
                  value={editTxStatus}
                  onChange={(e) => setEditTxStatus(e.target.value as AdminTransaction["status"])}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white"
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Declined">Declined</option>
                  <option value="Reversed">Reversed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400">Description / Memo</label>
                <input
                  type="text"
                  value={editTxDesc}
                  onChange={(e) => setEditTxDesc(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditTxModalOpen(false)}
                  className="w-1/2 rounded-xl border border-slate-800 py-3 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-brand-orange py-3 text-xs font-bold text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INJECT TRANSACTION / WIRE */}
      {injectTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="size-5 text-brand-orange" />
                <h3 className="text-xl font-extrabold">Inject Manual Wire / Transaction</h3>
              </div>
              <button onClick={() => setInjectTxModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleInjectTxSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400">Customer</label>
                <select
                  value={injectUserId}
                  onChange={(e) => {
                    setInjectUserId(e.target.value);
                    const u = users.find((x) => x.id === e.target.value);
                    if (u) setInjectAccountId(u.accounts[0]!.id);
                  }}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400">Sub-Account</label>
                <select
                  value={injectAccountId}
                  onChange={(e) => setInjectAccountId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white"
                >
                  {users.find((u) => u.id === injectUserId)?.accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (•••• {acc.last4})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInjectType("CREDIT")}
                  className={`rounded-xl py-2.5 text-xs font-bold ${
                    injectType === "CREDIT" ? "bg-emerald-500 text-white" : "bg-slate-950 text-slate-400"
                  }`}
                >
                  + Inbound Deposit / Wire
                </button>
                <button
                  type="button"
                  onClick={() => setInjectType("DEBIT")}
                  className={`rounded-xl py-2.5 text-xs font-bold ${
                    injectType === "DEBIT" ? "bg-red-500 text-white" : "bg-slate-950 text-slate-400"
                  }`}
                >
                  - Outbound Wire / Debit
                </button>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400">Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="5000.00"
                  value={injectAmount}
                  onChange={(e) => setInjectAmount(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-base font-bold text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400">Transaction Description</label>
                <input
                  type="text"
                  required
                  value={injectDescription}
                  onChange={(e) => setInjectDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setInjectTxModalOpen(false)}
                  className="w-1/2 rounded-xl border border-slate-800 py-3 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-brand-orange py-3 text-xs font-bold text-white"
                >
                  Post Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER KYC & RISK */}
      {editUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Edit Profile: {editingUser.name}</h3>
              <button onClick={() => setEditUserModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdits} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400">KYC Verification Tier</label>
                <select
                  value={editKycTier}
                  onChange={(e) => setEditKycTier(e.target.value as KycTier)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white"
                >
                  <option value="Tier 1 (Basic)">Tier 1 (Basic)</option>
                  <option value="Tier 2 (Verified)">Tier 2 (Verified)</option>
                  <option value="Tier 3 (Enhanced)">Tier 3 (Enhanced)</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400">Risk Assessment Rating</label>
                <select
                  value={editRiskLevel}
                  onChange={(e) => setEditRiskLevel(e.target.value as RiskLevel)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Critical">Critical Risk (Freeze Recommended)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400">Administrative Notes</label>
                <textarea
                  rows={3}
                  value={editUserNotes}
                  onChange={(e) => setEditUserNotes(e.target.value)}
                  placeholder="Add compliance notes or reason for risk rating change..."
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white outline-none focus:border-brand-orange"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditUserModalOpen(false)}
                  className="w-1/2 rounded-xl border border-slate-800 py-3 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-brand-orange py-3 text-xs font-bold text-white"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
