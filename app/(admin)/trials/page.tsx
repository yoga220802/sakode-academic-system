"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";

interface TrialBooking {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  targetProgramId: string;
  targetProgramName: string;
  status: "pending" | "scheduled" | "completed" | "cancelled";
  bookingDate: string; // e.g. "2026-07-08"
  bookingTimeSlot: string; // e.g. "19:00 - 20:00"
  assignedMentorId: string | null;
  assignedMentorName: string | null;
  studentAddress: string;
  studentRegion: string; // e.g. "Depok"
  mapsLink?: string;
  locationDetails?: string; // Patokan rumah
  notes?: string;
  conflictWarning?: string; // Simulated warning description
}

interface Mentor {
  id: string;
  name: string;
  specialization: string;
  domicile: string; // e.g. "Depok"
  activeTrialsCount: number;
  hasConflictOnDate?: string; // date string that conflicts
}

const MOCK_MENTORS: Mentor[] = [
  { id: "MNT-001", name: "Akbar Ramadhan", specialization: "Frontend Dev (React/Next)", domicile: "Jakarta Selatan", activeTrialsCount: 2, hasConflictOnDate: "2026-07-08" },
  { id: "MNT-002", name: "Yoga Pratama", specialization: "Backend Dev (Go/Docker)", domicile: "Depok", activeTrialsCount: 1 },
  { id: "MNT-003", name: "Rina Widya", specialization: "Mobile Dev (Flutter/React Native)", domicile: "Tangerang Selatan", activeTrialsCount: 3 },
  { id: "MNT-004", name: "Budi Santoso", specialization: "UI/UX & Product Design", domicile: "Bekasi", activeTrialsCount: 0 }
];

