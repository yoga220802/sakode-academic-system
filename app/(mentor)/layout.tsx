"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";
import { AestheticBackground } from "../_components/AestheticBackground";

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else if (session.role !== "mentor") {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session || session.role !== "mentor") return null;

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden font-sans relative">
      <AestheticBackground mode="dashboard" />
      <main className="flex-1 p-6 z-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
