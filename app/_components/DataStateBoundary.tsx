"use client";

import React from "react";
import { SkeletonList, SkeletonCard } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import * as UIStyles from "@/UI";
import { useUIStyle } from "@/app/_components/UIStyleContext";

interface DataStateBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  errorTitle?: string;
  errorMessage?: string;
  loadingVariant?: "list" | "card" | "spinner";
  children: React.ReactNode;
}

export function DataStateBoundary({
  isLoading,
  isError,
  isEmpty,
  emptyTitle = "Tidak Ada Data",
  emptyDescription = "Data yang Anda cari tidak ditemukan atau masih kosong.",
  emptyIcon = "Clipboard",
  errorTitle = "Terjadi Kesalahan",
  errorMessage = "Gagal memuat data dari server. Silakan coba beberapa saat lagi.",
  loadingVariant = "list",
  children
}: DataStateBoundaryProps) {
  const { selectedStyle } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  if (isLoading) {
    if (loadingVariant === "card") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      );
    }
    if (loadingVariant === "spinner") {
      return (
        <div className="py-16 flex flex-col items-center justify-center gap-3 w-full">
          <div className="w-8 h-8 rounded-full border-2 border-sakode-blue border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-zinc-500">Memuat data...</span>
        </div>
      );
    }
    return <div className="w-full"><SkeletonList /></div>;
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-8 w-full">
        <UI.Alert title={errorTitle} type="warning">
          {errorMessage}
        </UI.Alert>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="w-full">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={emptyIcon}
        />
      </div>
    );
  }

  return <>{children}</>;
}
