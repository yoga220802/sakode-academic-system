"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Tooltip, Card, ProgressBar } from "@heroui/react";

export function WelcomePage() {
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


	// Features list utilizing Palette.svg colors and numbered indexing
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

	return (
		<div className='relative min-h-screen w-full flex flex-col justify-between items-center bg-background text-foreground overflow-hidden font-sans transition-colors duration-300'>
			{/* Background Gradients */}
			<div className='absolute top-[-10%] left-[50%] translate-x-[-50%] h-150 w-[90%] sm:w-200 rounded-full bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.06)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.12)_0%,transparent_65%)] blur-[60px] pointer-events-none z-0' />
			<div className='absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,64,159,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,64,159,0.08)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0' />
			<div className='absolute top-[40%] left-[-10%] h-100 w-100 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.06)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0' />

			{/* Grid Pattern overlay */}
			<div className='absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none z-0' />

			{/* Navbar Header */}
			<header className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-900/50 z-20'>
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
						<Link
							href="/ui-examples"
							className="text-xs sm:text-sm font-extrabold px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
						>
							Eksplorasi Gaya UI
						</Link>
						<button
							onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
							className='p-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer'
							aria-label='Toggle Light/Dark Theme'>
							{
								resolvedTheme === "dark" ?
									// Sun Icon
									<svg
										className='w-4 h-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										strokeWidth={2.5}>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z'
										/>
									</svg>
									// Moon Icon
								:	<svg
										className='w-4 h-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										strokeWidth={2.5}>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
										/>
									</svg>
	
							}
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
					className='mb-8'>
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
				<div className='text-center max-w-3xl mb-12 sm:mb-16'>
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
						className='text-zinc-600 dark:text-zinc-400 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto'>
						Portal pembelajaran kursus IT terintegrasi yang dirancang untuk
						memfasilitasi pendaftaran peserta, kelas trial, modul belajar, serta
						manajemen dan penjadwalan mentor secara cerdas.
					</motion.p>
				</div>

				{/* Interactive Glass Card with Countdown & Newsletter */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.6, duration: 0.8 }}
					className='w-full max-w-2xl mb-16'>
					<Card className='bg-white/80 dark:bg-zinc-950/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/80 shadow-lg dark:shadow-2xl p-2 rounded-3xl overflow-hidden'>
						<Card.Content className='gap-6 p-6 sm:p-10 flex flex-col'>
							{/* Development Progress Indicator */}
							<div className='flex flex-col gap-2'>
								<div className='flex justify-between items-center text-sm font-bold text-zinc-500 dark:text-zinc-400'>
									<span>Tahap Pengembangan Sistem</span>
									<span className='text-sakode-yellow font-extrabold'>2%</span>
								</div>
								<ProgressBar
									value={2}
									aria-label='Development progress'
									className='w-full'>
									<ProgressBar.Track className='bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden'>
										<ProgressBar.Fill className='bg-linear-to-r from-sakode-pink to-sakode-orange h-full' />
									</ProgressBar.Track>
								</ProgressBar>
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
										className='bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-3 sm:p-4 shadow-xs'>
										<span className='block text-2xl sm:text-3xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100'>
											{String(item.value).padStart(2, "0")}
										</span>
										<span className='text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500'>
											{item.label}
										</span>
									</div>
								))}
							</div>
						</Card.Content>
					</Card>
				</motion.div>

				{/* Features Preview Section */}
				<div className='w-full'>
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
						{comingFeatures.map((feat, index) => (
							<Tooltip key={index}>
								<Tooltip.Trigger>
									<div
										className={`group flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-help w-full h-full text-left
                    bg-white/60 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-900/60 shadow-xs hover:shadow-md ${feat.borderClass}`}>
										<div className='flex items-center justify-between mb-4'>
											<span
												className={`text-3xl font-extrabold tracking-tight font-mono select-none ${feat.textClass}`}>
												{feat.number}
											</span>
											<span
												className={`w-8 h-8 rounded-lg flex items-center justify-center ${feat.bgClass}`}>
												<span
													className={`w-2 h-2 rounded-full ${feat.textClass.replace("text-", "bg-")}`}></span>
											</span>
										</div>

										<h4 className='font-bold text-lg text-zinc-800 dark:text-zinc-100 mb-2 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors'>
											{feat.title}
										</h4>

										<p className='text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed'>
											{feat.desc}
										</p>
									</div>
								</Tooltip.Trigger>
								<Tooltip.Content className='bg-zinc-900 text-zinc-350 border border-zinc-850 text-xs rounded-lg px-3 py-1.5 shadow-xl'>
									Fitur ini sedang dikembangkan
								</Tooltip.Content>
							</Tooltip>
						))}
					</motion.div>
				</div>
			</main>

			{/* Footer */}
			<footer className='relative w-full max-w-6xl mx-auto py-8 px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/50 dark:border-zinc-900/60 z-10 font-medium'>
				<p className='text-center sm:text-left'>
					© {new Date().getFullYear()} Sakode Academy. All rights reserved.
				</p>
				<div className='flex gap-6'>
					<a
						href='https://sakode.org'
						target='_blank'
						rel='noopener noreferrer'
						className='hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'>
						Website Utama
					</a>
					<a
						href='mailto:info@sakode.org'
						className='hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'>
						Hubungi Kami
					</a>
				</div>
			</footer>
		</div>
	);
}
