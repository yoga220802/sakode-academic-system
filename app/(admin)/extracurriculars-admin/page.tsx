/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBorderRadiusClass } from "@/UI/shared/color-utils";
import { ExtracurricularOrganization, ExtracurricularRegistration } from "./_types/extracurricular";
import {
  getStoredOrganizations,
  saveStoredOrganizations,
  getStoredRegistrations,
  saveStoredRegistrations,
  DEFAULT_ORGANIZATIONS,
  DEFAULT_REGISTRATIONS
} from "./_services/extracurricular-mock";

export default function ExtracurricularsAdminPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];
  const router = useRouter();

  // 1. Data States
  const [organizations, setOrganizations] = useState<ExtracurricularOrganization[]>([]);
  const [registrations, setRegistrations] = useState<ExtracurricularRegistration[]>([]);

  // 2. Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"schools" | "reviews">("schools");
  const [searchQuery, setSearchQuery] = useState("");
  const [kecamatanFilter, setKecamatanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // 3. Modals State
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // 4. Form States
  const [rejectingRegId, setRejectingRegId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");

  // Load from local storage and mock service
  useEffect(() => {
    setOrganizations(getStoredOrganizations());
    setRegistrations(getStoredRegistrations());
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetData = () => {
    setOrganizations(DEFAULT_ORGANIZATIONS);
    saveStoredOrganizations(DEFAULT_ORGANIZATIONS);
    setRegistrations(DEFAULT_REGISTRATIONS);
    saveStoredRegistrations(DEFAULT_REGISTRATIONS);
    showToast("Data ekskul dan dokumen kemitraan berhasil di-reset.");
  };

  // Compile unique kecamatan list dynamically from registered schools
  const uniqueKecamatans = useMemo(() => {
    const list = organizations.map((org) => org.kecamatan).filter(Boolean);
    const set = new Set(list);
    return Array.from(set);
  }, [organizations]);

  // Filtering and metrics
  const filteredOrgs = useMemo(() => {
    if (simulationState === "empty") return [];
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.picName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.mentorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesKecamatan = kecamatanFilter === "all" || org.kecamatan === kecamatanFilter;
      const matchesStatus = statusFilter === "all" || org.status === statusFilter;

      return matchesSearch && matchesKecamatan && matchesStatus;
    });
  }, [organizations, searchQuery, kecamatanFilter, statusFilter, simulationState]);

  const filteredRegistrations = useMemo(() => {
    if (simulationState === "empty") return [];
    return registrations.filter((reg) => {
      const matchesSearch =
        reg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.extracurricularName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [registrations, searchQuery, simulationState]);

  const metrics = useMemo(() => {
    if (simulationState === "empty") {
      return { activePartners: 0, pendingReviews: 0, totalStudents: 0 };
    }
    return {
      activePartners: organizations.filter((o) => o.status === "active").length,
      pendingReviews: registrations.filter((r) => r.status === "pending").length,
      totalStudents: organizations.reduce((acc, curr) => acc + (curr.members?.length || 0), 0)
    };
  }, [organizations, registrations, simulationState]);

  // Toggle School Partnership status (Active / Inactive)
  const handleToggleSchoolStatus = (org: ExtracurricularOrganization) => {
    const nextStatus: "active" | "inactive" = org.status === "active" ? "inactive" : "active";
    const updated = organizations.map((o) => {
      if (o.id === org.id) {
        return {
          ...o,
          status: nextStatus
        };
      }
      return o;
    });

    setOrganizations(updated);
    saveStoredOrganizations(updated);
    showToast(`Status ekskul ${org.name} diubah menjadi ${nextStatus === "active" ? "Aktif" : "Nonaktif"}.`);
  };

  // Enrollment Approvals
  const handleApproveEnrollment = (reg: ExtracurricularRegistration) => {
    // Approve registration status
    const updatedRegs = registrations.map((r) => (r.id === reg.id ? { ...r, status: "approved" as const } : r));
    setRegistrations(updatedRegs);
    saveStoredRegistrations(updatedRegs);

    // Append to corresponding school members list with a default Class/Grade
    const updatedOrgs = organizations.map((o) => {
      if (o.id === reg.schoolId) {
        const isAlreadyMember = o.members?.some((m) => m.name === reg.studentName);
        if (isAlreadyMember) return o;
        const newMember = {
          id: `MEM-${Math.floor(205 + Math.random() * 900)}`,
          name: reg.studentName,
          grade: "XI RPL 1" // default grade assignment upon review approval
        };
        return {
          ...o,
          members: [...(o.members || []), newMember]
        };
      }
      return o;
    });
    setOrganizations(updatedOrgs);
    saveStoredOrganizations(updatedOrgs);

    showToast(`Pendaftaran ekskul ${reg.studentName} disetujui.`);
  };

  // Open Rejection dialog
  const handleOpenRejection = (reg: ExtracurricularRegistration) => {
    setRejectingRegId(reg.id);
    setRejectionReason("");
    setFormError(null);
    setIsRejectOpen(true);
  };

  const handleRejectEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRegId) return;

    if (!rejectionReason.trim()) {
      setFormError("Alasan penolakan wajib diisi.");
      return;
    }

    const updatedRegs = registrations.map((r) =>
      r.id === rejectingRegId
        ? {
            ...r,
            status: "rejected" as const,
            rejectionReason: rejectionReason
          }
        : r
    );

    setRegistrations(updatedRegs);
    saveStoredRegistrations(updatedRegs);
    setIsRejectOpen(false);
    showToast("Pendaftaran ekskul ditolak.");
  };

  // Badge stylings
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <UI.Badge variant="success">Disetujui</UI.Badge>;
      case "rejected":
        return <UI.Badge variant="default" className="bg-rose-100 text-rose-600 border border-rose-200">Ditolak</UI.Badge>;
      case "pending":
      default:
        return <UI.Badge variant="warning">Menunggu Review</UI.Badge>;
    }
  };

  // Responsive namespaces layout styling resolver
  const getSubElementClass = (type: "card-item" | "panel-card" | "tab-button" | "divider" | "table-header") => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-4 font-mono shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff]";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-5 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff]";
        if (type === "tab-button")
          return "border-2 border-zinc-900 dark:border-white rounded-none py-1.5 px-4 font-black";
        if (type === "divider")
          return "h-0.5 bg-zinc-900 dark:bg-white my-4";
        if (type === "table-header")
          return "border-b-2 border-zinc-900 dark:border-zinc-700 bg-zinc-100 font-black text-zinc-900 uppercase p-3 text-xs";
        return "";

      case "claymorphism":
        if (type === "card-item")
          return "bg-white/85 dark:bg-zinc-900/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_1px_2px_4px_rgba(0,0,0,0.04)] border border-zinc-200/50 dark:border-zinc-800/40 p-4 rounded-2xl";
        if (type === "panel-card")
          return "bg-slate-50 dark:bg-zinc-900 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.05),_inset_4px_4px_8px_rgba(255,255,255,0.4),_3px_5px_15px_rgba(0,0,0,0.05)] border border-slate-200/40 dark:border-zinc-850 p-5 rounded-3xl";
        if (type === "tab-button")
          return "rounded-xl py-1.5 px-4 font-bold shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]";
        if (type === "divider")
          return "h-px bg-zinc-200/60 dark:bg-zinc-800/40 my-4";
        if (type === "table-header")
          return "bg-slate-100 dark:bg-zinc-950 font-extrabold text-zinc-755 p-3 rounded-t-xl text-xs";
        return "";

      case "glassmorphism":
      case "liquid-glass":
        if (type === "card-item")
          return "bg-white/10 dark:bg-zinc-900/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 p-4 rounded-xl";
        if (type === "panel-card")
          return "bg-white/15 dark:bg-zinc-900/35 border border-white/20 dark:border-zinc-800/50 backdrop-blur-md p-5 rounded-2xl shadow-xl";
        if (type === "tab-button")
          return "rounded-lg py-1.5 px-4 font-bold backdrop-blur-3xs border border-white/10";
        if (type === "divider")
          return "h-px bg-white/10 dark:bg-zinc-800/50 my-4";
        if (type === "table-header")
          return "bg-white/5 border-b border-white/10 font-bold p-3 text-xs";
        return "";

      case "minimalism":
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-none";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-none";
        if (type === "tab-button")
          return "rounded-none py-1.5 px-4 font-medium border border-zinc-200/80 dark:border-zinc-800";
        if (type === "divider")
          return "h-px bg-zinc-200 dark:bg-zinc-800 my-4";
        if (type === "table-header")
          return "border-b border-zinc-250 font-extrabold p-3 text-xs";
        return "";

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/80 p-4 rounded-2xl shadow-sm";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/80 p-5 rounded-3xl shadow-sm";
        if (type === "tab-button")
          return "rounded-xl py-1.5 px-4 font-bold border border-zinc-200/60 dark:border-zinc-800";
        if (type === "divider")
          return "h-px bg-zinc-200 dark:bg-zinc-800 my-4";
        if (type === "table-header")
          return "bg-zinc-50 dark:bg-zinc-950 font-extrabold text-zinc-600 dark:text-zinc-400 p-3 text-xs";
        return "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left">
      
      {/* 1. Header and Page Metadata */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-355 font-bold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Program Ekstrakurikuler</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Kemitraan Sekolah & Ekskul
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Daftarkan ekskul sekolah mitra, upload dokumen MoU kerja sama, atur SAKODE mentor pendamping, serta review pendaftaran club murid.
          </p>
        </div>
        
        {/* Quick Action Trigger panel */}
        <div className="flex gap-2 w-full sm:w-auto">
          <UI.Button
            onClick={() => router.push("/extracurriculars-admin/new")}
            variant="primary"
            accentColor={selectedColor}
            className="font-bold! text-xs! py-2.5! px-4! w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
          >
            <Icons.Plus className="w-4 h-4" />
            Daftarkan Ekskul Baru
          </UI.Button>
        </div>
      </div>

      {/* 2. Simulator State Bar */}
      <div className="flex flex-wrap gap-2.5 items-center bg-zinc-100/80 dark:bg-zinc-900/40 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
        <span className="text-[10px] text-zinc-555 dark:text-zinc-300 font-bold uppercase tracking-wider pl-2 pr-1">
          Simulator State:
        </span>
        <button
          onClick={() => setSimulationState("default")}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "default"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Default (3 Ekskul)
        </button>
        <button
          onClick={() => setSimulationState("loading")}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "loading"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Loading
        </button>
        <button
          onClick={() => setSimulationState("empty")}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "empty"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Kosong
        </button>
        <button
          onClick={() => setSimulationState("error")}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "error"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          API Error
        </button>
        <button
          onClick={handleResetData}
          className="p-1.5 text-zinc-450 hover:text-sakode-orange hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 rounded-lg transition-colors ml-auto cursor-pointer flex items-center gap-1 text-[10px] font-bold"
        >
          <Icons.Check className="w-3.5 h-3.5" />
          Reset Data
        </button>
      </div>

      {/* 3. KPI Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <UI.Card>
          <div className="p-4 flex justify-between items-center text-left">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Kemitraan Sekolah Aktif</span>
              <span className="text-xl font-black text-zinc-800 dark:text-white mt-1 block">
                {metrics.activePartners} Sekolah
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icons.AcademicCap className="w-5 h-5" />
            </div>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-4 flex justify-between items-center text-left">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Antrean Review Club</span>
              <span className="text-xl font-black text-amber-500 mt-1 block">
                {metrics.pendingReviews} Pendaftaran
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Icons.Gift className="w-5 h-5" />
            </div>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-4 flex justify-between items-center text-left">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Total Murid Aktif Ekskul</span>
              <span className="text-xl font-black text-sakode-blue dark:text-sky-400 mt-1 block">
                {metrics.totalStudents} Siswa
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-sakode-blue dark:text-sky-400 flex items-center justify-center">
              <Icons.User className="w-5 h-5" />
            </div>
          </div>
        </UI.Card>
      </div>

      {/* Tabs list & filters toolbar */}
      <div className="flex flex-col gap-4">
        
        {/* Tab Buttons */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-px">
          <button
            onClick={() => setActiveTab("schools")}
            className={`${getSubElementClass("tab-button")} cursor-pointer flex items-center gap-1.5 ${
              activeTab === "schools"
                ? "bg-sakode-blue dark:bg-sky-400 text-white dark:text-zinc-950 border-sakode-blue"
                : "bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/35 border-transparent"
            }`}
          >
            <Icons.AcademicCap className="w-4 h-4" />
            Kemitraan & Ekskul Sekolah
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`${getSubElementClass("tab-button")} cursor-pointer flex items-center gap-1.5 ${
              activeTab === "reviews"
                ? "bg-sakode-blue dark:bg-sky-400 text-white dark:text-zinc-950 border-sakode-blue"
                : "bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/35 border-transparent"
            }`}
          >
            <Icons.Gift className="w-4 h-4" />
            Review Pendaftaran Ekskul ({metrics.pendingReviews})
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="relative flex items-center w-full sm:w-60">
            <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3 z-10 pointer-events-none" />
            <UI.Input
              type="text"
              placeholder={
                activeTab === "reviews" ? "Cari murid, ekskul..." : "Cari nama sekolah, guru, atau mentor..."
              }
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              accentColor={selectedColor}
              className="pl-9! text-xs! py-1.5!"
            />
          </div>

          {activeTab === "schools" && (
            <>
              {/* Dynamic Kecamatan partition selector */}
              <UI.Select
                value={kecamatanFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setKecamatanFilter(e.target.value)}
                accentColor={selectedColor}
                className="text-xs! py-1.5! px-3!"
              >
                <option value="all">Semua Kecamatan</option>
                {uniqueKecamatans.map((kec) => (
                  <option key={kec} value={kec}>
                    Kec. {kec}
                  </option>
                ))}
              </UI.Select>

              {/* Status filter */}
              <UI.Select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                accentColor={selectedColor}
                className="text-xs! py-1.5! px-3!"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </UI.Select>
            </>
          )}
        </div>

      </div>

      {/* Main Workspace Body */}
      {activeTab === "schools" ? (
        
        /* TAB 1: PARTNERSHIP SCHOOLS LIST */
        <div className={`overflow-x-auto bg-white dark:bg-zinc-900/30 ${getBorderRadiusClass(selectedStyle)} border ${selectedStyle === "neobrutalism" ? "border-2 border-zinc-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]" : "border-zinc-200/60 dark:border-zinc-800"}`}>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className={getSubElementClass("table-header") + " text-left rounded-tl-2xl pl-4"}>Sekolah / Ekskul</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Alamat Kecamatan & Kota</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Guru Pendamping</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Mentor SAKODE</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Jumlah Anggota</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Status</th>
                <th className={getSubElementClass("table-header") + " text-center rounded-tr-2xl pr-4"}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850">
              {filteredOrgs.map((org) => (
                <tr
                  key={org.id}
                  onClick={() => router.push(`/extracurriculars-admin/${org.id}`)}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/15 cursor-pointer transition-colors"
                >
                  <td className="p-4 pl-4 text-left">
                    <span className="font-extrabold text-sm text-zinc-900 dark:text-white hover:text-sakode-blue hover:dark:text-sky-400 transition-colors block">{org.name}</span>
                    {org.mouFileName && (
                      <span className="text-[9px] text-rose-600 dark:text-rose-455 font-bold flex items-center gap-1 mt-0.5">
                        <Icons.BookOpen className="w-3 h-3" />
                        MoU: {org.mouFileName}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300 text-left font-semibold">
                    <div className="flex flex-col">
                      <span>Kec. {org.kecamatan}</span>
                      <span className="text-[9.5px] text-zinc-450 block mt-0.5">
                        {org.kabupaten}, {org.provinsi}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-left">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {org.picName}
                      </span>
                      <span className="text-[10px] text-zinc-455 mt-0.5 block">{org.picEmail}</span>
                    </div>
                  </td>
                  <td className="p-4 text-left font-bold text-sakode-blue dark:text-sky-400">
                    {org.mentorName}
                  </td>
                  <td className="p-4 text-center font-extrabold text-zinc-800 dark:text-white">
                    {org.members?.length || 0} Siswa
                  </td>
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <span onClick={() => handleToggleSchoolStatus(org)} className="cursor-pointer" title="Klik untuk ubah status">
                      <UI.Badge
                        variant={org.status === "active" ? "success" : "default"}
                        accentColor={org.status === "active" ? "green" : undefined}
                        className="text-[10px]! font-black! select-none"
                      >
                        {org.status === "active" ? "Aktif" : "Nonaktif"}
                      </UI.Badge>
                    </span>
                  </td>
                  <td className="p-4 text-center pr-4" onClick={(e) => e.stopPropagation()}>
                    <UI.Button
                      onClick={() => router.push(`/extracurriculars-admin/${org.id}`)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-[10px]! py-1! px-2.5! font-black! cursor-pointer"
                    >
                      Detail
                    </UI.Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        
        /* TAB 2: STUDENT EXTRACURRICULAR REGISTRATION REVIEW */
        <div className="overflow-x-auto border border-zinc-200/60 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/30">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className={getSubElementClass("table-header") + " text-left rounded-tl-2xl pl-4"}>Nama Murid</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Sekolah Mitra</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Nama Club Ekskul</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Tanggal Masuk</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Status</th>
                <th className={getSubElementClass("table-header") + " text-center rounded-tr-2xl pr-4"}>Aksi Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850">
              {filteredRegistrations.map((reg) => {
                const isPending = reg.status === "pending";

                return (
                  <tr key={reg.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/15 transition-colors text-left">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white pl-4">
                      {reg.studentName}
                    </td>
                    <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      <span className="flex items-center gap-1">
                        <Icons.AcademicCap className="w-3.5 h-3.5 text-zinc-400" />
                        {reg.schoolName}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sakode-blue dark:text-sky-400">
                      <span className="flex items-center gap-1">
                        <Icons.BookOpen className="w-3.5 h-3.5 text-sakode-blue dark:text-sky-400" />
                        {reg.extracurricularName}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-505 font-semibold">
                      {reg.date}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {getStatusBadge(reg.status)}
                        {reg.status === "rejected" && reg.rejectionReason && (
                          <span className="text-[9px] text-rose-500 italic max-w-xs truncate block" title={reg.rejectionReason}>
                            Alasan: &ldquo;{reg.rejectionReason}&rdquo;
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center pr-4">
                      {isPending ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleApproveEnrollment(reg)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleOpenRejection(reg)}
                            className="bg-zinc-100 hover:bg-rose-100 text-zinc-600 hover:text-rose-600 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-zinc-200/50 cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-350 dark:text-zinc-650 italic">Review Selesai</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* REJECT ENROLLMENT DIALOG */}
      <AnimatePresence>
        {isRejectOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative my-8"
            >
              <UI.Card accentColor="red">
                <form onSubmit={handleRejectEnrollmentSubmit} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-455 flex items-center gap-1.5">
                      <Icons.AlertCircle className="w-4 h-4 text-rose-505" />
                      Tolak Pendaftaran Ekskul
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsRejectOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                      title="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  {formError && (
                    <UI.Alert title="Validasi Gagal" type="warning">
                      {formError}
                    </UI.Alert>
                  )}

                  <div>
                    <UI.Label className="text-[10.5px] font-bold text-zinc-500 leading-normal block mb-2">
                      Masukkan alasan penolakan bimbingan club ekskul untuk murid ini.
                    </UI.Label>
                    <textarea
                      placeholder="contoh: Kuota peserta club ekskul robotics batch ini sudah penuh."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs focus:ring-2 focus:outline-hidden min-h-[90px] font-medium"
                    />
                  </div>

                  <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                    <UI.Button
                      type="button"
                      onClick={() => setIsRejectOpen(false)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-bold! cursor-pointer"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor="red"
                      className="text-xs! py-2! px-5! font-bold! cursor-pointer bg-rose-600! hover:bg-rose-700!"
                    >
                      Kirim Tolak
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Alert notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full font-sans"
          >
            <UI.Card accentColor={toastMessage.type === "success" ? "green" : "red"}>
              <div className="flex items-start gap-3 text-xs leading-normal">
                <div className="shrink-0 mt-0.5">
                  {toastMessage.type === "success" ? (
                    <Icons.Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Icons.AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-455" />
                  )}
                </div>
                <div className="flex-1 font-bold text-zinc-800 dark:text-zinc-200">
                  {toastMessage.text}
                </div>
                <button
                  onClick={() => setToastMessage(null)}
                  className="shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                  title="Tutup"
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
