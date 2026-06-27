"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { Icons } from "./Icons";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  style?: string;
}

export function showToast(type: ToastItem["type"], message: string, style?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("sakode-toast", { detail: { type, message, style } })
    );
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const params = useParams();
  const currentStyle = (params?.style as string) || "minimalism";

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<Omit<ToastItem, "id">>;
      const newToast: ToastItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: customEvent.detail.type,
        message: customEvent.detail.message,
        style: customEvent.detail.style,
      };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener("sakode-toast", handleToast);
    return () => window.removeEventListener("sakode-toast", handleToast);
  }, []);

  const getStyleClasses = (type: ToastItem["type"], itemStyle: string) => {
    switch (itemStyle) {
      case "claymorphism": {
        const bgColors = {
          success: "bg-emerald-50 dark:bg-zinc-800 text-emerald-800 dark:text-emerald-300 border-emerald-250 dark:border-emerald-800/40",
          error: "bg-rose-50 dark:bg-zinc-800 text-rose-800 dark:text-rose-300 border-rose-250 dark:border-rose-800/40",
          info: "bg-sky-50 dark:bg-zinc-800 text-sky-800 dark:text-sky-300 border-sky-250 dark:border-sky-800/40",
          warning: "bg-amber-50 dark:bg-zinc-800 text-amber-800 dark:text-amber-300 border-amber-250 dark:border-amber-800/40",
        };
        return `${bgColors[type]} rounded-2xl border shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.06),_inset_3px_3px_8px_rgba(255,255,255,0.9),_4px_4px_16px_rgba(0,0,0,0.12)] p-4`;
      }
      case "neobrutalism": {
        const bgColors = {
          success: "bg-emerald-400 text-black",
          error: "bg-rose-400 text-black",
          info: "bg-cyan-400 text-black",
          warning: "bg-sakode-yellow text-black",
        };
        return `${bgColors[type]} border-3 border-zinc-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] font-mono font-bold p-4`;
      }
      case "glassmorphism": {
        const borderColors = {
          success: "border-emerald-500/40 text-emerald-850 dark:text-emerald-300 bg-emerald-100/95 dark:bg-emerald-950/80",
          error: "border-rose-500/40 text-rose-850 dark:text-rose-300 bg-rose-100/95 dark:bg-rose-950/80",
          info: "border-sky-500/40 text-sky-850 dark:text-sky-300 bg-sky-100/95 dark:bg-sky-950/80",
          warning: "border-amber-500/40 text-amber-850 dark:text-amber-300 bg-amber-100/95 dark:bg-amber-950/80",
        };
        return `${borderColors[type]} backdrop-blur-lg border rounded-xl shadow-lg p-4`;
      }
      case "liquid-glass": {
        const glowGradients = {
          success: "border-emerald-500/45 text-emerald-850 dark:text-emerald-300 bg-emerald-50/95 dark:bg-zinc-900/90 dark:bg-gradient-to-br dark:from-emerald-500/15 dark:to-teal-500/5",
          error: "border-rose-500/45 text-rose-850 dark:text-rose-300 bg-rose-50/95 dark:bg-zinc-900/90 dark:bg-gradient-to-br dark:from-rose-500/15 dark:to-pink-500/5",
          info: "border-sky-500/45 text-sky-850 dark:text-sky-300 bg-sky-50/95 dark:bg-zinc-900/90 dark:bg-gradient-to-br dark:from-sky-500/15 dark:to-blue-500/5",
          warning: "border-amber-500/45 text-amber-850 dark:text-amber-300 bg-amber-50/95 dark:bg-zinc-900/90 dark:bg-gradient-to-br dark:from-amber-500/15 dark:to-orange-500/5",
        };
        return `${glowGradients[type]} backdrop-blur-xl border-2 rounded-2xl shadow-[0_0_25px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_0_25px_-5px_rgba(255,255,255,0.1)] p-4`;
      }
      case "minimalism":
      case "bento-grid":
      default: {
        const borderColors = {
          success: "border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100",
          error: "border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100",
          info: "border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100",
          warning: "border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100",
        };
        return `${borderColors[type]} bg-white dark:bg-zinc-900 border shadow-sm p-4 rounded-lg text-sm`;
      }
    }
  };

  const getIcon = (type: ToastItem["type"]) => {
    switch (type) {
      case "success":
        return <Icons.Check className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />;
      case "error":
        return <Icons.AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />;
      case "warning":
        return <Icons.AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />;
      case "info":
      default:
        return <Icons.Info className="w-5 h-5 shrink-0 text-sky-600 dark:text-sky-400" />;
    }
  };

  // Set animation configurations per style
  const getAnimationConfig = (itemStyle: string) => {
    switch (itemStyle) {
      case "claymorphism":
        return {
          initial: { opacity: 0, scale: 0.8, y: 50 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.8, y: -20 },
          transition: { type: "spring", stiffness: 350, damping: 15 },
        };
      case "neobrutalism":
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 100 },
          transition: { duration: 0.15, ease: "linear" },
        };
      case "glassmorphism":
      case "liquid-glass":
        return {
          initial: { opacity: 0, y: -30, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          exit: { opacity: 0, y: -20, filter: "blur(5px)" },
          transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        };
      case "minimalism":
      case "bento-grid":
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, transition: { duration: 0.15 } },
          transition: { duration: 0.2, ease: "easeOut" },
        };
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-4 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const toastStyle = toast.style || currentStyle;
          const anim = getAnimationConfig(toastStyle);
          return (
            <motion.div
              key={toast.id}
              initial={anim.initial}
              animate={anim.animate}
              exit={anim.exit}
              transition={anim.transition as unknown as Transition}
              layout
              className={`flex items-start gap-3 w-full relative ${getStyleClasses(
                toast.type,
                toastStyle
              )}`}
            >
              {getIcon(toast.type)}
              <div className="flex-1 text-sm font-medium leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className={
                  toastStyle === "claymorphism"
                    ? "absolute top-3 right-3 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 bg-white/80 dark:bg-zinc-700/85 hover:scale-105 active:scale-95 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.06),_inset_1px_1px_2px_rgba(255,255,255,0.9),_2px_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.3),_inset_1px_1px_2px_rgba(255,255,255,0.06),_2px_2px_4px_rgba(0,0,0,0.2)] border border-zinc-200/50 dark:border-zinc-600/50 rounded-full p-1 transition-all cursor-pointer"
                    : toastStyle === "neobrutalism"
                    ? "absolute top-3 right-3 text-black hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black border-2 border-black dark:border-white shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] dark:shadow-[1.5px_1.5px_0px_rgba(255,255,255,1)] rounded-none p-0.5 transition-all active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer"
                    : toastStyle === "glassmorphism" || toastStyle === "liquid-glass"
                    ? "absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-white/10 hover:bg-white/20 dark:bg-zinc-800/10 dark:hover:bg-zinc-800/20 backdrop-blur-md rounded-full border border-white/20 dark:border-zinc-700/25 p-1 transition-all hover:scale-105 cursor-pointer"
                    : "absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-0.5 rounded cursor-pointer"
                }
                aria-label="Tutup notifikasi"
                title="Tutup notifikasi"
              >
                <Icons.X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
