"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { PrincipalMembership } from "../_types/membership";
import {
  getStoredMemberships,
  saveStoredMemberships
} from "../_services/principal-membership-mock";
import { getStoredOrganizations } from "../../extracurriculars-admin/_services/extracurricular-mock";
import { ExtracurricularOrganization } from "../../extracurriculars-admin/_types/extracurricular";

export default function NewPrincipalMembershipPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];
  const router = useRouter();

  // 1. Data States
  const [memberships, setMemberships] = useState<PrincipalMembership[]>([]);
  const [organizations, setOrganizations] = useState<ExtracurricularOrganization[]>([]);

  // 2. Form States
  const [form, setForm] = useState({
    principalName: "",
    principalEmail: "",
    status: "active" as "active" | "inactive"
  });

  // Selected school/org mappings checklist
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);

  const [formError, setFormError] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    setMemberships(getStoredMemberships());
    setOrganizations(getStoredOrganizations());
  }, []);

  // Handle checkboxes
  const handleToggleOrg = (orgId: string) => {
    if (selectedOrgs.includes(orgId)) {
      setSelectedOrgs(selectedOrgs.filter((id) => id !== orgId));
    } else {
      setSelectedOrgs([...selectedOrgs, orgId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.principalName.trim() || !form.principalEmail.trim()) {
      setFormError("Nama Lengkap dan Alamat Email wajib diisi.");
      return;
    }

    // Email duplication check
    const emailExists = memberships.some(
      (m) => m.principalEmail.toLowerCase() === form.principalEmail.toLowerCase()
    );
    if (emailExists) {
      setFormError("Alamat email ini sudah terdaftar sebagai Kepala Sekolah.");
      return;
    }

    if (selectedOrgs.length === 0) {
      setFormError("Wajib menghubungkan minimal satu sekolah / organisasi ekskul.");
      return;
    }

    const newId = `PR-${Math.floor(104 + Math.random() * 900)}`;
    const newMembership: PrincipalMembership = {
      id: newId,
      principalName: form.principalName,
      principalEmail: form.principalEmail,
      assignedOrgs: selectedOrgs,
      status: form.status,
      joinedDate: new Date().toISOString().split("T")[0]
    };

    const updated = [newMembership, ...memberships];
    saveStoredMemberships(updated);
    router.push("/principal-membership");
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-355 font-bold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Keanggotaan Kepsek</span>
            <span>/</span>
            <span>Hubungkan Baru</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Hubungkan Kepala Sekolah Baru
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Buat pemetaan akun Kepala Sekolah baru untuk memperoleh hak akses baca terbatas pada sekolah mitra terkait.
          </p>
        </div>

        <UI.Button
          onClick={() => router.push("/principal-membership")}
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

      {/* Spacious 2-Panel Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Account info */}
        <div className="lg:col-span-2 space-y-6">
          <UI.Card className="relative z-20">
            <div className="p-5 flex flex-col gap-5 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-150 dark:border-zinc-800 pb-3">
                1. Profil & Akun Kepala Sekolah
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <UI.Label>Nama Lengkap Kepala Sekolah</UI.Label>
                  <UI.Input
                    type="text"
                    placeholder="Nama Lengkap beserta gelar akademik..."
                    value={form.principalName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, principalName: e.target.value })}
                    accentColor={selectedColor}
                    className="text-xs! py-2!"
                  />
                </div>

                <div>
                  <UI.Label>Alamat Email Akun</UI.Label>
                  <UI.Input
                    type="email"
                    placeholder="kepsek@sekolah.sch.id"
                    value={form.principalEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, principalEmail: e.target.value })}
                    accentColor={selectedColor}
                    className="text-xs! py-2!"
                  />
                </div>

                <div>
                  <UI.Label>Status Akun</UI.Label>
                  <UI.Select
                    value={form.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
                    accentColor={selectedColor}
                    className="text-xs!"
                  >
                    <option value="active">Aktif (Diberi Akses)</option>
                    <option value="inactive">Nonaktif (Akses Ditangguhkan)</option>
                  </UI.Select>
                </div>
              </div>
            </div>
          </UI.Card>
        </div>

        {/* Right Side: School Mappings checklist selection */}
        <div className="lg:col-span-1 space-y-6">
          <UI.Card className="relative z-10">
            <div className="p-5 flex flex-col gap-4 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-150 dark:border-zinc-800 pb-3">
                2. Pemetaan Sekolah Mitra
              </h3>

              <span className="text-[10px] text-zinc-450 leading-normal block">
                Pilih satu atau lebih sekolah mitra di mana Kepala Sekolah ini diperbolehkan melihat laporan operasional ekskul secara read-only.
              </span>

              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-1">
                {organizations.length > 0 ? (
                  organizations.map((org) => {
                    const isChecked = selectedOrgs.includes(org.id);
                    return (
                      <div
                        key={org.id}
                        onClick={() => handleToggleOrg(org.id)}
                        className={`border p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-2.5 ${
                          isChecked
                            ? "bg-sakode-blue/5 border-sakode-blue/40 text-sakode-blue dark:bg-sky-400/5 dark:border-sky-400/30 dark:text-sky-400"
                            : "bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50"
                        }`}
                      >
                        <div className="pt-0.5">
                          <input
                            title="Pilih sekolah mitra ini"
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="rounded border-zinc-300 text-sakode-blue focus:ring-sakode-blue cursor-pointer h-3.5 w-3.5"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-xs block truncate leading-tight">
                            {org.name}
                          </span>
                          <span className="text-[9.5px] text-zinc-450 block truncate mt-0.5">
                            Kec. {org.kecamatan || "N/A"}, {org.kabupaten}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-zinc-400 italic text-xs block">Tidak ada sekolah mitra terdaftar.</span>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 mt-2">
                <UI.Button
                  type="submit"
                  variant="primary"
                  accentColor={selectedColor}
                  className="w-full font-bold! text-xs! py-2.5! cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                >
                  <Icons.Check className="w-4 h-4" />
                  Simpan Pemetaan
                </UI.Button>
              </div>
            </div>
          </UI.Card>
        </div>

      </form>

    </div>
  );
}
