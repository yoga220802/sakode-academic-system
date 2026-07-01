"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as UIStyles from "@/UI";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass } from "@/UI/shared/color-utils";
import { AestheticBackground } from "@/app/_components/AestheticBackground";

export default function RegisterPage() {
	const router = useRouter();
	const { selectedStyle, selectedColor } = useUIStyle();
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	
	// Form state
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agreeTerms, setAgreeTerms] = useState(false);
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
		if (!name || !email || !password) {
			setAlertMsg({
				type: "warning",
				title: "Validasi Gagal",
				desc: "Semua field input wajib diisi.",
			});
			return;
		}

		if (!agreeTerms) {
			setAlertMsg({
				type: "warning",
				title: "Persetujuan Wajib",
				desc: "Anda harus menyetujui syarat & ketentuan Sakode.",
			});
			return;
		}

		setIsLoading(true);
		setAlertMsg(null);

		setTimeout(() => {
			setIsLoading(false);
			setAlertMsg({
				type: "info",
				title: "Registrasi Berhasil!",
				desc: "Akun Anda berhasil didaftarkan. Mengalihkan ke login...",
			});
			// Mock redirect to login
			setTimeout(() => {
				router.push("/login");
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
									Daftar Akun Baru
								</UI.Heading>
								<p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">
									Buat akun gratis untuk memulai perjalanan coding Anda
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
									<UI.Label htmlFor="name-input">Nama Lengkap</UI.Label>
									<UI.Input
										id="name-input"
										type="text"
										placeholder="John Doe"
										value={name}
										onChange={(e) => setName(e.target.value)}
										disabled={isLoading}
									/>
								</div>

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
									<UI.Label htmlFor="password-input">Kata Sandi Baru</UI.Label>
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

								{/* Terms check */}
								<div className="flex items-center gap-2 mt-1">
									<UI.Toggle checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} accentColor={selectedColor} />
									<span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
										Saya menyetujui syarat dan ketentuan yang berlaku.
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
										Mulai Belajar Sekarang
									</UI.Button>
								</div>
							</form>

							{/* Login Toggle Link */}
							<div className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-t border-zinc-150/40 dark:border-zinc-800/40 pt-4">
								<span>
									Sudah punya akun?{" "}
									<span
										onClick={() => {
											router.push("/login");
										}}
										className={`${getTextClass(selectedColor)} hover:underline font-bold cursor-pointer ml-1`}
									>
										Masuk
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
