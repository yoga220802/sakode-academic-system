"use client";

import React from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { UserSession } from "@/app/_types/auth";

interface HeaderProps {
  session: UserSession;
  onMenuClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Header({ session, onMenuClick, isCollapsed, onToggleCollapse }: HeaderProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { selectedStyle } = useUIStyle();

  const getPageTitle = (path: string) => {
    if (!path || path === "/dashboard") return "Ringkasan Dasbor";
    const segments = path.split("/");
    const lastSegment = segments[segments.length - 1];

    const routeTitles: Record<string, string> = {
      "registration-review": "Review Pendaftaran",
      "programs": "Program & Paket Belajar",
      "trials": "Manajemen Sesi Trial",
      "users": "Direktori Pengguna",
      "mentors": "Direktori Mentor SAKODE",
      "plotting": "Plotting & Alokasi Mentor",
      "schedules-admin": "Jadwal Mentoring Global",
      "referrals": "Program Referral",
      "extracurriculars-admin": "Manajemen Organisasi Ekskul",
      "principal-membership": "Keanggotaan Kepala Sekolah",
      "logs": "Audit Sistem Log",
      "plotting-queue": "Antrean Plotting Mentor",
      "schedules-lead": "Kelola Jadwal Mentoring",
      "grading": "Penilaian Bimbingan",
      "my-students": "Siswa Bimbingan Saya",
      "schedules": "Jadwal Kelas & Mengajar",
      "my-classes": "Kelas Aktif Saya",
      "modules": "Modul Belajar IT",
      "my-mentor-schedule": "Mentor & Jadwal Mentoring Sesi",
      "trial-registration": "Pendaftaran Sesi Trial Gratis",
      "extracurricular-registration": "Pendaftaran Cabang Ekskul",
      "enrollment-status": "Status Registrasi & Paket",
      "portfolio": "Portofolio & Sertifikat",
      "principal-org": "Organisasi Terkait Sekolah",
      "principal-reports": "Laporan & Roster Ekskul"
    };

    return routeTitles[lastSegment] || "Sistem Akademik";
  };

  // Determine container styling based on style
  const getHeaderContainerClass = () => {
    switch (selectedStyle) {
      case "claymorphism":
        return "bg-slate-50 dark:bg-zinc-900 border-b border-slate-200/20 dark:border-zinc-800/20 shadow-[0_5px_15px_rgba(0,0,0,0.02)] px-4 md:px-6 py-4 rounded-b-3xl mb-6";
      case "neobrutalism":
        return "bg-white dark:bg-zinc-900 border-b-3 border-zinc-900 dark:border-white px-4 md:px-6 py-4 font-mono mb-6";
      case "glassmorphism":
      case "liquid-glass":
        return "bg-white/10 dark:bg-zinc-950/20 border-b border-white/10 backdrop-blur-md px-4 md:px-6 py-4 mb-6";
      case "bento-grid":
        return "bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 md:px-6 py-4 shadow-3xs mb-6";
      case "minimalism":
        return "bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-250/20 px-4 md:px-6 py-4 mb-6";
      case "sakode-modern":
      default:
        return "bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200/50 dark:border-zinc-850/50 px-4 md:px-6 py-4 shadow-3xs mb-6";
    }
  };

  const getRoleLabel = (role: string) => {
    if (role === "school_principal") return "Kepala Sekolah";
    return role.replace("_", " ");
  };

  return (
    <header className={`flex items-center justify-between z-25 relative ${getHeaderContainerClass()}`}>
      {/* Left: Mobile Toggle, Desktop Collapse Toggle & Dynamic Title */}
      <div className="flex items-center">
        {/* Mobile Hamburger Menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 mr-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-3xs cursor-pointer transition-all active:scale-95 shrink-0"
          aria-label="Buka Menu Navigasi"
          title="Buka Menu Navigasi"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Collapse Sidebar button next to page title */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-2 mr-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-3xs cursor-pointer transition-all active:scale-95 shrink-0"
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="text-left">
          <h1 className="text-sm md:text-base font-black text-zinc-850 dark:text-zinc-100 leading-none">
            {getPageTitle(pathname)}
          </h1>
          <p className="hidden md:block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-1.5">
            Halo, {session.name.split(" ")[0]}! Selamat datang kembali.
          </p>
        </div>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-3xs cursor-pointer transition-all active:scale-95"
          aria-label="Toggle Light/Dark Theme"
          title="Ubah Tema"
        >
          {resolvedTheme === "dark" ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/40 dark:border-zinc-850/50 select-none">
          <div className="w-5.5 h-5.5 rounded-full bg-sakode-blue flex items-center justify-center text-[9px] font-black text-white uppercase shadow-3xs shrink-0">
            {session.name.substring(0, 2)}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-extrabold text-zinc-700 dark:text-zinc-200 leading-none">
              {session.name}
            </span>
            <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5 leading-none">
              {getRoleLabel(session.role)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
