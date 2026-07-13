"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session && session.role !== "murid") {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session || session.role !== "murid") {
    return null;
  }

  return <>{children}</>;
}
