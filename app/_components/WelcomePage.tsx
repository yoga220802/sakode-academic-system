"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import * as UIStyles from "@/UI";
import { useUIStyle } from "./UIStyleContext";
import { Icons } from "@/UI/shared/Icons";
import { AestheticBackground } from "./AestheticBackground";
import { PublicPackageCatalog } from "./PublicPackageCatalog";

export function WelcomePage() {
	const { selectedStyle, selectedColor } = useUIStyle();
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
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

	// Resolve style namespace
	const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

	const getComingSoonContainerClass = () => {
		const baseClass = "inline-flex items-center gap-2 px-3.5 py-1.5 transition-all text-xs sm:text-sm font-bold tracking-wider text-sakode-blue mb-6";
		switch (selectedStyle) {
			case "claymorphism":
				return `${baseClass} rounded-full bg-slate-50/90 dark:bg-zinc-900/80 border border-slate-200/50 dark:border-zinc-700/50 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)]`;
			case "neobrutalism":
				return `${baseClass} bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none font-mono`;
			case "glassmorphism":
			case "liquid-glass":
				return `${baseClass} bg-white/10 dark:bg-zinc-900/20 border border-white/20 dark:border-white/10 backdrop-blur-xs rounded-full`;
			case "bento-grid":
				return `${baseClass} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-3xs rounded-full`;
			case "minimalism":
				return `${baseClass} bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/20 dark:border-zinc-800/20 rounded-md text-[10px] sm:text-xs font-bold tracking-widest`;
			case "sakode-modern":
			default:
				return `${baseClass} bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 rounded-full shadow-3xs`;
		}
	};

	return (
		<div className='relative min-h-screen w-full flex flex-col justify-between items-center bg-background text-foreground overflow-hidden font-sans transition-colors duration-300'>
			<AestheticBackground mode="landing" />

			{/* Grid Pattern overlay */}
			<div className='absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none z-0' />

			{/* Navbar Header */}
			<header className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-900/50 z-20 relative'>
				<div className='bg-[#030307] py-2.5 px-4 rounded-xl border border-zinc-800/80 shadow-md flex items-center justify-center'>
					<Image
						src='/assets/logo/sakode.svg'
						alt='Sakode Academy Logo'
						width={120}
						height={33}
						priority
						className='h-6 w-auto'
					/>
				</div>

				{/* Navigation & Theme Switcher */}
				{mounted && (
					<div className="flex items-center gap-3">
						<Link href="/ui">
							<UI.Button
								variant="secondary"
								accentColor={selectedColor}
								className="text-xs! py-2! px-3.5! rounded-xl! h-auto! font-extrabold! cursor-pointer"
							>
								Eksplorasi Gaya UI
							</UI.Button>
						</Link>
						<Link href="/login">
							<UI.Button
								variant="primary"
								accentColor={selectedColor}
								isGradient
								className="text-xs! py-2! px-3.5! rounded-xl! h-auto! font-extrabold! cursor-pointer"
							>
								Masuk Ke Akun
							</UI.Button>
						</Link>
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
				)}
			</header>

			{/* Main Container */}
			<main className='relative flex-1 w-full max-w-6xl flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 z-10'>
				{/* Main Logo Container */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className='mb-8 relative z-10'>
					<div className='relative p-5 bg-[#030307] border border-zinc-800/80 rounded-2xl shadow-xl flex items-center justify-center'>
						<Image
							src='/assets/logo/sakode.svg'
							alt='Sakode Academy Logo'
							width={280}
							height={78}
							priority
							className='w-auto h-12 sm:h-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]'
						/>
					</div>
				</motion.div>

				{/* Hero Title & Status */}
				<div className='text-center max-w-3xl mb-12 sm:mb-16 relative z-10'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.8 }}
						className={getComingSoonContainerClass()}
					>
						<span className='relative flex h-2 w-2'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sakode-blue opacity-75'></span>
							<span className='relative inline-flex rounded-full h-2 w-2 bg-sakode-blue'></span>
						</span>
						PROGRAM REGISTRASI AKTIF
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.8 }}
						className='text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight'>
						Sistem Akademik
						<br />
						<span className='text-sakode-yellow'>Sakode Academy</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.8 }}
						className='text-zinc-650 dark:text-zinc-400 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto'>
						Portal pembelajaran kursus IT terintegrasi yang dirancang untuk
						memfasilitasi pendaftaran peserta, kelas trial, modul belajar, serta
						manajemen dan penjadwalan mentor secara cerdas.
					</motion.p>
				</div>

				{/* Public Package Catalog (Includes Comparison & Scenario Selectors) */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.8 }}
					className='w-full relative z-10'
				>
					<PublicPackageCatalog />
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
