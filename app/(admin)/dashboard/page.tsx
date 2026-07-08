"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/_components/AuthContext";
import { StudentWidget } from "../_components/StudentWidget";
import { MentorWidget } from "../_components/MentorWidget";
import { MentorLeadWidget } from "../_components/MentorLeadWidget";
import { AdminWidget } from "../_components/AdminWidget";
import { SchoolPrincipalWidget } from "../_components/SchoolPrincipalWidget";

export default function DashboardPage() {
  const { session } = useAuth();
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

  if (!mounted || !session) return null;

  return (
    <div className="w-full flex flex-col gap-6">
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
