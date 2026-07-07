import { ProgramViewModel } from "@/app/_types/program";

export class ProgramMockService {
  private static LOCAL_STORAGE_KEY = "sakode_mock_programs";
  
  private static defaultPrograms: ProgramViewModel[] = [
    {
      id: "PRG-001",
      name: "React & Next.js Professional",
      slug: "react-nextjs-pro",
      description: "Kuasai pengembangan frontend modern dari dasar hingga pembuatan aplikasi web production-grade menggunakan React, Next.js App Router, dan TailwindCSS.",
      price: 3500000,
      currency: "IDR",
      status: "published",
      isFeatured: true,
      registrationStartDate: "2026-07-01",
      registrationEndDate: "2026-07-31",
      modules: [
        { id: "MOD-101", title: "JavaScript & TypeScript Fundamental", description: "Sintaks dasar, ES6+, async/await, static typing, interfaces, dan generics.", durationHours: 8, order: 1 },
        { id: "MOD-102", title: "React Core Concepts & Hooks", description: "State, props, lifecycle, virtual DOM, useEffect, useMemo, custom hooks.", durationHours: 12, order: 2 },
        { id: "MOD-103", title: "Next.js Routing & Data Fetching", description: "App router, Server Components vs Client Components, ISR, SSR, static generation.", durationHours: 15, order: 3 },
        { id: "MOD-104", title: "State Management & TailwindCSS Styling", description: "Context API, Zustand, utility-first CSS styling, responsive layouts.", durationHours: 10, order: 4 },
        { id: "MOD-105", title: "Deployment, SEO & Performance Optimization", description: "Vercel deployment, meta tags, Core Web Vitals, dynamic imports, images optimization.", durationHours: 5, order: 5 }
      ]
    },
    {
      id: "PRG-002",
      name: "Backend Dev Go & Docker",
      slug: "backend-go-docker",
      description: "Bangun API berskala besar yang cepat dan aman dengan Go (Golang), gRPC, PostgreSQL, Docker, dan arsitektur microservices.",
      price: 4200000,
      currency: "IDR",
      status: "published",
      isFeatured: false,
      registrationStartDate: "2026-07-05",
      registrationEndDate: "2026-08-05",
      modules: [
        { id: "MOD-201", title: "Go Syntax & Concurrency", description: "Pointers, structs, slices, channels, goroutines, sync package.", durationHours: 10, order: 1 },
        { id: "MOD-202", title: "Database & SQL with PostgreSQL", description: "Desain skema database, indexing, query optimization, migrations, transaction management.", durationHours: 12, order: 2 },
        { id: "MOD-203", title: "RESTful API & gRPC Development", description: "Routing (Chi/Fiber), middleware, protocol buffers, RPC, streaming API.", durationHours: 15, order: 3 },
        { id: "MOD-204", title: "Docker Containerization & Compose", description: "Dockerfile, multi-stage builds, networking, docker-compose untuk local development.", durationHours: 8, order: 4 },
        { id: "MOD-205", title: "CI/CD & Kubernetes Deployment Basics", description: "GitHub Actions, registry setup, basic pods and services configuration.", durationHours: 5, order: 5 }
      ]
    },
    {
      id: "PRG-003",
      name: "TypeScript & Data Structures",
      slug: "typescript-dsa",
      description: "Perkuat dasar logika pemrograman dan pemecahan masalah dengan TypeScript, algoritma klasik, serta struktur data kompleks.",
      price: 2900000,
      currency: "IDR",
      status: "published",
      isFeatured: false,
      registrationStartDate: "2026-06-15",
      registrationEndDate: "2026-07-15",
      modules: [
        { id: "MOD-301", title: "Advanced TypeScript Types & Utility Types", description: "Conditional types, mapped types, utility types, type guards.", durationHours: 8, order: 1 },
        { id: "MOD-302", title: "Linear Data Structures", description: "Linked lists, stacks, queues, hash tables, complexity analysis (Big O).", durationHours: 10, order: 2 },
        { id: "MOD-303", title: "Trees, Graphs & Recursion", description: "Binary trees, BFS, DFS, Dijkstra's algorithm, call stacks.", durationHours: 12, order: 3 },
        { id: "MOD-304", title: "Search & Sorting Algorithms", description: "Quick sort, merge sort, binary search, heap sort.", durationHours: 10, order: 4 },
        { id: "MOD-305", title: "Dynamic Programming Basics", description: "Memoization, tabulation, greedy algorithms, knapsack problem.", durationHours: 8, order: 5 }
      ]
    },
    {
      id: "PRG-004",
      name: "UI/UX & Product Design",
      slug: "uiux-product-design",
      description: "Pelajari metodologi design thinking, pembuatan wireframe, prototyping di Figma, serta validasi produk digital ke user.",
      price: 2500000,
      currency: "IDR",
      status: "draft",
      isFeatured: false,
      modules: [
        { id: "MOD-401", title: "User Research & Persona Development", description: "Wawancara user, survei, peta empati, mendefinisikan user journey.", durationHours: 8, order: 1 },
        { id: "MOD-402", title: "Information Architecture & Wireframing", description: "Sitemap, user flows, low-fidelity wireframing di kertas & Figma.", durationHours: 10, order: 2 },
        { id: "MOD-403", title: "Figma Prototyping & Visual Design", description: "Auto-layout, design systems, interactive prototypes, micro-interactions.", durationHours: 15, order: 3 },
        { id: "MOD-404", title: "Usability Testing & Product Handoff", description: "Maze testing, feedback gathering, developer specs, Zeplin/Figma handoff.", durationHours: 10, order: 4 }
      ]
    },
    {
      id: "PRG-005",
      name: "Mobile Dev Flutter & React Native",
      slug: "mobile-flutter-rn",
      description: "Kembangkan aplikasi mobile cross-platform Android dan iOS menggunakan Flutter & Dart atau React Native dengan performa native.",
      price: null,
      currency: "IDR",
      status: "draft",
      isFeatured: false,
      modules: [
        { id: "MOD-501", title: "Flutter & Dart Basics", description: "Widgets, layouting, Dart async, stateless & stateful widgets.", durationHours: 10, order: 1 },
        { id: "MOD-502", title: "React Native Core & JSX", description: "Components, styles, flexbox, Native Modules, custom hooks.", durationHours: 10, order: 2 },
        { id: "MOD-503", title: "State Management & Navigation", description: "Provider/Bloc untuk Flutter, Redux/Zustand untuk React Native, React Navigation.", durationHours: 12, order: 3 },
        { id: "MOD-504", title: "Integrasi API & Push Notifications", description: "Http requests, Axios, Firebase Cloud Messaging, local notifications.", durationHours: 8, order: 4 },
        { id: "MOD-505", title: "Publishing to App Store & Google Play Store", description: "Signing keys, build release, App Store Connect, Play Console submission.", durationHours: 5, order: 5 }
      ]
    }
  ];

