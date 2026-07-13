"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";

interface ToastMessage {
  text: string;
  type: "success" | "error";
}

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
  };

  return { toast, showToast, setToast };
}

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastMessage | null;
  onClose: () => void;
}) {
  const { selectedStyle } = useUIStyle();
  const UI =
    UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] ||
    UIStyles.UI["sakode-modern"];

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full font-sans"
        >
          <UI.Card accentColor={toast.type === "success" ? "green" : "red"}>
            <div className="flex items-start gap-3 text-xs leading-normal">
              <div className="shrink-0 mt-0.5">
                {toast.type === "success" ? (
                  <Icons.Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Icons.AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-455" />
                )}
              </div>
              <div className="flex-1 font-bold text-zinc-800 dark:text-zinc-200">
                {toast.text}
              </div>
              <button
                onClick={onClose}
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
  );
}
