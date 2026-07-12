"use client";

/**
 * FE-SLICE-020 — Scoped Schedule Management Page
 *
 * Scope: Mentor Lead
 * Route: /schedules-lead
 *
 * Features:
 *  - Agenda List and Calendar Month Overview
 *  - Mentor & Student filter selectors (with resetting indicators)
 *  - Create & Edit Session Modal dialogs
 *  - Overlap Conflict detection simulator (mentor/student schedule checks)
 *  - Scoped Notice reminding the Lead of unavailable global actions (Admin-only locks)
 *  - Full CRUD simulation saved directly into LocalStorage
 */

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBorderRadiusClass } from "@/UI/shared/color-utils";
import {
  getScopedSessions,
  getCompactMentors,
  getCompactStudents,
  saveScopedSessions,
  resetSessionsData,
  checkScheduleConflict,
  type ScopedSession,
  type CompactMentor,
  type CompactStudent,
} from "./_mocks/schedulesLeadService";

export default function ScopedSchedulesLeadPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // 1. Data States
  const [sessions, setSessions] = useState<ScopedSession[]>([]);
  const [mentors, setMentors] = useState<CompactMentor[]>([]);
  const [students, setStudents] = useState<CompactStudent[]>([]);

  // 2. Filter States
  const [selectedMentorFilter, setSelectedMentorFilter] = useState("all");
  const [selectedStudentFilter, setSelectedStudentFilter] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  // 3. UI states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ScopedSession | null>(null);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);

  // 4. Form States
  const [formMentorId, setFormMentorId] = useState("");
  const [formStudentId, setFormStudentId] = useState("");
  const [formTopic, setFormTopic] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formMode, setFormMode] = useState<"1-on-1" | "Kelompok">("1-on-1");
  const [formBranch, setFormBranch] = useState("");
  const [formAddress, setFormAddress] = useState("");

  // Conflict warning feedback simulator
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    setSessions(getScopedSessions());
    setMentors(getCompactMentors());
    setStudents(getCompactStudents());
  }, []);

  const triggerToast = (text: string, type: "success" | "error" | "warning" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleResetDemo = () => {
    resetSessionsData();
    setSessions(getScopedSessions());
    setSelectedMentorFilter("all");
    setSelectedStudentFilter("all");
    setSelectedDateFilter("");
    triggerToast("Data jadwal di-reset ke kondisi default.");
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingSession(null);
    setFormMentorId(mentors[0]?.id || "");
    setFormStudentId(students[0]?.id || "");
    setFormTopic("");
    setFormDate("2026-07-10");
    setFormStartTime("13:00");
    setFormEndTime("14:30");
    setFormMode("1-on-1");
    setFormBranch("Yogyakarta (Kota)");
    setFormAddress("Jl. Kaliurang KM 5.2, No. 12, Sleman");
    setConflictWarning(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (session: ScopedSession) => {
    setEditingSession(session);
    setFormMentorId(session.mentorId);
    setFormStudentId(session.studentId);
    setFormTopic(session.topic);
    setFormDate(session.date);
    setFormStartTime(session.startTime);
    setFormEndTime(session.endTime);
    setFormMode(session.mode);
    setFormBranch(session.branch);
    setFormAddress(session.address);
    setConflictWarning(null);
    setIsModalOpen(true);
  };

  // Watch form values to run real-time conflict simulations
  useEffect(() => {
    if (!isModalOpen || !formMentorId || !formStudentId || !formDate || !formStartTime || !formEndTime) {
      setConflictWarning(null);
      return;
    }
    const conflict = checkScheduleConflict(
      sessions,
      formDate,
      formStartTime,
      formEndTime,
      formMentorId,
      formStudentId,
      editingSession?.id
    );
    if (conflict) {
      setConflictWarning(conflict.message);
    } else {
      setConflictWarning(null);
    }
  }, [isModalOpen, formMentorId, formStudentId, formDate, formStartTime, formEndTime, sessions, editingSession]);

  // Handle Save
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTopic.trim() || !formDate || !formStartTime || !formEndTime) {
      triggerToast("Mohon isi seluruh parameter wajib.", "error");
      return;
    }

    // Final conflict check block
    const conflict = checkScheduleConflict(
      sessions,
      formDate,
      formStartTime,
      formEndTime,
      formMentorId,
      formStudentId,
      editingSession?.id
    );

    if (conflict) {
      triggerToast(conflict.message, "error");
      return;
    }

    const matchedMentor = mentors.find((m) => m.id === formMentorId);
    const matchedStudent = students.find((s) => s.id === formStudentId);

    if (!matchedMentor || !matchedStudent) return;

    let updatedSessions: ScopedSession[] = [];

    if (editingSession) {
      // Edit mode
      updatedSessions = sessions.map((s) => {
        if (s.id === editingSession.id) {
          return {
            ...s,
            mentorId: formMentorId,
            mentorName: matchedMentor.name,
            studentId: formStudentId,
            studentName: matchedStudent.name,
            topic: formTopic,
            date: formDate,
            startTime: formStartTime,
            endTime: formEndTime,
            mode: formMode,
            branch: formBranch,
            address: formAddress,
          };
        }
        return s;
      });
      triggerToast("Sesi mentoring berhasil diperbarui.");
    } else {
      // Create mode
      const newSession: ScopedSession = {
        id: `ses-${Date.now()}`,
        mentorId: formMentorId,
        mentorName: matchedMentor.name,
        studentId: formStudentId,
        studentName: matchedStudent.name,
        topic: formTopic,
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        mode: formMode,
        branch: formBranch,
        address: formAddress,
      };
      updatedSessions = [...sessions, newSession];
      triggerToast("Sesi mentoring baru berhasil dijadwalkan.");
    }

    setSessions(updatedSessions);
    saveScopedSessions(updatedSessions);
    setIsModalOpen(false);
  };

  // Delete Handler
  const handleDeleteSession = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal bimbingan ini?")) {
      const updated = sessions.filter((s) => s.id !== id);
      setSessions(updated);
      saveScopedSessions(updated);
      triggerToast("Jadwal bimbingan telah dihapus.", "warning");
    }
  };

  // Filter computation
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchMentor = selectedMentorFilter === "all" || s.mentorId === selectedMentorFilter;
      const matchStudent = selectedStudentFilter === "all" || s.studentId === selectedStudentFilter;
      const matchDate = !selectedDateFilter || s.date === selectedDateFilter;
      return matchMentor && matchStudent && matchDate;
    });
  }, [sessions, selectedMentorFilter, selectedStudentFilter, selectedDateFilter]);

  // Card theme helper
  const innerCard = () => {
    switch (selectedStyle) {
      case "neobrutalism":
        return "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
      case "claymorphism":
        return "bg-slate-50 dark:bg-zinc-900 border border-slate-200/20 dark:border-zinc-800/40 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)] rounded-2xl";
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
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-black transition-all ${
          toast.type === "success" 
            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20" 
            : toast.type === "warning"
              ? "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20"
              : "bg-red-500/10 text-red-800 dark:text-red-300 border-red-500/20"
        }`}>
          {toast.type === "success" && <Icons.Check className="w-4 h-4 text-emerald-500" />}
          {toast.type === "warning" && <Icons.AlertCircle className="w-4 h-4 text-amber-500" />}
          {toast.type === "error" && <Icons.AlertCircle className="w-4 h-4 text-red-500" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">
            Kelola Jadwal Bimbingan Scoped
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pantau kalender mengajar, verifikasi ketersediaan jadwal slot, dan plotting jadwal sesi offline di domain Web Development.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UI.Button
            variant="secondary"
            accentColor={selectedColor}
            onClick={handleResetDemo}
            className="text-xs! py-2! px-4! h-auto! cursor-pointer font-bold!"
          >
            Reset Demo
          </UI.Button>
          <UI.Button
            variant="primary"
            accentColor={selectedColor}
            onClick={handleOpenCreateModal}
            className="text-xs! py-2! px-4! h-auto! cursor-pointer font-black!"
          >
            Jadwalkan Sesi +
          </UI.Button>
        </div>
      </div>

      {/* Admin Action Scoped Banner Warning */}
      <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-xs flex items-start gap-3">
        <Icons.Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-black text-amber-700 dark:text-amber-400">Pemberitahuan Hak Akses (Lead Scope)</span>
          <p className="text-zinc-550 dark:text-zinc-405 mt-1 leading-relaxed">
            Sebagai Mentor Lead, Anda hanya dapat menjadwalkan sesi bimbingan untuk <strong>mentor & murid yang berada di bawah lingkup pengajaran Anda</strong>. 
            Modifikasi data kurikulum program bootcamp global, pembuatan mentor baru, atau penugasan lintas domain di luar Web Development hanya dapat dilakukan oleh **Super Admin**.
          </p>
        </div>
      </div>

      {/* Filters row panel */}
      <div className={`${innerCard()} p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs`}>
        <div className="flex flex-col gap-1">
          <label className="font-black uppercase text-zinc-400 tracking-wider text-[9.5px]">Filter Mentor</label>
          <select
            value={selectedMentorFilter}
            onChange={(e) => setSelectedMentorFilter(e.target.value)}
            className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl font-bold cursor-pointer outline-hidden"
          >
            <option value="all">Semua Mentor Aktif</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-black uppercase text-zinc-400 tracking-wider text-[9.5px]">Filter Murid</label>
          <select
            value={selectedStudentFilter}
            onChange={(e) => setSelectedStudentFilter(e.target.value)}
            className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl font-bold cursor-pointer outline-hidden"
          >
            <option value="all">Semua Murid</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-black uppercase text-zinc-400 tracking-wider text-[9.5px]">Filter Tanggal Sesi</label>
          <input
            type="date"
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl font-bold cursor-pointer outline-hidden"
          />
        </div>
      </div>

      {/* Agenda & Sessions display grid */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          Agenda Jadwal Sesi Terdekat
        </h3>

        {filteredSessions.length === 0 ? (
          <div className={`${innerCard()} p-12 text-center text-xs text-zinc-400 flex flex-col gap-2 justify-center items-center`}>
            <Icons.Calendar className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
            <span>Tidak ada sesi mentoring terjadwal yang sesuai filter pencarian.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                id={`session-card-${session.id}`}
                className={`${innerCard()} p-5 flex flex-col justify-between gap-5 relative`}
              >
                <div>
                  {/* Top Mode Header */}
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-800 dark:text-zinc-100 tabular-nums">
                      📅 {session.date}
                    </span>
                    <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border ${
                      session.mode === "Kelompok"
                        ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20"
                        : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                    }`}>
                      {session.mode}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-zinc-900 dark:text-white mt-3 leading-snug">
                    {session.topic}
                  </h4>

                  {/* Main mapping details */}
                  <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-zinc-400">Mentor</span>
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-200">{session.mentorName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-zinc-400">Murid / Kelompok</span>
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-200">{session.studentName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-zinc-400">Waktu Belajar</span>
                      <span className="font-extrabold text-sakode-blue flex items-center gap-1 mt-0.5">
                        <Icons.Clock className="w-3.5 h-3.5" />
                        {session.startTime} - {session.endTime} WIB
                      </span>
                    </div>
                    <div className="mt-1 bg-zinc-100/50 dark:bg-zinc-800/30 p-2.5 rounded-lg border border-zinc-200/25">
                      <span className="text-[9px] uppercase tracking-wider block text-zinc-450 flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        Tujuan Belajar ({session.branch})
                      </span>
                      <p className="font-extrabold text-zinc-700 dark:text-zinc-350 mt-1 leading-snug break-words">
                        {session.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Panel */}
                <div className="flex justify-end items-center gap-2 border-t border-zinc-150/40 dark:border-zinc-800/40 pt-3">
                  <button
                    onClick={() => handleOpenEditModal(session)}
                    className="p-1.5 text-zinc-400 hover:text-sakode-blue hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                    aria-label="Ubah jadwal"
                  >
                    <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                    aria-label="Hapus jadwal"
                  >
                    <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleSaveSession}
            className={`${innerCard()} max-w-lg w-full p-6 text-left flex flex-col gap-4 relative animate-fade-in`}
          >
            
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                {editingSession ? "Edit Jadwal Sesi" : "Jadwalkan Sesi Baru"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Lengkapi rincian sesi offline di bawah ini. Konflik jadwal akan dideteksi secara real-time.
              </p>
            </div>

            {/* Dynamic Conflict Alert Banner */}
            {conflictWarning && (
              <div className="bg-red-500/10 border border-red-500/25 p-3 rounded-xl text-xs text-red-800 dark:text-red-300 font-extrabold flex items-start gap-2">
                <Icons.AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-600 dark:text-zinc-300 font-black">Pilih Mentor</label>
                <select
                  value={formMentorId}
                  onChange={(e) => setFormMentorId(e.target.value)}
                  className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl cursor-pointer outline-hidden font-bold"
                >
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-600 dark:text-zinc-300 font-black">Pilih Murid</label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl cursor-pointer outline-hidden font-bold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs font-semibold">
              <label className="text-zinc-600 dark:text-zinc-300 font-black">Topik Pembelajaran</label>
              <input
                type="text"
                placeholder="Misal: React Context API & Redux Toolkit..."
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl outline-hidden font-bold text-zinc-800 dark:text-zinc-100"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
              <div className="flex flex-col gap-1.5 col-span-1">
                <label className="text-zinc-600 dark:text-zinc-300 font-black">Tanggal</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl outline-hidden font-bold text-zinc-800 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-600 dark:text-zinc-300 font-black">Mulai Sesi</label>
                <input
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl outline-hidden font-bold text-zinc-800 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-600 dark:text-zinc-300 font-black">Selesai Sesi</label>
                <input
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                  className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl outline-hidden font-bold text-zinc-800 dark:text-zinc-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-600 dark:text-zinc-300 font-black">Skema Sesi</label>
                <select
                  value={formMode}
                  onChange={(e) => setFormMode(e.target.value as "1-on-1" | "Kelompok")}
                  className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl cursor-pointer outline-hidden font-bold"
                >
                  <option value="1-on-1">1-on-1 (Private / Trial)</option>
                  <option value="Kelompok">Kelompok (Group Learning)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-600 dark:text-zinc-300 font-black">Cabang Belajar</label>
                <input
                  type="text"
                  placeholder="Misal: Yogyakarta (Sleman)..."
                  value={formBranch}
                  onChange={(e) => setFormBranch(e.target.value)}
                  className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl outline-hidden font-bold text-zinc-800 dark:text-zinc-100"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs font-semibold">
              <label className="text-zinc-600 dark:text-zinc-300 font-black">Alamat Detail Belajar</label>
              <input
                type="text"
                placeholder="Jl. Kaliurang KM 10, Sleman..."
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl outline-hidden font-bold text-zinc-800 dark:text-zinc-100"
                required
              />
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <UI.Button
                variant="secondary"
                accentColor={selectedColor}
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="font-bold! cursor-pointer text-xs!"
              >
                Batalkan
              </UI.Button>
              <UI.Button
                variant="primary"
                accentColor={selectedColor}
                type="submit"
                disabled={!!conflictWarning}
                className="font-black! cursor-pointer text-xs!"
              >
                {editingSession ? "Simpan Perubahan" : "Jadwalkan Sesi"}
              </UI.Button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
