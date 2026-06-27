"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { useAuth } from "@/app/_components/AuthContext";
import * as UIStyles from "@/UI";
import { UserRole } from "@/app/_types/auth";

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedStyle, selectedColor } = useUIStyle();
  const { logout } = useAuth();

  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const MENU_ITEMS = [
    { label: "Ringkasan", href: "/dashboard", roles: ["admin", "mentor", "mentor_lead", "murid"], icon: "Home" },
    // Admin specific
    { label: "Manajemen User", href: "/dashboard/users", roles: ["admin"], icon: "Users" },
    { label: "Sistem Log", href: "/dashboard/logs", roles: ["admin"], icon: "Terminal" },
    // Mentor Lead specific
    { label: "Plotting Mentor", href: "/dashboard/plotting", roles: ["admin", "mentor_lead"], icon: "Compass" },
    // Mentor specific
    { label: "Jadwal Kelas", href: "/dashboard/schedules", roles: ["mentor", "mentor_lead"], icon: "Calendar" },
    { label: "Penilaian Bimbingan", href: "/dashboard/grading", roles: ["mentor", "mentor_lead"], icon: "Award" },
    // Student specific
    { label: "Kelas Aktif", href: "/dashboard/my-classes", roles: ["murid"], icon: "BookOpen" },
    { label: "Portofolio & Sertifikat", href: "/dashboard/portfolio", roles: ["murid"], icon: "Briefcase" },
  ];

  const allowedMenu = MENU_ITEMS.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Determine container styling based on style
  const getSidebarContainerClass = () => {
    switch (selectedStyle) {
      case "claymorphism":
        return "bg-slate-50 dark:bg-zinc-900 border-r border-slate-200/20 dark:border-zinc-800/20 shadow-[5px_0_15px_rgba(0,0,0,0.03)] p-5 rounded-r-3xl";
      case "neobrutalism":
        return "bg-white dark:bg-zinc-900 border-r-3 border-zinc-900 dark:border-white p-5 font-mono";
      case "glassmorphism":
      case "liquid-glass":
        return "bg-white/10 dark:bg-zinc-950/20 border-r border-white/10 backdrop-blur-md p-5";
      case "bento-grid":
        return "bg-white dark:bg-zinc-900 border-r border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-3xs";
      case "minimalism":
        return "bg-zinc-50/50 dark:bg-zinc-900/30 border-r border-zinc-250/20 p-5";
      case "sakode-modern":
      default:
        return "bg-zinc-50 dark:bg-zinc-900/60 border-r border-zinc-200/50 dark:border-zinc-850/50 p-5 shadow-3xs";
    }
  };

  return (
    <aside className={`w-64 h-full flex flex-col justify-between ${getSidebarContainerClass()}`}>
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-sakode-blue flex items-center justify-center font-black text-white text-base">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-zinc-800 dark:text-zinc-100 tracking-tight leading-none">
              SAKODE SYSTEM
            </span>
            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
              {role === "admin" ? "Admin Mode" : role === "mentor_lead" ? "Mentor Lead" : role === "mentor" ? "Mentor Mode" : "Student Mode"}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {allowedMenu.map((item) => {
            const isActive = pathname === item.href;
            
            // Dynamic item styling
            let itemClass = "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ";
            if (isActive) {
              if (selectedStyle === "neobrutalism") {
                itemClass += "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
              } else if (selectedStyle === "claymorphism") {
                itemClass += "bg-white dark:bg-zinc-800 text-sakode-blue shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-zinc-700/50";
              } else if (selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass") {
                itemClass += "bg-white/20 dark:bg-white/10 text-zinc-900 dark:text-white border border-white/20 dark:border-white/15 backdrop-blur-xs";
              } else {
                itemClass += "bg-zinc-200/50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white";
              }
            } else {
              itemClass += "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40";
              if (selectedStyle === "neobrutalism") {
                itemClass += " border-2 border-transparent rounded-none";
              }
            }

            return (
              <Link key={item.href} href={item.href} className={itemClass}>
                {item.icon === "Home" && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                )}
                {item.icon === "Users" && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m0 0-.003-.031c0-.225.012-.447.037-.666A11.944 11.944 0 0 1 12 15c2.17 0 4.207.576 5.963 1.584A6.062 6.062 0 0 1 18 18.72Zm-1.8-9.75a3.48 3.48 0 1 1-6.96 0 3.48 3.48 0 0 1 6.96 0Zm.75-2.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                )}
                {item.icon === "Terminal" && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                  </svg>
                )}
                {item.icon === "Compass" && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                )}
                {item.icon === "Calendar" && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                )}
                {item.icon === "Award" && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-6.75c-.622 0-1.125.504-1.125 1.125v3.375m9 0h-9M9 3h6M12 6v6.75m-3-3.75h6" />
                  </svg>
                )}
                {item.icon === "BookOpen" && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-16.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-16.25v14.25" />
                  </svg>
                )}
                {item.icon === "Briefcase" && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <UI.Button
        variant="secondary"
        accentColor={selectedColor}
        className="w-full text-xs! font-extrabold! py-2! cursor-pointer mt-auto"
        onClick={handleLogout}
      >
        Keluar Akun
      </UI.Button>
    </aside>
  );
}
