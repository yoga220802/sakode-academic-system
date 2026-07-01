"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/_components/AuthContext";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { StudentWidget } from "./_components/StudentWidget";
import { MentorWidget } from "./_components/MentorWidget";
import { MentorLeadWidget } from "./_components/MentorLeadWidget";
import { AdminWidget } from "./_components/AdminWidget";
import { SchoolPrincipalWidget } from "./_components/SchoolPrincipalWidget";
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
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm border border-zinc-800/20 dark:border-zinc-200/20">
            Role: {session.role.replace("_", " ")}
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
