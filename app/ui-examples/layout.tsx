import React from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./_components/ThemeToggle";
import ToastContainer from "./_components/ToastContainer";

export default function UIExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 dark:bg-[#030307] dark:text-zinc-100 transition-colors duration-300">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#030307]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-[#030307] py-1.5 px-3 rounded-lg border border-zinc-800/80 shadow-md flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                <Image
                  src="/assets/logo/sakode.svg"
                  alt="Sakode Academy Logo"
                  width={90}
                  height={25}
                  priority
                  className="h-5 w-auto"
                />
              </div>
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <Link
              href="/ui-examples"
              className="text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              UI Showcase
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-all"
            >
              Kembali ke Landing
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Global Toast Provider */}
      <ToastContainer />
    </div>
  );
}
