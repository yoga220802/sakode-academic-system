"use client";

import React, { useState, useEffect } from "react";
import { LockScreen } from "./LockScreen";

export function DashboardLockSystem() {
  const [isLocked, setIsLocked] = useState(false);
  const [lockChecked, setLockChecked] = useState(false);
  const [trialTimeLeft, setTrialTimeLeft] = useState<number | null>(null);
  const [wasTrialExhausted, setWasTrialExhausted] = useState(false);

  useEffect(() => {
    // Initialize lock state from localStorage
    const savedLock = localStorage.getItem("sakode_dashboard_locked");
    const shouldBeLocked = savedLock === null ? true : savedLock === "true";
    
    if (savedLock === null) {
      localStorage.setItem("sakode_dashboard_locked", "true");
    }

    const timer = setTimeout(() => {
      setIsLocked(shouldBeLocked);
      setLockChecked(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Trial Countdown timer logic
  useEffect(() => {
    if (trialTimeLeft === null) return;

    if (trialTimeLeft <= 0) {
      const timer = setTimeout(() => {
        setIsLocked(true);
        localStorage.setItem("sakode_dashboard_locked", "true");
        setWasTrialExhausted(true);
        setTrialTimeLeft(null);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setTrialTimeLeft(trialTimeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [trialTimeLeft]);

  const handleStartTrial = () => {
    setTrialTimeLeft(60);
    setWasTrialExhausted(false);
    setIsLocked(false);
    localStorage.setItem("sakode_dashboard_locked", "false");
  };

  const handleUnlock = () => {
    setIsLocked(false);
    localStorage.setItem("sakode_dashboard_locked", "false");
    setTrialTimeLeft(null);
    setWasTrialExhausted(false);
  };

  const handleRelock = () => {
    setIsLocked(true);
    localStorage.setItem("sakode_dashboard_locked", "true");
    setTrialTimeLeft(null);
    setWasTrialExhausted(false);
  };

  if (!lockChecked) return null;

  return (
    <>
      {/* Trial Countdown floating pill */}
      {trialTimeLeft !== null && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998] bg-zinc-900/95 dark:bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-orange-500/30 dark:border-orange-400/30 shadow-lg flex items-center gap-3 text-xs font-black text-white dark:text-zinc-950">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>Uji Coba Premium: <span className="text-orange-500 font-extrabold">{trialTimeLeft}s</span> tersisa</span>
          </div>
          <div className="w-16 h-1.5 bg-zinc-700 dark:bg-zinc-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(trialTimeLeft / 60) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Lock Screen for Premium Payment Experiment */}
      {isLocked && (
        <LockScreen
          onUnlock={handleUnlock}
          onStartTrial={handleStartTrial}
          wasTrialExhausted={wasTrialExhausted}
        />
      )}

      {/* Floating Demo Reset Button (Visible when unlocked to let user lock it again) */}
      {!isLocked && trialTimeLeft === null && (
        <button
          onClick={handleRelock}
          className="fixed bottom-6 right-6 z-40 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-105 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-3.5 py-2.5 rounded-full text-[11px] font-black shadow-lg hover:shadow-xl backdrop-blur-md active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5 border border-white/10 dark:border-zinc-200/25"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Kunci Dasbor (Demo)</span>
        </button>
      )}
    </>
  );
}
