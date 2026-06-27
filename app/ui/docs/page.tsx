"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { COMPONENT_DOCS } from "./_utils/docs-data";
import * as UIStyles from "@/UI";
import { PaletteColorKey, PALETTE_COLORS, getBgClass, getTextClass } from "@/UI/shared/color-utils";
import { Icons } from "@/UI/shared/Icons";
import { showToast } from "../_components/ToastContainer";
import ModalPreview from "../_components/ModalPreview";

interface AccordionItem {
  id: number;
  q: string;
  a: string;
}

interface TimelineStep {
  step: string;
  title: string;
  desc: string;
}

interface ScheduleItem {
  course: string;
  date: string;
  mentor: string;
  status: string;
}

interface TestimonialItem {
  name: string;
  role: string;
  review: string;
}

interface ChartBar {
  label: string;
  val: string;
}

interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface UIComponents {
  Button: React.ComponentType<{
    variant?: "primary" | "secondary";
    accentColor?: PaletteColorKey;
    isLoading?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
  }>;
  Card: React.ComponentType<{
    accentColor?: PaletteColorKey;
    className?: string;
    children?: React.ReactNode;
  }>;
  Heading: React.ComponentType<{
    className?: string;
    children?: React.ReactNode;
  }>;
  Label: React.ComponentType<React.LabelHTMLAttributes<HTMLLabelElement> & {
    children?: React.ReactNode;
  }>;
  Input: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement> & {
    hasError?: boolean;
  }>;
  Select: React.ComponentType<React.SelectHTMLAttributes<HTMLSelectElement> & {
    hasError?: boolean;
    children?: React.ReactNode;
  }>;
  Toggle: React.ComponentType<{
    checked: boolean;
    onChange: () => void;
    accentColor?: PaletteColorKey;
    "aria-label"?: string;
  }>;
  Accordion: React.ComponentType<{
    activeId: number | null;
    onToggle: (id: number) => void;
    items: AccordionItem[];
  }>;
  Timeline: React.ComponentType<{
    accentColor?: PaletteColorKey;
    steps: TimelineStep[];
  }>;
  Badge: React.ComponentType<{
    variant?: "default" | "accent" | "success" | "warning";
    accentColor?: PaletteColorKey;
    children?: React.ReactNode;
  }>;
  AvatarGroup: React.ComponentType<{
    initials: string[];
    extraCount?: number;
    accentColor?: PaletteColorKey;
  }>;
  Alert: React.ComponentType<{
    type?: "info" | "warning";
    title?: string;
    children?: React.ReactNode;
  }>;
  Table: React.ComponentType<{
    accentColor?: PaletteColorKey;
    schedules: ScheduleItem[];
  }>;
  Carousel: React.ComponentType<{
    accentColor?: PaletteColorKey;
    activeIndex: number;
    onPrev: () => void;
    onNext: () => void;
    testimonials: TestimonialItem[];
  }>;
  Chart: React.ComponentType<{
    accentColor?: PaletteColorKey;
    bars: ChartBar[];
  }>;
  Breadcrumbs: React.ComponentType<{
    accentColor?: PaletteColorKey;
    items: BreadcrumbItem[];
  }>;
  Dropdown: React.ComponentType<{
    isOpen: boolean;
    onToggle: () => void;
    triggerText: string;
    accentColor?: PaletteColorKey;
    items: DropdownItem[];
  }>;
  UploadZone: React.ComponentType<{
    isDragging: boolean;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    accentColor?: PaletteColorKey;
    uploadedFiles: string[];
    onRemoveFile: (idx: number) => void;
  }>;
}

