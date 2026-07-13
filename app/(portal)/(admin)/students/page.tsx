"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { DataStateBoundary } from "@/app/_components/DataStateBoundary";
import { PageHeader } from "@/app/_components/PageHeader";
import { useToast, Toast } from "@/app/_components/Toast";
import { getSubElementClass } from "@/app/_utils/styleUtils";
import { getBgClass, getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { SimulationStateBar } from "../_shared";
import {
  ActiveStudent,
  fetchStudents,
  persistStudents,
  resetStudents as resetStudentData,
} from "@/app/_services/student-service";

const SAMPLE_PROGRAM_CURRICULUMS: Record<string, string[]> = {
  frontend: [
    "HTML5 & CSS3 Semantic Layouts",
    "Tailwind CSS Layouts & Custom Styling",
    "JavaScript Core Concepts & Async Fetching",
    "React Hooks, State Management & Routing",
    "Next.js App Router, RSC & Deploy Vercel",
  ],
  backend: [
    "Database Relational Design & SQL Basics",
    "PHP OOP & MVC Pattern Fundamentals",
    "Laravel Router, Controllers, ORM & Eloquent",
    "RESTful API Development & Docker Containership",
  ],
  uiux: [
    "UX Research Methods & Empathy Map",
    "Wireframing & Typography Design Systems",
    "Figma Auto Layout & Reusable Components",
    "Figma High-Fidelity Prototyping & Handoff",
  ],
};

type SimulationState = "default" | "loading" | "empty" | "error";

export default function StudentRepositoryPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI =
    UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] ||
    UIStyles.UI["sakode-modern"];

  const [students, setStudents] = useState<ActiveStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [mobileStep, setMobileStep] = useState<"list" | "detail">("list");
  const [simulationState, setSimulationState] = useState<SimulationState>("default");
  const { toast, showToast, setToast } = useToast();
  const isEmpty = simulationState === "empty" || (students.length === 0 && !isLoading && !isError);

  const loadData = React.useCallback(async (state: SimulationState) => {
    setSimulationState(state);
    setIsLoading(true);
    setIsError(false);

    if (state === "loading") return;
    if (state === "empty") {
      setStudents([]);
      setSelectedStudentId(null);
      setIsLoading(false);
      return;
    }
    if (state === "error") {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData("default");
  }, [loadData]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "plotted" && s.assignedMentorId !== null) ||
        (statusFilter === "unassigned" && s.assignedMentorId === null) ||
        (statusFilter === "completed" &&
          s.completedModulesCount === s.totalModulesCount);

      const matchesBranch =
        branchFilter === "all" ||
        (branchFilter === "jakarta" && s.address.toLowerCase().includes("jakarta")) ||
        (branchFilter === "bandung" && s.address.toLowerCase().includes("bandung")) ||
        (branchFilter === "surabaya" && s.address.toLowerCase().includes("surabaya")) ||
        (branchFilter === "yogyakarta" && s.address.toLowerCase().includes("yogyakarta")) ||
        (branchFilter === "semarang" && s.address.toLowerCase().includes("semarang"));

      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [students, searchQuery, statusFilter, branchFilter]);

  const activeStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  const activeCurriculumModules = useMemo(() => {
    if (!activeStudent) return [];
    return (
      SAMPLE_PROGRAM_CURRICULUMS[activeStudent.programSlug] || [
        "Modul Pembelajaran Dasar 1",
        "Modul Pembelajaran Lanjutan 2",
        "Proyek Tugas Akhir & Kelulusan",
      ]
    );
  }, [activeStudent]);

  const handleToggleModule = (modIndex: number) => {
    if (!activeStudent) return;

    const currentCompleted = activeStudent.completedModulesCount;
    const totalModules = activeCurriculumModules.length;
    let newCompleted = currentCompleted;

    if (modIndex < currentCompleted) {
      newCompleted = Math.max(0, modIndex);
    } else {
      newCompleted = Math.min(totalModules, modIndex + 1);
    }

    const updatedStudents: ActiveStudent[] = students.map((s) =>
      s.id === activeStudent.id
        ? {
            ...s,
            completedModulesCount: newCompleted,
            totalModulesCount: totalModules,
            status: newCompleted === totalModules ? "completed" : "active",
          }
        : s
    );

    setStudents(updatedStudents);
    persistStudents(updatedStudents);

    if (newCompleted === totalModules) {
      showToast(`Selamat! Murid ${activeStudent.name} telah menyelesaikan seluruh kurikulum!`);
    } else {
      showToast(`Progres kurikulum ${activeStudent.name} berhasil diperbarui.`);
    }
  };

  const handleReset = async () => {
    const data = await resetStudentData();
    setStudents(data);
    setSelectedStudentId(null);
    setMobileStep("list");
    showToast("Data repositori murid berhasil di-reset.");
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left">
      <PageHeader
        title="Repositori & Database Murid Aktif"
        description="Pantau progres kurikulum, lokasi kelas offline, status pembayaran, serta mentor pendamping pendaftar aktif."
      />

      <SimulationStateBar
        state={simulationState}
        onChange={loadData}
        onReset={handleReset}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div
          className={`lg:col-span-7 flex flex-col gap-4 ${
            mobileStep === "detail" ? "hidden lg:flex" : "flex"
          }`}
        >
          <UI.Card accentColor={selectedColor}>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Daftar Murid Aktif ({filteredStudents.length})
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <UI.Select
                    value={statusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setStatusFilter(e.target.value)
                    }
                    accentColor={selectedColor}
                    className="text-[10px]! py-1! px-2!"
                  >
                    <option value="all">Semua Penugasan</option>
                    <option value="plotted">Terploting Mentor</option>
                    <option value="unassigned">Belum Diploting</option>
                    <option value="completed">Lulus Kurikulum</option>
                  </UI.Select>
                  <UI.Select
                    value={branchFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setBranchFilter(e.target.value)
                    }
                    accentColor={selectedColor}
                    className="text-[10px]! py-1! px-2!"
                  >
                    <option value="all">Semua Cabang</option>
                    <option value="jakarta">Jakarta</option>
                    <option value="bandung">Bandung</option>
                    <option value="surabaya">Surabaya</option>
                    <option value="yogyakarta">Yogyakarta</option>
                    <option value="semarang">Semarang</option>
                  </UI.Select>
                </div>
              </div>

              <div className="relative flex items-center">
                <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                <UI.Input
                  type="text"
                  placeholder="Cari nama, email, program, atau lokasi..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  accentColor={selectedColor}
                  className="pl-10! text-xs! py-2!"
                />
              </div>

              <DataStateBoundary
                isLoading={isLoading && simulationState === "loading"}
                isError={isError}
                isEmpty={isEmpty || filteredStudents.length === 0}
                emptyTitle="Tidak Ada Murid"
                emptyDescription="Tidak ada data murid yang cocok dengan filter pencarian."
                loadingVariant="list"
              >
                <div className="flex flex-col gap-3.5 max-h-[580px] overflow-y-auto pr-1">
                  {filteredStudents.map((s) => {
                    const isSelected = selectedStudentId === s.id;
                    const isCompleted =
                      s.completedModulesCount === s.totalModulesCount;
                    const progressPct = Math.round(
                      (s.completedModulesCount / s.totalModulesCount) * 100
                    );

                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          if (window.innerWidth < 1024) setMobileStep("detail");
                        }}
                        className={`${getSubElementClass(selectedStyle, "card-item")} cursor-pointer border-2 relative ${
                          isSelected
                            ? "ring-2 ring-sakode-blue dark:ring-sky-400 bg-zinc-50/40 dark:bg-zinc-900/10 border-sakode-blue/30"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                                {s.id}
                              </span>
                              {isCompleted && (
                                <UI.Badge variant="success" className="text-[7px]! py-0 px-1!">
                                  Lulus
                                </UI.Badge>
                              )}
                              {s.isGroup && (
                                <UI.Badge variant="accent" accentColor="purple" className="text-[7.5px]! py-0 px-1.5!">
                                  Kelompok
                                </UI.Badge>
                              )}
                              {s.paymentType === "trial" && (
                                <UI.Badge variant="warning" className="text-[7.5px]! py-0 px-1.5!">
                                  Trial
                                </UI.Badge>
                              )}
                            </div>
                            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white mt-0.5 truncate">
                              {s.name}
                            </h4>
                            <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400 block truncate mt-0.5">
                              {s.programName}
                            </span>
                            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 block truncate font-medium mt-0.5">
                              📍 {s.address.split(" - ")[0]}
                            </span>
                          </div>
                          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                            <span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 font-bold block uppercase tracking-wide">
                              Mentor Pendamping
                            </span>
                            {s.assignedMentorId ? (
                              <span className="font-extrabold text-xs text-zinc-700 dark:text-zinc-200">
                                {s.assignedMentorName}
                              </span>
                            ) : (
                              <span className="font-extrabold text-xs text-rose-500 italic">
                                ⚠ Belum Diploting
                              </span>
                            )}
                            <div className="w-32 flex flex-col gap-1 mt-1 text-[9.5px] font-bold text-zinc-500">
                              <div className="flex justify-between">
                                <span>Progres</span>
                                <span>{progressPct}%</span>
                              </div>
                              <div className={getSubElementClass(selectedStyle, "progress-track")}>
                                <div
                                  className={`${getSubElementClass(selectedStyle, "progress-fill")} ${getBgClass(selectedColor)}`}
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DataStateBoundary>
            </div>
          </UI.Card>
        </div>

        <div
          className={`lg:col-span-5 flex flex-col gap-6 ${
            mobileStep === "list" ? "hidden lg:flex" : "flex"
          }`}
        >
          <button
            onClick={() => setMobileStep("list")}
            className="flex lg:hidden items-center gap-1.5 text-xs font-bold text-sakode-blue dark:text-sky-400 cursor-pointer self-start bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800"
          >
            <Icons.ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Murid
          </button>

          <AnimatePresence mode="wait">
            {!activeStudent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UI.Card>
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-3.5 py-24">
                    <div
                      className={`w-12 h-12 rounded-full ${getBgOpacity10Class(selectedColor)} flex items-center justify-center ${getTextClass(selectedColor)}`}
                    >
                      <Icons.Info className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Rincian Profil & Kurikulum
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
                      Pilih seorang murid aktif dari repositori di sebelah kiri
                      untuk meninjau data kontak, status modul kurikulum, rincian
                      pembayaran, dan mentor pendamping.
                    </p>
                  </div>
                </UI.Card>
              </motion.div>
            ) : (
              <motion.div
                key={activeStudent.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col gap-6"
              >
                <div className={getSubElementClass(selectedStyle, "panel-card")}>
                  <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-3.5">
                    <div>
                      <UI.Badge variant="default" className="text-[9px]! font-mono px-2! py-0.5!">
                        {activeStudent.id}
                      </UI.Badge>
                      <h3 className="text-base font-black text-zinc-900 dark:text-white mt-1.5">
                        {activeStudent.name}
                      </h3>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">
                        Terdaftar Sejak: {activeStudent.registrationDate}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedStudentId(null)}
                      className="p-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      title="Tutup Panel"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 text-xs text-left mb-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Email Pendaftar:</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-150">
                        {activeStudent.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">WhatsApp / Telp:</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-150">
                        {activeStudent.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Cabang Offline:</span>
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-150">
                        {activeStudent.address}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Status Pembayaran:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                        ✓ Terverifikasi (
                        {activeStudent.paymentType === "lunas"
                          ? "Lunas"
                          : activeStudent.paymentType === "trial"
                            ? "Trial"
                            : "Cicilan"}
                        )
                      </span>
                    </div>
                  </div>

                  {activeStudent.isGroup && activeStudent.groupMembers && (
                    <div className="mb-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 text-xs text-left">
                      <span className="text-[9px] text-zinc-400 font-bold block uppercase tracking-wider mb-2">
                        Anggota Kelompok Belajar ({activeStudent.groupMembers.length} anak):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeStudent.groupMembers.map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="bg-purple-500/10 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-left">
                    <span className="text-zinc-400 font-medium">Catatan Profil Murid:</span>
                    <p className="bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 rounded-xl text-zinc-650 dark:text-zinc-350 italic border border-zinc-200/50 dark:border-zinc-800/80 mt-1 leading-relaxed">
                      &ldquo;{activeStudent.notes}&rdquo;
                    </p>
                  </div>
                </div>

                <div className={getSubElementClass(selectedStyle, "panel-card")}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Mentor Pendamping Akademik
                    </h4>
                  </div>

                  {activeStudent.assignedMentorId ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-3.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 text-left">
                      <div>
                        <span className="text-[9.5px] text-zinc-450 dark:text-zinc-500 block font-bold">
                          {activeStudent.assignedMentorId}
                        </span>
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white mt-0.5">
                          {activeStudent.assignedMentorName}
                        </h4>
                        <span className="text-[10px] text-zinc-450 dark:text-zinc-400 block mt-0.5">
                          Mentor Aktif - Cabang Offline
                        </span>
                      </div>
                      <Link href="/plotting" className="shrink-0">
                        <UI.Button
                          variant="secondary"
                          accentColor={selectedColor}
                          className="text-[10.5px]! py-1.5! px-3! font-bold! cursor-pointer flex items-center gap-1"
                        >
                          <Icons.Compass className="w-3.5 h-3.5" />
                          Ubah Plotting
                        </UI.Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-rose-250 dark:border-rose-950/40 bg-rose-500/5 rounded-2xl text-center flex flex-col items-center gap-2.5">
                      <Icons.AlertCircle className="w-6 h-6 text-rose-500" />
                      <div className="text-xs text-zinc-650 dark:text-zinc-350">
                        <p className="font-bold text-rose-600">
                          Murid Belum Terplotting Ke Mentor
                        </p>
                        <p className="text-[10.5px] text-zinc-500 mt-0.5 leading-relaxed">
                          Plotting mentor wajib dilakukan agar proses penjadwalan
                          mentoring offline dapat dimulai.
                        </p>
                      </div>
                      <Link href="/plotting" className="w-full">
                        <UI.Button
                          variant="primary"
                          accentColor="red"
                          className="w-full text-[10.5px]! py-1.5! font-bold! cursor-pointer"
                        >
                          Lakukan Plotting Mentor Sekarang
                        </UI.Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className={getSubElementClass(selectedStyle, "panel-card")}>
                  <div className="flex justify-between items-baseline mb-3">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Progres Kurikulum Pembelajaran
                    </h4>
                    <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-200">
                      {activeStudent.completedModulesCount} dari{" "}
                      {activeCurriculumModules.length} Selesai
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs text-left">
                    {activeCurriculumModules.map((moduleName, idx) => {
                      const isCompleted =
                        idx < activeStudent.completedModulesCount;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleModule(idx)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isCompleted
                              ? "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-400 font-bold"
                              : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          <div
                            className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isCompleted
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                            }`}
                          >
                            {isCompleted && (
                              <Icons.Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="text-[9px] text-zinc-400 font-mono block">
                              Modul {idx + 1}
                            </span>
                            <span className="leading-relaxed">{moduleName}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
