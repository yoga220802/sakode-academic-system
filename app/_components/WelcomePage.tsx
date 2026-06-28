"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Tooltip } from "@heroui/react";
import * as UIStyles from "@/UI";
import { useUIStyle } from "./UIStyleContext";
import { Icons } from "@/UI/shared/Icons";
import { AestheticBackground } from "./AestheticBackground";
import {
  getBgClass,
  getGradientClass,
  getTextClass,
  getBgOpacity15Class,
  getBorderClass,
  PaletteColorKey,
} from "@/UI/shared/color-utils";

export function WelcomePage() {
	const { selectedStyle, setSelectedStyle, selectedColor } = useUIStyle();
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

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

	// Set target date to July 10, 2026 for countdown
	useEffect(() => {
		const targetDate = new Date("2026-07-10T00:00:00");

		const timer = setInterval(() => {
			const now = new Date().getTime();
			const difference = targetDate.getTime() - now;

			if (difference <= 0) {
				clearInterval(timer);
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			} else {
				const days = Math.floor(difference / (1000 * 60 * 60 * 24));
				const hours = Math.floor(
					(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
				);
				const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((difference % (1000 * 60)) / 1000);
				setTimeLeft({ days, hours, minutes, seconds });
			}
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Resolve style namespace
	const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

	// Helper to extract clean color key from textClass
	const getAccentKey = (textClass: string): PaletteColorKey => {
		if (textClass.includes("blue")) return "blue";
		if (textClass.includes("green")) return "green";
		if (textClass.includes("pink")) return "pink";
		if (textClass.includes("yellow")) return "yellow";
		if (textClass.includes("orange")) return "orange";
		return "pink";
	};

	const comingFeatures = [
		{
			number: "01",
			title: "Pendaftaran Murid Baru",
			desc:
				"Registrasi murid baru dengan alur sistematis untuk kelas pemrograman intensif.",
			borderClass: "hover:border-sakode-blue/60 dark:hover:border-sakode-blue",
			textClass: "text-sakode-blue",
			bgClass: "bg-sakode-blue/5 dark:bg-sakode-blue/10",
		},
		{
			number: "02",
			title: "Pendaftaran Trial",
			desc:
				"Sesi uji coba belajar pemrograman untuk menguji materi dan metode pembelajaran.",
			borderClass: "hover:border-sakode-green/60 dark:hover:border-sakode-green",
			textClass: "text-sakode-green",
			bgClass: "bg-sakode-green/5 dark:bg-sakode-green/10",
		},
		{
			number: "03",
			title: "Modul Pembelajaran IT",
			desc:
				"Materi dan kurikulum terstruktur dari tingkat dasar hingga standar industri.",
			borderClass: "hover:border-sakode-pink/60 dark:hover:border-sakode-pink",
			textClass: "text-sakode-pink",
			bgClass: "bg-sakode-pink/5 dark:bg-sakode-pink/10",
		},
		{
			number: "04",
			title: "Plotting & Profil Mentor",
			desc:
				"Informasi portofolio mentor profesional industri IT dengan alokasi plotting yang tepat.",
			borderClass: "hover:border-sakode-yellow/60 dark:hover:border-sakode-yellow",
			textClass: "text-sakode-yellow",
			bgClass: "bg-sakode-yellow/5 dark:bg-sakode-yellow/10",
		},
		{
			number: "05",
			title: "Penjadwalan Mentoring Sesi",
			desc:
				"Sistem penjadwalan kelas mentoring 1-on-1 langsung bersama praktisi industri.",
			borderClass: "hover:border-sakode-orange/60 dark:hover:border-sakode-orange",
			textClass: "text-sakode-orange",
			bgClass: "bg-sakode-orange/5 dark:bg-sakode-orange/10",
		},
	];

	const isGlassBg = selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass";

	// Custom class for countdown cell wrapper based on style
	const getCountdownCellClass = () => {
		switch (selectedStyle) {
			case "claymorphism":
				return "bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/20 dark:border-zinc-800/20 shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.06),_inset_3px_3px_6px_rgba(255,255,255,0.6),_2px_4px_8px_rgba(0,0,0,0.05)] rounded-2xl p-4";
			case "neobrutalism":
				return "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none p-4 font-mono";
			case "glassmorphism":
			case "liquid-glass":
				return "bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-xs rounded-2xl p-4";
			case "bento-grid":
				return "bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-3xs p-4";
			case "minimalism":
				return "bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-250/30 rounded-none p-4";
			case "sakode-modern":
			default:
				return "bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-850/50 rounded-2xl p-4 shadow-3xs";
		}
	};

	const getCountdownTextClass = () => {
		switch (selectedStyle) {
			case "neobrutalism":
				return "text-2xl sm:text-3xl font-black font-mono tracking-tight text-zinc-900 dark:text-white uppercase";
			case "minimalism":
				return "text-2xl sm:text-3xl font-light tracking-tight text-zinc-855 dark:text-zinc-200";
			default:
				return "text-2xl sm:text-3xl font-black tracking-tight text-zinc-800 dark:text-zinc-100";
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
						className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-bold tracking-wider text-sakode-blue mb-6 shadow-xs'>
						<span className='relative flex h-2 w-2'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sakode-blue opacity-75'></span>
							<span className='relative inline-flex rounded-full h-2 w-2 bg-sakode-blue'></span>
						</span>
						COMING SOON
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

				{/* Interactive Style-resolved Card with Countdown */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.6, duration: 0.8 }}
					className='w-full max-w-2xl mb-16 relative z-10'>
					<UI.Card accentColor={selectedColor}>
						<div className='gap-6 p-4 sm:p-8 flex flex-col'>
							{/* Development Progress Indicator */}
							<div className='flex flex-col gap-2'>
								<div className='flex justify-between items-center text-sm font-bold text-zinc-555 dark:text-zinc-405'>
									<span>Tahap Pengembangan Sistem</span>
									<span className={`font-black ${getTextClass(selectedColor)}`}>2%</span>
								</div>
								
								<div
									className={
										selectedStyle === "claymorphism"
											? "w-full bg-slate-100/80 dark:bg-zinc-900/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] border border-slate-200/20 dark:border-zinc-800/20 h-3 rounded-full overflow-hidden"
											: selectedStyle === "neobrutalism"
											? "w-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] h-3 rounded-none overflow-hidden"
											: selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass"
											? "w-full bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-inner h-3 rounded-full overflow-hidden"
											: selectedStyle === "bento-grid"
											? "w-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800 h-3 rounded-lg overflow-hidden"
											: selectedStyle === "minimalism"
											? "w-full bg-zinc-200/60 dark:bg-zinc-800/60 h-1 rounded-none overflow-hidden"
											: selectedStyle === "sakode-modern"
											? "w-full bg-zinc-150 dark:bg-zinc-850 h-2 rounded-full overflow-hidden"
											: "w-full bg-zinc-200 dark:bg-zinc-800/80 overflow-hidden h-2 rounded-full"
									}
								>
									<div
										className={
											selectedStyle === "claymorphism"
												? `h-full w-[2%] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.15),inset_2px_2px_4px_rgba(255,255,255,0.4)] rounded-full ${getBgClass(selectedColor)}`
												: selectedStyle === "neobrutalism"
												? `h-full w-[2%] ${getBgClass(selectedColor)} border-r-2 border-zinc-900 dark:border-white`
												: selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass"
												? "h-full w-[2%] rounded-full bg-linear-to-r from-sakode-pink to-sakode-orange border-r border-white/30"
												: selectedStyle === "bento-grid"
												? `h-full w-[2%] rounded-r-md ${getBgClass(selectedColor)}`
												: selectedStyle === "minimalism"
												? "h-full w-[2%] bg-zinc-900 dark:bg-white"
												: `h-full w-[2%] rounded-full ${getBgClass(selectedColor)}`
										}
									/>
								</div>
							</div>

							{/* Countdown Timer */}
							<div className='grid grid-cols-4 gap-3 sm:gap-4 py-4 text-center'>
								{[
									{ label: "Hari", value: timeLeft.days },
									{ label: "Jam", value: timeLeft.hours },
									{ label: "Menit", value: timeLeft.minutes },
									{ label: "Detik", value: timeLeft.seconds },
								].map((item, idx) => (
									<div
										key={idx}
										className={getCountdownCellClass()}>
										<span className={getCountdownTextClass()}>
											{String(item.value).padStart(2, "0")}
										</span>
										<span className='block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 mt-1'>
											{item.label}
										</span>
									</div>
								))}
							</div>
						</div>
					</UI.Card>
				</motion.div>

				{/* Features Preview Section */}
				<div className='w-full relative z-10'>
					<motion.h3
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.7, duration: 0.8 }}
						className='text-center text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8'>
						Fasilitas Utama Portal Pembelajaran
					</motion.h3>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.8 }}
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{comingFeatures.map((feat, index) => {
							const accent = getAccentKey(feat.textClass);
							return (
								<Tooltip key={index}>
									<Tooltip.Trigger className="w-full">
										<div className="w-full text-left h-full">
											<UI.Card accentColor={accent}>
												<div className="flex flex-col p-1.5 h-full min-h-42.5 justify-between">
													<div className='flex items-center justify-between mb-4'>
														<span className={`text-3xl font-extrabold tracking-tight font-mono select-none ${feat.textClass}`}>
															{feat.number}
														</span>
														<span className={`w-8 h-8 rounded-lg flex items-center justify-center ${feat.bgClass}`}>
															<span className={`w-2 h-2 rounded-full ${feat.textClass.replace("text-", "bg-")}`}></span>
														</span>
													</div>

													<div>
														<h4 className='font-bold text-base text-zinc-800 dark:text-zinc-100 mb-2'>
															{feat.title}
														</h4>

														<p className='text-xs text-zinc-555 dark:text-zinc-400 font-semibold leading-relaxed'>
															{feat.desc}
														</p>
													</div>
												</div>
											</UI.Card>
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content className='bg-zinc-900 text-zinc-355 border border-zinc-850 text-xs rounded-lg px-3 py-1.5 shadow-xl z-50'>
										Fitur ini sedang dikembangkan
									</Tooltip.Content>
								</Tooltip>
							);
						})}
					</motion.div>
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
