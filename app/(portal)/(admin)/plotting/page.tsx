"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";
import { UnassignedStudent } from "./_types/plotting";
import { getStoredStudents, saveStoredStudents, DEFAULT_UNASSIGNED_STUDENTS } from "@/app/_data/plotting-mock";
import { Mentor } from "../mentors/_types/mentor";
import { getStoredMentors, saveStoredMentors } from "@/app/_data/mentor-mock";

// Program-to-Skills matching catalog
const PROGRAM_SKILL_MAPPING: Record<string, string[]> = {
  frontend: ["React", "Next.js", "TypeScript", "Zustand", "Tailwind CSS"],
  backend: ["Laravel", "PHP", "MySQL", "Docker", "Node.js", "Express", "MongoDB", "Redis"],
  uiux: ["Figma", "UI/UX Design", "Wireframing", "Tailwind CSS"],
  datascience: ["Python", "Flask", "Machine Learning", "Pandas"],
  mobile: ["Flutter", "Dart", "Firebase", "State Management"],
};

export default function MentorPlottingPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // 1. Data States
  const [students, setStudents] = useState<UnassignedStudent[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  // 2. Mobile Step wizard state
  const [mobileStep, setMobileStep] = useState<"queue" | "plotting">("queue");

  // 3. Simulation States
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");

  // 4. Interaction States
  const [isConfirmingPlot, setIsConfirmingPlot] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Initialize data from mock database
  useEffect(() => {
    setStudents(getStoredStudents());
    setMentors(getStoredMentors());
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetData = () => {
    setStudents(DEFAULT_UNASSIGNED_STUDENTS);
    saveStoredStudents(DEFAULT_UNASSIGNED_STUDENTS);
    setSelectedStudentId(null);
    setSelectedMentorId(null);
    setMobileStep("queue");
    showToast("Data pendaftaran antrean dan pembayaran di-reset.");
  };

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (simulationState === "empty") return [];
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery, simulationState]);

  // Retrieve current selected student
  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);



  // Compute Eligible Mentors with Trial Conversion priorities and group capacity validation
  const eligibleMentors = useMemo(() => {
    if (!activeStudent) return [];
    const slug = activeStudent.programSlug;
    const reqSkills = PROGRAM_SKILL_MAPPING[slug] || [];

    return mentors
      .map((m) => {
        // Calculate compatible skills count
        const matchCount = m.skills.filter((s) => reqSkills.includes(s)).length;
        
        // Check if this mentor is the student's previous trial mentor
        const isPrevTrialMentor = activeStudent.isConversion && activeStudent.previousTrialMentorId === m.id;

        return {
          ...m,
          matchCount,
          isPrevTrialMentor,
        };
      })
      .sort((a, b) => {
        // 1. Previous Trial Mentor always goes to the absolute top of the recommendation list
        if (a.isPrevTrialMentor) return -1;
        if (b.isPrevTrialMentor) return 1;

        // 2. Prioritize active mentors next
        if (a.status === "inactive" && b.status !== "inactive") return 1;
        if (b.status === "inactive" && a.status !== "inactive") return -1;

        // 3. Sort by compatible skills count
        return b.matchCount - a.matchCount;
      });
  }, [mentors, activeStudent]);

  // Currently selected mentor for plotting
  const activeMentor = useMemo(() => {
    return mentors.find((m) => m.id === selectedMentorId) || null;
  }, [mentors, selectedMentorId]);

  // Get active student group size or default to 1
  const studentGroupSize = useMemo(() => {
    if (!activeStudent) return 1;
    return activeStudent.isGroup && activeStudent.groupMembers ? activeStudent.groupMembers.length : 1;
  }, [activeStudent]);

  // Commit Plotting Assignment
  const handleConfirmPlotting = () => {
    if (!activeStudent || !activeMentor) return;
    
    // Safety check: verify if plotting exceeds capacity (except if admin overrides)
    const wouldOverload = activeMentor.currentAllocatedStudents + 1 > activeMentor.maxCapacity;
    if (wouldOverload && activeMentor.status === "inactive") {
      showToast("Gagal: Mentor terpilih sedang tidak aktif / cuti.", "error");
      return;
    }

    setIsActionLoading(true);

    setTimeout(() => {
      // 1. Remove student from unassigned list
      const updatedStudents = students.filter((s) => s.id !== activeStudent.id);
      setStudents(updatedStudents);
      saveStoredStudents(updatedStudents);

      // 2. Increment mentor allocation capacity by group size
      const updatedMentors = mentors.map((m) =>
        m.id === activeMentor.id
          ? { ...m, currentAllocatedStudents: m.currentAllocatedStudents + 1 }
          : m
      );
      setMentors(updatedMentors);
      saveStoredMentors(updatedMentors);

      // 3. Clear selections & steps
      setSelectedStudentId(null);
      setSelectedMentorId(null);
      setIsConfirmingPlot(false);
      setMobileStep("queue");
      setIsActionLoading(false);

      showToast(
        `Sukses memploting Kak ${activeMentor.name} untuk mendampingi ${
          activeStudent.isGroup ? "Kelompok " + activeStudent.name : activeStudent.name
        } (+1 slot beban kelompok).`
      );
    }, 1000);
  };

  // UI preset visual class helpers
  const getSubElementClass = (
    type: "card-item" | "panel-card" | "progress-track" | "progress-fill" | "stat-box"
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
        return "p-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-805 transition-colors text-zinc-450 hover:text-zinc-700 cursor-pointer";
    }
  };

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Plotting & Penugasan Mentor
          </h1>
