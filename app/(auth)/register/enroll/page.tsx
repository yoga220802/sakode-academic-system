"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import * as UIStyles from "@/UI";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass } from "@/UI/shared/color-utils";
import { AestheticBackground } from "@/app/_components/AestheticBackground";
import { PackageMockService } from "@/app/_services/package-mock";
import { PackageViewModel } from "@/app/_types/package";

// Types for Mock Validation
interface ReferralResult {
  isValid: boolean;
  status: "valid" | "invalid" | "expired";
  referrer?: string;
  message: string;
}

interface PromoResult {
  isValid: boolean;
  discountType: "percentage" | "fixed";
  discountValue: number;
  message: string;
}

type DemoScenario = "normal" | "promo_applied" | "invalid_referral" | "expired_referral" | "unknown_package" | "closed_package" | "changed_price";

function EnrollmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedStyle, selectedColor } = useUIStyle();
  const { resolvedTheme, setTheme } = useTheme();

  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  // Scenarios for testing states
  const [demoScenario, setDemoScenario] = useState<DemoScenario>("normal");

  // Core Data State
  const [availablePackages, setAvailablePackages] = useState<PackageViewModel[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageViewModel | null>(null);
  
  // Inputs
  const [referralInput, setReferralInput] = useState("");
  const [promoInput, setPromoInput] = useState("");
  
  // Learning format states (private, trial, group)
  const [learningFormat, setLearningFormat] = useState<"private" | "trial" | "group">("private");
  const [groupSize, setGroupSize] = useState<number>(3);
  const [groupMembers, setGroupMembers] = useState<string[]>(["", "", ""]);

  const handleGroupSizeChange = (size: number) => {
    setGroupSize(size);
    setGroupMembers((prev) => {
      const next = [...prev];
      if (size > prev.length) {
        while (next.length < size) next.push("");
      } else {
        next.splice(size);
      }
      return next;
    });
  };

  // Validation States
  const [referralStatus, setReferralStatus] = useState<ReferralResult | null>(null);
  const [promoStatus, setPromoStatus] = useState<PromoResult | null>(null);
  
  // Interactive loading/notification
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "warning" | "info"; title: string; desc: string } | null>(null);

  // Price tracking for price change scenario
  const [showPriceWarning, setShowPriceWarning] = useState(false);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  // Load published packages
  useEffect(() => {
    PackageMockService.getPackages("normal", 0).then((data) => {
      setAvailablePackages(data);
    });
  }, []);

  // Referral Code Mock Validation
  const validateReferral = (code: string) => {
    setIsValidatingReferral(true);
    setReferralStatus(null);
    
    setTimeout(() => {
      setIsValidatingReferral(false);
      const clean = code.toUpperCase().trim();
      if (!clean) return;

      if (clean === "MANDIRI" || clean === "AKBAR-PROMO" || clean === "SUDARSONO") {
        setReferralStatus({
          isValid: true,
          status: "valid",
          referrer: clean,
          message: `Atribusi berhasil terhubung dengan kemitraan: ${clean}`
        });
      } else if (clean === "EXPIRED") {
        setReferralStatus({
          isValid: false,
          status: "expired",
          message: "⚠️ Kode referral sudah kedaluwarsa."
        });
      } else {
        setReferralStatus({
          isValid: false,
          status: "invalid",
          message: "⚠️ Kode referral tidak valid atau tidak ditemukan."
        });
      }
    }, 600);
  };

  // Promo Code Mock Validation
  const validatePromo = (code: string) => {
    setIsValidatingPromo(true);
    setPromoStatus(null);

    setTimeout(() => {
      setIsValidatingPromo(false);
      const clean = code.toUpperCase().trim();
      if (!clean) return;

      if (clean === "DISKON10") {
        setPromoStatus({
          isValid: true,
          discountType: "percentage",
          discountValue: 10,
          message: "✓ Promo diskon 10% berhasil dipasang."
        });
      } else if (clean === "PROMO50") {
        setPromoStatus({
          isValid: true,
          discountType: "percentage",
          discountValue: 50,
          message: "✓ Promo diskon 50% berhasil dipasang."
        });
      } else if (clean === "POTONGAN100K") {
        setPromoStatus({
          isValid: true,
          discountType: "fixed",
          discountValue: 100000,
          message: "✓ Potongan harga Rp 100.000 berhasil dipasang."
        });
      } else {
        setPromoStatus({
          isValid: false,
          discountType: "percentage",
          discountValue: 0,
          message: "⚠️ Kode promo tidak valid atau kedaluwarsa."
        });
      }
    }, 600);
  };

  // Parse Initial Query Context and handle Scenario updates
  useEffect(() => {
    let queryProgram = searchParams.get("program") || "";
    let queryRef = searchParams.get("ref") || "";

    // Wrap state updates in a microtask callback to prevent synchronous setState warning inside effect body
    Promise.resolve().then(() => {
      if (activeEffect) {
        // Reset warnings
        setShowPriceWarning(false);
        setPreviousPrice(null);

        // Apply scenario mocks
        if (demoScenario === "unknown_package") {
          queryProgram = "unknown-program-slug";
        } else if (demoScenario === "closed_package") {
          // Find React package and simulate closed
          queryProgram = "react-nextjs-professional";
        } else if (demoScenario === "changed_price") {
          queryProgram = "typescript-data-structures";
          setPreviousPrice(1000000); // previous price was lower
          setShowPriceWarning(true);
        } else if (demoScenario === "invalid_referral") {
          queryRef = "INVALID_CODE";
        } else if (demoScenario === "expired_referral") {
          queryRef = "EXPIRED";
        } else {
          // Normal or Promo Applied
          if (!queryProgram) queryProgram = "react-nextjs-professional";
          if (!queryRef) queryRef = "MANDIRI";
        }

        // Set inputs
        setReferralInput(queryRef);
        if (demoScenario === "promo_applied") {
          setPromoInput("PROMO50");
        } else {
          setPromoInput("");
        }

        // Resolve preselected package
        if (availablePackages.length > 0) {
          const found = availablePackages.find(p => p.slug === queryProgram);
          if (found) {
            if (demoScenario === "closed_package") {
              // Simulate closed registration dates (May 1 to June 1, 2026)
              setSelectedPackage({
                ...found,
                registrationStart: "2026-05-01",
                registrationEnd: "2026-06-01"
              });
            } else {
              setSelectedPackage(found);
            }
          } else {
            setSelectedPackage(null);
          }
        }

        // Automatically trigger code validations if they exist in prefill
        if (queryRef) {
          validateReferral(queryRef);
        } else {
          setReferralStatus(null);
        }

        if (demoScenario === "promo_applied") {
          validatePromo("PROMO50");
        } else {
          setPromoStatus(null);
        }
      }
    });

    let activeEffect = true;
    return () => {
      activeEffect = false;
    };
  }, [demoScenario, availablePackages, searchParams]);

  // Price Calculation Helpers
  const getListedPrice = () => {
    if (!selectedPackage) return 0;
    if (learningFormat === "private") {
      return selectedPackage.price === null ? 0 : selectedPackage.price;
    }
    if (learningFormat === "trial") {
      return selectedPackage.trialPrice === null || selectedPackage.trialPrice === undefined ? 150000 : selectedPackage.trialPrice;
    }
    // group
    const rate = selectedPackage.pricePerParticipant === null || selectedPackage.pricePerParticipant === undefined ? 250000 : selectedPackage.pricePerParticipant;
    return rate * groupSize;
  };

  const getDiscountAmount = () => {
    const price = getListedPrice();
    if (!promoStatus || !promoStatus.isValid) return 0;
    
    if (promoStatus.discountType === "percentage") {
      return (price * promoStatus.discountValue) / 100;
    }
    return promoStatus.discountValue;
  };

  const getFinalPrice = () => {
    const price = getListedPrice();
    const discount = getDiscountAmount();
    return Math.max(0, price - discount);
  };

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  };

  // Submit enrollment Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackage) {
      setAlertMsg({
        type: "warning",
        title: "Paket Belum Dipilih",
        desc: "Silakan pilih salah satu program akademik yang tersedia."
      });
      return;
    }

    // Check if registration is closed
    const isClosed = new Date() > new Date(selectedPackage.registrationEnd);
    if (isClosed || selectedPackage.price === null) {
      setAlertMsg({
        type: "warning",
        title: "Program Tidak Tersedia",
        desc: isClosed ? "Pendaftaran program ini sudah ditutup." : "Harga program ini belum disetujui."
      });
      return;
    }

    setIsLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      setAlertMsg({
        type: "info",
        title: "Pendaftaran Selesai!",
        desc: "Registrasi program Anda berhasil disimpan. Mengalihkan ke login..."
      });

      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1500);
    }, 1800);
  };

  // Check if current selection is closed
  const isSelectedPackageClosed = selectedPackage 
    ? new Date() > new Date(selectedPackage.registrationEnd)
    : false;

  return (
    <div className='relative min-h-screen w-full flex flex-col justify-between items-center bg-background text-foreground overflow-hidden font-sans transition-colors duration-300'>
      <AestheticBackground mode="auth" />

      {/* Grid Pattern overlay */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none z-0' />

      {/* Navbar Header */}
      <header className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-900/50 z-20 relative'>
        <button 
          onClick={() => !isLoading && router.push("/")}
          disabled={isLoading}
          aria-label="Kembali ke Beranda" 
          className={`bg-[#030307] py-2.5 px-4 rounded-xl border border-zinc-800/80 shadow-md flex items-center justify-center ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <Image
            src='/assets/logo/sakode.svg'
            alt='Sakode Academy Logo'
            width={120}
            height={33}
            priority
            className='h-6 w-auto'
          />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className='p-2.5 rounded-full border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer'
            aria-label='Toggle Light/Dark Theme'>
            {resolvedTheme === "dark" ? (
              <Icons.Sun className="w-4 h-4" />
            ) : (
              <Icons.Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className='relative flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4 py-8 z-10'>
        {/* Scenario Selector Block for Reviewers */}
        <div className="w-full mb-6 p-4 bg-amber-500/10 dark:bg-amber-955/20 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-20 relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L12 7.5l4.179 2.25m-11.142 4.5L12 16.5l4.179-2.25m0 0L21.75 12l-4.179-2.25M12 16.5v4.5m0-13.5v4.5" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 block leading-tight">
                Reviewer Scenario Panel
              </span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550">
                Pilih skenario untuk menguji status visual
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              id="enrollment-scenario-select"
              aria-label="Pilih skenario demo"
              title="Pilih skenario demo"
              value={demoScenario}
              onChange={(e) => setDemoScenario(e.target.value as DemoScenario)}
              className="w-full sm:w-60 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-extrabold text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/35 cursor-pointer"
            >
              <option value="normal">Normal (Kemitraan MANDIRI)</option>
              <option value="promo_applied">Promo Aktif (PROMO50)</option>
              <option value="invalid_referral">Kemitraan Tidak Valid</option>
              <option value="expired_referral">Kemitraan Kedaluwarsa</option>
              <option value="unknown_package">Program Tidak Ditemukan</option>
              <option value="closed_package">Pendaftaran Ditutup</option>
              <option value="changed_price">Deteksi Perubahan Harga</option>
            </select>
          </div>
        </div>

        {/* Enrollment Interface */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column Left: Package and inputs */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            <UI.Card accentColor={selectedColor} className="w-full">
              <div className="p-1 sm:p-4 flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                    Lengkapi Pemilihan Paket & Kemitraan
                  </h3>
                  <p className="text-xs text-zinc-550 dark:text-zinc-450 mt-1">
                    Silakan tentukan paket belajar wajib Anda dan konfirmasi atribusi kemitraan.
                  </p>
                </div>

                {/* Warning Alert Message */}
                <AnimatePresence mode="wait">
                  {alertMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <UI.Alert title={alertMsg.title} type={alertMsg.type}>
                        {alertMsg.desc}
                      </UI.Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Price Change Warning */}
                {showPriceWarning && selectedPackage && (
                  <UI.Alert title="Perubahan Investasi Terdeteksi" type="warning">
                    Terdapat penyesuaian biaya program ini dari {previousPrice ? formatIDR(previousPrice) : "TBD"} menjadi {formatIDR(getListedPrice())} sejak kunjungan terakhir Anda. Silakan konfirmasi ulang.
                  </UI.Alert>
                )}

                {/* Step 1: Package Selection (Mandatory) */}
                <div className="border-b border-zinc-150/40 dark:border-zinc-800/40 pb-5">
                  <UI.Label htmlFor="package-select" className="text-xs font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 mb-2">
                    Pilihan Paket Akademik Wajib
                  </UI.Label>
                  
                  <div className="flex flex-col gap-3">
                    <select
                      id="package-select"
                      aria-label="Pilih Paket Program"
                      title="Pilih Paket Program"
                      value={selectedPackage ? selectedPackage.slug : ""}
                      onChange={(e) => {
                        const found = availablePackages.find(p => p.slug === e.target.value);
                        setSelectedPackage(found || null);
                        setAlertMsg(null);
                      }}
                      className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl py-2.5 px-4 focus:ring-2 focus:outline-hidden transition-all text-zinc-900 dark:text-white appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option value="">-- Pilih Paket Program --</option>
                      {availablePackages.map((p) => (
                        <option key={p.id} value={p.slug}>
                          {p.name} ({p.price === null ? "Harga TBD" : formatIDR(p.price)})
                        </option>
                      ))}
                    </select>

                    {!selectedPackage && (
                      <span className="text-[10.5px] font-bold text-rose-500">
                        ⚠️ Pemilihan paket bersifat wajib untuk melanjutkan.
                      </span>
                    )}

                    {selectedPackage && isSelectedPackageClosed && (
                      <span className="text-[10.5px] font-bold text-rose-500">
                        ⚠️ Pendaftaran untuk program &ldquo;{selectedPackage.name}&rdquo; saat ini sudah ditutup.
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 1.5: Learning Option (Private / Trial / Group) */}
                {selectedPackage && (
                  <div className="border-b border-zinc-150/40 dark:border-zinc-800/40 pb-5">
                    <UI.Label className="text-xs font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 mb-2.5 block">
                      Pilihan Skema Belajar
                    </UI.Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Option 1: Private */}
                      <div
                        onClick={() => !isLoading && setLearningFormat("private")}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                          learningFormat === "private"
                            ? "border-sakode-blue dark:border-sky-400 bg-sakode-blue/5 dark:bg-sky-400/5"
                            : "border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/35"
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-xs text-zinc-800 dark:text-zinc-100 block">Individu / Private</span>
                          <span className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1 block">Bimbingan 1-on-1 dengan mentor pendamping secara offline.</span>
                        </div>
                        <span className="font-black text-xs text-zinc-900 dark:text-white mt-3 block">
                          {selectedPackage.price !== null ? formatIDR(selectedPackage.price) : "TBD"}
                        </span>
                      </div>

                      {/* Option 2: Trial */}
                      <div
                        onClick={() => !isLoading && setLearningFormat("trial")}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                          learningFormat === "trial"
                            ? "border-amber-500 dark:border-amber-400 bg-amber-500/5"
                            : "border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/35"
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-xs text-zinc-800 dark:text-zinc-100 block">Trial (Coba Dulu)</span>
                          <span className="text-[10px] text-zinc-450 dark:text-zinc-550 mt-1 block">Coba 1-2 sesi bimbingan terlebih dahulu sebelum komitmen bayar penuh.</span>
                        </div>
                        <span className="font-black text-xs text-zinc-900 dark:text-white mt-3 block">
                          {formatIDR(selectedPackage.trialPrice || 150000)}
                        </span>
                      </div>

                      {/* Option 3: Group */}
                      <div
                        onClick={() => {
                          if (!isLoading && selectedPackage.hasGroupOption) {
                            setLearningFormat("group");
                          }
                        }}
                        className={`p-3.5 rounded-xl border-2 transition-all text-left flex flex-col justify-between ${
                          !selectedPackage.hasGroupOption
                            ? "opacity-50 cursor-not-allowed border-zinc-100 dark:border-zinc-850"
                            : learningFormat === "group"
                            ? "border-purple-500 dark:border-purple-400 bg-purple-500/5"
                            : "border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/35 cursor-pointer"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-xs text-zinc-800 dark:text-zinc-100 block">Kelompok Belajar</span>
                            {!selectedPackage.hasGroupOption && (
                              <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[8px] font-black px-1.5 py-0.5 rounded">Tutup</span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1 block">Belajar berkelompok (${selectedPackage.minGroupSize || 2}-${selectedPackage.maxGroupSize || 5} anak) di lab offline terdekat.</span>
                        </div>
                        <span className="font-black text-xs text-zinc-900 dark:text-white mt-3 block">
                          {formatIDR(selectedPackage.pricePerParticipant || 250000)} <span className="text-[9px] font-bold text-zinc-450">/ anak</span>
                        </span>
                      </div>
                    </div>

                    {/* Group members details inputs */}
                    {learningFormat === "group" && (
                      <div className="mt-5 p-4 bg-zinc-50 dark:bg-zinc-900/35 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 flex flex-col gap-4 text-left">
                        <div className="flex justify-between items-center border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2">
                          <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200">Konfigurasi Anggota Kelompok</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10.5px] font-bold text-zinc-450">Jumlah Peserta:</span>
                            <select
                              aria-label="Jumlah Anggota Kelompok"
                              value={groupSize}
                              onChange={(e) => handleGroupSizeChange(parseInt(e.target.value))}
                              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
                            >
                              {Array.from(
                                { length: (selectedPackage.maxGroupSize || 5) - (selectedPackage.minGroupSize || 2) + 1 },
                                (_, i) => (selectedPackage.minGroupSize || 2) + i
                              ).map((n) => (
                                <option key={n} value={n}>{n} Anak</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {groupMembers.map((member, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                              <UI.Label className="text-[10.5px] font-bold text-zinc-500">
                                Nama Lengkap Anggota #${idx + 1} {idx === 0 ? "(Anda)" : ""}
                              </UI.Label>
                              <UI.Input
                                type="text"
                                placeholder={`contoh: ${idx === 0 ? "Nama Anda" : "Nama Teman Anda"}`}
                                value={member}
                                onChange={(e) => {
                                  const next = [...groupMembers];
                                  next[idx] = e.target.value;
                                  setGroupMembers(next);
                                }}
                                className="text-xs!"
                                disabled={isLoading}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Promo & Referral Code Inputs (Separate Inputs) */}
                <div className="flex flex-col gap-5">
                  {/* Referral Input */}
                  <div>
                    <UI.Label htmlFor="referral-input" className="text-xs font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 mb-2">
                      Kode Kemitraan / Referral Link
                    </UI.Label>
                    <div className="flex gap-2">
                      <UI.Input
                        id="referral-input"
                        placeholder="Contoh: MANDIRI"
                        value={referralInput}
                        onChange={(e) => setReferralInput(e.target.value)}
                        disabled={isLoading || isValidatingReferral}
                        className="flex-1"
                      />
                      <UI.Button
                        type="button"
                        variant="secondary"
                        accentColor={selectedColor}
                        onClick={() => validateReferral(referralInput)}
                        disabled={isLoading || isValidatingReferral}
                        isLoading={isValidatingReferral}
                        className="text-xs! py-2! h-auto!"
                      >
                        Terapkan
                      </UI.Button>
                    </div>

                    {/* Referral Status Messages */}
                    {referralStatus && (
                      <span className={`text-[10.5px] font-bold mt-1.5 block ${
                        referralStatus.isValid 
                          ? "text-emerald-500 dark:text-emerald-400" 
                          : "text-rose-500"
                      }`}>
                        {referralStatus.message}
                      </span>
                    )}
                  </div>

                  {/* Promo Input */}
                  <div>
                    <UI.Label htmlFor="promo-input" className="text-xs font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 mb-2">
                      Kupon Diskon / Kode Promo
                    </UI.Label>
                    <div className="flex gap-2">
                      <UI.Input
                        id="promo-input"
                        placeholder="Contoh: PROMO50"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        disabled={isLoading || isValidatingPromo || !selectedPackage || selectedPackage.price === null}
                        className="flex-1"
                      />
                      <UI.Button
                        type="button"
                        variant="secondary"
                        accentColor={selectedColor}
                        onClick={() => validatePromo(promoInput)}
                        disabled={isLoading || isValidatingPromo || !selectedPackage || selectedPackage.price === null}
                        isLoading={isValidatingPromo}
                        className="text-xs! py-2! h-auto!"
                      >
                        Pasang
                      </UI.Button>
                    </div>

                    {/* Promo Status Messages */}
                    {promoStatus && (
                      <span className={`text-[10.5px] font-bold mt-1.5 block ${
                        promoStatus.isValid 
                          ? "text-emerald-500 dark:text-emerald-400" 
                          : "text-rose-500"
                      }`}>
                        {promoStatus.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </UI.Card>
          </div>

          {/* Column Right: Billing Summary & Confirmation */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            <UI.Card accentColor={selectedColor} className="border-2! border-zinc-200/60 dark:border-zinc-800/80">
              <div className="p-1 sm:p-2 flex flex-col gap-5">
                <h4 className="text-base font-black text-zinc-850 dark:text-zinc-150 uppercase tracking-wider">
                  Ringkasan Pembayaran
                </h4>

                {/* Summary Fields */}
                <div className="flex flex-col gap-3.5 text-xs text-zinc-650 dark:text-zinc-400 font-semibold">
                  
                  {/* Selected Package Info */}
                  <div className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-850 pb-3">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Paket Pilihan & Skema</span>
                    <span className="font-extrabold text-sm text-zinc-850 dark:text-zinc-100">
                      {selectedPackage ? selectedPackage.name : "Belum memilih paket"}
                    </span>
                    {selectedPackage && (
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span className="text-[11px] font-bold text-sakode-blue dark:text-sky-400 uppercase">
                          • Skema: {learningFormat === "private" ? "Private (Individu)" : learningFormat === "trial" ? "Trial (Coba Dulu)" : "Kelompok Belajar (" + groupSize + " Anak)"}
                        </span>
                        <span className="text-[10px] text-zinc-400 block font-normal">
                          Mendukung {selectedPackage.modules.reduce((sum, m) => sum + m.sessionCount, 0)} sesi mentoring live.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Rows */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <span>Biaya Investasi Pokok</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {selectedPackage && selectedPackage.price !== null ? formatIDR(selectedPackage.price) : "Rp 0"}
                      </span>
                    </div>

                    {promoStatus?.isValid && (
                      <div className="flex justify-between items-center text-emerald-500 dark:text-emerald-400">
                        <span>Potongan Diskon Promo</span>
                        <span className="font-bold">
                          -{formatIDR(getDiscountAmount())}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3 text-sm">
                      <span className="font-black text-zinc-850 dark:text-zinc-100">Total Pembayaran</span>
                      <span className={`text-lg font-black ${getTextClass(selectedColor)}`}>
                        {selectedPackage ? formatIDR(getFinalPrice()) : "Rp 0"}
                      </span>
                    </div>
                  </div>

                  {/* Referral Source Attribution Notice */}
                  {referralStatus?.isValid && (
                    <div className="p-3 bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                        <Icons.Gift className="w-3.5 h-3.5" />
                        Atribusi Referral Mitra
                      </div>
                      <span className="font-extrabold text-zinc-850 dark:text-zinc-100 text-[11px]">
                        Atribusi: {referralStatus.referrer}
                      </span>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal leading-relaxed">
                        Catatan: Kode kemitraan digunakan untuk pencatatan rujukan eksternal dan tidak memberikan potongan harga langsung pada paket ini.
                      </p>
                    </div>
                  )}
                </div>

                {/* Form Action Submit */}
                <form onSubmit={handleSubmit} className="mt-3">
                  <UI.Button
                    type="submit"
                    variant="primary"
                    accentColor={selectedColor}
                    isGradient
                    disabled={isLoading || !selectedPackage || isSelectedPackageClosed || selectedPackage.price === null}
                    isLoading={isLoading}
                    className="w-full cursor-pointer py-3!"
                  >
                    <span>Konfirmasi & Daftar Kelas</span>
                    <Icons.ArrowRight className="w-4 h-4 ml-1.5" />
                  </UI.Button>
                </form>

                {/* Secondary navigation back to login */}
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    disabled={isLoading}
                    className="text-xs font-bold text-zinc-450 hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Kembali ke halaman masuk
                  </button>
                </div>
              </div>
            </UI.Card>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className='relative w-full max-w-6xl mx-auto py-8 px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-zinc-400 dark:text-zinc-555 border-t border-zinc-200/50 dark:border-zinc-900/60 z-10 font-medium'>
        <p className='text-center sm:text-left'>
          © {new Date().getFullYear()} Sakode Academy. All rights reserved.
        </p>
        <div className='flex gap-6'>
          <a
            href='https://sakode.org'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors'>
            Website Utama
          </a>
          <a
            href='mailto:info@sakode.org'
            className='hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors'>
            Hubungi Kami
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function PackageEnrollmentPage() {
  return (
    <Suspense fallback={
      <div className="py-16 flex flex-col items-center justify-center gap-3 w-full min-h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-sakode-blue border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-zinc-500">Memuat rincian paket...</span>
      </div>
    }>
      <EnrollmentForm />
    </Suspense>
  );
}
