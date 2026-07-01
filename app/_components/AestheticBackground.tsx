"use client";

import React from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";

interface AestheticBackgroundProps {
  mode: "landing" | "auth" | "dashboard";
}

export function AestheticBackground({ mode }: AestheticBackgroundProps) {
  const { selectedStyle } = useUIStyle();
  const isGlassBg = selectedStyle === "glassmorphism" || selectedStyle === "liquid-glass";

  // Hidden SVG filter for liquid refraction
  const refractionFilter = (
    <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true" style={{ visibility: "hidden" }}>
      <defs>
        <filter id="liquid-refraction">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );

  if (mode === "dashboard") {
    if (!isGlassBg) return refractionFilter;
    return (
      <>
        {refractionFilter}
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 rounded-full bg-sakode-pink/15 dark:bg-sakode-pink/20 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[10%] w-96 h-96 rounded-full bg-sakode-orange/15 dark:bg-sakode-orange/15 blur-3xl pointer-events-none z-0" />
        <div className="absolute top-[40%] left-[-10%] w-80 h-80 rounded-full bg-sakode-cyan/15 dark:bg-sakode-cyan/15 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[25%] left-[30%] w-80 h-80 rounded-full bg-sakode-yellow/10 dark:bg-sakode-yellow/10 blur-3xl pointer-events-none z-0" />
      </>
    );
  }

  // mode === "landing" or "auth"
  return (
    <>
      {refractionFilter}
      {/* Dynamic theme-adaptive background gradient bubbles */}
      <div 
        className="absolute top-[-10%] left-[10%] sm:left-[20%] w-[24rem] h-[24rem] rounded-full blur-[90px] pointer-events-none z-0 transition-all duration-1000" 
        style={{ backgroundColor: "var(--sakode-primary-color)", opacity: isGlassBg ? 0.20 : 0.12 }} 
      />
      <div 
        className="absolute bottom-[-10%] right-[5%] sm:right-[10%] w-[24rem] h-[24rem] rounded-full blur-[90px] pointer-events-none z-0 transition-all duration-1000" 
        style={{ backgroundColor: "var(--sakode-secondary-color)", opacity: isGlassBg ? 0.18 : 0.10 }} 
      />
      <div 
        className="absolute top-[35%] left-[-10%] w-[20rem] h-[20rem] rounded-full blur-[80px] pointer-events-none z-0 transition-all duration-1000" 
        style={{ backgroundColor: "var(--sakode-accent-color)", opacity: isGlassBg ? 0.15 : 0.08 }} 
      />
      <div 
        className="absolute bottom-[20%] left-[25%] w-[20rem] h-[20rem] rounded-full blur-[80px] pointer-events-none z-0 transition-all duration-1000" 
        style={{ backgroundColor: "var(--sakode-primary-color)", opacity: isGlassBg ? 0.12 : 0.06 }} 
      />
    </>
  );
}
