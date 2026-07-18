"use client";

/**
 * FE-SLICE-023 — Mentor Personal Schedule Workspace
 *
 * Session lifecycle:
 *   Terjadwal → [Mulai Pertemuan] → Berlangsung → [Selesaikan] → Selesai
 *
 * Reschedule approval flow (mentor-initiated):
 *   Mentor ajukan → Murid acc → Lead Mentor acc → (Online only: Mentor kirim link)
 *
 * Completion flow:
 *   Isi topik + perangkat → Mulai (Berlangsung + startedAt) → Selesaikan modal
 *   → Opsi tugas (ada/tidak) → Submit (Selesai + completedAt + homework)
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass } from "@/UI/shared/color-utils";
import {
  fetchWeeklySchedules,
  fetchPersonalSessions,
  type WeeklySchedule,
  type PersonalSession,
  DEVICE_OPTIONS,
  SUBMISSION_METHODS,
} from "@/app/_data/personalScheduleService";

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg ${className ?? ""}`} />;
}

function SchedulesSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <SkeletonBlock className="h-5 w-44" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-40" />)}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <SkeletonBlock className="h-5 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonBlock key={i} className="h-56" />)}
        </div>
      </div>
    </div>
  );
}

// ─── Searchable & Customizable Device Dropdown ────────────────────────────────

interface DeviceDropdownProps {
  selected: string[];
  onChange: (devices: string[]) => void;
}

function SearchableDeviceDropdown({ selected, onChange }: DeviceDropdownProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredOptions = DEVICE_OPTIONS.filter(
    (d) => !selected.includes(d) && d.toLowerCase().includes(search.toLowerCase())
  );
  const isCustom =
    search.trim().length > 0 &&
    !DEVICE_OPTIONS.some((d) => d.toLowerCase() === search.trim().toLowerCase()) &&
    !selected.some((s) => s.toLowerCase() === search.trim().toLowerCase());

  const toggleDevice = (device: string) => {
    if (selected.includes(device)) {
      onChange(selected.filter((d) => d !== device));
    } else {
      onChange([...selected, device]);
      setSearch("");
      setOpen(false);
    }
  };

  const addCustom = () => {
    if (search.trim() && !selected.includes(search.trim())) {
      onChange([...selected, search.trim()]);
      setSearch("");
    }
  };

  return (
    <div ref={ref} className="relative">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((d) => (
            <span key={d} className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/25 rounded-lg px-2 py-0.5 text-[10.5px] font-bold">
              {d}
              <button type="button" onClick={() => onChange(selected.filter((x) => x !== d))} className="hover:text-red-500 cursor-pointer">×</button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Cari atau ketik perangkat custom..."
          className="w-full bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-700 p-2 pr-8 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-100 outline-hidden placeholder:text-zinc-400 placeholder:font-normal"
        />
        <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400 pointer-events-none">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      {open && (filteredOptions.length > 0 || isCustom) && (
        <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl max-h-40 overflow-y-auto">
          {filteredOptions.map((d) => (
            <button key={d} type="button" onClick={() => toggleDevice(d)} className="w-full text-left px-3 py-2 text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
              {d}
            </button>
          ))}
          {isCustom && (
            <button type="button" onClick={addCustom} className="w-full text-left px-3 py-2 text-[10.5px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/5 cursor-pointer flex items-center gap-1.5 border-t border-zinc-100 dark:border-zinc-800">
              <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Tambah &ldquo;{search.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Timestamp Formatter ──────────────────────────────────────────────────────

function formatTimestamp(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function formatDateLong(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function durationLabel(startIso?: string, endIso?: string): string {
  if (!startIso || !endIso) return "";
  const mins = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
  if (mins < 60) return `${mins} menit`;
  return `${Math.floor(mins / 60)} jam ${mins % 60} menit`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MentorSchedulesPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // ── Data ─────────────────────────────────────────────────────────────
  const [weeklySchedules, setWeeklySchedules] = useState<WeeklySchedule[]>([]);
  const [sessions, setSessions] = useState<PersonalSession[]>([]);

  // ── Simulator ────────────────────────────────────────────────────────
  const [scenario, setScenario] = useState<"default" | "loading" | "empty">("default");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);

  // ── Filter ───────────────────────────────────────────────────────────
  const [filterTab, setFilterTab] = useState<"mendatang" | "terdahulu">("mendatang");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // ── Detail Modal (Selesai) ────────────────────────────────────────────
  const [detailSessionId, setDetailSessionId] = useState<string | null>(null);

  // ── Pre-session Modal (isi topik + perangkat sebelum mulai) ──────────
  const [preSessionId, setPreSessionId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  // ── Completion Modal (selesaikan pertemuan) ───────────────────────────
  const [completionSessionId, setCompletionSessionId] = useState<string | null>(null);
  const [homeworkAssigned, setHomeworkAssigned] = useState(false);
  const [hwTitle, setHwTitle] = useState("");
  const [hwDesc, setHwDesc] = useState("");
  const [hwMethod, setHwMethod] = useState("");
  const [hwDeadline, setHwDeadline] = useState("");

  // ── Reschedule / Cancel Modal ─────────────────────────────────────────
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"reschedule" | "cancel">("reschedule");
  const [requestReason, setRequestReason] = useState("");
  const [rescheduleChangeType, setRescheduleChangeType] = useState<"Offline" | "Online">("Offline");
  const [requestTargetId, setRequestTargetId] = useState<string | null>(null);
  const [proposedDate, setProposedDate] = useState("");
  const [proposedStart, setProposedStart] = useState("");
  const [proposedEnd, setProposedEnd] = useState("");

  // ── Effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (scenario === "loading") { setLoading(true); return; }
    if (scenario === "empty") { setWeeklySchedules([]); setSessions([]); setLoading(false); return; }
    setLoading(true);
    Promise.all([fetchWeeklySchedules(), fetchPersonalSessions()]).then(([ws, ps]) => {
      setWeeklySchedules(ws);
      setSessions(ps);
      setLoading(false);
    });
  }, [scenario]);

  const triggerToast = (text: string, type: "success" | "error" | "warning" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Computed ─────────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];

  const uniqueStudents = useMemo(
    () => [...new Set(sessions.map((s) => s.studentName))].sort(),
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    let pool = sessions;

    // Daily filter overrides tab logic when a date is selected
    if (filterDate) {
      pool = pool.filter((s) => s.date === filterDate);
    } else if (filterTab === "mendatang") {
      pool = pool.filter(
        (s) =>
          s.status === "Berlangsung" ||
          (s.date >= today && (s.status === "Terjadwal" || s.status === "Rescheduled"))
      );
    } else {
      pool = pool.filter(
        (s) => s.date < today || s.status === "Selesai" || s.status === "Dibatalkan"
      );
    }

    // Student name filter
    if (filterStudent) pool = pool.filter((s) => s.studentName === filterStudent);

    // Sort: Berlangsung first, then by date nearest-first
    return [...pool].sort((a, b) => {
      if (a.status === "Berlangsung") return -1;
      if (b.status === "Berlangsung") return 1;
      return a.date.localeCompare(b.date);
    });
  }, [sessions, filterTab, filterStudent, filterDate, today]);

  const activeFilterCount = (filterStudent ? 1 : 0) + (filterDate ? 1 : 0);

  const detailSession = useMemo(() => sessions.find((s) => s.id === detailSessionId) || null, [sessions, detailSessionId]);
  const preSession = useMemo(() => sessions.find((s) => s.id === preSessionId) || null, [sessions, preSessionId]);
  const preSchedule = useMemo(
    () => (preSession ? weeklySchedules.find((ws) => ws.id === preSession.scheduleId) || null : null),
    [preSession, weeklySchedules]
  );
  const completionSession = useMemo(() => sessions.find((s) => s.id === completionSessionId) || null, [sessions, completionSessionId]);
  const requestTarget = useMemo(() => sessions.find((s) => s.id === requestTargetId) || null, [sessions, requestTargetId]);

  // ── Handlers ─────────────────────────────────────────────────────────

  /** Step 1: Buka modal isi topik + perangkat */
  const openPreSession = (sessionId: string) => {
    setPreSessionId(sessionId);
    setSelectedModuleId("");
    setSelectedDevices([]);
  };

  /** Step 1 submit: Set status Berlangsung + startedAt */
  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) { triggerToast("Pilih modul/topik terlebih dahulu.", "error"); return; }
    if (selectedDevices.length === 0) { triggerToast("Masukkan minimal satu perangkat.", "error"); return; }
    const module = preSchedule?.modules.find((m) => m.id === selectedModuleId);
    const now = new Date().toISOString();
    setSessions((prev) => prev.map((s) =>
      s.id === preSessionId
        ? { ...s, status: "Berlangsung" as const, moduleId: selectedModuleId, topic: module?.title ?? s.topic, devices: selectedDevices, startedAt: now }
        : s
    ));
    triggerToast("Pertemuan dimulai! Tekan 'Selesaikan' ketika sesi selesai.", "warning");
    setPreSessionId(null);
    setFilterTab("mendatang");
  };

  /** Step 2: Buka modal selesaikan pertemuan */
  const openCompletion = (sessionId: string) => {
    setCompletionSessionId(sessionId);
    setHomeworkAssigned(false);
    setHwTitle(""); setHwDesc(""); setHwMethod(""); setHwDeadline("");
  };

  /** Step 2 submit: Set status Selesai + completedAt + homework */
  const handleCompleteSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeworkAssigned) {
      if (!hwTitle.trim()) { triggerToast("Isi judul tugas terlebih dahulu.", "error"); return; }
      if (!hwMethod) { triggerToast("Pilih metode pengumpulan tugas.", "error"); return; }
      if (!hwDeadline) { triggerToast("Isi deadline pengumpulan tugas.", "error"); return; }
    }
    const now = new Date().toISOString();
    setSessions((prev) => prev.map((s) =>
      s.id === completionSessionId
        ? {
            ...s,
            status: "Selesai" as const,
            completedAt: now,
            homework: homeworkAssigned
              ? { title: hwTitle, description: hwDesc, submissionMethod: hwMethod, deadline: hwDeadline }
              : undefined,
          }
        : s
    ));
    if (completionSession) {
      setWeeklySchedules((prev) => prev.map((ws) =>
        ws.id === completionSession.scheduleId
          ? { ...ws, completedSessions: ws.completedSessions + 1 }
          : ws
      ));
    }
    triggerToast(homeworkAssigned
      ? "Sesi selesai! Tugas telah dikirimkan ke murid."
      : "Sesi selesai! Log pertemuan berhasil disimpan."
    );
    setCompletionSessionId(null);
    setFilterTab("terdahulu");
  };

  const openRequestModal = (sessionId: string, type: "reschedule" | "cancel") => {
    setRequestTargetId(sessionId);
    setRequestType(type);
    setRequestReason("");
    setRescheduleChangeType("Offline");
    setProposedDate(""); setProposedStart(""); setProposedEnd("");
    setRequestModalOpen(true);
  };

  const handleSendApprovalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestType === "reschedule") {
      if (!proposedDate) { triggerToast("Masukkan tanggal baru yang diusulkan.", "error"); return; }
      if (!proposedStart || !proposedEnd) { triggerToast("Masukkan jam mulai & selesai yang diusulkan.", "error"); return; }
    }
    if (!requestReason.trim()) { triggerToast("Masukkan alasan pengajuan.", "error"); return; }
    triggerToast(
      requestType === "reschedule"
        ? `Permohonan Reschedule dikirim. Menunggu persetujuan Murid → Lead Mentor${rescheduleChangeType === "Online" ? " → Mentor kirim link Zoom" : ""}.`
        : "Permohonan Pembatalan dikirim ke Mentor Lead. Menunggu persetujuan.",
      "success"
    );
    setRequestModalOpen(false);
    setRequestTargetId(null);
  };

  // ── Style Helper ──────────────────────────────────────────────────────
  const innerCard = () => {
    switch (selectedStyle) {
      case "neobrutalism": return "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
      case "claymorphism": return "bg-slate-50 dark:bg-zinc-900 border border-slate-200/20 dark:border-zinc-800/45 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)] rounded-2xl";
      case "glassmorphism": case "liquid-glass": return "bg-white/10 dark:bg-zinc-950/20 border border-white/10 backdrop-blur-md rounded-2xl shadow-xs";
      case "minimalism": return "bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 rounded-lg";
      default: return "bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-3xs";
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 text-left py-4 pb-16 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-black max-w-sm ${
          toast.type === "success" ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20"
          : toast.type === "warning" ? "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20"
          : "bg-red-500/10 text-red-800 dark:text-red-300 border-red-500/20"
        }`}>
          {toast.type === "success" ? <Icons.Check className="w-4 h-4 shrink-0 text-emerald-500" /> : <Icons.AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">Jadwal Mengajar Anda</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Kelola jadwal mingguan & catat log pertemuan kelas Anda.</p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 self-start text-xs">
          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Demo:</span>
          {(["default", "loading", "empty"] as const).map((s) => (
            <button key={s} onClick={() => setScenario(s)} className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border transition-all cursor-pointer ${scenario === s ? `${getBgClass(selectedColor)} text-white border-transparent` : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading && <SchedulesSkeleton />}

      {!loading && (
        <>
          {/* ── Weekly Schedules ──────────────────────────────────── */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
              <Icons.Calendar className="w-3.5 h-3.5" /> Jadwal Mingguan Aktif
            </h2>
            {weeklySchedules.length === 0 ? (
              <div className={`${innerCard()} p-8 text-center text-xs text-zinc-400`}>Tidak ada jadwal mingguan aktif.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeklySchedules.map((ws) => {
                  const pct = Math.round((ws.completedSessions / ws.totalSessions) * 100);
                  return (
                    <div key={ws.id} className={`${innerCard()} p-4 flex flex-col gap-3`}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400">{ws.mode === "Kelompok" ? "👥 Kelas Kelompok" : "👤 Kelas Private"}</span>
                          <h3 className="text-xs font-black text-zinc-900 dark:text-white mt-0.5 truncate">{ws.studentName}</h3>
                          <p className="text-[9.5px] text-zinc-500 mt-0.5 truncate">{ws.course}</p>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 border ${ws.status === "Aktif" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200"}`}>{ws.status}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 text-[10.5px]">
                        <div className="flex items-center gap-1.5 font-semibold text-zinc-600 dark:text-zinc-400">
                          <Icons.Calendar className="w-3 h-3 shrink-0 text-zinc-400" />
                          Setiap <span className="font-black text-zinc-800 dark:text-zinc-100 ml-1">{ws.days.join(" & ")}</span>
                          <span className="text-[8px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded-full font-bold text-zinc-500">{ws.frequency}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sakode-blue font-extrabold">
                          <Icons.Clock className="w-3 h-3 shrink-0" />{ws.startTime} – {ws.endTime} WIB
                        </div>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ws.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 text-zinc-500 hover:text-sakode-blue transition-colors">
                          <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" className="w-3 h-3 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S12 17.642 12 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                          <span className="text-[9.5px] hover:underline">{ws.address}</span>
                        </a>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[9.5px] font-bold text-zinc-400">
                          <span>Progres</span>
                          <span className="font-black text-zinc-600 dark:text-zinc-300">{ws.completedSessions}/{ws.totalSessions} sesi</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5">
                          <div className={`${getBgClass(selectedColor)} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[9px] text-zinc-400">{ws.startDate} s/d {ws.endDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Session Occurrences ───────────────────────────────── */}
          <section>
            {/* Filter tabs */}
            <div className="flex items-center gap-0 border-b border-zinc-200 dark:border-zinc-800">
              {(["mendatang", "terdahulu"] as const).map((tab) => (
                <button key={tab} id={`tab-${tab}`} onClick={() => { setFilterTab(tab); setFilterDate(""); }} className={`px-4 pb-2.5 text-xs font-black cursor-pointer border-b-2 transition-all -mb-px ${filterTab === tab && !filterDate ? `${getTextClass(selectedColor)} border-current` : "text-zinc-400 border-transparent hover:text-zinc-600 dark:hover:text-zinc-300"}`}>
                  {tab === "mendatang" ? "📅 Jadwal Mendatang" : "🗂️ Jadwal Terdahulu"}
                </button>
              ))}
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50 mb-2">
              {/* Student filter */}
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" className="w-3.5 h-3.5 text-zinc-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <select
                  id="filter-student"
                  value={filterStudent}
                  onChange={(e) => setFilterStudent(e.target.value)}
                  className="text-[10.5px] font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300 outline-hidden cursor-pointer"
                >
                  <option value="">Semua Murid</option>
                  {uniqueStudents.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Date filter */}
              <div className="flex items-center gap-1.5">
                <Icons.Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <input
                  id="filter-date"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-[10.5px] font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-700 dark:text-zinc-300 outline-hidden cursor-pointer"
                />
                <button
                  type="button"
                  id="filter-hari-ini"
                  onClick={() => setFilterDate(today)}
                  className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    filterDate === today
                      ? `${getBgClass(selectedColor)} text-white border-transparent`
                      : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"
                  }`}
                >
                  Hari ini
                </button>
              </div>

              {/* Active filter indicator + clear */}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => { setFilterStudent(""); setFilterDate(""); }}
                  className="flex items-center gap-1 text-[10px] font-black text-red-500 hover:text-red-700 cursor-pointer bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-xl transition-all"
                >
                  <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Hapus Filter ({activeFilterCount})
                </button>
              )}

              {/* Result count */}
              <span className="ml-auto text-[9.5px] font-bold text-zinc-400">
                {filteredSessions.length} sesi ditemukan
              </span>
            </div>

            {filteredSessions.length === 0 ? (
              <div className={`${innerCard()} p-10 text-center text-xs text-zinc-400 flex flex-col items-center gap-2`}>
                <Icons.Calendar className="w-8 h-8 text-zinc-300 dark:text-zinc-700 animate-pulse" />
                <span>{filterTab === "mendatang" ? "Tidak ada jadwal mendatang." : "Tidak ada jadwal terdahulu."}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSessions.map((session) => (
                  <div key={session.id} id={`card-${session.id}`} className={`${innerCard()} p-4 flex flex-col gap-3.5 ${session.status === "Berlangsung" ? "ring-2 ring-red-500/40" : ""}`}>

                    {/* Card header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Pertemuan ke-{session.sessionNumber}</span>
                        <p className="text-[11px] font-black text-zinc-800 dark:text-zinc-100 mt-0.5">{session.studentName}</p>
                        <p className="text-[9.5px] text-zinc-500 mt-0.5">{session.course}</p>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${
                        session.status === "Berlangsung" ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25 animate-pulse"
                        : session.status === "Selesai" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                        : session.status === "Rescheduled" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                        : session.status === "Dibatalkan" ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                        : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                      }`}>
                        {session.status === "Berlangsung" ? "🔴 Berlangsung" : session.status}
                      </span>
                    </div>

                    {/* Berlangsung live indicator */}
                    {session.status === "Berlangsung" && (
                      <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                          <div>
                            <p className="text-[9.5px] font-black text-red-700 dark:text-red-400">Sesi Sedang Berlangsung</p>
                            <p className="text-[9px] text-zinc-500">Dimulai pukul <span className="font-bold">{formatTimestamp(session.startedAt)} WIB</span></p>
                          </div>
                        </div>
                      </div>
                    )}

                    {session.hasConflictNotice && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-[9.5px] text-red-700 dark:text-red-400 font-bold flex items-start gap-1.5">
                        <Icons.AlertCircle className="w-3 h-3 shrink-0 mt-0.5" /><span>Ada potensi benturan jadwal dengan sesi lain.</span>
                      </div>
                    )}

                    {/* Info rows */}
                    <div className="flex flex-col gap-1.5 text-[10.5px] border-t border-zinc-200/40 dark:border-zinc-800/40 pt-2.5">
                      <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
                        <Icons.Calendar className="w-3 h-3 shrink-0 text-zinc-400" />{formatDateLong(session.date)}
                      </div>
                      <div className="flex items-center gap-1.5 text-sakode-blue font-extrabold">
                        <Icons.Clock className="w-3 h-3 shrink-0" />{session.startTime} – {session.endTime} WIB
                      </div>

                      {/* Completed info */}
                      {session.status === "Selesai" && (
                        <>
                          <div className="flex items-start gap-1.5 text-zinc-600 dark:text-zinc-300 font-semibold">
                            <svg viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" className="w-3 h-3 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                            <span className="font-bold">{session.topic}</span>
                          </div>
                          {session.startedAt && session.completedAt && (
                            <p className="text-[9px] text-zinc-400 pl-4">
                              {formatTimestamp(session.startedAt)} – {formatTimestamp(session.completedAt)} · {durationLabel(session.startedAt, session.completedAt)}
                            </p>
                          )}
                          {session.homework && (
                            <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] font-bold text-violet-700 dark:text-violet-400">
                              📋 Tugas: {session.homework.title}
                            </div>
                          )}
                          {session.devices && session.devices.length > 0 && (
                            <div className="flex flex-wrap gap-1 pl-4">
                              {session.devices.map((d) => (
                                <span key={d} className="text-[8.5px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 font-bold text-zinc-500">{d}</span>
                              ))}
                            </div>
                          )}
                        </>
                      )}

                      {session.statusNotes && (
                        <p className="text-[9.5px] text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 p-1.5 rounded-lg mt-0.5">
                          🛈 {session.statusNotes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 mt-auto pt-1">
                      {session.status === "Berlangsung" && (
                        <button type="button" id={`btn-selesai-${session.id}`} onClick={() => openCompletion(session.id)} className={`w-full py-2 text-xs font-black rounded-xl ${getBgClass(selectedColor)} text-white cursor-pointer hover:opacity-90`}>
                          ⏹ Selesaikan Pertemuan
                        </button>
                      )}
                      {(session.status === "Terjadwal" || session.status === "Rescheduled") && (
                        <>
                          <button type="button" id={`btn-mulai-${session.id}`} onClick={() => openPreSession(session.id)} className={`w-full py-2 text-xs font-black rounded-xl ${getBgClass(selectedColor)} text-white cursor-pointer hover:opacity-90`}>
                            ▶ Mulai Pertemuan
                          </button>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button type="button" onClick={() => openRequestModal(session.id, "reschedule")} className="py-1.5 text-[10px] font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">Reschedule</button>
                            <button type="button" onClick={() => openRequestModal(session.id, "cancel")} className="py-1.5 text-[10px] font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 text-red-500 hover:bg-red-500/10 cursor-pointer">Batalkan</button>
                          </div>
                        </>
                      )}
                      {session.status === "Selesai" && (
                        <button type="button" onClick={() => setDetailSessionId(session.id)} className="w-full py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">Lihat Detail</button>
                      )}
                      {session.status === "Dibatalkan" && (
                        <div className="text-center text-[9.5px] text-zinc-400 font-bold py-1.5">— Sesi Dibatalkan —</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* ── Detail Modal (Selesai) ─────────────────────────────────────── */}
      {detailSessionId && detailSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`${innerCard()} max-w-md w-full p-6 flex flex-col gap-4 relative animate-fade-in max-h-[90vh] overflow-y-auto`}>
            <button type="button" onClick={() => setDetailSessionId(null)} className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer" aria-label="Tutup">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Detail Pertemuan ke-{detailSession.sessionNumber}</span>
              <h3 className="text-sm font-black text-zinc-800 dark:text-white mt-0.5">{detailSession.studentName}</h3>
              <p className="text-[10px] text-zinc-400">{detailSession.course}</p>
            </div>

            {/* Session log */}
            <div className="bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/25 p-4 rounded-xl flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">Tanggal</span>
                  <span className="font-extrabold text-zinc-700 dark:text-zinc-200 mt-0.5 block text-[10px]">{formatDateLong(detailSession.date)}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">Durasi Aktual</span>
                  <span className="font-extrabold text-zinc-700 dark:text-zinc-200 mt-0.5 block">
                    {detailSession.startedAt && detailSession.completedAt
                      ? `${formatTimestamp(detailSession.startedAt)} – ${formatTimestamp(detailSession.completedAt)}`
                      : `${detailSession.startTime} – ${detailSession.endTime}`}
                  </span>
                  {detailSession.startedAt && detailSession.completedAt && (
                    <span className="text-[9px] text-zinc-400">{durationLabel(detailSession.startedAt, detailSession.completedAt)}</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">Materi / Modul</span>
                <span className="font-extrabold text-zinc-800 dark:text-zinc-100 mt-0.5 block">{detailSession.topic}</span>
              </div>
              {detailSession.devices && detailSession.devices.length > 0 && (
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1.5">Perangkat Digunakan</span>
                  <div className="flex flex-wrap gap-1">
                    {detailSession.devices.map((d) => (
                      <span key={d} className="text-[9px] bg-blue-500/10 border border-blue-500/20 rounded px-2 py-0.5 font-bold text-blue-700 dark:text-blue-400">{d}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Homework */}
            {detailSession.homework ? (
              <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-4 flex flex-col gap-2 text-xs">
                <span className="text-[9px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">📋 Tugas Diberikan</span>
                <p className="font-black text-zinc-800 dark:text-zinc-100">{detailSession.homework.title}</p>
                {detailSession.homework.description && <p className="text-[10px] text-zinc-500">{detailSession.homework.description}</p>}
                <div className="flex gap-4 mt-1">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">Pengumpulan</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{detailSession.homework.submissionMethod}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">Deadline</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{detailSession.homework.deadline}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/25 rounded-xl p-3 text-[10px] text-zinc-400 font-semibold text-center">
                Tidak ada tugas pada sesi ini
              </div>
            )}

            {/* Maps */}
            <div className="bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/25 p-3.5 rounded-xl text-xs flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-zinc-500">📍 Lokasi Kunjungan</span>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailSession.address)}`} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-sakode-blue hover:underline flex items-center gap-1">
                  Buka Maps
                  <svg viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" fill="none" className="w-2.5 h-2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                </a>
              </div>
              <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{detailSession.address}</p>
            </div>

            <button type="button" onClick={() => setDetailSessionId(null)} className="w-full py-2 text-xs font-bold border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">Tutup</button>
          </div>
        </div>
      )}

      {/* ── Pre-Session Modal (topik + perangkat sebelum mulai) ────────── */}
      {preSessionId && preSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleStartSession} className={`${innerCard()} max-w-md w-full p-6 flex flex-col gap-4.5 relative animate-fade-in max-h-[90vh] overflow-y-auto`}>
            <button type="button" onClick={() => setPreSessionId(null)} className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer" aria-label="Tutup">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>

            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Mulai Pertemuan ke-{preSession.sessionNumber}</span>
              <h3 className="text-sm font-black text-zinc-800 dark:text-white mt-0.5">{preSession.studentName}</h3>
              <div className="flex items-center gap-2 mt-1.5 text-[10.5px] font-semibold text-zinc-500">
                <span>📅 {formatDateLong(preSession.date)}</span>
                <span>·</span>
                <span className="text-sakode-blue font-extrabold">{preSession.startTime} – {preSession.endTime}</span>
              </div>
            </div>

            {/* Module selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-zinc-700 dark:text-zinc-200">Modul / Topik Sesi Ini <span className="text-red-400">*</span></label>
              <p className="text-[9.5px] text-zinc-400">Pilih modul kurikulum yang akan dibahas.</p>
              <div className="flex flex-col gap-1 mt-0.5 max-h-48 overflow-y-auto pr-0.5">
                {preSchedule?.modules.map((mod) => (
                  <button key={mod.id} type="button" onClick={() => setSelectedModuleId(mod.id)} className={`w-full text-left p-2.5 rounded-xl border text-[10.5px] cursor-pointer transition-all ${selectedModuleId === mod.id ? "bg-blue-500/10 border-blue-500/40 text-blue-700 dark:text-blue-300" : "bg-zinc-100/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400"}`}>
                    <div className="flex items-start gap-2">
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${selectedModuleId === mod.id ? "bg-blue-500/20 text-blue-700 dark:text-blue-300" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"}`}>M{mod.number}</span>
                      <div><p className="font-black">{mod.title}</p>{mod.description && <p className="text-[9px] text-zinc-400 mt-0.5">{mod.description}</p>}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Device dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-zinc-700 dark:text-zinc-200">Perangkat yang Digunakan <span className="text-red-400">*</span></label>
              <p className="text-[9.5px] text-zinc-400">Pilih dari daftar atau ketik perangkat custom.</p>
              <SearchableDeviceDropdown selected={selectedDevices} onChange={setSelectedDevices} />
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <button type="button" onClick={() => setPreSessionId(null)} className="px-4 py-2 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 cursor-pointer">Batal</button>
              <button type="submit" className={`px-5 py-2 text-xs font-black ${getBgClass(selectedColor)} text-white rounded-xl cursor-pointer hover:opacity-90`}>▶ Mulai Pertemuan</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Completion Modal (selesaikan pertemuan) ──────────────────────── */}
      {completionSessionId && completionSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleCompleteSession} className={`${innerCard()} max-w-md w-full p-6 flex flex-col gap-4 relative animate-fade-in max-h-[90vh] overflow-y-auto`}>
            <button type="button" onClick={() => setCompletionSessionId(null)} className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer" aria-label="Tutup">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>

            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Selesaikan Pertemuan ke-{completionSession.sessionNumber}</span>
              <h3 className="text-sm font-black text-zinc-800 dark:text-white mt-0.5">{completionSession.studentName}</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">{completionSession.topic}</p>
            </div>

            {/* Log waktu */}
            <div className="bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/25 rounded-xl p-3 flex items-center justify-between text-[10.5px] font-semibold">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Mulai:</span>
                <span className="font-black text-zinc-700 dark:text-zinc-200">{formatTimestamp(completionSession.startedAt)} WIB</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <span>Selesai:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">Sekarang</span>
              </div>
            </div>

            {/* Homework toggle */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-black text-zinc-700 dark:text-zinc-200">Apakah ada tugas untuk murid?</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setHomeworkAssigned(false)} className={`py-2.5 rounded-xl border text-xs font-black cursor-pointer transition-all ${!homeworkAssigned ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent" : "bg-zinc-100/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"}`}>
                  ✕ Tidak Ada Tugas
                </button>
                <button type="button" onClick={() => setHomeworkAssigned(true)} className={`py-2.5 rounded-xl border text-xs font-black cursor-pointer transition-all ${homeworkAssigned ? `${getBgClass(selectedColor)} text-white border-transparent` : "bg-zinc-100/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"}`}>
                  📋 Ada Tugas
                </button>
              </div>
            </div>

            {/* Homework form — conditional */}
            {homeworkAssigned && (
              <div className="flex flex-col gap-3 bg-violet-500/5 border border-violet-500/20 rounded-xl p-3.5">
                <p className="text-[9px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">Detail Tugas</p>
                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] font-black text-zinc-600 dark:text-zinc-300">Judul Tugas <span className="text-red-400">*</span></label>
                  <input type="text" value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} placeholder="Contoh: Latihan Flexbox Layout..." className="w-full bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-100 outline-hidden placeholder:text-zinc-400 placeholder:font-normal" required={homeworkAssigned} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] font-black text-zinc-600 dark:text-zinc-300">Deskripsi Tugas</label>
                  <textarea rows={2} value={hwDesc} onChange={(e) => setHwDesc(e.target.value)} placeholder="Jelaskan detail tugas yang harus dikerjakan murid..." className="w-full bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-100 outline-hidden placeholder:text-zinc-400 placeholder:font-normal resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-black text-zinc-600 dark:text-zinc-300">Metode Pengumpulan <span className="text-red-400">*</span></label>
                    <select value={hwMethod} onChange={(e) => setHwMethod(e.target.value)} className="w-full bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-700 outline-hidden" required={homeworkAssigned}>
                      <option value="">— Pilih —</option>
                      {SUBMISSION_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-black text-zinc-600 dark:text-zinc-300">Deadline <span className="text-red-400">*</span></label>
                    <input type="date" value={hwDeadline} onChange={(e) => setHwDeadline(e.target.value)} className="w-full bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-700 outline-hidden" required={homeworkAssigned} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-1">
              <button type="button" onClick={() => setCompletionSessionId(null)} className="px-4 py-2 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 cursor-pointer">Batal</button>
              <button type="submit" className={`px-5 py-2 text-xs font-black ${getBgClass(selectedColor)} text-white rounded-xl cursor-pointer hover:opacity-90`}>⏹ Selesaikan Pertemuan</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Request Modal (reschedule / cancel) ──────────────────────────── */}
      {requestModalOpen && requestTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleSendApprovalRequest} className={`${innerCard()} max-w-md w-full p-6 flex flex-col gap-4 relative animate-fade-in max-h-[90vh] overflow-y-auto`}>
            <button type="button" onClick={() => setRequestModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer" aria-label="Tutup">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>

            <div>
              <h4 className="text-xs font-black text-zinc-800 dark:text-white uppercase tracking-wider">
                {requestType === "reschedule" ? "🔄 Ajukan Permohonan Reschedule" : "🚫 Ajukan Permohonan Pembatalan"}
              </h4>
              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-1">Pertemuan ke-{requestTarget.sessionNumber} · {requestTarget.studentName}</p>
              <span className="inline-flex items-center gap-1 mt-1.5 text-[7.5px] bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-black border border-amber-500/20">🔒 Memerlukan Persetujuan Bertingkat</span>
            </div>

            {/* Approval chain — reschedule only */}
            {requestType === "reschedule" && (
              <div className="bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200/25 rounded-xl p-3 flex flex-col gap-1.5">
                <p className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400">Alur Persetujuan (Inisiasi Mentor)</p>
                <div className="flex items-center gap-1 flex-wrap text-[9.5px] font-bold">
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">✅ Mentor</span>
                  <span className="text-zinc-300 dark:text-zinc-600">→</span>
                  <span className="text-zinc-500 bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded">⏳ Murid</span>
                  <span className="text-zinc-300 dark:text-zinc-600">→</span>
                  <span className="text-zinc-500 bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded">⏳ Lead Mentor</span>
                  {rescheduleChangeType === "Online" && (
                    <>
                      <span className="text-zinc-300 dark:text-zinc-600">→</span>
                      <span className="text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded">⏳ Mentor Kirim Link</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Reschedule type + proposed datetime */}
            {requestType === "reschedule" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-zinc-700 dark:text-zinc-200">Format Sesi Baru</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Offline", "Online"] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setRescheduleChangeType(t)} className={`py-2.5 px-3 rounded-xl border text-[10.5px] font-black flex flex-col items-center gap-1 cursor-pointer transition-all ${rescheduleChangeType === t ? (t === "Offline" ? "bg-blue-500/10 border-blue-500/40 text-blue-700 dark:text-blue-400" : "bg-violet-500/10 border-violet-500/40 text-violet-700 dark:text-violet-400") : "bg-zinc-100/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"}`}>
                        {t === "Offline"
                          ? <svg viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" fill="none" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S12 17.642 12 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                          : <svg viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" fill="none" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                        }
                        {t === "Offline" ? "Tetap Offline" : "Ubah ke Online"}
                        <span className="text-[8px] opacity-60 font-semibold">{t === "Online" ? "(via Zoom)" : "(Kunjungan Rumah)"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Offline/Online note */}
                {rescheduleChangeType === "Online" && (
                  <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 flex items-start gap-2.5 text-[10.5px] text-amber-800 dark:text-amber-300 font-bold">
                    <svg viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" fill="none" className="w-4 h-4 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    <span><span className="font-black">Catatan: </span>Format Online hanya aktif setelah disetujui Lead Mentor. Mentor wajib mengirimkan link Zoom setelah persetujuan diterima.</span>
                  </div>
                )}

                {/* Proposed date & time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-zinc-700 dark:text-zinc-200">Usulan Tanggal & Waktu Baru <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-3 flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-zinc-500">Tanggal</label>
                      <input type="date" value={proposedDate} onChange={(e) => setProposedDate(e.target.value)} className="w-full bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-700 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-100 outline-hidden" required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-zinc-500">Jam Mulai</label>
                      <input type="time" value={proposedStart} onChange={(e) => setProposedStart(e.target.value)} className="w-full bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-700 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-100 outline-hidden" required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-zinc-500">Jam Selesai</label>
                      <input type="time" value={proposedEnd} onChange={(e) => setProposedEnd(e.target.value)} className="w-full bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-700 p-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-100 outline-hidden" required />
                    </div>
                    <div className="col-span-1 flex items-end">
                      {proposedDate && proposedStart && proposedEnd && (
                        <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1">
                          ✓ {proposedDate} · {proposedStart}–{proposedEnd}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Reason textarea */}
            <div className="flex flex-col gap-1.5 text-xs font-semibold">
              <label className="text-zinc-600 dark:text-zinc-300 font-black">{requestType === "reschedule" ? "Alasan Pengajuan" : "Alasan Pembatalan"} <span className="text-red-400">*</span></label>
              <textarea rows={3} placeholder={requestType === "reschedule" ? "Jelaskan alasan perubahan jadwal ini..." : "Jelaskan alasan pembatalan sesi ini..."} value={requestReason} onChange={(e) => setRequestReason(e.target.value)} className="w-full bg-zinc-100/60 dark:bg-zinc-800/65 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl outline-hidden font-bold text-zinc-800 dark:text-zinc-100 text-xs" required />
            </div>

            <div className="flex justify-end gap-3 pt-1 text-xs">
              <button type="button" onClick={() => setRequestModalOpen(false)} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl cursor-pointer">Batalkan</button>
              <button type="submit" className={`px-4 py-2 ${getBgClass(selectedColor)} text-white font-black rounded-xl cursor-pointer`}>Kirim Permohonan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
