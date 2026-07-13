"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBorderRadiusClass } from "@/UI/shared/color-utils";
import { PageHeader } from "@/app/_components/PageHeader";
import { StatCard } from "@/app/_components/StatCard";
import { ExtracurricularOrganization, ExtracurricularRegistration } from "./_types/extracurricular";
import {
  getStoredOrganizations,
  saveStoredOrganizations,
  getStoredRegistrations,
  saveStoredRegistrations,
  DEFAULT_ORGANIZATIONS,
  DEFAULT_REGISTRATIONS
} from "./_services/extracurricular-mock";
import { useToast, Toast, SimulationStateBar, getSubElementClass } from "../_shared";

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
  const { toast, showToast, setToast: closeToast } = useToast();
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");

  // Load from local storage and mock service
  useEffect(() => {
    setOrganizations(getStoredOrganizations());
    setRegistrations(getStoredRegistrations());
  }, []);

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

  // ponytail: data-driven style resolver via shared utility
  const _getClass = (type: string) => getSubElementClass(selectedStyle, type);

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-355 font-bold mb-1">
        <span>Admin</span>
        <span>/</span>
        <span>Program Ekstrakurikuler</span>
      </div>

      <PageHeader
        title="Kemitraan Sekolah & Ekskul"
        description="Daftarkan ekskul sekolah mitra, upload dokumen MoU kerja sama, atur SAKODE mentor pendamping, serta review pendaftaran club murid."
        actions={
          <UI.Button
            onClick={() => router.push("/extracurriculars-admin/new")}
            variant="primary"
            accentColor={selectedColor}
            className="font-bold! text-xs! py-2.5! px-4! w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
          >
            <Icons.Plus className="w-4 h-4" />
            Daftarkan Ekskul Baru
          </UI.Button>
        }
      />

      <SimulationStateBar state={simulationState} onChange={setSimulationState} onReset={handleResetData} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Kemitraan Sekolah Aktif" value={`${metrics.activePartners} Sekolah`} />
        <StatCard label="Antrean Review Club" value={`${metrics.pendingReviews} Pendaftaran`} />
        <StatCard label="Total Murid Aktif Ekskul" value={`${metrics.totalStudents} Siswa`} />
      </div>

      {/* Tabs list & filters toolbar */}
      <div className="flex flex-col gap-4">
        
        {/* Tab Buttons */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-px">
          <button
            onClick={() => setActiveTab("schools")}
            className={`${_getClass("tab-button")} cursor-pointer flex items-center gap-1.5 ${
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
            className={`${_getClass("tab-button")} cursor-pointer flex items-center gap-1.5 ${
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
                <th className={_getClass("table-header") + " text-left rounded-tl-2xl pl-4"}>Sekolah / Ekskul</th>
                <th className={_getClass("table-header") + " text-left"}>Alamat Kecamatan & Kota</th>
                <th className={_getClass("table-header") + " text-left"}>Guru Pendamping</th>
                <th className={_getClass("table-header") + " text-left"}>Mentor SAKODE</th>
                <th className={_getClass("table-header") + " text-center"}>Jumlah Anggota</th>
                <th className={_getClass("table-header") + " text-center"}>Status</th>
                <th className={_getClass("table-header") + " text-center rounded-tr-2xl pr-4"}>Aksi</th>
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
                <th className={_getClass("table-header") + " text-left rounded-tl-2xl pl-4"}>Nama Murid</th>
                <th className={_getClass("table-header") + " text-left"}>Sekolah Mitra</th>
                <th className={_getClass("table-header") + " text-left"}>Nama Club Ekskul</th>
                <th className={_getClass("table-header") + " text-left"}>Tanggal Masuk</th>
                <th className={_getClass("table-header") + " text-center"}>Status</th>
                <th className={_getClass("table-header") + " text-center rounded-tr-2xl pr-4"}>Aksi Review</th>
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

      <Toast toast={toast} onClose={() => closeToast(null)} />

    </div>
  );
}
