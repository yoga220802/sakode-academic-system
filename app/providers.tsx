"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { UIStyleProvider } from "./_components/UIStyleContext";
import { AuthProvider } from "./_components/AuthContext";
import { StyleSwitcherFAB } from "./_components/StyleSwitcherFAB";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
      <UIStyleProvider>
        <AuthProvider>
          {children}
          <StyleSwitcherFAB />
        </AuthProvider>
      </UIStyleProvider>
    </ThemeProvider>
  );
}
