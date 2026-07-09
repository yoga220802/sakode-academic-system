"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import * as UIStyles from "@/UI";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass } from "@/UI/shared/color-utils";
import { AestheticBackground } from "@/app/_components/AestheticBackground";

function RegisterForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { selectedStyle, selectedColor } = useUIStyle();
	const { resolvedTheme, setTheme } = useTheme();
	
	// Query parameters for acquisition context
	const program = searchParams.get("program") || "";
	const ref = searchParams.get("ref") || "";

	// Tab state
	const [activeTab, setActiveTab] = useState<"siswa" | "referrer">("siswa");

	// Form state
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agreeTerms, setAgreeTerms] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	
	// Referrer specific form fields
	const [promoMethod, setPromoMethod] = useState("Social Media");
	const [payoutBank, setPayoutBank] = useState("BCA");
	const [payoutAccount, setPayoutAccount] = useState("");

	// Error states
	const [nameError, setNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [payoutAccountError, setPayoutAccountError] = useState("");
	const [agreeError, setAgreeError] = useState(false);
	const [alertMsg, setAlertMsg] = useState<{ type: "warning" | "info"; title: string; desc: string } | null>(null);

	const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

	// Helper to resolve human-readable program names from stable slugs
	const getProgramDisplayName = (slug: string) => {
		switch (slug) {
			case "react-nextjs-professional":
				return "React & Next.js Professional";
			case "typescript-data-structures":
				return "TypeScript & Data Structures";
			case "backend-go-docker":
				return "Backend Dev Go/Docker";
			case "fullstack-product-engineer":
				return "Fullstack Product Engineer";
			default:
				return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
		}
	};

	// Password strength evaluations
	const hasMinLength = password.length >= 6;
	const hasNumber = /\d/.test(password);
	const hasUppercase = /[A-Z]/.test(password);

	const getTabClass = (tab: "siswa" | "referrer") => {
		const isActive = activeTab === tab;
		const base = "flex-1 text-center py-2 text-xs font-bold transition-all cursor-pointer ";
		if (isActive) {
			if (selectedStyle === "neobrutalism") {
				return base + "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
			} else if (selectedStyle === "claymorphism") {
				return base + "bg-white dark:bg-zinc-800 text-sakode-blue shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3)] border border-slate-100/50 rounded-xl";
			} else if (selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass") {
				return base + "bg-white/20 dark:bg-white/10 text-zinc-900 dark:text-white border border-white/20 backdrop-blur-xs rounded-lg";
			} else {
				return base + "bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-900 dark:text-white rounded-lg";
			}
		} else {
			return base + "text-zinc-450 hover:text-zinc-650 dark:text-zinc-500 dark:hover:text-zinc-300";
		}
	};

	const validateForm = () => {
		let isValid = true;
		setNameError("");
		setEmailError("");
		setPasswordError("");
		setPayoutAccountError("");
		setAgreeError(false);

		// Name validation
		if (!name.trim()) {
			setNameError("Nama lengkap wajib diisi");
			isValid = false;
		}

		// Email validation
		const cleanedEmail = email.trim();
		if (!cleanedEmail) {
			setEmailError("Email wajib diisi");
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(cleanedEmail)) {
			setEmailError("Format email tidak valid");
			isValid = false;
		}

		// Password validation
		if (!password) {
			setPasswordError("Kata sandi wajib diisi");
			isValid = false;
		} else if (!hasMinLength || !hasNumber || !hasUppercase) {
			setPasswordError("Kata sandi belum memenuhi kriteria keamanan");
			isValid = false;
		}

		// Referrer Account validation
		if (activeTab === "referrer") {
			if (!payoutAccount.trim()) {
				setPayoutAccountError("Nomor rekening wajib diisi");
				isValid = false;
			}
		}

		// Terms validation
		if (!agreeTerms) {
			setAgreeError(true);
			isValid = false;
		}

		return isValid;
	};

	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateForm()) {
			setAlertMsg({
				type: "warning",
				title: "Pendaftaran Gagal",
				desc: "Silakan lengkapi seluruh kolom formulir sesuai panduan.",
			});
			return;
		}

		setIsLoading(true);
		setAlertMsg(null);

		setTimeout(() => {
			setIsLoading(false);
			
			if (activeTab === "referrer") {
				setAlertMsg({
					type: "info",
					title: "Registrasi Referrer Berhasil!",
					desc: "Akun Mitra Referrer Anda berhasil didaftarkan. Mengalihkan ke halaman login...",
				});
				setTimeout(() => {
					router.push("/login");
				}, 1800);
			} else {
				const hasAcquisitionContext = !!(program || ref);
				setAlertMsg({
					type: "info",
					title: "Registrasi Berhasil!",
					desc: hasAcquisitionContext
						? "Akun Anda berhasil didaftarkan. Mengalihkan ke halaman pemilihan paket..."
						: "Akun Anda berhasil didaftarkan. Mengalihkan ke halaman login...",
				});
				setTimeout(() => {
					if (hasAcquisitionContext) {
						router.push(`/register/enroll?program=${program}&ref=${ref}`);
					} else {
						router.push("/login");
					}
				}, 1800);
			}
		}, 1500);
	};

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

				{/* Back button & theme */}
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
			<main className='relative flex-1 w-full max-w-xl flex flex-col items-center justify-center px-4 py-12 sm:py-16 z-10'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="w-full relative z-10"
				>
					<UI.Card accentColor={selectedColor}>
						<div className="p-2 sm:p-6 flex flex-col gap-6">
							{/* Form Title */}
							<div className="text-center">
								<UI.Heading className="text-2xl! font-extrabold! mb-1! text-zinc-900 dark:text-white font-sans">
									{activeTab === "siswa" ? "Daftar Akun Baru" : "Kemitraan Mitra Referrer"}
								</UI.Heading>
								<p className="text-xs text-zinc-555 dark:text-zinc-400 font-medium">
									{activeTab === "siswa" 
										? "Buat akun gratis untuk memulai perjalanan coding Anda" 
										: "Bagikan kode referral Anda, bantu siswa baru belajar, dan dapatkan komisi"}
								</p>
							</div>

							{/* Tab Switcher */}
							<div className="flex gap-2 p-1 bg-zinc-100/50 dark:bg-zinc-900/35 border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl">
								<button
									type="button"
									className={getTabClass("siswa")}
									onClick={() => {
										setActiveTab("siswa");
										setAlertMsg(null);
									}}
									disabled={isLoading}
								>
									Calon Siswa
								</button>
								<button
									type="button"
									className={getTabClass("referrer")}
									onClick={() => {
										setActiveTab("referrer");
										setAlertMsg(null);
									}}
									disabled={isLoading}
								>
									Mitra Referrer
								</button>
							</div>

							{/* Acquisition Summary Context (Preserved Context Indicator) */}
							{activeTab === "siswa" && (program || ref) && (
								<div className="p-4 rounded-2xl bg-zinc-50/60 dark:bg-zinc-900/35 border border-zinc-200/50 dark:border-zinc-800/80 flex flex-col gap-2.5 text-xs">
									<div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 dark:text-zinc-555 uppercase tracking-widest">
										<Icons.Sparkles className="w-3.5 h-3.5 text-sakode-yellow" />
										Konteks Pembelian Terdeteksi
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-650 dark:text-zinc-450 font-semibold">
										{program && (
											<div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl">
												<Icons.Briefcase className="w-4 h-4 text-zinc-450 shrink-0" />
												<div className="min-w-0">
													<span className="block text-[8.5px] uppercase tracking-wider text-zinc-400">Program</span>
													<span className="font-extrabold text-zinc-800 dark:text-zinc-200 block truncate">{getProgramDisplayName(program)}</span>
												</div>
											</div>
										)}
										{ref && (
											<div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl">
												<Icons.Gift className="w-4 h-4 text-zinc-450 shrink-0" />
												<div className="min-w-0">
													<span className="block text-[8.5px] uppercase tracking-wider text-zinc-400">Referral</span>
													<span className="font-extrabold text-zinc-800 dark:text-zinc-200 block truncate">{ref}</span>
												</div>
											</div>
										)}
									</div>
								</div>
							)}

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

							{/* Form Input fields */}
							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<div>
									<UI.Label htmlFor="name-input">Nama Lengkap</UI.Label>
									<UI.Input
										id="name-input"
										type="text"
										placeholder="Contoh: John Doe"
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
									<UI.Label htmlFor="email-input">
										{activeTab === "siswa" ? "Email Akademik" : "Email Kontak / Bisnis"}
									</UI.Label>
									<UI.Input
										id="email-input"
										type="email"
										placeholder="nama@domain.com"
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
									<UI.Label htmlFor="password-input">Kata Sandi Baru</UI.Label>
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

									{/* Interactive Password Guidance Checklist */}
									<div className="p-3 mt-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/30 dark:border-zinc-850/30 flex flex-col gap-1.5">
										<span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
											Persyaratan Sandi Keamanan
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

								{/* Referrer-Specific Fields */}
								{activeTab === "referrer" && (
									<React.Fragment>
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
									</React.Fragment>
								)}

								{/* Terms check */}
								<div className="flex items-start gap-2.5 mt-2">
									<UI.Toggle 
										checked={agreeTerms} 
										onChange={() => !isLoading && setAgreeTerms(!agreeTerms)} 
										accentColor={selectedColor} 
									/>
									<span className={`text-xs font-semibold select-none mt-0.5 ${agreeError ? "text-rose-500 font-bold" : "text-zinc-500 dark:text-zinc-400"}`}>
										Saya menyetujui <span className="underline cursor-pointer hover:text-zinc-900 dark:hover:text-white">Syarat & Ketentuan</span> serta <span className="underline cursor-pointer hover:text-zinc-900 dark:hover:text-white">Kebijakan {activeTab === "siswa" ? "Layanan" : "Kemitraan Referrer"}</span> Sakode Academy.
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
										{activeTab === "siswa" ? "Mulai Belajar Sekarang" : "Daftar Mitra Referrer"}
									</UI.Button>
								</div>
							</form>

							{/* Login Toggle Link */}
							<div className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-t border-zinc-150/40 dark:border-zinc-800/40 pt-4">
								<span>
									Sudah punya akun?{" "}
									<button
										disabled={isLoading}
										onClick={() => {
											router.push("/login");
										}}
										className={`${getTextClass(selectedColor)} hover:underline font-bold ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ml-1 bg-transparent border-0`}
									>
										Masuk
									</button>
								</span>
							</div>
						</div>
					</UI.Card>
				</motion.div>
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

export default function RegisterPage() {
	return (
		<Suspense fallback={
			<div className="py-16 flex flex-col items-center justify-center gap-3 w-full min-h-screen bg-background">
				<div className="w-8 h-8 rounded-full border-2 border-sakode-blue border-t-transparent animate-spin" />
				<span className="text-xs font-bold text-zinc-500">Memuat formulir...</span>
			</div>
		}>
			<RegisterForm />
		</Suspense>
	);
}
