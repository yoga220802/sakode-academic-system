/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { ExtracurricularOrganization } from "../_types/extracurricular";
import {
  getStoredOrganizations,
  saveStoredOrganizations
} from "../_services/extracurricular-mock";
import { getStoredMentors } from "../../mentors/_services/mentor-mock";
import { Mentor } from "../../mentors/_types/mentor";
import SearchableSelect from "../_components/SearchableSelect";

interface ApiRegion {
  id: string;
  name: string;
}

export default function NewExtracurricularPage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];
  const router = useRouter();

  // 1. Data States
  const [organizations, setOrganizations] = useState<ExtracurricularOrganization[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  // Regional options loaded from proxy route
  const [apiProvinces, setApiProvinces] = useState<ApiRegion[]>([]);
  const [apiRegencies, setApiRegencies] = useState<ApiRegion[]>([]);
  const [apiDistricts, setApiDistricts] = useState<ApiRegion[]>([]);
  const [apiVillages, setApiVillages] = useState<ApiRegion[]>([]);

  // Form State
  const [schoolForm, setSchoolForm] = useState({
    name: "",
    picName: "",
    picEmail: "",
    picPhone: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    kelurahan: "",
    rtRw: "",
    streetAddress: "",
    status: "active" as "active" | "inactive",
    mentorId: "",
    mouFileName: "",
    mouSignedDate: "2026-07-07"
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Load from local storage and fetch provinces from proxy
  useEffect(() => {
    setOrganizations(getStoredOrganizations());
    setMentors(getStoredMentors());

    fetch("/api/wilayah?type=provinces")
      .then((res) => res.json())
      .then((data) => setApiProvinces(data))
      .catch(() => {
        // Fallback offline provinces
        setApiProvinces([
          { id: "34", name: "DAERAH ISTIMEWA YOGYAKARTA" },
          { id: "31", name: "DKI JAKARTA" },
          { id: "32", name: "JAWA BARAT" },
          { id: "33", name: "JAWA TENGAH" },
          { id: "35", name: "JAWA TIMUR" }
        ]);
      });
  }, []);

  // Pre-select first mentor
  useEffect(() => {
    if (mentors.length > 0 && !schoolForm.mentorId) {
      setSchoolForm((prev) => ({ ...prev, mentorId: mentors[0].id }));
    }
  }, [mentors, schoolForm.mentorId]);

  // Province change: resets child levels and fetches regencies
  const handleProvinceChange = (prov: ApiRegion) => {
    setSchoolForm((prev) => ({
      ...prev,
      provinsi: prov.name,
      kabupaten: "",
      kecamatan: "",
      kelurahan: ""
    }));
    setApiRegencies([]);
    setApiDistricts([]);
    setApiVillages([]);

    fetch(`/api/wilayah?type=regencies&id=${prov.id}`)
      .then((res) => res.json())
      .then((data) => setApiRegencies(data))
      .catch(() => {});
  };

  // Regency change: resets child levels and fetches districts (kecamatan)
  const handleRegencyChange = (reg: ApiRegion) => {
    setSchoolForm((prev) => ({
      ...prev,
      kabupaten: reg.name,
      kecamatan: "",
      kelurahan: ""
    }));
    setApiDistricts([]);
    setApiVillages([]);

    fetch(`/api/wilayah?type=districts&id=${reg.id}`)
      .then((res) => res.json())
      .then((data) => setApiDistricts(data))
      .catch(() => {});
  };

  // District change: resets child levels and fetches villages (kelurahan)
  const handleDistrictChange = (dist: ApiRegion) => {
    setSchoolForm((prev) => ({
      ...prev,
      kecamatan: dist.name,
      kelurahan: ""
    }));
    setApiVillages([]);

    fetch(`/api/wilayah?type=villages&id=${dist.id}`)
      .then((res) => res.json())
      .then((data) => setApiVillages(data))
      .catch(() => {});
  };

  const handleVillageChange = (vil: ApiRegion) => {
    setSchoolForm((prev) => ({
      ...prev,
      kelurahan: vil.name
    }));
  };

  const handleSimulateFileUpload = () => {
    if (!schoolForm.name) {
      setFormError("Mohon masukkan Nama Sekolah terlebih dahulu untuk generate nama file MoU.");
      return;
    }

    const cleanSchoolName = schoolForm.name.replace(/\s+/g, "_");
    const targetName = `MoU_${cleanSchoolName}_Signed.pdf`;
    
    setUploadProgress(0);
    setFormError(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadedFileName(targetName);
          setSchoolForm((prev) => ({ ...prev, mouFileName: targetName }));
          setUploadProgress(null);
        }, 300);
      }
    }, 155);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !schoolForm.name ||
      !schoolForm.picName ||
      !schoolForm.picEmail ||
      !schoolForm.picPhone ||
      !schoolForm.provinsi ||
      !schoolForm.kabupaten ||
      !schoolForm.kecamatan ||
      !schoolForm.kelurahan ||
      !schoolForm.rtRw ||
      !schoolForm.streetAddress
    ) {
      setFormError("Mohon lengkapi seluruh profil Guru Pendamping, Sekolah, dan Alamat Lengkap.");
      return;
    }

    if (!schoolForm.mouFileName) {
      setFormError("Wajib mengunggah dokumen MoU kerja sama sekolah.");
      return;
    }

    const isDuplicate = organizations.some((o) => o.name.toLowerCase() === schoolForm.name.toLowerCase());
    if (isDuplicate) {
      setFormError("Sekolah / Organisasi dengan nama ini sudah terdaftar.");
      return;
    }

    const mentor = mentors.find((m) => m.id === schoolForm.mentorId);
    if (!mentor) {
      setFormError("Mentor SAKODE tidak ditemukan.");
      return;
    }

    const newId = `ORG-${Math.floor(104 + Math.random() * 900)}`;
    const newOrg: ExtracurricularOrganization = {
      id: newId,
      name: schoolForm.name,
      picName: schoolForm.picName,
      picEmail: schoolForm.picEmail,
      picPhone: schoolForm.picPhone,
      provinsi: schoolForm.provinsi,
      kabupaten: schoolForm.kabupaten,
      kecamatan: schoolForm.kecamatan,
      kelurahan: schoolForm.kelurahan,
      rtRw: schoolForm.rtRw,
      streetAddress: schoolForm.streetAddress,
      status: schoolForm.status,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mouFileName: schoolForm.mouFileName,
      mouSignedDate: schoolForm.mouSignedDate,
      members: []
    };

    const updated = [newOrg, ...organizations];
    saveStoredOrganizations(updated);
    router.push("/extracurriculars-admin");
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-355 font-bold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Kemitraan</span>
            <span>/</span>
            <span>Daftar Baru</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Daftarkan Ekskul Sekolah Baru
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Silakan lengkapi formulir pendaftaran kerja sama sekolah mitra dan mentor pembimbing.
          </p>
        </div>

        <UI.Button
          onClick={() => router.push("/extracurriculars-admin")}
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

      {/* Spacious Form Panels */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel 1: Profil Sekolah & Mentor (Left Side) */}
        <div className="lg:col-span-2 space-y-6">
          <UI.Card>
            <div className="p-5 flex flex-col gap-5 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-150 dark:border-zinc-800 pb-3">
                1. Rincian Sekolah & Mentor
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <UI.Label>Nama Sekolah / Institusi Mitra</UI.Label>
                  <UI.Input
                    type="text"
                    placeholder="contoh: SMA Labschool Jakarta"
                    value={schoolForm.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                    accentColor={selectedColor}
                    className="text-xs! py-2!"
                  />
                </div>
                
                <div>
                  <UI.Label>Pilih Mentor SAKODE (Pemegang Ekskul)</UI.Label>
                  <UI.Select
                    value={schoolForm.mentorId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSchoolForm({ ...schoolForm, mentorId: e.target.value })}
                    accentColor={selectedColor}
                    className="text-xs!"
                  >
                    {mentors.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.skills.slice(0, 2).join(", ")})
                      </option>
                    ))}
                  </UI.Select>
                </div>

                <div>
                  <UI.Label>Status Pendaftaran</UI.Label>
                  <UI.Select
                    value={schoolForm.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSchoolForm({ ...schoolForm, status: e.target.value as "active" | "inactive" })}
                    accentColor={selectedColor}
                    className="text-xs!"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </UI.Select>
                </div>
              </div>
            </div>
          </UI.Card>

          {/* Panel 2: Alamat Lengkap Administrasi Wilayah */}
          <UI.Card>
            <div className="p-5 flex flex-col gap-5 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-150 dark:border-zinc-800 pb-3">
                2. Alamat Lengkap Wilayah
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <SearchableSelect
                  label="Provinsi"
                  placeholder="Cari provinsi..."
                  options={apiProvinces}
                  value={schoolForm.provinsi}
                  onChange={handleProvinceChange}
                />

                <SearchableSelect
                  label="Kota / Kabupaten"
                  placeholder="Pilih provinsi dahulu..."
                  options={apiRegencies}
                  value={schoolForm.kabupaten}
                  onChange={handleRegencyChange}
                  disabled={!schoolForm.provinsi}
                />

                <SearchableSelect
                  label="Kecamatan"
                  placeholder="Pilih kota/kabupaten dahulu..."
                  options={apiDistricts}
                  value={schoolForm.kecamatan}
                  onChange={handleDistrictChange}
                  disabled={!schoolForm.kabupaten}
                />

                <SearchableSelect
                  label="Desa / Kelurahan"
                  placeholder="Pilih kecamatan dahulu..."
                  options={apiVillages}
                  value={schoolForm.kelurahan}
                  onChange={handleVillageChange}
                  disabled={!schoolForm.kecamatan}
                />

                <div>
                  <UI.Label>RT / RW</UI.Label>
                  <UI.Input
                    type="text"
                    placeholder="contoh: RT 03 / RW 05"
                    value={schoolForm.rtRw}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm({ ...schoolForm, rtRw: e.target.value })}
                    accentColor={selectedColor}
                    className="text-xs! py-2!"
                  />
                </div>

                <div>
                  <UI.Label>Alamat Jalan / Gedung</UI.Label>
                  <UI.Input
                    type="text"
                    placeholder="Nama jalan, nomor gedung, atau dusun..."
                    value={schoolForm.streetAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm({ ...schoolForm, streetAddress: e.target.value })}
                    accentColor={selectedColor}
                    className="text-xs! py-2!"
                  />
                </div>

              </div>
            </div>
          </UI.Card>
        </div>

        {/* Panel 3: Guru Pendamping & MoU (Right Side) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Guru Pendamping */}
          <UI.Card>
            <div className="p-5 flex flex-col gap-4 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-150 dark:border-zinc-800 pb-3">
                3. Guru Pendamping
              </h3>

              <div>
                <UI.Label>Nama Lengkap Guru</UI.Label>
                <UI.Input
                  type="text"
                  placeholder="Nama & gelar akademik..."
                  value={schoolForm.picName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm({ ...schoolForm, picName: e.target.value })}
                  accentColor={selectedColor}
                  className="text-xs! py-2!"
                />
              </div>

              <div>
                <UI.Label>Email Guru</UI.Label>
                <UI.Input
                  type="email"
                  placeholder="guru@school.sch.id"
                  value={schoolForm.picEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm({ ...schoolForm, picEmail: e.target.value })}
                  accentColor={selectedColor}
                  className="text-xs! py-2!"
                />
              </div>

              <div>
                <UI.Label>No WhatsApp Guru</UI.Label>
                <UI.Input
                  type="text"
                  placeholder="+62 8xx-xxxx-xxxx"
                  value={schoolForm.picPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm({ ...schoolForm, picPhone: e.target.value })}
                  accentColor={selectedColor}
                  className="text-xs! py-2!"
                />
              </div>
            </div>
          </UI.Card>

          {/* MoU Document Upload */}
          <UI.Card>
            <div className="p-5 flex flex-col gap-4 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-150 dark:border-zinc-800 pb-3">
                4. Dokumen Kerja Sama (MoU)
              </h3>

              <div
                onClick={handleSimulateFileUpload}
                className="border-2 border-dashed border-zinc-200/80 dark:border-zinc-800 hover:border-sakode-blue dark:hover:border-sky-400 bg-zinc-50 dark:bg-zinc-950/20 p-5 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                {uploadProgress !== null ? (
                  <div className="w-full space-y-2">
                    <Icons.Loader className="w-6 h-6 text-sakode-blue dark:text-sky-400 mx-auto animate-spin" />
                    <span className="text-[10px] font-bold text-zinc-400">Mengunggah MoU... {uploadProgress}%</span>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sakode-blue dark:bg-sky-400 h-full" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : uploadedFileName ? (
                  <>
                    <Icons.Check className="w-6 h-6 text-emerald-500" />
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{uploadedFileName}</span>
                    <span className="text-[9px] text-zinc-400">Klik lagi untuk mengganti berkas</span>
                  </>
                ) : (
                  <>
                    <Icons.BookOpen className="w-6 h-6 text-zinc-400" />
                    <span className="text-xs font-bold text-zinc-650 dark:text-zinc-300">Pilih Berkas MoU (PDF)</span>
                    <span className="text-[9.5px] text-zinc-400">Klik untuk mensimulasikan upload berkas kerja sama</span>
                  </>
                )}
              </div>

              <div>
                <UI.Label>Tanggal Tanda Tangan MoU</UI.Label>
                <UI.Input
                  type="date"
                  value={schoolForm.mouSignedDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm({ ...schoolForm, mouSignedDate: e.target.value })}
                  accentColor={selectedColor}
                  className="text-xs! py-2!"
                />
              </div>

              <div className="pt-2">
                <UI.Button
                  type="submit"
                  variant="primary"
                  accentColor={selectedColor}
                  className="w-full font-bold! text-xs! py-2.5! cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                >
                  <Icons.Check className="w-4 h-4" />
                  Daftarkan Ekskul Baru
                </UI.Button>
              </div>
            </div>
          </UI.Card>

        </div>

      </form>

    </div>
  );
}
