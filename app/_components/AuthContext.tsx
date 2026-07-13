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

  const setRoleCookie = (role: string | null) => {
    if (typeof document === "undefined") return;
    if (role) {
      document.cookie = `sakode-role=${role};path=/;max-age=86400;samesite=lax`;
    } else {
      document.cookie = "sakode-role=;path=/;max-age=0";
    }
  };

  // Sync cookie from localStorage on mount
  useEffect(() => {
    if (mounted && session) {
      setRoleCookie(session.role);
    }
  }, [mounted, session]);

  const login = (role: UserRole) => {
    let name = "";
    let email = "";
    if (role === "admin") {
      name = "Super Admin Sakode";
      email = "admin@sakode.com";
    } else if (role === "mentor_lead") {
      name = "Hamzah Mentor Lead";
      email = "hamzah@sakode.com";
    } else if (role === "mentor") {
      name = "Udin Mentor React";
      email = "udin@sakode.com";
    } else if (role === "school_principal") {
      name = "Kepsek Sudarsono";
      email = "sudarsono@sekolah.sch.id";
    } else if (role === "referrer") {
      name = "Rudi Referrer";
      email = "rudi@referrer.com";
    } else {
      name = "Panjul Siswa Baru";
      email = "panjul@gmail.com";
    }
    const newSession = { userId: `usr-${role}`, name, email, role };
    setSession(newSession);
    localStorage.setItem("sakode-session", JSON.stringify(newSession));
    setRoleCookie(role);
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("sakode-session");
    setRoleCookie(null);
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
