"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserSession } from "@/app/_types/auth";

interface AuthContextProps {
  session: UserSession | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) {
        setMounted(true);
        const saved = localStorage.getItem("sakode-session");
        if (saved) {
          try {
            setSession(JSON.parse(saved));
          } catch (e) {
            localStorage.removeItem("sakode-session");
          }
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const login = (role: UserRole) => {
    let name = "";
    let email = "";
    if (role === "admin") {
      name = "Super Admin Sakode";
      email = "admin@sakode.cc";
    } else if (role === "mentor_lead") {
      name = "Yogi Mentor Lead";
      email = "yogi.lead@sakode.cc";
    } else if (role === "mentor") {
      name = "Akbar Mentor React";
      email = "akbar.mentor@sakode.cc";
    } else {
      name = "Budi Siswa Baru";
      email = "budi.student@gmail.com";
    }
    const newSession = { userId: `usr-${role}`, name, email, role };
    setSession(newSession);
    localStorage.setItem("sakode-session", JSON.stringify(newSession));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("sakode-session");
  };

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