  private static getStoredPrograms(): ProgramViewModel[] {
    if (typeof window === "undefined") return this.defaultPrograms;
    const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.defaultPrograms));
      return this.defaultPrograms;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored programs, resetting to defaults", e);
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.defaultPrograms));
      return this.defaultPrograms;
    }
  }

  private static savePrograms(programs: ProgramViewModel[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(programs));
    }
  }

  public static async getPrograms(delayMs: number = 500): Promise<ProgramViewModel[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getStoredPrograms());
      }, delayMs);
    });
  }

  public static async getProgramById(id: string, delayMs: number = 400): Promise<ProgramViewModel | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = this.getStoredPrograms().find((p) => p.id === id) || null;
        resolve(found);
      }, delayMs);
    });
  }

  public static async saveProgram(program: ProgramViewModel, delayMs: number = 400): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const programs = this.getStoredPrograms();
        const exists = programs.some((p) => p.id === program.id);
        let updated: ProgramViewModel[];
        if (exists) {
          updated = programs.map((p) => p.id === program.id ? program : p);
        } else {
          updated = [program, ...programs];
        }
        this.savePrograms(updated);
        resolve();
      }, delayMs);
    });
  }

  public static async deleteProgram(id: string, delayMs: number = 400): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const programs = this.getStoredPrograms();
        const updated = programs.filter((p) => p.id !== id);
        this.savePrograms(updated);
        resolve();
      }, delayMs);
    });
  }
}
