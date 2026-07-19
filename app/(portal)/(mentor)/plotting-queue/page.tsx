"use client";

/**
 * FE-SLICE-019 — Scoped Mentor Plotting Queue Page
 *
 * Scope: Mentor Lead
 * Route: /plotting-queue
 *
 * Features:
 *  - Title & Context description (scoped to Web Development domain)
 *  - Queue Filters (search, priority filter, mode filter)
 *  - Selected Student Context Details Card
 *  - Eligible Mentor capacity matching table with compatibility scores, ratings, workload indicator
 *  - Workload Overload Warning and group allotment validation rules
 *  - Confirmation Dialog with custom input notes
 *  - Realistic simulation loading overlays and action feedback
 */

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBorderRadiusClass } from "@/UI/shared/color-utils";
import { useToast, Toast } from "@/app/_components/Toast";
import {
  getScopedStudents,
  getScopedMentors,
  saveScopedStudents,
  saveScopedMentors,
  resetScopedData,
  type ScopedStudent,
  type ScopedMentor,
} from "@/app/_data/plottingQueueService";

export default function PlottingQueuePage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // 1. Data States
  const [students, setStudents] = useState<ScopedStudent[]>([]);
  const [mentors, setMentors] = useState<ScopedMentor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [scheduleFilter, setScheduleFilter] = useState("all");

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  // 2. Action States
  const [isConfirming, setIsConfirming] = useState(false);
  const [actionNotes, setActionNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, showToast, setToast } = useToast();

  // Load Initial Data
  useEffect(() => {
    setStudents(getScopedStudents());
    setMentors(getScopedMentors());
  }, []);

  // Reset Handler
  const handleReset = () => {
    resetScopedData();
    setStudents(getScopedStudents());
    setMentors(getScopedMentors());
    setSelectedStudentId(null);
    setSelectedMentorId(null);
    setSearchQuery("");
    setPriorityFilter("all");
    setModeFilter("all");
    setScheduleFilter("all");
    showToast("Data antrean plotting di-reset ke kondisi awal.");
  };

  // Student filtering
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPriority = priorityFilter === "all" || s.priority === priorityFilter;
      const matchMode = modeFilter === "all" || s.learningMode === modeFilter;
      
      let matchSchedule = true;
      if (scheduleFilter !== "all") {
        matchSchedule = s.preferredSchedule.toLowerCase().includes(scheduleFilter.toLowerCase());
      }

      return matchSearch && matchPriority && matchMode && matchSchedule;
    });
  }, [students, searchQuery, priorityFilter, modeFilter, scheduleFilter]);

  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  const activeMentor = useMemo(() => {
    return mentors.find((m) => m.id === selectedMentorId) || null;
  }, [mentors, selectedMentorId]);

  // Handle Plotting Submission
  const handleConfirmPlotting = () => {
    if (!activeStudent || !activeMentor) return;

    // Workload check
    if (activeMentor.activeStudents >= activeMentor.slotLimit) {
      showToast(`Beban mentor ${activeMentor.name} penuh! Plotting dibatalkan.`, "error");
      setIsConfirming(false);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // 1. Update Student list: remove student from queue
      const updatedStudents = students.filter((s) => s.id !== activeStudent.id);
      setStudents(updatedStudents);
      saveScopedStudents(updatedStudents);

      // 2. Update Mentor status: increment activeStudents slot by 1 (Group count counts as 1 slot per business rules)
      const updatedMentors = mentors.map((m) => {
        if (m.id === activeMentor.id) {
          const nextCount = m.activeStudents + 1;
          return {
            ...m,
            activeStudents: nextCount,
            availability: nextCount >= m.slotLimit ? "Sibuk (Penuh)" as const : "Hampir Penuh" as const,
          };
        }
        return m;
      });
      setMentors(updatedMentors);
      saveScopedMentors(updatedMentors);

      setSelectedStudentId(null);
      setSelectedMentorId(null);
      setActionNotes("");
      setIsConfirming(false);
      setLoading(false);

      showToast(`Plotting Sukses! ${activeStudent.name} telah didelegasikan ke Mentor ${activeMentor.name}.`);
    }, 900);
  };

  // Sub-element style helpers
  const innerCard = () => {
    switch (selectedStyle) {
      case "neobrutalism":
        return "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
      case "claymorphism":
        return "bg-slate-50 dark:bg-zinc-900 border border-slate-200/20 dark:border-zinc-800/45 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)] rounded-2xl";
      case "glassmorphism":
      case "liquid-glass":
        return "bg-white/10 dark:bg-zinc-950/20 border border-white/10 backdrop-blur-md rounded-2xl shadow-xs";
      case "minimalism":
        return "bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 rounded-lg";
      default:
        return "bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-3xs";
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left py-4 pb-16 relative">
      
      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">
            Workspace Plotting Mentor Lead
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Alokasikan pendamping bimbingan murid dalam lingkup domain pengajaran: <strong>Web Development (React & Next.js)</strong>.
          </p>
        </div>
        <UI.Button
          variant="secondary"
          accentColor={selectedColor}
          onClick={handleReset}
          className="text-xs! py-2! px-4! h-auto! cursor-pointer shrink-0 font-bold!"
        >
          Reset Data Demo
        </UI.Button>
      </div>

      {/* Main Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Side: Student List & Filter (col-span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className={`${innerCard()} p-4 flex flex-col gap-3.5`}>
                        {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama, program, cabang, atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 py-2.5 pl-9 pr-4 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-hidden focus:border-zinc-400 focus:dark:border-zinc-600 transition-colors"
              />
              <Icons.Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-3.5" />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1 text-[9px] font-black uppercase text-zinc-450 tracking-wider">
                <span>Prioritas</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-zinc-100/65 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800/80 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-250 cursor-pointer outline-hidden"
                >
                  <option value="all">Semua</option>
                  <option value="Mendesak">Mendesak</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Sedang">Sedang</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 text-[9px] font-black uppercase text-zinc-450 tracking-wider">
                <span>Skema</span>
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="bg-zinc-100/65 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800/80 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-250 cursor-pointer outline-hidden"
                >
                  <option value="all">Semua</option>
                  <option value="Private">Private</option>
                  <option value="Group">Kelompok</option>
                  <option value="Trial">Trial</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 text-[9px] font-black uppercase text-zinc-450 tracking-wider">
                <span>Jadwal</span>
                <select
                  value={scheduleFilter}
                  onChange={(e) => setScheduleFilter(e.target.value)}
                  className="bg-zinc-100/65 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800/80 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-250 cursor-pointer outline-hidden"
                >
                  <option value="all">Semua</option>
                  <option value="pagi">Pagi</option>
                  <option value="sore">Sore</option>
                  <option value="malam">Malam</option>
                </select>
              </div>
            </div>

          </div>

          {/* Student queue container cards */}
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredStudents.length === 0 ? (
              <div className={`${innerCard()} p-8 text-center text-xs text-zinc-400`}>
                Tidak ada antrean murid yang sesuai dengan filter.
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = selectedStudentId === student.id;
                return (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setSelectedMentorId(null);
                    }}
                    className={`w-full text-left p-4.5 border transition-all ${getBorderRadiusClass(selectedStyle)} ${
                      isSelected
                        ? `bg-${selectedColor}-500/10 border-${selectedColor}-500/40 text-${selectedColor}-900 dark:text-${selectedColor}-100`
                        : "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/50 hover:border-zinc-350 hover:dark:border-zinc-700"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-100">{student.name}</h4>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                        student.priority === "Mendesak" ? "bg-red-500/10 text-red-700 dark:text-red-300" :
                        student.priority === "Tinggi" ? "bg-orange-500/10 text-orange-700 dark:text-orange-300" :
                        "bg-blue-500/10 text-blue-700 dark:text-blue-300"
                      }`}>
                        {student.priority}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-1">{student.course}</p>
                    <div className="flex justify-between items-center mt-3 text-[9px] font-bold text-zinc-450 dark:text-zinc-500">
                      <span>Cabang: {student.branch}</span>
                      <span>{student.registeredAt}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Mentor Match Workspace (col-span 7) */}
        <div className="lg:col-span-7">
          {!activeStudent ? (
            <div className={`${innerCard()} p-12 text-center h-full flex flex-col justify-center items-center gap-3`}>
              <Icons.UserCheck className="w-12 h-12 text-zinc-300 dark:text-zinc-700 animate-pulse" />
              <h3 className="text-sm font-black text-zinc-700 dark:text-zinc-300">Pilih Murid dari Antrean</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Silakan pilih salah satu siswa baru di panel kiri untuk menganalisis riwayat pendaftaran, status konversi trial, dan mencocokkan mentor pendamping yang sesuai.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">

              {/* Selected Student Information Banner */}
              <div className={`${innerCard()} p-5 flex flex-col gap-4.5`}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">ID Registrasi: {activeStudent.id}</span>
                    <h2 className="text-base font-black text-zinc-850 dark:text-white mt-1">{activeStudent.name}</h2>
                    <p className="text-xs font-black text-sakode-blue mt-0.5">{activeStudent.course}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase text-zinc-400 block">Status Pembayaran</span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                      activeStudent.paymentStatus === "Lunas" 
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                    }`}>
                      {activeStudent.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3.5 border-t border-zinc-200/50 dark:border-zinc-800/50 text-xs font-semibold">
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">Tempat Belajar</span>
                    <span className="text-zinc-700 dark:text-zinc-300 block mt-1">{activeStudent.branch}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">Metode Belajar</span>
                    <span className="text-zinc-700 dark:text-zinc-300 block mt-1">{activeStudent.learningMode}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">Status Konversi</span>
                    <span className="text-zinc-700 dark:text-zinc-300 block mt-1">
                      {activeStudent.isConversion ? "Conversion (Eks-Trial)" : "Siswa Reguler Baru"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">Kontak Email</span>
                    <span className="text-zinc-700 dark:text-zinc-300 block mt-1 break-all">{activeStudent.email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">No. Handphone</span>
                    <span className="text-zinc-700 dark:text-zinc-300 block mt-1">{activeStudent.phone}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">Preferensi Jadwal</span>
                    <span className="text-zinc-700 dark:text-zinc-300 block mt-1">{activeStudent.preferredSchedule}</span>
                  </div>
                </div>

                {/* Home Visit / Group Basecamp Address Details */}
                <div className="bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/25 p-3.5 rounded-xl text-xs flex flex-col gap-1.5">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider flex items-center gap-1.5">
                      <Icons.MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {activeStudent.learningMode === "Group" ? "Alamat Belajar Kelompok" : "Alamat Kunjungan Rumah"}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeStudent.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] font-black uppercase tracking-wider text-sakode-blue hover:underline flex items-center gap-1"
                    >
                      Buka Peta
                      <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                  <p className="font-extrabold text-zinc-850 dark:text-zinc-200 pl-5 leading-relaxed">
                    {activeStudent.address}
                  </p>
                </div>

                {/* Group Details with count badge and roster list */}
                {activeStudent.learningMode === "Group" && activeStudent.groupMembers && (
                  <div className="bg-purple-500/10 dark:bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl text-xs flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-purple-700 dark:text-purple-400">Detail Anggota Belajar Kelompok</span>
                      <span className="text-[8.5px] font-black uppercase bg-purple-500/20 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded">
                        Total: {activeStudent.groupMembers.length + 1} Peserta
                      </span>
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      <p className="font-bold">Ketua Kelompok (Pendaftar Utama):</p>
                      <ul className="list-disc pl-5 mt-1 mb-2 font-black text-zinc-700 dark:text-zinc-300">
                        <li>{activeStudent.name} (Pendaftar)</li>
                      </ul>
                      <p className="font-bold">Anggota Kelompok:</p>
                      <ul className="list-disc pl-5 mt-1 font-semibold">
                        {activeStudent.groupMembers.map((member, idx) => (
                          <li key={idx}>{member}</li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-2.5">
                        ⚠ Poin Alokasi Mentor: Sesuai aturan plotting kelompok, seluruh bimbingan kelompok di atas hanya memakan 1 slot kapasitas beban pada mentor yang ditugaskan.
                      </p>
                    </div>
                  </div>
                )}

                {/* Trial Conversion Suggestion banner */}
                {activeStudent.isConversion && activeStudent.previousTrialMentorId && (
                  <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/25 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                    <Icons.Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-amber-700 dark:text-amber-400 block">Rekomendasi Konversi Trial</span>
                      <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        Murid ini lulus dari program trial. Sangat disarankan untuk dialokasikan kembali ke Mentor **Rian Hidayat** (bimbingan trial sebelumnya) guna memelihara kesinambungan materi.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mentor Match Table list */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Daftar Mentor Domain Terkait
                </h3>

                <div className="flex flex-col gap-3">
                  {mentors.map((mentor) => {
                    const isSelected = selectedMentorId === mentor.id;
                    const isPrevTrial = activeStudent.isConversion && activeStudent.previousTrialMentorId === mentor.id;
                    const fillPct = Math.round((mentor.activeStudents / mentor.slotLimit) * 100);
                    const isFull = mentor.activeStudents >= mentor.slotLimit;

                    return (
                      <div
                        key={mentor.id}
                        onClick={() => {
                          if (!isFull) setSelectedMentorId(mentor.id);
                        }}
                        className={`p-4 border transition-all flex flex-col gap-3.5 text-xs ${getBorderRadiusClass(selectedStyle)} ${
                          isFull
                            ? "bg-zinc-50 dark:bg-zinc-950/20 border-zinc-150 dark:border-zinc-850 opacity-60 cursor-not-allowed"
                            : isSelected
                              ? `bg-${selectedColor}-500/10 border-${selectedColor}-500/40 cursor-pointer`
                              : "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/50 hover:border-zinc-300 cursor-pointer"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-black text-zinc-800 dark:text-zinc-100">{mentor.name}</h4>
                              {isPrevTrial && (
                                <span className="text-[8px] font-black uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
                                  Trial Mentor (Rekomendasi Utama)
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-1">
                              Skills: {mentor.skills.join(", ")}
                            </p>
                          </div>
                          <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                            <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md ${
                              isFull ? "text-red-700 bg-red-500/10 border border-red-500/20" :
                              mentor.activeStudents >= 8 ? "text-amber-700 bg-amber-500/10 border border-amber-500/20" :
                              "text-emerald-700 bg-emerald-500/10 border border-emerald-500/20"
                            }`}>
                              {isFull ? "Penuh (Overloaded)" : mentor.availability}
                            </span>
                            <span className="text-[10px] font-black text-zinc-500 tabular-nums">
                              {mentor.activeStudents}/{mentor.slotLimit} Siswa
                            </span>
                          </div>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isFull ? getBgClass("red") :
                              mentor.activeStudents >= 8 ? getBgClass("orange") :
                              getBgClass(selectedColor)
                            }`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>

                        {/* Rating Metrics row */}
                        <div className="flex justify-between items-center text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Icons.Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            {mentor.rating.toFixed(1)} Rating Mengajar
                          </span>
                          <span>Bimbingan Trial Sukses: {mentor.trialStudentsTaught} Siswa</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button Trigger */}
              <div className="flex justify-end pt-2">
                <UI.Button
                  variant="primary"
                  accentColor={selectedColor}
                  disabled={!selectedMentorId}
                  onClick={() => setIsConfirming(true)}
                  className="font-black! cursor-pointer text-xs! py-3! px-6!"
                >
                  Proses Plotting Murid
                </UI.Button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Confirmation Dialog Overlay */}
      {isConfirming && activeStudent && activeMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`${innerCard()} max-w-md w-full p-6 text-left flex flex-col gap-4 relative animate-fade-in`}>
            
            {/* Close */}
            <button 
              onClick={() => setIsConfirming(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <Icons.X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                Konfirmasi Plotting Mentor
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Harap verifikasi parameter alokasi berikut sebelum menyimpan perubahan.
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950/20 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3 text-xs">
              <div>
                <span className="font-bold text-zinc-400 dark:text-zinc-500">Nama Murid:</span>
                <p className="font-black text-zinc-800 dark:text-zinc-100 mt-0.5">{activeStudent.name}</p>
              </div>
              <div>
                <span className="font-bold text-zinc-400 dark:text-zinc-500">Mentor Pendamping:</span>
                <p className="font-black text-sakode-blue mt-0.5">{activeMentor.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-zinc-400 dark:text-zinc-500">Skema:</span>
                  <p className="font-black text-zinc-700 dark:text-zinc-300 mt-0.5">{activeStudent.learningMode}</p>
                </div>
                <div>
                  <span className="font-bold text-zinc-400 dark:text-zinc-500">Sisa Kapasitas:</span>
                  <p className="font-black text-zinc-700 dark:text-zinc-300 mt-0.5">
                    {activeMentor.slotLimit - activeMentor.activeStudents - 1} Slot Tersedia
                  </p>
                </div>
              </div>
            </div>

            {/* Form Input Notes */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label htmlFor="notes" className="font-black text-zinc-650 dark:text-zinc-350">
                Catatan Penugasan (Opsional)
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Masukkan catatan instruksi belajar, materi awal, atau detail jadwal untuk mentor..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-3 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-hidden focus:border-zinc-400 focus:dark:border-zinc-600 transition-colors resize-none"
              />
            </div>

            {/* Dialog Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <UI.Button
                variant="secondary"
                accentColor={selectedColor}
                disabled={loading}
                onClick={() => setIsConfirming(false)}
                className="font-bold! cursor-pointer text-xs!"
              >
                Batalkan
              </UI.Button>
              <UI.Button
                variant="primary"
                accentColor={selectedColor}
                disabled={loading}
                onClick={handleConfirmPlotting}
                className="font-black! cursor-pointer text-xs!"
              >
                {loading ? "Menyimpan..." : "Simpan & Plotting"}
              </UI.Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
