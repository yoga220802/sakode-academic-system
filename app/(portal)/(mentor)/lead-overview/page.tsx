"use client";

/**
 * FE-SLICE-018 — Mentor Lead Overview Page
 *
 * Scope: Mentor Lead
 * Route: /lead-overview  (accessible when role === "mentor_lead")
 *
 * Features:
 *  - Scoped Authority Banner (domain + lead name + scope notice)
 *  - Urgent Workload Alerts (dismissible)
 *  - KPI Summary (queue count, mentor count, capacity %, today sessions)
 *  - Unassigned Student Queue with priority badges & CTA
 *  - Mentor Capacity Map (workload bars, availability, next session)
 *  - Upcoming Session List (today + tomorrow)
 *  - Recent Plotting Activity Timeline
 *  - Scenario switcher (dev only) for: default | no-alerts | empty
 *  - Full loading skeleton state
 *  - Empty state for queue and sessions
 */

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBorderRadiusClass } from "@/UI/shared/color-utils";
import {
  fetchMentorLeadOverview,
  type MentorLeadOverviewData,
  type MentorLeadOverviewScenario,
  type WorkloadAlertLevel,
  type MentorAvailability,
  type StudentPriority,
} from "@/app/_data/mentorLeadOverviewService";

// ─── Sub-component helpers ───────────────────────────────────────────────────

function priorityColorMap(priority: StudentPriority) {
  switch (priority) {
    case "Mendesak": return { bg: "bg-red-500/10 border-red-400/30 text-red-700 dark:text-red-300", dot: "bg-red-500" };
    case "Tinggi":   return { bg: "bg-orange-500/10 border-orange-400/30 text-orange-700 dark:text-orange-300", dot: "bg-orange-500" };
    case "Sedang":   return { bg: "bg-blue-500/10 border-blue-400/30 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" };
    default:         return { bg: "bg-zinc-100 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400", dot: "bg-zinc-400" };
  }
}

function availabilityStyle(availability: MentorAvailability) {
  switch (availability) {
    case "Tersedia":       return "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
    case "Hampir Penuh":  return "text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20";
    case "Sibuk (Penuh)": return "text-red-700 dark:text-red-400 bg-red-500/10 border border-red-500/20";
  }
}

function alertBg(level: WorkloadAlertLevel) {
  switch (level) {
    case "danger":  return "bg-red-500/8 border-red-400/30 text-red-800 dark:text-red-200";
    case "warning": return "bg-amber-500/8 border-amber-400/30 text-amber-800 dark:text-amber-200";
    default:        return "bg-blue-500/8 border-blue-400/30 text-blue-800 dark:text-blue-200";
  }
}