export default function ComponentDocsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [selectedComp, setSelectedComp] = useState<string>("Button");
  const [styleName, setStyleName] = useState<string>("sakode-modern");
  const [primaryColor, setPrimaryColor] = useState<PaletteColorKey>("cyan");
  const [secondaryColor, setSecondaryColor] = useState<PaletteColorKey>("orange");
  const [ascentColor, setAscentColor] = useState<PaletteColorKey>("green");
  const [bgPreview, setBgPreview] = useState<"checkerboard" | "light" | "dark">("checkerboard");

  // Knobs for Toast & Modal
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const [toastMessage, setToastMessage] = useState("Selamat! Akun belajar Anda telah aktif.");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Knobs states
  const [buttonVariant, setButtonVariant] = useState<"primary" | "secondary">("primary");
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Daftar Sekarang");

  const [cardContent, setCardContent] = useState("Kuasai Server Actions, Server Components, dan styling modern Tailwind CSS v4 dari dasar hingga standar industri.");

  const [inputPlaceholder, setInputPlaceholder] = useState("Contoh: Budi Santoso");
  const [inputHasError, setInputHasError] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [selectHasError, setSelectHasError] = useState(false);
  const [selectDisabled, setSelectDisabled] = useState(false);

  const [toggleChecked, setToggleChecked] = useState(false);

  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [badgeVariant, setBadgeVariant] = useState<"accent" | "success" | "warning" | "default">("accent");
  const [badgeLabel, setBadgeLabel] = useState("Pemula (Basic)");

  const [avatarExtraCount, setAvatarExtraCount] = useState(14);

  const [alertType, setAlertType] = useState<"warning" | "info">("warning");
  const [alertTitle, setAlertTitle] = useState("Batas Sesi Mentoring");
  const [alertContent, setAlertContent] = useState("Mentoring 1-on-1 dengan Mentor Rian harus diselesaikan sebelum pukul 15.00 WIB.");

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadDragging, setIsUploadDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(["tugas_frontend_week2.zip"]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleStyleChange = (newStyle: string) => {
    setStyleName(newStyle);
    setPrimaryColor("cyan");
    setSecondaryColor("orange");
    setAscentColor("green");
  };

  const activeDoc = COMPONENT_DOCS[selectedComp] || COMPONENT_DOCS.Button;

  // Resolve current active UI style namespace
  const UI = (UIStyles.UI[styleName as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]) as unknown as UIComponents;

  // Knob values object
  const getKnobValues = () => {
    switch (selectedComp) {
      case "Button":
        return { style: styleName, accentColor: (buttonVariant === "primary" ? primaryColor : secondaryColor), variant: buttonVariant, isLoading: buttonIsLoading, disabled: buttonDisabled, label: buttonLabel };
      case "Card":
        return { style: styleName, accentColor: primaryColor, content: cardContent };
      case "Input":
        return { style: styleName, hasError: inputHasError, placeholder: inputPlaceholder, disabled: inputDisabled, value: inputValue };
      case "Select":
        return { style: styleName, hasError: selectHasError, disabled: selectDisabled };
      case "Toggle":
        return { style: styleName, checked: toggleChecked, accentColor: primaryColor };
      case "Accordion":
        return { style: styleName, activeId: activeAccordion };
      case "Timeline":
        return { style: styleName, accentColor: primaryColor };
      case "Badge":
        return { style: styleName, variant: badgeVariant, accentColor: (badgeVariant === "accent" ? ascentColor : primaryColor), label: badgeLabel };
      case "AvatarGroup":
        return { style: styleName, extraCount: avatarExtraCount, accentColor: primaryColor };
      case "Alert":
        return { style: styleName, type: alertType, title: alertTitle, content: alertContent };
      case "Table":
        return { style: styleName, accentColor: primaryColor };
      case "Carousel":
        return { style: styleName, activeIndex: carouselIndex, accentColor: primaryColor };
      case "Chart":
        return { style: styleName, accentColor: primaryColor };
      case "Breadcrumbs":
        return { style: styleName, accentColor: primaryColor };
      case "Dropdown":
        return { style: styleName, isOpen: isDropdownOpen, accentColor: primaryColor };
      case "UploadZone":
        return { style: styleName, isDragging: isUploadDragging, accentColor: primaryColor };
      case "Toast":
        return { style: styleName, toastType, toastMessage };
      case "Modal":
        return { style: styleName, primaryColor, secondaryColor, ascentColor, isOpen: isModalOpen };
      default:
        return {};
    }
  };

  const generatedCode = activeDoc.codeTemplate(getKnobValues());

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      showToast("success", "Kode berhasil disalin!", styleName);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Render Component Sandbox Preview
  const renderSandboxComponent = () => {
    if (!UI) return <p className="text-zinc-400 text-xs">Error loading component namespace.</p>;

    try {
      switch (selectedComp) {
        case "Button":
          return (
            <UI.Button
              variant={buttonVariant}
              accentColor={buttonVariant === "primary" ? primaryColor : secondaryColor}
              isLoading={buttonIsLoading}
              disabled={buttonDisabled}
            >
              {buttonLabel || "Daftar Sekarang"}
            </UI.Button>
          );
        case "Card":
          return (
            <UI.Card accentColor={primaryColor} className="max-w-md w-full">
              <UI.Heading>Next.js & React Bootcamp</UI.Heading>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                {cardContent || "Isi deskripsi modul atau program di sini."}
              </p>
              <div className="flex items-center justify-between border-t border-zinc-200/50 dark:border-zinc-800/60 pt-3">
                <span className="text-xs text-zinc-400">32 Modul</span>
                <span className={`text-xs font-bold ${getTextClass(primaryColor)}`}>Rp 499.000</span>
              </div>
            </UI.Card>
          );
        case "Input":
          return (
            <div className="w-full max-w-sm">
              <UI.Label htmlFor="sandbox-input-demo">Nama Lengkap</UI.Label>
              <UI.Input
                id="sandbox-input-demo"
                type="text"
                placeholder={inputPlaceholder}
                hasError={inputHasError}
                disabled={inputDisabled}
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              />
              {inputHasError && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">Input tidak valid.</p>
              )}
            </div>
          );
        case "Select":
          return (
            <div className="w-full max-w-sm">
              <UI.Label htmlFor="sandbox-select-demo">Program Kursus IT</UI.Label>
              <UI.Select id="sandbox-select-demo" hasError={selectHasError} disabled={selectDisabled}>
                <option value="">-- Pilih Program --</option>
                <option value="fe">Frontend Development (Next.js)</option>
                <option value="be">Backend Engineering (Node.js)</option>
              </UI.Select>
            </div>
          );
        case "Toggle":
          return (
            <div className="flex items-center gap-3">
              <UI.Toggle
                checked={toggleChecked}
                onChange={() => setToggleChecked(!toggleChecked)}
                accentColor={primaryColor}
                aria-label="Contoh Switch"
              />
              <span className="text-xs font-semibold text-zinc-500">
                {toggleChecked ? "Aktif (Checked)" : "Nonaktif (Unchecked)"}
              </span>
            </div>
          );
        case "Accordion":
          return (
            <div className="w-full max-w-md">
              <UI.Accordion
                activeId={activeAccordion}
                onToggle={(id: number) => setActiveAccordion(activeAccordion === id ? null : id)}
                items={[
                  { id: 1, q: "Apakah kurikulum diupdate rutin?", a: "Ya, kurikulum disesuaikan dengan rilisan teknologi web modern (misal Next.js v16 & Tailwind v4)." },
                  { id: 2, q: "Bagaimana sistem mentoringnya?", a: "Mentoring berjalan secara 1-on-1 privat bersama mentor praktisi industri." }
                ]}
              />
            </div>
          );
        case "Timeline":
          return (
            <div className="w-full max-w-md">
              <UI.Timeline
                accentColor={primaryColor}
                steps={[
                  { step: "01", title: "Registrasi Akun", desc: "Buat akun belajar di portal akademik." },
                  { step: "02", title: "Pilih Kelas IT", desc: "Pilih kurikulum belajar pemrograman Anda." }
                ]}
              />
            </div>
          );
        case "Badge":
          return (
            <UI.Badge variant={badgeVariant} accentColor={badgeVariant === "accent" ? ascentColor : primaryColor}>
              {badgeLabel || "Status Tag"}
            </UI.Badge>
          );
        case "AvatarGroup":
          return (
            <UI.AvatarGroup
              initials={["AN", "BS", "CL"]}
              extraCount={avatarExtraCount}
              accentColor={primaryColor}
            />
          );
        case "Alert":
          return (
            <div className="w-full max-w-md">
              <UI.Alert type={alertType} title={alertTitle}>
                {alertContent || "Isi konten notice/banner pengumuman."}
              </UI.Alert>
            </div>
          );
        case "Table":
          return (
            <div className="w-full max-w-md overflow-hidden bg-white/40 dark:bg-zinc-955/20 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/40">
              <UI.Table
                accentColor={primaryColor}
                schedules={[
                  { course: "Next.js & Tailwind v4", date: "24 Juni, 10:00", mentor: "Rian Y.", status: "Aktif" },
                  { course: "Git & Version Control", date: "25 Juni, 13:00", mentor: "Sarah D.", status: "Selesai" }
                ]}
              />
            </div>
          );
        case "Carousel":
          return (
            <div className="w-full max-w-md p-4 bg-white/40 dark:bg-zinc-955/20 rounded-xl border border-zinc-200/50 dark:border-zinc-800/40">
              <UI.Carousel
                accentColor={primaryColor}
                activeIndex={carouselIndex}
                onPrev={() => setCarouselIndex((prev) => (prev === 0 ? 2 : prev - 1))}
                onNext={() => setCarouselIndex((prev) => (prev === 2 ? 0 : prev + 1))}
                testimonials={[
                  { name: "Andi Wijaya", role: "Siswa Fullstack", review: "Belajar IT di Sakode sangat terarah. Kurikulumnya sangat terpakai." },
                  { name: "Bunga Safira", role: "Siswa Frontend", review: "Sesi live mentoring 1-on-1 sangat membantu saya keluar dari bug coding." },
                  { name: "Candra Kirana", role: "Siswa Backend", review: "Penyampaian modul terstruktur dan langsung praktik." }
                ]}
              />
            </div>
          );
        case "Chart":
          return (
            <div className="w-full max-w-md p-4 bg-white/40 dark:bg-zinc-955/20 rounded-xl border border-zinc-200/50 dark:border-zinc-800/40">
              <UI.Chart
                accentColor={primaryColor}
                bars={[
                  { label: "M1", val: "h-[30%]" },
                  { label: "M2", val: "h-[65%]" },
                  { label: "M3", val: "h-[50%]" },
                  { label: "M4", val: "h-[85%]" }
                ]}
              />
            </div>
          );
        case "Breadcrumbs":
          return (
            <UI.Breadcrumbs
              accentColor={primaryColor}
              items={[
                { label: "Kelas" },
                { label: "Frontend" },
                { label: "React 19", active: true }
              ]}
            />
          );
        case "Dropdown":
          return (
            <div className="h-44">
              <UI.Dropdown
                isOpen={isDropdownOpen}
                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                triggerText="Opsi Kontrol"
                accentColor={primaryColor}
                items={[
                  { label: "Buka Dashboard", onClick: () => showToast("info", "Membuka Dashboard...", styleName) },
                  { label: "Keluar Sesi", onClick: () => showToast("info", "Keluar dari sesi...", styleName) }
                ]}
              />
            </div>
          );
        case "UploadZone":
          return (
            <div className="w-full max-w-sm">
              <UI.UploadZone
                isDragging={isUploadDragging}
                onDragOver={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsUploadDragging(true); }}
                onDragLeave={() => setIsUploadDragging(false)}
                onDrop={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsUploadDragging(false); }}
                accentColor={primaryColor}
                uploadedFiles={uploadedFiles}
                onRemoveFile={(idx: number) => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
              />
            </div>
          );
        case "Toast":
          return (
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs text-zinc-500 text-center max-w-xs leading-relaxed">
                Gunakan tombol di bawah untuk menyimulasikan pemicuan pesan notifikasi toast interaktif.
              </span>
              <button
                type="button"
                onClick={() => showToast(toastType, toastMessage, styleName)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
              >
                Picu Toast ({toastType})
              </button>
            </div>
          );
        case "Modal":
          return (
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs text-zinc-500 text-center max-w-xs leading-relaxed">
                Gunakan tombol di bawah untuk membuka simulasi kotak dialog overlay modal.
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
              >
                Buka Modal Preview
              </button>
              
              <ModalPreview
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                style={styleName}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                ascentColor={ascentColor}
              />
            </div>
          );
        default:
          return null;
      }
    } catch (err) {
      return (
        <div className="text-red-500 text-xs font-semibold p-4 border border-red-500/20 bg-red-500/5 rounded-xl">
          Komponen gagal dirender pada gaya {styleName}. Galat: {(err as Error).message}
        </div>
      );
    }
  };

  // Render Control Knobs per Component
  const renderControlsKnobs = () => {
    switch (selectedComp) {
      case "Button":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="button-label-input" className="block text-xs font-bold text-zinc-500 mb-1.5">Label Tombol</label>
              <input
                id="button-label-input"
                type="text"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="button-variant-select" className="block text-xs font-bold text-zinc-500 mb-1.5">Varian Button</label>
              <select
                id="button-variant-select"
                value={buttonVariant}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setButtonVariant(e.target.value as "primary" | "secondary")}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs cursor-pointer focus:outline-hidden"
              >
                <option value="primary">primary (Solid Accent)</option>
                <option value="secondary">secondary (Alternative/Soft)</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-1">
              <label htmlFor="button-loading-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Loading State</label>
              <input
                id="button-loading-checkbox"
                type="checkbox"
                checked={buttonIsLoading}
                onChange={(e) => setButtonIsLoading(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <label htmlFor="button-disabled-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Disabled State</label>
              <input
                id="button-disabled-checkbox"
                type="checkbox"
                checked={buttonDisabled}
                onChange={(e) => setButtonDisabled(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
              />
            </div>
          </div>
        );
      case "Card":
        return (
          <div>
            <label htmlFor="card-content-textarea" className="block text-xs font-bold text-zinc-500 mb-1.5">Konten Deskripsi Kartu</label>
            <textarea
              id="card-content-textarea"
              value={cardContent}
              onChange={(e) => setCardContent(e.target.value)}
              rows={3}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-hidden resize-none"
            />
          </div>
        );
      case "Input":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="input-placeholder-input" className="block text-xs font-bold text-zinc-500 mb-1.5">Placeholder</label>
              <input
                id="input-placeholder-input"
                type="text"
                value={inputPlaceholder}
                onChange={(e) => setInputPlaceholder(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label htmlFor="input-value-input" className="block text-xs font-bold text-zinc-500 mb-1.5">Simulasi Nilai Input</label>
              <input
                id="input-value-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <label htmlFor="input-error-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Error State</label>
              <input
                id="input-error-checkbox"
                type="checkbox"
                checked={inputHasError}
                onChange={(e) => setInputHasError(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <label htmlFor="input-disabled-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Disabled State</label>
              <input
                id="input-disabled-checkbox"
                type="checkbox"
                checked={inputDisabled}
                onChange={(e) => setInputDisabled(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
              />
            </div>
          </div>
        );
      case "Select":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <label htmlFor="select-error-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Error State</label>
              <input
                id="select-error-checkbox"
                type="checkbox"
                checked={selectHasError}
                onChange={(e) => setSelectHasError(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <label htmlFor="select-disabled-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Disabled State</label>
              <input
                id="select-disabled-checkbox"
                type="checkbox"
                checked={selectDisabled}
                onChange={(e) => setSelectDisabled(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
              />
            </div>
          </div>
        );
      case "Toggle":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <label htmlFor="toggle-checked-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Status Aktif (Checked)</label>
              <input
                id="toggle-checked-checkbox"
                type="checkbox"
                checked={toggleChecked}
                onChange={(e) => setToggleChecked(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
              />
            </div>
          </div>
        );
      case "Accordion":
        return (
          <div>
            <span className="block text-xs font-bold text-zinc-500 mb-1.5">Buka Item ID (Accordion)</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveAccordion(null)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                  activeAccordion === null ? "bg-indigo-600 text-white border-transparent" : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                Tutup Semua
              </button>
              <button
                type="button"
                onClick={() => setActiveAccordion(1)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                  activeAccordion === 1 ? "bg-indigo-600 text-white border-transparent" : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                Item 1
              </button>
              <button
                type="button"
                onClick={() => setActiveAccordion(2)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                  activeAccordion === 2 ? "bg-indigo-600 text-white border-transparent" : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                Item 2
              </button>
            </div>
          </div>
        );
      case "Badge":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="badge-label-input" className="block text-xs font-bold text-zinc-500 mb-1.5">Teks Label Badge</label>
              <input
                id="badge-label-input"
                type="text"
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label htmlFor="badge-variant-select" className="block text-xs font-bold text-zinc-500 mb-1.5">Varian Status</label>
              <select
                id="badge-variant-select"
                value={badgeVariant}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBadgeVariant(e.target.value as "default" | "accent" | "success" | "warning")}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs cursor-pointer focus:outline-hidden"
              >
                <option value="default">default (Grey)</option>
                <option value="accent">accent (Theme Brand Accent)</option>
                <option value="success">success (Green Tag)</option>
                <option value="warning">warning (Orange/Yellow Tag)</option>
              </select>
            </div>
          </div>
        );
      case "AvatarGroup":
        return (
          <div>
            <label htmlFor="avatar-count-input" className="block text-xs font-bold text-zinc-500 mb-1.5">Angka Counter Sisa Murid (+X)</label>
            <input
              id="avatar-count-input"
              type="number"
              value={avatarExtraCount}
              onChange={(e) => setAvatarExtraCount(Number(e.target.value))}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        );
      case "Alert":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="alert-title-input" className="block text-xs font-bold text-zinc-500 mb-1.5">Judul Alert</label>
              <input
                id="alert-title-input"
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label htmlFor="alert-content-textarea" className="block text-xs font-bold text-zinc-500 mb-1.5">Isi Pesan Notifikasi</label>
              <textarea
                id="alert-content-textarea"
                value={alertContent}
                onChange={(e) => setAlertContent(e.target.value)}
                rows={3}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>
            <div>
              <label htmlFor="alert-type-select" className="block text-xs font-bold text-zinc-500 mb-1.5">Tipe Status Alert</label>
              <select
                id="alert-type-select"
                value={alertType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAlertType(e.target.value as "info" | "warning")}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs cursor-pointer focus:outline-hidden"
              >
                <option value="info">info (Blue Banner)</option>
                <option value="warning">warning (Orange Banner)</option>
              </select>
            </div>
          </div>
        );
      case "Carousel":
        return (
          <div>
            <span className="block text-xs font-bold text-zinc-500 mb-1.5">Simulasi Slide Index Aktif</span>
            <div className="flex gap-2">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCarouselIndex(idx)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                    carouselIndex === idx ? "bg-indigo-600 text-white border-transparent" : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  Slide {idx + 1}
                </button>
              ))}
            </div>
          </div>
        );
      case "Dropdown":
        return (
          <div className="flex items-center justify-between py-1">
            <label htmlFor="dropdown-open-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Dropdown Terbuka (IsOpen)</label>
            <input
              id="dropdown-open-checkbox"
              type="checkbox"
              checked={isDropdownOpen}
              onChange={(e) => setIsDropdownOpen(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
            />
          </div>
        );
      case "UploadZone":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <label htmlFor="upload-dragging-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">State Seret File (isDragging)</label>
              <input
                id="upload-dragging-checkbox"
                type="checkbox"
                checked={isUploadDragging}
                onChange={(e) => setIsUploadDragging(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
              />
            </div>
            <div>
              <span className="block text-xs font-bold text-zinc-500 mb-1.5">Daftar File Pengumpulan (Simulasi)</span>
              <div className="space-y-1">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1 px-2 text-[10px] bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200/50">
                    <span className="truncate font-semibold">{file}</span>
                    <button
                      onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-650"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                {uploadedFiles.length === 0 && (
                  <button
                    onClick={() => setUploadedFiles(["tugas_kirim.zip"])}
                    className="text-[10px] text-indigo-600 hover:underline"
                  >
                    + Tambah File Simulasi
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      case "Toast":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="toast-message-input" className="block text-xs font-bold text-zinc-500 mb-1.5">Teks Pesan Toast</label>
              <input
                id="toast-message-input"
                type="text"
                value={toastMessage}
                onChange={(e) => setToastMessage(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label htmlFor="toast-type-select" className="block text-xs font-bold text-zinc-500 mb-1.5">Tipe Toast</label>
              <select
                id="toast-type-select"
                value={toastType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setToastType(e.target.value as "success" | "error" | "info")}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs cursor-pointer focus:outline-hidden"
              >
                <option value="success">success (Success/Green)</option>
                <option value="error">error (Error/Red)</option>
                <option value="info">info (Info/Blue)</option>
              </select>
            </div>
          </div>
        );
      case "Modal":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <label htmlFor="modal-open-checkbox" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Status Terbuka (IsOpen)</label>
              <input
                id="modal-open-checkbox"
                type="checkbox"
                checked={isModalOpen}
                onChange={(e) => setIsModalOpen(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-400 h-4 w-4"
              />
            </div>
          </div>
        );
      default:
        return <p className="text-xs text-zinc-400 italic">Tidak ada kontrol parameter kustom untuk komponen ini.</p>;
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in relative z-10">
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/45 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
          Interactive Playbook
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Dokumentasi Komponen Pustaka UI</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-3xl leading-relaxed">
          Sandbox interaktif ala HeroUI. Pilih komponen di sidebar, ubah parameter di panel kontrol, lihat *live preview* di berbagai tema gaya visual, dan salin langsung kode JSX-nya untuk mempercepat pengembangan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-3 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-850 p-4 space-y-4">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-1">Daftar Komponen UI</span>
          <nav className="space-y-1 max-h-125 overflow-y-auto pr-1">
            {Object.keys(COMPONENT_DOCS).map((key) => {
              const isActive = selectedComp === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedComp(key);
                    setIsDropdownOpen(false);
                    setActiveAccordion(null);
                  }}
                  className={`w-full text-left text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <span>{key}</span>
                  {isActive && <Icons.Check className="w-3.5 h-3.5 text-current" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Central Workspace: Preview & Controls */}
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Area: Sandbox & Preview */}
            <div className="md:col-span-8 space-y-6">
              {/* Toolbar Settings */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-100/60 dark:bg-zinc-950/20 p-3.5 rounded-xl border border-zinc-200/40 dark:border-zinc-800/30">
                <div className="flex items-center gap-3">
                  <label htmlFor="style-name-select" className="text-xs font-bold text-zinc-400 cursor-pointer">Gaya UI:</label>
                  <select
                    id="style-name-select"
                    value={styleName}
                    onChange={(e) => handleStyleChange(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs cursor-pointer font-bold focus:outline-hidden"
                  >
                    <option value="claymorphism">Claymorphism</option>
                    <option value="neobrutalism">Neobrutalism</option>
                    <option value="glassmorphism">Glassmorphism</option>
                    <option value="liquid-glass">Liquid Glass</option>
                    <option value="bento-grid">Bento Grid</option>
                    <option value="minimalism">Minimalism</option>
                    <option value="sakode-modern">Sakode Modern</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-400">Latar Preview:</span>
                  <div className="flex p-0.5 bg-zinc-200 dark:bg-zinc-900 rounded-lg border border-zinc-300/40 dark:border-zinc-800/40">
                    {(["checkerboard", "light", "dark"] as const).map((bg) => (
                      <button
                        key={bg}
                        onClick={() => setBgPreview(bg)}
                        className={`text-[10px] font-bold py-1 px-2.5 rounded-md uppercase transition-all ${
                          bgPreview === bg
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                        }`}
                      >
                        {bg === "checkerboard" ? "Grid" : bg}
                      </button>
                    ))}
                  </div>
                </div>

                {mounted && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-400">Mode Tema:</span>
                    <div className="flex p-0.5 bg-zinc-200 dark:bg-zinc-900 rounded-lg border border-zinc-300/40 dark:border-zinc-800/40">
                      <button
                        type="button"
                        onClick={() => {
                          setTheme("light");
                          showToast("success", "Mode Terang Aktif", styleName);
                        }}
                        className={`text-[10px] font-bold py-1 px-2.5 rounded-md transition-all ${
                          resolvedTheme !== "dark"
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-955 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-350"
                        }`}
                      >
                        Terang
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTheme("dark");
                          showToast("success", "Mode Gelap Aktif", styleName);
                        }}
                        className={`text-[10px] font-bold py-1 px-2.5 rounded-md transition-all ${
                          resolvedTheme === "dark"
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-955 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-355"
                        }`}
                      >
                        Gelap
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview Container */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Live Render Preview</span>
                <div
                  className={`relative w-full min-h-64 border border-zinc-200 dark:border-zinc-850 rounded-2xl flex items-center justify-center p-8 overflow-hidden transition-colors ${
                    bgPreview === "light"
                      ? "bg-zinc-50"
                      : bgPreview === "dark"
                      ? "bg-zinc-950"
                      : "bg-zinc-100 dark:bg-zinc-955 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-size-[16px_16px]"
                  }`}
                >
                  {/* Subtle background nodes simulation for liquid glass inside preview container */}
                  {styleName === "liquid-glass" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80">
                      <div className="absolute w-24 h-24 bg-sakode-pink/20 rounded-full blur-xl top-6 left-6 animate-pulse" />
                      <div className="absolute w-24 h-24 bg-sakode-orange/20 rounded-full blur-xl bottom-6 right-6 animate-pulse" />
                    </div>
                  )}

                  {/* Subtle background grids for sakode-modern preview container */}
                  {styleName === "sakode-modern" && (
                    <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-size-[16px_16px]" />
                  )}

                  <div className={`relative z-10 flex w-full items-center justify-center ${
                    bgPreview === "dark" || (bgPreview === "checkerboard" && resolvedTheme === "dark")
                      ? "dark text-zinc-100"
                      : "text-zinc-900"
                  }`}>
                    {renderSandboxComponent()}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Area: Sandbox Controls Panel */}
            <div className="md:col-span-4 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 space-y-6">
              <h2 className="text-sm font-extrabold text-zinc-900 dark:text-white border-b border-zinc-150 dark:border-zinc-800 pb-3 flex items-center gap-1.5">
                <span>Parameter Sandbox</span>
              </h2>

              {/* Component Specific Controls */}
              <div className="space-y-5">
                {renderControlsKnobs()}
              </div>

              {/* Color Customizers Panel */}
              <div className="border-t border-zinc-150 dark:border-zinc-800 pt-5 space-y-4">
                {/* 1. Primary Color Selector */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-zinc-500">Warna Utama (Primary Color) - Default: Cyan</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {PALETTE_COLORS.map((c) => {
                      const isSelected = primaryColor === c.key;
                      return (
                        <button
                          key={c.key}
                          onClick={() => setPrimaryColor(c.key)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${getBgClass(c.key)} ${
                            isSelected
                              ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-955 scale-110"
                              : "border-black/10 hover:scale-105"
                          }`}
                          title={c.name}
                          aria-label={c.name}
                        >
                          {isSelected && <Icons.Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Secondary Color Selector */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-zinc-500">Warna Sekunder (Secondary Color) - Default: Orange</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {PALETTE_COLORS.map((c) => {
                      const isSelected = secondaryColor === c.key;
                      return (
                        <button
                          key={c.key}
                          onClick={() => setSecondaryColor(c.key)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${getBgClass(c.key)} ${
                            isSelected
                              ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-955 scale-110"
                              : "border-black/10 hover:scale-105"
                          }`}
                          title={c.name}
                          aria-label={c.name}
                        >
                          {isSelected && <Icons.Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Ascent Color Selector */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-zinc-500">Warna Aksen / Ascent (Ascent Color) - Default: Hijau</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {PALETTE_COLORS.map((c) => {
                      const isSelected = ascentColor === c.key;
                      return (
                        <button
                          key={c.key}
                          onClick={() => setAscentColor(c.key)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${getBgClass(c.key)} ${
                            isSelected
                              ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-955 scale-110"
                              : "border-black/10 hover:scale-105"
                          }`}
                          title={c.name}
                          aria-label={c.name}
                        >
                          {isSelected && <Icons.Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Code Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">JSX / TSX Generated Code</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {copied ? (
                  <>
                    <Icons.Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-[#0c0d12] p-5">
              <pre className="text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed select-all whitespace-pre-wrap">
                {generatedCode}
              </pre>
            </div>
          </div>

          {/* Component API Props Reference */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>API Props Reference:</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-150 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-350">
                {activeDoc.name}
              </span>
            </h3>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">
              {activeDoc.description}
            </p>

            <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-850 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-100/80 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-850 text-zinc-500 font-extrabold">
                    <th className="py-3 px-4">Properti</th>
                    <th className="py-3 px-4">Tipe Data</th>
                    <th className="py-3 px-4">Nilai Default</th>
                    <th className="py-3 px-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-850">
                  {activeDoc.props.map((prop) => (
                    <tr key={prop.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{prop.name}</td>
                      <td className="py-3 px-4 font-mono text-[10px] text-zinc-600 dark:text-zinc-300">{prop.type}</td>
                      <td className="py-3 px-4 font-mono text-[10px] text-zinc-450 dark:text-zinc-500">{prop.defaultValue}</td>
                      <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">{prop.description}</td>
                    </tr>
                  ))}
                  {activeDoc.props.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-zinc-400 italic">Komponen ini tidak membutuhkan parameter props kustom tambahan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
