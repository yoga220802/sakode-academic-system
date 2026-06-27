"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";
import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";
import { useUIStyle } from "@/app/_components/UIStyleContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const router = useRouter();
  const { selectedStyle } = useUIStyle();

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-sakode-blue border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-zinc-500">Mengarahkan ke halaman login...</span>
        </div>
      </div>
    );
  }

  const isGlassStyle = selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass";

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
      
      {/* Dynamic Background Overlays for Glass/Liquid style */}
      {isGlassStyle && (
        <>
          <div className="absolute top-[10%] left-[10%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.08)_0%,transparent_70%)] blur-[40px] pointer-events-none z-0" />
          <div className="absolute bottom-[10%] right-[10%] h-90 w-90 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.07)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0" />
        </>
      )}

      {/* Sidebar Panel */}
      <div className="relative z-10">
        <Sidebar role={session.role} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Header Navigation */}
        <Header session={session} />

        {/* Dynamic Route Content Panel */}
        <main className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
