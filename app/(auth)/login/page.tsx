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
	const [showPassword, setShowPassword] = useState(false);
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

	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email || !password) {
			setAlertMsg({
				type: "warning",
				title: "Validasi Gagal",
				desc: "Email dan password wajib diisi.",
			});
			return;
		}

		setIsLoading(true);
		setAlertMsg(null);

		setTimeout(() => {
			setIsLoading(false);
			setAlertMsg({
				type: "info",
				title: "Login Sukses!",
				desc: "Selamat datang kembali di Sakode Academic System.",
			});
			// Mock redirect
			setTimeout(() => {
				let resolvedRole: UserRole = "murid";
				const cleanedEmail = email.toLowerCase().trim();
				if (cleanedEmail === "admin@sakode.com") {
					resolvedRole = "admin";
				} else if (cleanedEmail === "hamzah@sakode.com") {
					resolvedRole = "mentor_lead";
				} else if (cleanedEmail === "udin@sakode.com") {
					resolvedRole = "mentor";
				} else if (cleanedEmail === "sudarsono@sekolah.sch.id") {
					resolvedRole = "school_principal";
				} else if (cleanedEmail === "panjul@gmail.com") {
					resolvedRole = "murid";
				}

				login(resolvedRole);
				router.push("/dashboard");
			}, 1500);
		}, 1500);
	};

	if (!mounted) return null;

	const isGlassBg = selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass";



	return (
		<div className='relative min-h-screen w-full flex flex-col justify-between items-center bg-background text-foreground overflow-hidden font-sans transition-colors duration-300'>
			<AestheticBackground mode="auth" />

			{/* Grid Pattern overlay */}
			<div className='absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none z-0' />

			{/* Navbar Header */}
			<header className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-900/50 z-20 relative'>
				<button onClick={() => router.push("/")} aria-label="Kembali ke Beranda" className="bg-[#030307] py-2.5 px-4 rounded-xl border border-zinc-800/80 shadow-md flex items-center justify-center cursor-pointer">
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
							{/* Form Title & Switcher */}
							<div className="text-center">
								<UI.Heading className="text-2xl! font-extrabold! mb-1! text-zinc-900 dark:text-white font-sans">
									Selamat Datang
								</UI.Heading>
								<p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">
									Masuk untuk mengakses materi pembelajaran Sakode
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
										onChange={(e) => setEmail(e.target.value)}
										disabled={isLoading}
									/>
								</div>

								<div>
									<UI.Label htmlFor="password-input">Kata Sandi</UI.Label>
									<div className="relative">
										<UI.Input
											id="password-input"
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											disabled={isLoading}
											className="pr-12"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-555 hover:text-zinc-650 dark:hover:text-zinc-350 transition-colors focus:outline-hidden cursor-pointer"
											tabIndex={-1}
										>
											{showPassword ? (
												<Icons.EyeOff className="w-4 h-4" />
											) : (
												<Icons.Eye className="w-4 h-4" />
											)}
										</button>
									</div>
								</div>

								<div className="flex justify-end">
									<span className="text-xs font-semibold text-zinc-450 dark:text-zinc-555 hover:underline cursor-pointer">
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
									<UI.Button type="button" variant="secondary" accentColor={selectedColor} className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" onClick={() => { login("admin"); router.push("/dashboard"); }}>
										Admin
									</UI.Button>
									<UI.Button type="button" variant="secondary" accentColor={selectedColor} className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" onClick={() => { login("mentor_lead"); router.push("/dashboard"); }}>
										Mentor Lead
									</UI.Button>
									<UI.Button type="button" variant="secondary" accentColor={selectedColor} className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" onClick={() => { login("mentor"); router.push("/dashboard"); }}>
										Mentor
									</UI.Button>
									<UI.Button type="button" variant="secondary" accentColor={selectedColor} className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer" onClick={() => { login("murid"); router.push("/dashboard"); }}>
										Murid
									</UI.Button>
									<UI.Button type="button" variant="secondary" accentColor={selectedColor} className="text-[10px]! py-1.5! px-2! h-auto! cursor-pointer col-span-2" onClick={() => { login("school_principal"); router.push("/dashboard"); }}>
										Kepala Sekolah (Principal)
									</UI.Button>
								</div>
							</div>

							{/* Signup Toggle Link */}
							<div className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-t border-zinc-150/40 dark:border-zinc-800/40 pt-4">
								<span>
									Belum bergabung?{" "}
									<span
										onClick={() => {
											router.push("/register");
										}}
										className={`${getTextClass(selectedColor)} hover:underline font-bold cursor-pointer ml-1`}
									>
										Daftar Gratis
									</span>
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
