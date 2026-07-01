"use client";

import React from "react";
import Link from "next/link";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";

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
        <UI.Card accentColor="blue">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Siswa Antrean Plotting
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              5 Siswa
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              Wajib segera dialokasikan mentor
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor="orange">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Mentor Aktif
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              12 Mentor
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              Semua mentor aktif mengajar
            </span>
          </div>
        </UI.Card>

        <UI.Card accentColor="green">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Rasio Alokasi Mentor
            </span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">
              92.8%
            </span>
            <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 mt-1.5">
              Target bulanan: 95%
            </span>
          </div>
        </UI.Card>
      </div>

      {/* Student plotting queue & Mentor workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plotting Queue list */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <UI.Heading className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Antrean Siswa Belum Di-plot
            </UI.Heading>
            <Link href="/dashboard/plotting">
              <span className="text-[10px] font-bold text-sakode-blue hover:underline cursor-pointer">
                Lihat Semua Antrean
              </span>
            </Link>
          </div>
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
