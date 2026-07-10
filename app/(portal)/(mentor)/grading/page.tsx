"use client";

/**
 * FE-SLICE-Grading — Mentor Penilaian Tugas (v2)
 *
 * Level 1: Learning Path cards — ringkasan per jalur belajar
 * Level 2: Task list           — daftar tugas dalam jalur yang dipilih
 * Modal  : Grade form          — nilai + status + feedback
 */

import React, { useState, useEffect, useMemo } from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass, getBorderRadiusClass } from "@/UI/shared/color-utils";
import {
  fetchGradingData,
  type GradingTask,
  type GradingPath,
  type GradingStatus,
  GRADE_STATUSES,
} from "./_mocks/gradingService";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const IcRefresh = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);
const IcSave = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
const IcExternal = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);
const IcPencil = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
  </svg>
);
const IcWarning = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);
const IcClose = (p: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);
const IcArrowLeft = (p: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);
const IcMessage = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </svg>
);
const IcUsers = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);
const IcUser = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTs(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function scoreColor(n: number) {
  if (n >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (n >= 70) return "text-blue-600 dark:text-blue-400";
  if (n >= 55) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}
function scoreLabel(n: number) {
  if (n >= 85) return "Sangat Baik";
  if (n >= 70) return "Baik";
  if (n >= 55) return "Cukup";
  return "Perlu Perbaikan";
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 22, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const stroke = score >= 85 ? "#10b981" : score >= 70 ? "#3b82f6" : score >= 55 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="currentColor" strokeWidth="4.5" className="text-zinc-200 dark:text-zinc-800" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={stroke} strokeWidth="4.5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 28 28)" style={{ transition: "stroke-dasharray .5s ease" }} />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className={`text-[13px] font-black ${scoreColor(score)}`}>{score}</span>
        <span className="text-[6px] font-bold text-zinc-400">/ 100</span>
      </div>
    </div>
  );
}

function StatusIcon({ status, className }: { status: GradingStatus; className?: string }) {
  if (status === "Sudah Dinilai")     return <Icons.Check className={className} />;
  if (status === "Revisi Diperlukan") return <IcRefresh className={className} />;
  return <Icons.Clock className={className} />;
}

function statusChip(status: GradingStatus) {
  const base = "inline-flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border";
  switch (status) {
    case "Belum Dinilai":     return `${base} bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700`;
    case "Sudah Dinilai":     return `${base} bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20`;
    case "Revisi Diperlukan": return `${base} bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20`;
  }
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-xl ${className ?? ""}`} />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MentorGradingPage() {
  const { selectedStyle, selectedColor } = useUIStyle();

  // ── State ────────────────────────────────────────────────────────────
  const [paths,   setPaths]   = useState<GradingPath[]>([]);
  const [tasks,   setTasks]   = useState<GradingTask[]>([]);
  const [loading, setLoading] = useState(true);

  // navigation
  const [activePath, setActivePath] = useState<GradingPath | null>(null);

  // task-level filter
  const [filterStatus, setFilterStatus] = useState<"Semua" | GradingStatus>("Semua");

  // grade modal
  const [activeTaskId,   setActiveTaskId]   = useState<string | null>(null);
  const [gradeScore,     setGradeScore]     = useState(80);
  const [gradeFeedback,  setGradeFeedback]  = useState("");
  const [gradeStatus,    setGradeStatus]    = useState<GradingStatus>("Sudah Dinilai");
  const [gradeError,     setGradeError]     = useState("");

  // toast
  const [toast, setToast] = useState<string | null>(null);

  // ── Load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchGradingData().then(({ paths, tasks }) => {
      setPaths(paths);
      setTasks(tasks);
      setLoading(false);
    });
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ── Computed ─────────────────────────────────────────────────────────
  const pathTasks = useMemo(() =>
    activePath ? tasks.filter((t) => t.pathId === activePath.id) : [],
    [tasks, activePath]
  );

  const filteredTasks = useMemo(() => {
    let pool = pathTasks;
    if (filterStatus !== "Semua") pool = pool.filter((t) => t.status === filterStatus);
    const order: Record<GradingStatus, number> = { "Belum Dinilai": 0, "Revisi Diperlukan": 1, "Sudah Dinilai": 2 };
    return [...pool].sort((a, b) =>
      order[a.status] !== order[b.status]
        ? order[a.status] - order[b.status]
        : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [pathTasks, filterStatus]);

  const activeTask = useMemo(() => tasks.find((t) => t.id === activeTaskId) || null, [tasks, activeTaskId]);

  // live path stats (updates after grading)
  const livePathStats = useMemo(() => {
    const map = new Map<string, Pick<GradingPath, "totalTasks" | "gradedCount" | "pendingCount" | "revisionCount">>();
    for (const t of tasks) {
      if (!map.has(t.pathId)) map.set(t.pathId, { totalTasks: 0, gradedCount: 0, pendingCount: 0, revisionCount: 0 });
      const s = map.get(t.pathId)!;
      s.totalTasks++;
      if (t.status === "Belum Dinilai") s.pendingCount++;
      else if (t.status === "Sudah Dinilai") s.gradedCount++;
      else s.revisionCount++;
    }
    return map;
  }, [tasks]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const openTask = (task: GradingTask) => {
    setActiveTaskId(task.id);
    setGradeScore(task.result?.score ?? 80);
    setGradeFeedback(task.result?.feedback ?? "");
    setGradeStatus(task.result?.status ?? "Sudah Dinilai");
    setGradeError("");
  };

  const closeModal = () => { setActiveTaskId(null); setGradeError(""); };

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeFeedback.trim()) { setGradeError("Feedback tidak boleh kosong."); return; }
    const now = new Date().toISOString();
    setTasks((prev) => prev.map((t) =>
      t.id === activeTaskId
        ? { ...t, status: gradeStatus, result: { score: gradeScore, feedback: gradeFeedback, status: gradeStatus, gradedAt: now } }
        : t
    ));
    triggerToast(`Penilaian untuk ${activeTask?.studentName} berhasil disimpan.`);
    closeModal();
  };

  const goBack = () => { setActivePath(null); setFilterStatus("Semua"); };

  // ── Card style ────────────────────────────────────────────────────────
  const card = (extra = "") => {
    const base: Record<string, string> = {
      neobrutalism:   "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[3px_3px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_rgba(255,255,255,1)] rounded-none",
      claymorphism:   "bg-white dark:bg-zinc-900 border border-slate-200/30 dark:border-zinc-800/60 shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.04),_inset_2px_2px_5px_rgba(255,255,255,0.35),_2px_4px_8px_rgba(0,0,0,0.06)] rounded-2xl",
      glassmorphism:  "bg-white/10 dark:bg-zinc-950/20 border border-white/10 backdrop-blur-md rounded-2xl shadow-xs",
      "liquid-glass": "bg-white/10 dark:bg-zinc-950/20 border border-white/10 backdrop-blur-md rounded-2xl shadow-xs",
      minimalism:     "bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl",
    };
    return `${base[selectedStyle] ?? "bg-white dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/50 rounded-2xl shadow-sm"} ${extra}`;
  };

  // ── Render ─────────────────────────────────────────────────────────────

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col gap-6 py-4">
      <SkeletonBlock className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-44" />)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 text-left py-4 pb-16 relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2.5 p-3.5 pr-5 rounded-xl shadow-lg border bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 text-xs font-black max-w-sm">
          <Icons.Check className="w-4 h-4 shrink-0 text-emerald-500" />
          {toast}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          LEVEL 1 — Learning Path List
      ════════════════════════════════════════════════════════════════ */}
      {!activePath && (
        <>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">Penilaian Tugas</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Pilih jalur belajar untuk melihat dan menilai tugas murid bimbingan Anda.
            </p>
          </div>

          {/* Summary strip */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Jalur Aktif",      value: paths.length,                                icon: <Icons.Clipboard className="w-4 h-4" /> },
              { label: "Belum Dinilai",    value: paths.reduce((s, p) => s + (livePathStats.get(p.id)?.pendingCount ?? 0), 0), icon: <Icons.Clock className="w-4 h-4" /> },
              { label: "Sudah Dinilai",    value: paths.reduce((s, p) => s + (livePathStats.get(p.id)?.gradedCount ?? 0), 0), icon: <Icons.Check className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={i} className={`${card()} flex items-center gap-3 px-4 py-3 min-w-[140px]`}>
                <span className="text-zinc-400">{s.icon}</span>
                <div>
                  <p className="text-lg font-black text-zinc-800 dark:text-zinc-100 leading-none">{s.value}</p>
                  <p className="text-[9.5px] font-black text-zinc-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Path Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paths.map((path) => {
              const stats = livePathStats.get(path.id) ?? path;
              const pct = stats.totalTasks > 0 ? Math.round((stats.gradedCount / stats.totalTasks) * 100) : 0;
              const hasPending = stats.pendingCount > 0;
              const hasRevision = stats.revisionCount > 0;

              return (
                <button
                  key={path.id}
                  id={`path-card-${path.id}`}
                  type="button"
                  onClick={() => setActivePath(path)}
                  className={`${card("text-left group")} p-5 flex flex-col gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${hasPending ? "ring-2 ring-amber-400/30" : ""}`}
                >
                  {/* Top row: avatar + meta */}
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-white ${getBgClass(selectedColor)} bg-opacity-90`}>
                      {path.mode === "Kelompok"
                        ? <IcUsers className="w-6 h-6" />
                        : <span>{initials(path.studentName)}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-100 leading-tight truncate">{path.studentName}</h3>
                        <span className={`shrink-0 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${path.mode === "Kelompok" ? "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20" : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"}`}>
                          {path.mode}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight line-clamp-2">{path.course}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9.5px] font-bold text-zinc-400">
                      <span>Progres Penilaian</span>
                      <span className="font-black text-zinc-600 dark:text-zinc-300">{stats.gradedCount}/{stats.totalTasks} dinilai</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getBgClass(selectedColor)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-[9px] font-black ${getTextClass(selectedColor)}`}>{pct}% selesai</span>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {stats.pendingCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        <Icons.Clock className="w-2.5 h-2.5" />
                        {stats.pendingCount} belum dinilai
                      </span>
                    )}
                    {stats.revisionCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                        <IcRefresh className="w-2.5 h-2.5" />
                        {stats.revisionCount} revisi
                      </span>
                    )}
                    {stats.gradedCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <Icons.Check className="w-2.5 h-2.5" />
                        {stats.gradedCount} selesai
                      </span>
                    )}
                  </div>

                  {/* CTA arrow */}
                  <div className={`flex items-center justify-end text-[10px] font-black ${getTextClass(selectedColor)} gap-1 transition-all group-hover:gap-2`}>
                    Lihat Tugas
                    <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          LEVEL 2 — Task List
      ════════════════════════════════════════════════════════════════ */}
      {activePath && (
        <>
          {/* Header */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer w-fit transition-colors"
            >
              <IcArrowLeft className="w-4 h-4" />
              Kembali ke semua jalur
            </button>

            <div className={`${card()} p-4 flex items-center gap-4`}>
              <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-white ${getBgClass(selectedColor)}`}>
                {activePath.mode === "Kelompok" ? <IcUsers className="w-6 h-6" /> : <span>{initials(activePath.studentName)}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-black text-zinc-800 dark:text-zinc-100">{activePath.studentName}</h2>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${activePath.mode === "Kelompok" ? "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20" : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"}`}>
                    {activePath.mode}
                  </span>
                </div>
                <p className="text-[10.5px] text-zinc-500 mt-0.5">{activePath.course}</p>
              </div>
              {/* Mini progress */}
              {(() => {
                const s = livePathStats.get(activePath.id) ?? activePath;
                const pct = s.totalTasks > 0 ? Math.round((s.gradedCount / s.totalTasks) * 100) : 0;
                return (
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="text-xs font-black text-zinc-700 dark:text-zinc-200">{s.gradedCount}<span className="text-zinc-400 font-normal">/{s.totalTasks}</span></span>
                    <span className={`text-[9px] font-bold ${getTextClass(selectedColor)}`}>{pct}% dinilai</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["Semua", "Belum Dinilai", "Revisi Diperlukan", "Sudah Dinilai"] as const).map((s) => (
              <button
                key={s}
                id={`filter-task-${s.replace(/\s/g, "-").toLowerCase()}`}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${filterStatus === s ? `${getBgClass(selectedColor)} text-white border-transparent` : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"}`}
              >
                {s === "Belum Dinilai" && <Icons.Clock className="w-3 h-3" />}
                {s === "Sudah Dinilai" && <Icons.Check className="w-3 h-3" />}
                {s === "Revisi Diperlukan" && <IcRefresh className="w-3 h-3" />}
                {s}
                <span className="text-[8px] bg-white/20 px-1 rounded-full">
                  {s === "Semua" ? pathTasks.length : pathTasks.filter((t) => t.status === s).length}
                </span>
              </button>
            ))}
          </div>

          {/* Task list */}
          {filteredTasks.length === 0 ? (
            <div className={`${card()} p-12 flex flex-col items-center gap-3 text-zinc-400`}>
              <Icons.Clipboard className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
              <p className="text-xs font-semibold">Tidak ada tugas dengan status ini.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredTasks.map((task) => (
                <div key={task.id} id={`task-${task.id}`} className={`${card()} p-4 flex items-start gap-4`}>

                  {/* Score / pending icon */}
                  <div className="shrink-0 pt-0.5">
                    {task.result ? (
                      <ScoreRing score={task.result.score} />
                    ) : (
                      <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${task.isLate ? "bg-red-500/8 border-red-500/25" : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"}`}>
                        {task.isLate
                          ? <IcWarning className="w-6 h-6 text-red-500" />
                          : <Icons.Clock className="w-6 h-6 text-zinc-400" />}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className={statusChip(task.status)}>
                            <StatusIcon status={task.status} className="w-2.5 h-2.5" />
                            {task.status}
                          </span>
                          {task.isLate && (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                              <IcWarning className="w-2.5 h-2.5" />
                              Terlambat
                            </span>
                          )}
                        </div>
                        <h3 className="text-[11.5px] font-black text-zinc-800 dark:text-zinc-100 leading-tight">{task.taskTitle}</h3>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{task.moduleTitle}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{task.taskDescription}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Icons.Clock className="w-3 h-3 shrink-0" />
                        {fmtTs(task.submittedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icons.Calendar className="w-3 h-3 shrink-0" />
                        Deadline:
                        <span className={`font-bold ml-0.5 ${task.isLate ? "text-red-500" : "text-zinc-600 dark:text-zinc-300"}`}>{task.deadline}</span>
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <IcUsers className="w-3 h-3 shrink-0" />
                        {task.submissionMethod}
                      </span>
                    </div>

                    {/* Feedback preview */}
                    {task.result && (
                      <div className="flex items-start gap-2 bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl p-2.5">
                        <IcMessage className="w-3.5 h-3.5 shrink-0 mt-0.5 text-zinc-400" />
                        <p className="text-[10px] text-zinc-600 dark:text-zinc-400 italic line-clamp-2">{task.result.feedback}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        id={`btn-grade-${task.id}`}
                        onClick={() => openTask(task)}
                        className={`flex items-center gap-1.5 py-1.5 px-4 text-[10.5px] font-black rounded-xl cursor-pointer transition-all ${task.status === "Belum Dinilai" ? `${getBgClass(selectedColor)} text-white hover:opacity-90` : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                      >
                        {task.status === "Belum Dinilai"
                          ? <><Icons.ClipboardCheck className="w-3.5 h-3.5" /> Nilai Sekarang</>
                          : <><IcPencil className="w-3.5 h-3.5" /> Edit Penilaian</>}
                      </button>
                      {task.submissionLink && (
                        <a
                          href={["GitHub Repository", "Link Eksternal", "Google Drive"].includes(task.submissionMethod)
                            ? task.submissionLink
                            : `https://wa.me/${task.submissionLink.replace(/\D/g, "")}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 py-1.5 px-4 text-[10.5px] font-black rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          <IcExternal className="w-3.5 h-3.5" />
                          Buka Submission
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          Grade Modal
      ════════════════════════════════════════════════════════════════ */}
      {activeTaskId && activeTask && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleSubmitGrade}
            className={`${card()} w-full sm:max-w-lg flex flex-col gap-5 relative sm:rounded-2xl rounded-t-3xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto`}
          >
            {/* Handle bar (mobile) */}
            <div className="sm:hidden w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700 mx-auto -mt-1 mb-1" />

            <button type="button" onClick={closeModal} className="absolute top-5 right-5 p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
              <IcClose className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className="pr-8">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Penilaian Tugas</p>
              <h3 className="text-sm font-black text-zinc-800 dark:text-white mt-0.5 leading-tight">{activeTask.taskTitle}</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">{activeTask.studentName} · {activeTask.moduleTitle}</p>
            </div>

            {/* Task brief */}
            <div className="bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/40 dark:border-zinc-700/40 rounded-xl p-3.5 text-[10.5px] flex flex-col gap-2.5">
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{activeTask.taskDescription}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 border-t border-zinc-200/40 dark:border-zinc-700/40">
                <div>
                  <p className="text-[8.5px] uppercase tracking-wider text-zinc-400 mb-0.5">Metode</p>
                  <p className="font-bold text-zinc-700 dark:text-zinc-200">{activeTask.submissionMethod}</p>
                </div>
                {activeTask.submissionLink && (
                  <div className="min-w-0 flex-1">
                    <p className="text-[8.5px] uppercase tracking-wider text-zinc-400 mb-0.5">Link / Kontak</p>
                    <p className={`font-bold truncate ${getTextClass(selectedColor)}`}>{activeTask.submissionLink}</p>
                  </div>
                )}
                <div>
                  <p className="text-[8.5px] uppercase tracking-wider text-zinc-400 mb-0.5">Dikumpulkan</p>
                  <p className={`font-bold ${activeTask.isLate ? "text-red-500" : "text-zinc-700 dark:text-zinc-200"}`}>
                    {fmtTs(activeTask.submittedAt)}
                    {activeTask.isLate && <span className="ml-1.5 text-[9px] inline-flex items-center gap-0.5"><IcWarning className="w-2.5 h-2.5 inline" /> Terlambat</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Score slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-200">
                  Nilai <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} max={100}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-14 text-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg py-1 text-sm font-black text-zinc-800 dark:text-zinc-100 outline-hidden"
                  />
                  <span className={`text-[9px] font-bold w-24 ${scoreColor(gradeScore)}`}>{scoreLabel(gradeScore)}</span>
                </div>
              </div>
              <input
                type="range" min={0} max={100} step={1}
                value={gradeScore}
                onChange={(e) => setGradeScore(Number(e.target.value))}
                className="w-full cursor-pointer accent-sakode-blue h-1.5 rounded-full"
              />
              {/* Grade bands */}
              <div className="flex gap-1 text-[8px] font-bold">
                {[["85–100", "Sangat Baik", "emerald"], ["70–84", "Baik", "blue"], ["55–69", "Cukup", "amber"], ["< 55", "Kurang", "red"]].map(([r, l, c]) => (
                  <span key={r} className={`px-1.5 py-0.5 rounded-md bg-${c}-500/10 text-${c}-700 dark:text-${c}-400 flex-1 text-center`}>{r}</span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-zinc-700 dark:text-zinc-200">Status Penilaian <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {GRADE_STATUSES.map((s) => (
                  <button key={s} type="button" onClick={() => setGradeStatus(s)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${gradeStatus === s
                      ? s === "Sudah Dinilai"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400"
                      : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"}`}
                  >
                    <StatusIcon status={s} className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="text-[10.5px] font-black">{s}</p>
                      <p className="text-[8.5px] opacity-60 font-normal">{s === "Sudah Dinilai" ? "Tugas diterima" : "Murid perlu revisi"}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-zinc-700 dark:text-zinc-200">
                Feedback <span className="text-red-400">*</span>
              </label>
              <textarea rows={4} value={gradeFeedback}
                onChange={(e) => { setGradeFeedback(e.target.value); setGradeError(""); }}
                placeholder="Tulis feedback konstruktif — apa yang sudah baik dan apa yang perlu diperbaiki..."
                className="w-full bg-zinc-100/60 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl outline-hidden text-xs font-semibold text-zinc-800 dark:text-zinc-100 resize-none placeholder:text-zinc-400 placeholder:font-normal"
              />
              {gradeError && (
                <p className="flex items-center gap-1 text-[10px] text-red-500 font-bold">
                  <IcWarning className="w-3 h-3" /> {gradeError}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={closeModal}
                className="px-4 py-2 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">
                Batal
              </button>
              <button type="submit"
                className={`flex items-center gap-2 px-5 py-2 text-xs font-black ${getBgClass(selectedColor)} text-white rounded-xl cursor-pointer hover:opacity-90`}>
                <IcSave className="w-3.5 h-3.5" />
                Simpan Penilaian
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
