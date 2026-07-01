"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/_components/AuthContext";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { StudentWidget } from "../_components/StudentWidget";
import { MentorWidget } from "../_components/MentorWidget";
import { MentorLeadWidget } from "../_components/MentorLeadWidget";
import { AdminWidget } from "../_components/AdminWidget";
import { SchoolPrincipalWidget } from "../_components/SchoolPrincipalWidget";
import * as UIStyles from "@/UI";

export default function DashboardPage() {
  const { session } = useAuth();
  const { selectedStyle, selectedColor } = useUIStyle();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) {
        setMounted(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const getRoleBadgeClass = () => {
    const baseClass = "text-[10px] font-black uppercase tracking-widest px-3 py-1 transition-all select-none";
    switch (selectedStyle) {
      case "claymorphism":
        return `${baseClass} rounded-full bg-slate-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-slate-200/50 dark:border-zinc-700/50 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)]`;
      case "neobrutalism":
        return `${baseClass} bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none text-zinc-900 dark:text-white font-mono`;
      case "glassmorphism":
      case "liquid-glass":
        return `${baseClass} bg-white/20 dark:bg-zinc-950/40 border border-white/25 dark:border-white/10 backdrop-blur-md shadow-xs text-zinc-800 dark:text-white rounded-full`;
      case "bento-grid":
        return `${baseClass} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-3xs text-zinc-700 dark:text-zinc-300 rounded-full`;
      case "minimalism":
        return `${baseClass} bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/20 dark:border-zinc-800/20 text-zinc-600 dark:text-zinc-400 rounded-md text-[9px] px-2.5 py-0.5`;
      case "sakode-modern":
      default:
        return `${baseClass} bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-800 dark:text-zinc-200 shadow-3xs rounded-full`;
    }
  };

  if (!mounted || !session) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Welcome Banner */}
      <UI.Card accentColor={selectedColor}>
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white leading-none">
              Dasbor {session.role === "admin" ? "Sistem Akademik" : session.role === "mentor_lead" ? "Mentor Lead" : session.role === "mentor" ? "Pembimbing" : session.role === "school_principal" ? "Kepala Sekolah" : "Siswa"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-2">
              Masuk sebagai: <span className="font-black text-zinc-800 dark:text-zinc-200">{session.name} ({session.email})</span>
            </p>
          </div>
          <span className={getRoleBadgeClass()}>
            Role: {session.role === "school_principal" ? "Kepala Sekolah" : session.role.replace("_", " ")}
          </span>
        </div>
      </UI.Card>

      {/* Adaptive Dashboard Widgets based on Active Session Role */}
      <AnimatePresence mode="wait">
        <motion.div
          key={session.role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          {session.role === "admin" && <AdminWidget />}
          {session.role === "mentor_lead" && <MentorLeadWidget />}
          {session.role === "mentor" && <MentorWidget />}
          {session.role === "school_principal" && <SchoolPrincipalWidget />}
          {session.role === "murid" && <StudentWidget />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