function alertIcon(level: WorkloadAlertLevel) {
  if (level === "danger")  return <Icons.AlertCircle className="w-4 h-4 shrink-0 text-red-500" />;
  if (level === "warning") return <Icons.AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />;
  return <Icons.Info className="w-4 h-4 shrink-0 text-blue-500" />;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg ${className ?? ""}`} />;
}

function MentorLeadOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <SkeletonBlock className="h-16 w-full" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-20" />)}
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-20" />)}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-24" />)}
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-16" />)}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MentorLeadOverviewPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  const [scenario, setScenario] = useState<MentorLeadOverviewScenario>("default");
  const [data, setData] = useState<MentorLeadOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set());

  const loadData = useCallback(async () => {
    setLoading(true);
    setDismissedAlerts(new Set());
    try {
      const result = await fetchMentorLeadOverview(scenario);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [scenario]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Sub-element card style per theme ────────────────────────────────────────
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
        return "bg-amber-100 dark:bg-amber-950/20 border-2 border-zinc-900 dark:border-white rounded-none font-mono";
      case "claymorphism":
        return "bg-amber-50/50 dark:bg-amber-950/10 border border-amber-300/20 shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.02),_3px_3px_6px_rgba(255,255,255,0.8)] rounded-3xl";
      case "glassmorphism":
      case "liquid-glass":
        return "bg-amber-500/10 dark:bg-amber-500/5 border border-white/10 backdrop-blur-md rounded-2xl";
      case "minimalism":
        return "bg-zinc-100/50 dark:bg-zinc-900/50 border-l-4 border-amber-500 rounded-r-lg";
      default:
        return "bg-amber-500/8 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl";
    }
  };

  if (loading) return <MentorLeadOverviewSkeleton />;
  if (!data)   return null;

  const { scope, alerts, unassignedQueue, mentorCapacities, upcomingSessions, recentActivities } = data;
  const activeAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id));
  const utilizationPct = Math.round((scope.totalStudents / scope.maxCapacity) * 100);
  const availableMentorCount = mentorCapacities.filter((m) => m.availability === "Tersedia").length;

  return (
    <div className="flex flex-col gap-8 w-full text-left pb-16">

      {/* ── Scope Authority Banner ───────────────────────────────────────── */}
      <div className={`${scopeBanner()} p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Icons.Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-sm font-black text-zinc-800 dark:text-zinc-100 leading-tight">
                  Lingkup Otoritas: {scope.domainName}
                </h2>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 select-none">
                  Staff Scoped
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Anda masuk sebagai <strong className="text-zinc-700 dark:text-zinc-300">{scope.leadName}</strong> — Mentor Lead.
                Seluruh data antrean, kapasitas mentor, dan jadwal yang ditampilkan <strong>dibatasi hanya pada domain pengajaran Anda</strong>.
                Data mentor atau murid di luar domain ini tidak dapat diakses dari halaman ini.
              </p>
            </div>
          </div>
          {/* Dev Scenario Switcher */}
          <div className="shrink-0 flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider hidden sm:block">Skenario:</span>
            {(["default", "no-alerts", "empty"] as MentorLeadOverviewScenario[]).map((s) => (
              <button
                key={s}
                id={`scenario-btn-${s}`}
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
      </div>

      {/* ── Urgent Alerts ────────────────────────────────────────────────── */}
      {activeAlerts.length > 0 && (
        <div className="flex flex-col gap-3" role="alert" aria-label="Peringatan operasional aktif">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              id={`alert-${alert.id}`}
              className={`flex items-start justify-between gap-3 p-4 border text-xs ${getBorderRadiusClass(selectedStyle)} ${alertBg(alert.level)}`}
            >
              <div className="flex items-start gap-2.5 flex-1">
                {alertIcon(alert.level)}
                <div>
                  <p className="font-black leading-none mb-1">{alert.title}</p>
                  <p className="font-medium leading-relaxed opacity-80">{alert.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <Link
                  href={alert.actionHref}
                  className="text-[9px] font-black uppercase tracking-wider hover:underline whitespace-nowrap"
                  id={`alert-action-${alert.id}`}
                >
                  {alert.actionLabel} →
                </Link>
                <button
                  id={`alert-dismiss-${alert.id}`}
                  aria-label={`Tutup peringatan: ${alert.title}`}
                  onClick={() => setDismissedAlerts((prev) => new Set(prev).add(alert.id))}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── KPI Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="Ringkasan operasional">
        {[
          {
            id: "kpi-queue",
            badge: { label: "Butuh alokasi", color: "orange" as const },
            value: scope.pendingQueueCount,
            label: "Antrean Belum Di-plot",
            hint: unassignedQueue.some((s) => s.priority === "Mendesak") ? "⚠ Ada yang mendesak" : undefined,
          },
          {
            id: "kpi-mentors",
            badge: { label: `${availableMentorCount} tersedia`, color: "green" as const },
            value: mentorCapacities.length,
            label: "Total Mentor Aktif",
          },
          {
            id: "kpi-utilization",
            badge: { label: `Batas ${scope.maxCapacity}`, color: "blue" as const },
            value: `${utilizationPct}%`,
            label: "Utilisasi Kapasitas",
          },
          {
            id: "kpi-sessions",
            badge: { label: "Hari ini", color: selectedColor as "purple" | "blue" | "green" | "orange" },
            value: scope.activeSessionsToday,
            label: "Sesi Terjadwal",
          },
        ].map((kpi) => (
          <UI.Card key={kpi.id} accentColor={selectedColor}>
            <div id={kpi.id} className="p-4 flex flex-col gap-1 text-left">
              <div className="w-fit">
                <UI.Badge variant="accent" accentColor={kpi.badge.color}>
                  {kpi.badge.label}
                </UI.Badge>
              </div>
              <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none tabular-nums">
                {kpi.value}
              </span>
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">
                {kpi.label}
              </span>
              {kpi.hint && (
                <span className="text-[9px] text-red-500 font-black mt-0.5">{kpi.hint}</span>
              )}
            </div>
          </UI.Card>
        ))}
      </div>

      {/* ── Queue + Capacity Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Unassigned Student Queue */}
        <section aria-labelledby="queue-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 id="queue-heading" className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Antrean Siswa Belum Di-plot
            </h3>
            <Link href="/plotting-queue" id="link-open-plotting" className={`text-[10px] font-black ${getTextClass(selectedColor)} hover:underline`}>
              Buka Plotting Workspace →
            </Link>
          </div>

          {unassignedQueue.length === 0 ? (
            <div className={`${innerCard()} p-8 text-center`}>
              <Icons.Check className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-black text-zinc-700 dark:text-zinc-300">Semua siswa sudah ter-plot!</p>
              <p className="text-xs text-zinc-400 mt-1">Tidak ada siswa yang menunggu alokasi mentor saat ini.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {unassignedQueue.map((student) => {
                const colors = priorityColorMap(student.priority);
                return (
                  <div
                    key={student.id}
                    id={`queue-item-${student.id}`}
                    className={`${innerCard()} p-4 flex items-start justify-between gap-3`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-100 leading-none truncate">
                          {student.name}
                        </h4>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${colors.bg}`}>
                          {student.priority}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                        {student.course}
                      </p>
                      <p className="text-[9.5px] text-zinc-400 dark:text-zinc-500 mt-1">
                        Daftar: {student.registeredAt} • Menunggu {student.waitingHours} jam
                      </p>
                    </div>
                    <Link href="/plotting-queue" id={`cta-plot-${student.id}`} className="shrink-0">
                      <UI.Button
                        variant="primary"
                        accentColor={selectedColor}
                        className="text-[8px]! py-1.5! px-3! h-auto! font-black! cursor-pointer whitespace-nowrap"
                      >
                        Alokasikan
                      </UI.Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Mentor Capacity Map */}
        <section aria-labelledby="capacity-heading" className="flex flex-col gap-4">
          <h3 id="capacity-heading" className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Kapasitas & Beban Mengajar Mentor
          </h3>
          <div className="flex flex-col gap-3">
            {mentorCapacities.map((mentor) => {
              const fillPct = Math.min(100, Math.round((mentor.activeStudents / mentor.slotLimit) * 100));
              const barColor =
                fillPct >= 100 ? getBgClass("red") :
                fillPct >= 80  ? getBgClass("orange") :
                getBgClass(selectedColor);

              return (
                <div
                  key={mentor.id}
                  id={`mentor-cap-${mentor.id}`}
                  className={`${innerCard()} p-4 flex flex-col gap-3`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-100 leading-none truncate">
                        {mentor.name}
                      </h4>
                      <p className="text-[9.5px] font-bold text-zinc-400 dark:text-zinc-500 mt-1">
                        {mentor.expertise}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${availabilityStyle(mentor.availability)}`}>
                        {mentor.availability}
                      </span>
                      <span className="text-[9.5px] text-zinc-500 font-black tabular-nums">
                        {mentor.activeStudents}/{mentor.slotLimit} siswa
                      </span>
                    </div>
                  </div>

                  {/* Workload bar */}
                  <div
                    role="progressbar"
                    aria-valuenow={fillPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Kapasitas mentor ${mentor.name}: ${fillPct}%`}
                    className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>

                  {mentor.nextSession && (
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold">
                      Sesi berikutnya: {mentor.nextSession}
                    </p>
                  )}
                  {!mentor.nextSession && (
                    <p className="text-[9px] text-zinc-400/60 dark:text-zinc-600 italic">
                      Belum ada sesi terjadwal
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Sessions + Performance Stats Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Upcoming Sessions */}
        <section aria-labelledby="sessions-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 id="sessions-heading" className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Jadwal Sesi Terdekat (Scoped)
            </h3>
            <Link href="/schedules-lead" id="link-open-schedules" className={`text-[10px] font-black ${getTextClass(selectedColor)} hover:underline`}>
              Buka Jadwal →
            </Link>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className={`${innerCard()} p-8 text-center`}>
              <Icons.Calendar className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-black text-zinc-600 dark:text-zinc-400">Tidak ada sesi terjadwal</p>
              <p className="text-xs text-zinc-400 mt-1">Belum ada sesi mentoring dalam domain Anda minggu ini.</p>
              <Link href="/schedules-lead" className="mt-4 inline-block">
                <UI.Button variant="secondary" accentColor={selectedColor} className="text-[10px]! py-2! px-4! h-auto! cursor-pointer">
                  Buat Jadwal Baru
                </UI.Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  id={`session-${session.id}`}
                  className={`${innerCard()} p-4 flex flex-col gap-2`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-black ${session.isToday ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}`}>
                      {session.scheduledAt}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {session.isToday && (
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          Hari Ini
                        </span>
                      )}
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                        session.mode === "Kelompok"
                          ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                      }`}>
                        {session.mode}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-black text-zinc-800 dark:text-zinc-100 leading-snug">
                    {session.topic}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                    Siswa: <span className="text-zinc-600 dark:text-zinc-300">{session.studentName}</span>
                    {" "}•{" "}
                    Mentor: <span className={`font-black ${getTextClass(selectedColor)}`}>{session.mentorName}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Dynamic Quick Insights & Workload Analytics Card */}
        <section aria-labelledby="insights-heading" className="flex flex-col gap-4">
          <h3 id="insights-heading" className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Analisis Beban Kerja & Insight Cepat
          </h3>
          <div className={`${innerCard()} p-5 flex flex-col gap-5 justify-between h-full`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-${selectedColor}-500/10 text-${selectedColor}-600`}>
                  <Icons.Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-100">Distribusi Sesi Pengajaran</h4>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
                    Saat ini domain memiliki <strong>{upcomingSessions.length} sesi aktif</strong>. Rata-rata mentor mengajar <strong>{(scope.totalStudents / Math.max(1, mentorCapacities.length)).toFixed(1)} siswa</strong> per mentor.
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 flex flex-col gap-3">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Kesehatan Alokasi Mentor</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-zinc-100/50 dark:bg-zinc-800/35 rounded-xl border border-zinc-200/20">
                    <span className="text-sm font-black text-zinc-850 dark:text-zinc-150 tabular-nums">
                      {mentorCapacities.filter(m => m.availability === "Tersedia").length} Mentor
                    </span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-0.5">Kapasitas Longgar</span>
                  </div>
                  <div className="p-3 bg-zinc-100/50 dark:bg-zinc-800/35 rounded-xl border border-zinc-200/20">
                    <span className="text-sm font-black text-red-650 dark:text-red-400 tabular-nums">
                      {mentorCapacities.filter(m => m.availability === "Sibuk (Penuh)").length} Mentor
                    </span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-0.5">Kapasitas Penuh</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/25 p-3.5 rounded-xl">
              <span className="text-[9.5px] font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Icons.Info className="w-3.5 h-3.5 shrink-0" />
                Saran Sistem Alokasi
              </span>
              <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Prioritaskan mentor <strong>Rian Hidayat</strong> atau <strong>Fajar Nugraha</strong> untuk antrean masuk berikutnya demi menjaga keseimbangan beban mengajar.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Scoped Plotting Timeline (Full Width Bottom) ──────────────────── */}
      <section aria-labelledby="activity-heading" className="flex flex-col gap-4 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
        <h3 id="activity-heading" className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          Aktivitas Plotting Terakhir (Lintas Domain)
        </h3>

        {recentActivities.length === 0 ? (
          <div className={`${innerCard()} p-8 text-center`}>
            <Icons.Activity className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-sm font-black text-zinc-600 dark:text-zinc-400">Belum ada aktivitas</p>
            <p className="text-xs text-zinc-400 mt-1">Log plotting akan muncul di sini setelah alokasi pertama dilakukan.</p>
          </div>
        ) : (
          <div className={`${innerCard()} p-6`}>
            <div className="relative pl-7 border-l-2 border-zinc-200 dark:border-zinc-800 flex flex-col gap-6">
              {recentActivities.map((activity, idx) => (
                <div
                  key={activity.id}
                  id={`activity-${activity.id}`}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[2.35rem] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-xs ${
                      activity.success
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                    aria-hidden="true"
                  >
                    {activity.success
                      ? <Icons.Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      : <Icons.AlertCircle className="w-3 h-3 text-red-500" />
                    }
                  </span>

                  <div className="text-left">
                    <p className="text-xs font-black text-zinc-850 dark:text-zinc-150 leading-snug">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold">
                        {activity.relativeTime}
                      </span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        activity.actor === "Sistem"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : activity.actor === "Admin"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {activity.actor}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
