"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PaletteColorKey } from "@/UI/shared/color-utils";

interface UIStyleContextProps {
  selectedStyle: string;
  setSelectedStyle: (s: string) => void;
  selectedColor: PaletteColorKey;
  setSelectedColor: (c: PaletteColorKey) => void;
  primaryColorHex: string;
  setPrimaryColorHex: (hex: string) => void;
  secondaryColorHex: string;
  setSecondaryColorHex: (hex: string) => void;
  accentColorHex: string;
  setAccentColorHex: (hex: string) => void;
}

const UIStyleContext = createContext<UIStyleContextProps | undefined>(undefined);

export const UIStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedStyle, setSelectedStyle] = useState("sakode-modern");
  const [selectedColor, setSelectedColor] = useState<PaletteColorKey>("cyan");
  
  // Custom colors (Initial defaults match Cyan, Orange, Purple)
  const [primaryColorHex, setPrimaryColorHex] = useState("#71CFFE");
  const [secondaryColorHex, setSecondaryColorHex] = useState("#FEA071");
  const [accentColorHex, setAccentColorHex] = useState("#BC71FE");

  // Synchronize CSS custom properties with selected colors
  useEffect(() => {
    if (typeof window !== "undefined" && window.document) {
      document.documentElement.style.setProperty("--sakode-primary-color", primaryColorHex);
    }
  }, [primaryColorHex]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.document) {
      document.documentElement.style.setProperty("--sakode-secondary-color", secondaryColorHex);
    }
  }, [secondaryColorHex]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.document) {
      document.documentElement.style.setProperty("--sakode-accent-color", accentColorHex);
    }
  }, [accentColorHex]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.document) {
      const htmlEl = document.documentElement;
      const styleClasses = [
        "style-neobrutalism",
        "style-claymorphism",
        "style-glassmorphism",
        "style-liquid-glass",
        "style-minimalism",
        "style-bento-grid",
        "style-sakode-modern"
      ];
      htmlEl.classList.forEach((cls) => {
        if (styleClasses.includes(cls)) {
          htmlEl.classList.remove(cls);
        }
      });
      htmlEl.classList.add(`style-${selectedStyle}`);
    }
  }, [selectedStyle]);

  return (
    <UIStyleContext.Provider value={{
      selectedStyle,
      setSelectedStyle,
      selectedColor,
      setSelectedColor,
      primaryColorHex,
      setPrimaryColorHex,
      secondaryColorHex,
      setSecondaryColorHex,
      accentColorHex,
      setAccentColorHex
    }}>
      {children}
    </UIStyleContext.Provider>
  );
};

export const useUIStyle = () => {
  const context = useContext(UIStyleContext);
  if (!context) {
    throw new Error("useUIStyle must be used within a UIStyleProvider");
  }
  return context;
};
