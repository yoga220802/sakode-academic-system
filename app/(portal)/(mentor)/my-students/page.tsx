"use client";

/**
 * FE-SLICE-022 — Mentor Assigned Students Workspace
 *
 * Scope: Mentor
 * Route: /my-students
 *
 * Features:
 *  - "Hanya Bimbingan Saya" (Only My Assignments) Context Banner
 *  - Searchable list of assigned students (left pane)
 *  - Interactive student selector mapping details (right pane)
 *  - Detailed Contact parameters: ID, email, phone, schedule preferences
 *  - Maps integration ("Buka Peta" Google Maps anchor redirections)
 *  - Course Module Task Checklist and grades summary
 *  - Group Learning roster bullet lists and total member counts
 *  - Simulation Scenario toggler: default | loading skeleton | empty list
 */

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBorderRadiusClass } from "@/UI/shared/color-utils";
import {
  fetchAssignedStudents,
  type DetailedAssignedStudent,
  type StudentTaskLog,
} from "./_mocks/myStudentsService";

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg ${className ?? ""}`} />;
}

function MyStudentsSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <SkeletonBlock className="h-14 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-3">
          <SkeletonBlock className="h-10 w-full" />
          {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-20" />)}
        </div>
        <div className="lg:col-span-7 flex flex-col gap-4">
          <SkeletonBlock className="h-56" />
          <SkeletonBlock className="h-44" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MyStudentsPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // 1. Data States
  const [students, setStudents] = useState<DetailedAssignedStudent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // 2. Simulation States
  const [scenario, setScenario] = useState<"default" | "loading" | "empty">("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (scenario === "loading") {
      setLoading(true);
      return;
    }
    if (scenario === "empty") {
      setStudents([]);
      setSelectedStudentId(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchAssignedStudents().then((res) => {
      setStudents(res);
      if (res.length > 0) {
        setSelectedStudentId(res[0].id);
      }
      setLoading(false);
    });
  }, [scenario]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.branch.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [students, searchQuery]);

  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

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

  const scopeBanner = () => {
    switch (selectedStyle) {
      case "neobrutalism":
        return "bg-sky-100 dark:bg-sky-950/20 border-2 border-zinc-900 dark:border-white rounded-none font-mono";
      case "claymorphism":
        return "bg-sky-50/50 dark:bg-sky-950/10 border border-sky-350/20 shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.02)] rounded-3xl";
      case "glassmorphism":
      case "liquid-glass":
        return "bg-sky-500/10 dark:bg-sky-500/5 border border-white/10 backdrop-blur-md rounded-2xl";
      case "minimalism":
        return "bg-zinc-100/50 dark:bg-zinc-900/50 border-l-4 border-sky-500 rounded-r-lg";
      default:
        return "bg-sky-500/8 dark:bg-sky-500/5 border border-sky-500/20 rounded-2xl";
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left py-4 pb-16 relative">

      {/* Header Row */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">
            Siswa Bimbingan Aktif
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Daftar penugasan murid aktif yang berada di bawah pendampingan akademik Anda.
          </p>
        </div>
        
        {/* Dev Scenario Selector */}
        <div className="shrink-0 flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Demo Simulator:</span>
          {(["default", "loading", "empty"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                scenario === s
                  ? `${getBgClass(selectedColor)} text-white border-transparent`
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading && <MyStudentsSkeleton />}

      {!loading && (
        <>
          {/* Scoped Assignment banner */}
          <div className={`${scopeBanner()} p-4 flex items-start gap-3`}>
            <Icons.UserCheck className="w-5 h-5 text-sky-650 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs text-zinc-800 dark:text-zinc-100">Filter Scope: Hanya Bimbingan Saya</span>
                <span className="text-[8px] font-black uppercase bg-sky-500/20 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded-full select-none">
                  Mentor Scoped
                </span>
              </div>
              <p className="text-[11px] text-zinc-550 dark:text-zinc-400 mt-0.5 leading-relaxed">
                Anda hanya dapat mengakses profil kontak, progres kurikulum, dan catatan alamat siswa yang **ditugaskan langsung ke Anda**. Data murid yang dibimbing mentor lain dalam domain yang sama tersembunyi secara default.
              </p>
            </div>
          </div>

          {/* Main workspace panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Search & List (col-span-5) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className={`${innerCard()} p-4`}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari nama, program, atau cabang..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-850 py-2.5 pl-9 pr-4 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-hidden focus:border-zinc-400 focus:dark:border-zinc-600 transition-colors"
                  />
                  <Icons.Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {filteredStudents.length === 0 ? (
                  <div className={`${innerCard()} p-8 text-center text-xs text-zinc-400`}>
                    Belum ada murid bimbingan yang terdaftar.
                  </div>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudentId === student.id;
                    return (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        className={`w-full text-left p-4.5 border transition-all ${getBorderRadiusClass(selectedStyle)} ${
                          isSelected
                            ? `bg-${selectedColor}-500/10 border-${selectedColor}-500/40 text-${selectedColor}-900 dark:text-${selectedColor}-100`
                            : "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/50 hover:border-zinc-350"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-100">{student.name}</h4>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                            student.status === "Lancar"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          }`}>
                            {student.status}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 mt-1">{student.course}</p>
                        
                        {/* Compact progress bar */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getBgClass(selectedColor)}`}
                              style={{ width: `${student.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-black text-zinc-450 dark:text-zinc-550 tabular-nums">
                            {student.progressPercent}%
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Detailed student profile (col-span-7) */}
            <div className="lg:col-span-7">
              {!activeStudent ? (
                <div className={`${innerCard()} p-12 text-center h-full flex flex-col justify-center items-center gap-3`}>
                  <Icons.User className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                  <h3 className="text-sm font-black text-zinc-700 dark:text-zinc-300">Pilih Siswa</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Pilih salah satu siswa di sebelah kiri untuk melihat rincian kurikulum tugas, kontak bimbingan, dan alamat kunjungannya.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">

                  {/* Core detail card */}
                  <div className={`${innerCard()} p-5 flex flex-col gap-4.5`}>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">ID Bimbingan: {activeStudent.id}</span>
                        <h2 className="text-base font-black text-zinc-850 dark:text-white mt-1">{activeStudent.name}</h2>
                        <p className="text-xs font-black text-sakode-blue mt-0.5">{activeStudent.course}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="text-[9px] font-black uppercase text-zinc-400 block">Metode Belajar</span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block ${
                          activeStudent.learningMode === "Group"
                            ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                        }`}>
                          {activeStudent.learningMode}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3.5 border-t border-zinc-200/50 dark:border-zinc-800/50 text-xs font-semibold">
                      <div>
                        <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">Tempat Belajar</span>
                        <span className="text-zinc-700 dark:text-zinc-300 block mt-1">{activeStudent.branch}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">Daftar Pertama</span>
                        <span className="text-zinc-700 dark:text-zinc-300 block mt-1">{activeStudent.registeredDate}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">Preferensi Jadwal</span>
                        <span className="text-zinc-700 dark:text-zinc-300 block mt-1">{activeStudent.preferredSchedule}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">Kontak Email</span>
                        <span className="text-zinc-700 dark:text-zinc-300 block mt-1 break-all">{activeStudent.email}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">No. Handphone</span>
                        <span className="text-zinc-700 dark:text-zinc-300 block mt-1">{activeStudent.phone}</span>
                      </div>
                    </div>

                    {/* Google Maps visit integration */}
                    <div className="bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/25 p-3.5 rounded-xl text-xs flex flex-col gap-1.5 mt-2">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[9.5px] font-black uppercase text-zinc-450 tracking-wider flex items-center gap-1.5">
                          <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" className="w-3.5 h-3.5 text-zinc-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
                          </svg>
                          Alamat Kunjungan Pengajaran Offline
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
                      <p className="font-extrabold text-zinc-800 dark:text-zinc-200 pl-5 leading-relaxed">
                        {activeStudent.address}
                      </p>
                    </div>

                    {/* Group roster list */}
                    {activeStudent.learningMode === "Group" && activeStudent.groupMembers && (
                      <div className="bg-purple-500/10 dark:bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl text-xs flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-purple-700 dark:text-purple-400">Detail Anggota Belajar Kelompok</span>
                          <span className="text-[8.5px] font-black uppercase bg-purple-500/20 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded">
                            Total: {activeStudent.groupMembers.length + 1} Peserta
                          </span>
                        </div>
                        <div className="text-zinc-650 dark:text-zinc-400 mt-1 leading-relaxed">
                          <p className="font-bold">Ketua Kelompok (Pendaftar Utama):</p>
                          <ul className="list-disc pl-5 mt-1 mb-2 font-black text-zinc-700 dark:text-zinc-300">
                            <li>{activeStudent.name}</li>
                          </ul>
                          <p className="font-bold">Anggota Kelompok:</p>
                          <ul className="list-disc pl-5 mt-1 font-semibold">
                            {activeStudent.groupMembers.map((member, idx) => (
                              <li key={idx}>{member}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Task and curriculum logs summary */}
                  <div className={`${innerCard()} p-5 flex flex-col gap-4`}>
                    <h3 className="text-xs font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                      Riwayat Tugas & Nilai Kurikulum
                    </h3>

                    <div className="flex flex-col gap-2.5">
                      {activeStudent.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/30 rounded-xl text-xs flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-extrabold text-zinc-800 dark:text-zinc-150">{task.title}</p>
                            <span className="text-[8.5px] text-zinc-400 block mt-0.5">ID: {task.id}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            {task.status === "Lulus" && (
                              <div className="flex items-center gap-2">
                                <span className="font-black text-emerald-600 dark:text-emerald-400 tabular-nums">Nilai: {task.grade}</span>
                                <span className="text-[8.5px] font-black uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 px-2 py-0.5 rounded">Lulus</span>
                              </div>
                            )}
                            {task.status === "Belum Dinilai" && (
                              <span className="text-[8.5px] font-black uppercase bg-amber-500/10 text-amber-700 dark:text-amber-450 px-2 py-0.5 rounded flex items-center gap-1">
                                <Icons.Clock className="w-3 h-3" />
                                Review Pending
                              </span>
                            )}
                            {task.status === "Belum Kumpul" && (
                              <span className="text-[8.5px] font-bold text-zinc-400 dark:text-zinc-550 italic">Belum Kumpul</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </>
      )}

    </div>
  );
}
