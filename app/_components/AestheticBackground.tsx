"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";

interface AestheticBackgroundProps {
  mode: "landing" | "auth" | "dashboard";
}

export function AestheticBackground({ mode }: AestheticBackgroundProps) {
  const { selectedStyle } = useUIStyle();
  const isGlassBg = selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass";

  if (mode === "dashboard") {
    if (!isGlassBg) return null;
    return (
      <>
        <div className="absolute top-[10%] left-[10%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.08)_0%,transparent_70%)] blur-[40px] pointer-events-none z-0" />
        <div className="absolute bottom-[10%] right-[10%] h-90 w-90 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.07)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0" />
      </>
    );
  }

  // mode === "landing" or "auth"
  if (isGlassBg) {
    return (
      <>
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 rounded-full bg-sakode-pink/20 dark:bg-sakode-pink/25 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[10%] w-96 h-96 rounded-full bg-sakode-orange/20 dark:bg-sakode-orange/20 blur-3xl pointer-events-none z-0" />
        <div className="absolute top-[40%] left-[-10%] w-80 h-80 rounded-full bg-sakode-cyan/20 dark:bg-sakode-cyan/20 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[25%] left-[30%] w-80 h-80 rounded-full bg-sakode-yellow/15 dark:bg-sakode-yellow/15 blur-3xl pointer-events-none z-0" />
      </>
    );
  }

  // Non-glass backgrounds (standard radial gradients overlay)
  return (
    <>
      <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] h-150 w-[90%] sm:w-200 rounded-full bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.06)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(84,165,228,0.12)_0%,transparent_65%)] blur-[60px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,64,159,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,64,159,0.08)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[-10%] h-100 w-100 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,150,112,0.06)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0" />
    </>
  );
}
