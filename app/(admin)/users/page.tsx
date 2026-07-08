/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { UserAccount } from "./_types/user";
import {
  getStoredUsers,
  saveStoredUsers,
  DEFAULT_USERS
} from "./_services/users-mock";

export default function UsersPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];
  const router = useRouter();

  // 1. Data States
  const [users, setUsers] = useState<UserAccount[]>([]);

  // 2. Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // 3. Modals and messages
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState("");
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<UserAccount | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");

  // Load dataset on mount
  useEffect(() => {
    setUsers(getStoredUsers());
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetData = () => {
    setUsers(DEFAULT_USERS);
    saveStoredUsers(DEFAULT_USERS);
    showToast("Data direktori pengguna berhasil di-reset.");
  };

  // Filters and metrics computation
  const filteredUsers = useMemo(() => {
    if (simulationState === "empty") return [];
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter, simulationState]);

  const metrics = useMemo(() => {
    if (simulationState === "empty") {
      return { total: 0, admin: 0, mentor: 0, student: 0, principal: 0 };
    }
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "admin").length,
      mentor: users.filter((u) => u.role === "mentor" || u.role === "mentor_lead").length,
      student: users.filter((u) => u.role === "murid").length,
      principal: users.filter((u) => u.role === "school_principal").length
    };
  }, [users, simulationState]);

  // Toggle active/inactive status
  const handleToggleStatus = (user: UserAccount) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, status: nextStatus as "active" | "inactive" } : u
    );
    setUsers(updated);
    saveStoredUsers(updated);
    showToast(`Status ${user.name} diubah menjadi ${nextStatus === "active" ? "Aktif" : "Nonaktif"}.`);
  };

  // Delete/Remove user
  const handleOpenDeleteConfirm = (user: UserAccount) => {
    setTargetId(user.id);
    setTargetName(user.name);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteSubmit = () => {
    if (!targetId) return;
    const updated = users.filter((u) => u.id !== targetId);
    setUsers(updated);
    saveStoredUsers(updated);
    setIsDeleteConfirmOpen(false);
    showToast(`Sukses menghapus pengguna ${targetName}.`);
  };

  // Reset Password handlers
  const handleOpenResetPassword = (user: UserAccount) => {
    setResetTargetUser(user);
    setIsResetPasswordOpen(true);
  };

  const handleResetPasswordSubmit = () => {
    if (!resetTargetUser) return;
    setIsResetPasswordOpen(false);
    showToast(`Kata sandi ${resetTargetUser.name} berhasil di-reset ke default 'academy@sakode'.`);
  };

  // Role translation helper
  const translateRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin Pusat";
      case "mentor_lead":
        return "Mentor Lead";
      case "mentor":
        return "Mentor";
      case "school_principal":
        return "Kepala Sekolah";
      case "murid":
        return "Siswa/Murid";
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-rose-500/10 text-rose-600";
      case "mentor_lead":
        return "bg-amber-500/10 text-amber-600";
      case "mentor":
        return "bg-blue-500/10 text-sakode-blue dark:text-sky-400";
      case "school_principal":
        return "bg-purple-500/10 text-purple-600";
      case "murid":
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400";
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
            <span>Direktori Pengguna</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Direktori Pengguna
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat, kelola, dan perbarui peran serta status aktif dari seluruh kategori akun pengguna sistem.
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <UI.Button
            onClick={() => router.push("/users/new")}
            variant="primary"
            accentColor={selectedColor}
            className="font-bold! text-xs! py-2.5! px-4! w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
          >
            <Icons.UserPlus className="w-4 h-4" />
            Tambah Pengguna Baru
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
          Default
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

      {/* 3. Metrics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <UI.Card>
          <div className="p-3.5 text-left">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Total Akun</span>
            <span className="text-lg font-black text-zinc-850 dark:text-white mt-1 block">
              {metrics.total}
            </span>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-3.5 text-left">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Admin Pusat</span>
            <span className="text-lg font-black text-rose-500 mt-1 block">
              {metrics.admin}
            </span>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-3.5 text-left">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Mentor & Lead</span>
            <span className="text-lg font-black text-blue-500 dark:text-sky-400 mt-1 block">
              {metrics.mentor}
            </span>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-3.5 text-left">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Kepala Sekolah</span>
            <span className="text-lg font-black text-purple-500 mt-1 block">
              {metrics.principal}
            </span>
          </div>
        </UI.Card>

        <UI.Card>
          <div className="p-3.5 text-left col-span-2 md:col-span-1">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Murid Aktif</span>
            <span className="text-lg font-black text-emerald-500 mt-1 block">
              {metrics.student}
            </span>
          </div>
        </UI.Card>
      </div>

      {/* 4. Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-wrap gap-2 items-center flex-1">
          <div className="relative flex items-center w-full sm:w-64">
            <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3 z-10 pointer-events-none" />
            <UI.Input
              type="text"
              placeholder="Cari ID, nama, atau email..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              accentColor={selectedColor}
              className="pl-9! text-xs! py-1.5!"
            />
          </div>

          <UI.Select
            value={roleFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRoleFilter(e.target.value)}
            accentColor={selectedColor}
            className="text-xs! py-1.5! px-3!"
          >
            <option value="all">Semua Peran</option>
            <option value="admin">Admin Pusat</option>
            <option value="mentor_lead">Mentor Lead</option>
            <option value="mentor">Mentor</option>
            <option value="school_principal">Kepala Sekolah</option>
            <option value="murid">Siswa/Murid</option>
          </UI.Select>

          <UI.Select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            accentColor={selectedColor}
            className="text-xs! py-1.5! px-3!"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </UI.Select>
        </div>
      </div>

      {/* 5. Main Content: User Table */}
      {simulationState === "loading" ? (
        <div className="py-24 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/30 flex flex-col items-center justify-center gap-3">
          <Icons.Loader className="w-8 h-8 text-sakode-blue dark:text-sky-400 animate-spin" />
          <span className="text-xs text-zinc-455 font-bold">Memuat direktori pengguna...</span>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="overflow-x-auto border border-zinc-200/60 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/30">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className={getSubElementClass("table-header") + " text-left rounded-tl-2xl pl-4"}>ID Pengguna</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Nama Lengkap</th>
                <th className={getSubElementClass("table-header") + " text-left"}>Alamat Email</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Peran / Role</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Tanggal Terdaftar</th>
                <th className={getSubElementClass("table-header") + " text-center"}>Status</th>
                <th className={getSubElementClass("table-header") + " text-center rounded-tr-2xl pr-4"}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850 text-left">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-zinc-55/35 dark:hover:bg-zinc-800/10 transition-colors"
                >
                  <td className="p-4 pl-4 text-left font-mono text-[10px] text-zinc-500 font-bold">
                    {user.id}
                  </td>
                  <td className="p-4 font-extrabold text-zinc-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="p-4 font-semibold text-zinc-600 dark:text-zinc-350">
                    {user.email}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                      {translateRole(user.role)}
                    </span>
                  </td>
                  <td className="p-4 text-center font-semibold text-zinc-500">
                    {user.joinedDate}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      onClick={() => handleToggleStatus(user)}
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black select-none cursor-pointer transition-all ${
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                      }`}
                      title="Klik untuk ubah status"
                    >
                      {user.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="p-4 text-center pr-4">
                    <div className="flex gap-3 justify-center items-center">
                      <button
                        onClick={() => router.push(`/users/${user.id}/edit`)}
                        className="bg-sakode-blue/10 text-sakode-blue dark:bg-sky-400/10 dark:text-sky-400 hover:bg-sakode-blue hover:text-white dark:hover:bg-sky-400 dark:hover:text-zinc-950 font-black text-[10px] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                      >
                        Ubah Peran
                      </button>
                      <button
                        onClick={() => handleOpenResetPassword(user)}
                        className="text-zinc-450 hover:text-amber-600 font-bold text-[10px] cursor-pointer"
                      >
                        Reset Sandi
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm(user)}
                        className="text-zinc-450 hover:text-rose-600 font-bold text-[10px] cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-20 text-center text-xs text-zinc-450 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/30 flex flex-col items-center justify-center gap-1.5">
          <Icons.Users className="w-8 h-8 text-zinc-300" />
          <span>Tidak ada data pengguna yang ditemukan.</span>
          <span className="text-[10px] text-zinc-400 font-bold">Sesuaikan filter atau gunakan tombol &ldquo;Tambah Pengguna Baru&rdquo;.</span>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative my-8"
            >
              <UI.Card accentColor="red">
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-455 flex items-center gap-1.5">
                      <Icons.AlertCircle className="w-4 h-4 text-rose-500" />
                      Hapus Akun Pengguna
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                      title="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-350 leading-normal block">
                      Apakah Anda yakin ingin menghapus akun pengguna <span className="font-extrabold text-zinc-900 dark:text-white">{targetName}</span>?
                    </span>
                    <span className="text-[10px] text-zinc-450 mt-2 block">
                      Tindakan ini permanen. Seluruh riwayat sesi dan penugasan terkait akun ini tidak akan lagi dapat diakses.
                    </span>
                  </div>

                  <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                    <UI.Button
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-bold! cursor-pointer"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      onClick={handleDeleteSubmit}
                      variant="primary"
                      accentColor="red"
                      className="text-xs! py-2! px-5! font-bold! cursor-pointer bg-rose-600! hover:bg-rose-700!"
                    >
                      Ya, Hapus Akun
                    </UI.Button>
                  </div>
                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESET PASSWORD CONFIRMATION DIALOG */}
      <AnimatePresence>
        {isResetPasswordOpen && resetTargetUser && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative my-8"
            >
              <UI.Card accentColor="yellow">
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                      <Icons.AlertCircle className="w-4 h-4 text-amber-500" />
                      Reset Kata Sandi
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsResetPasswordOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                      title="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-350 leading-normal block">
                      Apakah Anda yakin ingin me-reset kata sandi akun <span className="font-extrabold text-zinc-900 dark:text-white">{resetTargetUser.name}</span>?
                    </span>
                    <span className="text-[10px] text-zinc-455 mt-2 block">
                      Kata sandi akan dikembalikan ke nilai bawaan akademi: <strong className="font-mono text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">academy@sakode</strong>.
                    </span>
                  </div>

                  <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                    <UI.Button
                      onClick={() => setIsResetPasswordOpen(false)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-bold! cursor-pointer"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      onClick={handleResetPasswordSubmit}
                      variant="primary"
                      accentColor="yellow"
                      className="text-xs! py-2! px-5! font-bold! cursor-pointer bg-amber-550! hover:bg-amber-650! text-zinc-950!"
                    >
                      Ya, Reset Sandi
                    </UI.Button>
                  </div>
                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
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
