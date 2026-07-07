/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { ExtracurricularOrganization, ExtracurricularMember } from "../_types/extracurricular";
import {
  getStoredOrganizations,
  saveStoredOrganizations
} from "../_services/extracurricular-mock";
import { getStoredMentors } from "../../mentors/_services/mentor-mock";
import { Mentor } from "../../mentors/_types/mentor";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ExtracurricularDetailPage({ params }: DetailPageProps) {
  const resolvedParams = use(params);
  const schoolId = resolvedParams.id;

  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];
  const router = useRouter();

  // 1. Data States
  const [organizations, setOrganizations] = useState<ExtracurricularOrganization[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  // 2. Modals state
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isDeleteMemberConfirmOpen, setIsDeleteMemberConfirmOpen] = useState(false);

  // 3. Form States
  const [schoolForm, setSchoolForm] = useState({
    name: "",
    picName: "",
    picEmail: "",
    picPhone: "",
    branch: "Yogyakarta",
    status: "active" as "active" | "inactive",
    mentorId: "",
    mouFileName: "",
    mouSignedDate: "2026-07-07"
  });

  const [memberForm, setMemberForm] = useState({
    name: "",
    grade: ""
  });
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Simulated Upload State
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Load from local storage
  useEffect(() => {
    setOrganizations(getStoredOrganizations());
    setMentors(getStoredMentors());
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Find target school
  const school = useMemo(() => {
    return organizations.find((o) => o.id === schoolId) || null;
  }, [organizations, schoolId]);

  // Sync edit school form when school data is retrieved
  useEffect(() => {
    if (school) {
      setSchoolForm({
        name: school.name,
        picName: school.picName,
        picEmail: school.picEmail,
        picPhone: school.picPhone,
        branch: school.branch,
        status: school.status,
        mentorId: school.mentorId,
        mouFileName: school.mouFileName || "",
        mouSignedDate: school.mouSignedDate || "2026-07-07"
      });
    }
  }, [school]);

  if (!school) {
    return (
      <div className="py-16 text-center text-xs text-zinc-400 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center gap-2">
        <Icons.AlertCircle className="w-8 h-8 text-rose-500" />
        <span>Sekolah / Organisasi Ekskul tidak ditemukan.</span>
        <button
          onClick={() => router.push("/extracurriculars-admin")}
          className="text-sakode-blue dark:text-sky-400 hover:underline mt-2 font-bold cursor-pointer flex items-center gap-1"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Ekskul
        </button>
      </div>
    );
  }

  // Toggle School Partnership status (Active / Inactive)
  const handleToggleSchoolStatus = () => {
    const nextStatus = school.status === "active" ? ("inactive" as const) : ("active" as const);
    const updated = organizations.map((o) =>
      o.id === school.id
        ? {
            ...o,
            status: nextStatus
          }
        : o
    );

    setOrganizations(updated);
    saveStoredOrganizations(updated);
    showToast(`Status ekskul diubah menjadi ${nextStatus === "active" ? "Aktif" : "Nonaktif"}.`);
  };

  // Simulate MoU Document file selection and upload progress
  const handleSimulateFileUpload = () => {
    const cleanSchoolName = school.name.replace(/\s+/g, "_");
    const targetName = `MoU_${cleanSchoolName}_Signed.pdf`;
    
    setUploadProgress(0);
    setFormError(null);

    // Simulate progress bar micro-animation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setSchoolForm((prev) => ({ ...prev, mouFileName: targetName }));
          // Save directly to school list
          const updated = organizations.map((o) =>
            o.id === school.id
              ? {
                  ...o,
                  mouFileName: targetName
                }
              : o
          );
          setOrganizations(updated);
          saveStoredOrganizations(updated);
          setUploadProgress(null);
          showToast("MoU Kerja Sama berhasil diunggah.");
        }, 300);
      }
    }, 150);
  };

  // Edit School details submit
  const handleEditSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolForm.name || !schoolForm.picName || !schoolForm.picEmail || !schoolForm.picPhone) {
      setFormError("Mohon lengkapi semua kolom wajib.");
      return;
    }

    const isDuplicate = organizations.some(
      (o) => o.id !== school.id && o.name.toLowerCase() === schoolForm.name.toLowerCase()
    );
    if (isDuplicate) {
      setFormError("Sekolah / Organisasi dengan nama ini sudah terdaftar.");
      return;
    }

    const mentor = mentors.find((m) => m.id === schoolForm.mentorId);
    if (!mentor) {
      setFormError("Mentor SAKODE tidak ditemukan.");
      return;
    }

    const updated = organizations.map((o) =>
      o.id === school.id
        ? {
            ...o,
            name: schoolForm.name,
            picName: schoolForm.picName,
            picEmail: schoolForm.picEmail,
            picPhone: schoolForm.picPhone,
            branch: schoolForm.branch,
            status: schoolForm.status,
            mentorId: mentor.id,
            mentorName: mentor.name,
            mouFileName: schoolForm.mouFileName,
            mouSignedDate: schoolForm.mouSignedDate
          }
        : o
    );

    setOrganizations(updated);
    saveStoredOrganizations(updated);
    setIsEditSchoolOpen(false);
    showToast("Rincian kemitraan sekolah berhasil disimpan.");
  };

  // Member Management: Add Member
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.grade) {
      setFormError("Nama dan Kelas wajib diisi.");
      return;
    }

    const newMember: ExtracurricularMember = {
      id: `MEM-${Math.floor(205 + Math.random() * 900)}`,
      name: memberForm.name,
      grade: memberForm.grade
    };

    const updated = organizations.map((o) =>
      o.id === school.id
        ? {
            ...o,
            members: [...(o.members || []), newMember]
          }
        : o
    );

    setOrganizations(updated);
    saveStoredOrganizations(updated);
    setIsAddMemberOpen(false);
    setMemberForm({ name: "", grade: "" });
    showToast(`Sukses menambahkan anggota ${memberForm.name} (${memberForm.grade}).`);
  };

  // Open Edit Member Modal
  const handleOpenEditMember = (member: ExtracurricularMember) => {
    setSelectedMemberId(member.id);
    setMemberForm({
      name: member.name,
      grade: member.grade
    });
    setFormError(null);
    setIsEditMemberOpen(true);
  };

  const handleEditMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    if (!memberForm.name || !memberForm.grade) {
      setFormError("Nama dan Kelas wajib diisi.");
      return;
    }

    const updated = organizations.map((o) => {
      if (o.id === school.id) {
        return {
          ...o,
          members: (o.members || []).map((m) =>
            m.id === selectedMemberId ? { ...m, name: memberForm.name, grade: memberForm.grade } : m
          )
        };
      }
      return o;
    });

    setOrganizations(updated);
    saveStoredOrganizations(updated);
    setIsEditMemberOpen(false);
    showToast("Profil anggota ekskul berhasil diperbarui.");
  };

  // Delete Member
  const handleOpenDeleteMemberConfirm = (member: ExtracurricularMember) => {
    setSelectedMemberId(member.id);
    setMemberForm({
      name: member.name,
      grade: member.grade
    });
    setIsDeleteMemberConfirmOpen(true);
  };

  const handleDeleteMemberSubmit = () => {
    if (!selectedMemberId) return;

    const updated = organizations.map((o) => {
      if (o.id === school.id) {
        return {
          ...o,
          members: (o.members || []).filter((m) => m.id !== selectedMemberId)
        };
      }
      return o;
    });

    setOrganizations(updated);
    saveStoredOrganizations(updated);
    setIsDeleteMemberConfirmOpen(false);
    showToast(`Anggota ${memberForm.name} dikeluarkan dari club ekskul.`);
  };

  // Dynamic style mappings
  const getSubElementClass = (type: "panel-card" | "card-item" | "divider" | "table-header") => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-5 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff]";
        if (type === "card-item")
          return "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white p-3.5 shadow-[2px_2px_0_#000]";
        if (type === "divider")
          return "h-0.5 bg-zinc-900 dark:bg-white my-4";
        if (type === "table-header")
          return "border-b-2 border-zinc-900 dark:border-zinc-700 bg-zinc-100 font-black text-zinc-900 uppercase p-3 text-xs";
        return "";

      case "claymorphism":
        if (type === "panel-card")
          return "bg-slate-50 dark:bg-zinc-900 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.05),_inset_4px_4px_8px_rgba(255,255,255,0.4),_3px_5px_15px_rgba(0,0,0,0.05)] border border-slate-200/40 dark:border-zinc-850 p-5 rounded-3xl";
        if (type === "card-item")
          return "bg-white/80 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3)] border border-zinc-200/40 p-3.5 rounded-2xl";
        if (type === "divider")
          return "h-px bg-zinc-200/60 dark:bg-zinc-800/40 my-4";
        if (type === "table-header")
          return "bg-slate-100 dark:bg-zinc-950 font-extrabold text-zinc-755 p-3 rounded-t-xl text-xs";
        return "";

      case "glassmorphism":
      case "liquid-glass":
        if (type === "panel-card")
          return "bg-white/15 dark:bg-zinc-900/35 border border-white/20 dark:border-zinc-800/50 backdrop-blur-md p-5 rounded-2xl shadow-xl";
        if (type === "card-item")
          return "bg-white/10 border border-white/15 p-3.5 rounded-xl";
        if (type === "divider")
          return "h-px bg-white/10 dark:bg-zinc-800/50 my-4";
        if (type === "table-header")
          return "bg-white/5 border-b border-white/10 font-bold p-3 text-xs";
        return "";

      case "minimalism":
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-none";
        if (type === "card-item")
          return "bg-white border border-zinc-200 p-3.5 rounded-none";
        if (type === "divider")
          return "h-px bg-zinc-200 dark:bg-zinc-800 my-4";
        if (type === "table-header")
          return "border-b border-zinc-250 font-extrabold p-3 text-xs";
        return "";

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "panel-card")
          return "bg-white dark:bg-zinc-900/60 border border-zinc-200/65 dark:border-zinc-800/80 p-5 rounded-3xl shadow-sm";
        if (type === "card-item")
          return "bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-805 p-3.5 rounded-2xl";
        if (type === "divider")
          return "h-px bg-zinc-200 dark:bg-zinc-800 my-4";
        if (type === "table-header")
          return "bg-zinc-50 dark:bg-zinc-950 font-extrabold text-zinc-600 dark:text-zinc-400 p-3 text-xs";
        return "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-left">
      
      {/* 1. Breadcrumbs Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-355 font-bold mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Ekskul</span>
            <span>/</span>
            <span>Detail Sekolah</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            Ekskul {school.name}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat data MoU kerja sama, pendamping ekskul, dan kelola daftar anggota aktif siswa beserta kelasnya.
          </p>
        </div>
        
        <UI.Button
          onClick={() => router.push("/extracurriculars-admin")}
          variant="secondary"
          accentColor={selectedColor}
          className="font-bold! text-xs! py-2.5! px-4! cursor-pointer flex items-center gap-1.5"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar
        </UI.Button>
      </div>

      {/* 2. Workspace Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: School Specs Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className={getSubElementClass("panel-card") + " space-y-5"}>
            
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-zinc-150 dark:border-zinc-800 pb-3.5">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Status Kemitraan</span>
                <span className="text-xs text-zinc-500 mt-1 block flex items-center gap-1">
                  <Icons.Compass className="w-3.5 h-3.5 text-zinc-400" />
                  Cabang {school.branch}
                </span>
              </div>
              
              <span
                onClick={handleToggleSchoolStatus}
                className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black cursor-pointer select-none transition-all ${
                  school.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                    : "bg-zinc-100 text-zinc-450 hover:bg-zinc-200"
                }`}
              >
                {school.status === "active" ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            {/* Guru Pendamping */}
            <div className="space-y-2">
              <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">
                Guru Pendamping (Principal):
              </span>
              <div className={getSubElementClass("card-item") + " flex flex-col gap-1.5 text-xs text-left"}>
                <span className="font-extrabold text-zinc-850 dark:text-white flex items-center gap-1">
                  <Icons.User className="w-3.5 h-3.5 text-zinc-400" />
                  {school.picName}
                </span>
                <span className="text-zinc-500 font-medium pl-4.5 block">
                  Email: {school.picEmail}
                </span>
                <span className="text-zinc-500 font-medium pl-4.5 block">
                  Telp: {school.picPhone}
                </span>
              </div>
            </div>

            {/* SAKODE Mentor */}
            <div className="space-y-2">
              <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">
                Mentor Pendamping SAKODE:
              </span>
              <div className="bg-blue-500/5 border border-blue-500/15 p-3 rounded-2xl flex items-center gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-sakode-blue dark:text-sky-400 font-bold text-sm shrink-0">
                  M
                </div>
                <div>
                  <span className="font-extrabold text-zinc-855 dark:text-zinc-200 block">
                    {school.mentorName}
                  </span>
                  <span className="text-[9.5px] text-zinc-400 font-semibold block flex items-center gap-0.5 mt-0.5">
                    <Icons.AcademicCap className="w-3 h-3 text-zinc-400" />
                    Mentor Ekskul ({school.mentorId})
                  </span>
                </div>
              </div>
            </div>

            {/* MoU Document & Upload Simulator */}
            <div className="space-y-2.5 text-xs text-left">
              <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">
                Dokumen MoU Kerja Sama:
              </span>

              {school.mouFileName ? (
                <div className="bg-zinc-50 dark:bg-zinc-950/20 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-250">
                    <Icons.BookOpen className="w-5 h-5 text-rose-500 shrink-0" />
                    <span className="font-bold truncate w-full" title={school.mouFileName}>
                      {school.mouFileName}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-450 border-t border-zinc-150/40 pt-2 mt-1">
                    <span>Tanggal MoU:</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">
                      {school.mouSignedDate || "N/A"}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-zinc-400 font-bold italic block pl-1">MoU Belum Diunggah</span>
              )}

              {/* Upload Dropzone Simulator */}
              <div
                onClick={handleSimulateFileUpload}
                className="border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-sakode-blue dark:hover:border-sky-400 bg-zinc-50/50 dark:bg-zinc-950/10 p-4 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
              >
                {uploadProgress !== null ? (
                  <div className="w-full space-y-1">
                    <Icons.Loader className="w-5 h-5 text-sakode-blue dark:text-sky-400 mx-auto animate-spin" />
                    <span className="text-[9px] font-bold text-zinc-400 block text-center">Mengunggah MoU... {uploadProgress}%</span>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-sakode-blue dark:bg-sky-400 h-full" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <Icons.Clock className="w-4 h-4 text-zinc-400" />
                    <span className="text-[11px] font-bold text-zinc-650 dark:text-zinc-300">Simulasikan Upload Ulang MoU</span>
                    <span className="text-[9px] text-zinc-450">Klik untuk mengganti PDF MoU</span>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-zinc-150 dark:border-zinc-850 pt-3 mt-4 flex gap-2">
              <UI.Button
                onClick={() => setIsEditSchoolOpen(true)}
                variant="primary"
                accentColor={selectedColor}
                className="flex-1 font-bold! text-xs! py-2! cursor-pointer shadow-3xs"
              >
                Ubah Detail Ekskul
              </UI.Button>
            </div>

          </div>
        </div>

        {/* Right Side: Manage Members Section (Kelola Anggota) */}
        <div className="lg:col-span-2">
          <div className={getSubElementClass("panel-card") + " space-y-4"}>
            
            <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Icons.User className="w-4 h-4" />
                Kelola Anggota Aktif ({school.members?.length || 0} Siswa)
              </h3>
              
              <UI.Button
                onClick={() => {
                  setMemberForm({ name: "", grade: "" });
                  setFormError(null);
                  setIsAddMemberOpen(true);
                }}
                variant="secondary"
                accentColor={selectedColor}
                className="font-bold! text-[11px]! py-1.5! px-3! cursor-pointer flex items-center gap-1"
              >
                <Icons.Plus className="w-3.5 h-3.5" />
                Tambah Anggota
              </UI.Button>
            </div>

            {/* Members table */}
            {school.members && school.members.length > 0 ? (
              <div className="overflow-x-auto border border-zinc-200/60 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/30">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className={getSubElementClass("table-header") + " text-left rounded-tl-2xl pl-4"}>No</th>
                      <th className={getSubElementClass("table-header") + " text-left"}>Nama Anggota</th>
                      <th className={getSubElementClass("table-header") + " text-left"}>Kelas</th>
                      <th className={getSubElementClass("table-header") + " text-center rounded-tr-2xl pr-4"}>Kelola</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850">
                    {school.members.map((member, idx) => (
                      <tr key={member.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/15 transition-colors text-left">
                        <td className="p-3 pl-4 font-mono text-zinc-405">{idx + 1}</td>
                        <td className="p-3 font-bold text-zinc-900 dark:text-white">
                          <span className="flex items-center gap-1">
                            <Icons.User className="w-3.5 h-3.5 text-zinc-450" />
                            {member.name}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-sakode-blue dark:text-sky-400">
                          {member.grade}
                        </td>
                        <td className="p-3 text-center pr-4">
                          <div className="flex gap-3 justify-center">
                            <button
                              onClick={() => handleOpenEditMember(member)}
                              className="text-zinc-500 hover:text-sakode-blue dark:hover:text-sky-400 font-bold text-[10.5px] cursor-pointer"
                            >
                              Ubah
                            </button>
                            <button
                              onClick={() => handleOpenDeleteMemberConfirm(member)}
                              className="text-zinc-450 hover:text-rose-600 font-bold text-[10.5px] cursor-pointer"
                            >
                              Keluarkan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-zinc-450 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center gap-1.5">
                <Icons.User className="w-8 h-8 text-zinc-300" />
                <span>Belum ada anggota yang terdaftar di club ekskul sekolah ini.</span>
                <span className="text-[10px] text-zinc-400 font-bold">Klik &ldquo;Tambah Anggota&rdquo; di atas untuk mendaftarkan siswa secara manual.</span>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* 3. EDIT SCHOOL MODAL */}
      <AnimatePresence>
        {isEditSchoolOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl relative my-8"
            >
              <UI.Card accentColor={selectedColor}>
                <div className="max-h-[85vh] overflow-y-auto pr-3 text-left">
                  <form onSubmit={handleEditSchoolSubmit} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <Icons.Compass className="w-4 h-4" />
                        Ubah Rincian Ekskul Sekolah
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEditSchoolOpen(false)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                        title="Tutup"
                      >
                        <Icons.X className="w-4 h-4" />
                      </button>
                    </div>

                    {formError && (
                      <UI.Alert title="Gagal Menyimpan" type="warning">
                        {formError}
                      </UI.Alert>
                    )}

                    {/* School name & branch selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="col-span-1 md:col-span-2">
                        <UI.Label>Nama Sekolah / Institusi</UI.Label>
                        <UI.Input
                          type="text"
                          value={schoolForm.name}
                          onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                          accentColor={selectedColor}
                          className="text-xs!"
                        />
                      </div>

                      <div>
                        <UI.Label>Cabang Pembimbing</UI.Label>
                        <UI.Select
                          value={schoolForm.branch}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSchoolForm({ ...schoolForm, branch: e.target.value })}
                          accentColor={selectedColor}
                          className="text-xs!"
                        >
                          <option value="Yogyakarta">Yogyakarta</option>
                          <option value="Jakarta Selatan">Jakarta Selatan</option>
                          <option value="Semarang">Semarang</option>
                          <option value="Surabaya">Surabaya</option>
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

                      <div className="col-span-1 md:col-span-2">
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

                    </div>

                    {/* Guru Pendamping details */}
                    <div className="border-t border-zinc-150 dark:border-zinc-800/80 pt-3 mt-1">
                      <span className="text-[10px] text-zinc-400 font-extrabold uppercase block mb-3">Akun Kepala Sekolah / Guru Pendamping</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                          <UI.Label>Nama Lengkap Guru</UI.Label>
                          <UI.Input
                            type="text"
                            value={schoolForm.picName}
                            onChange={(e) => setSchoolForm({ ...schoolForm, picName: e.target.value })}
                            accentColor={selectedColor}
                            className="text-xs!"
                          />
                        </div>
                        <div>
                          <UI.Label>Email Guru</UI.Label>
                          <UI.Input
                            type="email"
                            value={schoolForm.picEmail}
                            onChange={(e) => setSchoolForm({ ...schoolForm, picEmail: e.target.value })}
                            accentColor={selectedColor}
                            className="text-xs!"
                          />
                        </div>
                        <div>
                          <UI.Label>No WhatsApp Guru</UI.Label>
                          <UI.Input
                            type="text"
                            value={schoolForm.picPhone}
                            onChange={(e) => setSchoolForm({ ...schoolForm, picPhone: e.target.value })}
                            accentColor={selectedColor}
                            className="text-xs!"
                          />
                        </div>
                      </div>
                    </div>

                    {/* MoU Document Edit info */}
                    <div className="border-t border-zinc-150 dark:border-zinc-800/80 pt-3 mt-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <span className="text-[10px] text-zinc-400 font-extrabold uppercase block col-span-1 md:col-span-2">Dokumen Kerja Sama (MoU)</span>
                      <div>
                        <UI.Label>Nama File Dokumen MoU</UI.Label>
                        <UI.Input
                          type="text"
                          value={schoolForm.mouFileName}
                          onChange={(e) => setSchoolForm({ ...schoolForm, mouFileName: e.target.value })}
                          accentColor={selectedColor}
                          className="text-xs!"
                        />
                      </div>
                      <div>
                        <UI.Label>Tanggal Tanda Tangan</UI.Label>
                        <UI.Input
                          type="date"
                          value={schoolForm.mouSignedDate}
                          onChange={(e) => setSchoolForm({ ...schoolForm, mouSignedDate: e.target.value })}
                          accentColor={selectedColor}
                          className="text-xs!"
                        />
                      </div>
                    </div>

                    {/* Submit buttons */}
                    <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                      <UI.Button
                        type="button"
                        onClick={() => setIsEditSchoolOpen(false)}
                        variant="secondary"
                        accentColor={selectedColor}
                        className="text-xs! py-2! font-bold! cursor-pointer"
                      >
                        Batal
                      </UI.Button>
                      <UI.Button
                        type="submit"
                        variant="primary"
                        accentColor={selectedColor}
                        className="text-xs! py-2! px-5! font-bold! cursor-pointer"
                      >
                        Simpan Perubahan
                      </UI.Button>
                    </div>
                  </form>
                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. ADD MEMBER MODAL */}
      <AnimatePresence>
        {isAddMemberOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative my-8"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleAddMemberSubmit} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Icons.Plus className="w-4 h-4" />
                      Tambah Anggota Ekskul Baru
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddMemberOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                      title="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  {formError && (
                    <UI.Alert title="Gagal Menambahkan" type="warning">
                      {formError}
                    </UI.Alert>
                  )}

                  {/* Name and Grade fields */}
                  <div>
                    <UI.Label>Nama Lengkap Siswa</UI.Label>
                    <UI.Input
                      type="text"
                      placeholder="contoh: Dzulkifli Putra"
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      accentColor={selectedColor}
                      className="text-xs!"
                    />
                  </div>

                  <div>
                    <UI.Label>Kelas</UI.Label>
                    <UI.Input
                      type="text"
                      placeholder="contoh: XI RPL 1 atau X IPA 3"
                      value={memberForm.grade}
                      onChange={(e) => setMemberForm({ ...memberForm, grade: e.target.value })}
                      accentColor={selectedColor}
                      className="text-xs!"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                    <UI.Button
                      type="button"
                      onClick={() => setIsAddMemberOpen(false)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-bold! cursor-pointer"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! px-5! font-bold! cursor-pointer"
                    >
                      Simpan Anggota
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. EDIT MEMBER MODAL */}
      <AnimatePresence>
        {isEditMemberOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm relative my-8"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleEditMemberSubmit} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Icons.User className="w-4 h-4" />
                      Ubah Data Anggota Ekskul
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditMemberOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                      title="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  {formError && (
                    <UI.Alert title="Gagal Menyimpan" type="warning">
                      {formError}
                    </UI.Alert>
                  )}

                  {/* Name and Grade fields */}
                  <div>
                    <UI.Label>Nama Lengkap Siswa</UI.Label>
                    <UI.Input
                      type="text"
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      accentColor={selectedColor}
                      className="text-xs!"
                    />
                  </div>

                  <div>
                    <UI.Label>Kelas</UI.Label>
                    <UI.Input
                      type="text"
                      value={memberForm.grade}
                      onChange={(e) => setMemberForm({ ...memberForm, grade: e.target.value })}
                      accentColor={selectedColor}
                      className="text-xs!"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                    <UI.Button
                      type="button"
                      onClick={() => setIsEditMemberOpen(false)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-bold! cursor-pointer"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! px-5! font-bold! cursor-pointer"
                    >
                      Simpan Perubahan
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. DELETE MEMBER CONFIRMATION DIALOG */}
      <AnimatePresence>
        {isDeleteMemberConfirmOpen && (
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
                      Keluarkan Anggota Ekskul
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsDeleteMemberConfirmOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer"
                      title="Tutup"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-350 leading-normal block">
                      Apakah Anda yakin ingin mengeluarkan siswa <span className="font-extrabold text-zinc-900 dark:text-white">{memberForm.name} ({memberForm.grade})</span> dari bimbingan club ekskul {school.name}?
                    </span>
                    <span className="text-[10px] text-zinc-455 mt-2 block">
                      Tindakan ini akan membatalkan status aktif siswa pada sistem administrasi ekskul sekolah ini.
                    </span>
                  </div>

                  <div className="flex gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-3 mt-2 justify-end">
                    <UI.Button
                      onClick={() => setIsDeleteMemberConfirmOpen(false)}
                      variant="secondary"
                      accentColor={selectedColor}
                      className="text-xs! py-2! font-bold! cursor-pointer"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      onClick={handleDeleteMemberSubmit}
                      variant="primary"
                      accentColor="red"
                      className="text-xs! py-2! px-5! font-bold! cursor-pointer bg-rose-600! hover:bg-rose-700!"
                    >
                      Ya, Keluarkan
                    </UI.Button>
                  </div>
                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
