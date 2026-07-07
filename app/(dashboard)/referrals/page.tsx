/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";

interface ReferralProgram {
	id: string;
	name: string;
	desc: string;
	status: "active" | "inactive" | "expired";
	targetProgram: string;
	startDate: string;
	endDate: string;
	codeCount: number;
	conversionCount: number;
	payoutStartDay: number;
	payoutEndDay: number;
}

interface ReferralCode {
	code: string;
	referrer: string;
	status: "active" | "suspended" | "exhausted";
	used: number;
	limit: number | "unlimited";
	dateCreated: string;
}

interface ReferralConversion {
	id: string;
	studentName: string;
	email: string;
	codeUsed: string;
	dateConverted: string;
	registrationStatus: "pending" | "approved" | "rejected";
}

export default function ReferralManagementPage() {
	const { selectedStyle, selectedColor } = useUIStyle();
	const UI =
		UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] ||
		UIStyles.UI["sakode-modern"];

	// 1. Simulation States
	const [simulationState, setSimulationState] = useState<
		| "default"
		| "loading"
		| "empty"
		| "error"
		| "expired"
		| "code-exhausted"
		| "no-attribution"
		| "corrected-attribution"
	>("default");

	// Filter & Search states
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTargetFilter, setSelectedTargetFilter] = useState("all");
	const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

	// Selection states
	const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
		"REF-PRG-001",
	);
	const [copiedCode, setCopiedCode] = useState<string | null>(null);

	// Modals & form states
	const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
	const [isGenerateCodeOpen, setIsGenerateCodeOpen] = useState(false);
	const [isCorrectionOpen, setIsCorrectionOpen] = useState<{
		conversion: ReferralConversion;
	} | null>(null);
	const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState<{
		type: "activate" | "deactivate";
		program: ReferralProgram;
	} | null>(null);
	const [toastMessage, setToastMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	// Form input states
	const [newProgramForm, setNewProgramForm] = useState({
		name: "",
		desc: "",
		targetProgram: "Semua Program Bootcamp",
		startDate: "2026-07-06",
		endDate: "2026-12-31",
		payoutStartDay: 25,
		payoutEndDay: 30,
	});

	const [newCodeForm, setNewCodeForm] = useState({
		code: "",
		referrer: "",
		limit: "unlimited",
		limitValue: 50,
	});

	const [correctionForm, setCorrectionForm] = useState({
		newCode: "",
	});

	// 2. Mock Databases (Recreated Reactively based on Simulation States)
	const [programs, setPrograms] = useState<ReferralProgram[]>([]);
	const [codes, setCodes] = useState<ReferralCode[]>([]);
	const [conversions, setConversions] = useState<ReferralConversion[]>([]);

	// Sync simulation scenario states
	useEffect(() => {
		// Basic programs
		const basePrograms: ReferralProgram[] = [
			{
				id: "REF-PRG-001",
				name: "Program Rujukan Alumni SAKODE",
				desc:
					"Insentif tracking untuk alumni yang merekomendasikan Bootcamp SAKODE kepada kenalan atau publik.",
				status: "active",
				targetProgram: "Semua Program Bootcamp",
				startDate: "01 Mar 2026",
				endDate: "31 Des 2026",
				codeCount: 4,
				conversionCount: 18,
				payoutStartDay: 25,
				payoutEndDay: 30,
			},
			{
				id: "REF-PRG-002",
				name: "Partnership Kampus Merdeka IT",
				desc:
					"Tracking program magang dan rujukan akademis universitas mitra program digital.",
				status: "active",
				targetProgram: "React & Next.js Professional",
				startDate: "15 Mar 2026",
				endDate: "30 Sep 2026",
				codeCount: 2,
				conversionCount: 6,
				payoutStartDay: 30,
				payoutEndDay: 1,
			},
			{
				id: "REF-PRG-003",
				name: "Referral Influencer TikTok & IG",
				desc:
					"Kampanye promosi media sosial influencer rujukan kurikulum pemrograman dasar.",
				status: "active",
				targetProgram: "Backend Dev Go/Docker",
				startDate: "01 Feb 2026",
				endDate: "01 Jul 2026",
				codeCount: 3,
				conversionCount: 12,
				payoutStartDay: 5,
				payoutEndDay: 10,
			},
			{
				id: "REF-PRG-004",
				name: "Rujukan Internal Mentor S1",
				desc:
					"Tracking internal rekomendasi siswa khusus oleh mentor active semester ganjil.",
				status: "expired",
				targetProgram: "TypeScript & Data Structures",
				startDate: "01 Jan 2026",
				endDate: "10 Mar 2026",
				codeCount: 2,
				conversionCount: 8,
				payoutStartDay: 25,
				payoutEndDay: 31,
			},
		];

		// Basic Codes
		const baseCodes: ReferralCode[] = [
			{
				code: "AKBAR26",
				referrer: "Akbar Ramadhan",
				status: "active",
				used: 15,
				limit: 50,
				dateCreated: "01 Mar 2026",
			},
			{
				code: "MANDIRIIT",
				referrer: "Magang Mandiri",
				status: "active",
				used: 6,
				limit: "unlimited",
				dateCreated: "15 Mar 2026",
			},
			{
				code: "YOGA22",
				referrer: "Yoga Pratama",
				status: "active",
				used: 12,
				limit: 20,
				dateCreated: "02 Feb 2026",
			},
			{
				code: "EXHAUST10",
				referrer: "Promo Event Habis",
				status: "exhausted",
				used: 50,
				limit: 50,
				dateCreated: "10 Jan 2026",
			},
		];

		// Basic conversions
		const baseConversions: ReferralConversion[] = [
			{
				id: "CONV-001",
				studentName: "Dzulkifli Putra",
				email: "dzulkifli.putra@gmail.com",
				codeUsed: "AKBAR26",
				dateConverted: "13 Mar 2026 16:30",
				registrationStatus: "pending",
			},
			{
				id: "CONV-002",
				studentName: "Endah Lestari",
				email: "endah.lestari@yahoo.com",
				codeUsed: "MANDIRIIT",
				dateConverted: "13 Mar 2026 14:15",
				registrationStatus: "pending",
			},
			{
				id: "CONV-003",
				studentName: "Rian Hidayat",
				email: "rian.hidayat@outlook.com",
				codeUsed: "AKBAR26",
				dateConverted: "12 Mar 2026 18:22",
				registrationStatus: "pending",
			},
			{
				id: "CONV-004",
				studentName: "Siti Aminah",
				email: "siti.aminah@gmail.com",
				codeUsed: "AKBAR26",
				dateConverted: "11 Mar 2026 10:05",
				registrationStatus: "approved",
			},
			{
				id: "CONV-005",
				studentName: "Joko Susilo",
				email: "joko.susilo@hotmail.com",
				codeUsed: "YOGA22",
				dateConverted: "10 Mar 2026 09:12",
				registrationStatus: "rejected",
			},
		];

		if (simulationState === "loading") {
			setPrograms([]);
			setCodes([]);
			setConversions([]);
		} else if (simulationState === "empty") {
			setPrograms([]);
			setCodes([]);
			setConversions([]);
		} else if (simulationState === "expired") {
			setPrograms(basePrograms.map((p) => ({ ...p, status: "expired" })));
			setCodes(baseCodes);
			setConversions(baseConversions);
		} else if (simulationState === "code-exhausted") {
			setPrograms(basePrograms);
			setCodes(
				baseCodes.map((c) => ({
					...c,
					status: "exhausted",
					used: typeof c.limit === "number" ? c.limit : 99,
				})),
			);
			setConversions(baseConversions);
		} else if (simulationState === "no-attribution") {
			setPrograms(basePrograms.map((p) => ({ ...p, conversionCount: 0 })));
			setCodes(baseCodes.map((c) => ({ ...c, used: 0 })));
			setConversions([]);
		} else if (simulationState === "corrected-attribution") {
			setPrograms(basePrograms);
			setCodes(baseCodes);
			setConversions(
				baseConversions.map((c) =>
					c.id === "CONV-003" ?
						{
							...c,
							codeUsed: "MANDIRIIT",
							studentName: "Rian Hidayat (Koreksi Rujukan)",
						}
					:	c,
				),
			);
		} else {
			setPrograms(basePrograms);
			setCodes(baseCodes);
			setConversions(baseConversions);
		}
	}, [simulationState]);

	// Derived selected item
	const selectedProgram = useMemo(() => {
		if (!selectedProgramId) return null;
		return programs.find((p) => p.id === selectedProgramId) || null;
	}, [programs, selectedProgramId]);

	// 4. Filters & Search Evaluation
	const filteredPrograms = useMemo(() => {
		if (simulationState === "empty" || simulationState === "loading") return [];
		return programs.filter((item) => {
			const matchesSearch =
				item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.desc.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesTarget =
				selectedTargetFilter === "all" ||
				item.targetProgram === selectedTargetFilter;
			const matchesStatus =
				selectedStatusFilter === "all" || item.status === selectedStatusFilter;
			return matchesSearch && matchesTarget && matchesStatus;
		});
	}, [
		programs,
		searchQuery,
		selectedTargetFilter,
		selectedStatusFilter,
		simulationState,
	]);

	// 5. Metrics calculation
	const metrics = useMemo(() => {
		if (simulationState === "empty" || simulationState === "loading") {
			return { clicks: 0, activeCodes: 0, conversions: 0, activePrograms: 0 };
		}
		return {
			clicks: 1250,
			activeCodes: codes.filter((c) => c.status === "active").length,
			conversions: conversions.length,
			activePrograms: programs.filter((p) => p.status === "active").length,
		};
	}, [programs, codes, conversions, simulationState]);

	// 6. Action Execution Handlers
	const handleCreateProgram = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newProgramForm.name) return;

		const newPrg: ReferralProgram = {
			id: `REF-PRG-00${programs.length + 1}`,
			name: newProgramForm.name,
			desc: newProgramForm.desc,
			status: "active",
			targetProgram: newProgramForm.targetProgram,
			startDate: new Date(newProgramForm.startDate).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}),
			endDate: new Date(newProgramForm.endDate).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}),
			codeCount: 0,
			conversionCount: 0,
			payoutStartDay: Number(newProgramForm.payoutStartDay) || 25,
			payoutEndDay: Number(newProgramForm.payoutEndDay) || 30,
		};

		setPrograms((prev) => [newPrg, ...prev]);
		setIsCreateProgramOpen(false);
		setNewProgramForm({
			name: "",
			desc: "",
			targetProgram: "Semua Program Bootcamp",
			startDate: "2026-07-06",
			endDate: "2026-12-31",
			payoutStartDay: 25,
			payoutEndDay: 30,
		});
		setToastMessage({
			type: "success",
			text: `Program referral "${newPrg.name}" berhasil dibuat!`,
		});
	};

	const handleGenerateCode = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newCodeForm.code) return;

		const formattedCode = newCodeForm.code.toUpperCase().replace(/\s+/g, "");

		// Check if code exists
		if (codes.some((c) => c.code === formattedCode)) {
			setToastMessage({
				type: "error",
				text: `Kode "${formattedCode}" sudah digunakan!`,
			});
			return;
		}

		const newC: ReferralCode = {
			code: formattedCode,
			referrer: newCodeForm.referrer || "Anonim",
			status: "active",
			used: 0,
			limit:
				newCodeForm.limit === "unlimited" ? "unlimited" : newCodeForm.limitValue,
			dateCreated: new Date().toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}),
		};

		setCodes((prev) => [newC, ...prev]);
		setIsGenerateCodeOpen(false);
		setNewCodeForm({
			code: "",
			referrer: "",
			limit: "unlimited",
			limitValue: 50,
		});

		// Update code count in selected program
		if (selectedProgramId) {
			setPrograms((prev) =>
				prev.map((p) =>
					p.id === selectedProgramId ? { ...p, codeCount: p.codeCount + 1 } : p,
				),
			);
		}

		setToastMessage({
			type: "success",
			text: `Kode Referral "${newC.code}" untuk "${newC.referrer}" berhasil didaftarkan.`,
		});
	};

	const handleCorrection = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isCorrectionOpen || !correctionForm.newCode) return;

		const targetConv = isCorrectionOpen.conversion;
		const oldCode = targetConv.codeUsed;
		const newCode = correctionForm.newCode;

		setConversions((prev) =>
			prev.map((c) => (c.id === targetConv.id ? { ...c, codeUsed: newCode } : c)),
		);

		setCodes((prev) =>
			prev.map((c) => {
				if (c.code === oldCode) return { ...c, used: Math.max(0, c.used - 1) };
				if (c.code === newCode) return { ...c, used: c.used + 1 };
				return c;
			}),
		);

		setIsCorrectionOpen(null);
		setCorrectionForm({ newCode: "" });
		setToastMessage({
			type: "success",
			text: `Atribusi siswa "${targetConv.studentName}" berhasil dikoreksi ke kode: ${newCode}`,
		});
	};

	const toggleProgramStatus = () => {
		if (!isStatusConfirmOpen) return;
		const { type, program } = isStatusConfirmOpen;

		setPrograms((prev) =>
			prev.map((p) => {
				if (p.id === program.id) {
					return { ...p, status: type === "activate" ? "active" : "inactive" };
				}
				return p;
			}),
		);

		setIsStatusConfirmOpen(null);
		setToastMessage({
			type: "success",
			text:
				type === "activate" ?
					`Program "${program.name}" berhasil diaktifkan.`
				:	`Program "${program.name}" berhasil dinonaktifkan.`,
		});
	};

	// Copy to clipboard mock
	const handleCopyLink = (code: string) => {
		const canonicalLink = `https://sakode.org/register?ref=${code}`;
		navigator.clipboard.writeText(canonicalLink);
		setCopiedCode(code);
		setTimeout(() => setCopiedCode(null), 2000);
	};

	// Share native wrapper fallback
	const handleShareLink = (code: string) => {
		const canonicalLink = `https://sakode.org/register?ref=${code}`;
		if (navigator.share) {
			navigator
				.share({
					title: "SAKODE Academy Bootcamp",
					text: `Daftar kelas menggunakan kode rujukan saya: ${code}`,
					url: canonicalLink,
				})
				.catch(() => {});
		} else {
			handleCopyLink(code);
			setToastMessage({
				type: "success",
				text:
					"Fitur share native tidak didukung browser. Link canonical berhasil disalin!",
			});
		}
	};

	// Styling helper for consistency with active visual preset
	const getSubElementClass = (
		type: "divider" | "inner-card" | "timeline-dot" | "timeline-line",
	) => {
		switch (selectedStyle) {
			case "neobrutalism":
				if (type === "divider")
					return "h-[2px] bg-zinc-900 dark:bg-white w-full my-1";
				if (type === "inner-card")
					return "p-3.5 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
				return "";

			case "claymorphism":
				if (type === "divider")
					return "h-px bg-slate-200/60 dark:bg-zinc-800/60 w-full my-1";
				if (type === "inner-card")
					return "p-3.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/20 dark:border-zinc-700/20 rounded-2xl shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.05)]";
				return "";

			case "glassmorphism":
			case "liquid-glass":
				if (type === "divider")
					return "h-px bg-white/10 dark:bg-white/5 w-full my-1";
				if (type === "inner-card")
					return "p-3.5 bg-white/10 dark:bg-zinc-900/40 border border-white/20 dark:border-white/10 backdrop-blur-xs rounded-xl";
				return "";

			case "minimalism":
				if (type === "divider")
					return "h-px bg-zinc-200/40 dark:bg-zinc-800/40 w-full my-1";
				if (type === "inner-card")
					return "p-3 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/40 dark:border-zinc-850/40 rounded-lg";
				return "";

			case "bento-grid":
			case "sakode-modern":
			default:
				if (type === "divider")
					return "h-px bg-zinc-200/60 dark:bg-zinc-800/80 w-full my-1";
				if (type === "inner-card")
					return "p-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800 rounded-xl";
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
					"hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm text-zinc-400 dark:text-zinc-500"
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

	return (
		<div className='flex flex-col gap-10 w-full text-left font-sans pb-16'>
			{/* 1. Page Title Header & Simulation Switcher */}
			<div className='flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4'>
				<div>
					<div className='flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-300 font-semibold mb-1'>
						<span>Admin</span>
						<span>/</span>
						<span>Program Referral</span>
					</div>
					<h1 className='text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white leading-tight'>
						Manajemen Program Referral & Atribusi
					</h1>
				</div>

				{/* Dynamic Simulation Scenarios Selector */}
				<div className='flex flex-wrap gap-1.5 items-center bg-zinc-100/80 dark:bg-zinc-805 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 z-20'>
					<span className='text-[9px] text-zinc-500 dark:text-zinc-300 font-bold uppercase tracking-wider pl-2 pr-1.5'>
						Simulasi:
					</span>
					{[
						{ id: "default" as const, label: "Default" },
						{ id: "loading" as const, label: "Loading" },
						{ id: "empty" as const, label: "Empty" },
						{ id: "error" as const, label: "Error" },
						{ id: "expired" as const, label: "Expired" },
						{ id: "code-exhausted" as const, label: "Exhausted" },
						{ id: "no-attribution" as const, label: "No Use" },
						{ id: "corrected-attribution" as const, label: "Corrected" },
					].map((state) => (
						<button
							key={state.id}
							onClick={() => {
								setSimulationState(state.id);
								setSelectedProgramId(state.id === "empty" ? null : "REF-PRG-001");
							}}
							className={`px-2.5 py-1 text-[9.5px] font-bold rounded-lg transition-colors cursor-pointer ${simulationState === state.id ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-3xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}>
							{state.label}
						</button>
					))}
				</div>
			</div>

			{/* 2. Metrics Summary Grid */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				{[
					{
						label: "Total Klik Rujukan",
						value: metrics.clicks,
						color: selectedColor,
					},
					{
						label: "Kode Referral Aktif",
						value: metrics.activeCodes,
						color: "purple" as const,
					},
					{
						label: "Pendaftar Terkonversi",
						value: metrics.conversions,
						color: "green" as const,
					},
					{
						label: "Program Berjalan",
						value: metrics.activePrograms,
						color: "orange" as const,
					},
				].map((m, idx) => (
					<UI.Card key={idx} accentColor={m.color}>
						<div className='p-4 flex flex-col gap-1.5 justify-start text-left relative overflow-hidden'>
							<span className='text-[10px] font-bold text-zinc-400 dark:text-zinc-350 uppercase tracking-wider'>
								{m.label}
							</span>
							<span className='text-2xl font-bold text-zinc-900 dark:text-white leading-none mt-1'>
								{simulationState === "loading" ?
									"..."
								:	m.value.toLocaleString("id-ID")}
							</span>
						</div>
					</UI.Card>
				))}
			</div>

			{/* 3. Main Split Workspace */}
			<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
				{/* Left column: Referral Program List */}
				<div className='lg:col-span-6 flex flex-col gap-4'>
					<UI.Card accentColor={selectedColor}>
						<div className='p-5 flex flex-col gap-5'>
							{/* Tool bar & search filters */}
							<div className='flex flex-col gap-3.5'>
								<div className='flex justify-between items-center gap-3'>
									<h2 className='text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wider'>
										Program Berjalan
									</h2>
									<UI.Button
										variant='primary'
										accentColor={selectedColor}
										onClick={() => setIsCreateProgramOpen(true)}
										className='text-[10.5px]! py-1.5! px-3! h-auto! font-bold! cursor-pointer flex items-center gap-1.5'>
										<Icons.Plus className='w-3.5 h-3.5' />
										Tambah Program
									</UI.Button>
								</div>

								<div className='flex flex-col sm:flex-row gap-3'>
									<div className='flex-1 relative flex items-center'>
										<Icons.Search className='w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none' />
										<UI.Input
											type='text'
											placeholder='Cari program referral...'
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											accentColor={selectedColor}
											className='pl-10! text-xs! py-2!'
										/>
									</div>

									<div className='relative'>
										<UI.Select
											value={selectedTargetFilter}
											onChange={(e) => setSelectedTargetFilter(e.target.value)}
											accentColor={selectedColor}
											className='text-xs! py-2! pr-8! pl-3!'
											aria-label='Filter Target Bootcamp'>
											<option value='all'>Target: Semua</option>
											<option value='Semua Program Bootcamp'>Semua Program</option>
											<option value='React & Next.js Professional'>React & Next</option>
											<option value='Backend Dev Go/Docker'>Backend Go/Docker</option>
											<option value='TypeScript & Data Structures'>TypeScript</option>
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
											value={selectedStatusFilter}
											onChange={(e) => setSelectedStatusFilter(e.target.value)}
											accentColor={selectedColor}
											className='text-xs! py-2! pr-8! pl-3!'
											aria-label='Filter Status Program'>
											<option value='all'>Status: Semua</option>
											<option value='active'>Aktif</option>
											<option value='inactive'>Nonaktif</option>
											<option value='expired'>Expired</option>
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

							{/* Data State boundaries */}
							{simulationState === "loading" ?
								// 3.1 Loading list
								<div className='flex flex-col gap-3 py-4'>
									{[1, 2, 3].map((s) => (
										<div
											key={s}
											className='flex flex-col gap-2 p-4 border border-zinc-150 dark:border-zinc-800 rounded-2xl animate-pulse'>
											<div className='flex justify-between items-center'>
												<div className='h-4.5 w-44 bg-zinc-200 dark:bg-zinc-800 rounded-md' />
												<div className='h-4.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full' />
											</div>
											<div className='h-3.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-md mt-1' />
											<div className='h-px bg-zinc-200 dark:bg-zinc-800 my-1' />
											<div className='flex justify-between items-center'>
												<div className='h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-md' />
												<div className='h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-md' />
											</div>
										</div>
									))}
								</div>
							: simulationState === "error" ?
								// 3.2 Error list
								<div className='flex flex-col items-center justify-center py-10 px-4 text-center'>
									<div className='w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4'>
										<Icons.AlertCircle className='w-6 h-6' />
									</div>
									<h3 className='text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1'>
										Gagal Memuat Program Referral
									</h3>
									<p className='text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-4'>
										Sistem gagal sinkronisasi ke server. Silakan muat ulang atau coba
										beberapa saat lagi.
									</p>
									<UI.Button
										variant='secondary'
										accentColor='red'
										onClick={() => setSimulationState("default")}
										className='text-xs! py-1.5! px-4! cursor-pointer'>
										Muat Ulang
									</UI.Button>
								</div>
							: filteredPrograms.length === 0 ?
								// 3.3 Empty list
								<div className='flex flex-col items-center justify-center py-14 px-4 text-center'>
									<div className='w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-805 flex items-center justify-center text-zinc-400 mb-4'>
										<Icons.Info className='w-6 h-6' />
									</div>
									<h3 className='text-sm font-bold text-zinc-855 dark:text-zinc-200 mb-1'>
										Tidak Ada Program Rujukan
									</h3>
									<p className='text-xs text-zinc-500 dark:text-zinc-400 max-w-xs'>
										Belum ada program referral terdaftar, atau kata kunci pencarian Anda
										tidak cocok.
									</p>
								</div>
								// 3.4 Loaded list
							:	<div className='flex flex-col gap-3'>
									{filteredPrograms.map((prg) => {
										const isSelected = selectedProgramId === prg.id;
										return (
											<div
												key={prg.id}
												onClick={() => setSelectedProgramId(prg.id)}
												className={`p-4 border rounded-2xl transition-all duration-200 cursor-pointer flex flex-col gap-3 relative overflow-hidden group ${
													isSelected ?
														"bg-zinc-50/80 dark:bg-zinc-800/40 border-sakode-blue dark:border-sakode-blue/80 shadow-3xs"
													:	"bg-transparent hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 border-zinc-200/60 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
												}`}>
												{/* Title and Badge */}
												<div className='flex justify-between items-start gap-3'>
													<h3 className='text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-snug'>
														{prg.name}
													</h3>
													<div className='shrink-0'>
														{prg.status === "active" ?
															<UI.Badge variant='success' accentColor='green'>
																Aktif
															</UI.Badge>
														: prg.status === "expired" ?
															<UI.Badge variant='default'>Expired</UI.Badge>
														:	<UI.Badge variant='warning' accentColor='orange'>
																Nonaktif
															</UI.Badge>
														}
													</div>
												</div>

												{/* Description */}
												<p className='text-[11px] text-zinc-500 dark:text-zinc-300 leading-relaxed truncate-2-lines'>
													{prg.desc}
												</p>

												<div className={getSubElementClass("divider")} />

												{/* Bottom stats row */}
												<div className='flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-400 font-medium'>
													<span>Target: {prg.targetProgram}</span>
													<span className='font-bold text-zinc-800 dark:text-zinc-200'>
														{prg.codeCount} Kode • {prg.conversionCount} Rujukan
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

				{/* Right column: Selected Program Details, Codes, and Attribution Conversion Logs */}
				<div className='lg:col-span-6 flex flex-col gap-3'>
					<AnimatePresence mode='wait'>
						{
							!selectedProgram ?
								// 4.1 Fallback placeholder when no selection exists
								<motion.div
									key='no-selection'
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className='w-full'>
									<UI.Card accentColor={selectedColor}>
										<div className='p-8 text-center flex flex-col items-center justify-center gap-4 py-24'>
											<div
												className={`w-12 h-12 rounded-full ${getBgOpacity10Class(selectedColor)} flex items-center justify-center ${getTextClass(selectedColor)}`}>
												<Icons.Gift className='w-5 h-5' />
											</div>
											<div className='flex flex-col gap-1'>
												<h4 className='text-xs font-bold text-zinc-808 dark:text-zinc-200 uppercase tracking-wider'>
													Detail Program Referral
												</h4>
												<p className='text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-1'>
													Pilih salah satu kampanye referral di sebelah kiri untuk melihat
													daftar inventori kode rujukan, link canonical, limits, serta data
													pendaftar teratribusi.
												</p>
											</div>
										</div>
									</UI.Card>
								</motion.div>
								// 4.2 Detailed referral workspace view
							:	<motion.div
									key={selectedProgram.id}
									initial={{ opacity: 0, scale: 0.98 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.98 }}
									className='w-full'>
									<UI.Card
										accentColor={
											selectedProgram.status === "active" ? selectedColor : "orange"
										}>
										<div className='p-5 flex flex-col gap-5 text-left relative'>
											{/* Header: Title, dates, actions */}
											<div className='flex justify-between items-start border-b border-zinc-150 dark:border-zinc-850 pb-4'>
												<div>
													<span className='text-[9px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-sm border border-zinc-205 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'>
														{selectedProgram.id}
													</span>
													<h2 className='text-base font-bold text-zinc-900 dark:text-white mt-1.5 leading-snug'>
														{selectedProgram.name}
													</h2>
													<span className='text-[10px] text-zinc-500 dark:text-zinc-300 block mt-1'>
														Periode: {selectedProgram.startDate} — {selectedProgram.endDate}
													</span>
												</div>
												<button
													onClick={() => setSelectedProgramId(null)}
													className={getCloseButtonClass()}
													aria-label='Tutup Workspace'
													title='Tutup Workspace'>
													<Icons.X className='w-4 h-4' />
												</button>
											</div>

											{/* Program metadata overview */}
											<div className='flex flex-col gap-2.5 text-xs text-zinc-650 dark:text-zinc-300'>
												<p className='leading-relaxed text-zinc-500 dark:text-zinc-350'>
													{selectedProgram.desc}
												</p>

												<div className='flex justify-between items-center mt-1'>
													<span className='text-zinc-400 font-medium'>Target Bootcamp:</span>
													<span className='font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-md border border-zinc-200/50 dark:border-zinc-700/50'>
														{selectedProgram.targetProgram}
													</span>
												</div>
												<div className='flex justify-between items-center mt-1'>
													<span className='text-zinc-400 font-medium'>
														Jadwal Tanggal Payout Bulanan:
													</span>
													<span className='font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-md border border-zinc-200/50 dark:border-zinc-700/50 flex items-center gap-1'>
														<Icons.Calendar className='w-3.5 h-3.5 text-purple-500' />
														Tanggal {selectedProgram.payoutStartDay} s/d{" "}
														{selectedProgram.payoutEndDay}
													</span>
												</div>
												{/* Active Status Actions */}
												<div className='flex gap-2 mt-2'>
													{selectedProgram.status === "active" ?
														<UI.Button
															variant='secondary'
															accentColor='red'
															onClick={() =>
																setIsStatusConfirmOpen({
																	type: "deactivate",
																	program: selectedProgram,
																})
															}
															className='text-[10px]! py-1! px-2.5! h-auto! cursor-pointer border border-rose-500/20'>
															Nonaktifkan Program
														</UI.Button>
													: selectedProgram.status === "inactive" ?
														<UI.Button
															variant='primary'
															accentColor='green'
															onClick={() =>
																setIsStatusConfirmOpen({
																	type: "activate",
																	program: selectedProgram,
																})
															}
															className='text-[10px]! py-1! px-2.5! h-auto! cursor-pointer'>
															Aktifkan Program
														</UI.Button>
													:	<div className='text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 py-1 px-3.5 rounded-lg border border-amber-500/20'>
															Program Expired (Melebihi Batas Tanggal)
														</div>
													}
												</div>
											</div>

											<div className={getSubElementClass("divider")} />

											{/* Section A: Referral Code Inventory */}
											<div className='flex flex-col gap-3'>
												<div className='flex justify-between items-center'>
													<h4 className='text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider'>
														Inventori Kode Referral ({codes.length})
													</h4>
													{selectedProgram.status === "active" && (
														<button
															onClick={() => setIsGenerateCodeOpen(true)}
															className={`text-[9.5px] font-bold ${getTextClass(selectedColor)} hover:underline cursor-pointer flex items-center gap-1`}>
															<Icons.Plus className='w-3 h-3' />
															Tambah Kode
														</button>
													)}
												</div>

												{/* Codes Inventory List */}
												<div className='flex flex-col gap-2.5'>
													{codes.map((c, cIdx) => {
														const isExhausted =
															c.status === "exhausted" ||
															(typeof c.limit === "number" && c.used >= c.limit);
														return (
															<div key={cIdx} className={getSubElementClass("inner-card")}>
																<div className='flex flex-col gap-2'>
																	{/* Code Header row */}
																	<div className='flex justify-between items-center gap-2'>
																		<div className='flex items-center gap-2'>
																			<span className='font-mono font-black text-sm text-zinc-900 dark:text-white uppercase tracking-wide'>
																				{c.code}
																			</span>
																			{isExhausted ?
																				<UI.Badge
																					variant='accent'
																					accentColor='red'
																					className='text-[8.5px]! font-medium! px-1.5! py-0!'>
																					Habis
																				</UI.Badge>
																			: c.status === "suspended" ?
																				<UI.Badge
																					variant='warning'
																					accentColor='orange'
																					className='text-[8.5px]! font-medium! px-1.5! py-0!'>
																					Suspended
																				</UI.Badge>
																			:	<UI.Badge
																					variant='success'
																					accentColor='green'
																					className='text-[8.5px]! font-medium! px-1.5! py-0!'>
																					Aktif
																				</UI.Badge>
																			}
																		</div>

																		<span className='text-[10px] text-zinc-400 dark:text-zinc-300 font-medium'>
																			Limit: {c.used} / {c.limit} terpakai
																		</span>
																	</div>

																	{/* Referrer description */}
																	<div className='text-[10.5px] text-zinc-500 dark:text-zinc-300'>
																		Referrer:{" "}
																		<strong className='font-bold text-zinc-800 dark:text-zinc-100'>
																			{c.referrer}
																		</strong>
																	</div>

																	{/* Link Preview Share Panel (visually separate from promo discount details) */}
																	<div className='bg-zinc-50 dark:bg-zinc-905/30 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-2.5 flex flex-col gap-1.5 mt-1 font-sans'>
																		<span className='text-[8.5px] text-zinc-400 dark:text-zinc-400 uppercase tracking-wider block font-bold'>
																			Link Canonical Pendaftaran (Non-Discount Tracking URL)
																		</span>
																		<div className='flex items-center gap-2'>
																			<span className='text-[10px] font-mono text-zinc-650 dark:text-zinc-300 truncate flex-1 leading-none select-all'>
																				https://sakode.org/register?ref={c.code}
																			</span>
																			<button
																				onClick={() => handleCopyLink(c.code)}
																				className='p-1 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer'
																				title='Salin Link'>
																				{copiedCode === c.code ?
																					<Icons.Check className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450' />
																				:	<svg
																						xmlns='http://www.w3.org/2000/svg'
																						fill='none'
																						viewBox='0 0 24 24'
																						strokeWidth={2.5}
																						stroke='currentColor'
																						className='w-3.5 h-3.5'>
																						<path
																							strokeLinecap='round'
																							strokeLinejoin='round'
																							d='M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z'
																						/>
																					</svg>
																				}
																			</button>
																			<button
																				onClick={() => handleShareLink(c.code)}
																				className='p-1 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer'
																				title='Bagikan Link'>
																				<svg
																					xmlns='http://www.w3.org/2000/svg'
																					fill='none'
																					viewBox='0 0 24 24'
																					strokeWidth={2.5}
																					stroke='currentColor'
																					className='w-3.5 h-3.5'>
																					<path
																						strokeLinecap='round'
																						strokeLinejoin='round'
																						d='M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z'
																					/>
																				</svg>
																			</button>
																		</div>
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											</div>

											<div className={getSubElementClass("divider")} />

											{/* Section B: Attribution Conversion logs */}
											<div className='flex flex-col gap-3'>
												<h4 className='text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider'>
													Riwayat Konversi Siswa Teratribusi ({conversions.length})
												</h4>

												{conversions.length === 0 ?
													<div className='text-center py-6 px-4 bg-zinc-50 dark:bg-zinc-900/10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-400'>
														Belum ada pendaftaran siswa yang teratribusi ke kode program ini.
													</div>
												:	<div className='flex flex-col gap-2.5'>
														{conversions.map((conv) => (
															<div
																key={conv.id}
																className='p-3 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl flex flex-col gap-2'>
																<div className='flex justify-between items-start gap-2'>
																	<div>
																		<span className='font-bold text-xs text-zinc-800 dark:text-zinc-100 block'>
																			{conv.studentName}
																		</span>
																		<span className='text-[10px] text-zinc-500 dark:text-zinc-405 block mt-0.5'>
																			Email: {conv.email}
																		</span>
																	</div>

																	<div className='flex flex-col items-end gap-1.5 shrink-0'>
																		{conv.registrationStatus === "pending" ?
																			<UI.Badge
																				variant='warning'
																				accentColor='orange'
																				className='text-[8.5px]! py-0 px-1.5!'>
																				Review
																			</UI.Badge>
																		: conv.registrationStatus === "approved" ?
																			<UI.Badge
																				variant='success'
																				accentColor='green'
																				className='text-[8.5px]! py-0 px-1.5!'>
																				Disetujui
																			</UI.Badge>
																		:	<UI.Badge
																				variant='accent'
																				accentColor='red'
																				className='text-[8.5px]! py-0 px-1.5!'>
																				Ditolak
																			</UI.Badge>
																		}

																		<span className='text-[9px] text-zinc-400 font-medium'>
																			{conv.dateConverted.split(" ")[0]}{" "}
																			{conv.dateConverted.split(" ")[1]}
																		</span>
																	</div>
																</div>

																<div className='flex justify-between items-center border-t border-dashed border-zinc-200/60 dark:border-zinc-800/60 pt-2 text-[10.5px]'>
																	<span className='text-zinc-500 dark:text-zinc-300 font-medium'>
																		Atribusi Kode:{" "}
																		<strong className='font-mono text-zinc-800 dark:text-white'>
																			{conv.codeUsed}
																		</strong>
																	</span>

																	<button
																		onClick={() => {
																			setCorrectionForm({ newCode: conv.codeUsed });
																			setIsCorrectionOpen({ conversion: conv });
																		}}
																		className={`text-[9.5px] font-bold ${getTextClass(selectedColor)} hover:underline cursor-pointer flex items-center gap-1`}
																		title='Koreksi data pendaftaran jika salah isi kode'>
																		Koreksi Atribusi
																	</button>
																</div>
															</div>
														))}
													</div>
												}
											</div>
										</div>
									</UI.Card>
								</motion.div>

						}
					</AnimatePresence>
				</div>
			</div>

			{/* 4. MODAL MOCKS & SHELLS */}

			{/* 4.1 Create Referral Program Modal */}
			<AnimatePresence>
				{isCreateProgramOpen && (
					<div className='fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50'>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className='w-full max-w-md relative'>
							<UI.Card accentColor={selectedColor}>
								<form
									onSubmit={handleCreateProgram}
									className='flex flex-col gap-4 text-left'>
									<div className='flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3'>
										<h3 className='text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-200'>
											Tambah Program Referral Baru
										</h3>
										<button
											type='button'
											onClick={() => setIsCreateProgramOpen(false)}
											className={getCloseButtonClass()}
											title='Tutup'
											aria-label='Tutup'>
											<Icons.X className='w-4 h-4' />
										</button>
									</div>

									<div className='flex flex-col gap-3 text-xs'>
										<div className='flex flex-col gap-1'>
											<label className='font-bold text-zinc-700 dark:text-zinc-300'>
												Nama Kampanye Program
											</label>
											<UI.Input
												type='text'
												placeholder='contoh: Partnership Kampus Merdeka'
												value={newProgramForm.name}
												onChange={(e) =>
													setNewProgramForm((prev) => ({ ...prev, name: e.target.value }))
												}
												accentColor={selectedColor}
												required
												className='text-xs! py-2!'
											/>
										</div>

										<div className='flex flex-col gap-1'>
											<label className='font-bold text-zinc-700 dark:text-zinc-300'>
												Deskripsi Kampanye
											</label>
											<textarea
												placeholder='Tulis tujuan kampanye, partner target, dll...'
												value={newProgramForm.desc}
												onChange={(e) =>
													setNewProgramForm((prev) => ({ ...prev, desc: e.target.value }))
												}
												required
												className='w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-sakode-blue/30 focus:outline-hidden text-zinc-900 dark:text-white placeholder:text-zinc-400'
												rows={3}
											/>
										</div>

										<div className='flex flex-col gap-1'>
											<label className='font-bold text-zinc-700 dark:text-zinc-300'>
												Program Bootcamp Sasaran
											</label>
											<div className='relative'>
												<UI.Select
													value={newProgramForm.targetProgram}
													onChange={(e) =>
														setNewProgramForm((prev) => ({
															...prev,
															targetProgram: e.target.value,
														}))
													}
													accentColor={selectedColor}
													className='text-xs! py-2! pr-8! pl-3!'>
													<option value='Semua Program Bootcamp'>
														Semua Program Bootcamp
													</option>
													<option value='React & Next.js Professional'>
														React & Next.js Professional
													</option>
													<option value='Backend Dev Go/Docker'>
														Backend Dev Go/Docker
													</option>
													<option value='TypeScript & Data Structures'>
														TypeScript & Data Structures
													</option>
												</UI.Select>
												<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400 dark:text-zinc-500'>
													<svg
														className='fill-current h-3.5 w-3.5'
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 20 20'>
														<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
													</svg>
												</div>
											</div>
											<div className='grid grid-cols-2 gap-3 mt-1'>
												<div className='flex flex-col gap-1'>
													<label className='font-bold text-zinc-700 dark:text-zinc-300'>
														Tanggal Mulai Payout{" "}
													</label>
													<UI.Input
														type='number'
														min={1}
														max={31}
														value={newProgramForm.payoutStartDay}
														onChange={(e) =>
															setNewProgramForm((prev) => ({
																...prev,
																payoutStartDay: parseInt(e.target.value) || 25,
															}))
														}
														accentColor={selectedColor}
														required
														className='text-xs! py-2!'
													/>
												</div>
												<div className='flex flex-col gap-1'>
													<label className='font-bold text-zinc-700 dark:text-zinc-300'>
														Tanggal Selesai Payout{" "}
													</label>
													<UI.Input
														type='number'
														min={1}
														max={31}
														value={newProgramForm.payoutEndDay}
														onChange={(e) =>
															setNewProgramForm((prev) => ({
																...prev,
																payoutEndDay: parseInt(e.target.value) || 30,
															}))
														}
														accentColor={selectedColor}
														required
														className='text-xs! py-2!'
													/>
												</div>
											</div>
										</div>
									</div>

									<div className='flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4'>
										<UI.Button
											variant='secondary'
											accentColor={selectedColor}
											onClick={() => setIsCreateProgramOpen(false)}
											className='text-xs! py-2! font-semibold!'>
											Batal
										</UI.Button>
										<UI.Button
											type='submit'
											variant='primary'
											accentColor={selectedColor}
											className='text-xs! py-2! font-semibold! cursor-pointer'>
											Simpan Program
										</UI.Button>
									</div>
								</form>
							</UI.Card>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* 4.2 Generate Referral Code Modal */}
			<AnimatePresence>
				{isGenerateCodeOpen && (
					<div className='fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50'>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className='w-full max-w-md relative'>
							<UI.Card accentColor={selectedColor}>
								<form
									onSubmit={handleGenerateCode}
									className='flex flex-col gap-4 text-left'>
									<div className='flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3'>
										<h3 className='text-xs font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-200'>
											Tambah Kode Referral Baru
										</h3>
										<button
											type='button'
											onClick={() => setIsGenerateCodeOpen(false)}
											className={getCloseButtonClass()}
											title='Tutup'
											aria-label='Tutup'>
											<Icons.X className='w-4 h-4' />
										</button>
									</div>

									<div className='flex flex-col gap-3.5 text-xs'>
										<div className='flex flex-col gap-1'>
											<label className='font-bold text-zinc-700 dark:text-zinc-300'>
												Kode Rujukan (Alphanumeric, URL Safe)
											</label>
											<UI.Input
												type='text'
												placeholder='contoh: ALUMNIPANJUL'
												value={newCodeForm.code}
												onChange={(e) =>
													setNewCodeForm((prev) => ({ ...prev, code: e.target.value }))
												}
												accentColor={selectedColor}
												required
												className='text-xs! py-2! font-mono uppercase'
											/>
											<span className='text-[9px] text-zinc-400 font-medium block'>
												* Kode rujukan harus URL-safe (tidak mengandung spasi, karakter
												khusus, atau data PII).
											</span>
										</div>

										<div className='flex flex-col gap-1'>
											<label className='font-bold text-zinc-700 dark:text-zinc-300'>
												Nama Pemilik / Sumber Rujukan
											</label>
											<UI.Input
												type='text'
												placeholder='contoh: Ahmad Panjul (Alumni)'
												value={newCodeForm.referrer}
												onChange={(e) =>
													setNewCodeForm((prev) => ({ ...prev, referrer: e.target.value }))
												}
												accentColor={selectedColor}
												required
												className='text-xs! py-2!'
											/>
										</div>

										<div className='flex flex-col gap-2'>
											<label className='font-bold text-zinc-700 dark:text-zinc-300 block'>
												Batas Jumlah Penggunaan
											</label>
											<div className='flex items-center gap-4 mt-1'>
												<label className='flex items-center gap-1.5 cursor-pointer font-medium'>
													<input
														type='radio'
														name='limit'
														checked={newCodeForm.limit === "unlimited"}
														onChange={() =>
															setNewCodeForm((prev) => ({ ...prev, limit: "unlimited" }))
														}
														className='cursor-pointer'
													/>
													<span>Tanpa Batas (Unlimited)</span>
												</label>

												<label className='flex items-center gap-1.5 cursor-pointer font-medium'>
													<input
														type='radio'
														name='limit'
														checked={newCodeForm.limit === "value"}
														onChange={() =>
															setNewCodeForm((prev) => ({ ...prev, limit: "value" }))
														}
														className='cursor-pointer'
													/>
													<span>Batas Maksimum</span>
												</label>
											</div>

											{newCodeForm.limit === "value" && (
												<div className='mt-2.5 max-w-30'>
													<UI.Input
														type='number'
														min={1}
														value={newCodeForm.limitValue}
														onChange={(e) =>
															setNewCodeForm((prev) => ({
																...prev,
																limitValue: parseInt(e.target.value) || 1,
															}))
														}
														accentColor={selectedColor}
														className='text-xs! py-1.5!'
													/>
												</div>
											)}
										</div>
									</div>

									<div className='flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4'>
										<UI.Button
											variant='secondary'
											accentColor={selectedColor}
											onClick={() => setIsGenerateCodeOpen(false)}
											className='text-xs! py-2! font-semibold!'>
											Batal
										</UI.Button>
										<UI.Button
											type='submit'
											variant='primary'
											accentColor={selectedColor}
											className='text-xs! py-2! font-semibold! cursor-pointer'>
											Daftarkan Kode
										</UI.Button>
									</div>
								</form>
							</UI.Card>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* 4.3 Correction Attribution Modal */}
			<AnimatePresence>
				{isCorrectionOpen && (
					<div className='fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50'>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className='w-full max-w-md relative'>
							<UI.Card accentColor={selectedColor}>
								<form
									onSubmit={handleCorrection}
									className='flex flex-col gap-4 text-left'>
									<div className='flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3'>
										<h3 className='text-xs font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-200'>
											Koreksi Atribusi Rujukan Siswa
										</h3>
										<button
											type='button'
											onClick={() => setIsCorrectionOpen(null)}
											className={getCloseButtonClass()}
											title='Tutup'
											aria-label='Tutup'>
											<Icons.X className='w-4 h-4' />
										</button>
									</div>

									<div className='flex flex-col gap-3 text-xs leading-normal'>
										<p className='text-zinc-600 dark:text-zinc-300'>
											Koreksi rujukan manual dilakukan jika pendaftar salah mengisi kode
											referral atau lupa memasukkan parameter link saat mendaftar:
										</p>

										<div className={getSubElementClass("inner-card")}>
											<span className='font-bold text-zinc-800 dark:text-zinc-100 block'>
												Siswa: {isCorrectionOpen.conversion.studentName}
											</span>
											<span className='text-[10px] text-zinc-500 block mt-0.5'>
												Email: {isCorrectionOpen.conversion.email}
											</span>
											<span className='text-[10px] text-zinc-500 block mt-0.5'>
												Kode Rujukan Saat Ini:{" "}
												<strong className='font-mono text-zinc-800 dark:text-zinc-200'>
													{isCorrectionOpen.conversion.codeUsed}
												</strong>
											</span>
										</div>

										<div className='flex flex-col gap-1.5 mt-2'>
											<label className='font-bold text-zinc-700 dark:text-zinc-300'>
												Pilih Kode Rujukan Pengganti
											</label>
											<div className='relative'>
												<UI.Select
													value={correctionForm.newCode}
													onChange={(e) => setCorrectionForm({ newCode: e.target.value })}
													accentColor={selectedColor}
													className='text-xs! py-2! pr-8! pl-3!'>
													<option value=''>-- Pilih Kode Referral Aktif --</option>
													{codes
														.filter((c) => c.status === "active")
														.map((c) => (
															<option key={c.code} value={c.code}>
																{c.code} (Referrer: {c.referrer})
															</option>
														))}
												</UI.Select>
												<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400 dark:text-zinc-500'>
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

									<div className='flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4'>
										<UI.Button
											variant='secondary'
											accentColor={selectedColor}
											onClick={() => setIsCorrectionOpen(null)}
											className='text-xs! py-2! font-semibold!'>
											Batal
										</UI.Button>
										<UI.Button
											type='submit'
											variant='primary'
											accentColor={selectedColor}
											disabled={!correctionForm.newCode}
											className='text-xs! py-2! font-semibold! cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'>
											Simpan Koreksi
										</UI.Button>
									</div>
								</form>
							</UI.Card>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* 4.4 Status Change Program Confirmation Modal */}
			<AnimatePresence>
				{isStatusConfirmOpen && (
					<div className='fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50'>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className='w-full max-w-md relative'>
							<UI.Card
								accentColor={isStatusConfirmOpen.type === "activate" ? "green" : "red"}>
								<div className='flex flex-col gap-4 text-left'>
									<div className='flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3'>
										<h3 className='text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-200'>
											Konfirmasi Perubahan Status
										</h3>
										<button
											onClick={() => setIsStatusConfirmOpen(null)}
											className={getCloseButtonClass()}
											title='Tutup'
											aria-label='Tutup'>
											<Icons.X className='w-4 h-4' />
										</button>
									</div>

									<div className='flex flex-col gap-3 py-1 text-xs'>
										<p className='text-zinc-700 dark:text-zinc-200 font-medium leading-relaxed'>
											Apakah Anda yakin ingin{" "}
											{isStatusConfirmOpen.type === "activate" ?
												"mengaktifkan kembali"
											:	"menonaktifkan sementara"}{" "}
											program referral:
										</p>
										<div className={getSubElementClass("inner-card")}>
											<span className='font-bold text-zinc-850 dark:text-zinc-100 block'>
												{isStatusConfirmOpen.program.name}
											</span>
											<span className='text-[10px] text-zinc-450 dark:text-zinc-400 font-medium mt-0.5 block'>
												{isStatusConfirmOpen.program.targetProgram}
											</span>
										</div>
										{isStatusConfirmOpen.type === "deactivate" ?
											<p className='text-[10px] text-rose-500/80 font-normal leading-normal italic'>
												* Menonaktifkan program akan menangguhkan seluruh tracking atribusi
												rujukan dari kode terkait untuk sementara.
											</p>
										:	<p className='text-[10px] text-emerald-600/80 font-normal leading-normal italic'>
												* Mengaktifkan kembali program akan langsung mengaktifkan tracking
												atribusi rujukan untuk seluruh kode inventori aktif.
											</p>
										}
									</div>

									<div className='flex gap-2.5 justify-end mt-2 border-t border-zinc-150 dark:border-zinc-800 pt-4'>
										<UI.Button
											variant='secondary'
											accentColor={selectedColor}
											onClick={() => setIsStatusConfirmOpen(null)}
											className='text-xs! py-2! font-semibold!'>
											Batal
										</UI.Button>
										<UI.Button
											variant='primary'
											accentColor={
												isStatusConfirmOpen.type === "activate" ? "green" : "red"
											}
											onClick={toggleProgramStatus}
											className='text-xs! py-2! font-semibold! cursor-pointer'>
											{isStatusConfirmOpen.type === "activate" ?
												"Aktifkan"
											:	"Nonaktifkan"}
										</UI.Button>
									</div>
								</div>
							</UI.Card>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* 5. Toast Feedback Notification */}
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
										<Icons.Check className='w-4 h-4 text-emerald-600 dark:text-emerald-455' />
									:	<Icons.AlertCircle className='w-4 h-4 text-rose-600 dark:text-rose-400' />
									}
								</div>
								<div className='flex-1 font-semibold text-zinc-850 dark:text-zinc-200'>
									{toastMessage.text}
								</div>
								<button
									onClick={() => setToastMessage(null)}
									className='shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer'
									title='Tutup Notifikasi'
									aria-label='Tutup Notifikasi'>
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
