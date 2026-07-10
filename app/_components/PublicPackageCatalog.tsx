"use client";

import React, { useState, useEffect } from "react";
import { PackageViewModel } from "../_types/package";
import { PackageMockService, ScenarioType } from "../_services/package-mock";
import { PackageCard } from "./PackageCard";
import { DataStateBoundary } from "./DataStateBoundary";
import { useUIStyle } from "./UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass } from "@/UI/shared/color-utils";

export function PublicPackageCatalog() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  const [scenario, setScenario] = useState<ScenarioType>("normal");
  const [packages, setPackages] = useState<PackageViewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showComparison, setShowComparison] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    
    // Set loading state asynchronously to avoid synchronous setState inside effect body
    Promise.resolve().then(() => {
      if (active) {
        setIsLoading(true);
        setIsError(false);
        setErrorMessage("");
      }
    });

    PackageMockService.getPackages(scenario, 850)
      .then((data) => {
        if (active) {
          setPackages(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setIsError(true);
          setErrorMessage(err instanceof Error ? err.message : "Gagal memuat paket dari server.");
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [scenario]);

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScenario(e.target.value as ScenarioType);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* DEVELOPMENT SCENARIO SELECTOR */}
      <div className="p-4 bg-amber-500/10 dark:bg-amber-955/20 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5 animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L12 7.5l4.179 2.25m-11.142 4.5L12 16.5l4.179-2.25m0 0L21.75 12l-4.179-2.25M12 16.5v4.5m0-13.5v4.5" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 block leading-tight">
              Reviewer Control Panel
            </span>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
              Pilih skenario untuk menguji status visual
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="scenario-select" className="text-xs font-bold text-zinc-500 whitespace-nowrap hidden sm:block">
            Skenario Fixture:
          </label>
          <select
            id="scenario-select"
            value={scenario}
            onChange={handleScenarioChange}
            className="w-full sm:w-60 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-extrabold text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/35 cursor-pointer"
          >
            <option value="normal">Normal (Semua Paket Aktif)</option>
            <option value="loading">Loading (Skeleton Cards)</option>
            <option value="empty">Empty State (Paket Kosong)</option>
            <option value="partial-error">Partial Error (Gagal Sinkronisasi)</option>
            <option value="missing-price">Missing Price (TBD / Hubungi Admin)</option>
            <option value="closed-registration">Closed Registration (Pendaftaran Ditutup)</option>
          </select>
        </div>
      </div>

      {/* PACKAGE CATALOG SECTION */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-900/50 pb-4">
          <div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Pilihan Program Akademik
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-1">
              Kurikulum praktis langsung dari mentor ahli industri IT.
            </p>
          </div>
          
          {packages.length > 0 && !isLoading && !isError && (
            <UI.Button
              variant="secondary"
              accentColor={selectedColor}
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs! py-2! px-4! rounded-xl! font-extrabold! cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.5 0h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              {showComparison ? "Sembunyikan Perbandingan" : "Bandingkan Program"}
            </UI.Button>
          )}
        </div>

        {/* DATA STATE BOUNDARY */}
        <DataStateBoundary
          isLoading={isLoading}
          isError={isError}
          isEmpty={packages.length === 0}
          emptyTitle="Belum Ada Paket Yang Diterbitkan"
          emptyDescription="Kami sedang merancang paket program akademik baru. Silakan hubungi admin untuk info kelas mendatang."
          errorTitle="Sinkronisasi Katalog Gagal"
          errorMessage={errorMessage}
          loadingVariant="card"
        >
          {/* Package Comparison Panel (Responsive) */}
          {showComparison && packages.length > 0 && (
            <div className="w-full transition-all duration-300">
              <UI.Card accentColor={selectedColor} className="overflow-hidden p-0! border-zinc-200/60 dark:border-zinc-800/80">
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-900">
                  <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-150 uppercase tracking-wider flex items-center gap-2">
                    <Icons.Info className="w-4 h-4 text-sakode-yellow" />
                    Bandingkan Spesifikasi Kelas
                  </h4>
                </div>
                
                {/* Horizontal scroll container for table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-[700px] border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-150 dark:border-zinc-850">
                        <th className="p-4 font-black text-zinc-500 dark:text-zinc-400 w-1/4">Kriteria</th>
                        {packages.map((pkg) => (
                          <th key={pkg.id} className="p-4 font-extrabold text-zinc-850 dark:text-zinc-100 text-center w-1/4">
                            <span className="block font-black">{pkg.name}</span>
                            {pkg.featured && (
                              <span className="inline-block mt-1 text-[8.5px] font-black bg-sakode-yellow/10 text-sakode-yellow border border-sakode-yellow/20 px-2 py-0.5 rounded-full uppercase">
                                Populer
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                      {/* 1. Outcomes */}
                      <tr>
                        <td className="p-4 font-bold text-zinc-500 dark:text-zinc-450 bg-zinc-50/20 dark:bg-zinc-900/10">Hasil Belajar</td>
                        {packages.map((pkg) => (
                          <td key={pkg.id} className="p-4 text-zinc-650 dark:text-zinc-350 text-center font-medium leading-relaxed">
                            {pkg.outcome}
                          </td>
                        ))}
                      </tr>

                      {/* 2. Total Duration */}
                      <tr>
                        <td className="p-4 font-bold text-zinc-500 dark:text-zinc-450 bg-zinc-50/20 dark:bg-zinc-900/10">Durasi Pembelajaran</td>
                        {packages.map((pkg) => {
                          const totalWeeks = pkg.modules.reduce((sum, m) => sum + m.durationWeeks, 0);
                          return (
                            <td key={pkg.id} className="p-4 text-center font-bold text-zinc-800 dark:text-zinc-200">
                              {totalWeeks} Minggu ({pkg.modules.length} Modul)
                            </td>
                          );
                        })}
                      </tr>

                      {/* 3. Session Counts */}
                      <tr>
                        <td className="p-4 font-bold text-zinc-500 dark:text-zinc-450 bg-zinc-50/20 dark:bg-zinc-900/10">Total Sesi Live Mentoring</td>
                        {packages.map((pkg) => {
                          const totalSessions = pkg.modules.reduce((sum, m) => sum + m.sessionCount, 0);
                          return (
                            <td key={pkg.id} className="p-4 text-center font-bold text-zinc-850 dark:text-zinc-200">
                              {totalSessions} Sesi Live (1-on-1)
                            </td>
                          );
                        })}
                      </tr>

                      {/* 4. Core Topics */}
                      <tr>
                        <td className="p-4 font-bold text-zinc-500 dark:text-zinc-450 bg-zinc-50/20 dark:bg-zinc-900/10">Topik Inti</td>
                        {packages.map((pkg) => {
                          // Collect first topic of each module
                          const coreTopics = pkg.modules.map(m => m.title);
                          return (
                            <td key={pkg.id} className="p-4 text-center text-zinc-600 dark:text-zinc-400 font-medium">
                              <ul className="inline-flex flex-col gap-1 text-left list-disc list-inside">
                                {coreTopics.map((topic, i) => (
                                  <li key={i} className="line-clamp-1">{topic}</li>
                                ))}
                              </ul>
                            </td>
                          );
                        })}
                      </tr>

                      {/* 5. Investment */}
                      <tr className="bg-zinc-50/20 dark:bg-zinc-900/10 font-extrabold">
                        <td className="p-4 text-zinc-800 dark:text-zinc-200">Biaya Program</td>
                        {packages.map((pkg) => (
                          <td key={pkg.id} className="p-4 text-center text-base">
                            {pkg.price === null ? (
                              <span className="text-zinc-450 dark:text-zinc-500 font-bold">Harga TBD</span>
                            ) : (
                              <span className={`font-black ${getTextClass(selectedColor)}`}>
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: pkg.currency || "IDR",
                                  maximumFractionDigits: 0,
                                }).format(pkg.price)}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </UI.Card>
            </div>
          )}

          {/* Grid Layout of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full">
            {packages.map((pkg) => (
              <div key={pkg.id} className="h-full">
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        </DataStateBoundary>
      </div>
    </div>
  );
}
