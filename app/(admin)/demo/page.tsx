"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/app/_components/PageHeader";
import { StatCard } from "@/app/_components/StatCard";
import { FilterToolbar } from "@/app/_components/FilterToolbar";
import { DataStateBoundary } from "@/app/_components/DataStateBoundary";
import { ResponsiveList } from "@/app/_components/ResponsiveList";
import { Pagination } from "@/app/_components/Pagination";
import { ReadOnlyNotice } from "@/app/_components/ReadOnlyNotice";
import { StudentMockService } from "@/app/_services/student-mock";
import { StudentViewModel } from "@/app/_types/student";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";

export default function DemoFixturePage() {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  // Boundary simulation states
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Data states
  const [students, setStudents] = useState<StudentViewModel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      // Defer state updates to next tick to avoid synchronous setState inside effect body
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!isMounted) return;
      setIsLoading(true);
      setIsError(false);
      setIsEmpty(false);
      try {
        const data = await StudentMockService.getStudents(600);
        if (isMounted) {
          setStudents(data);
        }
      } catch {
        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const statusOptions = [
    { label: "Semua Status", value: "all" },
    { label: "Aktif", value: "aktif" },
    { label: "Pending", value: "pending" },
    { label: "Lulus", value: "lulus" },
    { label: "Batal", value: "batal" },
  ];

  // Helper for badge color mapping
  const getStatusBadgeType = (status: string): "accent" | "success" | "warning" | "default" => {
    switch (status) {
      case "aktif": return "success";
      case "pending": return "warning";
      case "lulus": return "accent";
      case "batal": return "default";
      default: return "default";
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl xl:max-w-screen-2xl mx-auto flex flex-col gap-6 w-full text-left">
      {/* 1. Read-only scope notice */}
      <ReadOnlyNotice organizationName="Sakode Academy Developer Sandbox" />

      {/* 2. Page Header with Control Actions for Simulator */}
      <PageHeader
        title="Demo Komponen Fondasi (FE-SLICE-002)"
        description="Demo halaman yang menggunakan reusable composites untuk pengujian state, pagination, dan responsivitas list."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <UI.Button
              variant={isLoading ? "primary" : "secondary"}
              accentColor={selectedColor}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1500);
              }}
              className="text-[10px] px-2.5 py-1 cursor-pointer"
            >
              Simulasi Load
            </UI.Button>
            <UI.Button
              variant={isError ? "primary" : "secondary"}
              accentColor={selectedColor}
              onClick={() => setIsError(!isError)}
              className="text-[10px] px-2.5 py-1 cursor-pointer"
            >
              {isError ? "Clear Error" : "Simulasi Error"}
            </UI.Button>
            <UI.Button
              variant={isEmpty ? "primary" : "secondary"}
              accentColor={selectedColor}
              onClick={() => setIsEmpty(!isEmpty)}
              className="text-[10px] px-2.5 py-1 cursor-pointer"
            >
              {isEmpty ? "Clear Empty" : "Simulasi Empty"}
            </UI.Button>
          </div>
        }
      />

      {/* 3. StatCards Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <StatCard label="Total Siswa" value={`${students.length} Orang`} change="+2 minggu ini" trendUp={true} />
        <StatCard label="Filter Pencarian" value={`${filteredStudents.length} Hasil`} change="Berdasarkan pencarian & status" trendUp={true} />
        <StatCard label="Plotting Pending" value="1 Siswa" change="Butuh alokasi mentor" trendUp={false} accentColor="orange" />
        <StatCard label="Lulus Review" value="2 Siswa" change="Sertifikasi selesai" trendUp={true} accentColor="green" />
      </div>

      {/* 4. Filter Toolbar */}
      <FilterToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        statusOptions={statusOptions}
        placeholder="Cari nama siswa atau program studi..."
      />

      {/* 5. Data State Boundary Wrapper */}
      <DataStateBoundary
        isLoading={isLoading}
        isError={isError}
        isEmpty={isEmpty || filteredStudents.length === 0}
        emptyTitle="Pendaftaran Tidak Ditemukan"
        emptyDescription="Silakan ubah query pencarian atau status filter Anda."
        loadingVariant="list"
      >
        {/* 6. Responsive Data List */}
        <ResponsiveList
          items={displayStudents}
          headers={["ID", "Nama Siswa", "Program Studi", "Tanggal Daftar", "Kode Referral", "Status"]}
          renderRow={(student) => (
            <tr key={student.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 transition-colors">
              <td className="p-4 font-bold text-zinc-500">{student.id}</td>
              <td className="p-4 font-black text-zinc-850 dark:text-zinc-100">{student.name}</td>
              <td className="p-4 font-bold text-zinc-600 dark:text-zinc-350">{student.program}</td>
              <td className="p-4 text-zinc-500 font-semibold">{student.registrationDate}</td>
              <td className="p-4">
                {student.referralCode ? (
                  <UI.Badge variant="default">
                    {student.referralCode}
                  </UI.Badge>
                ) : (
                  <span className="text-[9px] font-bold text-zinc-400">None</span>
                )}
              </td>
              <td className="p-4">
                <UI.Badge variant={getStatusBadgeType(student.status)}>
                  {student.status.toUpperCase()}
                </UI.Badge>
              </td>
            </tr>
          )}
          renderCard={(student, idx) => (
            <UI.Card key={student.id} accentColor={idx % 2 === 0 ? "blue" : "orange"}>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-400">ID: #{student.id}</span>
                  <UI.Badge variant={getStatusBadgeType(student.status)}>
                    {student.status.toUpperCase()}
                  </UI.Badge>
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-100">{student.name}</h4>
                  <p className="text-xs text-zinc-500 font-bold mt-0.5">{student.program}</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-450 dark:text-zinc-500 border-t border-zinc-200/35 dark:border-zinc-800/35 pt-2 mt-1">
                  <span>Daftar: {student.registrationDate}</span>
                  <span>Ref: <span className="font-extrabold">{student.referralCode || "None"}</span></span>
                </div>
              </div>
            </UI.Card>
          )}
        />

        {/* 7. Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </DataStateBoundary>
    </div>
  );
}
