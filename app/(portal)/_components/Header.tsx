"use client";

import React from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { useAuth } from "@/app/_components/AuthContext";
import { UserSession } from "@/app/_types/auth";

interface HeaderProps {
  session: UserSession;
  onMenuClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Header({ session, onMenuClick, isCollapsed, onToggleCollapse }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { login } = useAuth();
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
        return "bg-slate-50 dark:bg-zinc-900 border-b border-slate-200/20 dark:border-zinc-800/20 shadow-[0_5px_15px_rgba(0,0,0,0.02)] px-4 md:px-6 py-4 mb-6";
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

  const getIconButtonClass = () => {
    const baseClass = "p-2 cursor-pointer transition-all active:scale-95 shrink-0 flex items-center justify-center";
    switch (selectedStyle) {
      case "claymorphism":
        return `${baseClass} bg-slate-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-slate-200/50 dark:border-zinc-700/50 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)] rounded-xl`;
      case "neobrutalism":
        return `${baseClass} bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none text-zinc-900 dark:text-white`;
      case "glassmorphism":
      case "liquid-glass":
        return `${baseClass} bg-white/10 dark:bg-zinc-900/20 border border-white/20 dark:border-white/10 backdrop-blur-xs text-zinc-800 dark:text-zinc-250 rounded-xl`;
      case "bento-grid":
        return `${baseClass} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-3xs text-zinc-700 dark:text-zinc-300 rounded-xl`;
      case "minimalism":
        return `${baseClass} bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40 text-zinc-650 dark:text-zinc-350 rounded-lg`;
      case "sakode-modern":
      default:
        return `${baseClass} bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-850 dark:text-zinc-200 shadow-3xs rounded-xl`;
    }
  };

  const getProfileCardClass = () => {
    const baseClass = "flex items-center gap-2 px-2.5 py-1.5 select-none";
    switch (selectedStyle) {
      case "claymorphism":
        return `${baseClass} bg-slate-50 dark:bg-zinc-800 border border-slate-200/50 dark:border-zinc-700/50 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)] rounded-2xl`;
      case "neobrutalism":
        return `${baseClass} bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none font-mono`;
      case "glassmorphism":
      case "liquid-glass":
        return `${baseClass} bg-white/10 dark:bg-zinc-900/20 border border-white/20 dark:border-white/10 backdrop-blur-xs rounded-xl`;
      case "bento-grid":
        return `${baseClass} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-3xs rounded-xl`;
      case "minimalism":
        return `${baseClass} bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/20 dark:border-zinc-800/20 rounded-lg`;
      case "sakode-modern":
      default:
        return `${baseClass} bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/40 dark:border-zinc-850/50 rounded-xl`;
    }
  };

  return (
    <header className={`flex items-center justify-between z-25 relative ${getHeaderContainerClass()}`}>
      {/* Left: Mobile Toggle, Desktop Collapse Toggle & Dynamic Title */}
      <div className="flex items-center">
        {/* Mobile Hamburger Menu button */}
        <button
          onClick={onMenuClick}
          className={`md:hidden mr-3 ${getIconButtonClass()}`}
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
          className={`hidden md:flex mr-3 ${getIconButtonClass()}`}
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
        {/* Referrer Switcher / CTA */}
        {session.role !== "admin" && (
          <div className="flex items-center gap-2">
            {session.role !== "referrer" ? (
              <React.Fragment>
                <button
                  onClick={() => router.push("/referral")}
                  className="text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl bg-sakode-blue/10 text-sakode-blue border border-sakode-blue/20 hover:bg-sakode-blue/20 cursor-pointer shadow-3xs transition-all active:scale-95"
                  title="Daftar Program Referral"
                >
                  Daftar Referrer
                </button>
                <button
                  onClick={() => login("referrer")}
                  className="text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-750 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50 cursor-pointer shadow-3xs transition-all active:scale-95"
                  title="Pindah ke Portal Referrer"
                >
                  Portal Referrer
                </button>
              </React.Fragment>
            ) : (
              <button
                onClick={() => login("murid")}
                className="text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl bg-sakode-orange/10 text-sakode-orange border border-sakode-orange/20 hover:bg-sakode-orange/20 cursor-pointer shadow-3xs transition-all active:scale-95"
                title="Kembali ke Portal Utama"
              >
                Portal Utama
              </button>
            )}
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className={getIconButtonClass()}
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
        <div className={getProfileCardClass()}>
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
