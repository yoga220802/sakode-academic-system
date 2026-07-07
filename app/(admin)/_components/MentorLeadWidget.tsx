"use client";

import React from "react";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { PaletteColorKey, getBgClass, getTextClass, getBgOpacity10Class } from "@/UI/shared/color-utils";

export function MentorLeadWidget() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const studentQueue = [
    { name: "Doni Pratama", course: "React & Next.js Professional", date: "Daftar: 2 jam lalu" },
    { name: "Siti Rahma", course: "TypeScript Advanced Coding", date: "Daftar: 5 jam lalu" },
    { name: "Galih Prasetyo", course: "React & Next.js Professional", date: "Daftar: 1 hari lalu" }
  ];

  const mentorStatus = [
    { name: "Akbar Mentor React", role: "Mentor React", activeStudents: 8, status: "Tersedia", colorClass: "text-sakode-green bg-sakode-green/10" },
    { name: "Yogi Mentor Lead", role: "Mentor TS / Lead", activeStudents: 12, status: "Sibuk (Batas)", colorClass: "text-sakode-orange bg-sakode-orange/10" }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <div className="w-fit">
              <UI.Badge variant="accent" accentColor={selectedColor}>
                ↑ Alokasikan segera
              </UI.Badge>
            </div>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
              5
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
              Siswa Antrean Plotting
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <div className="w-fit">
              <UI.Badge variant="accent" accentColor={selectedColor}>
                ↑ Aktif mengajar
              </UI.Badge>
            </div>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
              12
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
              Total Mentor Aktif
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor={selectedColor}>
          <div className="p-4 flex flex-col gap-1 text-left">
            <div className="w-fit">
              <UI.Badge variant="accent" accentColor={selectedColor}>
                ↑ Target 95%
              </UI.Badge>
            </div>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-2 leading-none">
              92.8%
            </span>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
              Rasio Alokasi Mentor
            </span>
          </div>
        </UI.Card>
      </div>

      {/* Student plotting queue & Mentor workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plotting Queue list */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Antrean Siswa Belum Di-plot
          </UI.Heading>
          {studentQueue.map((student, idx) => (
            <UI.Card key={idx} accentColor="orange">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-150 leading-none">
                    {student.name}
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 block mt-1.5">
                    Kelas: {student.course}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[9px] text-zinc-450 font-semibold">{student.date}</span>
                  <Link href="/dashboard/plotting">
                    <UI.Button variant="primary" accentColor={selectedColor} className="text-[8px]! py-1! px-2.5! h-auto! font-black! cursor-pointer">
                      Alokasikan
                    </UI.Button>
                  </Link>
                </div>
              </div>
            </UI.Card>
          ))}
          <Link href="/dashboard/plotting" className="w-fit">
            <span className={`text-[10px] font-black ${getTextClass(selectedColor)} hover:underline cursor-pointer block mt-1`}>
              Lihat Semua Antrean →
            </span>
          </Link>
        </div>

        {/* Mentor Workload and Availability */}
        <div className="flex flex-col gap-3">
          <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Kapasitas & Status Mengajar Mentor
          </UI.Heading>
          {mentorStatus.map((mentor, idx) => (
            <UI.Card key={idx} accentColor="blue">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-100 leading-none">
                    {mentor.name}
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 block mt-1.5">
                    Spesialisasi: {mentor.role}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${mentor.colorClass}`}>
                    {mentor.status}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-bold">
                    Aktif: {mentor.activeStudents} Siswa
                  </span>
                </div>
              </div>
            </UI.Card>
          ))}
        </div>
      </div>
    </div>
  );
}
