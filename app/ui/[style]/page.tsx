import React from "react";
import { notFound } from "next/navigation";
import { UI_STYLES } from "../_utils/styles-data";
import ComponentShowcase from "../_components/ComponentShowcase";

interface PageProps {
  params: Promise<{ style: string }>;
}

// Generate static params for optimal SSR performance
export async function generateStaticParams() {
  return UI_STYLES.map((style) => ({
    style: style.slug,
  }));
}

// Dynamic SEO metadata generation
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const styleInfo = UI_STYLES.find((s) => s.slug === resolvedParams.style);

  if (!styleInfo) {
    return {
      title: "Gaya Desain Tidak Ditemukan - Sakode Academy",
    };
  }

  return {
    title: `Gaya Visual ${styleInfo.name} - Sakode Academy`,
    description: `Demo live komponen interaktif (tombol, formulir, toast, kartu) dengan tema ${styleInfo.name} untuk platform sistem pembelajaran Sakode.`,
  };
}

export default async function StylePreviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const currentStyle = resolvedParams.style;
  const styleExists = UI_STYLES.some((s) => s.slug === currentStyle);

  if (!styleExists) {
    notFound();
  }

  return (
    <div className="w-full">
      <ComponentShowcase style={currentStyle} />
    </div>
  );
}
