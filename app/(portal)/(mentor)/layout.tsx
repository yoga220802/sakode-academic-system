"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";

const ALLOWED_ROLES = ["mentor", "mentor_lead"];

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session && !ALLOWED_ROLES.includes(session.role)) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session || !ALLOWED_ROLES.includes(session.role)) {
    return null;
  }

  return <>{children}</>;
}
