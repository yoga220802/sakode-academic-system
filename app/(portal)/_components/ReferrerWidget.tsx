"use client";

import React, { useState } from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { getBgClass, getTextClass } from "@/UI/shared/color-utils";

export function ReferrerWidget() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Mock Referrer Account Data
  const referrerProfile = {
    code: "REF-YOGA2026",
    promoChannel: "Media Sosial (LinkedIn & Twitter)",
    bankName: "BCA",
    accountNumber: "8012345678",
    accountHolder: "Rudi Referrer",
    totalClicks: 248,
    conversionRate: "12.5%",
    pendingCommission: 750000,
    paidCommission: 1500000,
  };

  const referralLinks = [
    {
      program: "React & Next.js Professional",
      slug: "react-nextjs-professional",
      url: "https://academy.sakode.org/register?program=react-nextjs-professional&ref=REF-YOGA2026",
      commission: "Rp 250.000 / siswa"
    },
    {
      program: "TypeScript & Data Structures",
      slug: "typescript-data-structures",
      url: "https://academy.sakode.org/register?program=typescript-data-structures&ref=REF-YOGA2026",
      commission: "Rp 200.000 / siswa"
    }
  ];

  const conversions = [
    { name: "Dzulkifli Putra", program: "React & Next.js Professional", date: "9 Juli 2026", status: "Terverifikasi", amount: 250000, color: "green" },
    { name: "Endah Lestari", program: "TypeScript & Data Structures", date: "8 Juli 2026", status: "Terverifikasi", amount: 200000, color: "green" },
    { name: "Rian Hidayat", program: "React & Next.js Professional", date: "7 Juli 2026", status: "Tertunda (Review)", amount: 250000, color: "orange" }
  ];

  const payouts = [
    { id: "PO-104", date: "05 Juli 2026", amount: 1000000, bank: "BCA", status: "Selesai", color: "green" },
    { id: "PO-092", date: "01 Juni 2026", amount: 500000, bank: "BCA", status: "Selesai", color: "green" }
  ];

  const handleCopyLink = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // UI styling helper for nested cards
  const getSubElementClass = (type: "inner-card") => {
    switch (selectedStyle) {
      case "neobrutalism":
        return "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none";
      case "claymorphism":
        return "bg-slate-50 dark:bg-zinc-900 border border-slate-200/20 dark:border-zinc-850/20 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.3),_1px_2px_4px_rgba(0,0,0,0.05)] rounded-2xl";
      case "glassmorphism":
      case "liquid-glass":
        return "bg-white/10 dark:bg-zinc-950/20 border border-white/10 backdrop-blur-md rounded-2xl shadow-xs";
      case "minimalism":
        return "bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 rounded-lg";
      case "bento-grid":
      case "sakode-modern":
      default:
        return "bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-850/50 rounded-2xl shadow-3xs";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left pb-12">
      
      {/* 1. Header & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 leading-none">
              {referrerProfile.totalClicks}
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5 block">
              Total Klik Tautan
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 leading-none">
              {referrerProfile.conversionRate}
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5 block">
              Rasio Konversi
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <span className="text-2xl font-black text-sakode-orange leading-none">
              Rp {referrerProfile.pendingCommission.toLocaleString("id-ID")}
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-2 block">
              Komisi Tertunda (Review)
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <span className="text-2xl font-black text-sakode-green leading-none">
              Rp {referrerProfile.paidCommission.toLocaleString("id-ID")}
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-2 block">
              Komisi Telah Dicairkan
            </span>
          </div>
        </UI.Card>
      </div>

      {/* 2. Referral Links Section */}
      <div className="flex flex-col gap-3">
        <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          Tautan Rujukan Kanonis Anda
        </UI.Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {referralLinks.map((link, idx) => (
            <div key={idx} className={`${getSubElementClass("inner-card")} p-5 flex flex-col gap-3`}>
              <div>
                <span className="text-[8.5px] uppercase font-black tracking-widest text-zinc-400 block mb-0.5">
                  Bootcamp Program
                </span>
                <h4 className="text-sm font-black text-zinc-800 dark:text-white leading-tight">
                  {link.program}
                </h4>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                <span>Komisi: <strong className="text-sakode-blue">{link.commission}</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-850/80 rounded-xl">
                <span className="text-[9.5px] text-zinc-450 dark:text-zinc-500 font-semibold truncate flex-1">
                  {link.url}
                </span>
                <UI.Button
                  variant="secondary"
                  accentColor={selectedColor}
                  className="text-[9px]! py-1! px-2.5! h-auto! font-black! cursor-pointer shrink-0"
                  onClick={() => handleCopyLink(link.url, idx)}
                >
                  {copiedIndex === idx ? "Salin!" : "Salin Link"}
                </UI.Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Conversion logs & Payout History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Logs */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Riwayat Atribusi Pendaftaran Siswa
          </UI.Heading>
          <div className="flex flex-col gap-3">
            {conversions.map((conv, idx) => (
              <div key={idx} className={`${getSubElementClass("inner-card")} p-4 flex justify-between items-center`}>
                <div>
                  <h4 className="text-xs font-black text-zinc-850 dark:text-white leading-none">
                    {conv.name}
                  </h4>
                  <span className="text-[9.5px] font-bold text-zinc-400 dark:text-zinc-500 block mt-1.5">
                    {conv.program}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md ${
                    conv.status === "Terverifikasi"
                      ? "text-sakode-green bg-sakode-green/10 border border-sakode-green/20"
                      : "text-sakode-orange bg-sakode-orange/10 border border-sakode-orange/20"
                  }`}>
                    {conv.status}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-black">
                    +Rp {conv.amount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History & Payout Info */}
        <div className="flex flex-col gap-4">
          {/* Payout Channel Info */}
          <div className="flex flex-col gap-3">
            <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Rekening Pencairan Dana
            </UI.Heading>
            <div className={`${getSubElementClass("inner-card")} p-4.5 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sakode-blue/10 flex items-center justify-center font-black text-sakode-blue text-sm">
                  {referrerProfile.bankName}
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-800 dark:text-white leading-none">
                    {referrerProfile.accountHolder}
                  </h4>
                  <span className="text-[9.5px] font-bold text-zinc-400 mt-1 block">
                    No Rek: {referrerProfile.accountNumber}
                  </span>
                </div>
              </div>
              <UI.Badge variant="default" className="text-[9px]!">
                Aktif
              </UI.Badge>
            </div>
          </div>

          {/* Payouts Roster */}
          <div className="flex flex-col gap-3">
            <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Pencairan Komisi Terakhir
            </UI.Heading>
            <div className="flex flex-col gap-3">
              {payouts.map((po, idx) => (
                <div key={idx} className={`${getSubElementClass("inner-card")} p-4 flex justify-between items-center`}>
                  <div>
                    <h4 className="text-xs font-black text-zinc-800 dark:text-white leading-none">
                      Pencairan {po.id}
                    </h4>
                    <span className="text-[9.5px] font-bold text-zinc-400 dark:text-zinc-550 block mt-1.5">
                      Tanggal: {po.date}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] text-zinc-750 dark:text-zinc-200 font-black">
                      Rp {po.amount.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[8px] font-black uppercase text-sakode-green">
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