export default function TrialManagementPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  // 1. Simulation States
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");
  
  // Interactive conflict simulator toggle
  const [simulateConflicts, setSimulateConflicts] = useState<boolean>(true);

  // Tab selections
  const [viewMode, setViewMode] = useState<"list" | "agenda">("list");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "scheduled" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Booking selections
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>("TRL-101");

  // Modals & form states
  const [isAssignMentorOpen, setIsAssignMentorOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form input states
  const [assignForm, setAssignForm] = useState({
    mentorId: "MNT-001"
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    date: "2026-07-08",
    timeSlot: "19:00 - 20:00"
  });

  // Mock Databases
  const [bookings, setBookings] = useState<TrialBooking[]>([]);

  // Sync simulation scenario states
  useEffect(() => {
    const baseBookings: TrialBooking[] = [
      {
        id: "TRL-101",
        studentName: "Aditya Pratama",
        studentEmail: "aditya.pratama@gmail.com",
        studentPhone: "+62 812-9988-7766",
        targetProgramId: "REF-PRG-001",
        targetProgramName: "React & Next.js Professional",
        status: "pending",
        bookingDate: "2026-07-08",
        bookingTimeSlot: "19:00 - 20:00",
        assignedMentorId: null,
        assignedMentorName: null,
        studentAddress: "Jl. Margonda Raya No. 45, Beji, Kota Depok",
        studentRegion: "Depok",
        locationDetails: "Masuk gang sebelah warung sate, pagar hitam",
        notes: "Sangat tertarik belajar styling modern & framework routing Next.js."
      },
      {
        id: "TRL-102",
        studentName: "Citra Lestari",
        studentEmail: "citra.lestari@outlook.com",
        studentPhone: "+62 856-1122-3344",
        targetProgramId: "REF-PRG-003",
        targetProgramName: "Backend Dev Go/Docker",
        status: "scheduled",
        bookingDate: "2026-07-09",
        bookingTimeSlot: "16:00 - 17:00",
        assignedMentorId: "MNT-002",
        assignedMentorName: "Yoga Pratama",
        studentAddress: "Perumahan Bumi Serpong Damai (BSD) Blok C2/15, Tangerang Selatan",
        studentRegion: "Tangerang Selatan",
        mapsLink: "https://maps.google.com/?q=-6.3024,106.6715",
        locationDetails: "Dekat Masjid Jami BSD, rumah tingkat cat krem",
        notes: "Ingin migrasi karir dari QA Engineer menjadi Software Developer."
      },
      {
        id: "TRL-103",
        studentName: "Budi Wijaya",
        studentEmail: "budi.wijaya@yahoo.com",
        studentPhone: "+62 899-7766-5544",
        targetProgramId: "REF-PRG-001",
        targetProgramName: "React & Next.js Professional",
        status: "completed",
        bookingDate: "2026-07-05",
        bookingTimeSlot: "20:00 - 21:00",
        assignedMentorId: "MNT-001",
        assignedMentorName: "Akbar Ramadhan",
        studentAddress: "Jl. Tebet Barat Dalam Raya No. 12, Jakarta Selatan",
        studentRegion: "Jakarta Selatan",
        mapsLink: "https://maps.google.com/?q=-6.2335,106.8488",
        locationDetails: "Depan taman Tebet Barat, seberang Indomaret",
        notes: "Uji coba berhasil, calon siswa sangat aktif bertanya."
      },
      {
        id: "TRL-104",
        studentName: "Dina Mariana",
        studentEmail: "dina.mariana@gmail.com",
        studentPhone: "+62 878-5544-3322",
        targetProgramId: "REF-PRG-002",
        targetProgramName: "TypeScript & Data Structures",
        status: "pending",
        bookingDate: "2026-07-10",
        bookingTimeSlot: "14:00 - 15:00",
        assignedMentorId: null,
        assignedMentorName: null,
        studentAddress: "Apartemen Kalibata City Tower Jasmine Lt. 10 No. 05, Jakarta Selatan",
        studentRegion: "Jakarta Selatan",
        locationDetails: "Lobby Jasmine, koordinasi dengan resepsionis",
        notes: "Ingin memantapkan logika pemrograman sebelum magang."
      },
      {
        id: "TRL-105",
        studentName: "Farhan Hakim",
        studentEmail: "farhan.hakim@outlook.com",
        studentPhone: "+62 811-2233-4455",
        targetProgramId: "REF-PRG-003",
        targetProgramName: "Backend Dev Go/Docker",
        status: "cancelled",
        bookingDate: "2026-07-04",
        bookingTimeSlot: "15:00 - 16:00",
        assignedMentorId: null,
        assignedMentorName: null,
        studentAddress: "Perumahan Taman Galaxy Blok A3 No. 18, Bekasi Selatan",
        studentRegion: "Bekasi",
        locationDetails: "Pintu gerbang pos satpam kedua, rumah pagar putih",
        notes: "Dibatalkan oleh calon siswa karena ada ujian mendadak."
      }
    ];

    const timer = setTimeout(() => {
      if (simulationState === "loading" || simulationState === "empty") {
        setBookings([]);
      } else {
        setBookings(baseBookings);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [simulationState]);

  // Handle toast timers
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Selection Derived State
  const selectedBooking = useMemo(() => {
    if (!selectedBookingId) return null;
    return bookings.find(b => b.id === selectedBookingId) || null;
  }, [bookings, selectedBookingId]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    if (simulationState === "empty" || simulationState === "loading") return [];
    return bookings.filter(b => {
      const matchesSearch = b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.targetProgramName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter, simulationState]);

  // Agenda list (chronologically sorted)
  const agendaBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      const dateDiff = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.bookingTimeSlot.localeCompare(b.bookingTimeSlot);
    });
  }, [filteredBookings]);

  // Metrics calculation
  const metrics = useMemo(() => {
    if (simulationState === "empty" || simulationState === "loading") {
      return { total: 0, pending: 0, scheduled: 0, completed: 0 };
    }
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
      scheduled: bookings.filter(b => b.status === "scheduled").length,
      completed: bookings.filter(b => b.status === "completed").length
    };
  }, [bookings, simulationState]);

  // Active conflict warnings for selected forms
  const activeConflict = useMemo(() => {
    if (!simulateConflicts) return null;
    
    // 1. Conflict checking inside Assign Mentor modal
    if (isAssignMentorOpen) {
      const targetMentor = MOCK_MENTORS.find(m => m.id === assignForm.mentorId);
      if (selectedBooking && targetMentor && targetMentor.hasConflictOnDate === selectedBooking.bookingDate) {
        return `Peringatan Bentrok: ${targetMentor.name} sudah memiliki jadwal Uji Coba lain pada tanggal ${selectedBooking.bookingDate} pukul ${selectedBooking.bookingTimeSlot}.`;
      }
    }

    // 2. Conflict checking inside Reschedule modal
    if (isRescheduleOpen && selectedBooking) {
      // Let's simulate a conflict if Admin chooses a Sunday or Saturday (out of mentor business hours)
      const dayOfWeek = new Date(rescheduleForm.date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return `Peringatan Jadwal: Tanggal terpilih adalah akhir pekan (Weekend). Mentor mungkin tidak tersedia di luar hari kerja.`;
      }
      
      // Let's also simulate a mentor scheduling clash on Akbar Ramadhan's date July 8th
      if (selectedBooking.assignedMentorId === "MNT-001" && rescheduleForm.date === "2026-07-08") {
        return `Peringatan Bentrok: Mentor Akbar Ramadhan memiliki jadwal kelas coding struktural utama pada tanggal tersebut.`;
      }
    }

    return null;
  }, [isAssignMentorOpen, isRescheduleOpen, assignForm.mentorId, rescheduleForm.date, selectedBooking, simulateConflicts]);

  // Active proximity feedback / conflict warning (NEW)
  const activeProximityInfo = useMemo(() => {
    if (!selectedBooking) return null;
    
    // Proximity info inside Assign Mentor modal
    if (isAssignMentorOpen) {
      const targetMentor = MOCK_MENTORS.find(m => m.id === assignForm.mentorId);
      if (targetMentor) {
        const isSameRegion = targetMentor.domicile.toLowerCase() === selectedBooking.studentRegion.toLowerCase();
        if (isSameRegion) {
          return {
            type: "success" as const,
            text: `Kecocokan Wilayah: Mentor ${targetMentor.name} berdomisili di wilayah yang sama (${targetMentor.domicile}) dengan lokasi rumah siswa.`
          };
        } else {
          return {
            type: "warning" as const,
            text: `Peringatan Jarak: Lokasi trial berada di ${selectedBooking.studentRegion}, sedangkan domisili ${targetMentor.name} adalah ${targetMentor.domicile} (membutuhkan waktu perjalanan ekstra).`
          };
        }
      }
    }
    return null;
  }, [isAssignMentorOpen, assignForm.mentorId, selectedBooking]);

  // Actions Handlers
  const handleAssignMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;

    const mentor = MOCK_MENTORS.find(m => m.id === assignForm.mentorId);
    if (!mentor) return;

    setBookings(prev => prev.map(b => b.id === selectedBookingId ? {
      ...b,
      assignedMentorId: mentor.id,
      assignedMentorName: mentor.name,
      status: "scheduled",
      mapsLink: `https://maps.google.com/?q=${encodeURIComponent(b.studentAddress)}`
    } : b));

    setIsAssignMentorOpen(false);
    setToastMessage({
      type: "success",
      text: `Mentor ${mentor.name} berhasil ditugaskan untuk sesi trial offline ke rumah ${selectedBooking?.studentName}. Rute navigasi Google Maps telah disiapkan.`
    });
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;

    setBookings(prev => prev.map(b => b.id === selectedBookingId ? {
      ...b,
      bookingDate: rescheduleForm.date,
      bookingTimeSlot: rescheduleForm.timeSlot
    } : b));

    setIsRescheduleOpen(false);
    setToastMessage({
      type: "success",
      text: `Jadwal sesi trial ${selectedBooking?.studentName} berhasil diubah ke ${rescheduleForm.date} (${rescheduleForm.timeSlot}).`
    });
  };

  const handleCancelTrial = () => {
    if (!selectedBookingId) return;

    setBookings(prev => prev.map(b => b.id === selectedBookingId ? {
      ...b,
      status: "cancelled",
      assignedMentorId: null,
      assignedMentorName: null,
      mapsLink: undefined
    } : b));

    setIsCancelConfirmOpen(false);
    setToastMessage({
      type: "success",
      text: `Sesi trial untuk ${selectedBooking?.studentName} telah berhasil dibatalkan.`
    });
  };

  const handleCompleteTrial = () => {
    if (!selectedBookingId) return;

    setBookings(prev => prev.map(b => b.id === selectedBookingId ? {
      ...b,
      status: "completed"
    } : b));

    setIsCompleteConfirmOpen(false);
    setToastMessage({
      type: "success",
      text: `Sesi trial untuk ${selectedBooking?.studentName} berhasil ditandai sebagai Selesai.`
    });
  };

  // Preset Style Helpers
  const getSubElementClass = (type: "divider" | "inner-card" | "agenda-card") => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "divider") return "h-[2px] bg-zinc-900 dark:bg-white w-full my-1";
        if (type === "inner-card") return "p-4 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none text-left";
        return "p-3 border-2 border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)]";
        
      case "claymorphism":
        if (type === "divider") return "h-px bg-slate-200/60 dark:bg-zinc-800/60 w-full my-1";
        if (type === "inner-card") return "p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/20 dark:border-zinc-700/20 rounded-2xl shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.05)] text-left";
        return "p-3 bg-white/60 dark:bg-zinc-900/40 border border-slate-100/10 rounded-xl shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02),_1px_1px_3px_rgba(0,0,0,0.03)]";

      case "glassmorphism":
      case "liquid-glass":
        if (type === "divider") return "h-px bg-white/10 dark:bg-white/5 w-full my-1";
        if (type === "inner-card") return "p-4 bg-white/10 dark:bg-zinc-900/40 border border-white/20 dark:border-white/10 backdrop-blur-xs rounded-xl text-left";
        return "p-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-xs";

      case "minimalism":
        if (type === "divider") return "h-px bg-zinc-200/40 dark:bg-zinc-800/40 w-full my-1";
        if (type === "inner-card") return "p-3.5 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/40 dark:border-zinc-855/40 rounded-none text-left";
        return "p-2.5 border border-zinc-150 dark:border-zinc-855 rounded-none";

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "divider") return "h-px bg-zinc-200/60 dark:bg-zinc-800/80 w-full my-1";
        if (type === "inner-card") return "p-4 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800 rounded-xl text-left";
        return "p-3.5 bg-zinc-50/40 dark:bg-zinc-900/20 border border-zinc-200/40 dark:border-zinc-805 rounded-xl";
    }
  };

  const getCloseButtonClass = () => {
    const base = "p-1.5 transition-all cursor-pointer ";
    switch (selectedStyle) {
      case "neobrutalism":
        return base + "border-2 border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 hover:bg-zinc-100 rounded-none shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:shadow-[1px_1px_0px_rgba(255,255,255,1)] text-zinc-900 dark:text-white";
      case "claymorphism":
        return base + "bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200/50 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)] text-zinc-505 dark:text-zinc-300";
      case "glassmorphism":
      case "liquid-glass":
        return base + "bg-white/10 dark:bg-zinc-900/30 border border-white/20 dark:border-white/10 rounded-full backdrop-blur-xs hover:bg-white/20 text-zinc-400 dark:text-zinc-200";
      case "minimalism":
        return base + "hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm text-zinc-400 dark:text-zinc-450";
      case "bento-grid":
      case "sakode-modern":
      default:
        return base + "bg-zinc-100 dark:bg-zinc-855 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-550 dark:text-zinc-300";
    }
  };

  const getTabFilterClasses = (type: "container" | "button", isActive?: boolean) => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "container") {
          return "flex flex-wrap gap-2.5 p-1 bg-zinc-55 dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-none";
        }
        return `text-center py-1.5 px-3.5 text-xs font-mono font-bold rounded-none transition-all cursor-pointer ${
          isActive
            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]"
            : "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        }`;

      case "claymorphism":
        if (type === "container") {
          return "flex flex-wrap gap-2 p-1 bg-slate-100/85 dark:bg-zinc-900/40 border border-slate-200/20 dark:border-zinc-800/20 rounded-xl shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.4)]";
        }
        return `text-center py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          isActive
            ? "bg-white dark:bg-zinc-850 text-zinc-905 dark:text-white shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.02),_2px_2px_5px_rgba(0,0,0,0.05),_inset_1px_1px_1px_rgba(255,255,255,0.8)] scale-[1.03]"
            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:scale-[1.01]"
        }`;

      case "glassmorphism":
      case "liquid-glass":
        if (type === "container") {
          return "flex flex-wrap gap-1.5 p-1 bg-white/10 dark:bg-zinc-950/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 rounded-xl";
        }
        return `text-center py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          isActive
            ? "bg-white/25 dark:bg-white/10 text-white border border-white/20 dark:border-white/15 backdrop-blur-xs shadow-xs"
            : "text-zinc-350 hover:text-white hover:bg-white/5"
        }`;

      case "minimalism":
        if (type === "container") {
          return "flex flex-wrap gap-4 p-0.5 border-b border-zinc-200 dark:border-zinc-800 rounded-none bg-transparent";
        }
        return `py-1 px-1.5 text-xs font-bold rounded-none transition-all cursor-pointer ${
          isActive
            ? "text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white font-black"
            : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-650 dark:hover:text-zinc-305"
        }`;

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "container") {
          return "flex flex-wrap gap-1.5 bg-zinc-100/70 dark:bg-zinc-900/80 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80";
        }
        return `text-center py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          isActive
            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-3xs"
            : "text-zinc-450 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-205"
        }`;
    }
  };



  const openAssignModal = () => {
    setAssignForm({ mentorId: "MNT-001" });
    setIsAssignMentorOpen(true);
  };

  const openRescheduleModal = () => {
    if (selectedBooking) {
      setRescheduleForm({
        date: selectedBooking.bookingDate,
        timeSlot: selectedBooking.bookingTimeSlot
      });
    }
    setIsRescheduleOpen(true);
  };

  return (
    <div className="flex flex-col gap-10 w-full text-left font-sans pb-16">
      
      {/* 1. Page Header & Scenario Selector */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-300 font-semibold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Jadwal</span>
            <span>/</span>
            <span>Trial</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            Manajemen Sesi Uji Coba (Trial)
          </h1>
        </div>

        {/* Action Controls Row */}
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Conflict Simulator Toggle */}
          <label className="flex items-center gap-2 bg-zinc-100/80 dark:bg-zinc-805 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 text-xs font-bold text-zinc-550 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={simulateConflicts}
              onChange={(e) => setSimulateConflicts(e.target.checked)}
              className="w-3.5 h-3.5 accent-purple-650 cursor-pointer"
            />
            <span>Deteksi Konflik Sesi</span>
          </label>

          {/* Scenario selector */}
          <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-805 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 z-20">
            <span className="text-[9px] text-zinc-550 dark:text-zinc-350 font-bold uppercase tracking-wider pl-2 pr-1.5">Simulasi:</span>
            {[
              { id: "default" as const, label: "Default" },
              { id: "loading" as const, label: "Loading" },
              { id: "empty" as const, label: "Empty" },
              { id: "error" as const, label: "Error" }
            ].map(state => (
              <button
                key={state.id}
                onClick={() => { setSimulationState(state.id); setSelectedBookingId(state.id === "empty" ? null : "TRL-101"); }}
                className={`px-2.5 py-1 text-[9.5px] font-bold rounded-lg transition-colors cursor-pointer ${simulationState === state.id ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs" : "text-zinc-505 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
              >
                {state.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pengajuan Trial", value: metrics.total, color: selectedColor },
          { label: "Menunggu Penugasan", value: metrics.pending, color: "orange" as const },
          { label: "Sesi Terjadwal", value: metrics.scheduled, color: "purple" as const },
          { label: "Uji Coba Selesai", value: metrics.completed, color: "green" as const }
        ].map((m, idx) => (
          <UI.Card key={idx} accentColor={m.color}>
            <div className="p-4 flex flex-col gap-1.5 justify-start text-left relative overflow-hidden">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-355 uppercase tracking-wider">
                {m.label}
              </span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none mt-1">
                {simulationState === "loading" ? "..." : m.value}
              </span>
            </div>
          </UI.Card>
        ))}
      </div>

      {/* 2.5 Filters and View Mode Toggles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        
        {/* Sub-Filters Tabs */}
        <div className={getTabFilterClasses("container")}>
          {[
            { id: "all" as const, label: "Semua Sesi" },
            { id: "pending" as const, label: "Antrean Pendaftaran" },
            { id: "scheduled" as const, label: "Aktif / Terjadwal" },
            { id: "completed" as const, label: "Telah Selesai" },
            { id: "cancelled" as const, label: "Dibatalkan" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setStatusFilter(tab.id); setSelectedBookingId(null); }}
              className={getTabFilterClasses("button", statusFilter === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Toggle Layout */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex items-center flex-1 md:flex-initial md:min-w-[200px]">
            <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
            <UI.Input
              type="text"
              placeholder="Cari nama / program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              accentColor={selectedColor}
              className="pl-10! text-xs! py-1.5! md:w-48!"
            />
          </div>

          <div className="flex items-center bg-zinc-150 dark:bg-zinc-805 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "list" ? "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white shadow-3xs" : "text-zinc-450 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
              title="Tampilan Daftar"
            >
              <Icons.Clipboard className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "agenda" ? "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white shadow-3xs" : "text-zinc-450 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
              title="Tampilan Agenda Kalender"
            >
              <Icons.Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* Left column: List of Bookings / Agenda View */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <UI.Card accentColor={selectedColor}>
            <div className="p-5 flex flex-col gap-4">
              
              <div className="flex justify-between items-center text-left">
                <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-355 uppercase tracking-wider">
                  {viewMode === "list" ? "Daftar Booking Uji Coba" : "Agenda Sesi Kelas Uji Coba"}
                </h3>
                <span className="text-[10px] text-zinc-500 font-bold bg-zinc-100 dark:bg-zinc-805 px-2 py-0.5 rounded-md">
                  {filteredBookings.length} Sesi Terfilter
                </span>
              </div>

              {simulationState === "loading" ? (
                <div className="flex flex-col gap-3 py-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col gap-2.5 p-4 border border-zinc-150 dark:border-zinc-800 rounded-2xl animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="h-4.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                        <div className="h-4.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                      </div>
                      <div className="h-3 w-40 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                    </div>
                  ))}
                </div>
              ) : simulationState === "error" ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
                    <Icons.AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                    Gagal Memuat Jadwal Trial
                  </h3>
                  <p className="text-xs text-zinc-505 dark:text-zinc-400 max-w-xs mb-4">
                    Koneksi database terputus. Silakan klik muat ulang untuk mencoba kembali.
                  </p>
                  <UI.Button variant="secondary" accentColor="red" onClick={() => setSimulationState("default")} className="text-xs! py-1.5! px-4! cursor-pointer">
                    Muat Ulang
                  </UI.Button>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-855 flex items-center justify-center text-zinc-400 mb-4">
                    <Icons.Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-855 dark:text-zinc-200 mb-1">
                    Antrean Trial Kosong
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-450 max-w-xs">
                    Tidak ditemukan pendaftaran sesi trial pending atau terjadwal untuk filter ini.
                  </p>
                </div>
              ) : viewMode === "list" ? (
                /* List View Layout */
                <div className="flex flex-col gap-3.5">
                  {filteredBookings.map((b) => {
                    const isSelected = selectedBookingId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBookingId(b.id)}
                        className={`p-4 border rounded-2xl cursor-pointer transition-all duration-200 flex flex-col gap-3 relative overflow-hidden group text-left ${
                          isSelected
                            ? "bg-zinc-50/80 dark:bg-zinc-800/40 border-sakode-blue dark:border-sakode-blue/80 shadow-3xs"
                            : "bg-transparent hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-zinc-200/60 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-105">
                              {b.studentName}
                            </h4>
                            <span className="text-[10px] text-zinc-450 font-mono mt-0.5 block">{b.id} — {b.studentEmail}</span>
                            <span className="inline-block text-[9px] font-bold text-purple-600 dark:text-purple-400 bg-purple-550/10 px-2 py-0.5 rounded-md mt-1">
                              Lokasi: {b.studentRegion}
                            </span>
                          </div>
                          
                          {b.status === "pending" ? (
                            <UI.Badge variant="warning" accentColor="orange" className="text-[8.5px]! px-2! py-0.5!">Pendaftaran Baru</UI.Badge>
                          ) : b.status === "scheduled" ? (
                            <UI.Badge variant="accent" accentColor="purple" className="text-[8.5px]! px-2! py-0.5!">Terjadwal</UI.Badge>
                          ) : b.status === "completed" ? (
                            <UI.Badge variant="success" accentColor="green" className="text-[8.5px]! px-2! py-0.5!">Selesai</UI.Badge>
                          ) : (
                            <UI.Badge variant="accent" accentColor="red" className="text-[8.5px]! px-2! py-0.5!">Batal</UI.Badge>
                          )}
                        </div>

                        <div className={getSubElementClass("divider")} />

                        <div className="flex flex-wrap justify-between items-center text-[10.5px] gap-2 text-zinc-550 dark:text-zinc-455 font-medium">
                          <span className="flex items-center gap-1">
                            <Icons.Calendar className="w-3.5 h-3.5 text-purple-500" />
                            {b.bookingDate} ({b.bookingTimeSlot})
                          </span>
                          <span className="text-zinc-700 dark:text-zinc-300">
                            Mentor: <strong className="font-semibold text-sakode-blue">{b.assignedMentorName || "Belum Ditugaskan"}</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Chronological Weekly Agenda View */
                <div className="flex flex-col gap-4 text-left">
                  {agendaBookings.map((b) => {
                    const isSelected = selectedBookingId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBookingId(b.id)}
                        className={`flex gap-4 p-3 border-b border-zinc-150 dark:border-zinc-850 cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors ${
                          isSelected ? "bg-zinc-50/80 dark:bg-zinc-800/40" : ""
                        }`}
                      >
                        {/* Time capsule block */}
                        <div className="flex flex-col items-center justify-center bg-zinc-100/50 dark:bg-zinc-805 p-2 rounded-xl min-w-[70px] text-center border border-zinc-200/20">
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                            {new Date(b.bookingDate).toLocaleDateString("id-ID", { month: "short" }).toUpperCase()}
                          </span>
                          <span className="text-lg font-black text-zinc-805 dark:text-white leading-none mt-0.5">
                            {new Date(b.bookingDate).getDate()}
                          </span>
                          <span className="text-[8px] font-bold text-zinc-400 uppercase mt-0.5">
                            {b.bookingTimeSlot.split(" ")[0]}
                          </span>
                        </div>

                        {/* Content details block */}
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-center gap-2">
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {b.studentName}
                            </h4>
                            {b.status === "pending" ? (
                              <UI.Badge variant="warning" accentColor="orange" className="text-[8px]! py-0 px-1.5!">Antrean</UI.Badge>
                            ) : b.status === "scheduled" ? (
                              <UI.Badge variant="accent" accentColor="purple" className="text-[8px]! py-0 px-1.5!">Scheduled</UI.Badge>
                            ) : b.status === "completed" ? (
                              <UI.Badge variant="success" accentColor="green" className="text-[8px]! py-0 px-1.5!">Selesai</UI.Badge>
                            ) : (
                              <UI.Badge variant="accent" accentColor="red" className="text-[8px]! py-0 px-1.5!">Batal</UI.Badge>
                            )}
                          </div>
                          
                          <span className="text-[10px] text-zinc-550 mt-1">
                            Program: <strong className="font-semibold text-zinc-700 dark:text-zinc-300">{b.targetProgramName}</strong>
                          </span>
                          <span className="text-[9.5px] text-zinc-455 mt-0.5 font-bold block">
                            Lokasi: <strong className="font-bold text-emerald-600 dark:text-emerald-450">{b.studentRegion}</strong> | Mentor: <strong className="text-purple-500 font-bold">{b.assignedMentorName || "Pending Assignment"}</strong>
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

        {/* Right column: Selected Trial Booking Detail View */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {!selectedBooking ? (
              <motion.div
                key="no-selection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <UI.Card accentColor={selectedColor}>
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-4 py-28 text-left">
                    <div className={`w-12 h-12 rounded-full ${getBgOpacity10Class(selectedColor)} flex items-center justify-center ${getTextClass(selectedColor)}`}>
                      <Icons.Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                        Detail Booking Uji Coba
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-1 leading-relaxed">
                        Pilih salah satu jadwal booking siswa di sebelah kiri untuk melihat profil, catatan kebutuhan, melakukan penugasan mentor, serta reschedule link Google Meet.
                      </p>
                    </div>
                  </div>
                </UI.Card>
              </motion.div>
            ) : (
              <motion.div
                key={selectedBooking.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full text-left"
              >
                <UI.Card accentColor={selectedBooking.status === "pending" ? "orange" : selectedBooking.status === "scheduled" ? "purple" : "green"}>
                  <div className="p-5 flex flex-col gap-5 relative">
                    
                    {/* Header: Title and controls */}
                    <div className="flex justify-between items-start border-b border-zinc-150 dark:border-zinc-855 pb-4">
                      <div>
                        <span className="text-[9px] font-mono bg-zinc-100 dark:bg-zinc-805 px-2 py-0.5 rounded border border-zinc-200 text-zinc-500 dark:text-zinc-400">
                          {selectedBooking.id}
                        </span>
                        <h2 className="text-base font-bold text-zinc-900 dark:text-white mt-1.5 leading-snug">
                          {selectedBooking.studentName}
                        </h2>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-355 block mt-1">
                          Program: {selectedBooking.targetProgramName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedBookingId(null)}
                          className={getCloseButtonClass()}
                          aria-label="Tutup Workspace"
                          title="Tutup Workspace"
                        >
                          <Icons.X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Contact & Bio Summary */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-450 uppercase tracking-wider">
                        Informasi Kontak & Catatan Siswa
                      </h4>
                      <div className={getSubElementClass("inner-card")}>
                        <div className="flex flex-col gap-2 text-xs leading-normal">
                          <div>
                            <span className="text-[9.5px] text-zinc-405 block">Email</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-150">{selectedBooking.studentEmail}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] text-zinc-405 block">No. Handphone / WhatsApp</span>
                            <span className="font-semibold text-zinc-805 dark:text-zinc-150">{selectedBooking.studentPhone}</span>
                          </div>
                          {selectedBooking.notes && (
                            <div className="border-t border-dashed border-zinc-200/50 dark:border-zinc-800/80 pt-2 mt-1">
                              <span className="text-[9.5px] text-zinc-405 block">Catatan Tambahan Calon Siswa</span>
                              <p className="font-medium text-zinc-700 dark:text-zinc-300 italic mt-0.5">
                                &ldquo;{selectedBooking.notes}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={getSubElementClass("divider")} />

                    {/* Sesi & Jadwal Details */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-450 uppercase tracking-wider">
                          Informasi Waktu Sesi & Meeting Link
                        </h4>
                        
                        {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                          <UI.Button
                            onClick={openRescheduleModal}
                            variant="secondary"
                            accentColor={selectedColor}
                            className="text-[9px]! py-1! px-2.5! font-bold! cursor-pointer flex items-center gap-1"
                          >
                            <Icons.Calendar className="w-3.5 h-3.5" />
                            Reschedule
                          </UI.Button>
                        )}
                      </div>

                      <div className={getSubElementClass("inner-card")}>
                        <div className="flex flex-col gap-2 text-xs leading-normal">
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <span className="text-[9.5px] text-zinc-405 block">Hari / Tanggal Sesi</span>
                              <span className="font-semibold text-zinc-800 dark:text-zinc-150">{selectedBooking.bookingDate}</span>
                            </div>
                            <div>
                              <span className="text-[9.5px] text-zinc-405 block">Slot Waktu (WIB)</span>
                              <span className="font-semibold text-zinc-800 dark:text-zinc-150">{selectedBooking.bookingTimeSlot}</span>
                            </div>
                          </div>

                          <div className="border-t border-dashed border-zinc-200/50 dark:border-zinc-805 pt-2.5 mt-1">
                            <span className="text-[9.5px] text-zinc-405 block">Metode Pembelajaran</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-450 flex items-center gap-1 mt-0.5">
                              <Icons.Home className="w-3.5 h-3.5 text-emerald-500" />
                              Mentoring Offline (Mentor Datang ke Rumah)
                            </span>
                          </div>

                          <div className="border-t border-dashed border-zinc-200/50 dark:border-zinc-805 pt-2 mt-1">
                            <span className="text-[9.5px] text-zinc-405 block">Alamat Rumah Lengkap</span>
                            <p className="font-semibold text-zinc-805 dark:text-zinc-150 mt-0.5 leading-relaxed">
                              {selectedBooking.studentAddress}
                            </p>
                          </div>

                          {selectedBooking.locationDetails && (
                            <div className="mt-1 bg-zinc-50 dark:bg-zinc-805 p-2 rounded border border-zinc-200/35 text-[10.5px]">
                              <span className="text-[9px] text-zinc-400 font-bold block">Patokan Lokasi:</span>
                              <span className="text-zinc-600 dark:text-zinc-300 font-medium">{selectedBooking.locationDetails}</span>
                            </div>
                          )}

                          <div className="border-t border-dashed border-zinc-200/50 dark:border-zinc-805 pt-2.5 mt-1 flex flex-col gap-1">
                            <span className="text-[9.5px] text-zinc-405 block">Navigasi Peta Rute</span>
                            <a
                              href={selectedBooking.mapsLink || `https://maps.google.com/?q=${encodeURIComponent(selectedBooking.studentAddress)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-sakode-blue dark:text-sky-400 hover:underline flex items-center gap-1.5 text-[11px] mt-0.5"
                            >
                              <Icons.Compass className="w-3.5 h-3.5 shrink-0" />
                              <span>Buka Lokasi di Google Maps</span>
                            </a>
                            {!selectedBooking.assignedMentorId && (
                              <span className="text-[9.5px] text-zinc-400 font-medium italic mt-1 block">
                                * Catatan: Mentor belum ditugaskan untuk rute ini.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={getSubElementClass("divider")} />

                    {/* Mentor Assignment Section */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-450 uppercase tracking-wider">
                          Mentor Pendamping Uji Coba
                        </h4>
                        
                        {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                          <UI.Button
                            onClick={openAssignModal}
                            variant="secondary"
                            accentColor={selectedColor}
                            className="text-[9px]! py-1! px-2.5! font-bold! cursor-pointer flex items-center gap-1"
                          >
                            <Icons.UserCheck className="w-3.5 h-3.5" />
                            {selectedBooking.assignedMentorId ? "Ubah Mentor" : "Tugaskan Mentor"}
                          </UI.Button>
                        )}
                      </div>

                      {selectedBooking.assignedMentorId ? (
                        <div className={getSubElementClass("inner-card")}>
                          <div className="flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-zinc-800 dark:text-zinc-150 block">
                                {selectedBooking.assignedMentorName}
                              </span>
                              <span className="text-[10px] text-zinc-450 block mt-0.5">
                                ID: {selectedBooking.assignedMentorId}
                              </span>
                            </div>
                            <UI.Badge variant="accent" accentColor="purple" className="text-[8.5px]! px-2!">Active Tutor</UI.Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 px-4 bg-zinc-50 dark:bg-zinc-900/10 border border-dashed border-zinc-200/60 dark:border-zinc-800 rounded-xl text-xs text-zinc-400">
                          Mentor belum dipilih untuk mendampingi calon siswa ini.
                        </div>
                      )}
                    </div>

                    {/* Bottom Status Mutation Buttons */}
                    {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                      <div className="flex flex-col gap-2.5 mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-5">
                        <div className="flex gap-2 justify-end">
                          <UI.Button
                            variant="secondary"
                            accentColor="red"
                            onClick={() => setIsCancelConfirmOpen(true)}
                            className="text-xs! py-2! px-4! font-bold! cursor-pointer"
                          >
                            Batalkan Sesi
                          </UI.Button>
                          
                          {selectedBooking.assignedMentorId && (
                            <UI.Button
                              variant="primary"
                              accentColor="green"
                              onClick={() => setIsCompleteConfirmOpen(true)}
                              className="text-xs! py-2! px-4! font-bold! cursor-pointer"
                            >
                              Tandai Selesai
                            </UI.Button>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </UI.Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 4. MODALS & FORMS MOCKS */}

      {/* 4.1 Assign Mentor Modal */}
      <AnimatePresence>
        {isAssignMentorOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleAssignMentor} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-200">
                      Tugaskan Mentor Pendamping
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAssignMentorOpen(false)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 text-xs leading-normal">
                    <p className="text-zinc-500 font-medium">
                      Pilih mentor aktif SAKODE yang akan mendampingi kelas uji coba **{selectedBooking?.studentName}** pada tanggal **{selectedBooking?.bookingDate}**:
                    </p>

                    <div className="flex flex-col gap-1 mt-1">
                      <label className="font-bold text-zinc-705 dark:text-zinc-300">Pilih Mentor Tersedia</label>
                      <div className="relative">
                        <UI.Select
                          value={assignForm.mentorId}
                          onChange={(e) => setAssignForm({ mentorId: e.target.value })}
                          accentColor={selectedColor}
                          className="text-xs! py-2.5! pr-8! pl-3!"
                        >
                          {MOCK_MENTORS.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} - Domisili {m.domicile} ({m.specialization})
                            </option>
                          ))}
                        </UI.Select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                          <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Conflict State Banner Alert (NEW) */}
                    {activeConflict && (
                      <div className="mt-2 text-[10px] text-rose-600 font-bold bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 leading-normal flex items-start gap-2">
                        <Icons.AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{activeConflict}</span>
                      </div>
                    )}

                    {/* Proximity Matching Information (NEW) */}
                    {activeProximityInfo && (
                      <div className={`mt-2 text-[10px] font-bold p-3 rounded-lg border leading-normal flex items-start gap-2 ${
                        activeProximityInfo.type === "success"
                          ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                          : "text-amber-605 bg-amber-500/10 border-amber-500/20"
                      }`}>
                        {activeProximityInfo.type === "success" ? (
                          <Icons.Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Icons.AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <span>{activeProximityInfo.text}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => setIsAssignMentorOpen(false)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor={selectedColor}
                      disabled={!!activeConflict}
                      className="text-xs! py-2! font-semibold! cursor-pointer disabled:opacity-50"
                    >
                      Konfirmasi Mentor
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.2 Reschedule Modal */}
      <AnimatePresence>
        {isRescheduleOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleReschedule} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-205">
                      Reschedule Sesi Uji Coba
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsRescheduleOpen(false)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 text-xs leading-normal">
                    <p className="text-zinc-500 font-medium">
                      Atur tanggal dan slot jam baru untuk pendampingan trial **{selectedBooking?.studentName}**:
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Pilih Tanggal Sesi</label>
                        <UI.Input
                          type="date"
                          value={rescheduleForm.date}
                          onChange={(e) => setRescheduleForm(prev => ({ ...prev, date: e.target.value }))}
                          accentColor={selectedColor}
                          required
                          className="text-xs! py-2!"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-zinc-705 dark:text-zinc-300">Slot Jam WIB</label>
                        <div className="relative">
                          <UI.Select
                            value={rescheduleForm.timeSlot}
                            onChange={(e) => setRescheduleForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                            accentColor={selectedColor}
                            className="text-xs! py-2! pr-8! pl-3!"
                          >
                            <option value="10:00 - 11:00">10:00 - 11:00 WIB</option>
                            <option value="14:00 - 15:00">14:00 - 15:00 WIB</option>
                            <option value="16:00 - 17:00">16:00 - 17:00 WIB</option>
                            <option value="19:00 - 20:00">19:00 - 20:00 WIB</option>
                            <option value="20:00 - 21:00">20:00 - 21:00 WIB</option>
                          </UI.Select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-450">
                            <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conflict State Banner Alert (NEW) */}
                    {activeConflict && (
                      <div className="mt-2 text-[10px] text-amber-600 font-bold bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 leading-normal flex items-start gap-2">
                        <Icons.AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{activeConflict}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => setIsRescheduleOpen(false)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Simpan Jadwal Baru
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.3 Cancel Confirmation Modal */}
      <AnimatePresence>
        {isCancelConfirmOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative"
            >
              <UI.Card accentColor="red">
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600">
                      Batalkan Sesi Trial
                    </h3>
                    <button
                      onClick={() => setIsCancelConfirmOpen(false)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 py-1 text-xs">
                    <p className="font-semibold text-zinc-850 dark:text-zinc-150">
                      Apakah Anda yakin ingin membatalkan sesi kelas uji coba gratis ini?
                    </p>
                    <div className={getSubElementClass("inner-card")}>
                      <span className="font-bold text-zinc-900 dark:text-white block">{selectedBooking?.studentName}</span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">{selectedBooking?.targetProgramName}</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => setIsCancelConfirmOpen(false)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      variant="primary"
                      accentColor="red"
                      onClick={handleCancelTrial}
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Batalkan Sesi
                    </UI.Button>
                  </div>
                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.4 Complete Confirmation Modal */}
      <AnimatePresence>
        {isCompleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative"
            >
              <UI.Card accentColor="green">
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Sesi Trial Selesai
                    </h3>
                    <button
                      onClick={() => setIsCompleteConfirmOpen(false)}
                      className={getCloseButtonClass()}
                      title="Tutup"
                      aria-label="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 py-1 text-xs">
                    <p className="font-semibold text-zinc-850 dark:text-zinc-150">
                      Konfirmasi bahwa sesi kelas uji coba gratis ini telah selesai diselenggarakan dengan baik:
                    </p>
                    <div className={getSubElementClass("inner-card")}>
                      <span className="font-bold text-zinc-900 dark:text-white block">{selectedBooking?.studentName}</span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">Mentor: {selectedBooking?.assignedMentorName}</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => setIsCompleteConfirmOpen(false)}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      variant="primary"
                      accentColor="green"
                      onClick={handleCompleteTrial}
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      Tandai Selesai
                    </UI.Button>
                  </div>
                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Toast Feedback Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full font-sans animate-none"
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
                <div className="flex-1 font-semibold text-zinc-850 dark:text-zinc-200">
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
