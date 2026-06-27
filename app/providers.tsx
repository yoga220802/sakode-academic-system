"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { UIStyleProvider } from "./_components/UIStyleContext";
import { StyleSwitcherFAB } from "./_components/StyleSwitcherFAB";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
      <UIStyleProvider>
        {children}
        <StyleSwitcherFAB />
      </UIStyleProvider>
    </ThemeProvider>
  );
}
