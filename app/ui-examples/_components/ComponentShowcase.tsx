"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { showToast } from "./ToastContainer";
import { Icons } from "./Icons";
import ModalPreview from "./ModalPreview";

interface ComponentShowcaseProps {
  style: string;
}

const PALETTE_COLORS = [
  { key: "pink", name: "Pink", hex: "#FF409F", class: "sakode-pink", secondary: "orange" },
  { key: "orange", name: "Orange", hex: "#F9723B", class: "sakode-orange", secondary: "yellow" },
  { key: "yellow", name: "Kuning", hex: "#EDAC1C", class: "sakode-yellow", secondary: "orange" },
  { key: "blue", name: "Biru", hex: "#54A5E4", class: "sakode-blue", secondary: "cyan" },
  { key: "green", name: "Hijau", hex: "#009670", class: "sakode-green", secondary: "blue" },
  { key: "cyan", name: "Cyan", hex: "#71CFFE", class: "sakode-cyan", secondary: "blue" },
] as const;

type PaletteColorKey = typeof PALETTE_COLORS[number]["key"];

// Tailwind v4 static color mapping triggers
const getBgClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink";
    case "orange": return "bg-sakode-orange";
    case "yellow": return "bg-sakode-yellow";
    case "blue": return "bg-sakode-blue";
    case "green": return "bg-sakode-green";
    case "cyan": return "bg-sakode-cyan";
  }
};

const getBgOpacity90Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink/90";
    case "orange": return "bg-sakode-orange/90";
    case "yellow": return "bg-sakode-yellow/90";
    case "blue": return "bg-sakode-blue/90";
    case "green": return "bg-sakode-green/90";
    case "cyan": return "bg-sakode-cyan/90";
  }
};

const getBgHoverClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "hover:bg-sakode-pink";
    case "orange": return "hover:bg-sakode-orange";
    case "yellow": return "hover:bg-sakode-yellow";
    case "blue": return "hover:bg-sakode-blue";
    case "green": return "hover:bg-sakode-green";
    case "cyan": return "hover:bg-sakode-cyan";
  }
};

const getBorderHoverClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "hover:border-sakode-pink";
    case "orange": return "hover:border-sakode-orange";
    case "yellow": return "hover:border-sakode-yellow";
    case "blue": return "hover:border-sakode-blue";
    case "green": return "hover:border-sakode-green";
    case "cyan": return "hover:border-sakode-cyan";
  }
};

const getShadow20Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "shadow-sakode-pink/20";
    case "orange": return "shadow-sakode-orange/20";
    case "yellow": return "shadow-sakode-yellow/20";
    case "blue": return "shadow-sakode-blue/20";
    case "green": return "shadow-sakode-green/20";
    case "cyan": return "shadow-sakode-cyan/20";
  }
};

const getBgOpacity25Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink/25";
    case "orange": return "bg-sakode-orange/25";
    case "yellow": return "bg-sakode-yellow/25";
    case "blue": return "bg-sakode-blue/25";
    case "green": return "bg-sakode-green/25";
    case "cyan": return "bg-sakode-cyan/25";
  }
};

const getBgOpacity20Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink/20";
    case "orange": return "bg-sakode-orange/20";
    case "yellow": return "bg-sakode-yellow/20";
    case "blue": return "bg-sakode-blue/20";
    case "green": return "bg-sakode-green/20";
    case "cyan": return "bg-sakode-cyan/20";
  }
};

const getBgOpacity15Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink/15";
    case "orange": return "bg-sakode-orange/15";
    case "yellow": return "bg-sakode-yellow/15";
    case "blue": return "bg-sakode-blue/15";
    case "green": return "bg-sakode-green/15";
    case "cyan": return "bg-sakode-cyan/15";
  }
};

const getTextClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "text-sakode-pink";
    case "orange": return "text-sakode-orange";
    case "yellow": return "text-sakode-yellow";
    case "blue": return "text-sakode-blue";
    case "green": return "text-sakode-green";
    case "cyan": return "text-sakode-cyan";
  }
};

const getBorderClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "border-sakode-pink";
    case "orange": return "border-sakode-orange";
    case "yellow": return "border-sakode-yellow";
    case "blue": return "border-sakode-blue";
    case "green": return "border-sakode-green";
    case "cyan": return "border-sakode-cyan";
  }
};

const getFocusRingClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "focus:ring-sakode-pink/35";
    case "orange": return "focus:ring-sakode-orange/35";
    case "yellow": return "focus:ring-sakode-yellow/35";
    case "blue": return "focus:ring-sakode-blue/35";
    case "green": return "focus:ring-sakode-green/35";
    case "cyan": return "focus:ring-sakode-cyan/35";
  }
};

const getGradientClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "from-sakode-pink to-sakode-orange";
    case "orange": return "from-sakode-orange to-sakode-yellow";
    case "yellow": return "from-sakode-yellow to-sakode-orange";
    case "blue": return "from-sakode-blue to-sakode-cyan";
    case "green": return "from-sakode-green to-sakode-blue";
    case "cyan": return "from-sakode-cyan to-sakode-blue";
  }
};

const getGradientBgLightClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "from-sakode-pink/15 to-sakode-orange/20";
    case "orange": return "from-sakode-orange/15 to-sakode-yellow/20";
    case "yellow": return "from-sakode-yellow/15 to-sakode-orange/20";
    case "blue": return "from-sakode-blue/15 to-sakode-cyan/20";
    case "green": return "from-sakode-green/15 to-sakode-blue/20";
    case "cyan": return "from-sakode-cyan/15 to-sakode-blue/20";
  }
};

