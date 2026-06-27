"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUIStyle } from "./UIStyleContext";
import { PALETTE_COLORS, PaletteColorKey } from "@/UI/shared/color-utils";

export function StyleSwitcherFAB() {
	const { selectedStyle, setSelectedStyle, selectedColor, setSelectedColor } = useUIStyle();
	const { resolvedTheme } = useTheme();
	const router = useRouter();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const constraintsRef = useRef(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const stylesList = [
		{ slug: "sakode-modern", name: "Modern Style" },
		{ slug: "claymorphism", name: "Claymorphism" },
		{ slug: "neobrutalism", name: "Neobrutalism" },
		{ slug: "glassmorphism", name: "Glassmorphism" },
		{ slug: "liquid-glass", name: "Liquid Glass" },
		{ slug: "bento-grid", name: "Bento Grid" },
		{ slug: "minimalism", name: "Minimalism" }
	];

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [isOpen]);

	const handleStyleSelect = (slug: string) => {
		setSelectedStyle(slug);
		if (pathname && pathname.startsWith("/ui/")) {
			// If on a showcase preview page, redirect to the new style showcase page
			const baseSegments = pathname.split("/");
			if (baseSegments.length >= 3 && stylesList.some(s => s.slug === baseSegments[2])) {
				router.push(`/ui/${slug}`);
			}
		}
	};

	return (
		<div className="fixed inset-0 pointer-events-none z-50" ref={constraintsRef}>
			<motion.div
				ref={containerRef}
				drag
				dragConstraints={constraintsRef}
				dragMomentum={false}
				className="absolute right-6 bottom-6 pointer-events-auto flex flex-col items-end gap-3"
				style={{ touchAction: "none" }}
			>
				{/* Switcher Options Popover Menu */}
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 15 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 15 }}
							transition={{ type: "spring", stiffness: 300, damping: 25 }}
							className="bg-white/95 dark:bg-zinc-955/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4.5 shadow-xl w-72 flex flex-col gap-4 select-none mb-1 text-left"
						>
							<div className="flex flex-col">
								<span className="text-[10px] font-black text-zinc-400 dark:text-zinc-550 uppercase tracking-widest leading-none mb-1">
									Sakode Academy
								</span>
								<span className="text-xs font-black text-zinc-800 dark:text-zinc-100">
									Aesthetics Configurator
								</span>
							</div>

							{/* UI Style Selector */}
							<div className="flex flex-col gap-2">
								<label className="text-[10px] font-extrabold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
									Gaya Visual UI
								</label>
								<div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
									{stylesList.map((st) => (
										<button
											key={st.slug}
											type="button"
											onClick={() => handleStyleSelect(st.slug)}
											className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border transition-all text-center cursor-pointer ${
												selectedStyle === st.slug
													? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
													: "bg-zinc-50/50 hover:bg-zinc-100/50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-350 border-zinc-200/40 dark:border-zinc-800/30"
											}`}
										>
											{st.name}
										</button>
									))}
								</div>
							</div>

							{/* Color Palette Selector */}
							<div className="flex flex-col gap-2">
								<label className="text-[10px] font-extrabold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
									Palet Warna Aksen
								</label>
								<div className="flex items-center gap-2 flex-wrap">
									{PALETTE_COLORS.map((col) => (
										<button
											key={col.key}
											type="button"
											onClick={() => setSelectedColor(col.key as PaletteColorKey)}
											className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-3xs`}
											style={{
												backgroundColor: col.hex,
												borderColor: selectedColor === col.key ? (resolvedTheme === "dark" ? "#ffffff" : "#09090b") : "transparent",
												borderWidth: selectedColor === col.key ? "2px" : "1px"
											}}
											title={col.name}
										>
											{selectedColor === col.key && (
												<span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-900" />
											)}
										</button>
									))}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* The Floating Action Button (FAB) */}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setIsOpen(!isOpen)}
					className="h-12 w-12 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer border border-zinc-850 dark:border-zinc-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2.5}
						stroke="currentColor"
						className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1-1.622-3.395m3.02 0a15.999 15.999 0 0 1-1.622 3.395m3.42 3.385a15.998 15.998 0 0 0 1.623-3.395m0 0 4.997-4.997a2.625 2.625 0 0 0-3.712-3.712l-4.996 4.996m4.243 4.243-4.243-4.243m4.243 4.243a1.5 1.5 0 0 1-2.122 0l-2.121-2.121a1.5 1.5 0 0 1 0-2.122l4.24-4.24"
						/>
					</svg>
				</motion.button>
			</motion.div>
		</div>
	);
}
