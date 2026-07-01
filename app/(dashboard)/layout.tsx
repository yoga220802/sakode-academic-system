"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";
import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";
import { AestheticBackground } from "../_components/AestheticBackground";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLockSystem } from "./_components/DashboardLockSystem";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const router = useRouter();

  // Desktop sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Mobile drawer open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <div className="h-screen w-full flex bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
      
      <AestheticBackground mode="dashboard" />

      {/* Premium Dashboard Lock & Trial Countdown System */}
      <DashboardLockSystem />

      {/* Mobile Drawer (Overlay backdrop & sliding panel) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <React.Fragment>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden h-full shadow-2xl"
            >
              <Sidebar
                role={session.role}
                isCollapsed={false}
                setIsCollapsed={() => {}}
                isMobile={true}
                onCloseMobile={() => setMobileMenuOpen(false)}
              />
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Panel */}
      <div className="hidden md:flex relative z-10 h-full shrink-0">
        <Sidebar
          role={session.role}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Header Navigation */}
        <Header 
          session={session} 
          onMenuClick={() => setMobileMenuOpen(true)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dynamic Route Content Panel */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 pb-20 md:pb-8">
          <div className="max-w-7xl xl:max-w-screen-2xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
