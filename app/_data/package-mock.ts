import { PackageViewModel } from "@/app/_types/package";

export const MOCK_PACKAGES: PackageViewModel[] = [
  {
    id: "pkg-1",
    slug: "react-nextjs-professional",
    name: "React & Next.js Professional",
    outcome: "Menguasai pembuatan web modern, performa tinggi, dan siap kerja sebagai Frontend Engineer berstandar industri.",
    price: 1500000,
    currency: "IDR",
    featured: true,
    registrationStart: "2026-07-01",
    registrationEnd: "2026-07-15",
    status: "published",
    trialPrice: 150000,
    hasGroupOption: true,
    minGroupSize: 2,
    maxGroupSize: 5,
    pricePerParticipant: 250000,
    modules: [
      {
        title: "Dasar React & State Management",
        sessionCount: 4,
        durationWeeks: 2,
        topics: ["JSX & Komponen", "Props & State", "React Hooks (useState, useEffect)", "Context API"]
      },
      {
        title: "Next.js App Router & Server Components",
        sessionCount: 6,
        durationWeeks: 3,
        topics: ["React Server Components (RSC)", "Routing Dinamis & Layouts", "Data Fetching & Caching", "Optimasi Gambar & Font"]
      },
      {
        title: "Integrasi API & Deployment",
        sessionCount: 4,
        durationWeeks: 2,
        topics: ["REST API & Route Handlers", "SWR / React Query", "Keamanan Dasar & Autentikasi", "Deployment ke Vercel"]
      }
    ]
  },
  {
    id: "pkg-2",
    slug: "typescript-data-structures",
    name: "TypeScript & Data Structures",
    outcome: "Memahami tipe data tingkat lanjut dan algoritma dasar untuk menulis kode yang kokoh, terstruktur, dan efisien.",
    price: 1200000,
    currency: "IDR",
    featured: false,
    registrationStart: "2026-07-01",
    registrationEnd: "2026-07-20",
    status: "published",
    trialPrice: 120000,
    hasGroupOption: true,
    minGroupSize: 2,
    maxGroupSize: 5,
    pricePerParticipant: 200000,
    modules: [
      {
        title: "TypeScript Fundamentals",
        sessionCount: 4,
        durationWeeks: 2,
        topics: ["Static Typing & Type Inference", "Interfaces vs Types", "Generics", "Type Guards & Utility Types"]
      },
      {
        title: "Struktur Data Klasik",
        sessionCount: 6,
        durationWeeks: 3,
        topics: ["Stacks & Queues", "Linked Lists (Single/Double)", "Trees & Binary Search Tree", "Graph Basics"]
      },
      {
        title: "Analisis Algoritma",
        sessionCount: 4,
        durationWeeks: 2,
        topics: ["Big O Notation", "Sorting Algorithms", "Searching Algorithms", "Rekursi"]
      }
    ]
  },
  {
    id: "pkg-3",
    slug: "backend-go-docker",
    name: "Backend Dev Go/Docker",
    outcome: "Membangun API server-side berkecepatan tinggi dan microservices ter-scalable menggunakan Go dan Docker containers.",
    price: 1800000,
    currency: "IDR",
    featured: false,
    registrationStart: "2026-07-01",
    registrationEnd: "2026-07-18",
    status: "published",
    trialPrice: 180000,
    hasGroupOption: true,
    minGroupSize: 2,
    maxGroupSize: 5,
    pricePerParticipant: 300000,
    modules: [
      {
        title: "Go Syntax & Concurrency",
        sessionCount: 5,
        durationWeeks: 2,
        topics: ["Tipe Data & Control Flow", "Structs & Interfaces", "Goroutines", "Channels & Select"]
      },
      {
        title: "RESTful API dengan Gin & GORM",
        sessionCount: 5,
        durationWeeks: 2.5,
        topics: ["Gin Router & Middleware", "Koneksi MySQL & Migrasi GORM", "JWT Authentication", "Validasi Request Zod/Go-Playground"]
      },
      {
        title: "Dockerization & Microservices",
        sessionCount: 4,
        durationWeeks: 2,
        topics: ["Dockerfile & Image Building", "Docker Compose", "gRPC & Protocol Buffers", "Dasar Messaging Queue"]
      }
    ]
  },
  {
    id: "pkg-4",
    slug: "fullstack-product-engineer",
    name: "Fullstack Product Engineer",
    outcome: "Menggabungkan frontend dan backend untuk menciptakan produk digital utuh dari nol hingga siap rilis.",
    price: 2500000,
    currency: "IDR",
    featured: false,
    registrationStart: "2026-07-01",
    registrationEnd: "2026-07-25",
    status: "draft", // Draft package, should not be displayed in normal catalog
    modules: [
      {
        title: "Fullstack Architectures",
        sessionCount: 6,
        durationWeeks: 3,
        topics: ["App Router & Server Actions", "Database Schema Design", "Auth Integration", "Deployment Pipeline"]
      }
    ]
  }
];

export type ScenarioType = "normal" | "loading" | "empty" | "partial-error" | "missing-price" | "closed-registration";

export class PackageMockService {
  public static async getPackages(scenario: ScenarioType = "normal", delayMs: number = 600): Promise<PackageViewModel[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (scenario === "loading") {
          // Handled in UI via component states, but let's keep promise unresolved or let UI handle it.
          // We will resolve normal packages but UI will show skeleton.
          resolve([...MOCK_PACKAGES.filter(p => p.status === "published")]);
          return;
        }

        if (scenario === "empty") {
          resolve([]);
          return;
        }

        if (scenario === "partial-error") {
          // Reject with a mock error or return packages where some have errors
          reject(new Error("Gagal menyinkronkan data harga terbaru dari server"));
          return;
        }

        if (scenario === "missing-price") {
          // Return packages where one of them has a null price
          const modified = MOCK_PACKAGES.filter(p => p.status === "published").map((pkg, idx) => {
            if (idx === 1) { // Let's make the second package (TypeScript) price null
              return { ...pkg, price: null };
            }
            return pkg;
          });
          resolve(modified);
          return;
        }

        if (scenario === "closed-registration") {
          // Return packages where registration periods are closed
          const modified = MOCK_PACKAGES.filter(p => p.status === "published").map((pkg, idx) => {
            if (idx === 0) { // Let's close React & Next.js
              return {
                ...pkg,
                registrationStart: "2026-05-01",
                registrationEnd: "2026-06-01" // In the past relative to current local time (July 2026)
              };
            }
            return pkg;
          });
          resolve(modified);
          return;
        }

        // Default / Normal scenario
        resolve(MOCK_PACKAGES.filter(p => p.status === "published"));
      }, delayMs);
    });
  }
}
