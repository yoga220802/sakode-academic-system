"use client";

import React from "react";
import * as UIStyles from "@/UI";
import { useUIStyle } from "@/app/_components/UIStyleContext";

interface ReadOnlyNoticeProps {
  organizationName?: string;
  message?: string;
}

export function ReadOnlyNotice({
  organizationName = "SMA Negeri 1 Jakarta",
  message
}: ReadOnlyNoticeProps) {
  const { selectedStyle } = useUIStyle();
  const UI = (UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"]);

  const displayMessage = message || `Akun Anda terhubung dengan organisasi **${organizationName}**. Anda memiliki akses penuh untuk memantau data, laporan, dan aktivitas, namun tidak memiliki wewenang untuk menambah, mengubah, atau menyetujui data.`;

  // Safe split/replace helper to parse bold text
  const parts = displayMessage.split(/(\*\*.*?\*\*)/g);

  return (
    <div className="mb-6 w-full text-left">
      <UI.Alert title="Lingkup Akses Terbatas (Read-Only)" type="info">
        <span>
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </span>
      </UI.Alert>
    </div>
  );
}