const getLiquidGlassShadow = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(255,64,159,0.15)]";
    case "orange": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(249,114,59,0.15)]";
    case "yellow": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(237,172,28,0.15)]";
    case "blue": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(84,165,228,0.15)]";
    case "green": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(0,150,112,0.15)]";
    case "cyan": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(113,207,254,0.15)]";
  }
};

export default function ComponentShowcase({ style }: ComponentShowcaseProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Initialize selected color depending on the default theme accent
  const [selectedColor, setSelectedColor] = useState<PaletteColorKey>(() => {
    if (style === "claymorphism") return "pink";
    if (style === "neobrutalism") return "yellow";
    if (style === "glassmorphism") return "cyan";
    if (style === "liquid-glass") return "orange";
    if (style === "bento-grid") return "green";
    return "pink";
  });

  // State managers for interactive sections
  const [formName, setFormName] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [formChecked, setFormChecked] = useState(false);
  const [showFormError, setShowFormError] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [counter, setCounter] = useState(128);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const activeColorInfo = PALETTE_COLORS.find((c) => c.key === selectedColor) || PALETTE_COLORS[0];

  // Dynamic class definitions (legibility and dark-mode neobrutalist fix applied)
  const classMap = {
    // 1. Container Card
    card: {
      claymorphism:
        "bg-slate-50/90 dark:bg-zinc-800/40 rounded-3xl p-6 shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.06),_inset_6px_6px_12px_rgba(255,255,255,0.9),_8px_8px_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.3),_inset_6px_6px_12px_rgba(255,255,255,0.08),_8px_8px_20px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-zinc-800/10 text-slate-800 dark:text-zinc-100",
      neobrutalism:
        "bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-6 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,250,250,1)] text-zinc-900 dark:text-zinc-50",
      glassmorphism:
        "bg-white/70 dark:bg-white/8 backdrop-blur-md border border-zinc-200 dark:border-white/15 rounded-2xl p-6 shadow-xl text-zinc-800 dark:text-white",
      "liquid-glass":
        `bg-white/80 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/15 rounded-2xl p-6 shadow-2xl ${getLiquidGlassShadow(selectedColor)} relative z-10 text-zinc-800 dark:text-white/90`,
      "bento-grid":
        "bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-zinc-800 dark:text-zinc-100",
      minimalism:
        "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-6 rounded-none text-zinc-900 dark:text-zinc-100",
      "sakode-modern":
        "bg-white/90 dark:bg-zinc-950/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl p-6 shadow-lg dark:shadow-2xl relative z-10 text-zinc-800 dark:text-zinc-100",
    }[style] || "",

    // 2. Headings
    heading: {
      claymorphism: "text-lg font-bold text-slate-800 dark:text-white mb-4",
      neobrutalism: "text-lg font-black font-mono uppercase tracking-wide text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white pb-1 mb-4",
      glassmorphism: "text-lg font-bold text-zinc-800 dark:text-white mb-4",
      "liquid-glass": "text-lg font-bold text-zinc-800 dark:text-white/90 mb-4",
      "bento-grid": "text-lg font-bold text-zinc-850 dark:text-zinc-100 mb-4",
      minimalism: "text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-4",
      "sakode-modern": "text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4",
    }[style] || "",

    // 3. Inputs
    input: {
      claymorphism:
        "w-full bg-slate-100/80 dark:bg-zinc-900/60 rounded-2xl py-2.5 px-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),_inset_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),_inset_-3px_-3px_6px_rgba(255,255,255,0.05)] border-0 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden transition-all text-slate-800 dark:text-zinc-100",
      neobrutalism:
        "w-full bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-white font-mono py-2.5 px-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,1)] focus:outline-hidden focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] transition-all text-zinc-900 dark:text-white",
      glassmorphism:
        `w-full bg-white/50 dark:bg-white/5 border border-zinc-300 dark:border-white/10 rounded-xl py-2.5 px-4 focus:ring-2 ${getFocusRingClass(selectedColor)} focus:outline-hidden text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/40 transition-all`,
      "liquid-glass":
        `w-full bg-white/60 dark:bg-black/25 border border-zinc-200 dark:border-white/15 rounded-xl py-2.5 px-4 focus:ring-2 ${getFocusRingClass(selectedColor)} focus:outline-hidden text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/40 transition-all`,
      "bento-grid":
        `w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2.5 px-4 focus:ring-2 ${getFocusRingClass(selectedColor)} focus:outline-hidden transition-all text-zinc-900 dark:text-zinc-100`,
      minimalism:
        "w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2.5 px-1 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-hidden rounded-none text-sm transition-all text-zinc-900 dark:text-white",
      "sakode-modern":
        `w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl py-2.5 px-4 focus:ring-2 ${getFocusRingClass(selectedColor)} focus:outline-hidden transition-all text-zinc-900 dark:text-white`,
    }[style] || "",

    // 4. Labels
    label: {
      claymorphism: "block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1.5",
      neobrutalism: "block text-xs font-black font-mono uppercase tracking-wide text-zinc-900 dark:text-white mb-1.5",
      glassmorphism: "block text-xs font-semibold text-zinc-500 dark:text-white/60 mb-1.5",
      "liquid-glass": "block text-xs font-semibold text-zinc-500 dark:text-white/70 mb-1.5",
      "bento-grid": "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5",
      minimalism: "block text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-1.5",
      "sakode-modern": "block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5",
    }[style] || "",

    // 5. Checkbox/Switch
    toggle: {
      claymorphism:
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
      neobrutalism:
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer border-3 border-zinc-900 dark:border-white transition-colors duration-200 ease-in-out focus:outline-hidden",
      glassmorphism:
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-zinc-350 dark:border-white/20 transition-colors duration-200 ease-in-out focus:outline-hidden",
      "liquid-glass":
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-zinc-300 dark:border-white/25 transition-colors duration-200 ease-in-out focus:outline-hidden",
      "bento-grid":
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-zinc-200 dark:border-zinc-800 transition-colors duration-200 ease-in-out focus:outline-hidden",
      minimalism:
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer border border-zinc-200 dark:border-zinc-800 transition-colors duration-200 ease-in-out focus:outline-hidden",
      "sakode-modern":
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-zinc-200 dark:border-zinc-800 transition-colors duration-200 ease-in-out focus:outline-hidden",
    }[style] || "",
  };

  const getBtnPrimaryTextClass = (color: PaletteColorKey) => {
    if (style === "neobrutalism") return "text-zinc-900";
    if (color === "yellow" || color === "cyan") {
      return "text-zinc-950 font-bold";
    }
    return "text-white";
  };

  const getBtnPrimaryClass = () => {
    switch (style) {
      case "claymorphism":
        return `${getBgClass(selectedColor)} ${getBtnPrimaryTextClass(selectedColor)} rounded-2xl font-bold py-2.5 px-5 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.15),_inset_4px_4px_8px_rgba(255,255,255,0.35),_2px_4px_8px_rgba(0,0,0,0.1)] hover:scale-102 active:scale-98 transition-all shrink-0`;
      case "neobrutalism":
        return `${getBgClass(selectedColor)} ${getBtnPrimaryTextClass(selectedColor)} border-3 border-zinc-900 font-bold uppercase tracking-wider text-xs py-2.5 px-5 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75 shrink-0`;
      case "glassmorphism":
        return `${getBgOpacity90Class(selectedColor)} dark:bg-white/20 ${getBgHoverClass(selectedColor)} dark:hover:bg-white/30 ${getBtnPrimaryTextClass(selectedColor)} dark:text-white border border-transparent dark:border-white/30 rounded-xl font-semibold py-2.5 px-5 backdrop-blur-sm shadow-md transition-all shrink-0`;
      case "liquid-glass":
        return `bg-gradient-to-r ${getGradientClass(selectedColor)} hover:opacity-90 ${getBtnPrimaryTextClass(selectedColor)} rounded-xl font-semibold py-2.5 px-5 shadow-lg ${getShadow20Class(selectedColor)} transition-all duration-300 shrink-0`;
      case "bento-grid":
        return `${getBgClass(selectedColor)} hover:opacity-95 ${getBtnPrimaryTextClass(selectedColor)} rounded-lg font-medium py-2.5 px-5 shadow-sm transition-all shrink-0`;
      case "sakode-modern":
        return `bg-gradient-to-r ${getGradientClass(selectedColor)} ${getBtnPrimaryTextClass(selectedColor)} rounded-xl font-bold py-2.5 px-5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0`;
      case "minimalism":
      default:
        return `bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 px-5 rounded-none transition-colors uppercase tracking-[0.15em] text-[10px] shrink-0 border border-zinc-900 dark:border-zinc-100 ${getBorderHoverClass(selectedColor)}`;
    }
  };

  const getBtnSecondaryClass = () => {
    switch (style) {
      case "claymorphism":
        return "bg-indigo-50 dark:bg-zinc-700/30 hover:bg-indigo-100 dark:hover:bg-zinc-700/50 text-indigo-700 dark:text-indigo-300 rounded-2xl font-bold py-2.5 px-5 shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.05),_inset_3px_3px_6px_rgba(255,255,255,0.7),_2px_2px_6px_rgba(0,0,0,0.06)] hover:scale-102 active:scale-98 transition-all shrink-0";
      case "neobrutalism":
        return "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-3 border-zinc-900 dark:border-white font-bold uppercase tracking-wider text-xs py-2.5 px-5 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75 shrink-0";
      case "glassmorphism":
        return "bg-transparent hover:bg-zinc-800/10 dark:hover:bg-white/10 text-zinc-800 dark:text-white/80 border border-zinc-350 dark:border-white/10 rounded-xl font-medium py-2.5 px-5 transition-all shrink-0";
      case "liquid-glass":
        return "bg-zinc-800/5 hover:bg-zinc-800/10 dark:bg-white/5 dark:hover:bg-white/12 text-zinc-800 dark:text-white/90 border border-zinc-300 dark:border-white/10 rounded-xl font-medium py-2.5 px-5 transition-all shrink-0";
      case "bento-grid":
        return "bg-transparent border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium py-2.5 px-5 transition-colors shrink-0";
      case "sakode-modern":
        return "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl font-bold py-2.5 px-5 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:shadow-xs active:scale-[0.98] transition-all shrink-0";
      case "minimalism":
      default:
        return "bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium py-2.5 px-5 rounded-none hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors uppercase tracking-[0.15em] text-[10px] shrink-0";
    }
  };

  const getAccentTextClass = () => getTextClass(selectedColor);
  const getAccentBgClass = () => getBgClass(selectedColor);

  const getBorderRadius = () => {
    if (style === "neobrutalism" || style === "minimalism") return "0px";
    if (style === "bento-grid") return "12px";
    return "16px";
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formName) {
      setShowFormError(true);
      showToast("error", "Nama Lengkap wajib diisi!");
      return;
    }
    if (!formCourse) {
      showToast("warning", "Pilihlah salah satu kelas IT terlebih dahulu.");
      return;
    }
    if (!formChecked) {
      showToast("warning", "Anda harus menyetujui Ketentuan Layanan.");
      return;
    }

    setIsSubmitLoading(true);
    setShowFormError(false);
    showToast("info", "Memproses pendaftaran...");

    setTimeout(() => {
      setIsSubmitLoading(false);
      showToast("success", `Pendaftaran ${formName} di ${formCourse} berhasil!`);
      setFormName("");
      setFormCourse("");
      setFormChecked(false);
    }, 2000);
  };

  // Customizer Card
  const renderCustomizer = () => {
    if (!mounted) return null;
    const isDark = resolvedTheme === "dark";

    return (
      <div className={`${classMap.card} space-y-4 mb-8 relative z-20`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <span className={classMap.label}>Pilihan Palet Warna (Brand Accent)</span>
            <div className="flex flex-wrap items-center gap-2">
              {PALETTE_COLORS.map((c) => {
                const isSelected = selectedColor === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.key);
                      showToast("info", `Warna aksen diubah ke ${c.name}`);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                      isSelected
                        ? `${getBgClass(c.key)} text-white border-transparent scale-105 shadow-md`
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-300 dark:border-zinc-700"
                    }`}
                    style={{
                      borderRadius: style === "neobrutalism" || style === "minimalism" ? "0px" : "9999px",
                      borderWidth: style === "neobrutalism" ? "3px" : "1px",
                      borderColor: style === "neobrutalism" ? "#18181b" : undefined,
                      boxShadow: style === "neobrutalism" && isSelected ? "3px 3px 0px 0px #18181b" : undefined,
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5 shrink-0 md:w-64">
            <span className={classMap.label}>Mode Tampilan (Ubah Tema)</span>
            <div
              className={`grid grid-cols-2 p-1 bg-zinc-200/50 dark:bg-zinc-900 border ${
                style === "neobrutalism"
                  ? "border-3 border-zinc-900 dark:border-white"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
              style={{
                borderRadius: style === "neobrutalism" || style === "minimalism" ? "0px" : "12px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  showToast("success", "Mode Terang (Light Mode) Aktif");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-black transition-all ${
                  !isDark
                    ? style === "neobrutalism"
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-950 shadow-md rounded-lg"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
                style={{
                  borderRadius: style === "neobrutalism" || style === "minimalism" ? "0px" : undefined,
                }}
              >
                ☀️ Terang
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  showToast("success", "Mode Gelap (Dark Mode) Aktif");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-black transition-all ${
                  isDark
                    ? style === "neobrutalism"
                      ? "bg-zinc-900 text-zinc-900 dark:text-zinc-950"
                      : "bg-zinc-800 text-white shadow-md rounded-lg"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
                style={{
                  borderRadius: style === "neobrutalism" || style === "minimalism" ? "0px" : undefined,
                }}
              >
                🌙 Gelap
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 1. Buttons section
  const renderButtonsSection = () => (
    <div className={classMap.card}>
      <h3 className={classMap.heading}>1. Buttons Showcase</h3>
      <div className="flex flex-wrap items-center gap-4">
        <button className={getBtnPrimaryClass()}>Daftar Sekarang</button>
        <button className={getBtnSecondaryClass()}>Batal</button>
        <button className={getBtnPrimaryClass()} disabled>
          <div className="flex items-center gap-2 justify-center">
            <Icons.Loader className="w-4 h-4 text-white dark:text-zinc-955" />
            Loading...
          </div>
        </button>
        <button className={`${getBtnSecondaryClass()} flex items-center gap-1.5`}>
          <span>Mulai Belajar</span>
          <Icons.ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // 2. Forms Section
  const renderFormsSection = () => (
    <div className={classMap.card}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={classMap.heading.replace("mb-4", "")}>2. Form Registrasi</h3>
        <button
          type="button"
          onClick={() => {
            setShowFormError(!showFormError);
            showToast("info", `Mode error form: ${!showFormError ? "Aktif" : "Nonaktif"}`);
          }}
          className="text-xs font-bold px-2.5 py-1 rounded bg-zinc-150/80 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
        >
          {showFormError ? "Hapus State Error" : "Simulasi State Error"}
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Name input */}
        <div>
          <label className={classMap.label}>Nama Lengkap</label>
          <div className="relative">
            <input
              type="text"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                if (e.target.value) setShowFormError(false);
              }}
              placeholder="Contoh: Budi Santoso"
              className={`${classMap.input} ${
                showFormError ? "border-sakode-red focus:ring-sakode-red/30 dark:border-sakode-red" : ""
              }`}
            />
            {formName && !showFormError && (
              <span className="absolute right-3.5 top-3 text-emerald-500">
                <Icons.Check className="w-5 h-5" />
              </span>
            )}
          </div>
          {showFormError && (
            <p className="text-xs text-sakode-red font-semibold mt-1 flex items-center gap-1">
              <Icons.AlertCircle className="w-3.5 h-3.5" />
              Nama tidak boleh kosong.
            </p>
          )}
        </div>

        {/* Course dropdown selection */}
        <div>
          <label className={classMap.label}>Program Kursus IT</label>
          <select
            value={formCourse}
            onChange={(e) => setFormCourse(e.target.value)}
            className={`${classMap.input} appearance-none cursor-pointer bg-white dark:bg-zinc-900`}
          >
            <option value="" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
              -- Pilih Kursus --
            </option>
            <option value="React & Next.js" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
              Frontend Development (Next.js)
            </option>
            <option value="Node.js Back-End" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
              Backend Engineering (Node.js)
            </option>
            <option value="Fullstack Product" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
              Fullstack IT Course Practitioner
            </option>
          </select>
        </div>

        {/* Switch Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-zinc-200/50 dark:border-zinc-800/40">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            Setuju Ketentuan Layanan Akademi
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={formChecked}
            onClick={() => setFormChecked(!formChecked)}
            className={`${classMap.toggle} ${
              formChecked
                ? style === "neobrutalism"
                  ? "bg-zinc-900 dark:bg-white"
                  : getBgClass(selectedColor)
                : "bg-zinc-200 dark:bg-zinc-800"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-zinc-900 transform ring-0 transition duration-200 ease-in-out ${
                formChecked
                  ? style === "minimalism"
                    ? "translate-x-4 border border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white"
                    : "translate-x-5"
                  : "translate-x-0"
              }`}
              style={{
                borderRadius: style === "neobrutalism" || style === "minimalism" ? "0px" : "9999px",
                height: style === "neobrutalism" || style === "minimalism" ? "18px" : "20px",
                width: style === "neobrutalism" || style === "minimalism" ? "18px" : "20px",
                backgroundColor: style === "neobrutalism" && formChecked ? "#ffffff" : undefined,
              }}
            />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`${getBtnPrimaryClass()} w-full justify-center flex items-center gap-1.5`}
          disabled={isSubmitLoading}
        >
          {isSubmitLoading ? (
            <>
              <Icons.Loader className="w-4 h-4 text-white dark:text-zinc-950" />
              Menyimpan data...
            </>
          ) : (
            <>
              <span>Kirim Formulir Pendaftaran</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );

  // 3. Toasts section
  const renderToastsSection = () => (
    <div className={classMap.card}>
      <h3 className={classMap.heading}>3. Toast Notifications</h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
        Picu notifikasi toast mengambang di pojok kanan atas. Tampilannya akan menyesuaikan secara visual dengan tema gaya yang aktif saat ini.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => showToast("success", "Selamat! Akun belajar Anda telah berhasil dikonfigurasi.")}
          className="text-xs font-bold py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer border border-transparent"
        >
          Picu Success
        </button>
        <button
          onClick={() => showToast("error", "Sesi login kedaluwarsa. Mohon autentikasi ulang akun Anda.")}
          className="text-xs font-bold py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer border border-transparent"
        >
          Picu Error
        </button>
        <button
          onClick={() => showToast("info", "Jadwal mentoring 1-on-1 dengan Mentor Rian akan dimulai dalam 10 menit.")}
          className="text-xs font-bold py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-colors cursor-pointer border border-transparent"
        >
          Picu Info
        </button>
      </div>
    </div>
  );

  // 4. Stats section
  const renderStatsSection = () => (
    <div className={classMap.card}>
      <h3 className={classMap.heading}>4. Metrics & Progress</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Stat Counter */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Siswa Terdaftar
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">{counter}</span>
            <button
              onClick={() => setCounter((prev) => prev + 1)}
              className={`text-[10px] px-2 py-0.5 rounded font-black ${getAccentBgClass()} text-white flex items-center gap-0.5`}
              style={{
                borderRadius: style === "neobrutalism" || style === "minimalism" ? "0px" : "6px",
              }}
            >
              + Tambah
            </button>
          </div>
        </div>

        {/* Progress Bar Visualizer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400">
            <span>Progress Kelas</span>
            <span className="text-zinc-800 dark:text-zinc-200">76% Completed</span>
          </div>
          <div
            className="w-full bg-zinc-200 dark:bg-zinc-800/80 overflow-hidden"
            style={{
              borderRadius: style === "neobrutalism" || style === "minimalism" ? "0px" : "9999px",
              height: "8px",
            }}
          >
            <div
              className={`h-full ${
                style === "liquid-glass"
                  ? `bg-gradient-to-r ${getGradientClass(selectedColor)}`
                  : getBgClass(selectedColor)
              }`}
              style={{ width: "76%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 5. Cards section
  const renderCardsSection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item 1: Course Card */}
        <div className={`${classMap.card} flex flex-col justify-between h-full`}>
          <div className="space-y-4">
            <div
              className={`relative w-full h-40 bg-gradient-to-tr ${getGradientBgLightClass(selectedColor)} rounded-xl overflow-hidden flex items-center justify-center border border-zinc-200/25`}
            >
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 text-center px-4">
                Front-End Next.js v16 & Tailwind v4
              </span>
              <span className={`absolute top-3 left-3 ${getAccentBgClass()} text-white text-[10px] font-black px-2 py-0.5 rounded-md`}>
                Terpopuler
              </span>
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Next.js & React 19 Bootcamp
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                Kuasai Server Actions, Server Components, dan styling modern Tailwind CSS v4 dari dasar hingga standar industri.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-200/50 dark:border-zinc-800/65 pt-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <Icons.BookOpen className={`w-3.5 h-3.5 ${getAccentTextClass()}`} />
              <span>32 Modul</span>
            </div>
            <span className={`text-xs font-black ${getAccentTextClass()}`}>Rp 499.000</span>
          </div>
        </div>

        {/* Item 2: Profile Mentor Card */}
        <div className={`${classMap.card} flex flex-col justify-between h-full`}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${getBgOpacity20Class(selectedColor)} flex items-center justify-center font-bold text-lg ${getAccentTextClass()} shrink-0`}>
                RY
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-none">
                  Rian Yulianto
                </h4>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold">
                  Senior Frontend Engineer
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              &ldquo;Saya akan membimbing Anda membangun portofolio berskala produksi dengan arsitektur terkolokasi terbaik.&rdquo;
            </p>

            <div className="flex flex-wrap gap-1">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">
                Next.js Expert
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                Active Mentor
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-200/50 dark:border-zinc-800/65 pt-4 mt-4">
            <div className="flex items-center gap-0.5 text-xs text-amber-500">
              <Icons.Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-zinc-800 dark:text-zinc-200 ml-1">4.9</span>
              <span className="text-[10px] text-zinc-400">(120+ Review)</span>
            </div>
            <button className={`${getBtnSecondaryClass()} !py-1.5 !px-3 text-[10px]`}>
              Jadwal Sesi
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 6. Modal trigger section
  const renderModalSection = () => (
    <div className={classMap.card}>
      <h3 className={classMap.heading}>5. Dialog & Modals</h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
        Tampilkan kotak dialog overlay modal interaktif. Estetika modal, overlay luar, dan efek visualnya akan menyesuaikan dengan tema gaya yang aktif saat ini.
      </p>
      <button onClick={() => setIsModalOpen(true)} className={getBtnPrimaryClass()}>
        Buka Preview Modal
      </button>
    </div>
  );

  // 7. Accordion Component
  const renderAccordion = () => {
    const faqData = [
      { id: 1, q: "Bagaimana alur pembelajaran di Sakode?", a: "Siswa akan mendapatkan kurikulum terstruktur, video materi, dan sesi live mentoring 1-on-1 bersama praktisi industri IT." },
      { id: 2, q: "Apakah ada penyaluran kerja setelah lulus?", a: "Ya, Sakode bekerja sama dengan berbagai startup dan tech company lokal untuk menyalurkan lulusan terbaik melalui program plotting." }
    ];

    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>7. Silabus & FAQs (Accordion)</h3>
        <div className="space-y-3">
          {faqData.map((item) => {
            const isOpen = activeAccordion === item.id;
            return (
              <div
                key={item.id}
                className="border border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden"
                style={{ borderRadius: getBorderRadius() }}
              >
                <button
                  type="button"
                  onClick={() => setActiveAccordion(isOpen ? null : item.id)}
                  className={`w-full flex items-center justify-between p-4 font-bold text-left transition-colors ${
                    isOpen ? "bg-zinc-150/20 dark:bg-zinc-800/30" : "bg-transparent"
                  }`}
                >
                  <span className="text-sm">{item.q}</span>
                  <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <Icons.X className="w-4 h-4 rotate-45 text-zinc-400" />
                  </span>
                </button>
                {isOpen && (
                  <div className="p-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/20 dark:bg-zinc-950/25">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 2. Timeline Components
  const renderTimeline = () => {
    const steps = [
      { step: "01", title: "Registrasi Akun", desc: "Buat akun belajar di portal akademik." },
      { step: "02", title: "Pilih Kelas IT", desc: "Tentukan minat keahlian belajar pemrograman Anda." },
      { step: "03", title: "Mentoring & Lulus", desc: "Mulai belajar bersama mentor industri." }
    ];

    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>8. Jalur Pendaftaran (Steps Timeline)</h3>
        <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-6">
          {steps.map((item, idx) => (
            <div key={idx} className="relative">
              <span className={`absolute left-[-35px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${getAccentBgClass()}`}>
                {item.step}
              </span>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight">{item.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. Badge & Status Tags
  const renderBadges = () => {
    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>9. Status Tags & Level</h3>
        <div className="flex flex-wrap gap-2.5">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full text-white ${getAccentBgClass()}`}>
            Pemula (Basic)
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-150 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-350 border border-emerald-500/20">
            Booking Sukses
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-350 border border-amber-500/20">
            Rescheduled
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-500/10">
            Kelas Trial
          </span>
        </div>
      </div>
    );
  };

  // 4. Avatar Group
  const renderAvatarGroup = () => {
    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>10. Enrolled Students</h3>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5 overflow-hidden">
            {["AN", "BS", "CL", "DK"].map((initial, idx) => (
              <div
                key={idx}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-950 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-700 dark:text-zinc-300"
              >
                {initial}
              </div>
            ))}
            <div className={`inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-950 ${getAccentBgClass()} text-white flex items-center justify-center text-[9px] font-black`}>
              +14
            </div>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">18+ Siswa aktif sekelas</span>
        </div>
      </div>
    );
  };

  // 5. Alert Callouts
  const renderAlerts = () => {
    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>11. System Alert Panels</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl border border-amber-500/20 bg-amber-100/40 dark:bg-amber-950/15 text-amber-800 dark:text-amber-300 text-xs">
            <Icons.AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block">Batas Sesi Mentoring</span>
              Mentoring 1-on-1 dengan Mentor Rian harus diselesaikan sebelum pukul 15.00 WIB.
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-sky-500/20 bg-sky-100/40 dark:bg-sky-950/15 text-sky-800 dark:text-sky-300 text-xs">
            <Icons.Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block">Pemberitahuan Sistem</span>
              Portal akademik akan melakukan pemeliharaan rutin pada 28 Juni pukul 02:00 WIB.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 6. Interactive Data Table
  const renderTable = () => {
    const schedules = [
      { course: "Next.js & Tailwind", date: "24 Juni, 10:00", mentor: "Rian Y.", status: "Aktif" },
      { course: "Backend Node.js API", date: "25 Juni, 13:00", mentor: "Fikri A.", status: "Aktif" },
      { course: "Trial Git & GitHub", date: "26 Juni, 09:00", mentor: "Sarah D.", status: "Selesai" }
    ];

    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>12. Jadwal Sesi Kelas (Data Table)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 font-extrabold text-zinc-400 uppercase tracking-wider">
                <th className="pb-3 pr-2">Kelas Kursus</th>
                <th className="pb-3 pr-2">Tanggal Mentoring</th>
                <th className="pb-3 pr-2">Mentor</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-150/40 dark:border-zinc-800/40 hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10">
                  <td className="py-3 font-extrabold text-zinc-900 dark:text-white pr-2">{item.course}</td>
                  <td className="py-3 text-zinc-500 dark:text-zinc-400 pr-2">{item.date}</td>
                  <td className="py-3 text-zinc-700 dark:text-zinc-300 pr-2">{item.mentor}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "Selesai"
                        ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        : `${getBgOpacity15Class(selectedColor)} ${getAccentTextClass()}`
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 7. Card Carousel
  const renderCarousel = () => {
    const testimonials = [
      { name: "Andi Wijaya", role: "Siswa Fullstack", review: "Belajar IT di Sakode sangat terarah. Kurikulum industrinya benar-benar terpakai waktu saya melamar kerja." },
      { name: "Bunga Safira", role: "Siswa Frontend", review: "Sesi live mentoring 1-on-1 membantu saya keluar dari kebuntuan bug coding dalam waktu singkat." },
      { name: "Candra Kirana", role: "Siswa Backend", review: "Penyampaian modul terstruktur dan langsung praktik membuat saya cepat paham konsep backend API." }
    ];

    const activeReview = testimonials[carouselIndex];

    return (
      <div className={classMap.card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={classMap.heading.replace("mb-4", "")}>13. Ulasan Alumni (Carousel)</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCarouselIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <Icons.ArrowLeft className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <button
              onClick={() => setCarouselIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <Icons.ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="min-h-24 flex flex-col justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
            &ldquo;{activeReview.review}&rdquo;
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="block text-xs font-extrabold text-zinc-900 dark:text-white">{activeReview.name}</span>
              <span className="text-[10px] text-zinc-400">{activeReview.role}</span>
            </div>
            <div className="flex gap-0.5 text-amber-500">
              <Icons.Star className="w-3 h-3 fill-current" />
              <Icons.Star className="w-3 h-3 fill-current" />
              <Icons.Star className="w-3 h-3 fill-current" />
              <Icons.Star className="w-3 h-3 fill-current" />
              <Icons.Star className="w-3 h-3 fill-current" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 8. Interactive Chart
  const renderChart = () => {
    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>14. Statistik Ujian Tugas (Chart)</h3>
        <div className="h-32 w-full flex items-end justify-between gap-2.5 pt-4">
          {[
            { label: "M1", val: "h-[30%]" },
            { label: "M2", val: "h-[50%]" },
            { label: "M3", val: "h-[45%]" },
            { label: "M4", val: "h-[85%]" },
            { label: "M5", val: "h-[95%]" }
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full relative group h-full flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${bar.val} ${
                    style === "liquid-glass"
                      ? `bg-gradient-to-t ${getGradientClass(selectedColor)}`
                      : getBgClass(selectedColor)
                  }`}
                />
                <span className="absolute top-[-25px] left-1/2 translate-x-[-50%] text-[8px] bg-zinc-900 text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.val.replace("h-[", "").replace("%]", "")}%
                </span>
              </div>
              <span className="text-[9px] font-semibold text-zinc-400 tracking-wider block">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 9. Breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>15. Breadcrumbs Path</h3>
        <nav className="flex text-xs font-semibold text-zinc-400 gap-1.5 flex-wrap items-center">
          <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer">Kelas</span>
          <span>/</span>
          <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer">Front-End</span>
          <span>/</span>
          <span className={`font-black ${getAccentTextClass()}`}>Next.js v16 & Tailwind v4</span>
        </nav>
      </div>
    );
  };

  // 10. Dropdown Menu
  const renderDropdown = () => {
    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>16. Dropdown Action Menu</h3>
        <div className="relative inline-block text-left z-20">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`${getBtnSecondaryClass()} !py-2 !px-4 flex items-center gap-2`}
          >
            <span>Aksi Profil</span>
            <Icons.X className={`w-3.5 h-3.5 transform transition-transform ${isDropdownOpen ? "" : "rotate-45"}`} />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg p-1.5 space-y-1 z-30"
              style={{ borderRadius: getBorderRadius() }}
            >
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  showToast("info", "Membuka Halaman Dashboard...");
                }}
                className="w-full text-left text-xs font-semibold py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors"
              >
                Dashboard Belajar
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  showToast("info", "Membuka Pengaturan Akun...");
                }}
                className="w-full text-left text-xs font-semibold py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors"
              >
                Pengaturan Akun
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 11. Drag & Drop Upload Zone
  const renderUploadZone = () => {
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).map((f) => f.name);
      if (files.length > 0) {
        setUploadedFiles((prev) => [...prev, ...files]);
        showToast("success", `${files.length} tugas berhasil diunggah.`);
      }
    };

    return (
      <div className={classMap.card}>
        <h3 className={classMap.heading}>17. Submit Tugas (Drag & Drop Zone)</h3>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed py-8 px-4 text-center cursor-pointer transition-all ${
            isDragging
              ? `border-sakode-${selectedColor} bg-sakode-${selectedColor}/5`
              : "border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
          }`}
          style={{ borderRadius: getBorderRadius() }}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Icons.X className="w-8 h-8 text-zinc-400 rotate-45" />
            <span className="text-xs font-extrabold text-zinc-900 dark:text-white block">
              Tarik file Anda ke sini, atau klik untuk memilih
            </span>
            <span className="text-[10px] text-zinc-400 block">Mendukung format PDF, ZIP, PNG (Maks 10MB)</span>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">File Diunggah</span>
            <div className="space-y-1.5">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/30 text-xs border border-zinc-200/20">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-xs">{file}</span>
                  <button
                    onClick={() => {
                      setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
                      showToast("info", "File dibatalkan.");
                    }}
                    className="text-rose-500 hover:text-rose-600"
                  >
                    <Icons.X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ----------------------------------------------------
  // Layout Option 1: Bento Grid Mode
  // ----------------------------------------------------
  if (style === "bento-grid") {
    return (
      <div className="space-y-6 relative">
        {renderCustomizer()}

        {/* Dense Bento Grid Layout: 3 Columns mathematically balanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
          {/* Row 1 */}
          <div className={`${classMap.card} md:col-span-2 space-y-3`}>
            <div className={`inline-block text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded ${getBgOpacity15Class(selectedColor)} ${getAccentTextClass()}`}>
              Layout Grid
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Konsep Bento Grid Layout
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Menyusun komponen berbeda fungsi (button, form, toast trigger, metrik statistik) ke dalam kotak modular asimetris yang adaptif. Sangat cocok untuk menghemat ruang dan menonjolkan visual dashboard.
            </p>
          </div>
          <div className="md:col-span-1">{renderStatsSection()}</div>

          {/* Row 2 & 3 */}
          <div className="md:col-span-2 md:row-span-2">{renderFormsSection()}</div>
          <div className="md:col-span-1">{renderToastsSection()}</div>
          <div className="md:col-span-1">{renderButtonsSection()}</div>

          {/* Row 4 */}
          <div className="md:col-span-2">{renderCardsSection()}</div>
          <div className="md:col-span-1">{renderModalSection()}</div>

          {/* Row 5 */}
          <div className="md:col-span-1">{renderAccordion()}</div>
          <div className="md:col-span-1">{renderTimeline()}</div>
          <div className="md:col-span-1">{renderBadges()}</div>

          {/* Row 6 */}
          <div className="md:col-span-1">{renderAvatarGroup()}</div>
          <div className="md:col-span-2">{renderAlerts()}</div>

          {/* Row 7 */}
          <div className="md:col-span-3">{renderTable()}</div>

          {/* Row 8 */}
          <div className="md:col-span-2">{renderCarousel()}</div>
          <div className="md:col-span-1">{renderChart()}</div>

          {/* Row 9 */}
          <div className="md:col-span-1">{renderBreadcrumbs()}</div>
          <div className="md:col-span-1">{renderDropdown()}</div>
          <div className="md:col-span-1">{renderUploadZone()}</div>
        </div>

        {/* Modal overlays portal */}
        <ModalPreview
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          style={style}
          selectedColor={selectedColor}
          btnPrimaryClass={getBtnPrimaryClass()}
          btnSecondaryClass={getBtnSecondaryClass()}
          cardClass={classMap.card}
          labelClass={classMap.label}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // Layout Option 2: Default Sequential Flow
  // ----------------------------------------------------
  const renderInteractiveMeshBackdrop = () => {
    if (style === "liquid-glass") {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 -mx-4 sm:-mx-6 lg:-mx-8">
          <motion.div
            animate={{ x: [0, 80, -40, 0], y: [0, -100, 50, 0], scale: [1, 1.2, 0.9, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-72 h-72 rounded-full ${getBgOpacity25Class(selectedColor)} blur-3xl top-1/4 left-1/4`}
          />
          <motion.div
            animate={{ x: [0, -100, 60, 0], y: [0, 80, -60, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-80 h-80 rounded-full ${getBgOpacity20Class(activeColorInfo.secondary)} blur-3xl bottom-1/3 right-1/4`}
          />
        </div>
      );
    }

    if (style === "sakode-modern") {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 -mx-4 sm:-mx-6 lg:-mx-8">
          {/* Vector Blueprint grids lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] opacity-70 pointer-events-none z-0" />
          
          {/* Mesh overlay glows */}
          <div className={`absolute top-[-10%] left-[50%] translate-x-[-50%] h-150 w-[95%] rounded-full bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.06)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.11)_0%,transparent_65%)] blur-[60px] pointer-events-none z-0`} />
          <div className={`absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,64,159,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,64,159,0.08)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0`} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full space-y-8">
      {renderInteractiveMeshBackdrop()}

      {renderCustomizer()}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pointer-events-auto">
        {/* Left Column flow */}
        <div className="lg:col-span-7 space-y-8">
          {renderButtonsSection()}
          {renderStatsSection()}
          {renderToastsSection()}
          {renderModalSection()}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderAccordion()}
            {renderTimeline()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderBadges()}
            {renderAvatarGroup()}
          </div>

          {renderAlerts()}
          {renderCarousel()}
          {renderChart()}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderBreadcrumbs()}
            {renderDropdown()}
            {renderUploadZone()}
          </div>

          <div>
            <h3 className={classMap.heading}>6. Cards & Profiles Showcase</h3>
            {renderCardsSection()}
          </div>
        </div>

        {/* Right Column sticky flow */}
        <div className="lg:col-span-5 space-y-8">
          <div className="lg:sticky lg:top-24 space-y-8">
            {renderFormsSection()}
            {renderTable()}
          </div>
        </div>
      </div>

      <ModalPreview
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={style}
        selectedColor={selectedColor}
        btnPrimaryClass={getBtnPrimaryClass()}
        btnSecondaryClass={getBtnSecondaryClass()}
        cardClass={classMap.card}
        labelClass={classMap.label}
      />
    </div>
  );
}