<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Ploting mentor pendamping untuk calon murid yang baru terdaftar berdasarkan kecocokan keahlian program.
          </p>
        </div>
      </div>

      {/* Backup Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2.5">
        <Icons.AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <span className="font-extrabold block mb-0.5">Pemberitahuan Operasional (Admin Backup Mode):</span>
          Modul penugasan mentor ini diperuntukkan sebagai **backup operasional** apabila Mentor Lead berhalangan dalam jangka waktu lama. Pengelolaan data administrasi pendaftaran, cabang offline, dan pembayaran wajib dikelola terpusat melalui menu <Link href="/registration-review" className="underline font-black hover:text-amber-900 dark:hover:text-amber-300">Review Pendaftaran</Link>.
        </div>
      </div>

      {/* Simulator Control bar */}
      <div className="flex flex-wrap gap-2.5 items-center bg-zinc-100/80 dark:bg-zinc-900/40 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 z-20">
        <span className="text-[10px] text-zinc-550 dark:text-zinc-300 font-bold uppercase tracking-wider pl-2 pr-1">
          Simulator Queue State:
        </span>
        <button
          onClick={() => setSimulationState("default")}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "default"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Default (6 Antrean)
        </button>
        <button
          onClick={() => {
            setSimulationState("loading");
            setSelectedStudentId(null);
          }}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "loading"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-555 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
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
              : "text-zinc-555 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Kosong / Terploting Semua
        </button>
        <button
          onClick={() => {
            setSimulationState("error");
            setSelectedStudentId(null);
          }}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "error"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-555 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          API Error
        </button>
        <button
          onClick={handleResetData}
          className="p-1.5 text-zinc-400 hover:text-sakode-orange hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 rounded-lg transition-colors ml-auto cursor-pointer flex items-center gap-1 text-[10px] font-bold"
        >
          <Icons.Check className="w-3.5 h-3.5" />
          Reset Queue
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Student Queue (Hidden on Mobile if plotting step is active) */}
        <div className={`lg:col-span-5 flex flex-col gap-4 ${mobileStep === "plotting" ? "hidden lg:flex" : "flex"}`}>
          <UI.Card accentColor={selectedColor}>
            <div className="p-5 flex flex-col gap-4">
              
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Antrean Murid Belum Terploting ({filteredStudents.length})
                </h3>
              </div>

              {/* Search box */}
              <div className="relative flex items-center">
                <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                <UI.Input
                  type="text"
                  placeholder="Cari nama, program, atau alamat..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  accentColor={selectedColor}
                  className="pl-10! text-xs! py-2!"
                />
              </div>

              {/* Queue List States */}
              {simulationState === "loading" ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="animate-pulse bg-zinc-100/50 dark:bg-zinc-900/40 p-4 rounded-xl h-24" />
                  ))}
                </div>
              ) : simulationState === "error" ? (
                <div className="py-8 text-center bg-rose-500/5 border border-rose-500/15 rounded-2xl p-4 text-xs text-rose-600 font-medium">
                  <Icons.AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  Gagal mengambil daftar antrean murid.
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center gap-2">
                  <Icons.UserCheck className="w-8 h-8 text-zinc-300" />
                  <span>Semua murid berhasil terploting ke mentor!</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1">
                  {filteredStudents.map((s) => {
                    const isSelected = selectedStudentId === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          setSelectedMentorId(null); // Reset mentor choice on student change
                          if (window.innerWidth < 1024) {
                            setMobileStep("plotting");
                          }
                        }}
                        className={`${getSubElementClass("card-item")} cursor-pointer text-left relative border-2 ${
                          isSelected
                            ? "ring-2 ring-sakode-blue dark:ring-sky-400 bg-zinc-50/40 dark:bg-zinc-900/10 border-sakode-blue/30"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 block">
                              {s.id}
                            </span>
                            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white mt-0.5">
                              {s.name}
                            </h4>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-450 block mt-0.5 font-medium">
                              {s.programName}
                            </span>

                            {/* Multi-badge list for various business cases */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {/* Payment type badges */}
                              {s.paymentType === "lunas" && (
                                <UI.Badge variant="success" className="text-[7.5px]! py-0 px-1.5!">
                                  Bayar Lunas
                                </UI.Badge>
                              )}
                              {s.paymentType === "trial" && (
                                <UI.Badge variant="warning" className="text-[7.5px]! py-0 px-1.5!">
                                  Trial Dulu
                                </UI.Badge>
                              )}
                              {s.paymentType === "cicil" && (
                                <UI.Badge variant="accent" accentColor={selectedColor} className="text-[7.5px]! py-0 px-1.5!">
                                  Bayar Cicil
                                </UI.Badge>
                              )}

                              {/* Unverified payment alert */}
                              {!s.paymentConfirmed && (
                                <UI.Badge variant="default" className="text-[7.5px]! py-0 px-1.5! bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-950/20 dark:text-rose-400">
                                  Verifikasi Pending
                                </UI.Badge>
                              )}

                              {/* Group badge */}
                              {s.isGroup && (
                                <UI.Badge variant="accent" accentColor="purple" className="text-[7.5px]! py-0 px-1.5!">
                                  Kelompok ({s.groupMembers?.length} Anak)
                                </UI.Badge>
                              )}

                              {/* Trial conversion upgrade badge */}
                              {s.isConversion && (
                                <UI.Badge variant="accent" accentColor="orange" className="text-[7.5px]! py-0 px-1.5!">
                                  Lanjutan Trial
                                </UI.Badge>
                              )}
                            </div>
                          </div>
                          
                          <span className="text-[9.5px] font-bold text-zinc-400 whitespace-nowrap">
                            {s.registrationDate}
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

        {/* Right Column: Context & Eligible Mentor Comparison (Hidden on Mobile if queue list step is active) */}
        <div className={`lg:col-span-7 flex flex-col gap-6 ${mobileStep === "queue" ? "hidden lg:flex" : "flex"}`}>
          
          {/* Back button for mobile */}
          <button
            onClick={() => setMobileStep("queue")}
            className="flex lg:hidden items-center gap-1.5 text-xs font-bold text-sakode-blue dark:text-sky-400 cursor-pointer self-start bg-zinc-100 dark:bg-zinc-900 px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800"
          >
            <Icons.ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Antrean
          </button>

          <AnimatePresence mode="wait">
            {!activeStudent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UI.Card>
                  <div className="p-8 text-center flex flex-col items-center gap-3">
                    <Icons.Compass className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Evaluasi & Bandingkan Mentor
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
                      Pilih seorang murid di antrean kiri untuk menganalisis kecocokan keahlian teknologi, ketersediaan beban plotting, dan verifikasi status pembayaran.
                    </p>
                  </div>
                </UI.Card>
              </motion.div>
            ) : (
              <motion.div
                key={activeStudent.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col gap-6"
              >
                
                {/* 1. Student Context Panel */}
                <div className={getSubElementClass("panel-card")}>
                  <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-3">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 block">
                        INFORMASI PENDAFTARAN OFFLINE & PEMBAYARAN
                      </span>
                      <h3 className="text-base font-black text-zinc-900 dark:text-white mt-0.5">
                        {activeStudent.name}
                      </h3>
                    </div>
                    
                    {/* Verified/Unverified Badge status */}
                    <div className="flex flex-col items-end gap-1">
                      <UI.Badge variant="accent" accentColor={selectedColor} className="text-[10px]! font-extrabold!">
                        {activeStudent.programName}
                      </UI.Badge>
                      {activeStudent.paymentConfirmed ? (
                        <span className="text-[9.5px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                          ✓ Pembayaran Diverifikasi
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-extrabold text-rose-500 uppercase tracking-wide">
                          ⚠ Menunggu Verifikasi Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-left mb-3.5">
                    <div>
                      <span className="text-zinc-400 block font-medium">Alamat Tempat Belajar Offline:</span>
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-150 flex items-center gap-1 mt-0.5">
                        <Icons.Compass className="w-3.5 h-3.5 text-zinc-450 shrink-0" />
                        {activeStudent.address}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block font-medium">Kontak WhatsApp:</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block">{activeStudent.phone}</span>
                    </div>
                  </div>

                  {/* Calculations Details Block */}
                  <div className="mb-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 text-xs text-left">
                    <span className="text-[9px] text-zinc-400 font-bold block uppercase tracking-wider mb-2">
                      Rincian Skema Finansial & Harga
                    </span>
                    <div className="space-y-1.5">
                      
                      {/* Case 1 & Case 3: Normal Full / Installment price */}
                      {!activeStudent.isGroup && !activeStudent.isConversion && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-zinc-450">Harga Normal Program:</span>
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">
                              {formatCurrency(activeStudent.normalPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-450">Metode Pembayaran:</span>
                            <span className="font-extrabold uppercase text-sakode-blue dark:text-sky-400">
                              {activeStudent.paymentType === "lunas" ? "Bayar Lunas" : "Cicilan 3x"}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Case 2: Conversion trial-to-normal calculation */}
                      {activeStudent.isConversion && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-zinc-450">Harga Normal Program:</span>
                            <span className="font-bold text-zinc-850 dark:text-zinc-200">
                              {formatCurrency(activeStudent.normalPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-450">Kredit Kelas Trial (Sudah Dibayar):</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              - {formatCurrency(activeStudent.trialPricePaid || 0)}
                            </span>
                          </div>
                          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                          <div className="flex justify-between font-extrabold">
                            <span className="text-zinc-800 dark:text-zinc-200">Sisa Tagihan Tambahan (Upgrade):</span>
                            <span className="text-sakode-blue dark:text-sky-400">
                              {formatCurrency(activeStudent.normalPrice - (activeStudent.trialPricePaid || 0))}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Case 4: Group calculation */}
                      {activeStudent.isGroup && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-zinc-450">Jumlah Anggota Kelompok:</span>
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">
                              {studentGroupSize} Peserta
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-450">Harga per Anak (Satuan):</span>
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">
                              {formatCurrency(activeStudent.pricePerParticipant || 250000)}
                            </span>
                          </div>
                          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                          <div className="flex justify-between font-extrabold">
                            <span className="text-zinc-800 dark:text-zinc-200">Total Harga Kelompok:</span>
                            <span className="text-sakode-blue dark:text-sky-400">
                              {formatCurrency(studentGroupSize * (activeStudent.pricePerParticipant || 250000))}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            <span className="text-[9px] text-zinc-400 font-bold block w-full mb-1">Daftar Anggota:</span>
                            {activeStudent.groupMembers?.map((member, mIdx) => (
                              <span key={mIdx} className="bg-purple-500/10 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">
                                {member}
                              </span>
                            ))}
                          </div>
                        </>
                      )}

                    </div>
                  </div>


                </div>

                {/* 2. Eligible Mentor Comparison */}
                <div className={getSubElementClass("panel-card")}>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-left mb-4">
                    Rekomendasi Mentor Pencocokan Kompetensi
                  </h3>

                  <div className="flex flex-col gap-3.5 max-h-[350px] overflow-y-auto pr-1">
                    {eligibleMentors.map((m) => {
                      const isSelected = selectedMentorId === m.id;
                      const isFull = m.currentAllocatedStudents >= m.maxCapacity;
                      
                      // Check if mentor has enough capacity left to accommodate the whole group size
                      const isOverloadedByGroup = m.currentAllocatedStudents + 1 > m.maxCapacity;
                      const reqSkills = PROGRAM_SKILL_MAPPING[activeStudent.programSlug] || [];
                      
                      // Calculate match percentage
                      const matchPct = Math.round((m.matchCount / reqSkills.length) * 100);

                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            if (m.status !== "inactive" && !isOverloadedByGroup) {
                              setSelectedMentorId(m.id);
                            } else if (isOverloadedByGroup) {
                              showToast(`Mentor ini tidak memiliki kapasitas slot tersisa.`, "error");
                            } else {
                              showToast("Mentor tersebut sedang nonaktif/cuti.", "error");
                            }
                          }}
                          className={`${getSubElementClass("card-item")} text-left flex flex-col gap-3 border-2 transition-all ${
                            isSelected
                              ? "ring-2 ring-sakode-blue dark:ring-sky-400 bg-zinc-50/40 dark:bg-zinc-900/10 border-sakode-blue/30"
                              : "border-transparent"
                          } ${m.status === "inactive" || isOverloadedByGroup ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              
                              {/* Recommendation type tags */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                                  {m.name}
                                </h4>
                                
                                {m.isPrevTrialMentor && (
                                  <UI.Badge variant="accent" accentColor="orange" className="text-[7.5px]! py-0 px-1.5! font-black">
                                    ★ Mentor Trial Sebelumnya
                                  </UI.Badge>
                                )}

                                {m.status === "active" && !isOverloadedByGroup && (
                                  <UI.Badge variant="success" className="text-[7.5px]! py-0 px-1.5!">
                                    Tersedia
                                  </UI.Badge>
                                )}
                                {isOverloadedByGroup && (
                                  <UI.Badge variant="warning" className="text-[7.5px]! py-0 px-1.5! bg-rose-500/10 text-rose-600 border-rose-500/20">
                                    Slot Tidak Cukup
                                  </UI.Badge>
                                )}
                              </div>
                              
                              <span className="text-[9.5px] text-zinc-400 dark:text-zinc-550 font-bold block mt-0.5">
                                Keahlian Match: {m.matchCount} dari {reqSkills.length} ({matchPct}% Cocok)
                              </span>
                            </div>

                            <span className="text-[11px] font-black text-zinc-700 dark:text-zinc-300">
                              Rating: {m.rating} ★
                            </span>
                          </div>

                          {/* Workload Capacity Bar */}
                          <div className="flex flex-col gap-1 text-[10px] font-bold text-zinc-500">
                            <div className="flex justify-between">
                              <span>Workload Slot</span>
                              <span>{m.currentAllocatedStudents} / {m.maxCapacity} Murid</span>
                            </div>
                            
                            {/* Capacity progress visual */}
                            <div className={getSubElementClass("progress-track")}>
                              <div
                                className={`${getSubElementClass("progress-fill")} ${getBgClass(selectedColor)}`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (m.currentAllocatedStudents / m.maxCapacity) * 100
                                  )}%`,
                                }}
                              />
                            </div>

                            {/* Group workload overlap preview */}
                            {isSelected && activeStudent.isGroup && (
                              <div className="text-[9px] text-purple-600 dark:text-purple-400 font-extrabold mt-0.5 flex justify-between">
                                <span>Estimasi Beban Kelompok:</span>
                                <span>{m.currentAllocatedStudents} + 1 → {m.currentAllocatedStudents + 1} / {m.maxCapacity} Slot</span>
                              </div>
                            )}

                            {/* Overload warning */}
                            {isOverloadedByGroup && !isFull && (
                              <span className="text-[9px] text-rose-500 font-bold leading-none block italic">
                                * Slot tersisa tidak cukup untuk kelompok belajar (+{studentGroupSize} anak).
                              </span>
                            )}
                          </div>

                          {/* Matching Skills tag preview */}
                          <div className="flex flex-wrap gap-1">
                            {m.skills.map((sk, idx) => {
                              const isMatched = reqSkills.includes(sk);
                              return (
                                <span
                                  key={idx}
                                  className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                                    isMatched
                                      ? "bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400 border border-sky-500/20"
                                      : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-650"
                                  }`}
                                >
                                  {sk}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Plotting Action Trigger */}
                <UI.Button
                  onClick={() => setIsConfirmingPlot(true)}
                  disabled={!selectedMentorId}
                  variant="primary"
                  accentColor={selectedColor}
                  className="w-full font-bold! text-xs! py-3! flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Icons.UserCheck className="w-4 h-4" />
                  Konfirmasi Penugasan Plotting Mentor
                </UI.Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 4. CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {isConfirmingPlot && activeStudent && activeMentor && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <UI.Card accentColor={selectedColor}>
                <div className="flex flex-col gap-4 text-left">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      Konfirmasi Penugasan Mentor
                    </h3>
                    <button
                      onClick={() => setIsConfirmingPlot(false)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Summary Details */}
                  <div className="flex flex-col gap-3.5 text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed">
                    <p>
                      Apakah Anda yakin ingin menugaskan mentor berikut untuk membimbing murid ini?
                    </p>

                    <div className="flex flex-col gap-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80">
                      <div>
                        <span className="text-[10px] text-zinc-450 font-bold block uppercase tracking-wider">
                          Nama Murid / Kelompok
                        </span>
                        <span className="font-extrabold text-zinc-800 dark:text-zinc-150">
                          {activeStudent.name} ({activeStudent.id})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-455 font-bold block uppercase tracking-wider">
                          Cabang Kelas Offline
                        </span>
                        <span className="font-extrabold text-zinc-800 dark:text-zinc-150 flex items-center gap-1 mt-0.5">
                          <Icons.Compass className="w-3.5 h-3.5 text-zinc-450" />
                          {activeStudent.address}
                        </span>
                      </div>
                      <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-0.5" />
                      <div>
                        <span className="text-[10px] text-zinc-455 font-bold block uppercase tracking-wider">
                          Mentor Pendamping
                        </span>
                        <span className="font-extrabold text-zinc-800 dark:text-zinc-150">
                          {activeMentor.name} ({activeMentor.id})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-455 font-bold block uppercase tracking-wider">
                          Perubahan Workload Slot
                        </span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-150">
                          {activeMentor.currentAllocatedStudents} / {activeMentor.maxCapacity} 
                          {" → "}
                          <span className="text-sakode-blue dark:text-sky-400 font-bold">
                            {activeMentor.currentAllocatedStudents + 1}
                          </span> / {activeMentor.maxCapacity} Slot Murid (+1)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <UI.Button
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => setIsConfirmingPlot(false)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      variant="primary"
                      accentColor={selectedColor}
                      onClick={handleConfirmPlotting}
                      isLoading={isActionLoading}
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Simpan & Plot Murid
                    </UI.Button>
                  </div>

                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
