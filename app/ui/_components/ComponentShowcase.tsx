"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { showToast } from "./ToastContainer";
import { Icons } from "@/UI/shared/Icons";
import ModalPreview from "./ModalPreview";
import * as UIStyles from "@/UI";
import {
  getBgClass,
  getBgOpacity15Class,
  getBgOpacity20Class,
  getBgOpacity25Class,
  getTextClass,
  PaletteColorKey,
  PALETTE_COLORS,
  getGradientBgLightClass,
} from "@/UI/shared/color-utils";

interface ComponentShowcaseProps {
  style: string;
}

type UIStyleComponentSet = {
  Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { accentColor?: PaletteColorKey }>;
  Heading: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
  Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>>;
  Input: React.ForwardRefExoticComponent<React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean } & React.RefAttributes<HTMLInputElement>>;
  Select: React.ForwardRefExoticComponent<React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean } & React.RefAttributes<HTMLSelectElement>>;
  Toggle: React.FC<{ checked: boolean; onChange: () => void; accentColor?: PaletteColorKey; "aria-label"?: string }>;
  Button: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary"; accentColor?: PaletteColorKey; isLoading?: boolean } & React.RefAttributes<HTMLButtonElement>>;
  Accordion: React.FC<{ items: { id: number; q: string; a: string }[]; activeId: number | null; onToggle: (id: number) => void }>;
  Timeline: React.FC<{ steps: { step: string; title: string; desc: string }[]; accentColor?: PaletteColorKey }>;
  Badge: React.FC<{ children: React.ReactNode; accentColor?: PaletteColorKey; variant?: "accent" | "success" | "warning" | "default" }>;
  AvatarGroup: React.FC<{ initials: string[]; extraCount: number; accentColor?: PaletteColorKey }>;
  Alert: React.FC<{ title: string; children: React.ReactNode; type?: "warning" | "info" }>;
  Table: React.FC<{ schedules: { course: string; date: string; mentor: string; status: string }[]; accentColor?: PaletteColorKey }>;
  Carousel: React.FC<{ testimonials: { name: string; role: string; review: string }[]; activeIndex: number; onPrev: () => void; onNext: () => void; accentColor?: PaletteColorKey }>;
  Chart: React.FC<{ bars: { label: string; val: string }[]; accentColor?: PaletteColorKey }>;
  Breadcrumbs: React.FC<{ items: { label: string; active?: boolean }[]; accentColor?: PaletteColorKey }>;
  Dropdown: React.FC<{ isOpen: boolean; onToggle: () => void; triggerText: string; items: { label: string; onClick: () => void }[]; accentColor?: PaletteColorKey }>;
  UploadZone: React.FC<{ isDragging: boolean; onDragOver: (e: React.DragEvent) => void; onDragLeave: () => void; onDrop: (e: React.DragEvent) => void; uploadedFiles?: string[]; onRemoveFile?: (index: number) => void; accentColor?: PaletteColorKey }>;
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

  // Resolve the visual style namespace
  const UI = (UIStyles.UI[style as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]) as UIStyleComponentSet;

  const activeColorInfo = PALETTE_COLORS.find((c) => c.key === selectedColor) || PALETTE_COLORS[0];

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
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
      <UI.Card accentColor={selectedColor} className="space-y-4 mb-8 relative z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <UI.Label>Pilihan Palet Warna (Brand Accent)</UI.Label>
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
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold transition-all border ${
                      style === "neobrutalism" || style === "minimalism" ? "rounded-none" : "rounded-full"
                    } ${
                      style === "neobrutalism"
                        ? "border-3 border-zinc-900 dark:border-white"
                        : "border-zinc-200/80 dark:border-zinc-700"
                    } ${
                      style === "neobrutalism" && isSelected
                        ? "shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,1)]"
                        : ""
                    } ${
                      isSelected
                        ? `${getBgClass(c.key)} text-white border-transparent scale-105 shadow-md`
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-300"
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border border-black/10 shrink-0 ${getBgClass(c.key)}`}
                    />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5 shrink-0 md:w-64">
            <UI.Label>Mode Tampilan (Ubah Tema)</UI.Label>
            <div
              className={`grid grid-cols-2 p-1 bg-zinc-200/50 dark:bg-zinc-900 border ${
                style === "neobrutalism" || style === "minimalism" ? "rounded-none" : "rounded-xl"
              } ${
                style === "neobrutalism"
                  ? "border-3 border-zinc-900 dark:border-white"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  showToast("success", "Mode Terang (Light Mode) Aktif");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-black transition-all ${
                  style === "neobrutalism" || style === "minimalism" ? "rounded-none" : "rounded-md"
                } ${
                  !isDark
                    ? style === "neobrutalism"
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-955 shadow-md"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
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
                  style === "neobrutalism" || style === "minimalism" ? "rounded-none" : "rounded-md"
                } ${
                  isDark
                    ? style === "neobrutalism"
                      ? "bg-zinc-900 text-zinc-900 dark:text-zinc-955"
                      : "bg-zinc-800 text-white shadow-md"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
              >
                🌙 Gelap
              </button>
            </div>
          </div>
        </div>
      </UI.Card>
    );
  };

  // 1. Buttons section
  const renderButtonsSection = () => (
    <UI.Card accentColor={selectedColor}>
      <UI.Heading>1. Buttons Showcase</UI.Heading>
      <div className="flex flex-wrap items-center gap-4">
        <UI.Button variant="primary" accentColor={selectedColor}>Daftar Sekarang</UI.Button>
        <UI.Button variant="secondary" accentColor={selectedColor}>Batal</UI.Button>
        <UI.Button variant="primary" accentColor={selectedColor} isLoading disabled>
          Loading...
        </UI.Button>
        <UI.Button variant="secondary" accentColor={selectedColor} className="flex items-center gap-1.5">
          <span>Mulai Belajar</span>
          <Icons.ArrowRight className="w-4 h-4" />
        </UI.Button>
      </div>
    </UI.Card>
  );

  // 2. Forms Section
  const renderFormsSection = () => (
    <UI.Card accentColor={selectedColor}>
      <div className="flex items-center justify-between mb-4">
        <UI.Heading className="mb-0!">2. Form Registrasi</UI.Heading>
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
          <UI.Label>Nama Lengkap</UI.Label>
          <div className="relative">
            <UI.Input
              type="text"
              value={formName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormName(e.target.value);
                if (e.target.value) setShowFormError(false);
              }}
              placeholder="Contoh: Budi Santoso"
              hasError={showFormError}
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
          <UI.Label htmlFor="course-selection">Program Kursus IT</UI.Label>
          <UI.Select
            id="course-selection"
            aria-label="Program Kursus IT"
            value={formCourse}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormCourse(e.target.value)}
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
          </UI.Select>
        </div>

        {/* Switch Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-zinc-200/50 dark:border-zinc-800/40">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            Setuju Ketentuan Layanan Akademi
          </span>
          <UI.Toggle
            checked={formChecked}
            onChange={() => setFormChecked(!formChecked)}
            accentColor={selectedColor}
            aria-label="Setuju Ketentuan Layanan Akademi"
          />
        </div>

        {/* Submit */}
        <UI.Button
          type="submit"
          variant="primary"
          accentColor={selectedColor}
          className="w-full justify-center flex items-center gap-1.5"
          disabled={isSubmitLoading}
        >
          {isSubmitLoading ? (
            <>
              <Icons.Loader className="w-4 h-4 text-white dark:text-zinc-955 animate-spin" />
              Menyimpan data...
            </>
          ) : (
            <>
              <span>Kirim Formulir Pendaftaran</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </>
          )}
        </UI.Button>
      </form>
    </UI.Card>
  );

  // 3. Toasts section
  const renderToastsSection = () => (
    <UI.Card accentColor={selectedColor}>
      <UI.Heading>3. Toast Notifications</UI.Heading>
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
    </UI.Card>
  );

  // 4. Stats section
  const renderStatsSection = () => (
    <UI.Card accentColor={selectedColor}>
      <UI.Heading>4. Metrics & Progress</UI.Heading>
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
              className={`text-[10px] px-2 py-0.5 font-black ${getBgClass(selectedColor)} text-white flex items-center gap-0.5 ${
                style === "neobrutalism" || style === "minimalism" ? "rounded-none" : "rounded-sm"
              }`}
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
            className={`w-full bg-zinc-200 dark:bg-zinc-800/80 overflow-hidden h-2 ${
              style === "neobrutalism" || style === "minimalism" ? "rounded-none" : "rounded-full"
            }`}
          >
            <div
              className={`h-full w-[76%] ${
                style === "liquid-glass"
                  ? `bg-linear-to-r ${getBgClass(selectedColor)}`
                  : getBgClass(selectedColor)
              }`}
            />
          </div>
        </div>
      </div>
    </UI.Card>
  );

  // 5. Cards section
  const renderCardsSection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item 1: Course Card */}
        <UI.Card accentColor={selectedColor} className="flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div
              className={`relative w-full h-40 bg-linear-to-tr ${getGradientBgLightClass(selectedColor)} rounded-xl overflow-hidden flex items-center justify-center border border-zinc-200/25`}
            >
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 text-center px-4">
                Front-End Next.js v16 & Tailwind v4
              </span>
              <span className={`absolute top-3 left-3 ${getBgClass(selectedColor)} text-white text-[10px] font-black px-2 py-0.5 rounded-md`}>
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
              <Icons.BookOpen className={`w-3.5 h-3.5 ${getTextClass(selectedColor)}`} />
              <span>32 Modul</span>
            </div>
            <span className={`text-xs font-black ${getTextClass(selectedColor)}`}>Rp 499.000</span>
          </div>
        </UI.Card>

        {/* Item 2: Profile Mentor Card */}
        <UI.Card accentColor={selectedColor} className="flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${getBgOpacity20Class(selectedColor)} flex items-center justify-center font-bold text-lg ${getTextClass(selectedColor)} shrink-0`}>
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
            <UI.Button variant="secondary" accentColor={selectedColor} className="py-1.5! px-3! text-[10px]">
              Jadwal Sesi
            </UI.Button>
          </div>
        </UI.Card>
      </div>
    );
  };

  // 6. Modal trigger section
  const renderModalSection = () => (
    <UI.Card accentColor={selectedColor}>
      <UI.Heading>5. Dialog & Modals</UI.Heading>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
        Tampilkan kotak dialog overlay modal interaktif. Estetika modal, overlay luar, dan efek visualnya akan menyesuaikan dengan tema gaya yang aktif saat ini.
      </p>
      <UI.Button variant="primary" accentColor={selectedColor} onClick={() => setIsModalOpen(true)}>
        Buka Preview Modal
      </UI.Button>
    </UI.Card>
  );

  // 7. Accordion Component
  const renderAccordion = () => {
    const faqData = [
      { id: 1, q: "Bagaimana alur pembelajaran di Sakode?", a: "Siswa akan mendapatkan kurikulum terstruktur, video materi, dan sesi live mentoring 1-on-1 bersama praktisi industri IT." },
      { id: 2, q: "Apakah ada penyaluran kerja setelah lulus?", a: "Ya, Sakode bekerja sama dengan berbagai startup dan tech company lokal untuk menyalurkan lulusan terbaik melalui program plotting." }
    ];

    return (
      <UI.Card accentColor={selectedColor}>
        <UI.Heading>7. Silabus & FAQs (Accordion)</UI.Heading>
        <UI.Accordion
          items={faqData}
          activeId={activeAccordion}
          onToggle={(id: number) => setActiveAccordion(activeAccordion === id ? null : id)}
        />
      </UI.Card>
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
      <UI.Card accentColor={selectedColor}>
        <UI.Heading>8. Jalur Pendaftaran (Steps Timeline)</UI.Heading>
        <UI.Timeline steps={steps} accentColor={selectedColor} />
      </UI.Card>
    );
  };

  // 3. Badge & Status Tags
  const renderBadges = () => {
    return (
      <UI.Card accentColor={selectedColor}>
        <UI.Heading>9. Status Tags & Level</UI.Heading>
        <div className="flex flex-wrap gap-2.5">
          <UI.Badge variant="accent" accentColor={selectedColor}>Pemula (Basic)</UI.Badge>
          <UI.Badge variant="success">Booking Sukses</UI.Badge>
          <UI.Badge variant="warning">Rescheduled</UI.Badge>
          <UI.Badge variant="default">Kelas Trial</UI.Badge>
        </div>
      </UI.Card>
    );
  };

  // 4. Avatar Group
  const renderAvatarGroup = () => {
    return (
      <UI.Card accentColor={selectedColor}>
        <UI.Heading>10. Enrolled Students</UI.Heading>
        <div className="flex items-center gap-3">
          <UI.AvatarGroup initials={["AN", "BS", "CL", "DK"]} extraCount={14} accentColor={selectedColor} />
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">18+ Siswa aktif sekelas</span>
        </div>
      </UI.Card>
    );
  };

  // 5. Alert Callouts
  const renderAlerts = () => {
    return (
      <UI.Card accentColor={selectedColor}>
        <UI.Heading>11. System Alert Panels</UI.Heading>
        <div className="space-y-3">
          <UI.Alert type="warning" title="Batas Sesi Mentoring">
            Mentoring 1-on-1 dengan Mentor Rian harus diselesaikan sebelum pukul 15.00 WIB.
          </UI.Alert>
          <UI.Alert type="info" title="Pemberitahuan Sistem">
            Portal akademik akan melakukan pemeliharaan rutin pada 28 Juni pukul 02:00 WIB.
          </UI.Alert>
        </div>
      </UI.Card>
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
      <UI.Table schedules={schedules} accentColor={selectedColor} />
    );
  };

  // 7. Card Carousel
  const renderCarousel = () => {
    const testimonials = [
      { name: "Andi Wijaya", role: "Siswa Fullstack", review: "Belajar IT di Sakode sangat terarah. Kurikulum industrinya benar-benar terpakai waktu saya melamar kerja." },
      { name: "Bunga Safira", role: "Siswa Frontend", review: "Sesi live mentoring 1-on-1 membantu saya keluar dari kebuntuan bug coding dalam waktu singkat." },
      { name: "Candra Kirana", role: "Siswa Backend", review: "Penyampaian modul terstruktur dan langsung praktik membuat saya cepat paham konsep backend API." }
    ];

    return (
      <UI.Card accentColor={selectedColor}>
        <UI.Carousel
          testimonials={testimonials}
          activeIndex={carouselIndex}
          onPrev={() => setCarouselIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
          onNext={() => setCarouselIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
          accentColor={selectedColor}
        />
      </UI.Card>
    );
  };

  // 8. Interactive Chart
  const renderChart = () => {
    const bars = [
      { label: "M1", val: "h-[30%]" },
      { label: "M2", val: "h-[50%]" },
      { label: "M3", val: "h-[45%]" },
      { label: "M4", val: "h-[85%]" },
      { label: "M5", val: "h-[95%]" }
    ];

    return (
      <UI.Card accentColor={selectedColor}>
        <UI.Heading>14. Statistik Ujian Tugas (Chart)</UI.Heading>
        <UI.Chart bars={bars} accentColor={selectedColor} />
      </UI.Card>
    );
  };

  // 9. Breadcrumbs
  const renderBreadcrumbs = () => {
    const breadcrumbsItems = [
      { label: "Kelas" },
      { label: "Front-End" },
      { label: "Next.js v16 & Tailwind v4", active: true }
    ];

    return (
      <UI.Card accentColor={selectedColor}>
        <UI.Heading>15. Breadcrumbs Path</UI.Heading>
        <UI.Breadcrumbs items={breadcrumbsItems} accentColor={selectedColor} />
      </UI.Card>
    );
  };

  // 10. Dropdown Menu
  const renderDropdown = () => {
    const dropdownItems = [
      { label: "Dashboard Belajar", onClick: () => showToast("info", "Membuka Halaman Dashboard...") },
      { label: "Pengaturan Akun", onClick: () => showToast("info", "Membuka Pengaturan Akun...") }
    ];

    return (
      <UI.Card accentColor={selectedColor}>
        <UI.Heading>16. Dropdown Action Menu</UI.Heading>
        <UI.Dropdown
          isOpen={isDropdownOpen}
          onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          triggerText="Aksi Profil"
          items={dropdownItems}
          accentColor={selectedColor}
        />
      </UI.Card>
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
      <UI.Card accentColor={selectedColor}>
        <UI.Heading>17. Submit Tugas (Drag & Drop Zone)</UI.Heading>
        <UI.UploadZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          uploadedFiles={uploadedFiles}
          onRemoveFile={(idx: number) => {
            setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
            showToast("info", "File dibatalkan.");
          }}
          accentColor={selectedColor}
        />
      </UI.Card>
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
          <UI.Card accentColor={selectedColor} className="md:col-span-2 space-y-3">
            <div className={`inline-block text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded ${getBgOpacity15Class(selectedColor)} ${getTextClass(selectedColor)}`}>
              Layout Grid
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Konsep Bento Grid Layout
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Menyusun komponen berbeda fungsi (button, form, toast trigger, metrik statistik) ke dalam kotak modular asimetris yang adaptif. Sangat cocok untuk menghemat ruang dan menonjolkan visual dashboard.
            </p>
          </UI.Card>
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
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-size-[32px_32px] opacity-70 pointer-events-none z-0" />
          
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
            <UI.Heading>6. Cards & Profiles Showcase</UI.Heading>
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
      />
    </div>
  );
}
