"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { AuditLog } from "./_types/log";
import {
  getStoredLogs,
  saveStoredLogs,
  simulateNewLog,
  DEFAULT_LOGS
} from "@/app/_data/logs-mock";
import { motion, AnimatePresence } from "framer-motion";

export default function LogsPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // 1. Data States
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // 2. Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty">("default");

  // Load dataset on mount
  useEffect(() => {
    setLogs(getStoredLogs());
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetData = () => {
    setLogs(DEFAULT_LOGS);
    saveStoredLogs(DEFAULT_LOGS);
    showToast("Data log sistem berhasil di-reset.");
  };

  // Inject simulated new log
  const handleSimulateLog = () => {
    const freshLog = simulateNewLog(logs);
    const updated = [freshLog, ...logs];
    setLogs(updated);
    saveStoredLogs(updated);
    showToast(`Log baru berhasil ditambahkan: ${freshLog.action.substring(0, 35)}...`);
  };

  // Filters computation
  const filteredLogs = useMemo(() => {
    if (simulationState === "empty") return [];
    return logs.filter((l) => {
      const matchesSearch =
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === "all" || l.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [logs, searchQuery, categoryFilter, statusFilter, simulationState]);

  // Log level styling translation
  const getStatusBadgeProps = (status: string): { variant: "success" | "warning" | "default" | "accent"; accentColor?: any } => {
    switch (status) {
      case "success":
        return { variant: "success", accentColor: "green" };
      case "warning":
        return { variant: "warning", accentColor: "orange" };
      case "error":
      default:
        return { variant: "default", accentColor: "red" };
    }
  };

  const getCategoryBadgeProps = (cat: string): { variant: "accent" | "default"; accentColor?: any } => {
    switch (cat) {
      case "auth":
        return { variant: "accent", accentColor: "blue" };
      case "registration":
        return { variant: "accent", accentColor: "purple" };
      case "mentor":
        return { variant: "accent", accentColor: "blue" };
      case "extracurricular":
        return { variant: "accent", accentColor: "cyan" };
      case "system":
      default:
        return { variant: "default" };
    }
  };

  // UI styling helper
  const getSubElementClass = (type: "tab-button" | "table-header") => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "tab-button") return "border-2 border-zinc-900 dark:border-white rounded-none py-1.5 px-4 font-black";
        if (type === "table-header") return "border-b-2 border-zinc-900 dark:border-zinc-700 bg-zinc-100 font-black text-zinc-900 uppercase p-3 text-xs";
        return "";
      case "claymorphism":
        if (type === "tab-button") return "rounded-xl py-1.5 px-4 font-bold shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]";
        if (type === "table-header") return "bg-slate-100 dark:bg-zinc-950 font-extrabold text-zinc-755 p-3 rounded-t-xl text-xs";
        return "";
      case "glassmorphism":
      case "liquid-glass":
        if (type === "tab-button") return "rounded-lg py-1.5 px-4 font-bold backdrop-blur-3xs border border-white/10";
        if (type === "table-header") return "bg-white/5 border-b border-white/10 font-bold p-3 text-xs";
        return "";
      case "minimalism":
        if (type === "tab-button") return "rounded-none py-1.5 px-4 font-medium border border-zinc-200/80 dark:border-zinc-800";
        if (type === "table-header") return "border-b border-zinc-250 font-extrabold p-3 text-xs";
        return "";
      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "tab-button") return "rounded-xl py-1.5 px-4 font-bold border border-zinc-200/60 dark:border-zinc-800";
        if (type === "table-header") return "bg-zinc-50 dark:bg-zinc-950 font-extrabold text-zinc-600 dark:text-zinc-400 p-3 text-xs";
        return "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left pb-12">
      
      {/* 1. Header and Navigation Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-355 font-bold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Sistem & Keamanan</span>
            <span>/</span>
            <span>Sistem Log</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Sistem Log Audit
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pantau seluruh aktivitas audit operasional sistem, log transaksi pendaftaran, serta sinkronisasi data internal.
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <UI.Button
            onClick={handleSimulateLog}
            variant="primary"
            accentColor={selectedColor}
            className="font-bold! text-xs! py-2.5! px-4! w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
          >
            <Icons.Sparkles className="w-4 h-4" />
            Simulasikan Log Baru
          </UI.Button>
        </div>
      </div>

      {/* 2. Simulator State Controller */}
      <div className="flex flex-wrap gap-2.5 items-center bg-zinc-100/80 dark:bg-zinc-900/40 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
        <span className="text-[10px] text-zinc-555 dark:text-zinc-300 font-bold uppercase tracking-wider pl-2 pr-1">
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
          Default (Audit Stream)
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
          onClick={handleResetData}
          className="p-1.5 text-zinc-450 hover:text-sakode-orange hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 rounded-lg transition-colors ml-auto cursor-pointer flex items-center gap-1 text-[10px] font-bold"
        >
          <Icons.Check className="w-3.5 h-3.5" />
          Reset Data
        </button>
      </div>

      {/* 3. Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-wrap gap-2 items-center flex-1">
          <div className="relative flex items-center w-full sm:w-64">
            <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3 z-10 pointer-events-none" />
            <UI.Input
              type="text"
              placeholder="Cari deskripsi, aktor, ID log..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              accentColor={selectedColor}
              className="pl-9! text-xs! py-1.5!"
            />
          </div>

          <UI.Select
            value={categoryFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
            accentColor={selectedColor}
            className="text-xs! py-1.5! px-3!"
          >
            <option value="all">Semua Kategori</option>
            <option value="auth">Autentikasi Sesi</option>
            <option value="registration">Pendaftaran & Program</option>
            <option value="mentor">Aktivitas Mentor</option>
            <option value="extracurricular">Kemitraan Ekskul</option>
            <option value="system">Operasional Sistem</option>
          </UI.Select>

          <UI.Select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            accentColor={selectedColor}
            className="text-xs! py-1.5! px-3!"
          >
            <option value="all">Semua Tingkat</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </UI.Select>
        </div>
      </div>

      {/* 4. Logs List */}
      {simulationState === "loading" ? (
        <div className="py-24 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/30 flex flex-col items-center justify-center gap-3">
          <Icons.Loader className="w-8 h-8 text-sakode-blue dark:text-sky-400 animate-spin" />
          <span className="text-xs text-zinc-455 font-bold">Memuat log sistem...</span>
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="overflow-x-auto border border-zinc-200/60 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/30">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className={getSubElementClass("table-header") + " text-left rounded-tl-2xl pl-4"}>Waktu / Timestamp</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Aktor</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Kategori</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Rincian Tindakan / Action</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Status</th>
                <th className={getSubElementClass("table-header") + " text-center rounded-tr-2xl pr-4"}>IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850 text-left font-mono">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-zinc-55/35 dark:hover:bg-zinc-800/10 transition-colors"
                >
                  <td className="p-3 pl-4 text-left font-semibold text-zinc-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3 text-left font-bold text-zinc-800 dark:text-zinc-200">
                    <span className="block">{log.actorName}</span>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block mt-0.5">
                      Role: {log.actorRole}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <UI.Badge
                      {...getCategoryBadgeProps(log.category)}
                      className="text-[9px]! font-black! uppercase tracking-wider"
                    >
                      {log.category}
                    </UI.Badge>
                  </td>
                  <td className="p-3 text-left font-sans font-semibold text-zinc-700 dark:text-zinc-300 max-w-md">
                    {log.action}
                  </td>
                  <td className="p-3 text-center">
                    <UI.Badge
                      {...getStatusBadgeProps(log.status)}
                      className="text-[9.5px]! font-black! uppercase tracking-wide"
                    >
                      {log.status}
                    </UI.Badge>
                  </td>
                  <td className="p-3 text-center text-zinc-450 font-bold">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-20 text-center text-xs text-zinc-450 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/30 flex flex-col items-center justify-center gap-1.5">
          <Icons.Terminal className="w-8 h-8 text-zinc-300" />
          <span>Tidak ada berkas log yang terekam.</span>
          <span className="text-[10px] text-zinc-400 font-bold">Klik &ldquo;Simulasikan Log Baru&rdquo; di atas untuk menyuntikkan data event.</span>
        </div>
      )}

      {/* Toast Alert notifications */}
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
