"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import * as UIStyles from "@/UI";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass } from "@/UI/shared/color-utils";
import { AestheticBackground } from "@/app/_components/AestheticBackground";

export default function ReferralLandingPage() {
  const router = useRouter();
  const { selectedStyle, selectedColor } = useUIStyle();
  const { resolvedTheme, setTheme } = useTheme();

  // Registration Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [promoMethod, setPromoMethod] = useState("Social Media");
  const [payoutBank, setPayoutBank] = useState("BCA");
  const [payoutAccount, setPayoutAccount] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation States
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [payoutAccountError, setPayoutAccountError] = useState("");
  const [agreeError, setAgreeError] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "warning" | "info"; title: string; desc: string } | null>(null);

  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  const validateForm = () => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setPayoutAccountError("");
    setAgreeError(false);

    if (!name.trim()) {
      setNameError("Nama lengkap wajib diisi");
      isValid = false;
    }
    const cleanedEmail = email.trim();
    if (!cleanedEmail) {
      setEmailError("Email wajib diisi");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(cleanedEmail)) {
      setEmailError("Format email tidak valid");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Kata sandi wajib diisi");
      isValid = false;
    } else if (!hasMinLength || !hasNumber || !hasUppercase) {
      setPasswordError("Kata sandi belum memenuhi kriteria keamanan");
      isValid = false;
    }
    if (!payoutAccount.trim()) {
      setPayoutAccountError("Nomor rekening wajib diisi");
      isValid = false;
    }
    if (!agreeTerms) {
      setAgreeError(true);
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      setAlertMsg({
        type: "warning",
        title: "Validasi Gagal",
        desc: "Silakan periksa kembali dan lengkapi kolom pendaftaran.",
      });
      return;
    }

    setIsLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      setAlertMsg({
        type: "info",
        title: "Pendaftaran Berhasil!",
        desc: "Akun Mitra Referrer Anda berhasil didaftarkan. Mengalihkan ke halaman login...",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }, 1500);
  };

  // Mock Leaders List
  const generalStandings = [
    { rank: 1, name: "Rian Hidayatullah", count: 47, commission: "Rp 11.250.000" },
    { rank: 2, name: "Siti Aminah Nur", count: 32, commission: "Rp 7.800.000" },
    { rank: 3, name: "Budi Harjo", count: 28, commission: "Rp 6.400.000" }
  ];

  const programStandings = [
    { program: "React & Next.js Professional", leader: "Hamdan Syakiri", count: 21 },
    { program: "TypeScript & Data Structures", leader: "Asep Kurnia", count: 14 },
    { program: "Backend Go/Docker Bootcamp", leader: "Rara Anindita", count: 12 }
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
      <AestheticBackground mode="landing" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none z-0" />

      {/* Navbar Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-900/50 z-20 relative">
        <button
        title="Kembali ke Beranda"
          onClick={() => router.push("/")} 
          className="bg-[#030307] py-2.5 px-4 rounded-xl border border-zinc-800/80 shadow-md flex items-center justify-center cursor-pointer"
        >
          <Image
            src="/assets/logo/sakode.svg"
            alt="Sakode Academy Logo"
            width={120}
            height={33}
            priority
            className="h-6 w-auto"
          />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle Light/Dark Theme"
          >
            {resolvedTheme === "dark" ? (
              <Icons.Sun className="w-4 h-4" />
            ) : (
              <Icons.Moon className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={() => router.push("/login")}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-850 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-3xs`}
          >
            Masuk Portal
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 w-full max-w-5xl px-4 py-12 md:py-16 z-10 flex flex-col gap-12 text-left">
        
        {/* 1. Hero Section */}
        <section className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-wider ${getTextClass(selectedColor)} bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 mx-auto`}>
            <Icons.Gift className="w-3.5 h-3.5" />
            Program Kemitraan Sakode
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight">
            Bagikan Ilmu Coding, <br/>Dapatkan Penghasilan Tambahan
          </h1>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium">
            Rekomendasikan program IT & coding bootcamp premium Sakode Academy ke relasi Anda. Peroleh komisi hingga <strong>Rp 250.000 per siswa</strong> yang mendaftar dan terverifikasi.
          </p>
          <div className="flex justify-center gap-3 mt-2">
            <a
              href="#daftar-referrer"
              className={`text-xs font-black px-6 py-3 rounded-xl text-white ${getBgClass(selectedColor)} hover:opacity-90 transition-opacity shadow-sm`}
            >
              Gabung Jadi Mitra
            </a>
          </div>
        </section>

        {/* 2. Leaderboards & Standings */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* General Leaders */}
          <UI.Card accentColor={selectedColor}>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-black text-zinc-850 dark:text-white uppercase tracking-wider leading-none">
                  Top Pemberi Referral (Umum)
                </h3>
                <span className="text-[10px] text-zinc-400 font-bold block mt-1">
                  Klasemen akumulasi total komisi mitra referral terbanyak.
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {generalStandings.map((std, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-sakode-blue/10 flex items-center justify-center text-xs font-black text-sakode-blue">
                        {std.rank}
                      </div>
                      <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                        {std.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-zinc-900 dark:text-white block leading-none">
                        {std.count} Siswa
                      </span>
                      <span className="text-[9.5px] font-bold text-sakode-green block mt-1">
                        {std.commission}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </UI.Card>

          {/* Program Specific Leaders */}
          <UI.Card accentColor={selectedColor}>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-black text-zinc-850 dark:text-white uppercase tracking-wider leading-none">
                  Standings Berdasarkan Program
                </h3>
                <span className="text-[10px] text-zinc-400 font-bold block mt-1">
                  Mitra rujukan terbanyak untuk masing-masing program kelas spesifik.
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {programStandings.map((std, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 block leading-none mb-1">
                        {std.program}
                      </span>
                      <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                        {std.leader}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-black text-sakode-blue">
                        {std.count} Rujukan
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </UI.Card>
        </section>

        {/* 3. Aturan & Tata Cara */}
        <section className="flex flex-col gap-8 mt-2">
          {/* Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payout Rules */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-zinc-850 dark:text-white uppercase tracking-wider">
                Aturan & Ketentuan Pencairan Dana
              </h3>
              <div className="flex flex-col gap-3 text-xs font-medium text-zinc-650 dark:text-zinc-400">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/55 dark:border-zinc-850/50 rounded-xl flex gap-3">
                  <Icons.Briefcase className="w-5 h-5 text-sakode-blue shrink-0" />
                  <div>
                    <h4 className="font-black text-zinc-850 dark:text-zinc-200 mb-0.5">Tidak Ada Batas Minimal (No Threshold)</h4>
                    Berapapun pendapatan komisi Anda akan dicairkan sebulan sekali. Jika pencairan tidak diajukan, saldo otomatis diakumulasikan ke bulan-bulan berikutnya.
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/55 dark:border-zinc-850/50 rounded-xl flex gap-3">
                  <Icons.Calendar className="w-5 h-5 text-sakode-orange shrink-0" />
                  <div>
                    <h4 className="font-black text-zinc-850 dark:text-zinc-200 mb-0.5">Jadwal Pencairan Fleksibel</h4>
                    Tanggal pencairan bervariasi per program, namun secara umum dibuka pada <strong>tanggal 25 hingga 30/31 setiap bulannya</strong>. Info detail ada pada masing-masing program promo.
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/55 dark:border-zinc-850/50 rounded-xl flex gap-3">
                  <Icons.Gift className="w-5 h-5 text-sakode-yellow shrink-0" />
                  <div>
                    <h4 className="font-black text-zinc-850 dark:text-zinc-200 mb-0.5">Harga Komisi Bervariasi</h4>
                    Komisi satuan rujukan berbeda-beda di setiap program pembelajaran. Pastikan Anda membaca informasi detail program sebelum menyebarkan link.
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/55 dark:border-zinc-850/50 rounded-xl flex gap-3">
                  <Icons.Award className="w-5 h-5 text-sakode-green shrink-0" />
                  <div>
                    <h4 className="font-black text-zinc-850 dark:text-zinc-200 mb-0.5">Metode Transfer Bebas</h4>
                    Pencairan dana fleksibel ke rekening bank/e-wallet mana pun, dengan catatan seluruh biaya transfer administrasi ditanggung oleh penerima komisi.
                  </div>
                </div>
              </div>
            </div>

            {/* Referrer Rules */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-zinc-850 dark:text-white uppercase tracking-wider">
                Aturan & Kode Etik Mitra Referrer
              </h3>
              <div className="flex flex-col gap-3 text-xs font-medium text-zinc-650 dark:text-zinc-400">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/55 dark:border-zinc-850/50 rounded-xl flex gap-3">
                  <Icons.Sparkles className="w-5 h-5 text-sakode-blue shrink-0" />
                  <div>
                    <h4 className="font-black text-zinc-850 dark:text-zinc-200 mb-0.5">Self-Referral Diperbolehkan</h4>
                    Mitra diperbolehkan mendaftar program bootcamp dengan link rujukan sendiri. Komisi akan tetap dihitung setelah status pembayaran kelas berhasil diverifikasi.
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/55 dark:border-zinc-850/50 rounded-xl flex gap-3">
                  <Icons.Clipboard className="w-5 h-5 text-sakode-blue shrink-0" />
                  <div>
                    <h4 className="font-black text-zinc-850 dark:text-zinc-200 mb-0.5">Promosikan Informasi Secara Jujur</h4>
                    Wajib memberikan informasi yang benar tentang program Sakode. Dilarang menyebarkan hoax, memanipulasi diskon, atau spamming massal.
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/55 dark:border-zinc-850/50 rounded-xl flex gap-3">
                  <Icons.Users className="w-5 h-5 text-purple-500 shrink-0" />
                  <div>
                    <h4 className="font-black text-zinc-850 dark:text-zinc-200 mb-0.5">Kepatuhan Konten Media</h4>
                    Dilarang menyebarkan tautan rujukan di platform atau komunitas yang memuat konten ilegal, SARA, perjudian, atau kekerasan.
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/55 dark:border-zinc-850/50 rounded-xl flex gap-3">
                  <Icons.DocumentText className="w-5 h-5 text-sakode-green shrink-0" />
                  <div>
                    <h4 className="font-black text-zinc-850 dark:text-zinc-200 mb-0.5">Validitas Data Rekening</h4>
                    Referrer bertanggung jawab penuh atas kebenaran info rekening. Sakode tidak bertanggung jawab atas kesalahan transfer akibat salah input data.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tata Cara (Full width below) */}
          <div className="flex flex-col gap-4 mt-4 text-center">
            <h3 className="text-sm font-black text-zinc-850 dark:text-white uppercase tracking-wider">
              Tata Cara Pendaftaran & Kemitraan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-650 dark:text-zinc-400 mt-2 text-left">
              <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-850/30 rounded-2xl flex flex-col gap-2 relative">
                <div className="w-6 h-6 rounded-full bg-sakode-blue text-white flex items-center justify-center font-black text-xs">
                  1
                </div>
                <h4 className="font-black text-zinc-850 dark:text-zinc-200">Registrasi Akun Kemitraan</h4>
                Isi data diri lengkap Anda beserta informasi bank/e-wallet untuk pencairan dana pada formulir pendaftaran di bawah ini.
              </div>

              <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-850/30 rounded-2xl flex flex-col gap-2 relative">
                <div className="w-6 h-6 rounded-full bg-sakode-blue text-white flex items-center justify-center font-black text-xs">
                  2
                </div>
                <h4 className="font-black text-zinc-850 dark:text-zinc-200">Dapatkan Link Rujukan Kanonis</h4>
                Salin link promosi program bootcamp yang tersedia langsung di dashboard akun Referrer Anda setelah masuk log.
              </div>

              <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-850/30 rounded-2xl flex flex-col gap-2 relative">
                <div className="w-6 h-6 rounded-full bg-sakode-blue text-white flex items-center justify-center font-black text-xs">
                  3
                </div>
                <h4 className="font-black text-zinc-850 dark:text-zinc-200">Promosikan & Terima Komisi</h4>
                Sebarkan link rujukan Anda. Komisi secara otomatis tercatat dan siap dicairkan ketika murid baru terverifikasi.
              </div>
            </div>
          </div>
        </section>

        {/* 4. Onboarding Registration Form */}
        <section id="daftar-referrer" className="max-w-xl w-full mx-auto mt-6">
          <UI.Card accentColor={selectedColor}>
            <div className="p-5 sm:p-6 flex flex-col gap-5">
              <div className="text-center border-b border-zinc-150/40 dark:border-zinc-850/40 pb-4">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  Gabung Kemitraan Sekarang
                </h3>
                <span className="text-[11px] text-zinc-500 font-semibold block mt-1">
                  Lengkapi data formulir berikut untuk membuat akun Referrer aktif Anda.
                </span>
              </div>

              {/* Feedback Message */}
              <AnimatePresence mode="wait">
                {alertMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UI.Alert title={alertMsg.title} type={alertMsg.type}>
                      {alertMsg.desc}
                    </UI.Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                  <UI.Label htmlFor="name-input">Nama Lengkap Anda</UI.Label>
                  <UI.Input
                    id="name-input"
                    type="text"
                    placeholder="Contoh: Rudi Referrer"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    hasError={!!nameError}
                    disabled={isLoading}
                  />
                  {nameError && (
                    <span className="text-[10.5px] font-bold text-rose-500 mt-1 block">
                      ⚠️ {nameError}
                    </span>
                  )}
                </div>

                <div>
                  <UI.Label htmlFor="email-input">Email Kontak / Bisnis</UI.Label>
                  <UI.Input
                    id="email-input"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    hasError={!!emailError}
                    disabled={isLoading}
                  />
                  {emailError && (
                    <span className="text-[10.5px] font-bold text-rose-500 mt-1 block">
                      ⚠️ {emailError}
                    </span>
                  )}
                </div>

                <div>
                  <UI.Label htmlFor="password-input">Kata Sandi Akun</UI.Label>
                  <div className="relative">
                    <UI.Input
                      id="password-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      hasError={!!passwordError}
                      disabled={isLoading}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => !isLoading && setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-555 hover:text-zinc-650 dark:hover:text-zinc-350 transition-colors focus:outline-hidden ${isLoading ? "cursor-not-allowed opacity-55" : "cursor-pointer"}`}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <Icons.EyeOff className="w-4 h-4" />
                      ) : (
                        <Icons.Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="p-3 mt-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/30 dark:border-zinc-850/30 flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      Persyaratan Sandi
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-0.5">
                      <span className={`text-[10.5px] font-bold flex items-center gap-1 ${hasMinLength ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-400"}`}>
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] border ${hasMinLength ? "bg-emerald-500/10 border-emerald-500" : "border-zinc-300 dark:border-zinc-800"}`}>
                          {hasMinLength ? "✓" : "•"}
                        </span>
                        6+ Karakter
                      </span>
                      <span className={`text-[10.5px] font-bold flex items-center gap-1 ${hasNumber ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-400"}`}>
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] border ${hasNumber ? "bg-emerald-500/10 border-emerald-500" : "border-zinc-300 dark:border-zinc-800"}`}>
                          {hasNumber ? "✓" : "•"}
                        </span>
                        Ada Angka
                      </span>
                      <span className={`text-[10.5px] font-bold flex items-center gap-1 ${hasUppercase ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-400"}`}>
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] border ${hasUppercase ? "bg-emerald-500/10 border-emerald-500" : "border-zinc-300 dark:border-zinc-800"}`}>
                          {hasUppercase ? "✓" : "•"}
                        </span>
                        Huruf Kapital
                      </span>
                    </div>
                  </div>
                  {passwordError && (
                    <span className="text-[10.5px] font-bold text-rose-500 mt-2.5 block">
                      ⚠️ {passwordError}
                    </span>
                  )}
                </div>

                <div>
                  <UI.Label htmlFor="promo-method-select">Saluran Promosi Utama</UI.Label>
                  <div className="relative">
                    <UI.Select
                      id="promo-method-select"
                      value={promoMethod}
                      onChange={(e) => setPromoMethod(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="Social Media">Media Sosial (Instagram, LinkedIn, X, Facebook)</option>
                      <option value="Website / Blog">Website / Blog Pribadi</option>
                      <option value="Komunitas IT">Komunitas IT / Grup Belajar</option>
                      <option value="Rekomendasi Teman">Rekomendasi Teman / Off-line</option>
                      <option value="Lainnya">Lainnya</option>
                    </UI.Select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-450 dark:text-zinc-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <UI.Label htmlFor="payout-bank-select">Bank Pencairan</UI.Label>
                    <div className="relative">
                      <UI.Select
                        id="payout-bank-select"
                        value={payoutBank}
                        onChange={(e) => setPayoutBank(e.target.value)}
                        disabled={isLoading}
                      >
                        <option value="BCA">Bank BCA</option>
                        <option value="Mandiri">Bank Mandiri</option>
                        <option value="BRI">Bank BRI</option>
                        <option value="BNI">Bank BNI</option>
                      </UI.Select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-450 dark:text-zinc-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <UI.Label htmlFor="payout-account-input">Nomor Rekening</UI.Label>
                    <UI.Input
                      id="payout-account-input"
                      type="text"
                      placeholder="Contoh: 8012345678"
                      value={payoutAccount}
                      onChange={(e) => {
                        setPayoutAccount(e.target.value);
                        if (payoutAccountError) setPayoutAccountError("");
                      }}
                      hasError={!!payoutAccountError}
                      disabled={isLoading}
                    />
                    {payoutAccountError && (
                      <span className="text-[10.5px] font-bold text-rose-500 mt-1 block">
                        ⚠️ {payoutAccountError}
                      </span>
                    )}
                  </div>
                </div>

                {/* Terms Check */}
                <div className="flex items-start gap-2.5 mt-2">
                  <UI.Toggle 
                    checked={agreeTerms} 
                    onChange={() => !isLoading && setAgreeTerms(!agreeTerms)} 
                    accentColor={selectedColor} 
                  />
                  <span className={`text-xs font-semibold select-none mt-0.5 ${agreeError ? "text-rose-500 font-bold" : "text-zinc-500 dark:text-zinc-400"}`}>
                    Saya menyetujui <span className="underline cursor-pointer hover:text-zinc-900 dark:hover:text-white font-bold">Syarat & Ketentuan Kemitraan</span> Sakode Academy.
                  </span>
                </div>

                <div className="mt-2">
                  <UI.Button
                    type="submit"
                    variant="primary"
                    accentColor={selectedColor}
                    isLoading={isLoading}
                    isGradient
                    className="w-full cursor-pointer"
                  >
                    Daftar Sebagai Mitra Referrer
                  </UI.Button>
                </div>
              </form>
            </div>
          </UI.Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-6xl mx-auto py-8 px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-zinc-400 dark:text-zinc-555 border-t border-zinc-200/50 dark:border-zinc-900/60 z-10 font-medium">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} Sakode Academy. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            href="https://sakode.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors"
          >
            Website Utama
          </a>
          <a
            href="mailto:info@sakode.org"
            className="hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </footer>
    </div>
  );
}
