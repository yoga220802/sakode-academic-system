"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { UserAccount } from "../_types/user";
import { UserRole } from "@/app/_types/auth";
import {
  getStoredUsers,
  saveStoredUsers
} from "../_services/users-mock";

export default function NewUserPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];
  const router = useRouter();

  // 1. Data States
  const [users, setUsers] = useState<UserAccount[]>([]);

  // 2. Form States
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "murid" as UserRole,
    status: "active" as "active" | "inactive"
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Load dataset on mount
  useEffect(() => {
    setUsers(getStoredUsers());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Nama Lengkap dan Alamat Email wajib diisi.");
      return;
    }

    // Email duplication check
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === form.email.toLowerCase()
    );
    if (emailExists) {
      setFormError("Alamat email ini sudah terdaftar di sistem.");
      return;
    }

    const newId = `USR-${Math.floor(100 + Math.random() * 900)}`;
    const newUser: UserAccount = {
      id: newId,
      name: form.name,
      email: form.email,
      role: form.role,
      status: form.status,
      joinedDate: new Date().toISOString().split("T")[0]
    };

    const updated = [newUser, ...users];
    saveStoredUsers(updated);
    router.push("/users");
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-355 font-bold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Direktori Pengguna</span>
            <span>/</span>
            <span>Tambah Baru</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Tambah Pengguna Baru
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Daftarkan kredensial akun baru ke sistem dengan konfigurasi peran dan status yang ditentukan.
          </p>
        </div>

        <UI.Button
          onClick={() => router.push("/users")}
          variant="secondary"
          accentColor={selectedColor}
          className="font-bold! text-xs! py-2.5! px-4! cursor-pointer flex items-center gap-1.5"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          Batal
        </UI.Button>
      </div>

      {formError && (
        <UI.Alert title="Validasi Gagal" type="warning">
          {formError}
        </UI.Alert>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="max-w-2xl w-full">
        <UI.Card>
          <div className="p-5 flex flex-col gap-5 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-150 dark:border-zinc-800 pb-3">
              Formulir Akun Baru
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <UI.Label>Nama Lengkap</UI.Label>
                <UI.Input
                  type="text"
                  placeholder="Nama Lengkap pengguna baru..."
                  value={form.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
                  accentColor={selectedColor}
                  className="text-xs! py-2!"
                />
              </div>

              <div>
                <UI.Label>Alamat Email</UI.Label>
                <UI.Input
                  type="email"
                  placeholder="email@domain.com"
                  value={form.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
                  accentColor={selectedColor}
                  className="text-xs! py-2!"
                />
              </div>

              <div>
                <UI.Label>Peran / Role</UI.Label>
                <UI.Select
                  value={form.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, role: e.target.value as UserRole })}
                  accentColor={selectedColor}
                  className="text-xs!"
                >
                  <option value="murid">Siswa / Murid</option>
                  <option value="mentor">Mentor Akademik</option>
                  <option value="mentor_lead">Mentor Lead</option>
                  <option value="school_principal">Kepala Sekolah (Mitra)</option>
                  <option value="admin">Admin Pusat</option>
                </UI.Select>
              </div>

              <div>
                <UI.Label>Status Awal</UI.Label>
                <UI.Select
                  value={form.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
                  accentColor={selectedColor}
                  className="text-xs!"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </UI.Select>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 mt-2 flex justify-end gap-2">
              <UI.Button
                type="button"
                onClick={() => router.push("/users")}
                variant="secondary"
                accentColor={selectedColor}
                className="font-bold! text-xs! py-2! cursor-pointer"
              >
                Batal
              </UI.Button>
              <UI.Button
                type="submit"
                variant="primary"
                accentColor={selectedColor}
                className="font-bold! text-xs! py-2! px-6! cursor-pointer shadow-3xs flex items-center gap-1.5"
              >
                <Icons.Check className="w-4 h-4" />
                Simpan Pengguna
              </UI.Button>
            </div>
          </div>
        </UI.Card>
      </form>

    </div>
  );
}
