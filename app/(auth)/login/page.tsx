"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as UIStyles from "@/UI";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { useAuth } from "@/app/_components/AuthContext";
import { UserRole } from "@/app/_types/auth";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass } from "@/UI/shared/color-utils";
import { AestheticBackground } from "@/app/_components/AestheticBackground";

export default function LoginPage() {
	const router = useRouter();
	const { selectedStyle, selectedColor } = useUIStyle();
	const { login } = useAuth();
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	
	// Form state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [alertMsg, setAlertMsg] = useState<{ type: "warning" | "info"; title: string; desc: string } | null>(null);

	useEffect(() => {
		let active = true;
		requestAnimationFrame(() => {
			if (active) {
				setMounted(true);
			}
		});
		return () => {
			active = false;
		};
	}, []);

	const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

	const validateForm = () => {
		let isValid = true;
		setEmailError("");
		setPasswordError("");

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
			setPasswordError("Password wajib diisi");
			isValid = false;
		} else if (password.length < 6) {
			setPasswordError("Kata sandi minimal 6 karakter");
			isValid = false;
		}

		return isValid;
	};

	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		const cleanedEmail = email.trim();
		
		// If both fields are empty
		if (!cleanedEmail && !password) {
			setEmailError("Email wajib diisi");
			setPasswordError("Password wajib diisi");
			setAlertMsg({
				type: "warning",
				title: "Validasi Gagal",
				desc: "Email & Password wajib diisi.",
			});
			return;
		}

		if (!validateForm()) {
			let descMsg = "Silakan periksa kembali kolom input Anda.";
			if (!cleanedEmail) {
				descMsg = "Email wajib diisi.";
			} else if (!password) {
				descMsg = "Password wajib diisi.";
			}
			setAlertMsg({
				type: "warning",
				title: "Validasi Gagal",
				desc: descMsg,
			});
			return;
		}

		setIsLoading(true);
		setAlertMsg(null);

		setTimeout(() => {
			const cleanedEmailLower = email.toLowerCase().trim();
			
			// Mock credentials validation mapping
			const demoAccounts: Record<string, UserRole> = {
				"admin@sakode.com": "admin",
				"hamzah@sakode.com": "mentor_lead",
				"udin@sakode.com": "mentor",
				"panjul@gmail.com": "murid",
				"sudarsono@sekolah.sch.id": "school_principal"
			};

			const isDemoEmail = cleanedEmailLower in demoAccounts;
			const isCorrectPassword = password === "password123";

			if (!isDemoEmail || !isCorrectPassword) {
				setIsLoading(false);
				setAlertMsg({
					type: "warning",
					title: "Autentikasi Gagal",
					desc: "Email & Password mungkin salah.",
				});
				return;
			}

			setAlertMsg({
				type: "info",
				title: "Login Sukses!",
				desc: "Selamat datang kembali. Mengalihkan ke dashboard...",
			});

			setTimeout(() => {
				setIsLoading(false);
				const role = demoAccounts[cleanedEmailLower];
				login(role);
				if (role === "admin" || role === "mentor_lead" || role === "school_principal") {
					router.push("/dashboard");
				} else if (role === "mentor") {
					router.push("/mentor/dashboard");
				} else {
					router.push("/student/dashboard");
				}
			}, 1000);
		}, 1200);
	};

	const handleQuickLogin = (role: UserRole, demoEmail: string) => {
		setEmail(demoEmail);
		setPassword("password123");
		setAlertMsg(null);
		setEmailError("");
		setPasswordError("");
		
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			login(role);
			if (role === "admin" || role === "mentor_lead" || role === "school_principal") {
				router.push("/dashboard");
			} else if (role === "mentor") {
				router.push("/mentor/dashboard");
			} else {
				router.push("/student/dashboard");
			}
		}, 800);
	};

	if (!mounted) return null;

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
									Selamat Datang
								</UI.Heading>
								<p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">
									Masuk untuk mengakses portal akademik Sakode Academy
								</p>
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

							{/* Form Input fields */}
							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<div>
									<UI.Label htmlFor="email-input">Email Akademik</UI.Label>
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
									<UI.Label htmlFor="password-input">Kata Sandi</UI.Label>
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
									{passwordError && (
										<span className="text-[10.5px] font-bold text-rose-500 mt-1 block">
											⚠️ {passwordError}
										</span>
									)}
								</div>

								{/* Remember Me and Forgot Password Container */}
								<div className="flex items-center justify-between mt-1 mb-2">
									<div className="flex items-center gap-2">
										<UI.Toggle
											checked={rememberMe}
											onChange={() => !isLoading && setRememberMe(!rememberMe)}
											accentColor={selectedColor}
											aria-label="Ingat Saya"
										/>
										<span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 select-none">
											Ingat Saya
										</span>
									</div>
									<span 
										onClick={() => !isLoading && setAlertMsg({
											type: "info",
											title: "Lupa Kata Sandi",
											desc: "Silakan hubungi administrator IT Sakode untuk mengatur ulang kata sandi Anda."
										})}
										className={`text-xs font-semibold text-zinc-450 dark:text-zinc-555 hover:underline ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
									>
										Lupa kata sandi?
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
										Masuk ke Akun
									</UI.Button>
								</div>
							</form>
							
							{/* Quick Login Sandbox */}
							<div className="mt-5 pt-5 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-2">
								<span className="text-[10px] font-black text-zinc-400 dark:text-zinc-555 uppercase tracking-widest text-center">
									Akses Uji Coba Demo (Quick Login)
								</span>
								<div className="grid grid-cols-2 gap-2">
									<UI.Button 
										type="button" 
										variant="secondary" 
										accentColor={selectedColor} 
										disabled={isLoading}
										className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" 
										onClick={() => handleQuickLogin("admin", "admin@sakode.com")}
									>
										Admin
									</UI.Button>
									<UI.Button 
										type="button" 
										variant="secondary" 
										accentColor={selectedColor} 
										disabled={isLoading}
										className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" 
										onClick={() => handleQuickLogin("mentor_lead", "hamzah@sakode.com")}
									>
										Mentor Lead
									</UI.Button>
									<UI.Button 
										type="button" 
										variant="secondary" 
										accentColor={selectedColor} 
										disabled={isLoading}
										className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" 
										onClick={() => handleQuickLogin("mentor", "udin@sakode.com")}
									>
										Mentor
									</UI.Button>
									<UI.Button 
										type="button" 
										variant="secondary" 
										accentColor={selectedColor} 
										disabled={isLoading}
										className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" 
										onClick={() => handleQuickLogin("murid", "panjul@gmail.com")}
									>
										Murid
									</UI.Button>
									<UI.Button 
										type="button" 
										variant="secondary" 
										accentColor={selectedColor} 
										disabled={isLoading}
										className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" 
										onClick={() => handleQuickLogin("referrer", "rudi@referrer.com")}
									>
										Referrer Account
									</UI.Button>
									<UI.Button 
										type="button" 
										variant="secondary" 
										accentColor={selectedColor} 
										disabled={isLoading}
										className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" 
										onClick={() => handleQuickLogin("school_principal", "sudarsono@sekolah.sch.id")}
									>
										Kepala Sekolah (Principal)
									</UI.Button>
								</div>
							</div>

							{/* Signup Toggle Link */}
							<div className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-t border-zinc-150/40 dark:border-zinc-800/40 pt-4">
								<span>
									Belum bergabung?{" "}
									<button
										disabled={isLoading}
										onClick={() => {
											router.push("/register");
										}}
										className={`${getTextClass(selectedColor)} hover:underline font-bold ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ml-1 bg-transparent border-0`}
									>
										Daftar Gratis
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
