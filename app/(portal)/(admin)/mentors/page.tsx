"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";
import { Mentor } from "./_types/mentor";
import { getStoredMentors, saveStoredMentors, DEFAULT_MENTORS } from "@/app/_data/mentor-mock";

export default function MentorDirectoryPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // 1. Operational States
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  // 2. Simulation states
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");

  // 3. Modals & Interaction states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [deletingMentorId, setDeletingMentorId] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 4. Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formStatus, setFormStatus] = useState<"active" | "inactive" | "busy">("active");
  const [formSkills, setFormSkills] = useState("");
  const [formMaxCapacity, setFormMaxCapacity] = useState(8);
  const [formCurrentAllocated, setFormCurrentAllocated] = useState(0);
  const [formBio, setFormBio] = useState("");
  const [formRating, setFormRating] = useState(4.8);

  // Load initial data
  useEffect(() => {
    const data = getStoredMentors();
    setMentors(data);
  }, []);

  // Show status feedback toast
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset form states
  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormStatus("active");
    setFormSkills("");
    setFormMaxCapacity(8);
    setFormCurrentAllocated(0);
    setFormBio("");
    setFormRating(4.8);
  };

  // Sync state to local storage
  const syncMentors = (updatedList: Mentor[]) => {
    setMentors(updatedList);
    saveStoredMentors(updatedList);
  };

  // Handlers for Add/Edit/Delete actions
  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (mentor: Mentor) => {
    setEditingMentor(mentor);
    setFormName(mentor.name);
    setFormEmail(mentor.email);
    setFormPhone(mentor.phone);
    setFormStatus(mentor.status);
    setFormSkills(mentor.skills.join(", "));
    setFormMaxCapacity(mentor.maxCapacity);
    setFormCurrentAllocated(mentor.currentAllocatedStudents);
    setFormBio(mentor.bio);
    setFormRating(mentor.rating);
  };

  const handleSaveMentor = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);

    setTimeout(() => {
      const skillsArray = formSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (editingMentor) {
        // Edit existing mentor
        const updatedList = mentors.map((m) =>
          m.id === editingMentor.id
            ? {
                ...m,
                name: formName,
                email: formEmail,
                phone: formPhone,
                status: formStatus,
                skills: skillsArray,
                maxCapacity: Number(formMaxCapacity),
                currentAllocatedStudents: Number(formCurrentAllocated),
                bio: formBio,
                rating: Number(formRating),
              }
            : m
        );
        syncMentors(updatedList);
        setEditingMentor(null);
        showToast("Profil mentor berhasil diperbarui!");
      } else {
        // Add new mentor
        const newMentor: Mentor = {
          id: `MTR-${String(mentors.length + 1).padStart(3, "0")}`,
          name: formName,
          email: formEmail,
          phone: formPhone,
          status: formStatus,
          skills: skillsArray,
          maxCapacity: Number(formMaxCapacity),
          currentAllocatedStudents: Number(formCurrentAllocated),
          joinedDate: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          bio: formBio || "Mentor pendamping Sakode Academy.",
          rating: Number(formRating),
        };
        syncMentors([...mentors, newMentor]);
        setIsAddModalOpen(false);
        showToast("Mentor baru berhasil ditambahkan!");
      }
      setIsActionLoading(false);
      resetForm();
    }, 800);
  };

  const handleDeleteMentor = () => {
    if (!deletingMentorId) return;
    setIsActionLoading(true);

    setTimeout(() => {
      const updatedList = mentors.filter((m) => m.id !== deletingMentorId);
      syncMentors(updatedList);
      if (selectedMentorId === deletingMentorId) {
        setSelectedMentorId(null);
      }
      setDeletingMentorId(null);
      setIsActionLoading(false);
      showToast("Mentor berhasil dihapus.", "success");
    }, 600);
  };

  const handleResetData = () => {
    syncMentors(DEFAULT_MENTORS);
    setSelectedMentorId(null);
    showToast("Data simulasi di-reset ke nilai default.");
  };

  // Extract all unique skills across all mentors for filtering
  const allUniqueSkills = useMemo(() => {
    const list = new Set<string>();
    mentors.forEach((m) => m.skills.forEach((s) => list.add(s)));
    return Array.from(list).sort();
  }, [mentors]);

  // Apply filters
  const filteredMentors = useMemo(() => {
    if (simulationState === "empty") return [];
    
    return mentors.filter((m) => {
      // 1. Search Query Match
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Status Match
      const matchesStatus =
        selectedStatus === "all" || m.status === selectedStatus;

      // 3. Skill Match
      const matchesSkill =
        selectedSkill === "all" || m.skills.includes(selectedSkill);

      return matchesSearch && matchesStatus && matchesSkill;
    });
  }, [mentors, searchQuery, selectedStatus, selectedSkill, simulationState]);

  // Selected mentor profile detail
  const selectedMentor = useMemo(() => {
    return mentors.find((m) => m.id === selectedMentorId) || null;
  }, [mentors, selectedMentorId]);

  // Visual Class Helpers per Theme Preset
  const getSubElementClass = (
    type: "card-grid-item" | "panel-card" | "progress-track" | "progress-fill" | "stat-box" | "textarea"
  ) => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "card-grid-item")
          return "bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-white p-5 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] hover:translate-x-1 hover:-translate-y-1 transition-all";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-white p-6 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff]";
        if (type === "progress-track")
          return "w-full h-3.5 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-white rounded-none overflow-hidden relative";
        if (type === "progress-fill")
          return "h-full border-r border-zinc-900 dark:border-white rounded-none";
        if (type === "stat-box")
          return "bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white p-3.5 rounded-none";
        if (type === "textarea")
          return "w-full text-xs min-h-20 bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white rounded-none py-2.5 px-4 font-mono focus:outline-hidden focus:ring-0 text-zinc-900 dark:text-white leading-relaxed";
        return "";

      case "claymorphism":
        if (type === "card-grid-item")
          return "bg-white/80 dark:bg-zinc-900/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_-2px_-2px_4px_rgba(0,0,0,0.03),_2px_2px_6px_rgba(0,0,0,0.05)] border border-zinc-200/50 dark:border-zinc-800/40 p-5 rounded-2xl transition-transform hover:scale-[1.02] hover:-translate-y-1";
        if (type === "panel-card")
          return "bg-slate-50 dark:bg-zinc-900 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.05),_inset_4px_4px_8px_rgba(255,255,255,0.4),_3px_5px_15px_rgba(0,0,0,0.05)] border border-slate-200/40 dark:border-zinc-850 p-6 rounded-3xl";
        if (type === "progress-track")
          return "w-full h-3 bg-zinc-200/50 dark:bg-zinc-950/60 border border-zinc-200/20 rounded-full overflow-hidden relative shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]";
        if (type === "progress-fill")
          return "h-full rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]";
        if (type === "stat-box")
          return "bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/30 dark:border-zinc-800/20 p-3.5 rounded-2xl shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]";
        if (type === "textarea")
          return "w-full text-xs min-h-20 bg-slate-50 dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-850 rounded-2xl py-2.5 px-4 focus:outline-hidden focus:ring-0 text-zinc-900 dark:text-white leading-relaxed shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.4)]";
        return "";

      case "glassmorphism":
      case "liquid-glass":
        if (type === "card-grid-item")
          return "bg-white/10 dark:bg-zinc-900/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 p-5 rounded-xl transition-all hover:bg-white/15 hover:-translate-y-1";
        if (type === "panel-card")
          return "bg-white/15 dark:bg-zinc-900/35 border border-white/20 dark:border-zinc-850 backdrop-blur-md p-6 rounded-2xl shadow-xl";
        if (type === "progress-track")
          return "w-full h-2.5 bg-white/5 border border-white/10 rounded-full overflow-hidden relative backdrop-blur-3xs";
        if (type === "progress-fill")
          return "h-full rounded-full";
        if (type === "stat-box")
          return "bg-white/5 dark:bg-zinc-950/15 border border-white/10 dark:border-zinc-800/25 p-3.5 rounded-xl backdrop-blur-3xs";
        if (type === "textarea")
          return "w-full text-xs min-h-20 bg-white/10 dark:bg-zinc-900/20 border border-white/20 dark:border-zinc-800 backdrop-blur-xs rounded-xl py-2.5 px-4 focus:outline-hidden focus:ring-0 text-zinc-900 dark:text-white leading-relaxed";
        return "";

      case "minimalism":
        if (type === "card-grid-item")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-none transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:-translate-y-0.5";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-none";
        if (type === "progress-track")
          return "w-full h-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-none overflow-hidden relative";
        if (type === "progress-fill")
          return "h-full rounded-none";
        if (type === "stat-box")
          return "bg-transparent border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-none";
        if (type === "textarea")
          return "w-full text-xs min-h-20 bg-transparent border-b border-zinc-200 dark:border-zinc-800 rounded-none py-2 px-1 focus:outline-hidden focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-0 text-zinc-900 dark:text-white leading-relaxed";
        return "";

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "card-grid-item")
          return "bg-white/95 dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/60 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1";
        if (type === "panel-card")
          return "bg-white/95 dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/60 p-6 rounded-3xl shadow-sm";
        if (type === "progress-track")
          return "w-full h-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-200/35 dark:border-zinc-800/40";
        if (type === "progress-fill")
          return "h-full rounded-full";
        if (type === "stat-box")
          return "bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-200/35 dark:border-zinc-800/40";
        if (type === "textarea")
          return "w-full text-xs min-h-20 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-sakode-blue focus:outline-hidden transition-all text-zinc-900 dark:text-white leading-relaxed";
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
        return "p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-300 cursor-pointer";
      case "minimalism":
        return "p-1.5 rounded-none text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer";
      default:
        return "p-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-650 cursor-pointer";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Direktori Mentor
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Kelola profil pendamping belajar, keahlian kurikulum, dan plotting kapasitas murid di Sakode Academy.
          </p>
        </div>
        <UI.Button
          onClick={handleOpenAddModal}
          variant="primary"
          accentColor={selectedColor}
          className="text-xs! py-2! px-4! font-bold! cursor-pointer flex items-center gap-1.5"
        >
          <Icons.UserPlus className="w-4 h-4" />
          Tambah Mentor Baru
        </UI.Button>
      </div>

      {/* Simulator Toolbar */}
      <div className="flex flex-wrap gap-2.5 items-center bg-zinc-100/80 dark:bg-zinc-900/40 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 z-20">
        <span className="text-[10px] text-zinc-500 dark:text-zinc-300 font-bold uppercase tracking-wider pl-2 pr-1">
          Simulator State:
        </span>
        <button
          onClick={() => setSimulationState("default")}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "default"
              ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Default
        </button>
        <button
          onClick={() => {
            setSimulationState("loading");
            setSelectedMentorId(null);
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
            setSelectedMentorId(null);
          }}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "empty"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Empty List
        </button>
        <button
          onClick={() => {
            setSimulationState("error");
            setSelectedMentorId(null);
          }}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "error"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Error API
        </button>
        <button
          onClick={handleResetData}
          title="Reset Data ke Default"
          className="p-1.5 text-zinc-400 hover:text-sakode-orange hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 rounded-lg transition-colors ml-auto cursor-pointer"
        >
          <Icons.Check className="w-3.5 h-3.5 mr-1 inline" />
          Reset Fixtures
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: List / Grid of Mentors */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <UI.Card accentColor={selectedColor}>
            <div className="p-5 flex flex-col gap-5">
              
              {/* Search & Skill / Status filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative flex items-center">
                  <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                  <UI.Input
                    type="text"
                    placeholder="Cari nama atau email mentor..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    accentColor={selectedColor}
                    className="pl-10! text-xs! py-2!"
                  />
                </div>
                <div className="w-full sm:w-40">
                  <UI.Select
                    value={selectedStatus}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
                    accentColor={selectedColor}
                    className="text-xs! py-2! pr-8! pl-3!"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif (Tersedia)</option>
                    <option value="busy">Kapasitas Penuh</option>
                    <option value="inactive">Nonaktif / Cuti</option>
                  </UI.Select>
                </div>
                <div className="w-full sm:w-44">
                  <UI.Select
                    value={selectedSkill}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSkill(e.target.value)}
                    accentColor={selectedColor}
                    className="text-xs! py-2! pr-8! pl-3!"
                  >
                    <option value="all">Semua Keahlian</option>
                    {allUniqueSkills.map((sk) => (
                      <option key={sk} value={sk}>
                        {sk}
                      </option>
                    ))}
                  </UI.Select>
                </div>
              </div>

              {/* Data State Boundary */}
              {simulationState === "loading" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`${getSubElementClass("card-grid-item")} animate-pulse h-36 flex flex-col justify-between`}
                    >
                      <div className="space-y-2">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-2/3 rounded" />
                        <div className="h-3 bg-zinc-205 dark:bg-zinc-850 w-1/2 rounded" />
                      </div>
                      <div className="h-8 bg-zinc-200 dark:bg-zinc-800 w-full rounded" />
                    </div>
                  ))}
                </div>
              ) : simulationState === "error" ? (
                <div className="py-8 text-center bg-rose-500/5 border border-rose-500/15 rounded-2xl p-6 text-xs text-rose-600 font-medium">
                  <Icons.AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  Gagal memuat direktori mentor dari database server.
                </div>
              ) : filteredMentors.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center gap-2">
                  <Icons.Users className="w-8 h-8 text-zinc-300" />
                  <span>Tidak ada mentor yang cocok dengan kriteria pencarian Anda.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMentors.map((m) => {
                    const isSelected = selectedMentorId === m.id;
                    const isFull = m.currentAllocatedStudents >= m.maxCapacity;

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMentorId(m.id)}
                        className={`${getSubElementClass("card-grid-item")} cursor-pointer flex flex-col justify-between text-left relative ${
                          isSelected
                            ? "ring-2 ring-sakode-blue dark:ring-sky-400 bg-zinc-50/40 dark:bg-zinc-900/10"
                            : ""
                        } ${m.status === "inactive" ? "opacity-60" : ""}`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 block">
                              {m.id}
                            </span>
                            <div className="flex items-center gap-1">
                              {m.status === "active" && !isFull && (
                                <UI.Badge variant="success" className="text-[7.5px]! py-0 px-1.5!">
                                  Tersedia
                                </UI.Badge>
                              )}
                              {(m.status === "busy" || isFull) && (
                                <UI.Badge variant="warning" className="text-[7.5px]! py-0 px-1.5!">
                                  Penuh
                                </UI.Badge>
                              )}
                              {m.status === "inactive" && (
                                <UI.Badge variant="default" className="text-[7.5px]! py-0 px-1.5!">
                                  Cuti/Off
                                </UI.Badge>
                              )}
                            </div>
                          </div>

                          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">
                            {m.name}
                          </h3>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-400 block truncate">
                            {m.email}
                          </span>

                          {/* Skill preview */}
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {m.skills.slice(0, 3).map((sk, skIdx) => (
                              <UI.Badge
                                key={skIdx}
                                variant="default"
                                className="text-[8.5px]! py-0.5! px-1.5! font-semibold! rounded!"
                              >
                                {sk}
                              </UI.Badge>
                            ))}
                            {m.skills.length > 3 && (
                              <span className="text-[8px] text-zinc-400 font-bold self-center">
                                +{m.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Capacity indicators */}
                        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-4 flex items-center justify-between text-[10px] font-bold text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Icons.Users className="w-3.5 h-3.5 text-zinc-400" />
                            {m.currentAllocatedStudents}/{m.maxCapacity} Murid
                          </span>
                          <span className="text-[9.5px]">
                            Rating: {m.rating} ★
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

        {/* Right Column: Detailed Inspector Panel */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {!selectedMentor ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UI.Card>
                  <div className="p-8 text-center flex flex-col items-center gap-3">
                    <Icons.UserCheck className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Informasi Profil Detail
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto leading-relaxed">
                      Pilih salah satu profil mentor di sebelah kiri untuk melihat riwayat beban murid, data kontak lengkap, rating, dan keahlian modul.
                    </p>
                  </div>
                </UI.Card>
              </motion.div>
            ) : (
              <motion.div
                key={selectedMentor.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={getSubElementClass("panel-card")}
              >
                <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 block">
                      {selectedMentor.id}
                    </span>
                    <h2 className="text-base md:text-lg font-black text-zinc-900 dark:text-white mt-1 leading-tight">
                      {selectedMentor.name}
                    </h2>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-400 block mt-0.5">
                      Bergabung sejak: {selectedMentor.joinedDate}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <UI.Button
                      onClick={() => handleOpenEditModal(selectedMentor)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="p-2! h-9! w-9! flex items-center justify-center cursor-pointer"
                      title="Ubah Profil"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </UI.Button>
                    <UI.Button
                      onClick={() => setDeletingMentorId(selectedMentor.id)}
                      variant="secondary"
                      accentColor="red"
                      className="p-2! h-9! w-9! flex items-center justify-center cursor-pointer"
                      title="Hapus Mentor"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </UI.Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 text-left text-xs leading-normal">
                  
                  {/* Contact Summary Box */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Informasi Kontak & Bio
                    </h4>
                    <div className={getSubElementClass("stat-box")}>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-zinc-400 font-medium">Email:</span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-150">
                            {selectedMentor.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400 font-medium">No. Telepon:</span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-150">
                            {selectedMentor.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio Paragraph */}
                  <div>
                    <span className="text-[9.5px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                      Deskripsi Profil
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-350 italic font-medium leading-relaxed bg-zinc-50/50 dark:bg-zinc-900/30 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
                      &ldquo;{selectedMentor.bio}&rdquo;
                    </p>
                  </div>

                  {/* Capacity Bar Visual */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-zinc-500 uppercase tracking-wider text-[9.5px]">
                        Plotting Kapasitas Mengajar
                      </span>
                      <span className="font-extrabold text-zinc-800 dark:text-white">
                        {selectedMentor.currentAllocatedStudents} dari {selectedMentor.maxCapacity} Slot Murid
                      </span>
                    </div>

                    <div className={getSubElementClass("progress-track")}>
                      <div
                        className={`${getSubElementClass("progress-fill")} ${getBgClass(selectedColor)}`}
                        style={{
                          width: `${Math.min(
                            100,
                            (selectedMentor.currentAllocatedStudents / selectedMentor.maxCapacity) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    {selectedMentor.currentAllocatedStudents >= selectedMentor.maxCapacity && (
                      <span className="text-[9.5px] text-rose-500 font-bold leading-none mt-0.5 block italic">
                        * Kapasitas mengajar penuh. Hindari plotting murid baru ke mentor ini sementara.
                      </span>
                    )}
                  </div>

                  {/* Skills Grid */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Fokus Keahlian & Teknologi
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMentor.skills.map((s, idx) => (
                        <UI.Badge
                          key={idx}
                          variant="accent"
                          accentColor={selectedColor}
                          className="text-[10px]! font-extrabold!"
                        >
                          {s}
                        </UI.Badge>
                      ))}
                    </div>
                  </div>

                  {/* Extra Stats Cards */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className={getSubElementClass("stat-box") + " flex flex-col gap-0.5"}>
                      <span className="text-[9px] text-zinc-400 font-bold uppercase">Rating Pengajaran</span>
                      <span className="text-base font-black text-zinc-900 dark:text-white">
                        {selectedMentor.rating} / 5.0
                      </span>
                    </div>
                    <div className={getSubElementClass("stat-box") + " flex flex-col gap-0.5"}>
                      <span className="text-[9px] text-zinc-400 font-bold uppercase">Status Ketersediaan</span>
                      <span
                        className={`text-xs font-black uppercase ${
                          selectedMentor.status === "active" &&
                          selectedMentor.currentAllocatedStudents < selectedMentor.maxCapacity
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {selectedMentor.status === "active" &&
                        selectedMentor.currentAllocatedStudents < selectedMentor.maxCapacity
                          ? "Available"
                          : "Busy / Off"}
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 5. INTERACTIVE CRUD MODAL FORMS */}
      
      {/* Add & Edit Mentor Form Modal */}
      <AnimatePresence>
        {(isAddModalOpen || editingMentor) && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg relative"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleSaveMentor} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-200">
                      {editingMentor ? "Ubah Profil Mentor" : "Tambah Mentor Baru"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setEditingMentor(null);
                      }}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 text-xs leading-normal max-h-96 overflow-y-auto pr-1">
                    
                    {/* Basic Info */}
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">Nama Lengkap</label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: Akbar Ramadhan"
                        value={formName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)}
                        accentColor={selectedColor}
                        required
                        className="text-xs! py-2!"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-700 dark:text-zinc-300">Email Utama</label>
                        <UI.Input
                          type="email"
                          placeholder="akbar@sakode.org"
                          value={formEmail}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormEmail(e.target.value)}
                          accentColor={selectedColor}
                          required
                          className="text-xs! py-2!"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-700 dark:text-zinc-300">Nomor Telepon/WA</label>
                        <UI.Input
                          type="tel"
                          placeholder="contoh: +62 81..."
                          value={formPhone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormPhone(e.target.value)}
                          accentColor={selectedColor}
                          required
                          className="text-xs! py-2!"
                        />
                      </div>
                    </div>

                    {/* Expertise & Status */}
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        Keahlian / Skillset (Pisahkan dengan koma)
                      </label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: React, Next.js, Laravel, Tailwind CSS"
                        value={formSkills}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormSkills(e.target.value)}
                        accentColor={selectedColor}
                        required
                        className="text-xs! py-2!"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-700 dark:text-zinc-300">Beban Maksimal</label>
                        <UI.Input
                          type="number"
                          min={1}
                          max={20}
                          value={formMaxCapacity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormMaxCapacity(Number(e.target.value))}
                          accentColor={selectedColor}
                          required
                          className="text-xs! py-2!"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-700 dark:text-zinc-300">Murid Aktif</label>
                        <UI.Input
                          type="number"
                          min={0}
                          max={20}
                          value={formCurrentAllocated}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormCurrentAllocated(Number(e.target.value))}
                          accentColor={selectedColor}
                          required
                          className="text-xs! py-2!"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-700 dark:text-zinc-300">Status Awal</label>
                        <UI.Select
                          value={formStatus}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormStatus(e.target.value as "active" | "inactive" | "busy")}
                          accentColor={selectedColor}
                          className="text-xs! py-2! pr-8! pl-3!"
                        >
                          <option value="active">Active (Aktif)</option>
                          <option value="busy">Busy (Sibuk)</option>
                          <option value="inactive">Inactive (Cuti)</option>
                        </UI.Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-700 dark:text-zinc-300">Rating Awal (1-5)</label>
                        <UI.Input
                          type="number"
                          step="0.1"
                          min={1}
                          max={5}
                          value={formRating}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormRating(Number(e.target.value))}
                          accentColor={selectedColor}
                          required
                          className="text-xs! py-2!"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">Bio Ringkas Mentor</label>
                      <textarea
                        placeholder="Tuliskan pengalaman mengajar singkat..."
                        value={formBio}
                        onChange={(e) => setFormBio(e.target.value)}
                        className={getSubElementClass("textarea")}
                        rows={3}
                      />
                    </div>

                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <UI.Button
                      type="button"
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setEditingMentor(null);
                      }}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor={selectedColor}
                      isLoading={isActionLoading}
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Simpan Profil
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingMentorId && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative"
            >
              <UI.Card accentColor="red">
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600">
                      Hapus Mentor
                    </h3>
                    <button
                      onClick={() => setDeletingMentorId(null)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 py-1 text-xs">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-150">
                      Apakah Anda yakin ingin menghapus mentor ini dari sistem akademik?
                    </p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">
                      * Aksi ini akan menghapus seluruh data keahlian dan rating mentor tersebut secara permanen.
                    </p>
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <UI.Button
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => setDeletingMentorId(null)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      variant="primary"
                      accentColor="red"
                      onClick={handleDeleteMentor}
                      isLoading={isActionLoading}
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

      {/* Success/Error Toast Notifications */}
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
                    <Icons.Check className="w-4 h-4 text-emerald-600 dark:text-emerald-455" />
                  ) : (
                    <Icons.AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-455" />
                  )}
                </div>
                <div className="flex-1 font-semibold text-zinc-800 dark:text-zinc-200">
                  {toastMessage.text}
                </div>
                <button
                  onClick={() => setToastMessage(null)}
                  className="shrink-0 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
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
