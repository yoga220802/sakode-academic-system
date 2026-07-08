"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";

interface LockScreenProps {
  onUnlock: () => void;
  onStartTrial: () => void;
  wasTrialExhausted: boolean;
}

type PaymentStep = "method" | "processing" | "success";
type PaymentMethod = "card" | "qris";

// Moved outside the component to keep useEffect dependency pure
const processingMessages = [
  "Menghubungkan ke gateway SAKODE...",
  "Mengamankan koneksi SSL 256-bit...",
  "Memvalidasi detail transaksi...",
  "Menunggu konfirmasi bank...",
  "Pembayaran Berhasil! Membuat lisensi..."
];

export function LockScreen({ onUnlock, onStartTrial, wasTrialExhausted }: LockScreenProps) {
  const { selectedColor, selectedStyle } = useUIStyle();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("method");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  
  // Card form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  // Processing messages states
  const [processingIndex, setProcessingIndex] = useState(0);

  // Confetti particles for success screen
  const [confettiParticles, setConfettiParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number; delay: number; duration: number; drift: number }>>([]);

  useEffect(() => {
    if (paymentStep === "processing") {
      const interval = setInterval(() => {
        setProcessingIndex((prev) => {
          if (prev < processingMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              // Generate confetti particles with pre-calculated drift for render purity
              const particles = Array.from({ length: 45 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                color: ["#71cffe", "#f9723b", "#bc71fe", "#edac1c", "#ff409f", "#6ebf22"][Math.floor(Math.random() * 6)],
                size: Math.random() * 8 + 6,
                delay: Math.random() * 0.5,
                duration: Math.random() * 2 + 2,
                drift: Math.random() * 20 - 10
              }));
              setConfettiParticles(particles);
              setPaymentStep("success");
            }, 1000);
            return prev;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [paymentStep]);

  // QRIS auto pay simulator after 6 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (checkoutOpen && paymentMethod === "qris" && paymentStep === "method") {
      timer = setTimeout(() => {
        setPaymentStep("processing");
        setProcessingIndex(0);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [checkoutOpen, paymentMethod, paymentStep]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) setCardCvv(value);
  };

  const handleCardPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) return;
    setPaymentStep("processing");
    setProcessingIndex(0);
  };

  const fillDemoCard = () => {
    setCardNumber("4111 2222 3333 4444");
    setCardName("MOHAMMAD YOGA");
    setCardExpiry("12/30");
    setCardCvv("123");
  };

  const getAccentGradient = () => {
    switch (selectedColor) {
      case "pink":
        return "from-pink-500 via-rose-500 to-red-500";
      case "orange":
        return "from-orange-500 via-amber-500 to-yellow-500";
      case "yellow":
        return "from-amber-400 via-yellow-500 to-orange-400";
      case "green":
        return "from-emerald-500 via-green-500 to-teal-500";
      case "cyan":
      case "blue":
        return "from-cyan-500 via-blue-500 to-indigo-600";
      case "purple":
        return "from-purple-500 via-violet-500 to-fuchsia-500";
      default:
        return "from-blue-500 via-indigo-500 to-purple-600";
    }
  };

  const getBorderColor = () => {
    switch (selectedStyle) {
      case "neobrutalism":
        return "border-3 border-zinc-955 dark:border-white shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(255,255,255,1)] rounded-none bg-white dark:bg-zinc-900";
      case "claymorphism":
        return "border border-white/40 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.05),_inset_-3px_-3px_8px_rgba(0,0,0,0.05),_inset_3px_3px_8px_rgba(255,255,255,0.4)] bg-white/80 dark:bg-zinc-900/80";
      case "glassmorphism":
      case "liquid-glass":
        return "border border-white/20 dark:border-white/10 rounded-2xl shadow-xl bg-white/20 dark:bg-zinc-950/50 backdrop-blur-md";
      default:
        return "border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg bg-white dark:bg-zinc-900/95";
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto bg-zinc-950/20 dark:bg-zinc-950/30 backdrop-blur-[3px] p-4 font-sans text-left">
      
      {/* Main Lock Screen Card */}
      <AnimatePresence>
        {!checkoutOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: -15 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className={`w-full max-w-md p-5 md:p-6 flex flex-col relative overflow-hidden ${getBorderColor()}`}
          >
            {/* Ambient Background Glow inside Card */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-sakode-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-sakode-accent/10 rounded-full blur-2xl pointer-events-none" />

            {/* Trial Exhausted Warning */}
            {wasTrialExhausted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 rounded-xl text-center text-[11px] font-black flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Waktu trial 60 detik telah habis. Silakan aktifkan akses penuh!</span>
              </motion.div>
            )}

            {/* Locked Padlock Animation Header */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="relative mb-3">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.04, 1],
                    boxShadow: [
                      "0 0 0 0px rgba(113, 207, 254, 0.15)",
                      "0 0 0 8px rgba(113, 207, 254, 0.3)",
                      "0 0 0 0px rgba(113, 207, 254, 0.15)"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-12 h-12 rounded-full bg-linear-to-tr from-sakode-primary to-sakode-accent flex items-center justify-center text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full shadow-sm uppercase">
                  Premium
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white leading-tight mt-1">
                Buka Dasbor Premium
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-455 mt-1 max-w-xs font-semibold">
                Dapatkan akses instan ke seluruh fitur premium SAKODE Academy.
              </p>
            </div>

            {/* Price tag */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-xl p-3.5 border border-zinc-200/40 dark:border-zinc-800/40 text-center mb-4">
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-wider">Akses Premium Bulanan</div>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className="text-xs font-black text-zinc-400">$</span>
                <span className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">20</span>
                <span className="text-[10px] font-black text-zinc-400">USD / Bulan</span>
                <span className="text-[10px] text-zinc-505 dark:text-zinc-455 ml-1.5 line-through font-bold">($49)</span>
              </div>
              <div className="text-[9px] text-emerald-500 dark:text-emerald-400 font-extrabold mt-0.5">
                Langganan Bulanan • Perpanjang Otomatis
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-2 mb-5">
              {[
                "Dasbor & Panel Kontrol Multi-Role Lengkap",
                "Manajemen Siswa, Mentor & Jadwal Kelas",
                "Grafik Analitis & Tracker Progress Belajar",
                "Review Pendaftaran Siswa & Keanggotaan Ekskul"
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[11px] text-zinc-700 dark:text-zinc-300">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-semibold">{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {/* Buy Button */}
              <button
                onClick={() => setCheckoutOpen(true)}
                className={`w-full py-3 px-6 rounded-xl text-white font-black text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 bg-linear-to-r ${getAccentGradient()} shadow-md shadow-sakode-primary/20 hover:brightness-110`}
              >
                <span>Beli Sekarang ($20)</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* 60s Trial Button */}
              <button
                onClick={onStartTrial}
                className="w-full py-2.5 px-6 rounded-xl border border-zinc-250 dark:border-zinc-700/80 bg-white/40 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs transition-all active:scale-[0.98] cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Coba Akses Gratis (60 Detik)</span>
              </button>

              {/* Bypass Button for Demo/Experiment */}
              <button
                onClick={onUnlock}
                className="w-full text-center text-[10px] font-black text-zinc-450 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-350 transition-colors duration-150 cursor-pointer underline underline-offset-4 decoration-zinc-400/40"
              >
                Bypass Lisensi (Selamanya)
              </button>
            </div>

            {/* Safe badges */}
            <div className="flex justify-center items-center gap-4 mt-5 pt-3.5 border-t border-zinc-200/50 dark:border-zinc-800/50 text-[9px] text-zinc-400 dark:text-zinc-500 font-bold">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-zinc-455" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Pembayaran 100% Aman</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-zinc-455" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Garansi 30 Hari</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Experience Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: -15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full max-w-md p-5 md:p-6 flex flex-col relative overflow-hidden ${getBorderColor()}`}
            >
              {/* Close Button */}
              {paymentStep !== "processing" && (
                <button
                  onClick={() => setCheckoutOpen(false)}
                  aria-label="Tutup modal checkout"
                  title="Tutup"
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors duration-150 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {paymentStep === "method" && (
                <>
                  <div className="mb-4">
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">Checkout Pembayaran</h3>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Selesaikan lisensi Anda untuk mendapatkan akses premium bulanan.
                    </p>
                  </div>

                  {/* Payment Methods Tabs */}
                  <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-4">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === "card"
                          ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-3xs"
                          : "text-zinc-450 hover:text-zinc-655 dark:hover:text-zinc-355"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Kartu Kredit</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("qris")}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === "qris"
                          ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-3xs"
                          : "text-zinc-450 hover:text-zinc-655 dark:hover:text-zinc-355"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h3m-3-3H9m4 14H9m12-14v3m0 0h-3m3-3h-3M3 8h3m-3 0v3m0-3h3m12 0h3m-3 0v3m0-3h3M3 16h3m-3 0v3m0-3h3m6-4h.01M9 16h.01M16 16h.01" />
                      </svg>
                      <span>QRIS (E-Wallet)</span>
                    </button>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className="space-y-4">
                      {/* Virtual Card Preview */}
                      <div className="flex justify-center">
                        <div className="w-60 h-36 bg-linear-to-tr from-zinc-900 via-zinc-800 to-zinc-950 text-white rounded-xl p-3.5 shadow-md border border-white/10 relative flex flex-col justify-between overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div className="w-7 h-5 bg-linear-to-br from-amber-200 to-amber-400 rounded-xs border border-amber-300 shadow-3xs" />
                            <span className="text-[8px] font-black tracking-widest text-zinc-400">SAKODE PREMIUM</span>
                          </div>

                          <div className="text-sm font-bold font-mono tracking-widest my-1.5 select-all">
                            {cardNumber || "•••• •••• •••• ••••"}
                          </div>

                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-[6px] text-zinc-450 uppercase font-black">Nama Pemilik</div>
                              <div className="text-[9px] font-black truncate max-w-32">
                                {cardName || "NAMA PEMILIK"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[6px] text-zinc-450 uppercase font-black">Valid Thru</div>
                              <div className="text-[9px] font-black font-mono">
                                {cardExpiry || "MM/YY"}
                              </div>
                            </div>
                          </div>

                          <div className="absolute -right-3.75 -bottom-3.75 w-16 h-16 rounded-full border border-white/5 bg-sakode-accent/5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Card Form */}
                      <form onSubmit={handleCardPay} className="space-y-2.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Detail Kartu</label>
                          <button
                            type="button"
                            onClick={fillDemoCard}
                            className="text-[9px] font-extrabold text-sakode-primary hover:text-sakode-primary/80 transition-colors duration-150 cursor-pointer uppercase tracking-wider"
                          >
                            ⚡ Isi Kartu Demo
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Nomor Kartu"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-sakode-primary"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Nama Pemilik Kartu"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-sakode-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            required
                            placeholder="Exp (MM/YY)"
                            value={cardExpiry}
                            onChange={handleCardExpiryChange}
                            className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-sakode-primary"
                          />
                          <input
                            type="password"
                            required
                            placeholder="CVV"
                            value={cardCvv}
                            onChange={handleCardCvvChange}
                            className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-sakode-primary"
                          />
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-2.5 px-4 rounded-xl text-white font-black text-xs transition-all active:scale-[0.98] cursor-pointer bg-linear-to-r ${getAccentGradient()} hover:brightness-110 mt-1 flex items-center justify-center gap-1.5`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Bayar $20.00 Sekarang</span>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-2">
                      {/* QRIS Code box */}
                      <div className="relative p-3 bg-white rounded-xl shadow-sm border border-zinc-150 mb-3 select-none">
                        
                        <motion.div
                          animate={{ y: [0, 130, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                          className="absolute left-3 right-3 top-3 h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] pointer-events-none z-10"
                        />

                        <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="white" />
                          <rect x="5" y="5" width="25" height="25" fill="#000" stroke="#fff" strokeWidth="2" />
                          <rect x="10" y="10" width="15" height="15" fill="#fff" />
                          <rect x="13" y="13" width="9" height="9" fill="#000" />
                          
                          <rect x="70" y="5" width="25" height="25" fill="#000" stroke="#fff" strokeWidth="2" />
                          <rect x="75" y="10" width="15" height="15" fill="#fff" />
                          <rect x="78" y="13" width="9" height="9" fill="#000" />
                          
                          <rect x="5" y="70" width="25" height="25" fill="#000" stroke="#fff" strokeWidth="2" />
                          <rect x="10" y="75" width="15" height="15" fill="#fff" />
                          <rect x="13" y="78" width="9" height="9" fill="#000" />
                          
                          <path d="M35 10 h5 v5 h-5 z M45 5 h5 v10 h-5 z M55 10 h10 v5 h-10 z M35 20 h15 v5 h-15 z M60 20 h5 v5 h-5 z M40 30 h5 v5 h-5 z M50 30 h10 v5 h-10 z M65 30 h5 v5 h-5 z" fill="#000" />
                          <path d="M5 35 h10 v5 h-10 z M25 35 h5 v5 h-5 z M35 40 h5 v5 h-5 z M50 40 h15 v5 h-15 z M75 40 h10 v5 h-10 z M15 50 h5 v5 h-5 z M30 50 h10 v5 h-10 z M55 50 h10 v5 h-10 z M75 50 h20 v5 h-20 z" fill="#000" />
                          <path d="M5 60 h5 v5 h-5 z M20 60 h10 v5 h-10 z M40 60 h5 v5 h-5 z M55 60 h5 v5 h-5 z M70 60 h15 v5 h-15 z M35 70 h10 v5 h-10 z M50 70 h5 v5 h-5 z M65 70 h5 v5 h-5 z" fill="#000" />
                          <path d="M35 80 h5 v10 h-5 z M45 80 h15 v5 h-15 z M75 80 h5 v5 h-5 z M85 80 h10 v5 h-10 z M40 90 h10 v5 h-10 z M60 90 h25 v5 h-25 z" fill="#000" />
                          
                          <rect x="42" y="42" width="16" height="16" rx="3" fill="#030307" stroke="#fff" strokeWidth="1.5" />
                          <path d="M46 47 h3 v2 h-3 z M50 47 h4 v6 h-4 z M46 51 h3 v2 h-3 z" fill="#71cffe" />
                        </svg>
                      </div>

                      <div className="text-[10px] font-black text-zinc-800 dark:text-zinc-150 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                        <span>Merchant: SAKODE ACADEMY CO.</span>
                      </div>

                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-xs mb-3.5 font-semibold">
                        Pindai kode QRIS di atas untuk membayar <span className="font-extrabold text-zinc-800 dark:text-white">Rp 320.000</span> ($20).
                      </p>

                      <div className="flex flex-col gap-2 w-full max-w-xs">
                        <div className="text-[9px] text-zinc-450 dark:text-zinc-500 flex items-center justify-center gap-1.5 font-black">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          <span>Membayar otomatis dalam 6s...</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPaymentStep("processing");
                            setProcessingIndex(0);
                          }}
                          className="py-1.5 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-zinc-200 dark:border-zinc-700 transition-colors duration-150 cursor-pointer"
                        >
                          ⚡ Bayar Otomatis Sekarang
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Processing Loader State */}
              {paymentStep === "processing" && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="relative w-12 h-12 mb-4">
                    <div className="absolute inset-0 rounded-full border-3 border-zinc-200 dark:border-zinc-800" />
                    <div className="absolute inset-0 rounded-full border-3 border-t-sakode-primary border-r-sakode-accent animate-spin" />
                  </div>
                  
                  <motion.h4
                    key={processingIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-xs font-black text-zinc-800 dark:text-zinc-200"
                  >
                    {processingMessages[processingIndex]}
                  </motion.h4>
                  
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-black mt-1.5 uppercase tracking-widest">
                    Mohon tunggu sebentar
                  </p>
                </div>
              )}

              {/* Success Screen State */}
              {paymentStep === "success" && (
                <div className="flex flex-col items-center justify-center py-4 text-center relative overflow-hidden">
                  
                  {/* Confetti Falling elements */}
                  {confettiParticles.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ left: `${p.x}%`, top: `${p.y}%`, rotate: 0 }}
                      animate={{
                        top: "105%",
                        rotate: 360,
                        left: `${p.x + p.drift}%`
                      }}
                      transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: "linear",
                        repeat: Infinity
                      }}
                      className="absolute z-0 pointer-events-none rounded-xs"
                      style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color
                      }}
                    />
                  ))}

                  <div className="z-10 flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, delay: 0.2 }}
                      className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 mb-3"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>

                    <h3 className="text-base font-black text-zinc-900 dark:text-white leading-tight">
                      Pembayaran Berhasil!
                    </h3>
                    
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs font-semibold">
                      Terima kasih! Pembayaran sebesar <span className="font-extrabold text-zinc-800 dark:text-zinc-200">$20.00</span> telah berhasil diverifikasi.
                    </p>

                    <div className="w-full bg-zinc-50 dark:bg-zinc-900/40 rounded-xl p-2.5 border border-zinc-200/50 dark:border-zinc-800/50 text-[9px] text-zinc-500 dark:text-zinc-400 flex flex-col gap-1.5 my-4 text-left max-w-xs font-black font-mono">
                      <div>INVOICE ID: INV-SAKODE-98721</div>
                      <div>DATE: {new Date().toLocaleDateString("id-ID")}</div>
                      <div>STATUS: SUCCESS / BULANAN (RECURRING)</div>
                    </div>

                    <button
                      onClick={onUnlock}
                      className={`py-2.5 px-6 rounded-xl text-white font-black text-xs transition-all active:scale-[0.98] cursor-pointer bg-linear-to-r ${getAccentGradient()} hover:brightness-110 shadow-md shadow-sakode-primary/20 flex items-center gap-1.5`}
                    >
                      <span>Jelajahi Dasbor Premium</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
