"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { DataStateBoundary } from "@/app/_components/DataStateBoundary";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass } from "@/UI/shared/color-utils";
import { ProgramViewModel, ModuleViewModel } from "@/app/_types/program";
import { ProgramMockService } from "@/app/_data/program-mock";

// Inline SVGs for missing icons
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

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export default function ProgramsPage() {
  const router = useRouter();
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  // Simulation scenario control states
  const [simulationState, setSimulationState] = useState<"default" | "loading" | "empty" | "error">("default");
  
  // Real UI list & selection states
  const [programs, setPrograms] = useState<ProgramViewModel[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    hasGroupOption: boolean;
    minGroupSize: string;
    maxGroupSize: string;
    pricePerParticipant: string;
    trialPrice: string;
  }>({
    name: "",
    slug: "",
    description: "",
    price: "",
    currency: "IDR",
    status: "draft",
    isFeatured: false,
    modules: [],
    hasGroupOption: false,
    minGroupSize: "2",
    maxGroupSize: "5",
    pricePerParticipant: "250000",
    trialPrice: "150000",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Load programs mock data
  useEffect(() => {
    let isMounted = true;
    ProgramMockService.getPrograms().then((data) => {
      if (isMounted) {
        setPrograms(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync selection based on empty scenario or filtered changes
  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format currency helper
  const formatPrice = (price: number | null, currency: string) => {
    if (price === null || price === undefined) return "Harga belum ditentukan";
    if (currency === "IDR") {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
  };

  // Toast auto-dismissal
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  // Open create form
  const openAddModal = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      currency: "IDR",
      status: "draft",
      isFeatured: false,
      modules: [
        { title: "Modul 1: Pengenalan", description: "Pengenalan materi dasar dan setup tools.", durationHours: 4, order: 1 }
      ],
      hasGroupOption: false,
      minGroupSize: "2",
      maxGroupSize: "5",
      pricePerParticipant: "250000",
      trialPrice: "150000",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Handle Add Program Submission
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({ type: "error", message: "Formulir gagal divalidasi. Periksa kolom yang salah." });
      return;
    }

    setIsActionLoading(true);
    const newId = `PRG-${Math.floor(100 + Math.random() * 900)}`;
    const programModules: ModuleViewModel[] = formData.modules.map((m, idx) => ({
      id: `MOD-${newId.split("-")[1]}-${idx + 1}`,
      title: m.title,
      description: m.description,
      durationHours: Number(m.durationHours),
      order: idx + 1,
    }));

    const newProgram: ProgramViewModel = {
      id: newId,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: formData.price !== "" ? parseFloat(formData.price) : null,
      currency: formData.currency,
      status: formData.status,
      isFeatured: formData.isFeatured,
      modules: programModules,
      hasGroupOption: formData.hasGroupOption,
      minGroupSize: parseInt(formData.minGroupSize) || 2,
      maxGroupSize: parseInt(formData.maxGroupSize) || 5,
      pricePerParticipant: formData.pricePerParticipant !== "" ? parseFloat(formData.pricePerParticipant) : null,
      trialPrice: formData.trialPrice !== "" ? parseFloat(formData.trialPrice) : null,
    };

    await ProgramMockService.saveProgram(newProgram);
    const updatedPrograms = await ProgramMockService.getPrograms();
    setPrograms(updatedPrograms);
    setIsAddModalOpen(false);
    setIsActionLoading(false);
    setToast({ type: "success", message: `Program "${formData.name}" berhasil dibuat.` });
  };

  // Modules List Actions (form inline modification)
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

  // Sub-element styling based on active design theme
  const getSubElementClass = (type: "card-grid-item" | "badge-draft" | "badge-published" | "btn-icon" | "panel-card" | "textarea" | "simulator-bar" | "card-divider" | "stat-card") => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "card-grid-item") return "bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-white p-5 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] hover:translate-x-1 hover:-translate-y-1 transition-all";
        if (type === "panel-card") return "bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-white p-6 font-mono shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff]";
        if (type === "badge-draft") return "bg-amber-100 text-amber-900 border-2 border-zinc-900 font-bold px-2 py-0.5 rounded-none";
        if (type === "badge-published") return "bg-emerald-100 text-emerald-900 border-2 border-zinc-900 font-bold px-2 py-0.5 rounded-none";
        if (type === "textarea") return "w-full text-xs min-h-20 bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white rounded-none py-2.5 px-4 font-mono focus:outline-hidden focus:ring-0 text-zinc-900 dark:text-white leading-relaxed";
        if (type === "simulator-bar") return "flex items-center bg-zinc-55 dark:bg-zinc-900 p-1 border-2 border-zinc-900 dark:border-white rounded-none z-20";
        if (type === "card-divider") return "border-t-2 border-zinc-900 dark:border-white pt-3.5 mt-4 flex items-center justify-between text-xs";
        if (type === "stat-card") return "bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white p-3.5 rounded-none";
        return "p-1.5 border-2 border-zinc-900 dark:border-white hover:bg-zinc-150 dark:hover:bg-zinc-800 transition-colors rounded-none";

      case "claymorphism":
        if (type === "card-grid-item") return "bg-white/80 dark:bg-zinc-900/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_-2px_-2px_4px_rgba(0,0,0,0.03),_2px_2px_6px_rgba(0,0,0,0.05)] border border-zinc-200/50 dark:border-zinc-800/40 p-5 rounded-2xl transition-transform hover:scale-[1.02] hover:-translate-y-1";
        if (type === "panel-card") return "bg-slate-50 dark:bg-zinc-900 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.05),_inset_4px_4px_8px_rgba(255,255,255,0.4),_3px_5px_15px_rgba(0,0,0,0.05)] border border-slate-200/40 dark:border-zinc-850 p-6 rounded-3xl";
        if (type === "badge-draft") return "bg-amber-500/10 text-amber-600 rounded-lg px-2.5 py-0.5 border border-amber-500/15";
        if (type === "badge-published") return "bg-emerald-500/10 text-emerald-600 rounded-lg px-2.5 py-0.5 border border-emerald-500/15";
        if (type === "textarea") return "w-full text-xs min-h-20 bg-slate-50 dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-850 rounded-2xl py-2.5 px-4 focus:outline-hidden focus:ring-0 text-zinc-900 dark:text-white leading-relaxed shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.4)]";
        if (type === "simulator-bar") return "flex items-center bg-slate-100/80 dark:bg-zinc-900/40 p-1 border border-slate-200/20 dark:border-zinc-800/20 rounded-2xl shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)] z-20";
        if (type === "card-divider") return "border-t border-slate-200/50 dark:border-zinc-800/50 pt-3.5 mt-4 flex items-center justify-between text-xs";
        if (type === "stat-card") return "bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/30 dark:border-zinc-800/20 p-3.5 rounded-2xl shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.02)]";
        return "p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:scale-[1.05] active:scale-[0.95] transition-all";

      case "glassmorphism":
      case "liquid-glass":
        if (type === "card-grid-item") return "bg-white/10 dark:bg-zinc-950/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 p-5 rounded-xl transition-all hover:bg-white/15 hover:-translate-y-1";
        if (type === "panel-card") return "bg-white/15 dark:bg-zinc-950/35 border border-white/20 dark:border-zinc-850 backdrop-blur-md p-6 rounded-2xl shadow-xl";
        if (type === "badge-draft") return "bg-amber-400/15 text-amber-300 rounded-full px-3 py-0.5 text-[9px] border border-amber-400/20";
        if (type === "badge-published") return "bg-sky-400/15 text-sky-300 rounded-full px-3 py-0.5 text-[9px] border border-sky-400/20";
        if (type === "textarea") return "w-full text-xs min-h-20 bg-white/10 dark:bg-zinc-950/20 border border-white/20 dark:border-zinc-850 backdrop-blur-xs rounded-xl py-2.5 px-4 focus:outline-hidden focus:ring-0 text-zinc-900 dark:text-white leading-relaxed";
        if (type === "simulator-bar") return "flex items-center bg-white/10 dark:bg-zinc-950/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 p-1 rounded-xl z-20";
        if (type === "card-divider") return "border-t border-white/10 dark:border-white/5 pt-3.5 mt-4 flex items-center justify-between text-xs";
        if (type === "stat-card") return "bg-white/5 dark:bg-zinc-950/15 border border-white/10 dark:border-zinc-800/25 p-3.5 rounded-xl backdrop-blur-3xs";
        return "p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors";

      case "minimalism":
        if (type === "card-grid-item") return "bg-white dark:bg-zinc-950 border border-zinc-250/20 dark:border-zinc-900 p-5 rounded-none transition-all hover:bg-zinc-55 dark:hover:bg-zinc-900/40 hover:-translate-y-0.5";
        if (type === "panel-card") return "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-6 rounded-none";
        if (type === "badge-draft") return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 text-[9px] rounded-none";
        if (type === "badge-published") return "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-2 py-0.5 border border-zinc-900 dark:border-zinc-100 text-[9px] rounded-none";
        if (type === "textarea") return "w-full text-xs min-h-20 bg-transparent border-b border-zinc-200 dark:border-zinc-805 rounded-none py-2 px-1 focus:outline-hidden focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-0 text-zinc-900 dark:text-white leading-relaxed";
        if (type === "simulator-bar") return "flex items-center bg-transparent p-0.5 border border-zinc-150 dark:border-zinc-855 rounded-none z-20";
        if (type === "card-divider") return "border-t border-zinc-150 dark:border-zinc-800 pt-3.5 mt-4 flex items-center justify-between text-xs";
        if (type === "stat-card") return "bg-transparent border border-zinc-150 dark:border-zinc-855 p-3.5 rounded-none";
        return "p-1.5 rounded-none bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-205 dark:hover:bg-zinc-750 transition-colors";

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "card-grid-item") return "bg-white dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl transition-all shadow-3xs hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-1";
        if (type === "panel-card") return "bg-white/95 dark:bg-zinc-950/80 border border-zinc-200/65 dark:border-zinc-855 p-6 rounded-3xl shadow-sm";
        if (type === "badge-draft") return "bg-amber-500/10 text-amber-705 dark:text-amber-400 rounded-full px-2.5 py-0.5 border border-amber-500/10";
        if (type === "badge-published") return "bg-emerald-500/10 text-emerald-705 dark:text-emerald-400 rounded-full px-2.5 py-0.5 border border-emerald-500/10";
        if (type === "textarea") return "w-full text-xs min-h-20 bg-zinc-55 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-sakode-blue focus:outline-hidden transition-all text-zinc-900 dark:text-white leading-relaxed";
        if (type === "simulator-bar") return "flex items-center bg-zinc-100/80 dark:bg-zinc-805 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 z-20";
        if (type === "card-divider") return "border-t border-zinc-150 dark:border-zinc-800/80 pt-3.5 mt-4 flex items-center justify-between text-xs";
        if (type === "stat-card") return "bg-zinc-50 dark:bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-200/35 dark:border-zinc-800/40";
        return "p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-colors";
    }
  };

  const getTabFilterClasses = (type: "container" | "button", isActive?: boolean) => {
    switch (selectedStyle) {
      case "neobrutalism":
        if (type === "container") {
          return "flex gap-1.5 p-1 bg-zinc-55 dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-none";
        }
        return `flex-1 text-center py-1.5 text-xs font-mono font-bold rounded-none transition-all cursor-pointer ${
          isActive
            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]"
            : "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        }`;

      case "claymorphism":
        if (type === "container") {
          return "flex gap-2 p-1 bg-slate-100/85 dark:bg-zinc-900/40 border border-slate-200/20 dark:border-zinc-800/20 rounded-xl shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.4)]";
        }
        return `flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          isActive
            ? "bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.02),_2px_2px_5px_rgba(0,0,0,0.05),_inset_1px_1px_1px_rgba(255,255,255,0.8)] scale-[1.03]"
            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:scale-[1.01]"
        }`;

      case "glassmorphism":
      case "liquid-glass":
        if (type === "container") {
          return "flex gap-1.5 p-1 bg-white/10 dark:bg-zinc-950/20 backdrop-blur-xs border border-white/20 dark:border-zinc-900/30 rounded-xl";
        }
        return `flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          isActive
            ? "bg-white/20 dark:bg-white/10 text-white border border-white/20 dark:border-white/15 backdrop-blur-xs shadow-xs"
            : "text-zinc-350 hover:text-white hover:bg-white/5"
        }`;

      case "minimalism":
        if (type === "container") {
          return "flex gap-4 p-0.5 border-b border-zinc-200 dark:border-zinc-800 rounded-none bg-transparent";
        }
        return `px-2 py-1 text-xs font-bold rounded-none transition-all cursor-pointer ${
          isActive
            ? "text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white font-black"
            : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-650 dark:hover:text-zinc-305"
        }`;

      case "bento-grid":
      case "sakode-modern":
      default:
        if (type === "container") {
          return "flex gap-1 bg-zinc-100/70 dark:bg-zinc-900/80 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 min-w-[250px]";
        }
        return `flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          isActive
            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-3xs"
            : "text-zinc-450 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-205"
        }`;
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

      {/* 1. Header & Simulator controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/35 dark:border-zinc-800/35 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight mb-1">
            Program & Modul Belajar
          </h2>
          <p className="text-xs text-zinc-450 dark:text-zinc-500 font-bold mt-1 uppercase tracking-wider">
            Admin Workspace • Manajemen Kurikulum & Harga Publik
          </p>
        </div>

        {/* Action Controls & Simulation State */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={getSubElementClass("simulator-bar")}>
            <span className="text-[9px] text-zinc-550 dark:text-zinc-350 font-bold uppercase tracking-wider pl-2 pr-1.5">Simulasi:</span>
            {[
              { id: "default" as const, label: "Default" },
              { id: "loading" as const, label: "Loading" },
              { id: "empty" as const, label: "Empty" },
              { id: "error" as const, label: "Error" }
            ].map(state => (
              <button
                key={state.id}
                onClick={() => { setSimulationState(state.id); }}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-lg transition-colors cursor-pointer ${simulationState === state.id ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs" : "text-zinc-505 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
              >
                {state.label}
              </button>
            ))}
          </div>

          <UI.Button
            variant="primary"
            accentColor={selectedColor}
            onClick={openAddModal}
            className="text-xs! py-2! font-semibold! cursor-pointer"
          >
            <Icons.Plus className="w-4 h-4 shrink-0" />
            Tambah Program
          </UI.Button>
        </div>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className={getSubElementClass("panel-card") + " p-4! flex flex-col md:flex-row md:items-center justify-between gap-4 w-full"}>
        {/* Search bar */}
        <div className="relative w-full md:max-w-md">
          <UI.Input
            type="text"
            placeholder="Cari program, slug, atau deskripsi materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            accentColor={selectedColor}
            className="pl-10 text-xs!"
          />
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
            </svg>
          </span>
        </div>

        {/* Status tabs filter */}
        <div className={getTabFilterClasses("container")}>
          {[
            { id: "all" as const, label: "Semua" },
            { id: "published" as const, label: "Published" },
            { id: "draft" as const, label: "Draft" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={getTabFilterClasses("button", statusFilter === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Spacious Grid List */}
      <DataStateBoundary
        isLoading={simulationState === "loading"}
        isError={simulationState === "error"}
        isEmpty={simulationState === "empty" || filteredPrograms.length === 0}
        emptyTitle="Tidak Ada Program"
        emptyDescription="Saat ini tidak ada program belajar yang memenuhi kriteria pencarian Anda."
        emptyIcon="BookOpen"
        loadingVariant="card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((p) => {
            const isMissingPrice = p.price === null && p.status === "published";
            const totalHours = p.modules.reduce((acc, m) => acc + m.durationHours, 0);

            return (
              <div
                key={p.id}
                onClick={() => router.push(`/programs/${p.id}`)}
                className={`cursor-pointer ${getSubElementClass("card-grid-item")} flex flex-col justify-between`}
              >
                <div className="space-y-3.5 text-left">
                  {/* Category metadata & status */}
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-sakode-blue dark:text-sky-400 font-mono">
                      /{p.slug}
                    </span>
                    <div className="flex items-center gap-1">
                      {p.isFeatured && (
                        <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-405 border border-yellow-500/20 p-0.5 rounded" title="Unggulan">
                          <Icons.Star className="w-3 h-3" />
                        </span>
                      )}
                      <UI.Badge
                        variant={p.status === "published" ? "success" : "warning"}
                        className="text-[8.5px]!"
                      >
                        {p.status}
                      </UI.Badge>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-zinc-900 dark:text-white leading-tight mb-1.5 hover:text-sakode-blue dark:hover:text-sky-455 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className={getSubElementClass("card-divider") + " flex flex-col gap-2.5 pt-3"}>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-zinc-450 dark:text-zinc-500 font-bold flex items-center gap-1">
                      <Icons.BookOpen className="w-3.5 h-3.5 text-sakode-blue dark:text-sky-400" />
                      {p.modules.length} Modul ({totalHours} Jam)
                    </span>

                    {isMissingPrice ? (
                      <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1" title="Harga wajib ditentukan untuk status Published.">
                        <Icons.AlertCircle className="w-3.5 h-3.5" />
                        Harga Hilang
                      </span>
                    ) : (
                      <span className="font-black text-zinc-800 dark:text-zinc-200">
                        {formatPrice(p.price, p.currency)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center w-full border-t border-zinc-100 dark:border-zinc-800/40 pt-2 text-[10px] font-bold">
                    <span className="text-zinc-400 dark:text-zinc-500">Pilihan Kelompok:</span>
                    {p.hasGroupOption ? (
                      <UI.Badge
                        variant="accent"
                        accentColor="purple"
                        className="text-[10px]! font-black! px-2! py-0.5! flex items-center gap-0.5"
                      >
                        👥 Aktif ({p.minGroupSize || 2}-{p.maxGroupSize || 5} Anak)
                      </UI.Badge>
                    ) : (
                      <UI.Badge
                        variant="default"
                        className="text-[10px]! px-2! py-0.5!"
                      >
                        👤 Individu Saja
                      </UI.Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DataStateBoundary>

      {/* 4. ADD PROGRAM MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl relative my-8"
            >
              <UI.Card accentColor={selectedColor} className="max-h-[85vh] overflow-y-auto pr-1">
                <form onSubmit={handleAddProgram} className="flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-205 flex items-center gap-1.5">
                      <Icons.Plus className="w-4 h-4" />
                      Tambah Program IT Baru
                    </h3>
                    <button
                    title="Tutup"
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  {/* Form fields grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <UI.Label>Nama Program Bootcamp</UI.Label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: React & Next.js Professional"
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
                        placeholder="contoh: react-nextjs-pro"
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
                          Akan diakses di /programs?program={formData.slug || "slug-anda"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <UI.Label>Deskripsi Hasil Belajar (Outcome)</UI.Label>
                    <textarea
                      placeholder="Masukkan detail penjelasan, target pembelajaran, dan hasil yang akan dicapai oleh murid setelah lulus..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={getSubElementClass("textarea")}
                    />
                  </div>

                  {/* Pricing grid & settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
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
                        <p className="text-[9.5px] text-rose-500 font-bold mt-1 leading-tight">{formErrors.price}</p>
                      )}
                    </div>
                    <div>
                      <UI.Label>Harga Trial</UI.Label>
                      <UI.Input
                        type="text"
                        placeholder="contoh: 150000"
                        value={formData.trialPrice}
                        onChange={(e) => setFormData({ ...formData, trialPrice: e.target.value })}
                        accentColor={selectedColor}
                        className="text-xs!"
                      />
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

                  {/* Featured program toggle */}
                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-2xl border border-zinc-200/35 dark:border-zinc-800/40">
                    <UI.Toggle
                      checked={formData.isFeatured}
                      onChange={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                      accentColor={selectedColor}
                      aria-label="Tampilkan sebagai program unggulan"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Rekomendasikan Program</span>
                      <span className="text-[10px] text-zinc-455 dark:text-zinc-550 font-semibold leading-normal">Tampilkan label &ldquo;Unggulan&rdquo; pada catalog landing page untuk menarik perhatian calon murid.</span>
                    </div>
                  </div>

                  {/* Group learning configs */}
                  <div className="border-t border-zinc-150 dark:border-zinc-800 pt-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-2xl border border-zinc-200/35 dark:border-zinc-800/40">
                      <UI.Toggle
                        checked={formData.hasGroupOption}
                        onChange={() => setFormData({ ...formData, hasGroupOption: !formData.hasGroupOption })}
                        accentColor={selectedColor}
                        aria-label="Tawarkan pilihan belajar kelompok"
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Tawarkan Pilihan Belajar Kelompok</span>
                        <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold leading-normal">Aktifkan jika modul program ini dapat diambil secara berkelompok (offline/tatap muka).</span>
                      </div>
                    </div>

                    {formData.hasGroupOption && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-1">
                        <div>
                          <UI.Label>Min Peserta Kelompok</UI.Label>
                          <UI.Input
                            type="number"
                            value={formData.minGroupSize}
                            onChange={(e) => setFormData({ ...formData, minGroupSize: e.target.value })}
                            accentColor={selectedColor}
                            className="text-xs!"
                          />
                        </div>
                        <div>
                          <UI.Label>Maks Peserta Kelompok</UI.Label>
                          <UI.Input
                            type="number"
                            value={formData.maxGroupSize}
                            onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                            accentColor={selectedColor}
                            className="text-xs!"
                          />
                        </div>
                        <div>
                          <UI.Label>Harga Satuan Per Anak</UI.Label>
                          <UI.Input
                            type="text"
                            value={formData.pricePerParticipant}
                            onChange={(e) => setFormData({ ...formData, pricePerParticipant: e.target.value })}
                            accentColor={selectedColor}
                            className="text-xs!"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modules Outline Inline Form Editor */}
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

                              {/* Ordering & delete actions */}
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

                            {/* Inputs for module */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                              <div className="sm:col-span-8">
                                <UI.Input
                                  type="text"
                                  placeholder="Nama bab/modul (misal: Fundamental HTML & CSS)"
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
                                  <p className="text-[9.5px] text-rose-500 font-bold mt-1 leading-none">{formErrors[`module-${idx}-title`]}</p>
                                )}
                              </div>
                              <div className="sm:col-span-4">
                                <UI.Input
                                  type="number"
                                  placeholder="Jam"
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
                                  <p className="text-[9.5px] text-rose-500 font-bold mt-1 leading-none">{formErrors[`module-${idx}-duration`]}</p>
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
                      onClick={() => setIsAddModalOpen(false)}
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
                      Buat Program Baru
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
