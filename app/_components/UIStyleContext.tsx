"use client";

import React, { createContext, useContext, useState } from "react";
import { PaletteColorKey } from "@/UI/shared/color-utils";

interface UIStyleContextProps {
  selectedStyle: string;
  setSelectedStyle: (s: string) => void;
  selectedColor: PaletteColorKey;
  setSelectedColor: (c: PaletteColorKey) => void;
}

const UIStyleContext = createContext<UIStyleContextProps | undefined>(undefined);

export const UIStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedStyle, setSelectedStyle] = useState("sakode-modern");
  const [selectedColor, setSelectedColor] = useState<PaletteColorKey>("blue");

  return (
    <UIStyleContext.Provider value={{ selectedStyle, setSelectedStyle, selectedColor, setSelectedColor }}>
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
