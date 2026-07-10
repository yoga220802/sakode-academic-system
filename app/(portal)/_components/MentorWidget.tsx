"use client";

/**
 * FE-SLICE-021 — Mentor Overview Widget (Dashboard Panel)
 *
 * Scope: Mentor
 * Location: Loaded directly in `/dashboard` when role === "mentor"
 *
 * Features:
 *  - Next Session Highlight Card (Zoom button + address maps links)
 *  - Workload and Availability Meter (Active slots vs Slot limit bar)
 *  - KPI Summary (Teaching hours, customer rating, grading count)
 *  - Today's Agenda list (interactive session launches)
 *  - Assigned Student summary (progress bars, status warnings)
 *  - Pending Review Queue (Grading reviewer CTAs)
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBorderRadiusClass } from "@/UI/shared/color-utils";
import {
  getMentorOverviewData,
  type MentorOverviewData,
  type MentorSession,
  type MentorAssignedStudent,
  type MentorGradingItem,
} from "../_mocks/mentorOverviewService";

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg ${className ?? ""}`} />;
}

function MentorWidgetSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <SkeletonBlock className="h-28 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonBlock className="h-80" />
        <SkeletonBlock className="h-80" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MentorWidget() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  const [data, setData] = useState<MentorOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissedWelcome, setDismissedWelcome] = useState(false);

  useEffect(() => {
    getMentorOverviewData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <MentorWidgetSkeleton />;
  if (!data) return null;

  const { workload, sessions, students, gradings } = data;
  const nextSession = sessions[0] || null;
  const fillPct = Math.round((workload.activeCount / workload.limitCount) * 100);

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

  const welcomeBanner = () => {
    switch (selectedStyle) {
      case "neobrutalism":
        return "bg-amber-100 dark:bg-amber-950/20 border-2 border-zinc-900 dark:border-white rounded-none font-mono";
      case "claymorphism":
        return "bg-amber-50/50 dark:bg-amber-950/10 border border-amber-300/20 rounded-3xl shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.02)]";
      case "glassmorphism":
      case "liquid-glass":
        return "bg-amber-500/10 dark:bg-amber-500/5 border border-white/10 backdrop-blur-md rounded-2xl";
      case "minimalism":
        return "bg-zinc-100/50 dark:bg-zinc-900/50 border-l-4 border-amber-500 rounded-r-lg";
      default:
        return "bg-amber-500/8 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left pb-16">

      {/* ── Welcome & Workload Banner ────────────────────────────────────── */}
      {!dismissedWelcome && (
        <div className={`${welcomeBanner()} p-5 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5`}>
              <Icons.Sparkles className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h2 className="text-sm font-black text-zinc-800 dark:text-zinc-100 leading-tight">
                Halo, Mentor {workload.mentorName}!
              </h2>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                Selamat mengajar hari ini. Di bawah ini adalah ringkasan bimbingan offline, antrean tugas siswa yang menunggu penilaian, serta status slot kapasitas bimbingan Anda.
              </p>
            </div>
          </div>

          {/* Workload Capacity Meter */}
          <div className="shrink-0 w-full md:w-64 bg-white/45 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/80 p-3.5 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
              <span className="uppercase tracking-wider font-black">Beban Mengajar</span>
              <span className="tabular-nums font-extrabold">{workload.activeCount}/{workload.limitCount} Murid</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getBgClass(selectedColor)}`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Next Session Spotlight Card ──────────────────────────────────── */}
      {nextSession && (
        <UI.Card accentColor={selectedColor}>
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-sakode-blue/15 text-sakode-blue rounded-xl shrink-0 mt-0.5">
                <Icons.Calendar className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase text-zinc-450 tracking-wider">Sesi Berikutnya</span>
                <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-100 leading-tight mt-0.5">
                  {nextSession.topic}
                </h3>
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mt-1.5">
                  Siswa: <strong className="text-zinc-700 dark:text-zinc-300">{nextSession.studentName}</strong> • {nextSession.time} WIB ({nextSession.date})
                </p>
                {nextSession.address && (
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 mt-1.5">
                    <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" className="w-3.5 h-3.5 shrink-0 text-zinc-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    Tujuan: <strong className="text-zinc-550 dark:text-zinc-300">{nextSession.address}</strong>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextSession.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9.5px] text-sakode-blue hover:underline font-bold"
                    >
                      (Buka Peta)
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
              <a href={nextSession.meetingLink} target="_blank" rel="noopener noreferrer">
                <UI.Button variant="primary" accentColor={selectedColor} className="text-xs! py-2.5! px-5! h-auto! cursor-pointer font-black!">
                  Mulai Kelas Zoom
                </UI.Button>
              </a>
            </div>
          </div>
        </UI.Card>
      )}

      {/* ── KPI Summary Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Statistik Mentor">
        {[
          {
            value: `${workload.totalHoursTaught} Jam`,
            label: "Total Jam Mengajar",
            badge: { label: "↑ +12 jam minggu ini", color: "green" as const }
          },
          {
            value: `${workload.satisfactionRating.toFixed(2)} / 5.00`,
            label: "Penilaian Kepuasan Murid",
            badge: { label: "45 Ulasan", color: "blue" as const }
          },
          {
            value: `${gradings.length} Tugas`,
            label: "Antrean Penilaian Tugas",
            badge: { label: "Wajib dinilai 24j", color: "orange" as const }
          }
        ].map((kpi, idx) => (
          <UI.Card key={idx} accentColor={selectedColor}>
            <div className="p-4 flex flex-col gap-1 text-left">
              <div className="w-fit">
                <UI.Badge variant="accent" accentColor={kpi.badge.color}>
                  {kpi.badge.label}
                </UI.Badge>
              </div>
              <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
                {kpi.value}
              </span>
              <span className="text-[9.5px] font-black text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mt-1.5">
                {kpi.label}
              </span>
            </div>
          </UI.Card>
        ))}
      </div>

      {/* ── Assigned Students & Grading Columns ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Assigned Student Summary Card */}
        <section aria-labelledby="students-heading" className="flex flex-col gap-4">
          <h3 id="students-heading" className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Daftar Murid Bimbingan Anda
          </h3>
          <div className="flex flex-col gap-3">
            {students.map((student) => (
              <div
                key={student.id}
                id={`student-${student.id}`}
                className={`${innerCard()} p-4 flex flex-col gap-3 text-xs`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="font-black text-zinc-800 dark:text-zinc-150">{student.name}</h4>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold mt-0.5">{student.course}</p>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                    student.status === "Lancar"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                  }`}>
                    {student.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400">
                    <span>Kurikulum Selesai</span>
                    <span className="font-black tabular-nums">{student.progressPercent}% ({student.completedTasks}/{student.totalTasks} tugas)</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getBgClass(selectedColor)}`}
                      style={{ width: `${student.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grading Queue review */}
        <section aria-labelledby="gradings-heading" className="flex flex-col gap-4">
          <h3 id="gradings-heading" className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Antrean Penilaian Tugas Murid
          </h3>
          <div className="flex flex-col gap-3">
            {gradings.map((grade) => (
              <div
                key={grade.id}
                id={`grading-${grade.id}`}
                className={`${innerCard()} p-4 flex flex-col gap-2 text-xs`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                  <span className="font-extrabold text-zinc-700 dark:text-zinc-300">{grade.studentName}</span>
                  <span className="text-sakode-orange font-black uppercase text-[8.5px] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                    ⌛ {grade.timeLeft}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 block mb-0.5">Diserahkan: {grade.submittedAt}</span>
                  <h4 className="font-black text-zinc-800 dark:text-zinc-150">
                    {grade.taskTitle}
                  </h4>
                </div>
                <Link href="/grading" className="mt-2 w-fit">
                  <UI.Button variant="secondary" accentColor={selectedColor} className="text-[10px]! py-1.5! px-3! h-auto! w-fit! font-black! cursor-pointer">
                    Buka File & Nilai
                  </UI.Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
