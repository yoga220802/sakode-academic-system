"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { MentoringSchedule } from "./_types/schedule";
import {
  getStoredSchedules,
  saveStoredSchedules,
  validateScheduleConflicts,
  DEFAULT_SCHEDULES
} from "@/app/_data/schedule-mock";
import { getLocalStudents, ActiveStudent } from "@/app/_services/student-service";
import { getStoredMentors } from "@/app/_data/mentor-mock";
import { Mentor } from "../mentors/_types/mentor";

// Hour slots for visual calendar grid
const TIME_SLOTS = [
  { label: "08:00 - 10:00", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", start: "10:00", end: "12:00" },
  { label: "13:00 - 15:00", start: "13:00", end: "15:00" },
  { label: "15:00 - 17:00", start: "15:00", end: "17:00" },
  { label: "17:00 - 19:00", start: "17:00", end: "19:00" }
];

// Days of the week for visual calendar grid
const DAYS = [
  { name: "Monday", label: "Senin", dateOffset: 0 },
  { name: "Tuesday", label: "Selasa", dateOffset: 1 },
  { name: "Wednesday", label: "Rabu", dateOffset: 2 },
  { name: "Thursday", label: "Kamis", dateOffset: 3 },
  { name: "Friday", label: "Jumat", dateOffset: 4 },
  { name: "Saturday", label: "Sabtu", dateOffset: 5 },
  { name: "Sunday", label: "Minggu", dateOffset: 6 }
];

// Reference date for the week view (July 6th to July 12th, 2026)
const WEEK_START_DATE = new Date("2026-07-06");

export default function SchedulesAdminPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // 1. Data States
  const [schedules, setSchedules] = useState<MentoringSchedule[]>([]);
  const [students, setStudents] = useState<ActiveStudent[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  // 2. Filter & Navigation States
  const [activeTab, setActiveTab] = useState<"agenda" | "calendar">("agenda");
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorFilter, setMentorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");

  // 3. Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  // 4. Form states
  const [formData, setFormData] = useState({
    studentId: "",
    date: "2026-07-08",
    startTime: "10:00",
    endTime: "12:00",
    roomName: "Lab Utama - Meja A",
    moduleChapter: "Modul 1: Pengenalan",
    notes: ""
  });
  const [formError, setFormError] = useState<string | null>(null);

  // 5. Simulation States
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load initial data
  useEffect(() => {
    setSchedules(getStoredSchedules());
    setStudents(getLocalStudents());
    setMentors(getStoredMentors());
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetData = () => {
    setSchedules(DEFAULT_SCHEDULES);
    saveStoredSchedules(DEFAULT_SCHEDULES);
    showToast("Data penjadwalan berhasil di-reset.");
  };

  // Derive selected student details to prefill mentor & branch info in Add Form
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === formData.studentId) || null;
  }, [students, formData.studentId]);

  // Autofill form options when student changes
  useEffect(() => {
    if (selectedStudent) {
      // Find default chapter module based on student's program
      const nextMod = `Modul ${selectedStudent.completedModulesCount + 1}: Bab Pembelajaran`;
      setFormData((prev) => ({
        ...prev,
        moduleChapter: nextMod
      }));
    }
  }, [selectedStudent]);

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    if (simulationState === "empty") return [];
    return schedules.filter((s) => {
      const matchesSearch =
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.moduleChapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roomName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMentor = mentorFilter === "all" || s.mentorId === mentorFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesProgram = programFilter === "all" || s.programSlug === programFilter;

      return matchesSearch && matchesMentor && matchesStatus && matchesProgram;
    });
  }, [schedules, searchQuery, mentorFilter, statusFilter, programFilter, simulationState]);

  // Compute active stats metrics
  const metrics = useMemo(() => {
    if (simulationState === "empty") {
      return { scheduled: 0, completed: 0, cancelled: 0 };
    }
    return {
      scheduled: schedules.filter((s) => s.status === "scheduled" || s.status === "ongoing").length,
      completed: schedules.filter((s) => s.status === "completed").length,
      cancelled: schedules.filter((s) => s.status === "cancelled").length
    };
  }, [schedules, simulationState]);

  // Generate calendar dates for the active week (Monday, July 6, 2026 - Sunday)
  const getWeekDayDateString = (offset: number) => {
    const d = new Date(WEEK_START_DATE);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
  };

  const getWeekDayLabel = (offset: number) => {
    const d = new Date(WEEK_START_DATE);
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  // Check overlap schedule
  const handleOpenAddModal = () => {
    const firstPlottedStudent = students.find((s) => s.assignedMentorId !== null);
    setFormData({
      studentId: firstPlottedStudent ? firstPlottedStudent.id : "",
      date: "2026-07-08",
      startTime: "10:00",
      endTime: "12:00",
      roomName: "Lab Utama - Meja A",
      moduleChapter: "Modul 1: Pengenalan",
      notes: ""
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (session: MentoringSchedule) => {
    setEditingScheduleId(session.id);
    setFormData({
      studentId: session.studentId,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      roomName: session.roomName,
      moduleChapter: session.moduleChapter,
      notes: session.notes || ""
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Submit schedules creation
  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) {
      setFormError("Pilih murid terlebih dahulu.");
      return;
    }

    if (!selectedStudent || !selectedStudent.assignedMentorId) {
      setFormError("Murid terpilih belum diploting ke mentor pendamping.");
      return;
    }

    const startMin = parseInt(formData.startTime.split(":")[0]) * 60 + parseInt(formData.startTime.split(":")[1]);
    const endMin = parseInt(formData.endTime.split(":")[0]) * 60 + parseInt(formData.endTime.split(":")[1]);
    if (startMin >= endMin) {
      setFormError("Jam selesai harus setelah jam mulai sesi.");
      return;
    }

    // Prepare model payload
    const newSessionPayload = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      isGroup: selectedStudent.isGroup,
      programName: selectedStudent.programName,
      programSlug: selectedStudent.programSlug,
      mentorId: selectedStudent.assignedMentorId,
      mentorName: selectedStudent.assignedMentorName || "",
      address: selectedStudent.address,
      roomName: formData.roomName,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      moduleChapter: formData.moduleChapter,
      notes: formData.notes
    };

    // Run overlap validation
    const validation = validateScheduleConflicts(newSessionPayload, undefined, schedules);
    if (validation.isConflict) {
      setFormError(validation.message || "Terjadi bentrok jadwal.");
      return;
    }

    const newId = `SCH-${Math.floor(107 + Math.random() * 900)}`;
    const newSchedule: MentoringSchedule = {
      id: newId,
      ...newSessionPayload,
      status: "scheduled"
    };

    const updated = [newSchedule, ...schedules];
    setSchedules(updated);
    saveStoredSchedules(updated);
    setIsAddModalOpen(false);
    showToast(`Sukses membuat jadwal mentoring offline baru untuk murid ${selectedStudent.name}.`);
  };

  // Submit schedules edits
  const handleEditScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheduleId) return;

    if (!selectedStudent || !selectedStudent.assignedMentorId) {
      setFormError("Murid terpilih tidak valid atau belum diploting ke mentor.");
      return;
    }

    const startMin = parseInt(formData.startTime.split(":")[0]) * 60 + parseInt(formData.startTime.split(":")[1]);
    const endMin = parseInt(formData.endTime.split(":")[0]) * 60 + parseInt(formData.endTime.split(":")[1]);
    if (startMin >= endMin) {
      setFormError("Jam selesai harus setelah jam mulai sesi.");
      return;
    }

    const updatedPayload = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      isGroup: selectedStudent.isGroup,
      programName: selectedStudent.programName,
      programSlug: selectedStudent.programSlug,
      mentorId: selectedStudent.assignedMentorId,
      mentorName: selectedStudent.assignedMentorName || "",
      address: selectedStudent.address,
      roomName: formData.roomName,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      moduleChapter: formData.moduleChapter,
      notes: formData.notes
    };

    // Overlap validations
    const validation = validateScheduleConflicts(updatedPayload, editingScheduleId, schedules);
    if (validation.isConflict) {
      setFormError(validation.message || "Terjadi bentrok jadwal.");
      return;
    }

    const updated = schedules.map((s) =>
      s.id === editingScheduleId
        ? {
            ...s,
            ...updatedPayload
          }
        : s
    );

    setSchedules(updated);
    saveStoredSchedules(updated);
    setIsEditModalOpen(false);
    showToast("Jadwal mentoring berhasil diperbarui.");
  };

  // Quick Action Toggles: Completed
  const handleCompleteSession = (session: MentoringSchedule) => {
    const updated = schedules.map((s) => (s.id === session.id ? { ...s, status: "completed" as const } : s));
    setSchedules(updated);
    saveStoredSchedules(updated);
    showToast(`Sesi ${session.id} diselesaikan.`);
  };

  // Quick Action Toggles: Cancelled
  const handleCancelSession = (session: MentoringSchedule) => {
    const updated = schedules.map((s) => (s.id === session.id ? { ...s, status: "cancelled" as const } : s));
    setSchedules(updated);
    saveStoredSchedules(updated);
    showToast(`Sesi ${session.id} dibatalkan.`);
  };

  // Get visual color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <UI.Badge variant="success">Selesai</UI.Badge>;
      case "cancelled":
        return <UI.Badge variant="default" className="bg-zinc-100 text-zinc-500 border border-zinc-200">Batal</UI.Badge>;
      case "ongoing":
        return <UI.Badge variant="accent" accentColor="blue">Aktif</UI.Badge>;
      case "scheduled":
      default:
        return <UI.Badge variant="warning">Terjadwal</UI.Badge>;
    }
  };

  // UI styling layout mappings
  const getSubElementClass = (
    type: "card-item" | "panel-card" | "tab-button" | "divider" | "calendar-cell" | "calendar-card"
  ) => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-4 font-mono shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff]";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-5 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff]";
        if (type === "tab-button")
          return "border-2 border-zinc-900 dark:border-white rounded-none py-1.5 px-4 font-black";
        if (type === "divider")
          return "h-0.5 bg-zinc-900 dark:bg-white my-4";
        if (type === "calendar-cell")
          return "border border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 min-h-24 relative font-mono";
        if (type === "calendar-card")
          return "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white p-2 text-[10px] font-mono shadow-[1.5px_1.5px_0_#000] mb-2";
        return "";

      case "claymorphism":
        if (type === "card-item")
          return "bg-white/85 dark:bg-zinc-900/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_1px_2px_4px_rgba(0,0,0,0.04)] border border-zinc-200/50 dark:border-zinc-800/40 p-4 rounded-2xl";
        if (type === "panel-card")
          return "bg-slate-50 dark:bg-zinc-900 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.05),_inset_4px_4px_8px_rgba(255,255,255,0.4),_3px_5px_15px_rgba(0,0,0,0.05)] border border-slate-200/40 dark:border-zinc-850 p-5 rounded-3xl";
        if (type === "tab-button")
          return "rounded-xl py-1.5 px-4 font-bold shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]";
        if (type === "divider")
          return "h-px bg-zinc-200/60 dark:bg-zinc-800/40 my-4";
        if (type === "calendar-cell")
          return "border border-zinc-150 dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-950/20 p-2 min-h-24 rounded-xl";
        if (type === "calendar-card")
          return "bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/50 p-2 text-[10px] rounded-xl shadow-xs mb-2";
        return "";

      case "glassmorphism":
      case "liquid-glass":
        if (type === "card-item")
          return "bg-white/10 dark:bg-zinc-900/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 p-4 rounded-xl";
        if (type === "panel-card")
          return "bg-white/15 dark:bg-zinc-900/35 border border-white/20 dark:border-zinc-800/50 backdrop-blur-md p-5 rounded-2xl shadow-xl";
        if (type === "tab-button")
          return "rounded-lg py-1.5 px-4 font-bold backdrop-blur-3xs border border-white/10";
        if (type === "divider")
          return "h-px bg-white/10 dark:bg-zinc-800/50 my-4";
        if (type === "calendar-cell")
          return "border border-white/5 bg-white/5 backdrop-blur-3xs p-2 min-h-24 rounded-lg";
        if (type === "calendar-card")
          return "bg-white/10 border border-white/15 p-2 text-[10px] rounded-lg mb-2";
        return "";

      case "minimalism":
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-none";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-none";
        if (type === "tab-button")
          return "rounded-none py-1.5 px-4 font-medium border border-zinc-200 dark:border-zinc-800";
        if (type === "divider")
          return "h-px bg-zinc-200 dark:bg-zinc-800 my-4";
        if (type === "calendar-cell")
          return "border border-zinc-200 dark:border-zinc-800 bg-white p-2 min-h-24";
        if (type === "calendar-card")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 p-2 text-[10px] mb-2";
        return "";

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/80 p-4 rounded-2xl shadow-sm";
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/80 p-5 rounded-3xl shadow-sm";
        if (type === "tab-button")
          return "rounded-xl py-1.5 px-4 font-bold border border-zinc-200/60 dark:border-zinc-805";
        if (type === "divider")
          return "h-px bg-zinc-200 dark:bg-zinc-800 my-4";
        if (type === "calendar-cell")
          return "border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/20 p-2.5 min-h-24 rounded-2xl";
        if (type === "calendar-card")
          return "bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-805 p-2 text-[10px] rounded-xl shadow-xs mb-2";
        return "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left">
      
      {/* 1. Header breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-355 font-bold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Jadwal Akademik</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Jadwal Mentoring Offline
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Susun jadwal bimbingan tatap muka, monitoring bentrok waktu mengajar, serta kelola status pertemuan siswa.
          </p>
        </div>
        
        {/* Add Schedule Trigger button */}
        <UI.Button
          onClick={handleOpenAddModal}
          variant="primary"
          accentColor={selectedColor}
          className="font-bold! text-xs! py-2.5! px-4! flex items-center gap-2 cursor-pointer shadow-3xs"
        >
          <Icons.Calendar className="w-4 h-4" />
          Buat Jadwal Baru
        </UI.Button>
      </div>

      {/* 2. Simulator bar */}
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
          Default (6 Sesi)
        </button>
        <button
          onClick={() => setSimulationState("loading")}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "loading"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Loading
        </button>
        <button
          onClick={() => setSimulationState("empty")}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
            simulationState === "empty"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs border border-zinc-200/50 dark:border-zinc-800"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Kosong
        </button>
        <button
          onClick={() => setSimulationState("error")}
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

      {/* 3. Stats metrics summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <UI.Card>
          <div className="p-4 text-left flex justify-between items-center">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wide">
                Total Sesi Terjadwal
              </span>
              <span className="text-xl font-black text-zinc-800 dark:text-white mt-1 block">
                {metrics.scheduled} Pertemuan
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-sakode-blue dark:text-sky-400">
              <Icons.Calendar className="w-5 h-5" />
            </div>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-4 text-left flex justify-between items-center">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wide">
                Sesi Selesai (Completed)
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                {metrics.completed} Selesai
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Icons.Check className="w-5 h-5" />
            </div>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-4 text-left flex justify-between items-center">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wide">
                Sesi Dibatalkan (Cancelled)
              </span>
              <span className="text-xl font-black text-rose-500 mt-1 block">
                {metrics.cancelled} Batal
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Icons.X className="w-5 h-5" />
            </div>
          </div>
        </UI.Card>
      </div>

      {/* Tab Switcher & Filter Toolbar bar */}
      <div className="flex flex-col gap-4">
        
        {/* Tab buttons */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-px">
          <button
            onClick={() => setActiveTab("agenda")}
            className={`${getSubElementClass("tab-button")} cursor-pointer ${
              activeTab === "agenda"
                ? "bg-sakode-blue dark:bg-sky-400 text-white dark:text-zinc-950 border-sakode-blue"
                : "bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/35 border-transparent"
            }`}
          >
            🗓 Tampilan Agenda List
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`${getSubElementClass("tab-button")} cursor-pointer ${
              activeTab === "calendar"
                ? "bg-sakode-blue dark:bg-sky-400 text-white dark:text-zinc-950 border-sakode-blue"
                : "bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/35 border-transparent"
            }`}
          >
            📅 Tampilan Kalender Mingguan
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2.5 items-center w-full md:w-auto">
            {/* Search */}
            <div className="relative flex items-center w-full sm:w-60">
              <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3 z-10 pointer-events-none" />
              <UI.Input
                type="text"
                placeholder="Cari murid, mentor, atau materi..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                accentColor={selectedColor}
                className="pl-9! text-xs! py-1.5!"
              />
            </div>

            {/* Mentor filter */}
            <UI.Select
              value={mentorFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMentorFilter(e.target.value)}
              accentColor={selectedColor}
              className="text-xs! py-1.5! px-3!"
            >
              <option value="all">Semua Mentor</option>
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </UI.Select>

            {/* Program filter */}
            <UI.Select
              value={programFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProgramFilter(e.target.value)}
              accentColor={selectedColor}
              className="text-xs! py-1.5! px-3!"
            >
              <option value="all">Semua Kursus</option>
              <option value="frontend">React & Next.js</option>
              <option value="backend">Backend Dev Go</option>
              <option value="uiux">UI/UX Design</option>
            </UI.Select>

            {/* Status filter */}
            <UI.Select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              accentColor={selectedColor}
              className="text-xs! py-1.5! px-3!"
            >
              <option value="all">Semua Status</option>
              <option value="scheduled">Terjadwal</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Batal</option>
            </UI.Select>
          </div>
        </div>

      </div>

      {/* Main Workspace Body based on Active State */}
      {simulationState === "loading" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="animate-pulse bg-zinc-100/50 dark:bg-zinc-900/40 rounded-2xl h-36" />
          ))}
        </div>
      ) : simulationState === "error" ? (
        <div className="py-12 text-center bg-rose-500/5 border border-rose-500/15 rounded-2xl text-xs text-rose-600 font-medium">
          <Icons.AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          Gagal mengambil jadwal mentoring offline dari server.
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-400 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center gap-2">
          <Icons.Calendar className="w-8 h-8 text-zinc-300" />
          <span>Tidak ada jadwal mentoring yang terdaftar untuk filter ini.</span>
        </div>
      ) : activeTab === "agenda" ? (
        
        /* TAB 1: AGENDA LIST VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSchedules.map((session) => {
            const isCompleted = session.status === "completed";
            const isCancelled = session.status === "cancelled";

            return (
              <div key={session.id} className={getSubElementClass("card-item") + " flex flex-col justify-between"}>
                <div className="text-left space-y-3">
                  
                  {/* Top: Header metadata */}
                  <div className="flex justify-between items-start gap-2 border-b border-zinc-150/60 dark:border-zinc-800/60 pb-2.5">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-400 block uppercase tracking-wide">
                        {session.id} • Offline
                      </span>
                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white mt-1">
                        {session.studentName}
                      </h4>
                      <span className="text-[10px] text-zinc-500 block">
                        {session.programName}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {getStatusBadge(session.status)}
                      {session.isGroup && (
                        <UI.Badge variant="accent" accentColor="purple" className="text-[8px]! py-0!">
                          Kelompok
                        </UI.Badge>
                      )}
                    </div>
                  </div>

                  {/* Mid: Sesi detail specs */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-350">
                      <Icons.Clock className="w-3.5 h-3.5 text-sakode-blue dark:text-sky-400 shrink-0" />
                      <span className="font-bold">
                        📅 {session.date} • 🕒 {session.startTime} - {session.endTime} WIB
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-750 dark:text-zinc-350">
                      <Icons.User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>
                        Mentor: <span className="font-extrabold text-zinc-800 dark:text-white">{session.mentorName}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-750 dark:text-zinc-350">
                      <Icons.BookOpen className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {session.moduleChapter}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-400">
                      <Icons.Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-bold text-zinc-700 dark:text-zinc-200">
                        📍 {session.roomName} ({session.address.split(" - ")[0]})
                      </span>
                    </div>

                    {session.notes && (
                      <p className="bg-zinc-50 dark:bg-zinc-950/20 p-2.5 rounded-xl text-[11px] text-zinc-500 italic leading-relaxed border border-zinc-200/50 dark:border-zinc-850 mt-2">
                        &ldquo;{session.notes}&rdquo;
                      </p>
                    )}
                  </div>

                </div>

                {/* Bottom Actions if session is active */}
                {!isCompleted && !isCancelled && (
                  <div className="flex gap-2 border-t border-zinc-150/60 dark:border-zinc-800/60 pt-3 mt-4">
                    <UI.Button
                      onClick={() => handleCompleteSession(session)}
                      variant="secondary"
                      accentColor="green"
                      className="flex-1 text-[10.5px]! py-1.5! font-bold! cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Icons.Check className="w-3.5 h-3.5" />
                      Selesaikan
                    </UI.Button>
                    <UI.Button
                      onClick={() => handleOpenEditModal(session)}
                      variant="secondary"
                      accentColor="orange"
                      className="text-[10.5px]! py-1.5! px-3! font-bold! cursor-pointer flex items-center justify-center"
                      title="Reschedule / Ubah Jadwal"
                    >
                      <Icons.Clock className="w-3.5 h-3.5" />
                    </UI.Button>
                    <UI.Button
                      onClick={() => handleCancelSession(session)}
                      variant="secondary"
                      accentColor="red"
                      className="text-[10.5px]! py-1.5! px-3! font-bold! cursor-pointer flex items-center justify-center"
                      title="Batalkan Sesi"
                    >
                      <Icons.X className="w-3.5 h-3.5" />
                    </UI.Button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        
        /* TAB 2: WEEKLY CALENDAR VIEW */
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px] grid grid-cols-7 gap-3">
            
            {/* Days columns */}
            {DAYS.map((day) => {
              const dayDate = getWeekDayDateString(day.dateOffset);
              const dayLabel = getWeekDayLabel(day.dateOffset);
              
              // Filter sessions for this specific day
              const daySessions = filteredSchedules.filter((s) => s.date === dayDate);

              return (
                <div key={day.name} className="flex flex-col gap-3 min-w-[150px]">
                  
                  {/* Column header */}
                  <div className="text-center p-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl">
                    <span className="font-extrabold text-xs block text-zinc-800 dark:text-zinc-200">
                      {day.label}
                    </span>
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold mt-0.5 block">
                      {dayLabel}
                    </span>
                  </div>

                  {/* Column body grid */}
                  <div className="flex-1 flex flex-col gap-3">
                    {TIME_SLOTS.map((slot) => {
                      // Find if any session falls into this day and time slot
                      const slotSession = daySessions.find(
                        (s) => s.startTime === slot.start && s.endTime === slot.end
                      );

                      return (
                        <div key={slot.label} className={getSubElementClass("calendar-cell") + " flex flex-col justify-between"}>
                          
                          {/* Slot Time badge */}
                          <span className="text-[8.5px] font-bold text-zinc-400 block mb-2 border-b border-zinc-100 dark:border-zinc-900 pb-1">
                            {slot.label}
                          </span>

                          {slotSession ? (
                            <div
                              onClick={() => handleOpenEditModal(slotSession)}
                              className={`${getSubElementClass("calendar-card")} text-left cursor-pointer flex flex-col justify-between h-full border ${
                                slotSession.status === "completed"
                                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-450"
                                  : slotSession.status === "cancelled"
                                  ? "bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-200/50 text-zinc-450"
                                  : "bg-blue-500/5 border-blue-500/20 text-sakode-blue dark:text-sky-400"
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-center gap-1">
                                  <span className="font-extrabold text-[10.5px] truncate block max-w-[100px]">
                                    {slotSession.studentName}
                                  </span>
                                  {slotSession.isGroup && (
                                    <UI.Badge
                                      variant="accent"
                                      accentColor="purple"
                                      className="text-[6.5px]! font-black! px-1! py-0.5! shrink-0"
                                    >
                                      GP
                                    </UI.Badge>
                                  )}
                                </div>
                                <span className="text-[8.5px] font-bold text-zinc-500 dark:text-zinc-400 block truncate mt-0.5">
                                  👤 {slotSession.mentorName}
                                </span>
                              </div>
                              <span className="text-[8px] font-black text-amber-600 dark:text-amber-400 block mt-2 truncate">
                                📍 {slotSession.roomName.split(" - ")[0]}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[8.5px] text-zinc-300 dark:text-zinc-700 italic block my-auto text-center font-medium">
                              Kosong
                            </span>
                          )}

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* 4. ADD SCHEDULE MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg relative my-8"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleAddScheduleSubmit} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Icons.Plus className="w-4 h-4" />
                      Buat Jadwal Mentoring Baru
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                      title="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Error Notification Alert Inside Modal */}
                  {formError && (
                    <UI.Alert title="Gagal Menyimpan Jadwal" type="warning">
                      {formError}
                    </UI.Alert>
                  )}

                  {/* Student Selection dropdown */}
                  <div>
                    <UI.Label>Pilih Murid (Plotted Only)</UI.Label>
                    <UI.Select
                      value={formData.studentId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, studentId: e.target.value })}
                      accentColor={selectedColor}
                      className="text-xs!"
                    >
                      <option value="">-- Pilih Murid Aktif --</option>
                      {students
                        .filter((s) => s.assignedMentorId !== null)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.programName})
                          </option>
                        ))}
                    </UI.Select>
                  </div>

                  {/* Auto Prefilled Mentor & Branch Info */}
                  {selectedStudent && (
                    <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 flex flex-col gap-2 text-xs text-left">
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-semibold">Mentor Pendamping:</span>
                        <span className="font-extrabold text-zinc-800 dark:text-white">
                          👤 {selectedStudent.assignedMentorName} ({selectedStudent.assignedMentorId})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-semibold">Cabang Offline:</span>
                        <span className="font-extrabold text-zinc-800 dark:text-white">
                          📍 {selectedStudent.address.split(" - ")[0]}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Date and Time selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <UI.Label>Pilih Tanggal</UI.Label>
                      <UI.Select
                        value={formData.date}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, date: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      >
                        {Array.from({ length: 7 }, (_, i) => getWeekDayDateString(i)).map((dateStr, dIdx) => (
                          <option key={dateStr} value={dateStr}>
                            {DAYS[dIdx].label} ({getWeekDayLabel(dIdx)})
                          </option>
                        ))}
                      </UI.Select>
                    </div>

                    <div>
                      <UI.Label>Jam Mulai</UI.Label>
                      <UI.Select
                        value={formData.startTime}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, startTime: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      >
                        <option value="08:00">08:00 WIB</option>
                        <option value="10:00">10:00 WIB</option>
                        <option value="13:00">13:00 WIB</option>
                        <option value="15:00">15:00 WIB</option>
                        <option value="17:00">17:00 WIB</option>
                      </UI.Select>
                    </div>

                    <div>
                      <UI.Label>Jam Selesai</UI.Label>
                      <UI.Select
                        value={formData.endTime}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, endTime: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      >
                        <option value="10:00">10:00 WIB</option>
                        <option value="12:00">12:00 WIB</option>
                        <option value="15:00">15:00 WIB</option>
                        <option value="17:00">17:00 WIB</option>
                        <option value="19:00">19:00 WIB</option>
                      </UI.Select>
                    </div>
                  </div>

                  {/* Room & Module Outline input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <UI.Label>Materi / Bab Modul</UI.Label>
                      <UI.Input
                        type="text"
                        value={formData.moduleChapter}
                        onChange={(e) => setFormData({ ...formData, moduleChapter: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      />
                    </div>
                    <div>
                      <UI.Label>Nama Ruangan / Nomor Meja</UI.Label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: Lab Utama - Meja A"
                        value={formData.roomName}
                        onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <UI.Label>Catatan / Instruksi Sesi</UI.Label>
                    <textarea
                      placeholder="Masukkan catatan pendukung materi atau persiapan murid..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs focus:ring-2 focus:outline-hidden min-h-[70px]"
                    />
                  </div>

                  {/* Form Submission buttons */}
                  <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                    <UI.Button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-bold! cursor-pointer"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! px-5! font-bold! cursor-pointer"
                    >
                      Simpan Jadwal
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. EDIT/RESCHEDULE MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg relative my-8"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleEditScheduleSubmit} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Icons.Clock className="w-4 h-4" />
                      Ubah Rincian & Waktu Mentoring
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                      title="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Error Notification Alert Inside Modal */}
                  {formError && (
                    <UI.Alert title="Gagal Memperbarui Jadwal" type="warning">
                      {formError}
                    </UI.Alert>
                  )}

                  {/* Student Details (Read-only on edit) */}
                  {selectedStudent && (
                    <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 flex flex-col gap-2 text-xs text-left">
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-semibold">Nama Murid:</span>
                        <span className="font-extrabold text-zinc-850 dark:text-white">
                          {selectedStudent.name} ({selectedStudent.id})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-semibold">Mentor Pendamping:</span>
                        <span className="font-extrabold text-zinc-800 dark:text-white">
                          👤 {selectedStudent.assignedMentorName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-semibold">Cabang Belajar:</span>
                        <span className="font-extrabold text-zinc-800 dark:text-white">
                          📍 {selectedStudent.address.split(" - ")[0]}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Date and Time selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <UI.Label>Pilih Tanggal</UI.Label>
                      <UI.Select
                        value={formData.date}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, date: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      >
                        {Array.from({ length: 7 }, (_, i) => getWeekDayDateString(i)).map((dateStr, dIdx) => (
                          <option key={dateStr} value={dateStr}>
                            {DAYS[dIdx].label} ({getWeekDayLabel(dIdx)})
                          </option>
                        ))}
                      </UI.Select>
                    </div>

                    <div>
                      <UI.Label>Jam Mulai</UI.Label>
                      <UI.Select
                        value={formData.startTime}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, startTime: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      >
                        <option value="08:00">08:00 WIB</option>
                        <option value="10:00">10:00 WIB</option>
                        <option value="13:00">13:00 WIB</option>
                        <option value="15:00">15:00 WIB</option>
                        <option value="17:00">17:00 WIB</option>
                      </UI.Select>
                    </div>

                    <div>
                      <UI.Label>Jam Selesai</UI.Label>
                      <UI.Select
                        value={formData.endTime}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, endTime: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      >
                        <option value="10:00">10:00 WIB</option>
                        <option value="12:00">12:00 WIB</option>
                        <option value="15:00">15:00 WIB</option>
                        <option value="17:00">17:00 WIB</option>
                        <option value="19:00">19:00 WIB</option>
                      </UI.Select>
                    </div>
                  </div>

                  {/* Room & Module Outline input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <UI.Label>Materi / Bab Modul</UI.Label>
                      <UI.Input
                        type="text"
                        value={formData.moduleChapter}
                        onChange={(e) => setFormData({ ...formData, moduleChapter: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      />
                    </div>
                    <div>
                      <UI.Label>Nama Ruangan / Nomor Meja</UI.Label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: Lab Utama - Meja A"
                        value={formData.roomName}
                        onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <UI.Label>Catatan / Instruksi Sesi</UI.Label>
                    <textarea
                      placeholder="Masukkan catatan pendukung materi atau persiapan murid..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs focus:ring-2 focus:outline-hidden min-h-[70px]"
                    />
                  </div>

                  {/* Form Submission buttons */}
                  <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                    <UI.Button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-bold! cursor-pointer"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! px-5! font-bold! cursor-pointer"
                    >
                      Simpan Perubahan
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast feedback alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full font-sans"
          >
            <UI.Card accentColor={toastMessage.type === "success" ? "green" : "red"}>
              <div className="flex items-start gap-3 text-xs leading-normal">
                <div className="shrink-0 mt-0.5">
                  {toastMessage.type === "success" ? (
                    <Icons.Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Icons.AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-455" />
                  )}
                </div>
                <div className="flex-1 font-bold text-zinc-800 dark:text-zinc-200">
                  {toastMessage.text}
                </div>
                <button
                  onClick={() => setToastMessage(null)}
                  className="shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                  title="Tutup"
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
