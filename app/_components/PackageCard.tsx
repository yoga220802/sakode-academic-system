"use client";

import React from "react";
import Link from "next/link";
import { PackageViewModel } from "../_types/package";
import { useUIStyle } from "./UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { ModulePreviewList } from "./ModulePreviewList";
import { getTextClass } from "@/UI/shared/color-utils";

interface PackageCardProps {
  pkg: PackageViewModel;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  // Helper to format currency
  const formatPrice = (value: number | null) => {
    if (value === null) return "Hubungi Admin / TBD";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: pkg.currency || "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Check if registration period is open
  const currentDate = new Date(); // In 2026 based on system time
  const startDate = new Date(pkg.registrationStart);
  const endDate = new Date(pkg.registrationEnd);
  
  const isRegistrationYetToStart = currentDate < startDate;
  const isRegistrationClosed = currentDate > endDate;
  const isRegistrationOpen = !isRegistrationYetToStart && !isRegistrationClosed;

  // Render registration status text
  const getRegistrationStatusText = () => {
    if (isRegistrationYetToStart) {
      return `Buka ${new Date(pkg.registrationStart).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    if (isRegistrationClosed) {
      return "Pendaftaran Ditutup";
    }
    return `Batas: ${new Date(pkg.registrationEnd).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  // Status indicator colors
  const getStatusBadgeVariant = () => {
    if (isRegistrationClosed) return "warning";
    if (isRegistrationYetToStart) return "default";
    return "success";
  };

  // Card highlight styling if featured
  const getCardBorderClass = () => {
    if (!pkg.featured) return "";
    switch (selectedStyle) {
      case "neobrutalism":
        return "border-3! border-zinc-900! dark:border-white!";
      case "claymorphism":
        return "shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1),_inset_0_2px_4px_rgba(255,255,255,0.7)] ring-2 ring-sakode-yellow/30";
      case "glassmorphism":
      case "liquid-glass":
        return "ring-2 ring-sakode-yellow/40 bg-white/25 dark:bg-white/10";
      default:
        return "ring-2 ring-sakode-yellow/50 dark:ring-sakode-yellow/30 border-sakode-yellow/50";
    }
  };

  const isMissingPrice = pkg.price === null;

  return (
    <UI.Card 
      accentColor={pkg.featured ? "yellow" : selectedColor}
      className={`h-full flex flex-col justify-between transition-all duration-300 relative ${getCardBorderClass()}`}
    >
      {pkg.featured && (
        <div className="absolute -top-3.5 left-6 z-20">
          <UI.Badge accentColor="yellow" variant="accent" className="shadow-xs tracking-wider font-extrabold text-[9px] uppercase px-3 py-1">
            ⭐️ Rekomendasi / Terpopuler
          </UI.Badge>
        </div>
      )}

      <div className="flex flex-col gap-5 flex-1 pb-4">
        {/* Header Section */}
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white leading-tight">
              {pkg.name}
            </h4>
            <UI.Badge 
              accentColor={selectedColor} 
              variant={getStatusBadgeVariant()}
              className="shrink-0"
            >
              {isRegistrationOpen ? "Aktif" : isRegistrationClosed ? "Ditutup" : "Mendatang"}
            </UI.Badge>
          </div>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 font-semibold leading-relaxed min-h-12">
            {pkg.outcome}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="py-3 px-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-150/40 dark:border-zinc-850/40">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
            Biaya Investasi
          </div>
          {isMissingPrice ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-extrabold text-zinc-500 dark:text-zinc-400">
                Harga Hubungi Admin
              </span>
              <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1">
                <Icons.AlertTriangle className="w-3.5 h-3.5" />
                Persetujuan harga khusus / TBD
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black tracking-tight ${getTextClass(selectedColor)}`}>
                {formatPrice(pkg.price)}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                / Program
              </span>
            </div>
          )}
        </div>

        {/* Registration Period Details */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-650 dark:text-zinc-400">
          <Icons.Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>Registrasi: </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
            isRegistrationClosed 
              ? "bg-rose-500/10 text-rose-600 dark:bg-rose-955/20 dark:text-rose-400"
              : isRegistrationYetToStart
              ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-955/20 dark:text-emerald-400"
          }`}>
            {getRegistrationStatusText()}
          </span>
        </div>

        {/* Learning Modules Preview */}
        <div className="border-t border-zinc-100 dark:border-zinc-850/50 pt-4">
          <ModulePreviewList modules={pkg.modules} />
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-4 border-t border-zinc-100 dark:border-zinc-850/50 pt-4">
        {isMissingPrice ? (
          <a
            href="mailto:admin@sakode.org?subject=Tanya%20Harga%20Program%20Sakode"
            className="w-full"
          >
            <UI.Button
              variant="secondary"
              accentColor="orange"
              className="w-full text-xs py-2.5 rounded-xl font-extrabold cursor-pointer"
            >
              <Icons.Info className="w-4 h-4 mr-1.5" />
              Hubungi Admin
            </UI.Button>
          </a>
        ) : isRegistrationClosed ? (
          <UI.Button
            variant="secondary"
            disabled
            className="w-full text-xs py-2.5 rounded-xl font-extrabold opacity-60 cursor-not-allowed"
          >
            Pendaftaran Ditutup
          </UI.Button>
        ) : (
          <Link href={`/register?program=${pkg.slug}`} className="w-full block">
            <UI.Button
              variant={pkg.featured ? "primary" : "secondary"}
              accentColor={selectedColor}
              isGradient={pkg.featured}
              className="w-full text-xs py-2.5 rounded-xl font-extrabold cursor-pointer"
            >
              <span>Daftar Sekarang</span>
              <Icons.ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </UI.Button>
          </Link>
        )}
      </div>
    </UI.Card>
  );
}
