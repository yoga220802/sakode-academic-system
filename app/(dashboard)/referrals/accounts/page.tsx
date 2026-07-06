/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";

interface ReferrerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  pendingPayout: number;
  totalPaid: number;
  codesCount: number;
}

interface AssociatedCode {
  code: string;
  programId: string;
  programName: string;
  status: "active" | "suspended" | "exhausted";
  used: number;
  limit: number | "unlimited";
}

interface PayoutTransaction {
  id: string;
  amount: number;
  date: string;
  status: "success" | "pending" | "rejected";
  referenceCode?: string;
}

export default function ReferrerAccountsPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  // 1. Simulation States
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");

  // Selection states
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>("REF-ACC-001");

  // Modals & form states
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLinkCodeOpen, setIsLinkCodeOpen] = useState(false);
  const [isProcessPayoutOpen, setIsProcessPayoutOpen] = useState<{ transaction: PayoutTransaction } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form input states
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    phone: "",
    bankName: "Bank BCA",
    accountNumber: "",
    accountHolder: ""
  });

  const [linkCodeForm, setLinkCodeForm] = useState({
    code: "",
    programId: "REF-PRG-001",
    limit: "unlimited",
    limitValue: 50
  });

  // Mock program options to link codes
  const mockPrograms = [
    { id: "REF-PRG-001", name: "Program Rujukan Alumni SAKODE" },
    { id: "REF-PRG-002", name: "Partnership Kampus Merdeka IT" },
    { id: "REF-PRG-003", name: "Referral Influencer TikTok & IG" }
  ];

  // 2. Mock Databases (Recreated Reactively based on Simulation States)
  const [accounts, setAccounts] = useState<ReferrerAccount[]>([]);
  const [associatedCodes, setAssociatedCodes] = useState<Record<string, AssociatedCode[]>>({});
  const [payouts, setPayouts] = useState<Record<string, PayoutTransaction[]>>({});

  // Sync simulation scenario states
  useEffect(() => {
    const baseAccounts: ReferrerAccount[] = [
      {
        id: "REF-ACC-001",
        name: "Akbar Ramadhan",
        email: "akbar.ramadhan@gmail.com",
        phone: "+62 812-3456-7890",
        bankName: "Bank BCA",
        accountNumber: "8801234567",
        accountHolder: "Akbar Ramadhan",
        pendingPayout: 750000,
        totalPaid: 4500000,
        codesCount: 2
      },
      {
        id: "REF-ACC-002",
        name: "Yoga Pratama",
        email: "yoga.pratama@yahoo.com",
        phone: "+62 899-8877-6655",
        bankName: "Bank Mandiri",
        accountNumber: "1370001234567",
        accountHolder: "Yoga Pratama",
        pendingPayout: 500000,
        totalPaid: 3000000,
        codesCount: 1
      },
      {
        id: "REF-ACC-003",
        name: "Amanda Partner",
        email: "amanda.partner@outlook.com",
        phone: "+62 857-1122-3344",
        bankName: "Bank BNI",
        accountNumber: "0991234567",
        accountHolder: "Amanda Partner PT",
        pendingPayout: 250000,
        totalPaid: 1500000,
        codesCount: 1
      }
    ];

    const baseCodes: Record<string, AssociatedCode[]> = {
      "REF-ACC-001": [
        { code: "AKBAR26", programId: "REF-PRG-001", programName: "Program Rujukan Alumni SAKODE", status: "active", used: 15, limit: 50 },
        { code: "AKBARNEXT", programId: "REF-PRG-002", programName: "Partnership Kampus Merdeka IT", status: "active", used: 3, limit: "unlimited" }
      ],
      "REF-ACC-002": [
        { code: "YOGA22", programId: "REF-PRG-003", programName: "Referral Influencer TikTok & IG", status: "active", used: 12, limit: 20 }
      ],
      "REF-ACC-003": [
        { code: "AMANDADEV", programId: "REF-PRG-001", programName: "Program Rujukan Alumni SAKODE", status: "active", used: 5, limit: 10 }
      ]
    };

    const basePayouts: Record<string, PayoutTransaction[]> = {
      "REF-ACC-001": [
        { id: "TX-PAY-101", amount: 750000, date: "14 Mar 2026 10:00", status: "pending" },
        { id: "TX-PAY-100", amount: 2000000, date: "01 Mar 2026 15:30", status: "success", referenceCode: "REF-BCA-99212" },
        { id: "TX-PAY-099", amount: 2500000, date: "10 Feb 2026 09:12", status: "success", referenceCode: "REF-BCA-98124" }
      ],
      "REF-ACC-002": [
        { id: "TX-PAY-201", amount: 500000, date: "13 Mar 2026 11:22", status: "pending" },
        { id: "TX-PAY-200", amount: 3000000, date: "15 Feb 2026 14:00", status: "success", referenceCode: "REF-MDR-88219" }
      ],
      "REF-ACC-003": [
        { id: "TX-PAY-301", amount: 250000, date: "12 Mar 2026 16:45", status: "pending" },
        { id: "TX-PAY-300", amount: 1500000, date: "05 Feb 2026 10:15", status: "success", referenceCode: "REF-BNI-11234" }
      ]
    };

    if (simulationState === "loading") {
      setAccounts([]);
      setAssociatedCodes({});
      setPayouts({});
    } else if (simulationState === "empty") {
      setAccounts([]);
      setAssociatedCodes({});
      setPayouts({});
    } else {
      setAccounts(baseAccounts);
      setAssociatedCodes(baseCodes);
      setPayouts(basePayouts);
    }
  }, [simulationState]);

  // Handle toast timers
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Selection Derived State
  const selectedAccount = useMemo(() => {
    if (!selectedAccountId) return null;
    return accounts.find(a => a.id === selectedAccountId) || null;
  }, [accounts, selectedAccountId]);

  // Filters & Search Evaluation
  const filteredAccounts = useMemo(() => {
    if (simulationState === "empty" || simulationState === "loading") return [];
    return accounts.filter(item => {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [accounts, searchQuery, simulationState]);

  // Total summary metrics
  const metrics = useMemo(() => {
    if (simulationState === "empty" || simulationState === "loading") {
      return { totalAccounts: 0, pending: 0, paid: 0, conversions: 0 };
    }
    const totalAccounts = accounts.length;
    const pending = accounts.reduce((acc, curr) => acc + curr.pendingPayout, 0);
    const paid = accounts.reduce((acc, curr) => acc + curr.totalPaid, 0);
    const conversions = 36;
    return { totalAccounts, pending, paid, conversions };
  }, [accounts, simulationState]);

  // CRUD & Action Handlers
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountForm.name || !accountForm.email) return;

    const newAcc: ReferrerAccount = {
      id: `REF-ACC-00${accounts.length + 1}`,
      name: accountForm.name,
      email: accountForm.email,
      phone: accountForm.phone || "-",
      bankName: accountForm.bankName,
      accountNumber: accountForm.accountNumber || "-",
      accountHolder: accountForm.accountHolder || accountForm.name,
      pendingPayout: 0,
      totalPaid: 0,
      codesCount: 0
    };

    setAccounts(prev => [...prev, newAcc]);
    setAssociatedCodes(prev => ({ ...prev, [newAcc.id]: [] }));
    setPayouts(prev => ({ ...prev, [newAcc.id]: [] }));

    setIsCreateAccountOpen(false);
    resetAccountForm();
    setToastMessage({
      type: "success",
      text: `Akun pemilik referral "${newAcc.name}" berhasil didaftarkan.`
    });
  };

  const handleEditAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !accountForm.name) return;

    setAccounts(prev => prev.map(a => a.id === selectedAccountId ? {
      ...a,
      name: accountForm.name,
      email: accountForm.email,
      phone: accountForm.phone,
      bankName: accountForm.bankName,
      accountNumber: accountForm.accountNumber,
      accountHolder: accountForm.accountHolder
    } : a));

    setIsEditAccountOpen(false);
    resetAccountForm();
    setToastMessage({
      type: "success",
      text: "Profil akun pemilik referral berhasil diperbarui."
    });
  };

  const handleDeleteAccount = () => {
    if (!selectedAccountId) return;
    const accName = selectedAccount?.name;

    setAccounts(prev => prev.filter(a => a.id !== selectedAccountId));
    setSelectedAccountId(null);
    setIsDeleteConfirmOpen(false);
    setToastMessage({
      type: "success",
      text: `Akun pemilik referral "${accName}" berhasil dihapus dari sistem.`
    });
  };

  const handleLinkCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !linkCodeForm.code) return;

    const codeStr = linkCodeForm.code.toUpperCase().replace(/\s+/g, "");

    const allCodes = Object.values(associatedCodes).flat();
    if (allCodes.some(c => c.code === codeStr)) {
      setToastMessage({
        type: "error",
        text: `Kode "${codeStr}" sudah terdaftar di sistem!`
      });
      return;
    }

    const matchedPrg = mockPrograms.find(p => p.id === linkCodeForm.programId);
    const newAssocCode: AssociatedCode = {
      code: codeStr,
      programId: linkCodeForm.programId,
      programName: matchedPrg ? matchedPrg.name : "Custom Program",
      status: "active",
      used: 0,
      limit: linkCodeForm.limit === "unlimited" ? "unlimited" : linkCodeForm.limitValue
    };

    setAssociatedCodes(prev => ({
      ...prev,
      [selectedAccountId]: [...(prev[selectedAccountId] || []), newAssocCode]
    }));

    setAccounts(prev => prev.map(a => a.id === selectedAccountId ? { ...a, codesCount: a.codesCount + 1 } : a));

    setIsLinkCodeOpen(false);
    setLinkCodeForm({
      code: "",
      programId: "REF-PRG-001",
      limit: "unlimited",
      limitValue: 50
    });
    setToastMessage({
      type: "success",
      text: `Kode referral "${codeStr}" berhasil didaftarkan untuk program "${newAssocCode.programName}".`
    });
  };

  const handleProcessPayout = (status: "success" | "rejected", refCode?: string) => {
    if (!isProcessPayoutOpen || !selectedAccountId) return;
    const targetTx = isProcessPayoutOpen.transaction;

    setPayouts(prev => {
      const userPayouts = prev[selectedAccountId] || [];
      return {
        ...prev,
        [selectedAccountId]: userPayouts.map(p => p.id === targetTx.id ? { 
          ...p, 
          status, 
          referenceCode: refCode || "-"
        } : p)
      };
    });

    if (status === "success") {
      setAccounts(prev => prev.map(a => {
        if (a.id === selectedAccountId) {
          return {
            ...a,
            totalPaid: a.totalPaid + targetTx.amount,
            pendingPayout: Math.max(0, a.pendingPayout - targetTx.amount)
          };
        }
        return a;
      }));
    }

    setIsProcessPayoutOpen(null);
    setToastMessage({
      type: "success",
      text: status === "success" 
        ? `Permintaan pencairan Rp ${targetTx.amount.toLocaleString("id-ID")} disetujui.` 
        : `Permintaan pencairan Rp ${targetTx.amount.toLocaleString("id-ID")} ditolak.`
    });
  };

  const resetAccountForm = () => {
    setAccountForm({
      name: "",
      email: "",
      phone: "",
      bankName: "Bank BCA",
      accountNumber: "",
      accountHolder: ""
    });
  };

  const openEditModal = () => {
    if (!selectedAccount) return;
    setAccountForm({
      name: selectedAccount.name,
      email: selectedAccount.email,
      phone: selectedAccount.phone,
      bankName: selectedAccount.bankName,
      accountNumber: selectedAccount.accountNumber,
      accountHolder: selectedAccount.accountHolder
    });
    setIsEditAccountOpen(true);
  };

  const getSubElementClass = (type: "divider" | "inner-card" | "timeline-dot" | "timeline-line") => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "divider") return "h-[2px] bg-zinc-900 dark:bg-white w-full my-1";
        if (type === "inner-card") return "p-3.5 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
        return "";
        
      case "claymorphism":
        if (type === "divider") return "h-px bg-slate-200/60 dark:bg-zinc-800/60 w-full my-1";
        if (type === "inner-card") return "p-3.5 bg-slate-50 dark:bg-zinc-905/50 border border-slate-200/20 dark:border-zinc-700/20 rounded-2xl shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.05)]";
        return "";

      case "glassmorphism":
      case "liquid-glass":
        if (type === "divider") return "h-px bg-white/10 dark:bg-white/5 w-full my-1";
        if (type === "inner-card") return "p-3.5 bg-white/10 dark:bg-zinc-900/40 border border-white/20 dark:border-white/10 backdrop-blur-xs rounded-xl";
        return "";

      case "minimalism":
        if (type === "divider") return "h-px bg-zinc-200/40 dark:bg-zinc-800/40 w-full my-1";
        if (type === "inner-card") return "p-3 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/40 dark:border-zinc-850/40 rounded-lg";
        return "";

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "divider") return "h-px bg-zinc-200/60 dark:bg-zinc-800/80 w-full my-1";
        if (type === "inner-card") return "p-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800 rounded-xl";
        return "";
    }
  };

  const getCloseButtonClass = () => {
    const base = "p-1.5 transition-all cursor-pointer ";
    switch (selectedStyle) {
      case "neobrutalism":
        return base + "border-2 border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 hover:bg-zinc-100 rounded-none shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:shadow-[1px_1px_0px_rgba(255,255,255,1)] text-zinc-900 dark:text-white";
      case "claymorphism":
        return base + "bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200/50 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)] text-zinc-500 dark:text-zinc-300";
      case "glassmorphism":
      case "liquid-glass":
        return base + "bg-white/10 dark:bg-zinc-900/30 border border-white/20 dark:border-white/10 rounded-full backdrop-blur-xs hover:bg-white/20 text-zinc-400 dark:text-zinc-200";
      case "minimalism":
        return base + "hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm text-zinc-400 dark:text-zinc-450";
      case "bento-grid":
      case "sakode-modern":
      default:
        return base + "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-500 dark:text-zinc-300";
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full text-left font-sans pb-16">
      
      {/* 1. Page Title Header & Simulation Switcher */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-300 font-semibold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Referral</span>
            <span>/</span>
            <span>Akun</span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-3.5 mt-1 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <Link 
              href="/referrals"
              className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-250"
            >
              Kampanye Rujukan
            </Link>
            <span className="text-zinc-300 dark:text-zinc-800">|</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white border-b-2 border-sakode-blue pb-2 -mb-2.5">
              Akun Pemilik Referral
            </span>
          </div>
        </div>

        {/* Dynamic Simulation Scenarios Selector */}
        <div className="flex flex-wrap gap-1.5 items-center bg-zinc-100/80 dark:bg-zinc-805 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 z-20">
          <span className="text-[9px] text-zinc-500 dark:text-zinc-300 font-bold uppercase tracking-wider pl-2 pr-1.5">Simulasi:</span>
          {[
            { id: "default" as const, label: "Default" },
            { id: "loading" as const, label: "Loading" },
            { id: "empty" as const, label: "Empty" },
            { id: "error" as const, label: "Error" }
          ].map(state => (
            <button
              key={state.id}
              onClick={() => { setSimulationState(state.id); setSelectedAccountId(state.id === "empty" ? null : "REF-ACC-001"); }}
              className={`px-2.5 py-1 text-[9.5px] font-bold rounded-lg transition-colors cursor-pointer ${simulationState === state.id ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Akun Referrer", value: metrics.totalAccounts, suffix: " Akun", color: selectedColor },
          { label: "Komisi Pending", value: `Rp ${metrics.pending.toLocaleString("id-ID")}`, color: "purple" as const },
          { label: "Total Cair (Paid)", value: `Rp ${metrics.paid.toLocaleString("id-ID")}`, color: "green" as const },
          { label: "Atribusi Sukses", value: metrics.conversions, suffix: " Siswa", color: "orange" as const }
        ].map((m, idx) => (
          <UI.Card key={idx} accentColor={m.color}>
            <div className="p-4 flex flex-col gap-1.5 justify-start text-left relative overflow-hidden">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-350 uppercase tracking-wider">
                {m.label}
              </span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none mt-1">
                {simulationState === "loading" ? "..." : `${m.value}${m.suffix || ""}`}
              </span>
            </div>
          </UI.Card>
        ))}
      </div>

      {/* 3. Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Referrer Accounts List */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <UI.Card accentColor={selectedColor}>
            <div className="p-5 flex flex-col gap-5">
              
              {/* Tool bar & search filters */}
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-center gap-3">
                  <h2 className="text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wider">
                    Daftar Akun Referrer
                  </h2>
                  <UI.Button
                    variant="primary"
                    accentColor={selectedColor}
                    onClick={() => { resetAccountForm(); setIsCreateAccountOpen(true); }}
                    className="text-[10.5px]! py-1.5! px-3! h-auto! font-bold! cursor-pointer flex items-center gap-1.5"
                  >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    Tambah Akun
                  </UI.Button>
                </div>

                <div className="relative flex items-center">
                  <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                  <UI.Input
                    type="text"
                    placeholder="Cari nama, email, bank..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    accentColor={selectedColor}
                    className="pl-10! text-xs! py-2!"
                  />
                </div>
              </div>

              {/* Data State boundaries */}
              {simulationState === "loading" ? (
                // 3.1 Loading list
                <div className="flex flex-col gap-3 py-4">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col gap-2.5 p-4 border border-zinc-150 dark:border-zinc-800 rounded-2xl animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="h-4.5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                        <div className="h-4.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                      </div>
                      <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-800 rounded-md mt-1" />
                      <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                      <div className="flex justify-between items-center">
                        <div className="h-3.5 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                        <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : simulationState === "error" ? (
                // 3.2 Error list
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
                    <Icons.AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    Gagal Memuat Akun Referrer
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-4">
                    Sistem gagal terhubung dengan database. Silakan muat ulang.
                  </p>
                  <UI.Button 
                    variant="secondary" 
                    accentColor="red" 
                    onClick={() => setSimulationState("default")}
                    className="text-xs! py-1.5! px-4! cursor-pointer"
                  >
                    Muat Ulang
                  </UI.Button>
                </div>
              ) : filteredAccounts.length === 0 ? (
                // 3.3 Empty list
                <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-805 flex items-center justify-center text-zinc-400 mb-4">
                    <Icons.Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-855 dark:text-zinc-200 mb-1">
                    Tidak Ada Akun Referrer
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                    Belum ada akun rujukan terdaftar di sistem.
                  </p>
                </div>
              ) : (
                // 3.4 Loaded list
                <div className="flex flex-col gap-3">
                  {filteredAccounts.map((acc) => {
                    const isSelected = selectedAccountId === acc.id;
                    return (
                      <div
                        key={acc.id}
                        onClick={() => setSelectedAccountId(acc.id)}
                        className={`p-4 border rounded-2xl transition-all duration-200 cursor-pointer flex flex-col gap-3 relative overflow-hidden group ${
                          isSelected 
                            ? "bg-zinc-50/80 dark:bg-zinc-800/40 border-sakode-blue dark:border-sakode-blue/80 shadow-3xs" 
                            : "bg-transparent hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-zinc-200/60 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        {/* Name and ID */}
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="text-xs font-bold text-zinc-805 dark:text-zinc-100 leading-snug">
                              {acc.name}
                            </h3>
                            <span className="text-[9px] font-mono text-zinc-400 mt-0.5 block">{acc.email}</span>
                          </div>
                          <UI.Badge variant="accent" accentColor="purple" className="text-[9px]! font-medium! px-2! py-0.5!">
                            {acc.codesCount} Kode
                          </UI.Badge>
                        </div>

                        <div className={getSubElementClass("divider")} />

                        {/* Bottom stats row */}
                        <div className="flex justify-between items-center text-[10px] font-medium text-zinc-550 dark:text-zinc-400">
                          <span>Payout: {acc.bankName}</span>
                          <span className="text-zinc-800 dark:text-zinc-200">
                            Komisi Pending: <strong className="font-bold text-purple-600 dark:text-purple-400 font-sans">Rp {acc.pendingPayout.toLocaleString("id-ID")}</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </UI.Card>
        </div>

        {/* Right column: Selected Referrer Account Details, Payouts, and Associated Codes */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {!selectedAccount ? (
              // 4.1 Fallback placeholder
              <motion.div
                key="no-selection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <UI.Card accentColor={selectedColor}>
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-4 py-24">
                    <div className={`w-12 h-12 rounded-full ${getBgOpacity10Class(selectedColor)} flex items-center justify-center ${getTextClass(selectedColor)}`}>
                      <Icons.User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                        Detail Akun Referrer
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-1">
                        Pilih salah satu akun pemilik referral di sebelah kiri untuk mengelola data payout rekening, daftar rujukan aktif, serta riwayat penarikan komisi.
                      </p>
                    </div>
                  </div>
                </UI.Card>
              </motion.div>
            ) : (
              // 4.2 Detailed referrer account workspace view
              <motion.div
                key={selectedAccount.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full"
              >
                <UI.Card accentColor={selectedColor}>
                  <div className="p-5 flex flex-col gap-5 text-left relative">
                    
                    {/* Header: Name, Edit actions, Close */}
                    <div className="flex justify-between items-start border-b border-zinc-150 dark:border-zinc-850 pb-4">
                      <div>
                        <UI.Badge variant="accent" accentColor={selectedColor} className="font-mono text-[9px]! px-2! py-0.5!">
                          {selectedAccount.id}
                        </UI.Badge>
                        <h2 className="text-base font-bold text-zinc-900 dark:text-white mt-1.5 leading-snug">
                          {selectedAccount.name}
                        </h2>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-300 block mt-1">
                          Kontak: {selectedAccount.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UI.Button
                          variant="secondary"
                          accentColor={selectedColor}
                          onClick={openEditModal}
                          className="text-[10.5px]! py-1! px-2.5! h-auto! font-bold! cursor-pointer"
                        >
                          Edit
                        </UI.Button>
                        <UI.Button
                          variant="secondary"
                          accentColor="red"
                          onClick={() => setIsDeleteConfirmOpen(true)}
                          className="text-[10.5px]! py-1! px-2.5! h-auto! font-bold! cursor-pointer"
                        >
                          Hapus
                        </UI.Button>
                        <button
                          onClick={() => setSelectedAccountId(null)}
                          className={getCloseButtonClass()}
                          aria-label="Tutup Workspace"
                          title="Tutup Workspace"
                        >
                          <Icons.X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section A: Payout Destination Bank details */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
                        Informasi Tujuan Payout & Rekening
                      </h4>
                      <div className={getSubElementClass("inner-card")}>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[9.5px] text-zinc-450 dark:text-zinc-400 block">Bank / E-Wallet</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-100">{selectedAccount.bankName}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-zinc-455 dark:text-zinc-400 block">Nomor Rekening</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-100">{selectedAccount.accountNumber}</span>
                          </div>
                          <div className="col-span-2 border-t border-dashed border-zinc-200/50 dark:border-zinc-800/80 pt-2">
                            <span className="text-[9.5px] text-zinc-450 dark:text-zinc-400 block">Atas Nama Pemilik</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-100">{selectedAccount.accountHolder}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={getSubElementClass("divider")} />

                    {/* Section B: Referral Code Associated with Account */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
                          Kode Referral Asosiasi
                        </h4>
                        <button
                          onClick={() => {
                            setLinkCodeForm({
                              code: "",
                              programId: "REF-PRG-001",
                              limit: "unlimited",
                              limitValue: 50
                            });
                            setIsLinkCodeOpen(true);
                          }}
                          className={`text-[9.5px] font-bold ${getTextClass(selectedColor)} hover:underline cursor-pointer flex items-center gap-1`}
                        >
                          <Icons.Plus className="w-3 h-3" />
                          Hubungkan Kode Baru
                        </button>
                      </div>

                      {/* Associated Codes list */}
                      {(!associatedCodes[selectedAccount.id] || associatedCodes[selectedAccount.id].length === 0) ? (
                        <div className="text-center py-6 px-4 bg-zinc-50 dark:bg-zinc-900/10 border border-dashed border-zinc-200/60 dark:border-zinc-800 rounded-xl text-xs text-zinc-400">
                          Belum ada kode referral yang diasosiasikan untuk akun ini.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          {associatedCodes[selectedAccount.id].map((c, cIdx) => (
                            <div
                              key={cIdx}
                              className={`${getSubElementClass("inner-card")} flex flex-col gap-1.5`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-mono font-black text-sm text-zinc-900 dark:text-white">{c.code}</span>
                                <span className="text-[9.5px] text-zinc-450 dark:text-zinc-400 font-sans">
                                  Penggunaan: <strong className="font-bold text-zinc-700 dark:text-zinc-200">{c.used} / {c.limit}</strong>
                                </span>
                              </div>
                              <div className="text-[10px] text-zinc-505 dark:text-zinc-400 mt-0.5">
                                Program: <strong className="text-zinc-700 dark:text-zinc-300 font-bold">{c.programName}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={getSubElementClass("divider")} />

                    {/* Section C: Payout Penarikan History & Processing */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
                        Riwayat Payout & Pencairan Komisi
                      </h4>

                      {(!payouts[selectedAccount.id] || payouts[selectedAccount.id].length === 0) ? (
                        <div className="text-center py-6 px-4 bg-zinc-50 dark:bg-zinc-900/10 border border-dashed border-zinc-200/60 dark:border-zinc-800 rounded-xl text-xs text-zinc-400">
                          Belum ada transaksi payout untuk pemilik referral ini.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          {payouts[selectedAccount.id].map((tx) => (
                            <div
                              key={tx.id}
                              className={`${getSubElementClass("inner-card")} flex items-center justify-between gap-3 text-xs font-medium`}
                            >
                              <div className="text-left">
                                <span className="font-bold text-zinc-808 dark:text-zinc-100 block">
                                  Rp {tx.amount.toLocaleString("id-ID")}
                                </span>
                                <span className="text-[9.5px] text-zinc-450 dark:text-zinc-400 block mt-0.5">
                                  {tx.date}
                                </span>
                                {tx.referenceCode && (
                                  <span className="text-[9px] font-mono text-zinc-400 block mt-0.5">
                                    Ref: {tx.referenceCode}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                {tx.status === "pending" ? (
                                  <div className="flex items-center gap-1.5">
                                    <UI.Badge variant="warning" accentColor="orange" className="text-[8.5px]! py-0 px-1.5!">Pending</UI.Badge>
                                    <button
                                      onClick={() => setIsProcessPayoutOpen({ transaction: tx })}
                                      className={`text-[10px] font-bold ${getTextClass(selectedColor)} hover:underline cursor-pointer`}
                                    >
                                      Proses
                                    </button>
                                  </div>
                                ) : tx.status === "success" ? (
                                  <UI.Badge variant="success" accentColor="green" className="text-[8.5px]! py-0 px-1.5!">Sukses</UI.Badge>
                                ) : (
                                  <UI.Badge variant="accent" accentColor="red" className="text-[8.5px]! py-0 px-1.5!">Ditolak</UI.Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </UI.Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 4. MODALS & FORMS MOCKS */}

      {/* 4.1 Create Referrer Account Modal */}
      <AnimatePresence>
        {isCreateAccountOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleCreateAccount} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-200">
                      Tambah Akun Referrer Baru
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setIsCreateAccountOpen(false)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-zinc-705 dark:text-zinc-300">Nama Lengkap Pemilik</label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: Akbar Ramadhan"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                        accentColor={selectedColor}
                        required
                        className="text-xs! py-2!"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Email Utama</label>
                        <UI.Input
                          type="email"
                          placeholder="akbar@mail.com"
                          value={accountForm.email}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                          accentColor={selectedColor}
                          required
                          className="text-xs! py-2!"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Nomor HP</label>
                        <UI.Input
                          type="tel"
                          placeholder="+62 81..."
                          value={accountForm.phone}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, phone: e.target.value }))}
                          accentColor={selectedColor}
                          className="text-xs! py-2!"
                        />
                      </div>
                    </div>

                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1 w-full" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Metode Rekening Payout</span>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Bank / Provider</label>
                        <div className="relative">
                          <UI.Select
                            value={accountForm.bankName}
                            onChange={(e) => setAccountForm(prev => ({ ...prev, bankName: e.target.value }))}
                            accentColor={selectedColor}
                            className="text-xs! py-2! pr-8! pl-3!"
                          >
                            <option value="Bank BCA">Bank BCA</option>
                            <option value="Bank Mandiri">Bank Mandiri</option>
                            <option value="Bank BNI">Bank BNI</option>
                            <option value="Bank BRI">Bank BRI</option>
                            <option value="GoPay E-Wallet">GoPay E-Wallet</option>
                            <option value="OVO E-Wallet">OVO E-Wallet</option>
                          </UI.Select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400 dark:text-zinc-500">
                            <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Nomor Rekening</label>
                        <UI.Input
                          type="text"
                          placeholder="contoh: 880123..."
                          value={accountForm.accountNumber}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                          accentColor={selectedColor}
                          className="text-xs! py-2!"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-zinc-755 dark:text-zinc-300">Nama Pemilik Rekening</label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: Akbar Ramadhan (Sesuai Bank)"
                        value={accountForm.accountHolder}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, accountHolder: e.target.value }))}
                        accentColor={selectedColor}
                        className="text-xs! py-2!"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button 
                      variant="secondary" 
                      accentColor={selectedColor} 
                      onClick={() => setIsCreateAccountOpen(false)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button 
                      type="submit"
                      variant="primary" 
                      accentColor={selectedColor} 
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Simpan Akun
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.2 Edit Referrer Account Modal */}
      <AnimatePresence>
        {isEditAccountOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleEditAccount} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-200">
                      Ubah Data Akun Referrer
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setIsEditAccountOpen(false)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-zinc-705 dark:text-zinc-300">Nama Lengkap Pemilik</label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: Akbar Ramadhan"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                        accentColor={selectedColor}
                        required
                        className="text-xs! py-2!"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Email Utama</label>
                        <UI.Input
                          type="email"
                          placeholder="akbar@mail.com"
                          value={accountForm.email}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                          accentColor={selectedColor}
                          required
                          className="text-xs! py-2!"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Nomor HP</label>
                        <UI.Input
                          type="tel"
                          placeholder="+62 81..."
                          value={accountForm.phone}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, phone: e.target.value }))}
                          accentColor={selectedColor}
                          className="text-xs! py-2!"
                        />
                      </div>
                    </div>

                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1 w-full" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Metode Rekening Payout</span>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Bank / Provider</label>
                        <div className="relative">
                          <UI.Select
                            value={accountForm.bankName}
                            onChange={(e) => setAccountForm(prev => ({ ...prev, bankName: e.target.value }))}
                            accentColor={selectedColor}
                            className="text-xs! py-2! pr-8! pl-3!"
                          >
                            <option value="Bank BCA">Bank BCA</option>
                            <option value="Bank Mandiri">Bank Mandiri</option>
                            <option value="Bank BNI">Bank BNI</option>
                            <option value="Bank BRI">Bank BRI</option>
                            <option value="GoPay E-Wallet">GoPay E-Wallet</option>
                            <option value="OVO E-Wallet">OVO E-Wallet</option>
                          </UI.Select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400 dark:text-zinc-500">
                            <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Nomor Rekening</label>
                        <UI.Input
                          type="text"
                          placeholder="contoh: 880123..."
                          value={accountForm.accountNumber}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                          accentColor={selectedColor}
                          className="text-xs! py-2!"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-zinc-755 dark:text-zinc-300">Nama Pemilik Rekening</label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: Akbar Ramadhan"
                        value={accountForm.accountHolder}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, accountHolder: e.target.value }))}
                        accentColor={selectedColor}
                        className="text-xs! py-2!"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button 
                      variant="secondary" 
                      accentColor={selectedColor} 
                      onClick={() => setIsEditAccountOpen(false)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button 
                      type="submit"
                      variant="primary" 
                      accentColor={selectedColor} 
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Simpan Perubahan
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.3 Delete Account Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative"
            >
              <UI.Card accentColor="red">
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600">
                      Konfirmasi Hapus Akun
                    </h3>
                    <button 
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5 py-1 text-xs">
                    <p className="font-semibold text-zinc-855 dark:text-zinc-100">
                      Apakah Anda yakin ingin menghapus akun referrer ini?
                    </p>
                    <div className={getSubElementClass("inner-card")}>
                      <span className="font-bold text-zinc-900 dark:text-white block">{selectedAccount?.name}</span>
                      <span className="text-[10px] text-zinc-450 mt-0.5 block">{selectedAccount?.email}</span>
                    </div>
                    <p className="text-[10px] text-rose-500 italic leading-normal font-medium">
                      * Seluruh data asosiasi kode referral dan transaksi komisi untuk pemilik ini akan dihapus dari data scope dashboard. Aksi ini tidak dapat dibatalkan.
                    </p>
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button 
                      variant="secondary" 
                      accentColor={selectedColor} 
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button 
                      variant="primary" 
                      accentColor="red" 
                      onClick={handleDeleteAccount}
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Hapus Permanen
                    </UI.Button>
                  </div>
                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.4 Link New Referral Code to Account Modal */}
      <AnimatePresence>
        {isLinkCodeOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleLinkCode} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-200">
                      Asosiasi Kode Referral
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setIsLinkCodeOpen(false)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 text-xs leading-normal">
                    <p className="text-zinc-500 font-medium">
                      Asosiasikan kode rujukan baru khusus untuk pemilik akun <strong className="font-bold text-zinc-800 dark:text-zinc-200">{selectedAccount?.name}</strong>:
                    </p>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-zinc-705 dark:text-zinc-300">Kode Referral (Alphanumeric, URL Safe)</label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: AKBARNEXT"
                        value={linkCodeForm.code}
                        onChange={(e) => setLinkCodeForm(prev => ({ ...prev, code: e.target.value }))}
                        accentColor={selectedColor}
                        required
                        className="text-xs! py-2! font-mono uppercase"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1">
                      <label className="font-bold text-zinc-705 dark:text-zinc-300">Program Referral Tujuan</label>
                      <div className="relative">
                        <UI.Select
                          value={linkCodeForm.programId}
                          onChange={(e) => setLinkCodeForm(prev => ({ ...prev, programId: e.target.value }))}
                          accentColor={selectedColor}
                          className="text-xs! py-2! pr-8! pl-3!"
                        >
                          {mockPrograms.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </UI.Select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400 dark:text-zinc-500">
                          <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1">
                      <label className="font-bold text-zinc-705 dark:text-zinc-300 block">Batas Penggunaan Kode</label>
                      <div className="flex items-center gap-4 mt-0.5">
                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="limit"
                            checked={linkCodeForm.limit === "unlimited"}
                            onChange={() => setLinkCodeForm(prev => ({ ...prev, limit: "unlimited" }))}
                            className="cursor-pointer"
                          />
                          <span>Unlimited</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="limit"
                            checked={linkCodeForm.limit === "value"}
                            onChange={() => setLinkCodeForm(prev => ({ ...prev, limit: "value" }))}
                            className="cursor-pointer"
                          />
                          <span>Batas Jumlah</span>
                        </label>
                      </div>

                      {linkCodeForm.limit === "value" && (
                        <div className="mt-2 max-w-30">
                          <UI.Input
                            type="number"
                            min={1}
                            value={linkCodeForm.limitValue}
                            onChange={(e) => setLinkCodeForm(prev => ({ ...prev, limitValue: parseInt(e.target.value) || 1 }))}
                            accentColor={selectedColor}
                            className="text-xs! py-1.5!"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button 
                      variant="secondary" 
                      accentColor={selectedColor} 
                      onClick={() => setIsLinkCodeOpen(false)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button 
                      type="submit"
                      variant="primary" 
                      accentColor={selectedColor} 
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Daftarkan Kode
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.5 Process Payout Modal (Approve/Reject) */}
      <AnimatePresence>
        {isProcessPayoutOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <UI.Card accentColor={selectedColor}>
                <div className="flex flex-col gap-4 text-left font-sans">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-200">
                      Proses Pencairan Payout
                    </h3>
                    <button 
                      onClick={() => setIsProcessPayoutOpen(null)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 text-xs leading-normal">
                    <p className="text-zinc-550 font-semibold">
                      Tinjau permintaan pencairan komisi dan kirimkan dana ke pemilik akun berikut:
                    </p>

                    <div className={getSubElementClass("inner-card")}>
                      <span className="font-bold text-zinc-800 dark:text-zinc-150 block">{selectedAccount?.name}</span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">{selectedAccount?.bankName} — {selectedAccount?.accountNumber}</span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">A.N: {selectedAccount?.accountHolder}</span>
                      <div className="border-t border-dashed border-zinc-200/50 dark:border-zinc-850 pt-2.5 mt-2 flex justify-between items-center text-sm font-black">
                        <span className="text-zinc-650 dark:text-zinc-300">Nominal Transfer:</span>
                        <span className="text-emerald-600 dark:text-emerald-450">Rp {isProcessPayoutOpen.transaction.amount.toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">Nomor Referensi Bank / Transfer (Opsional)</label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: TRSF-BCA-9881..."
                        id="payout-ref-input"
                        accentColor={selectedColor}
                        className="text-xs! py-2! font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button 
                      variant="secondary" 
                      accentColor="red" 
                      onClick={() => handleProcessPayout("rejected")}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Tolak Pencairan
                    </UI.Button>
                    <UI.Button 
                      variant="primary" 
                      accentColor="green" 
                      onClick={() => {
                        const inputVal = (document.getElementById("payout-ref-input") as HTMLInputElement)?.value || "";
                        handleProcessPayout("success", inputVal);
                      }}
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Setujui & Tandai Sukses
                    </UI.Button>
                  </div>
                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Toast Feedback Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full font-sans animate-none"
          >
            <UI.Card accentColor={toastMessage.type === "success" ? "green" : "red"}>
              <div className="flex items-start gap-3.5 text-xs leading-normal">
                <div className="shrink-0 mt-0.5">
                  {toastMessage.type === "success" ? (
                    <Icons.Check className="w-4 h-4 text-emerald-600 dark:text-emerald-455" />
                  ) : (
                    <Icons.AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div className="flex-1 font-semibold text-zinc-850 dark:text-zinc-200">
                  {toastMessage.text}
                </div>
                <button 
                  onClick={() => setToastMessage(null)}
                  className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  title="Tutup Notifikasi"
                  aria-label="Tutup Notifikasi"
                >
                  <Icons.X className="w-3.5 h-3.5" />
                </button>
              </div>
            </UI.Card>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
