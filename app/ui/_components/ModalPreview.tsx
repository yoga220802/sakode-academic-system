"use client";

import React from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useTheme } from "next-themes";
import { Icons } from "@/UI/shared/Icons";
import { UI as UIStyles } from "@/UI";
import {
  PaletteColorKey,
  getBgOpacity20Class,
  getBgOpacity10Class,
  getBgOpacity5Class,
} from "@/UI/shared/color-utils";

interface ModalPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  style: string;
  primaryColor?: PaletteColorKey;
  secondaryColor?: PaletteColorKey;
  ascentColor?: PaletteColorKey;
}

export default function ModalPreview({
  isOpen,
  onClose,
  style,
  primaryColor = "cyan",
  secondaryColor = "orange",
  ascentColor = "green",
}: ModalPreviewProps) {
  const { resolvedTheme } = useTheme();
  
  // Resolve the visual style namespace
  const UI = (UIStyles[style as keyof typeof UIStyles] || UIStyles["sakode-modern"]) as {
    Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { accentColor?: string }>;
    Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>>;
    Button: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary"; accentColor?: string; isLoading?: boolean } & React.RefAttributes<HTMLButtonElement>>;
  };

  // Styles for the backdrop overlay
  const getOverlayClass = () => {
    switch (style) {
      case "claymorphism":
        return "bg-slate-900/30 backdrop-blur-xs";
      case "neobrutalism":
        return "bg-black/60";
      case "glassmorphism":
      case "liquid-glass":
      case "sakode-modern":
        return "bg-black/40 backdrop-blur-md";
      case "minimalism":
        return "bg-zinc-955/20 backdrop-blur-xs";
      case "bento-grid":
      default:
        return "bg-zinc-900/40 backdrop-blur-xs";
    }
  };

  // Modal animations
  const getModalAnimation = () => {
    switch (style) {
      case "claymorphism":
        return {
          initial: { scale: 0.85, y: 50, opacity: 0 },
          animate: { scale: 1, y: 0, opacity: 1 },
          exit: { scale: 0.85, y: 30, opacity: 0 },
          transition: { type: "spring", stiffness: 350, damping: 20 },
        };
      case "neobrutalism":
        return {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          transition: { duration: 0.1, ease: "linear" },
        };
      case "glassmorphism":
      case "liquid-glass":
      case "sakode-modern":
        return {
          initial: { scale: 0.92, y: -20, opacity: 0, filter: "blur(5px)" },
          animate: { scale: 1, y: 0, opacity: 1, filter: "blur(0px)" },
          exit: { scale: 0.92, y: 15, opacity: 0, filter: "blur(5px)" },
          transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        };
      case "minimalism":
      default:
        return {
          initial: { y: 15, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 10, opacity: 0 },
          transition: { duration: 0.2, ease: "easeOut" },
        };
    }
  };

  const anim = getModalAnimation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 w-full h-full ${getOverlayClass()}`}
          />

          {/* Modal Container */}
          <motion.div
            initial={anim.initial}
            animate={anim.animate}
            exit={anim.exit}
            transition={anim.transition as unknown as Transition}
            className="w-full max-w-lg relative z-10 pointer-events-auto"
          >
            <UI.Card accentColor={primaryColor} className="border border-zinc-200/50 dark:border-zinc-800/80">
              {/* Liquid Blobs inside the Modal overlay for liquid glass */}
              {style === "liquid-glass" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <div className={`absolute w-32 h-32 rounded-full ${getBgOpacity20Class(primaryColor)} blur-2xl top-[-20%] left-[-20%]`} />
                  <div className={`absolute w-32 h-32 rounded-full ${getBgOpacity10Class(primaryColor)} blur-2xl bottom-[-20%] right-[-20%]`} />
                </div>
              )}

              {/* Grid backdrop overlay for sakode-modern */}
              {style === "sakode-modern" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-size-[16px_16px] opacity-40" />
                  <div className={`absolute w-36 h-36 rounded-full ${getBgOpacity5Class(primaryColor)} dark:${getBgOpacity10Class(primaryColor)} blur-2xl top-[-20%] left-[-20%]`} />
                  <div className={`absolute w-36 h-36 rounded-full ${getBgOpacity5Class(primaryColor)} dark:${getBgOpacity5Class(primaryColor)} blur-2xl bottom-[-20%] right-[-20%]`} />
                </div>
              )}

              {/* Content Body */}
              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3">
                  <div>
                    <UI.Label className="mb-0.5!">Preview Modal</UI.Label>
                    <h3
                      className={`text-xl font-bold ${
                        style === "neobrutalism" ? "font-mono uppercase tracking-wide text-zinc-900 dark:text-white" : ""
                      }`}
                    >
                      Detail Kelas Pemrograman IT
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-150/50 dark:hover:bg-zinc-850/50 transition-colors"
                    aria-label="Tutup modal"
                    title="Tutup modal"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body details */}
                <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  <p>
                    Sistem Akademik kursus intensif **Sakode Academy** menawarkan kurikulum berkualitas dengan kolokasi modul yang dirancang secara profesional.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/20">
                      <span className="block text-[10px] uppercase font-bold text-zinc-400">Mentor Aktif</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">Pratama Rian</span>
                    </div>
                    <div className="p-3 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/20">
                      <span className="block text-[10px] uppercase font-bold text-zinc-400">Durasi Kursus</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">12 Minggu Sesi</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 pt-1">
                    * Dengan mendaftar, Anda akan dialokasikan ke mentor yang sesuai dalam waktu 1x24 jam.
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
                  <UI.Button variant="secondary" onClick={onClose} accentColor={secondaryColor}>
                    Kembali
                  </UI.Button>
                  <UI.Button
                    variant="primary"
                    onClick={() => {
                      onClose();
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("sakode-toast", {
                            detail: {
                              type: "success",
                              message: "Pendaftaran kelas berhasil dikirim langsung dari Modal!",
                              style: style,
                            },
                          })
                        );
                      }
                    }}
                    accentColor={primaryColor}
                  >
                    Mulai Bergabung
                  </UI.Button>
                </div>
              </div>
            </UI.Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
