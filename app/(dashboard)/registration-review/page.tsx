"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import {
	getBgClass,
	getTextClass,
	getBgOpacity10Class,
} from "@/UI/shared/color-utils";

interface RegistrationItem {
	id: string;
	name: string;
	email: string;
	phone: string;
	program: string;
	date: string;
	refCode: string;
	promoCode: string;
	promoDiscount: number;
	originalPrice: number;
	finalPrice: number;
	status: "pending" | "approved" | "rejected";
	timeline: { title: string; time: string; desc: string }[];
	modules: string[];
}

export default function RegistrationReviewPage() {
	const { selectedStyle, selectedColor } = useUIStyle();
	const UI =
		UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] ||
		UIStyles.UI["sakode-modern"];

	// 1. Simulation States
	const [simulationState, setSimulationState] = useState<
		"default" | "loading" | "empty" | "error"
	>("default");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [selectedProgram, setSelectedProgram] = useState<string>("all");

	// 2. Active selection (stored as ID to prevent cascading render effects) and dialog states
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [confirmAction, setConfirmAction] = useState<{
		type: "approve" | "reject";
		item: RegistrationItem;
	} | null>(null);
	const [toastMessage, setToastMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	// 3. Mock database
	const [items, setItems] = useState<RegistrationItem[]>([
		{
			id: "REG-001",
			name: "Dzulkifli Putra",
			email: "dzulkifli.putra@gmail.com",
			phone: "+62 812-3456-7890",
			program: "React & Next.js Professional",
			date: "13 Mar 2026 16:30 WIB",
			refCode: "Akbar",
			promoCode: "SAKODEPERDANA",
			promoDiscount: 300000,
			originalPrice: 3500000,
			finalPrice: 3200000,
			status: "pending",
			timeline: [
				{
					title: "Akun Dibuat",
					time: "13 Mar 2026 16:10 WIB",
					desc: "Dzulkifli berhasil mendaftar akun baru.",
				},
				{
					title: "Atribusi Referral Terdeteksi",
					time: "13 Mar 2026 16:11 WIB",
					desc: "Referral dari Akbar berhasil di-prefill secara transparan.",
				},
				{
					title: "Paket Dipilih & Disubmit",
					time: "13 Mar 2026 16:30 WIB",
					desc: "Pendaftaran Bootcamp React & Next.js dikirim oleh pendaftar.",
				},
				{
					title: "Menunggu Review Dokumen",
					time: "13 Mar 2026 16:32 WIB",
					desc: "Berkas masuk antrean verifikasi Admin SAKODE.",
				},
			],
			modules: [
				"React Fundamentals & Hooks (State, Ref, Effect)",
				"Next.js Core Concepts (App Router, Layouts, Metadata)",
				"React Server Components & Server Actions",
				"Integrasi API & state management dengan Zustand",
				"Deploying Next.js to Vercel with Database connection",
			],
		},
		{
			id: "REG-002",
			name: "Endah Lestari",
			email: "endah.lestari@yahoo.com",
			phone: "+62 821-9876-5432",
			program: "TypeScript & Data Structures",
			date: "13 Mar 2026 14:15 WIB",
			refCode: "Mandiri",
			promoCode: "",
			promoDiscount: 0,
			originalPrice: 2800000,
			finalPrice: 2800000,
			status: "pending",
			timeline: [
				{
					title: "Akun Dibuat",
					time: "13 Mar 2026 13:40 WIB",
					desc: "Endah berhasil mendaftar akun baru.",
				},
				{
					title: "Atribusi Referral Terdeteksi",
					time: "13 Mar 2026 13:42 WIB",
					desc: "Referral dari Mandiri berhasil di-prefill secara transparan.",
				},
				{
					title: "Paket Dipilih & Disubmit",
					time: "13 Mar 2026 14:15 WIB",
					desc: "Pendaftaran Bootcamp TypeScript dikirim oleh pendaftar.",
				},
			],
			modules: [
				"TypeScript Types, Interfaces & Generics",
				"Data Structures fundamentals (Stack, Queue, LinkedList)",
				"Algorithms & Complexities (Big O Notation)",
				"Sorting and Searching Algorithms in Node.js",
			],
		},
		{
			id: "REG-003",
			name: "Rian Hidayat",
			email: "rian.hidayat@outlook.com",
			phone: "+62 878-1122-3344",
			program: "Backend Dev Go/Docker",
			date: "12 Mar 2026 18:22 WIB",
			refCode: "",
			promoCode: "BACKENDBOOTCAMP",
			promoDiscount: 500000,
			originalPrice: 4000000,
			finalPrice: 3500000,
			status: "pending",
			timeline: [
				{
					title: "Akun Dibuat",
					time: "12 Mar 2026 18:00 WIB",
					desc: "Rian berhasil mendaftar akun baru.",
				},
				{
					title: "Paket Dipilih & Disubmit",
					time: "12 Mar 2026 18:22 WIB",
					desc: "Pendaftaran Bootcamp Backend Go & Docker dikirim oleh pendaftar.",
				},
			],
			modules: [
				"Go (Golang) basics & concurrency patterns",
				"REST API development with Gin/Fiber frameworks",
				"Database connections (PostgreSQL/MySQL & GORM)",
				"Docker containerization & Orchestration basics",
			],
		},
		{
			id: "REG-004",
			name: "Siti Aminah",
			email: "siti.aminah@gmail.com",
			phone: "+62 855-4433-2211",
			program: "React & Next.js Professional",
			date: "11 Mar 2026 10:05 WIB",
			refCode: "Akbar",
			promoCode: "",
			promoDiscount: 0,
			originalPrice: 3500000,
			finalPrice: 3500000,
			status: "approved",
			timeline: [
				{
					title: "Akun Dibuat",
					time: "11 Mar 2026 09:30 WIB",
					desc: "Siti mendaftar akun baru.",
				},
				{
					title: "Review Disetujui",
					time: "11 Mar 2026 10:05 WIB",
					desc: "Pendaftaran disetujui oleh Admin dan dipindahkan ke plotting.",
				},
			],
			modules: [
				"React Fundamentals & Hooks (State, Ref, Effect)",
				"Next.js Core Concepts (App Router, Layouts, Metadata)",
			],
		},
		{
			id: "REG-005",
			name: "Joko Susilo",
			email: "joko.susilo@hotmail.com",
			phone: "+62 899-7788-9900",
			program: "Backend Dev Go/Docker",
			date: "10 Mar 2026 09:12 WIB",
			refCode: "",
			promoCode: "",
			promoDiscount: 0,
			originalPrice: 4000000,
			finalPrice: 4000000,
			status: "rejected",
			timeline: [
				{
					title: "Akun Dibuat",
					time: "10 Mar 2026 08:30 WIB",
					desc: "Joko mendaftar akun baru.",
				},
				{
					title: "Review Ditolak",
					time: "10 Mar 2026 09:12 WIB",
					desc: "Pendaftaran ditolak oleh Admin.",
				},
			],
			modules: [
				"Go (Golang) basics & concurrency patterns",
				"REST API development with Gin/Fiber frameworks",
			],
		},
	]);

	// Handle toast timers
	useEffect(() => {
		if (toastMessage) {
			const timer = setTimeout(() => setToastMessage(null), 4000);
			return () => clearTimeout(timer);
		}
	}, [toastMessage]);

	// Read initial student selection from URL search parameter (for redirect from dashboard widget)
	useEffect(() => {
		if (typeof window !== "undefined") {
			const params = new URLSearchParams(window.location.search);
			const idParam = params.get("id");
			if (idParam) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setSelectedItemId(idParam);
			}
		}
	}, []);

	// Derived selected item
	const selectedItem = useMemo(() => {
		if (!selectedItemId) return null;
		return items.find((i) => i.id === selectedItemId) || null;
	}, [items, selectedItemId]);

	// 4. Filters & Search Evaluation
	const filteredItems = useMemo(() => {
		if (simulationState === "empty") return [];
		return items.filter((item) => {
			const matchesSearch =
				item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.email.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus =
				selectedStatus === "all" || item.status === selectedStatus;
			const matchesProgram =
				selectedProgram === "all" || item.program === selectedProgram;
			return matchesSearch && matchesStatus && matchesProgram;
		});
	}, [items, searchQuery, selectedStatus, selectedProgram, simulationState]);

	// 5. Metrics calculation
	const metrics = useMemo(() => {
		if (simulationState === "empty") {
			return { total: 0, pending: 0, approved: 0, rejected: 0 };
		}
		return {
			total: items.length,
			pending: items.filter((i) => i.status === "pending").length,
			approved: items.filter((i) => i.status === "approved").length,
			rejected: items.filter((i) => i.status === "rejected").length,
		};
	}, [items, simulationState]);

	// Helper for styling inner elements consistently with active visual style
	const getSubElementClass = (
		type: "divider" | "inner-card" | "timeline-dot" | "timeline-line",
	) => {
		switch (selectedStyle) {
			case "neobrutalism":
				if (type === "divider")
					return "h-[2px] bg-zinc-900 dark:bg-white w-full my-1";
				if (type === "inner-card")
					return "p-3.5 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
				if (type === "timeline-dot")
					return "absolute -left-[20.5px] top-1 w-3 h-3 bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white rounded-none";
				if (type === "timeline-line")
					return "flex flex-col gap-4.5 relative pl-4.5 border-l-2 border-zinc-900 dark:border-white ml-1.5 mt-1";
				return "";

			case "claymorphism":
				if (type === "divider")
					return "h-px bg-slate-200/60 dark:bg-zinc-800/60 w-full my-1";
				if (type === "inner-card")
					return "p-3.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/20 dark:border-zinc-700/20 rounded-2xl shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.05)]";
				if (type === "timeline-dot")
					return "absolute -left-[20px] top-1 w-2.5 h-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.6)]";
				if (type === "timeline-line")
					return "flex flex-col gap-4.5 relative pl-4.5 border-l border-slate-200/50 dark:border-zinc-800/50 ml-1.5 mt-1";
				return "";

			case "glassmorphism":
			case "liquid-glass":
				if (type === "divider")
					return "h-px bg-white/10 dark:bg-white/5 w-full my-1";
				if (type === "inner-card")
					return "p-3.5 bg-white/10 dark:bg-zinc-900/40 border border-white/20 dark:border-white/10 backdrop-blur-xs rounded-xl";
				if (type === "timeline-dot")
					return "absolute -left-[20px] top-1 w-2.5 h-2.5 bg-white/45 dark:bg-zinc-900 border border-white/35 dark:border-white/15 rounded-full backdrop-blur-xs";
				if (type === "timeline-line")
					return "flex flex-col gap-4.5 relative pl-4.5 border-l border-white/15 dark:border-white/10 ml-1.5 mt-1";
				return "";

			case "minimalism":
				if (type === "divider")
					return "h-px bg-zinc-200/40 dark:bg-zinc-800/40 w-full my-1";
				if (type === "inner-card")
					return "p-3 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/40 dark:border-zinc-800/40 rounded-lg";
				if (type === "timeline-dot")
					return "absolute -left-[19.5px] top-1.5 w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-750 rounded-full";
				if (type === "timeline-line")
					return "flex flex-col gap-4.5 relative pl-4 border-l border-zinc-200/50 dark:border-zinc-800/50 ml-1 mt-1";
				return "";

			case "bento-grid":
			case "sakode-modern":
			default:
				if (type === "divider")
					return "h-px bg-zinc-200/60 dark:bg-zinc-800/80 w-full my-1";
				if (type === "inner-card")
					return "p-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800 rounded-xl";
				if (type === "timeline-dot")
					return "absolute -left-[20.5px] top-1 w-2.5 h-2.5 bg-white dark:bg-zinc-950 border-2 border-white dark:border-zinc-950 rounded-full shadow-xs";
				if (type === "timeline-line")
					return "flex flex-col gap-4.5 relative pl-4.5 border-l border-zinc-200 dark:border-zinc-800 ml-1.5 mt-1";
				return "";
		}
	};

	const getCloseButtonClass = () => {
		const base = "p-1.5 transition-all cursor-pointer ";
		switch (selectedStyle) {
			case "neobrutalism":
				return (
					base +
					"border-2 border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 hover:bg-zinc-100 rounded-none shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:shadow-[1px_1px_0px_rgba(255,255,255,1)] text-zinc-900 dark:text-white"
				);
			case "claymorphism":
				return (
					base +
					"bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200/50 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)] text-zinc-500 dark:text-zinc-300"
				);
			case "glassmorphism":
			case "liquid-glass":
				return (
					base +
					"bg-white/10 dark:bg-zinc-900/30 border border-white/20 dark:border-white/10 rounded-full backdrop-blur-xs hover:bg-white/20 text-zinc-400 dark:text-zinc-200"
				);
			case "minimalism":
				return (
					base +
					"hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm text-zinc-400 dark:text-zinc-350"
				);
			case "bento-grid":
			case "sakode-modern":
			default:
				return (
					base +
					"bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-500 dark:text-zinc-300"
				);
		}
	};

	// 6. Action Execution Handlers
	const handleReviewActionConfirm = () => {
		if (!confirmAction) return;

		const { type, item } = confirmAction;

		setItems((prev) =>
			prev.map((i) => {
				if (i.id === item.id) {
					const newStatus = type === "approve" ? "approved" : "rejected";
					const newTimeline = [
						...i.timeline,
						{
							title:
								type === "approve" ? "Pendaftaran Disetujui" : "Pendaftaran Ditolak",
							time:
								new Date().toLocaleDateString("id-ID", {
									day: "numeric",
									month: "short",
									year: "numeric",
								}) +
								" " +
								new Date().toLocaleTimeString("id-ID", {
									hour: "2-digit",
									minute: "2-digit",
								}) +
								" WIB",
							desc:
								type === "approve" ?
									"Pendaftaran disetujui & dialokasikan ke antrean plotting kelas."
								:	"Pendaftaran ditolak oleh Admin.",
						},
					];
					return { ...i, status: newStatus, timeline: newTimeline };
				}
				return i;
			}),
		);

		setConfirmAction(null);
		setToastMessage({
			type: type === "approve" ? "success" : "error",
			text:
				type === "approve" ?
					`${item.name} pendaftaran disetujui! Pendaftaran dipindahkan ke antrean plotting kelas.`
				:	`${item.name} pendaftaran ditolak.`,
		});
	};

	const resetAllScenarios = () => {
		setItems([
			{
				id: "REG-001",
				name: "Dzulkifli Putra",
				email: "dzulkifli.putra@gmail.com",
				phone: "+62 812-3456-7890",
				program: "React & Next.js Professional",
				date: "13 Mar 2026 16:30 WIB",
				refCode: "Akbar",
				promoCode: "SAKODEPERDANA",
				promoDiscount: 300000,
				originalPrice: 3500000,
				finalPrice: 3200000,
				status: "pending",
				timeline: [
					{
						title: "Akun Dibuat",
						time: "13 Mar 2026 16:10 WIB",
						desc: "Dzulkifli berhasil mendaftar akun baru.",
					},
					{
						title: "Atribusi Referral Terdeteksi",
						time: "13 Mar 2026 16:11 WIB",
						desc: "Referral dari Akbar berhasil di-prefill secara transparan.",
					},
					{
						title: "Paket Dipilih & Disubmit",
						time: "13 Mar 2026 16:30 WIB",
						desc: "Pendaftaran Bootcamp React & Next.js dikirim oleh pendaftar.",
					},
					{
						title: "Menunggu Review Dokumen",
						time: "13 Mar 2026 16:32 WIB",
						desc: "Berkas masuk antrean verifikasi Admin SAKODE.",
					},
				],
				modules: [
					"React Fundamentals & Hooks (State, Ref, Effect)",
					"Next.js Core Concepts (App Router, Layouts, Metadata)",
					"React Server Components & Server Actions",
					"Integrasi API & state management dengan Zustand",
					"Deploying Next.js to Vercel with Database connection",
				],
			},
			{
				id: "REG-002",
				name: "Endah Lestari",
				email: "endah.lestari@yahoo.com",
				phone: "+62 821-9876-5432",
				program: "TypeScript & Data Structures",
				date: "13 Mar 2026 14:15 WIB",
				refCode: "Mandiri",
				promoCode: "",
				promoDiscount: 0,
				originalPrice: 2800000,
				finalPrice: 2800000,
				status: "pending",
				timeline: [
					{
						title: "Akun Dibuat",
						time: "13 Mar 2026 13:40 WIB",
						desc: "Endah berhasil mendaftar akun baru.",
					},
					{
						title: "Atribusi Referral Terdeteksi",
						time: "13 Mar 2026 13:42 WIB",
						desc: "Referral dari Mandiri berhasil di-prefill secara transparan.",
					},
					{
						title: "Paket Dipilih & Disubmit",
						time: "13 Mar 2026 14:15 WIB",
						desc: "Pendaftaran Bootcamp TypeScript dikirim oleh pendaftar.",
					},
				],
				modules: [
					"TypeScript Types, Interfaces & Generics",
					"Data Structures fundamentals (Stack, Queue, LinkedList)",
					"Algorithms & Complexities (Big O Notation)",
					"Sorting and Searching Algorithms in Node.js",
				],
			},
			{
				id: "REG-003",
				name: "Rian Hidayat",
				email: "rian.hidayat@outlook.com",
				phone: "+62 878-1122-3344",
				program: "Backend Dev Go/Docker",
				date: "12 Mar 2026 18:22 WIB",
				refCode: "",
				promoCode: "BACKENDBOOTCAMP",
				promoDiscount: 500000,
				originalPrice: 4000000,
				finalPrice: 3500000,
				status: "pending",
				timeline: [
					{
						title: "Akun Dibuat",
						time: "12 Mar 2026 18:00 WIB",
						desc: "Rian berhasil mendaftar akun baru.",
					},
					{
						title: "Paket Dipilih & Disubmit",
						time: "12 Mar 2026 18:22 WIB",
						desc: "Pendaftaran Bootcamp Backend Go & Docker dikirim oleh pendaftar.",
					},
				],
				modules: [
					"Go (Golang) basics & concurrency patterns",
					"REST API development with Gin/Fiber frameworks",
					"Database connections (PostgreSQL/MySQL & GORM)",
					"Docker containerization & Orchestration basics",
				],
			},
			{
				id: "REG-004",
				name: "Siti Aminah",
				email: "siti.aminah@gmail.com",
				phone: "+62 855-4433-2211",
				program: "React & Next.js Professional",
				date: "11 Mar 2026 10:05 WIB",
				refCode: "Akbar",
				promoCode: "",
				promoDiscount: 0,
				originalPrice: 3500000,
				finalPrice: 3500000,
				status: "approved",
				timeline: [
					{
						title: "Akun Dibuat",
						time: "11 Mar 2026 09:30 WIB",
						desc: "Siti mendaftar akun baru.",
					},
					{
						title: "Review Disetujui",
						time: "11 Mar 2026 10:05 WIB",
						desc: "Pendaftaran disetujui oleh Admin dan dipindahkan ke plotting.",
					},
				],
				modules: [
					"React Fundamentals & Hooks (State, Ref, Effect)",
					"Next.js Core Concepts (App Router, Layouts, Metadata)",
				],
			},
			{
				id: "REG-005",
				name: "Joko Susilo",
				email: "joko.susilo@hotmail.com",
				phone: "+62 899-7788-9900",
				program: "Backend Dev Go/Docker",
				date: "10 Mar 2026 09:12 WIB",
				refCode: "",
				promoCode: "",
				promoDiscount: 0,
				originalPrice: 4000000,
				finalPrice: 4000000,
				status: "rejected",
				timeline: [
					{
						title: "Akun Dibuat",
						time: "10 Mar 2026 08:30 WIB",
						desc: "Joko mendaftar akun baru.",
					},
					{
						title: "Review Ditolak",
						time: "10 Mar 2026 09:12 WIB",
						desc: "Pendaftaran ditolak oleh Admin.",
					},
				],
				modules: [
					"Go (Golang) basics & concurrency patterns",
					"REST API development with Gin/Fiber frameworks",
				],
			},
		]);
		setSelectedItemId(null);
		setConfirmAction(null);
		setSearchQuery("");
		setSelectedStatus("all");
		setSelectedProgram("all");
		setSimulationState("default");
		setToastMessage({
			type: "success",
			text: "Data simulasi berhasil di-reset ke default.",
		});
	};

	return (
		<div className='flex flex-col gap-10 w-full text-left font-sans pb-16'>
			{/* 1. Page Title Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<div className='flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-300 font-semibold mb-1'>
						<span>Admin</span>
						<span>/</span>
						<span>Review Pendaftaran</span>
					</div>
					<h1 className='text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white leading-tight'>
						Review Pendaftaran Siswa
					</h1>
				</div>

				{/* Dynamic Simulation Toggles */}
				<div className='flex flex-wrap gap-2.5 items-center bg-zinc-100/80 dark:bg-zinc-800/40 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 z-20'>
					<span className='text-[10px] text-zinc-500 dark:text-zinc-300 font-bold uppercase tracking-wider pl-2 pr-1'>
						Simulasi State:
					</span>
					<button
						onClick={() => {
							setSimulationState("default");
							setSelectedItemId(null);
						}}
						className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${simulationState === "default" ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}>
						Default
					</button>
					<button
						onClick={() => {
							setSimulationState("loading");
							setSelectedItemId(null);
						}}
						className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${simulationState === "loading" ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}>
						Loading
					</button>
					<button
						onClick={() => {
							setSimulationState("empty");
							setSelectedItemId(null);
						}}
						className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${simulationState === "empty" ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}>
						Empty
					</button>
					<button
						onClick={() => {
							setSimulationState("error");
							setSelectedItemId(null);
						}}
						className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${simulationState === "error" ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}>
						Error
					</button>
					<button
						onClick={resetAllScenarios}
						title='Reset Data Simulasi'
						className='p-1 text-zinc-500 dark:text-zinc-400 hover:text-sakode-orange hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 rounded-lg transition-colors ml-1 cursor-pointer'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={2}
							stroke='currentColor'
							className='w-3.5 h-3.5'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* 2. Metrics Summary Grid */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				{[
					{
						label: "Total Antrean",
						value: metrics.pending,
						color: "orange" as const,
						bg: "bg-amber-500/10",
						text: "text-amber-700 dark:text-amber-400",
					},
					{
						label: "Total Pendaftaran",
						value: metrics.total,
						color: selectedColor,
						bg: `${getBgOpacity10Class(selectedColor)}`,
						text: `${getTextClass(selectedColor)}`,
					},
					{
						label: "Disetujui",
						value: metrics.approved,
						color: "green" as const,
						bg: "bg-emerald-500/10",
						text: "text-emerald-700 dark:text-emerald-400",
					},
					{
						label: "Ditolak",
						value: metrics.rejected,
						color: "red" as const,
						bg: "bg-rose-500/10",
						text: "text-rose-700 dark:text-rose-400",
					},
				].map((m, idx) => (
					<UI.Card key={idx} accentColor={m.color}>
						<div className='p-4 flex flex-col gap-1.5 justify-start text-left relative overflow-hidden'>
							<span className='text-[10px] font-bold text-zinc-400 dark:text-zinc-300 uppercase tracking-wider'>
								{m.label}
							</span>
							<span
								className={`text-2xl font-bold text-zinc-900 dark:text-white leading-none mt-1`}>
								{simulationState === "loading" ? "..." : m.value}
							</span>
						</div>
					</UI.Card>
				))}
			</div>

			{/* 3. Main Workspace: Filter & split layout */}
			<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
				{/* Left Panel: Table/List View */}
				<div className='lg:col-span-7 flex flex-col gap-4'>
					<UI.Card accentColor={selectedColor}>
						<div className='p-5 flex flex-col gap-5'>
							{/* Filter bar (Adapting to visual style constraints) */}
							<div className='flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center'>
								<div className='flex-1 relative flex items-center'>
									<Icons.Search className='w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none' />
									<UI.Input
										type='text'
										placeholder='Cari siswa / email...'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										accentColor={selectedColor}
										className='pl-10! text-xs! py-2!'
									/>
								</div>

								<div className='flex gap-2.5'>
									<div className='relative'>
										<UI.Select
											value={selectedStatus}
											onChange={(e) => setSelectedStatus(e.target.value)}
											accentColor={selectedColor}
											className='text-xs! py-2! pr-8! pl-3!'
											aria-label='Filter Status'>
											<option value='all'>Status: Semua</option>
											<option value='pending'>Pending</option>
											<option value='approved'>Disetujui</option>
											<option value='rejected'>Ditolak</option>
										</UI.Select>
										<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400 dark:text-zinc-500'>
											<svg
												className='fill-current h-3.5 w-3.5'
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 20 20'>
												<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
											</svg>
										</div>
									</div>

									<div className='relative'>
										<UI.Select
											value={selectedProgram}
											onChange={(e) => setSelectedProgram(e.target.value)}
											accentColor={selectedColor}
											className='text-xs! py-2! pr-8! pl-3!'
											aria-label='Filter Program'>
											<option value='all'>Program: Semua</option>
											<option value='React & Next.js Professional'>React & Next</option>
											<option value='TypeScript & Data Structures'>TypeScript</option>
											<option value='Backend Dev Go/Docker'>Go / Docker</option>
										</UI.Select>
										<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400 dark:text-zinc-500'>
											<svg
												className='fill-current h-3.5 w-3.5'
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 20 20'>
												<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
											</svg>
										</div>
									</div>
								</div>
							</div>

							{/* Data State Boundary */}
							{simulationState === "loading" ?
								// 3.1 LOADING STATE (Skeletons)
								<div className='flex flex-col gap-3 py-4'>
									{[1, 2, 3].map((s) => (
										<div
											key={s}
											className='flex flex-col gap-2 p-4 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl animate-pulse'>
											<div className='flex justify-between items-center'>
												<div className='h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md' />
												<div className='h-4.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full' />
											</div>
											<div className='h-3.5 w-48 bg-zinc-100 dark:bg-zinc-800 rounded-md mt-1' />
											<div className='h-px bg-zinc-200/50 dark:bg-zinc-800 my-1' />
											<div className='flex justify-between items-center'>
												<div className='h-7 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg' />
												<div className='h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-md' />
											</div>
										</div>
									))}
								</div>
							: simulationState === "error" ?
								// 3.2 ERROR STATE
								<div className='flex flex-col items-center justify-center py-10 px-4 text-center'>
									<div className='w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4'>
										<Icons.AlertCircle className='w-6 h-6' />
									</div>
									<h3 className='text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-1'>
										Gagal Memuat Data
									</h3>
									<p className='text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-4'>
										Koneksi database terputus. Silakan coba lagi atau reset data simulasi.
									</p>
									<UI.Button
										variant='secondary'
										accentColor='red'
										onClick={() => setSimulationState("default")}
										className='text-xs! py-1.5! px-4! cursor-pointer'>
										Muat Ulang
									</UI.Button>
								</div>
							: filteredItems.length === 0 ?
								// 3.3 EMPTY STATE
								<div className='flex flex-col items-center justify-center py-14 px-4 text-center'>
									<div className='w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-805 flex items-center justify-center text-zinc-400 mb-4'>
										<Icons.Info className='w-6 h-6' />
									</div>
									<h3 className='text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1'>
										Tidak Ada Pendaftaran
									</h3>
									<p className='text-xs text-zinc-500 dark:text-zinc-400 max-w-xs'>
										Tidak ada siswa baru yang sesuai dengan kata kunci pencarian atau
										filter aktif.
									</p>
								</div>
								// 3.4 LIST CONTAINER
							:	<div className='flex flex-col gap-3'>
									{filteredItems.map((item) => {
										const isSelected = selectedItemId === item.id;
										return (
											<div
												key={item.id}
												onClick={() => setSelectedItemId(item.id)}
												className={`p-4 border rounded-2xl transition-all duration-200 cursor-pointer flex flex-col gap-3 relative overflow-hidden group ${
													isSelected ?
														"bg-zinc-50/80 dark:bg-zinc-800/40 border-sakode-blue dark:border-sakode-blue/80 shadow-3xs"
													:	"bg-transparent hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-zinc-200/60 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
												}`}>
												{/* Name and badge (Style-Aware Badges) */}
												<div className='flex justify-between items-center gap-2'>
													<h3 className='text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate'>
														{item.name}
													</h3>
													<div className='flex items-center gap-1.5 shrink-0'>
														{item.refCode ?
															<UI.Badge
																variant='accent'
																accentColor='purple'
																className='text-[9px]! font-medium! px-2! py-0.5!'>
																Ref: {item.refCode}
															</UI.Badge>
														:	<UI.Badge
																variant='default'
																className='text-[9px]! font-medium! px-2! py-0.5!'>
																No Ref
															</UI.Badge>
														}
													</div>
												</div>

												{/* Program */}
												<div className='text-xs text-zinc-500 dark:text-zinc-400 font-medium'>
													{item.program}
												</div>

												{/* Divider */}
												<div className={getSubElementClass("divider")} />

												{/* Bottom row actions */}
												<div className='flex justify-between items-center gap-2'>
													{item.status === "pending" ?
														<UI.Badge variant='warning' accentColor='orange'>
															Pending Review
														</UI.Badge>
													: item.status === "approved" ?
														<UI.Badge variant='success' accentColor='green'>
															Disetujui
														</UI.Badge>
													:	<UI.Badge variant='accent' accentColor='red'>
															Ditolak
														</UI.Badge>
													}

													<span className='text-[10px] text-zinc-500 dark:text-zinc-400 font-normal'>
														{item.date.split(" ")[0]} {item.date.split(" ")[1]}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							}
						</div>
					</UI.Card>
				</div>

				{/* Right Panel: Detail Panel Drawer View */}
				<div className='lg:col-span-5 flex flex-col gap-3'>
					<AnimatePresence mode='wait'>
						{
							!selectedItem ?
								// 4.1 NO SELECTED STATE
								<motion.div
									key='no-selection'
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className='w-full'>
									<UI.Card accentColor={selectedColor}>
										<div className='p-8 text-center flex flex-col items-center justify-center gap-4 py-20'>
											<div
												className={`w-12 h-12 rounded-full ${getBgOpacity10Class(selectedColor)} flex items-center justify-center ${getTextClass(selectedColor)}`}>
												<Icons.Info className='w-5 h-5' />
											</div>
											<div className='flex flex-col gap-1'>
												<h4 className='text-xs font-bold text-zinc-805 dark:text-zinc-200 uppercase tracking-wider'>
													Detail Verifikasi
												</h4>
												<p className='text-xs text-zinc-500 dark:text-zinc-300 max-w-xs mt-1'>
													Pilih salah satu siswa dari daftar antrean sebelah kiri untuk
													melakukan review dokumen, status promosi, atribusi referral, dan
													persetujuan plotting.
												</p>
											</div>
										</div>
									</UI.Card>
								</motion.div>
								// 4.2 DETAILED VERIFICATION PANEL
							:	<motion.div
									key={selectedItem.id}
									initial={{ opacity: 0, scale: 0.98 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.98 }}
									className='w-full'>
									<UI.Card
										accentColor={
											selectedItem.status === "pending" ? "orange" : selectedColor
										}>
										<div className='p-5 flex flex-col gap-5 text-left relative'>
											{/* Header Details */}
											<div className='flex justify-between items-start border-b border-zinc-150 dark:border-zinc-850 pb-4'>
												<div>
													<span className='text-[9px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-sm border border-zinc-205 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'>
														{selectedItem.id}
													</span>
													<h2 className='text-base font-bold text-zinc-900 dark:text-white mt-1.5 leading-snug'>
														{selectedItem.name}
													</h2>
													<span className='text-[10px] text-zinc-500 dark:text-zinc-300 block mt-0.5'>
														Terdaftar: {selectedItem.date}
													</span>
												</div>
												<button
													onClick={() => setSelectedItemId(null)}
													className={getCloseButtonClass()}
													aria-label='Tutup Detail'>
													<Icons.X className='w-4 h-4' />
												</button>
											</div>

											{/* Applicant Basic Info */}
											<div className='flex flex-col gap-1.5 text-xs text-zinc-700 dark:text-zinc-200'>
												<div className='flex justify-between'>
													<span className='text-zinc-400 dark:text-zinc-400 font-medium'>
														Email:
													</span>
													<span className='font-semibold text-zinc-800 dark:text-zinc-100'>
														{selectedItem.email}
													</span>
												</div>
												<div className='flex justify-between'>
													<span className='text-zinc-400 dark:text-zinc-400 font-medium'>
														No. Telepon:
													</span>
													<span className='font-semibold text-zinc-800 dark:text-zinc-100'>
														{selectedItem.phone}
													</span>
												</div>
											</div>

											<div className={getSubElementClass("divider")} />

											{/* Attribution & Incentives Section (Blocks handled for overflow) */}
											<div className='flex flex-col gap-2.5'>
												<h4 className='text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider'>
													Atribusi & Insentif
												</h4>
												<div className='grid grid-cols-2 gap-3'>
													{/* Referral */}
													<div className={getSubElementClass("inner-card")}>
														<span className='text-[9.5px] text-zinc-400 dark:text-zinc-400 block mb-0.5'>
															Referral Code
														</span>
														{selectedItem.refCode ?
															<span className='font-bold text-purple-700 dark:text-purple-300 block truncate w-full'>
																Ref: {selectedItem.refCode}
															</span>
														:	<span className='font-medium text-zinc-400 dark:text-zinc-500 block truncate w-full'>
																Tanpa Referral
															</span>
														}
													</div>
													{/* Promo */}
													<div className={getSubElementClass("inner-card")}>
														<span className='text-[9.5px] text-zinc-400 dark:text-zinc-400 block mb-0.5'>
															Promo Code
														</span>
														{selectedItem.promoCode ?
															<span className='font-bold text-orange-600 dark:text-orange-400 block truncate w-full'>
																{selectedItem.promoCode}
															</span>
														:	<span className='font-medium text-zinc-400 dark:text-zinc-500 block truncate w-full'>
																Tanpa Promo
															</span>
														}
													</div>
												</div>
											</div>

											<div className={getSubElementClass("divider")} />

											{/* Price Snapshot Section (Adjusted colors for clear dark mode contrast) */}
											<div className='flex flex-col gap-2'>
												<h4 className='text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider'>
													Rincian Biaya Paket (Snapshot)
												</h4>
												<div className='flex flex-col gap-1.5 text-xs text-zinc-700 dark:text-zinc-200'>
													<div className='flex justify-between'>
														<span className='text-zinc-450 dark:text-zinc-300 font-medium'>
															Harga Asli Paket:
														</span>
														<span className='font-semibold text-zinc-800 dark:text-zinc-200'>
															Rp {selectedItem.originalPrice.toLocaleString("id-ID")}
														</span>
													</div>
													{selectedItem.promoDiscount > 0 && (
														<div className='flex justify-between text-rose-600 dark:text-rose-400'>
															<span className='text-zinc-450 dark:text-zinc-300 font-medium'>
																Diskon Kode Promo:
															</span>
															<span className='font-semibold'>
																-Rp {selectedItem.promoDiscount.toLocaleString("id-ID")}
															</span>
														</div>
													)}
													<div className='h-px border-t border-dashed border-zinc-200 dark:border-zinc-800/80 my-1' />
													<div className='flex justify-between items-center text-sm font-bold mt-0.5'>
														<span className='text-zinc-800 dark:text-zinc-200'>
															Total Biaya:
														</span>
														<span
															className={`font-extrabold text-sm ${getTextClass(selectedColor)} dark:text-zinc-50`}>
															Rp {selectedItem.finalPrice.toLocaleString("id-ID")}
														</span>
													</div>
												</div>
											</div>

											<div className={getSubElementClass("divider")} />

											{/* Timeline of Application */}
											<div className='flex flex-col gap-3'>
												<h4 className='text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider'>
													Timeline Pendaftaran
												</h4>
												<div className={getSubElementClass("timeline-line")}>
													{selectedItem.timeline.map((step, sIdx) => {
														const isLast = sIdx === selectedItem.timeline.length - 1;
														return (
															<div
																key={sIdx}
																className='relative flex flex-col gap-0.5 text-left'>
																{/* Dot pointer styled using helper */}
																<div
																	className={`${getSubElementClass("timeline-dot")} ${
																		isLast ?
																			getBgClass(selectedColor)
																		:	"bg-zinc-300 dark:bg-zinc-700"
																	}`}
																/>
																<span className='text-[10px] font-bold text-zinc-800 dark:text-zinc-200'>
																	{step.title}
																</span>
																<span className='text-[8.5px] text-zinc-500 dark:text-zinc-400 font-medium leading-none block'>
																	{step.time}
																</span>
																<p className='text-[9.5px] text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal mt-0.5'>
																	{step.desc}
																</p>
															</div>
														);
													})}
												</div>
											</div>

											<div className={getSubElementClass("divider")} />

											{/* Selected Modules Summary */}
											<div className='flex flex-col gap-2.5'>
												<div className='flex justify-between items-center'>
													<h4 className='text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider'>
														Modul Pembelajaran
													</h4>
													<span className='text-[9.5px] font-bold text-zinc-500 dark:text-zinc-300'>
														{selectedItem.modules.length} Modul Wajib
													</span>
												</div>
												<div className='flex flex-col gap-1.5'>
													{selectedItem.modules.map((mod, mIdx) => (
														<div
															key={mIdx}
															className='flex gap-2 items-start text-xs font-normal text-zinc-650 dark:text-zinc-300'>
															<span
																className={`w-1 h-1 rounded-full shrink-0 mt-2 ${getBgClass(selectedColor)}`}
															/>
															<span className='leading-relaxed'>{mod}</span>
														</div>
													))}
												</div>
											</div>

											{/* Mock review actions */}
											{selectedItem.status === "pending" && (
												<div className='flex gap-3 mt-4 border-t border-zinc-150 dark:border-zinc-800 pt-5'>
													<UI.Button
														variant='secondary'
														accentColor={selectedColor}
														onClick={() =>
															setConfirmAction({ type: "reject", item: selectedItem })
														}
														className='flex-1 text-xs! py-2.5! font-semibold! cursor-pointer'>
														Tolak
													</UI.Button>
													<UI.Button
														variant='primary'
														accentColor={selectedColor}
														onClick={() =>
															setConfirmAction({ type: "approve", item: selectedItem })
														}
														className='flex-1 text-xs! py-2.5! font-semibold! cursor-pointer'>
														Setujui & Plotting
													</UI.Button>
												</div>
											)}
										</div>
									</UI.Card>
								</motion.div>

						}
					</AnimatePresence>
				</div>
			</div>

			{/* 5. Review Confirmation Dialog Overlay (Style-Aware using UI.Card wrapper) */}
			<AnimatePresence>
				{confirmAction && (
					<div className='fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50'>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className='w-full max-w-md relative'>
							<UI.Card accentColor={confirmAction.type === "approve" ? "blue" : "red"}>
								<div className='flex flex-col gap-4 text-left'>
									<div className='flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3'>
										<h3 className='text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-200'>
											Konfirmasi Aksi Review
										</h3>
										<button
											onClick={() => setConfirmAction(null)}
											aria-label='Tutup dialog'
											className={getCloseButtonClass()}>
											<Icons.X className='w-4 h-4' />
										</button>
									</div>

									<div className='flex flex-col gap-3 py-1 text-xs'>
										<p className='text-zinc-700 dark:text-zinc-200 font-medium leading-relaxed'>
											Apakah Anda yakin ingin{" "}
											{confirmAction.type === "approve" ?
												"menyetujui pendaftaran"
											:	"menolak pendaftaran"}{" "}
											untuk calon siswa:
										</p>
										<div className={getSubElementClass("inner-card")}>
											<span className='font-bold text-zinc-800 dark:text-zinc-100 block truncate w-full'>
												{confirmAction.item.name}
											</span>
											<span className='text-[10px] text-zinc-400 dark:text-zinc-300 font-medium block mt-0.5 truncate w-full'>
												{confirmAction.item.program}
											</span>
										</div>
										{confirmAction.type === "approve" ?
											<p className='text-[10px] text-zinc-500 dark:text-zinc-400 font-normal leading-normal italic'>
												* Setelah disetujui, pendaftaran akan otomatis masuk antrean
												plotting mentor dan status akan diperbarui di riwayat dashboard.
											</p>
										:	<p className='text-[10px] text-rose-500/80 dark:text-rose-450/80 font-normal leading-normal italic'>
												* Setelah ditolak, pendaftaran akan ditutup dan email pemberitahuan
												akan disimulasikan dikirim ke calon siswa.
											</p>
										}
									</div>

									<div className='flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4'>
										<UI.Button
											variant='secondary'
											accentColor={selectedColor}
											onClick={() => setConfirmAction(null)}
											className='text-xs! py-2! font-semibold! cursor-pointer'>
											Batal
										</UI.Button>
										<UI.Button
											variant='primary'
											accentColor={confirmAction.type === "approve" ? "blue" : "red"}
											onClick={handleReviewActionConfirm}
											className='text-xs! py-2! font-semibold! cursor-pointer'>
											{confirmAction.type === "approve" ?
												"Setujui & Plotting"
											:	"Tolak Pendaftaran"}
										</UI.Button>
									</div>
								</div>
							</UI.Card>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* 6. Success Feedback Toast Notification (Style-Aware using UI.Card wrapper) */}
			<AnimatePresence>
				{toastMessage && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className='fixed bottom-6 right-6 z-50 max-w-sm w-full font-sans animate-none'>
						<UI.Card accentColor={toastMessage.type === "success" ? "green" : "red"}>
							<div className='flex items-start gap-3.5 text-xs leading-normal'>
								<div className='shrink-0 mt-0.5'>
									{toastMessage.type === "success" ?
										<Icons.Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
									:	<Icons.AlertCircle className='w-4 h-4 text-rose-600 dark:text-rose-400' />
									}
								</div>
								<div className='flex-1 font-semibold text-zinc-800 dark:text-zinc-200'>
									{toastMessage.text}
								</div>
								<button
									title='Tutup'
									onClick={() => setToastMessage(null)}
									className='shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer'>
									<Icons.X className='w-3.5 h-3.5' />
								</button>
							</div>
						</UI.Card>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
