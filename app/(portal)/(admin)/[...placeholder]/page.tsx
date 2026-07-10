"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";

interface PageProps {
  params: Promise<{ placeholder: string[] }>;
}

export default function PlaceholderPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const path = "/" + resolvedParams.placeholder.join("/");

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center">
      <UI.Card accentColor={selectedColor} className="max-w-xl w-full">
        <div className="p-8 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-sakode-blue/10 flex items-center justify-center text-sakode-blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <UI.Heading className="text-xl! font-black! text-zinc-900 dark:text-white">
              Halaman Sedang Dibuat
            </UI.Heading>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 font-bold font-mono bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 mt-1 inline-block mx-auto">
              {path}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
              Halaman ini merupakan placeholder untuk demo sistem navigasi. Fungsionalitas bisnis halaman ini akan diimplementasikan pada tahap/slice berikutnya.
            </p>
          </div>

          <div className="flex gap-3">
            <UI.Button
              variant="secondary"
              accentColor={selectedColor}
              className="text-xs! py-2! px-4! cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              Kembali ke Ringkasan
            </UI.Button>
          </div>
        </div>
      </UI.Card>
    </div>
  );
}
