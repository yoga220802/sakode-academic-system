import type { Metadata } from "next";
import { Kalam, Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const kalam = Kalam({
  variable: "--font-kalam",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
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
      className={`${kalam.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
