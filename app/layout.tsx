import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Akademik Sakode Academy",
  description:
    "Portal pembelajaran kursus IT terintegrasi yang dirancang untuk memfasilitasi pendaftaran peserta, kelas trial, modul belajar, serta manajemen dan penjadwalan mentor secara cerdas.",
  openGraph: {
    title: "Sistem Akademik Sakode Academy",
    description:
      "Portal pembelajaran kursus IT terintegrasi yang dirancang untuk memfasilitasi pendaftaran peserta, kelas trial, modul belajar, serta manajemen dan penjadwalan mentor secara cerdas.",
    images: [
      {
        url: "/icon-banner.png",
        width: 1200,
        height: 630,
        alt: "Sistem Akademik Sakode Academy Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistem Akademik Sakode Academy",
    description:
      "Portal pembelajaran kursus IT terintegrasi yang dirancang untuk memfasilitasi pendaftaran peserta, kelas trial, modul belajar, serta manajemen dan penjadwalan mentor secara cerdas.",
    images: ["/icon-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

