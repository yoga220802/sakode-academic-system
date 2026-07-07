"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { DataStateBoundary } from "@/app/_components/DataStateBoundary";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass } from "@/UI/shared/color-utils";
import { ProgramViewModel, ModuleViewModel } from "@/app/_types/program";
import { ProgramMockService } from "../_services/program-mock";

// Inline SVGs for missing icons
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4.5 h-4.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
  </svg>
);

const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
  </svg>
);

export default function ProgramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  // Page State
  const [program, setProgram] = useState<ProgramViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals Visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states & validation errors
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    price: string;
    currency: string;
    status: "draft" | "published";
    isFeatured: boolean;
    modules: Omit<ModuleViewModel, "id">[];
  }>({
    name: "",
    slug: "",
    description: "",
    price: "",
    currency: "IDR",
    status: "draft",
    isFeatured: false,
    modules: [],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch specific program data
  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) setIsLoading(true);
    });
    ProgramMockService.getProgramById(id)
      .then((data) => {
        if (isMounted) {
          if (data) {
            setProgram(data);
            setIsError(false);
          } else {
            setProgram(null);
            setIsError(false);
          }
        }
      })
      .catch((err) => {
        console.error("Gagal memuat detail program", err);
        if (isMounted) {
          setIsError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Toast dismiss timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Format currency helpers
  const formatPrice = (price: number | null, currency: string) => {
    if (price === null || price === undefined) return "Harga belum ditentukan";
    if (currency === "IDR") {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
  };

  // Form input validation logic
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Nama program wajib diisi.";
    }

    if (!formData.slug.trim()) {
      errors.slug = "Public slug wajib diisi.";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).";
    }

    // Price validation
    const parsedPrice = parseFloat(formData.price);
    if (formData.status === "published") {
      if (formData.price === "" || isNaN(parsedPrice)) {
        errors.price = "Harga publik wajib ditentukan untuk program yang dipublikasikan (Published).";
      } else if (parsedPrice < 0) {
        errors.price = "Harga tidak boleh bernilai negatif.";
      }
    } else {
      if (formData.price !== "" && (isNaN(parsedPrice) || parsedPrice < 0)) {
        errors.price = "Harga harus berupa angka positif.";
      }
    }

    // Modules validation
    formData.modules.forEach((mod, idx) => {
      if (!mod.title.trim()) {
        errors[`module-${idx}-title`] = "Judul modul wajib diisi.";
      }
      if (mod.durationHours <= 0 || isNaN(mod.durationHours)) {
        errors[`module-${idx}-duration`] = "Durasi jam harus > 0.";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open edit modal
  const openEditModal = () => {
    if (!program) return;
    setFormData({
      name: program.name,
      slug: program.slug,
      description: program.description,
      price: program.price !== null ? program.price.toString() : "",
      currency: program.currency,
      status: program.status,
      isFeatured: program.isFeatured,
      modules: program.modules
        .sort((a, b) => a.order - b.order)
        .map((m) => ({
          title: m.title,
          description: m.description,
          durationHours: m.durationHours,
          order: m.order,
        })),
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Handle Edit Submission
  const handleEditProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;

    if (!validateForm()) {
      setToast({ type: "error", message: "Formulir gagal divalidasi. Periksa kolom yang salah." });
      return;
    }

    setIsActionLoading(true);
    const updatedModules: ModuleViewModel[] = formData.modules.map((m, idx) => ({
      id: program.modules[idx]?.id || `MOD-NEW-${idx + 1}`,
      title: m.title,
      description: m.description,
      durationHours: Number(m.durationHours),
      order: idx + 1,
    }));

    const updatedProgram: ProgramViewModel = {
      ...program,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: formData.price !== "" ? parseFloat(formData.price) : null,
      currency: formData.currency,
      status: formData.status,
      isFeatured: formData.isFeatured,
      modules: updatedModules,
    };

    await ProgramMockService.saveProgram(updatedProgram);
    setProgram(updatedProgram);
    setIsEditModalOpen(false);
    setIsActionLoading(false);
    setToast({ type: "success", message: `Detail program "${formData.name}" berhasil diperbarui.` });
  };

  // Handle Delete Submission
  const handleDeleteProgram = async () => {
    if (!program) return;
    setIsActionLoading(true);
    await ProgramMockService.deleteProgram(program.id);
    setIsActionLoading(false);
    setIsDeleteConfirmOpen(false);
    router.push("/programs");
  };

  // Dedicated Module Editor Modal State
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleViewModel | null>(null); // if null, we are adding
  const [moduleFormData, setModuleFormData] = useState({
    title: "",
    description: "",
    durationHours: ""
  });
  const [moduleFormErrors, setModuleFormErrors] = useState<Record<string, string>>({});

  // Toast feedback statement Helpers
  const openAddModuleModal = () => {
    setEditingModule(null);
    setModuleFormData({
      title: "",
      description: "",
      durationHours: ""
    });
    setModuleFormErrors({});
    setIsModuleModalOpen(true);
  };

  const openEditModuleModal = (mod: ModuleViewModel) => {
    setEditingModule(mod);
    setModuleFormData({
      title: mod.title,
      description: mod.description,
      durationHours: mod.durationHours.toString()
    });
    setModuleFormErrors({});
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;

    const errors: Record<string, string> = {};
    if (!moduleFormData.title.trim()) errors.title = "Judul modul wajib diisi.";
    const duration = Number(moduleFormData.durationHours);
    if (!moduleFormData.durationHours || isNaN(duration) || duration <= 0) {
      errors.duration = "Durasi jam belajar harus angka positif (> 0).";
    }

    if (Object.keys(errors).length > 0) {
      setModuleFormErrors(errors);
      return;
    }

    setIsActionLoading(true);
    let updatedModules: ModuleViewModel[];

    if (editingModule) {
      updatedModules = program.modules.map(m => 
        m.id === editingModule.id 
          ? { ...m, title: moduleFormData.title, description: moduleFormData.description, durationHours: duration }
          : m
      );
    } else {
      const newId = `MOD-${program.id.split("-")[1]}-${Date.now().toString().slice(-4)}`;
      const newModule: ModuleViewModel = {
        id: newId,
        title: moduleFormData.title,
        description: moduleFormData.description,
        durationHours: duration,
        order: program.modules.length + 1
      };
      updatedModules = [...program.modules, newModule];
    }

    const updatedProgram: ProgramViewModel = {
      ...program,
      modules: updatedModules.map((m, idx) => ({ ...m, order: idx + 1 }))
    };

    await ProgramMockService.saveProgram(updatedProgram);
    setProgram(updatedProgram);
    setIsModuleModalOpen(false);
    setIsActionLoading(false);
    setToast({
      type: "success",
      message: editingModule 
        ? `Modul "${moduleFormData.title}" berhasil diubah.` 
        : `Modul "${moduleFormData.title}" berhasil ditambahkan.`
    });
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!program) return;
    const targetModule = program.modules.find(m => m.id === moduleId);
    if (!targetModule) return;

    setIsActionLoading(true);
    const updatedModules = program.modules
      .filter(m => m.id !== moduleId)
      .map((m, idx) => ({ ...m, order: idx + 1 }));

    const updatedProgram: ProgramViewModel = {
      ...program,
      modules: updatedModules
    };

    await ProgramMockService.saveProgram(updatedProgram);
    setProgram(updatedProgram);
    setIsActionLoading(false);
    setToast({
      type: "success",
      message: `Modul "${targetModule.title}" berhasil dihapus.`
    });
  };

  // Modules form inline editing
  const addModuleToForm = () => {
    const nextOrder = formData.modules.length + 1;
    setFormData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: `Modul ${nextOrder}: Materi Baru`,
          description: "Deskripsi modul belajar baru.",
          durationHours: 6,
          order: nextOrder,
        },
      ],
    }));
  };

  const removeModuleFromForm = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== idx).map((m, newIdx) => ({ ...m, order: newIdx + 1 })),
    }));
  };

  const moveModuleOrder = (idx: number, direction: "up" | "down") => {
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === formData.modules.length - 1) return;

    const updated = [...formData.modules];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    const sorted = updated.map((m, i) => ({ ...m, order: i + 1 }));

    setFormData((prev) => ({
      ...prev,
      modules: sorted,
    }));
  };

  // Styling helpers
  const getSubElementClass = (type: "badge-draft" | "badge-published" | "btn-icon" | "panel-card") => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "panel-card") return "bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-white p-6 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff]";
        if (type === "badge-draft") return "bg-amber-100 text-amber-900 border-2 border-zinc-900 font-bold px-2 py-0.5";
        if (type === "badge-published") return "bg-emerald-100 text-emerald-900 border-2 border-zinc-900 font-bold px-2 py-0.5";
        return "p-1.5 border-2 border-zinc-900 dark:border-white hover:bg-zinc-150 dark:hover:bg-zinc-800 transition-colors";

      case "claymorphism":
        if (type === "panel-card") return "bg-slate-50 dark:bg-zinc-900 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.05),_inset_4px_4px_8px_rgba(255,255,255,0.4),_3px_5px_15px_rgba(0,0,0,0.05)] border border-slate-200/40 dark:border-zinc-850 p-6 rounded-3xl";
        if (type === "badge-draft") return "bg-amber-500/10 text-amber-600 rounded-lg px-2.5 py-0.5 border border-amber-500/15";
        if (type === "badge-published") return "bg-emerald-500/10 text-emerald-600 rounded-lg px-2.5 py-0.5 border border-emerald-500/15";
        return "p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:scale-[1.05] active:scale-[0.95] transition-all";

      case "glassmorphism":
      case "liquid-glass":
        if (type === "panel-card") return "bg-white/15 dark:bg-zinc-950/35 border border-white/20 dark:border-zinc-850 backdrop-blur-md p-6 rounded-2xl shadow-xl";
        if (type === "badge-draft") return "bg-amber-400/15 text-amber-300 rounded-full px-3 py-0.5 text-[9px] border border-amber-400/20";
        if (type === "badge-published") return "bg-sky-400/15 text-sky-300 rounded-full px-3 py-0.5 text-[9px] border border-sky-400/20";
        return "p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors";

      case "minimalism":
        if (type === "panel-card") return "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-6 rounded-none";
        if (type === "badge-draft") return "bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 text-[9px] rounded-none";
        if (type === "badge-published") return "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-2 py-0.5 border border-zinc-900 dark:border-zinc-100 text-[9px] rounded-none";
        return "p-1.5 rounded-none bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-205 dark:hover:bg-zinc-750 transition-colors";

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "panel-card") return "bg-white dark:bg-zinc-950/80 border border-zinc-200/65 dark:border-zinc-850 p-6 rounded-3xl shadow-sm";
        if (type === "badge-draft") return "bg-amber-500/10 text-amber-705 dark:text-amber-400 rounded-full px-2.5 py-0.5 border border-amber-500/10";
        if (type === "badge-published") return "bg-emerald-500/10 text-emerald-705 dark:text-emerald-400 rounded-full px-2.5 py-0.5 border border-emerald-500/10";
        return "p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-colors";
    }
  };

  const getPublicCardClass = () => {
    switch (selectedStyle) {
      case "neobrutalism":
        return "max-w-sm mx-auto overflow-hidden bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-white rounded-none shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] text-left transition-all";
      case "claymorphism":
        return "max-w-sm mx-auto overflow-hidden bg-white/80 dark:bg-zinc-905 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_-2px_-2px_4px_rgba(0,0,0,0.03),_2px_2px_6px_rgba(0,0,0,0.05)] text-left transition-all";
      case "glassmorphism":
      case "liquid-glass":
        return "max-w-sm mx-auto overflow-hidden bg-white/10 dark:bg-zinc-950/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 rounded-xl text-left transition-all";
      case "minimalism":
        return "max-w-sm mx-auto overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none text-left transition-all";
      case "bento-grid":
      case "sakode-modern":
      default:
        return "max-w-sm mx-auto overflow-hidden bg-white dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl shadow-3xs text-left transition-all";
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className={`p-4 rounded-xl shadow-lg border flex items-start gap-3.5 ${
              toast.type === "success" 
                ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-100" 
                : "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-100"
            }`}>
              {toast.type === "success" ? (
                <Icons.Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Icons.AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="text-xs font-semibold leading-normal">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to List Navigation */}
      <div>
        <Link
          href="/programs"
          className={`inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors hover:underline`}
        >
          <Icons.ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Program
        </Link>
      </div>

      <DataStateBoundary
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !program}
        emptyTitle="Program Tidak Ditemukan"
        emptyDescription="Program yang Anda cari tidak tersedia atau sudah dihapus."
        emptyIcon="BookOpen"
        loadingVariant="card"
      >
        {program && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT AREA: Program Metadata & Curriculum Outline (7 columns) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Core Details Panel */}
              <div className={getSubElementClass("panel-card")}>
                
                {/* Title block */}
                <div className="flex justify-between items-start gap-4 border-b border-zinc-150 dark:border-zinc-800 pb-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${getSubElementClass(program.status === "published" ? "badge-published" : "badge-draft")}`}>
                        {program.status === "published" ? "Published (Tampil Publik)" : "Draft (Konsep)"}
                      </span>
                      
                      {program.isFeatured && (
                        <span className="bg-yellow-500/10 text-yellow-750 dark:text-yellow-405 border border-yellow-500/15 rounded-full px-2.5 py-0.5 text-[9px] font-bold flex items-center gap-1">
                          <Icons.Star className="w-3 h-3" />
                          Program Unggulan
                        </span>
                      )}
                    </div>

                    <h3 className="text-base md:text-xl font-black text-zinc-900 dark:text-white leading-tight">
                      {program.name}
                    </h3>

                    <span className="inline-block bg-zinc-100 dark:bg-zinc-850 px-2 py-0.5 rounded text-[10.5px] font-mono text-zinc-550 dark:text-zinc-400 mt-2">
                      Public Slug: /programs?program={program.slug}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={openEditModal}
                      className={getSubElementClass("btn-icon")}
                      title="Edit Program"
                    >
                      <EditIcon className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                    </button>
                    <button
                      onClick={() => setIsDeleteConfirmOpen(true)}
                      className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500/20 hover:scale-[1.05] active:scale-[0.95] transition-all cursor-pointer"
                      title="Hapus Program"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pricing & outline statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-5">
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-200/35 dark:border-zinc-800/40">
                    <span className="text-[10px] text-zinc-400 font-bold block mb-1">INVESTASI KATALOG</span>
                    <span className="text-sm font-black text-zinc-850 dark:text-zinc-100">
                      {formatPrice(program.price, program.currency)}
                    </span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-200/35 dark:border-zinc-800/40">
                    <span className="text-[10px] text-zinc-400 font-bold block mb-1">RENCANA KURIKULUM</span>
                    <span className="text-sm font-black text-zinc-850 dark:text-zinc-100">
                      {program.modules.length} Bab Pembelajaran
                    </span>
                  </div>
                </div>

                {/* Validation alert banner for missing price */}
                {program.price === null && (
                  <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-2xl text-[10.5px] text-rose-600 dark:text-rose-455 font-semibold mb-5 leading-normal flex items-start gap-2.5">
                    <Icons.AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <div>
                      <span className="font-extrabold block">Peringatan Validasi: Harga Tidak Ditentukan!</span>
                      Program ini diatur ke status aktif tetapi tidak memiliki harga publik. Calon siswa tidak akan bisa menyelesaikan registrasi paket IT ini sampai harga valid (non-kosong) diisi.
                    </div>
                  </div>
                )}

                {/* Description Outcome */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Deskripsi Detail Program</span>
                  <p className="text-zinc-650 dark:text-zinc-300 leading-relaxed font-semibold">
                    {program.description}
                  </p>
                </div>
              </div>

              {/* Modules Timeline Outline */}
              <div className={getSubElementClass("panel-card")}>
                <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-3 mb-4">
                  <h4 className="text-[10.5px] font-black text-zinc-400 dark:text-zinc-455 uppercase tracking-wider">
                    Kurikulum & Outline Bab Pembelajaran
                  </h4>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={openAddModuleModal}
                      className={`text-[10px] font-bold ${getTextClass(selectedColor)} hover:underline flex items-center gap-0.5 cursor-pointer`}
                    >
                      <Icons.Plus className="w-3.5 h-3.5" />
                      Tambah Modul
                    </button>
                    <span className="text-[10px] font-bold text-sakode-blue dark:text-sky-400 font-mono">
                      Total: {program.modules.reduce((acc, m) => acc + m.durationHours, 0)} Jam
                    </span>
                  </div>
                </div>

                {program.modules.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-400 font-medium">
                    Program ini belum memiliki rencana modul belajar.
                  </div>
                ) : (
                  <div className="relative border-l border-zinc-200 dark:border-zinc-800/80 pl-5.5 space-y-5 text-xs">
                    {program.modules
                      .sort((a, b) => a.order - b.order)
                      .map((mod, idx) => (
                        <div key={mod.id} className="relative">
                          <span className="absolute -left-[30px] top-0.5 w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-850 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 text-[9px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h5 className="font-extrabold text-zinc-900 dark:text-white leading-tight">
                                {mod.title}
                              </h5>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => openEditModuleModal(mod)}
                                  className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-sky-500/10 border border-blue-500/15 dark:border-sky-500/20 text-blue-600 dark:text-sky-400 hover:bg-blue-500/20 dark:hover:bg-sky-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                  title="Ubah Modul"
                                >
                                  <EditIcon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteModule(mod.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/15 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 dark:hover:bg-rose-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                  title="Hapus Modul"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[9.5px] font-bold text-zinc-450 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded">
                                  {mod.durationHours} Jam
                                </span>
                              </div>
                            </div>
                            <p className="text-zinc-550 dark:text-zinc-400 mt-1 leading-normal font-semibold">
                              {mod.description}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT AREA: Public Landing Card Preview Simulation (5 columns) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className={getSubElementClass("panel-card")}>
                <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-450 uppercase tracking-wider mb-4 border-b border-zinc-150 dark:border-zinc-800 pb-2.5">
                  Pratinjau Tampilan Kartu Katalog Publik
                </h4>

                <div className={getPublicCardClass()}>
                  <div className="p-5 flex flex-col gap-4">
                    
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-sakode-blue dark:text-sky-400 font-mono">
                        SAKODE ACADEMY
                      </span>
                      {program.isFeatured && (
                        <span className="bg-yellow-500/10 text-yellow-750 dark:text-yellow-405 border border-yellow-500/15 rounded-full px-2 py-0.5">
                          Unggulan 🔥
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-black text-base text-zinc-900 dark:text-white leading-snug">
                        {program.name}
                      </h4>
                      <p className="text-[10.5px] text-zinc-400 font-mono mt-1">
                        /{program.slug}
                      </p>
                    </div>

                    <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-semibold">
                      {program.description}
                    </p>

                    <div className="bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-200/35 dark:border-zinc-800/40 flex justify-between items-center text-[11px] font-bold text-zinc-550 dark:text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <Icons.BookOpen className="w-4 h-4 text-sakode-blue dark:text-sky-400" />
                        {program.modules.length} Rencana Modul
                      </span>
                      <span>
                        {program.modules.reduce((acc, m) => acc + m.durationHours, 0)} Jam Mentoring
                      </span>
                    </div>

                    <div className="border-t border-dashed border-zinc-150 dark:border-zinc-800 pt-4 mt-1 flex flex-col gap-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[9.5px] text-zinc-400 font-bold uppercase tracking-wider">Investasi Belajar:</span>
                        <span className="text-base font-black text-zinc-900 dark:text-white">
                          {program.price !== null ? formatPrice(program.price, program.currency) : "Hubungi Admin"}
                        </span>
                      </div>

                      <a
                        href={`/register/enroll?program=${program.slug}`}
                        onClick={(e) => e.preventDefault()}
                        className={`w-full py-2.5 rounded-xl text-center text-xs font-black select-none ${
                          program.price === null && program.status === "published"
                            ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                            : getBgClass(selectedColor) + " text-white hover:opacity-90 transition-opacity"
                        }`}
                      >
                        Daftar Sekarang & Mulai Belajar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DataStateBoundary>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl relative my-8"
            >
              <UI.Card accentColor={selectedColor} className="max-h-[85vh] overflow-y-auto pr-1">
                <form onSubmit={handleEditProgram} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-205 flex items-center gap-1.5">
                      <EditIcon className="w-4.5 h-4.5" />
                      Ubah Rincian Program IT
                    </h3>
                    <button
                    title="Tutup Formulir"
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <UI.Label>Nama Program Bootcamp</UI.Label>
                      <UI.Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        accentColor={selectedColor}
                        hasError={!!formErrors.name}
                        className="text-xs!"
                      />
                      {formErrors.name && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1 leading-normal">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <UI.Label>Public Slug (URL-Safe)</UI.Label>
                      <UI.Input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                        accentColor={selectedColor}
                        hasError={!!formErrors.slug}
                        className="text-xs!"
                      />
                      {formErrors.slug ? (
                        <p className="text-[10px] text-rose-500 font-bold mt-1 leading-normal">{formErrors.slug}</p>
                      ) : (
                        <p className="text-[9px] text-zinc-400 font-semibold mt-1">
                          Akan diakses di /programs?program={formData.slug}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <UI.Label>Deskripsi Hasil Belajar (Outcome)</UI.Label>
                    <textarea
                    placeholder="contoh: Siswa akan mampu membangun aplikasi web full-stack menggunakan React, Node.js, dan MongoDB."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full text-xs min-h-20 bg-zinc-55 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-sakode-blue focus:outline-hidden transition-all text-zinc-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                    <div>
                      <UI.Label>Harga Katalog</UI.Label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: 3500000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        accentColor={selectedColor}
                        hasError={!!formErrors.price}
                        className="text-xs!"
                      />
                      {formErrors.price && (
                        <p className="text-[9.5px] text-rose-505 font-bold mt-1 leading-tight">{formErrors.price}</p>
                      )}
                    </div>
                    <div>
                      <UI.Label>Mata Uang</UI.Label>
                      <div className="relative">
                        <UI.Select
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          accentColor={selectedColor}
                          className="text-xs! py-2.5! pr-8! pl-3!"
                        >
                          <option value="IDR">Rupiah (IDR)</option>
                          <option value="USD">Dolar AS (USD)</option>
                        </UI.Select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                          <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <UI.Label>Status Publikasi</UI.Label>
                      <div className="relative">
                        <UI.Select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                          accentColor={selectedColor}
                          className="text-xs! py-2.5! pr-8! pl-3!"
                        >
                          <option value="draft">Draft (Konsep)</option>
                          <option value="published">Published (Aktif)</option>
                        </UI.Select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                          <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-2xl border border-zinc-200/35 dark:border-zinc-800/40">
                    <UI.Toggle
                      checked={formData.isFeatured}
                      onChange={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                      accentColor={selectedColor}
                      aria-label="Tampilkan sebagai program unggulan"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Rekomendasikan Program</span>
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-550 font-semibold leading-normal">Tampilkan label &ldquo;Unggulan&rdquo; pada katalog landing page untuk menarik perhatian calon murid.</span>
                    </div>
                  </div>

                  <div className="border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                        Rencana Bab & Outline Modul Belajar
                      </h4>
                      <button
                        type="button"
                        onClick={addModuleToForm}
                        className={`text-[10px] font-bold ${getTextClass(selectedColor)} hover:underline flex items-center gap-0.5 cursor-pointer`}
                      >
                        <Icons.Plus className="w-3.5 h-3.5" />
                        Tambah Modul
                      </button>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {formData.modules.length === 0 ? (
                        <div className="py-6 border border-dashed border-zinc-200 dark:border-zinc-800 text-center rounded-2xl text-[10.5px] text-zinc-400 font-medium">
                          Modul belum ditambahkan. Klik tambah modul untuk menyusun kurikulum.
                        </div>
                      ) : (
                        formData.modules.map((mod, idx) => (
                          <div key={idx} className="bg-zinc-50/50 dark:bg-zinc-900/30 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-2.5">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[10px] font-bold text-zinc-400 font-mono">
                                Modul #{idx + 1}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => moveModuleOrder(idx, "up")}
                                  disabled={idx === 0}
                                  className={getSubElementClass("btn-icon") + " p-1! cursor-pointer disabled:opacity-30"}
                                  title="Pindahkan ke atas"
                                >
                                  <ArrowUpIcon />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveModuleOrder(idx, "down")}
                                  disabled={idx === formData.modules.length - 1}
                                  className={getSubElementClass("btn-icon") + " p-1! cursor-pointer disabled:opacity-30"}
                                  title="Pindahkan ke bawah"
                                >
                                  <ArrowDownIcon />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeModuleFromForm(idx)}
                                  className="p-1 rounded bg-rose-500/10 border border-rose-500/25 text-rose-600 hover:bg-rose-500/20 cursor-pointer"
                                  title="Hapus Modul"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                              <div className="sm:col-span-8">
                                <UI.Input
                                  type="text"
                                  value={mod.title}
                                  onChange={(e) => {
                                    const nextMods = [...formData.modules];
                                    nextMods[idx].title = e.target.value;
                                    setFormData({ ...formData, modules: nextMods });
                                  }}
                                  accentColor={selectedColor}
                                  hasError={!!formErrors[`module-${idx}-title`]}
                                  className="text-xs! py-2! px-3!"
                                />
                                {formErrors[`module-${idx}-title`] && (
                                  <p className="text-[9.5px] text-rose-505 font-bold mt-1 leading-none">{formErrors[`module-${idx}-title`]}</p>
                                )}
                              </div>
                              <div className="sm:col-span-4">
                                <UI.Input
                                  type="number"
                                  value={mod.durationHours === 0 ? "" : mod.durationHours}
                                  onChange={(e) => {
                                    const nextMods = [...formData.modules];
                                    nextMods[idx].durationHours = Number(e.target.value);
                                    setFormData({ ...formData, modules: nextMods });
                                  }}
                                  accentColor={selectedColor}
                                  hasError={!!formErrors[`module-${idx}-duration`]}
                                  className="text-xs! py-2! px-3!"
                                />
                                {formErrors[`module-${idx}-duration`] && (
                                  <p className="text-[9.5px] text-rose-505 font-bold mt-1 leading-none">{formErrors[`module-${idx}-duration`]}</p>
                                )}
                              </div>
                            </div>

                            <div>
                              <UI.Input
                                type="text"
                                placeholder="Deskripsi ringkas capaian modul belajar..."
                                value={mod.description}
                                onChange={(e) => {
                                  const nextMods = [...formData.modules];
                                  nextMods[idx].description = e.target.value;
                                  setFormData({ ...formData, modules: nextMods });
                                }}
                                accentColor={selectedColor}
                                className="text-xs! py-2! px-3!"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end border-t border-zinc-150 dark:border-zinc-800 pt-4 mt-1">
                    <UI.Button
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => setIsEditModalOpen(false)}
                      disabled={isActionLoading}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor={selectedColor}
                      isLoading={isActionLoading}
                      className="text-xs! py-2! font-semibold! cursor-pointer"
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

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <UI.Card accentColor={selectedColor}>
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-2 text-rose-500 border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <Icons.AlertCircle className="w-5 h-5 shrink-0" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wide">
                      Hapus Program IT?
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold leading-relaxed">
                    Apakah Anda yakin ingin menghapus program belajar <strong className="text-zinc-800 dark:text-white">&ldquo;{program?.name}&rdquo;</strong>? 
                    Semua rincian modul belajar yang tersusun di dalamnya akan terhapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                  </p>

                  <div className="flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                    <UI.Button
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      disabled={isActionLoading}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      variant="primary"
                      accentColor="red"
                      onClick={handleDeleteProgram}
                      isLoading={isActionLoading}
                      className="text-xs! py-2! font-semibold! bg-rose-650! hover:bg-rose-700! text-white! cursor-pointer"
                    >
                      Hapus Permanen
                    </UI.Button>
                  </div>
                </div>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEDICATED MODULE EDITOR MODAL */}
      <AnimatePresence>
        {isModuleModalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md relative"
            >
              <UI.Card accentColor={selectedColor}>
                <form onSubmit={handleSaveModule} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-205 flex items-center gap-1.5">
                      {editingModule ? (
                        <>
                          <EditIcon className="w-4 h-4" />
                          Ubah Bab Modul Belajar
                        </>
                      ) : (
                        <>
                          <Icons.Plus className="w-4 h-4" />
                          Tambah Bab Modul Baru
                        </>
                      )}
                    </h3>
                    <button
                    title="Tutup"
                      type="button"
                      onClick={() => setIsModuleModalOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  <div>
                    <UI.Label>Judul Bab / Modul</UI.Label>
                    <UI.Input
                      type="text"
                      placeholder="contoh: Routing & Layouting Next.js"
                      value={moduleFormData.title}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                      accentColor={selectedColor}
                      hasError={!!moduleFormErrors.title}
                      className="text-xs!"
                    />
                    {moduleFormErrors.title && (
                      <p className="text-[10px] text-rose-500 font-bold mt-1">{moduleFormErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <UI.Label>Durasi Belajar (Jam Mentoring)</UI.Label>
                    <UI.Input
                      type="number"
                      placeholder="contoh: 8"
                      value={moduleFormData.durationHours}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, durationHours: e.target.value })}
                      accentColor={selectedColor}
                      hasError={!!moduleFormErrors.duration}
                      className="text-xs!"
                    />
                    {moduleFormErrors.duration && (
                      <p className="text-[10px] text-rose-500 font-bold mt-1">{moduleFormErrors.duration}</p>
                    )}
                  </div>

                  <div>
                    <UI.Label>Deskripsi Ringkas / Capaian Materi</UI.Label>
                    <textarea
                      placeholder="contoh: Memahami cara kerja routing dinamis Next.js, static layouting, dan error handling..."
                      value={moduleFormData.description}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                      className="w-full text-xs min-h-20 bg-zinc-55 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl py-2 px-3 focus:ring-2 focus:ring-sakode-blue focus:outline-hidden transition-all text-zinc-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-2.5 justify-end border-t border-zinc-150 dark:border-zinc-800 pt-4 mt-1">
                    <UI.Button
                      variant="secondary"
                      accentColor={selectedColor}
                      onClick={() => setIsModuleModalOpen(false)}
                      disabled={isActionLoading}
                      className="text-xs! py-2! font-semibold!"
                    >
                      Batal
                    </UI.Button>
                    <UI.Button
                      type="submit"
                      variant="primary"
                      accentColor={selectedColor}
                      isLoading={isActionLoading}
                      className="text-xs! py-2! font-semibold! cursor-pointer"
                    >
                      {editingModule ? "Simpan Perubahan" : "Tambah Modul"}
                    </UI.Button>
                  </div>
                </form>
              </UI.Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
