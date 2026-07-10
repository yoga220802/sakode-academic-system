"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { PrincipalMembership } from "./_types/membership";
import {
  getStoredMemberships,
  saveStoredMemberships,
  DEFAULT_MEMBERSHIPS
} from "./_services/principal-membership-mock";
import { getStoredOrganizations } from "../extracurriculars-admin/_services/extracurricular-mock";
import { ExtracurricularOrganization } from "../extracurriculars-admin/_types/extracurricular";

export default function PrincipalMembershipPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];
  const router = useRouter();

  // 1. Data States
  const [memberships, setMemberships] = useState<PrincipalMembership[]>([]);
  const [organizations, setOrganizations] = useState<ExtracurricularOrganization[]>([]);

  // 2. Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 3. Modals and messages
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");

  // Load datasets on mount
  useEffect(() => {
    setMemberships(getStoredMemberships());
    setOrganizations(getStoredOrganizations());
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetData = () => {
    setMemberships(DEFAULT_MEMBERSHIPS);
    saveStoredMemberships(DEFAULT_MEMBERSHIPS);
    showToast("Data keanggotaan Kepala Sekolah berhasil di-reset.");
  };

  // Compile helper to resolve school names from IDs
  const resolveSchoolNames = (orgIds: string[]) => {
    if (!orgIds || orgIds.length === 0) return "Belum Terhubung";
    return orgIds
      .map((id) => {
        const org = organizations.find((o) => o.id === id);
        return org ? org.name : id;
      })
      .join(", ");
  };

  // Filters and metrics computation
  const filteredMemberships = useMemo(() => {
    if (simulationState === "empty") return [];
    return memberships.filter((m) => {
      const matchesSearch =
        m.principalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.principalEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resolveSchoolNames(m.assignedOrgs).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [memberships, searchQuery, statusFilter, simulationState, organizations]);

  const metrics = useMemo(() => {
    if (simulationState === "empty") {
      return { total: 0, active: 0, inactive: 0 };
    }
    return {
      total: memberships.length,
      active: memberships.filter((m) => m.status === "active").length,
      inactive: memberships.filter((m) => m.status === "inactive").length
    };
  }, [memberships, simulationState]);

  // Toggle active/inactive status
  const handleToggleStatus = (member: PrincipalMembership) => {
    const nextStatus = member.status === "active" ? "inactive" : "active";
    const updated = memberships.map((m) =>
      m.id === member.id ? { ...m, status: nextStatus as "active" | "inactive" } : m
    );
    setMemberships(updated);
    saveStoredMemberships(updated);
    showToast(`Status ${member.principalName} diubah menjadi ${nextStatus === "active" ? "Aktif" : "Nonaktif"}.`);
  };

  // Delete/Disconnect Principal Membership
  const handleOpenDeleteConfirm = (member: PrincipalMembership) => {
    setTargetId(member.id);
    setTargetName(member.principalName);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteSubmit = () => {
    if (!targetId) return;
    const updated = memberships.filter((m) => m.id !== targetId);
    setMemberships(updated);
    saveStoredMemberships(updated);
    setIsDeleteConfirmOpen(false);
    showToast(`Sukses memutus hubungan akun ${targetName}.`);
  };

  // UI styling helpers
  const getSubElementClass = (type: "tab-button" | "table-header") => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "tab-button") return "border-2 border-zinc-900 dark:border-white rounded-none py-1.5 px-4 font-black";
        if (type === "table-header") return "border-b-2 border-zinc-900 dark:border-zinc-700 bg-zinc-100 font-black text-zinc-900 uppercase p-3 text-xs";
        return "";
      case "claymorphism":
        if (type === "tab-button") return "rounded-xl py-1.5 px-4 font-bold shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]";
        if (type === "table-header") return "bg-slate-100 dark:bg-zinc-950 font-extrabold text-zinc-755 p-3 rounded-t-xl text-xs";
        return "";
      case "glassmorphism":
      case "liquid-glass":
        if (type === "tab-button") return "rounded-lg py-1.5 px-4 font-bold backdrop-blur-3xs border border-white/10";
        if (type === "table-header") return "bg-white/5 border-b border-white/10 font-bold p-3 text-xs";
        return "";
      case "minimalism":
        if (type === "tab-button") return "rounded-none py-1.5 px-4 font-medium border border-zinc-200/80 dark:border-zinc-800";
        if (type === "table-header") return "border-b border-zinc-250 font-extrabold p-3 text-xs";
        return "";
      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "tab-button") return "rounded-xl py-1.5 px-4 font-bold border border-zinc-200/60 dark:border-zinc-800";
        if (type === "table-header") return "bg-zinc-50 dark:bg-zinc-950 font-extrabold text-zinc-600 dark:text-zinc-400 p-3 text-xs";
        return "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left">
      
      {/* 1. Header and Navigation Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-355 font-bold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Ekstrakurikuler</span>
            <span>/</span>
            <span>Keanggotaan Kepsek</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Keanggotaan Kepala Sekolah
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Daftarkan dan petakan akun Kepala Sekolah ke sekolah/organisasi ekskul mitra agar mereka memiliki hak akses baca terbatas.
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <UI.Button
            onClick={() => router.push("/principal-membership/new")}
            variant="primary"
            accentColor={selectedColor}
            className="font-bold! text-xs! py-2.5! px-4! w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
          >
            <Icons.UserPlus className="w-4 h-4" />
            Hubungkan Kepsek Baru
          </UI.Button>
        </div>
      </div>

      {/* 2. Simulator State Controller */}
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
          Default (3 Kepsek)
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
          onClick={handleResetData}
          className="p-1.5 text-zinc-450 hover:text-sakode-orange hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 rounded-lg transition-colors ml-auto cursor-pointer flex items-center gap-1 text-[10px] font-bold"
        >
          <Icons.Check className="w-3.5 h-3.5" />
          Reset Data
        </button>
      </div>

      {/* 3. Metrics Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <UI.Card>
          <div className="p-4 flex justify-between items-center text-left">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Total Kepala Sekolah</span>
              <span className="text-xl font-black text-zinc-800 dark:text-white mt-1 block">
                {metrics.total} Akun
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-sakode-blue dark:text-sky-400 flex items-center justify-center">
              <Icons.Users className="w-5 h-5" />
            </div>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-4 flex justify-between items-center text-left">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Membership Aktif</span>
              <span className="text-xl font-black text-emerald-500 mt-1 block">
                {metrics.active} Mitra
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icons.ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-4 flex justify-between items-center text-left">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Akun Nonaktif</span>
              <span className="text-xl font-black text-rose-500 mt-1 block">
                {metrics.inactive} Kepsek
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Icons.X className="w-5 h-5" />
            </div>
          </div>
        </UI.Card>
      </div>

      {/* 4. Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="flex flex-wrap gap-2.5 items-center flex-1">
          <div className="relative flex items-center w-full sm:w-72">
            <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3 z-10 pointer-events-none" />
            <UI.Input
              type="text"
              placeholder="Cari Kepsek, email, atau sekolah..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              accentColor={selectedColor}
              className="pl-9! text-xs! py-1.5!"
            />
          </div>

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
        </div>
      </div>

      {/* 5. Main Content: Memberships Table List */}
      {simulationState === "loading" ? (
        <div className="py-24 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/30 flex flex-col items-center justify-center gap-3">
          <Icons.Loader className="w-8 h-8 text-sakode-blue dark:text-sky-400 animate-spin" />
          <span className="text-xs text-zinc-450 font-bold">Memuat data keanggotaan Kepsek...</span>
        </div>
      ) : filteredMemberships.length > 0 ? (
        <div className="overflow-x-auto border border-zinc-200/60 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/30">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className={getSubElementClass("table-header") + " text-left rounded-tl-2xl pl-4"}>Nama Kepala Sekolah</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Alamat Email</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Sekolah / Organisasi Terhubung</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Tanggal Gabung</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Status</th>
                <th className={getSubElementClass("table-header") + " text-center rounded-tr-2xl pr-4"}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850">
              {filteredMemberships.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-zinc-55/35 dark:hover:bg-zinc-800/10 transition-colors"
                >
                  <td className="p-4 pl-4 text-left font-extrabold text-zinc-900 dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <Icons.User className="w-4 h-4 text-zinc-450" />
                      {member.principalName}
                    </span>
                  </td>
                  <td className="p-4 text-left font-semibold text-zinc-600 dark:text-zinc-350">
                    {member.principalEmail}
                  </td>
                  <td className="p-4 text-left font-bold text-sakode-blue dark:text-sky-400">
                    <div className="flex flex-col gap-1 max-w-sm">
                      {member.assignedOrgs.length > 0 ? (
                        member.assignedOrgs.map((orgId) => {
                          const org = organizations.find((o) => o.id === orgId);
                          return (
                            <span key={orgId} className="flex items-center gap-1 text-[11px]">
                              <Icons.AcademicCap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              {org ? org.name : orgId}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-rose-500 italic text-[11.5px] font-medium">Belum Terhubung</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center font-semibold text-zinc-500">
                    {member.joinedDate}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      onClick={() => handleToggleStatus(member)}
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black select-none cursor-pointer transition-all ${
                        member.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                      }`}
                      title="Klik untuk ubah status"
                    >
                      {member.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="p-4 text-center pr-4">
                    <div className="flex gap-3 justify-center items-center">
                      <button
                        onClick={() => router.push(`/principal-membership/${member.id}/edit`)}
                        className="bg-sakode-blue/10 text-sakode-blue dark:bg-sky-400/10 dark:text-sky-400 hover:bg-sakode-blue hover:text-white dark:hover:bg-sky-400 dark:hover:text-zinc-950 font-black text-[10px] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm(member)}
                        className="text-zinc-450 hover:text-rose-600 font-bold text-[10px] cursor-pointer"
                      >
                        Putus Hubungan
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-20 text-center text-xs text-zinc-450 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/30 flex flex-col items-center justify-center gap-1.5">
          <Icons.ShieldCheck className="w-8 h-8 text-zinc-300" />
          <span>Tidak ada data keanggotaan Kepala Sekolah yang ditemukan.</span>
          <span className="text-[10px] text-zinc-400 font-bold">Gunakan tombol &ldquo;Hubungkan Kepsek Baru&rdquo; di atas untuk memulai pemetaan.</span>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative my-8"
            >
              <UI.Card accentColor="red">
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-455 flex items-center gap-1.5">
                      <Icons.AlertCircle className="w-4 h-4 text-rose-500" />
                      Putus Hubungan Akun Kepsek
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                      title="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-350 leading-normal block">
                      Apakah Anda yakin ingin memutus hubungan keanggotaan Kepala Sekolah <span className="font-extrabold text-zinc-905 dark:text-white">{targetName}</span>?
                    </span>
                    <span className="text-[10px] text-zinc-450 mt-2 block">
                      Akun tersebut tidak akan lagi memiliki hak akses baca (read scope) terhadap laporan dan roster ekstrakurikuler organisasi mitra manapun.
                    </span>
                  </div>

                  <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                    <UI.Button
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-bold! cursor-pointer"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      onClick={handleDeleteSubmit}
                      variant="primary"
                      accentColor="red"
                      className="text-xs! py-2! px-5! font-bold! cursor-pointer bg-rose-600! hover:bg-rose-700!"
                    >
                      Ya, Putus Hubungan
                    </UI.Button>
                  </div>
                </div>
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
