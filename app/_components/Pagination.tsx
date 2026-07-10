"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-zinc-200/35 dark:border-zinc-800/35 select-none w-full">
      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-450">
        Halaman <span className="text-zinc-800 dark:text-zinc-100 font-extrabold">{currentPage}</span> dari <span className="text-zinc-800 dark:text-zinc-100 font-extrabold">{totalPages}</span>
      </span>
      
      <div className="flex items-center gap-2">
        <UI.Button
          variant="secondary"
          accentColor={selectedColor}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2! h-8! w-8! flex items-center justify-center cursor-pointer disabled:opacity-50"
          aria-label="Halaman Sebelumnya"
          title="Halaman Sebelumnya"
        >
          <Icons.ArrowLeft className="w-4.5 h-4.5" />
        </UI.Button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
          .map((page, idx, array) => {
            const showEllipsis = idx > 0 && page - array[idx - 1] > 1;
            return (
              <React.Fragment key={page}>
                {showEllipsis && (
                  <span className="text-xs font-bold text-zinc-400 px-1">...</span>
                )}
                <UI.Button
                  variant={currentPage === page ? "primary" : "secondary"}
                  accentColor={selectedColor}
                  onClick={() => onPageChange(page)}
                  className={`h-8! w-8! p-0! text-xs! flex items-center justify-center cursor-pointer ${
                    currentPage === page ? "font-black" : "font-semibold"
                  }`}
                >
                  {page}
                </UI.Button>
              </React.Fragment>
            );
          })}

        <UI.Button
          variant="secondary"
          accentColor={selectedColor}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2! h-8! w-8! flex items-center justify-center cursor-pointer disabled:opacity-50"
          aria-label="Halaman Selanjutnya"
          title="Halaman Selanjutnya"
        >
          <Icons.ArrowRight className="w-4.5 h-4.5" />
        </UI.Button>
      </div>
    </div>
  );
}
