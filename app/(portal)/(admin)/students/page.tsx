/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";
import { ActiveStudent } from "./_types/student";
import { getStoredActiveStudents, saveStoredActiveStudents, DEFAULT_ACTIVE_STUDENTS } from "./_services/student-mock";

// Sample curriculum module outlines for mockup interaction
const SAMPLE_PROGRAM_CURRICULUMS: Record<string, string[]> = {
  frontend: [
    "HTML5 & CSS3 Semantic Layouts",
    "Tailwind CSS Layouts & Custom Styling",
    "JavaScript Core Concepts & Async Fetching",
    "React Hooks, State Management & Routing",
    "Next.js App Router, RSC & Deploy Vercel"
  ],
  backend: [
    "Database Relational Design & SQL Basics",
    "PHP OOP & MVC Pattern Fundamentals",
    "Laravel Router, Controllers, ORM & Eloquent",
    "RESTful API Development & Docker Containership"
  ],
  uiux: [
    "UX Research Methods & Empathy Map",
    "Wireframing & Typography Design Systems",
    "Figma Auto Layout & Reusable Components",
    "Figma High-Fidelity Prototyping & Handoff"
  ]
};

export default function StudentRepositoryPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // 1. Data States
  const [students, setStudents] = useState<ActiveStudent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");

  // 2. Mobile Step wizard state
  const [mobileStep, setMobileStep] = useState<"list" | "detail">("list");

  // 3. Simulation States
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");

  // 4. Interaction States
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Initialize data from mock storage
  useEffect(() => {
    setStudents(getStoredActiveStudents());
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetData = () => {
    setStudents(DEFAULT_ACTIVE_STUDENTS);
    saveStoredActiveStudents(DEFAULT_ACTIVE_STUDENTS);
    setSelectedStudentId(null);
    setMobileStep("list");
    showToast("Data repositori murid berhasil di-reset.");
  };

  // Get active selected student
  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  // Compute curriculum modules based on student's program
  const activeCurriculumModules = useMemo(() => {
    if (!activeStudent) return [];
    return SAMPLE_PROGRAM_CURRICULUMS[activeStudent.programSlug] || [
      "Modul Pembelajaran Dasar 1",
      "Modul Pembelajaran Lanjutan 2",
      "Proyek Tugas Akhir & Kelulusan"
    ];
  }, [activeStudent]);

  // Handle module checkbox click (Interactive curriculum simulator)
  const handleToggleModule = (modIndex: number) => {
    if (!activeStudent) return;
    
    // Toggle logic: update completedModulesCount
    const currentCompleted = activeStudent.completedModulesCount;
    const totalModules = activeCurriculumModules.length;
    
    let newCompleted = currentCompleted;
    // Check if toggling completes or uncompletes
    if (modIndex < currentCompleted) {
      newCompleted = Math.max(0, modIndex);
    } else {
      newCompleted = Math.min(totalModules, modIndex + 1);
    }

    const updatedStudents = students.map((s) =>
      s.id === activeStudent.id
        ? {
            ...s,
            completedModulesCount: newCompleted,
            totalModulesCount: totalModules,
            status: newCompleted === totalModules ? "completed" as const : "active" as const
          }
        : s
    );

    setStudents(updatedStudents);
    saveStoredActiveStudents(updatedStudents);

    if (newCompleted === totalModules) {
      showToast(`Selamat! Murid ${activeStudent.name} telah menyelesaikan seluruh kurikulum!`);
    } else {
      showToast(`Progres kurikulum ${activeStudent.name} berhasil diperbarui.`);
    }
  };

  // Filters & Search calculations
  const filteredStudents = useMemo(() => {
    if (simulationState === "empty") return [];
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
        (statusFilter === "completed" && s.completedModulesCount === s.totalModulesCount);
        
      const matchesBranch =
        branchFilter === "all" ||
        (branchFilter === "jakarta" && s.address.toLowerCase().includes("jakarta")) ||
        (branchFilter === "bandung" && s.address.toLowerCase().includes("bandung")) ||
        (branchFilter === "surabaya" && s.address.toLowerCase().includes("surabaya")) ||
        (branchFilter === "yogyakarta" && s.address.toLowerCase().includes("yogyakarta")) ||
        (branchFilter === "semarang" && s.address.toLowerCase().includes("semarang"));

      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [students, searchQuery, statusFilter, branchFilter, simulationState]);

  // UI styles helper classes
  const getSubElementClass = (
    type: "card-item" | "panel-card" | "progress-track" | "progress-fill" | "stat-box" | "divider"
  ) => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-4 font-mono shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-5 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff]";
        if (type === "progress-track")
          return "w-full h-3.5 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-white rounded-none overflow-hidden relative";
        if (type === "progress-fill")
          return "h-full border-r border-zinc-900 dark:border-white rounded-none";
        if (type === "stat-box")
          return "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white p-3 rounded-none";
        if (type === "divider")
          return "h-0.5 bg-zinc-900 dark:bg-white my-3";
        return "";

      case "claymorphism":
        if (type === "card-item")
          return "bg-white/80 dark:bg-zinc-900/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_1px_2px_4px_rgba(0,0,0,0.04)] border border-zinc-200/50 dark:border-zinc-800/40 p-4 rounded-2xl transition-transform hover:scale-[1.01]";
        if (type === "panel-card")
          return "bg-slate-50 dark:bg-zinc-900 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.05),_inset_4px_4px_8px_rgba(255,255,255,0.4),_3px_5px_15px_rgba(0,0,0,0.05)] border border-slate-200/40 dark:border-zinc-850 p-5 rounded-3xl";
        if (type === "progress-track")
          return "w-full h-2.5 bg-zinc-200/50 dark:bg-zinc-950/60 border border-zinc-200/20 rounded-full overflow-hidden relative shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]";
        if (type === "progress-fill")
          return "h-full rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]";
        if (type === "stat-box")
          return "bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/30 dark:border-zinc-800/20 p-3 rounded-2xl shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]";
        if (type === "divider")
          return "h-px bg-zinc-200/60 dark:bg-zinc-800/40 my-3";
        return "";

      case "glassmorphism":
      case "liquid-glass":
        if (type === "card-item")
          return "bg-white/10 dark:bg-zinc-900/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 p-4 rounded-xl transition-all hover:bg-white/15";
        if (type === "panel-card")
          return "bg-white/15 dark:bg-zinc-900/35 border border-white/20 dark:border-zinc-800/50 backdrop-blur-md p-5 rounded-2xl shadow-xl";
        if (type === "progress-track")
          return "w-full h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden relative backdrop-blur-3xs";
        if (type === "progress-fill")
          return "h-full rounded-full";
        if (type === "stat-box")
          return "bg-white/5 dark:bg-zinc-900/15 border border-white/10 dark:border-zinc-800/25 p-3 rounded-xl backdrop-blur-3xs";
        if (type === "divider")
          return "h-px bg-white/10 dark:bg-zinc-800/50 my-3";
        return "";

      case "minimalism":
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-none transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/40";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-none";
        if (type === "progress-track")
          return "w-full h-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-none overflow-hidden relative";
        if (type === "progress-fill")
          return "h-full rounded-none";
        if (type === "stat-box")
          return "bg-transparent border border-zinc-200 dark:border-zinc-800 p-3 rounded-none";
        if (type === "divider")
          return "h-px bg-zinc-200 dark:bg-zinc-800 my-3";
        return "";

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/80 p-5 rounded-3xl shadow-sm";
        if (type === "progress-track")
          return "w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-200/35 dark:border-zinc-800/40";
        if (type === "progress-fill")
          return "h-full rounded-full";
        if (type === "stat-box")
          return "bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-2xl border border-zinc-200/35 dark:border-zinc-800/40";
        if (type === "divider")
          return "h-px bg-zinc-200 dark:bg-zinc-800/80 my-3";
        return "";
    }
  };

  const getCloseButtonClass = () => {
    switch (selectedStyle) {
      case "neobrutalism":
        return "p-1.5 border-2 border-zinc-900 dark:border-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-none text-zinc-900 dark:text-white cursor-pointer";
      case "claymorphism":
        return "p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:scale-[1.05] active:scale-[0.95] transition-all text-zinc-500 hover:text-zinc-700 dark:hover:text-white cursor-pointer";
      case "glassmorphism":
      case "liquid-glass":
        return "p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-350 cursor-pointer";
      case "minimalism":
        return "p-1.5 rounded-none text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer";
      default:
        return "p-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-700 cursor-pointer";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-350 font-bold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Database Akademik</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Repositori & Database Murid Aktif
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pantau progres kurikulum, lokasi kelas offline, status pembayaran, serta mentor pendamping pendaftar aktif.
          </p>
        </div>
      </div>

      {/* Simulator bar */}
      <div className="flex flex-wrap gap-2.5 items-center bg-zinc-100/80 dark:bg-zinc-900/40 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
        <span className="text-[10px] text-zinc-500 dark:text-zinc-300 font-bold uppercase tracking-wider pl-2 pr-1">
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
          Default (5 Murid)
        </button>
        <button
          onClick={() => {
            setSimulationState("loading");
            setSelectedStudentId(null);
          }}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "loading"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Loading
        </button>
        <button
          onClick={() => {
            setSimulationState("empty");
            setSelectedStudentId(null);
          }}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "empty"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Kosong
        </button>
        <button
          onClick={() => {
            setSimulationState("error");
            setSelectedStudentId(null);
          }}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "error"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
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

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Students List (Hidden on Mobile if detail step is active) */}
        <div className={`lg:col-span-7 flex flex-col gap-4 ${mobileStep === "detail" ? "hidden lg:flex" : "flex"}`}>
          <UI.Card accentColor={selectedColor}>
            <div className="p-5 flex flex-col gap-4">
              
              {/* Header and counter */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Daftar Murid Aktif ({filteredStudents.length})
                </h3>

                {/* Filters */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <UI.Select
                    value={statusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
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
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBranchFilter(e.target.value)}
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

              {/* Search input */}
              <div className="relative flex items-center">
                <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                <UI.Input
                  type="text"
                  placeholder="Cari nama, email, program, atau lokasi..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  accentColor={selectedColor}
                  className="pl-10! text-xs! py-2!"
                />
              </div>

              {/* Data Table states */}
              {simulationState === "loading" ? (
                <div className="flex flex-col gap-3.5">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="animate-pulse bg-zinc-100/50 dark:bg-zinc-900/40 p-5 rounded-2xl h-24" />
                  ))}
                </div>
              ) : simulationState === "error" ? (
                <div className="py-12 text-center bg-rose-500/5 border border-rose-500/15 rounded-2xl p-4 text-xs text-rose-600 font-medium">
                  <Icons.AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  Gagal memuat repositori murid aktif dari server.
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="py-16 text-center text-xs text-zinc-400 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center gap-2">
                  <Icons.Users className="w-8 h-8 text-zinc-300" />
                  <span>Tidak ada data murid yang cocok dengan filter pencarian.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5 max-h-[580px] overflow-y-auto pr-1">
                  {filteredStudents.map((s) => {
                    const isSelected = selectedStudentId === s.id;
                    const isCompleted = s.completedModulesCount === s.totalModulesCount;
                    const progressPct = Math.round((s.completedModulesCount / s.totalModulesCount) * 100);

                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          if (window.innerWidth < 1024) {
                            setMobileStep("detail");
                          }
                        }}
                        className={`${getSubElementClass("card-item")} cursor-pointer border-2 relative ${
                          isSelected
                            ? "ring-2 ring-sakode-blue dark:ring-sky-400 bg-zinc-50/40 dark:bg-zinc-900/10 border-sakode-blue/30"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          
                          {/* Student Details Column */}
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

                          {/* Workload / Plotted Mentor Column */}
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

                            {/* Progres Curriculum Bar */}
                            <div className="w-32 flex flex-col gap-1 mt-1 text-[9.5px] font-bold text-zinc-500">
                              <div className="flex justify-between">
                                <span>Progres</span>
                                <span>{progressPct}%</span>
                              </div>
                              <div className={getSubElementClass("progress-track")}>
                                <div
                                  className={`${getSubElementClass("progress-fill")} ${getBgClass(selectedColor)}`}
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
              )}

            </div>
          </UI.Card>
        </div>

        {/* Right Column: Detail Inspector Panel (Hidden on Mobile if list step is active) */}
        <div className={`lg:col-span-5 flex flex-col gap-6 ${mobileStep === "list" ? "hidden lg:flex" : "flex"}`}>
          
          {/* Back button for mobile */}
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
                    <div className={`w-12 h-12 rounded-full ${getBgOpacity10Class(selectedColor)} flex items-center justify-center ${getTextClass(selectedColor)}`}>
                      <Icons.Info className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Rincian Profil & Kurikulum
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
                      Pilih seorang murid aktif dari repositori di sebelah kiri untuk meninjau data kontak, status modul kurikulum, rincian pembayaran, dan mentor pendamping.
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
                
                {/* 1. Student Basic Card */}
                <div className={getSubElementClass("panel-card")}>
                  
                  {/* Card Header details */}
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
                      className={getCloseButtonClass()}
                      title="Tutup Panel"
                      aria-label="Tutup Panel"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Basic Details Grid */}
                  <div className="flex flex-col gap-2 text-xs text-left mb-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Email Pendaftar:</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-150">{activeStudent.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">WhatsApp / Telp:</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-150">{activeStudent.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Cabang Offline:</span>
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-150">{activeStudent.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Status Pembayaran:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                        ✓ Terverifikasi ({activeStudent.paymentType === "lunas" ? "Lunas" : activeStudent.paymentType === "trial" ? "Trial" : "Cicilan"})
                      </span>
                    </div>
                  </div>

                  {/* Group Members detail (if applicable) */}
                  {activeStudent.isGroup && activeStudent.groupMembers && (
                    <div className="mb-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 text-xs text-left">
                      <span className="text-[9px] text-zinc-400 font-bold block uppercase tracking-wider mb-2">
                        Anggota Kelompok Belajar ({activeStudent.groupMembers.length} anak):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeStudent.groupMembers.map((m, mIdx) => (
                          <span key={mIdx} className="bg-purple-500/10 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Catatan Belajar */}
                  <div className="text-xs text-left">
                    <span className="text-zinc-400 font-medium">Catatan Profil Murid:</span>
                    <p className="bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 rounded-xl text-zinc-650 dark:text-zinc-350 italic border border-zinc-200/50 dark:border-zinc-800/80 mt-1 leading-relaxed">
                      &ldquo;{activeStudent.notes}&rdquo;
                    </p>
                  </div>
                </div>

                {/* 2. Plotted Mentor Details Section */}
                <div className={getSubElementClass("panel-card")}>
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
                      
                      {/* Plotting Page Redirect link */}
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
                        <p className="font-bold text-rose-600">Murid Belum Terplotting Ke Mentor</p>
                        <p className="text-[10.5px] text-zinc-500 mt-0.5 leading-relaxed">
                          Plotting mentor wajib dilakukan agar proses penjadwalan mentoring offline dapat dimulai.
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

                {/* 3. Curriculum Modules Progress Simulator */}
                <div className={getSubElementClass("panel-card")}>
                  <div className="flex justify-between items-baseline mb-3">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Progres Kurikulum Pembelajaran
                    </h4>
                    <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-200">
                      {activeStudent.completedModulesCount} dari {activeCurriculumModules.length} Selesai
                    </span>
                  </div>

                  {/* Interactive checklist of modules */}
                  <div className="flex flex-col gap-2.5 text-xs text-left">
                    {activeCurriculumModules.map((moduleName, idx) => {
                      const isCompleted = idx < activeStudent.completedModulesCount;
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
                          <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isCompleted
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                          }`}>
                            {isCompleted && <Icons.Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          
                          <div className="flex-1">
                            <span className="text-[9px] text-zinc-400 font-mono block">Modul {idx + 1}</span>
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

      {/* Notification Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full font-sans"
          >
            <UI.Card accentColor={toastMessage.type === "success" ? "green" : "red"}>
              <div className="flex items-start gap-3.5 text-xs leading-normal">
                <div className="shrink-0 mt-0.5">
                  {toastMessage.type === "success" ? (
                    <Icons.Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Icons.AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div className="flex-1 font-semibold text-zinc-800 dark:text-zinc-200">
                  {toastMessage.text}
                </div>
                <button
                  onClick={() => setToastMessage(null)}
                  className="shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
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
