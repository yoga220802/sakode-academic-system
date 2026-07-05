import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
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
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Kalam:wght@300;400;700&family=Nunito:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

