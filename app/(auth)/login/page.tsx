"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as UIStyles from "@/UI";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { useAuth } from "@/app/_components/AuthContext";

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
				let resolvedRole: "admin" | "mentor_lead" | "mentor" | "murid" = "murid";
				const cleanedEmail = email.toLowerCase().trim();
				if (cleanedEmail === "admin@sakode.com") {
					resolvedRole = "admin";
				} else if (cleanedEmail === "hamzah@sakode.com") {
					resolvedRole = "mentor_lead";
				} else if (cleanedEmail === "udin@sakode.com") {
					resolvedRole = "mentor";
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
			{/* Background Gradients */}
			{isGlassBg ? (
				<>
					<div className="absolute top-[-10%] left-[20%] w-96 h-96 rounded-full bg-sakode-pink/20 dark:bg-sakode-pink/25 blur-3xl pointer-events-none z-0" />
					<div className="absolute bottom-[-10%] right-[10%] w-96 h-96 rounded-full bg-sakode-orange/20 dark:bg-sakode-orange/20 blur-3xl pointer-events-none z-0" />
					<div className="absolute top-[40%] left-[-10%] w-80 h-80 rounded-full bg-sakode-cyan/20 dark:bg-sakode-cyan/20 blur-3xl pointer-events-none z-0" />
					<div className="absolute bottom-[25%] left-[30%] w-80 h-80 rounded-full bg-sakode-yellow/15 dark:bg-sakode-yellow/15 blur-3xl pointer-events-none z-0" />
				</>
			) : (
				<>
					<div className='absolute top-[-10%] left-[50%] translate-x-[-50%] h-150 w-[90%] sm:w-200 rounded-full bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.06)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.12)_0%,transparent_65%)] blur-[60px] pointer-events-none z-0' />
					<div className='absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,64,159,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,64,159,0.08)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0' />
					<div className='absolute top-[40%] left-[-10%] h-100 w-100 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.06)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0' />
				</>
			)}

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
						{
							resolvedTheme === "dark" ?
								<svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
									<path strokeLinecap='round' strokeLinejoin='round' d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z' />
								</svg>
							:	<svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
									<path strokeLinecap='round' strokeLinejoin='round' d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
								</svg>
						}
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
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
													<path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
												</svg>
											) : (
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
													<path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
													<circle cx="12" cy="12" r="3" />
												</svg>
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
										className="text-sakode-pink hover:underline font-bold cursor-pointer ml-1"
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
