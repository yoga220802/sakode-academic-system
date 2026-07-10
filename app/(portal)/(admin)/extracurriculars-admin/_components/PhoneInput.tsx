"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
import { Icons } from "@/UI/shared/Icons";
import { countries } from "countries-list";

interface Country {
  name: string;
  code: string;
  cca2: string;
}

// Build typed countries list from the locally imported countries-list library
// Computed once at module loading time rather than inside the React rendering cycle
const countriesData: Country[] = (() => {
  const list = Object.entries(countries)
    .map(([cca2, c]) => {
      // phone codes are exported as numeric arrays. Prepend '+' to the first item.
      const code = c.phone && c.phone.length > 0 ? `+${c.phone[0]}` : "";
      return {
        name: c.name,
        code,
        cca2
      };
    })
    .filter((c) => c.code);

  // Sort alphabetically
  list.sort((a, b) => a.name.localeCompare(b.name));

  // Put Indonesia at the top of the list for faster primary selection
  const idIdx = list.findIndex((c) => c.cca2 === "ID");
  if (idIdx !== -1) {
    const [indonesia] = list.splice(idIdx, 1);
    return [indonesia, ...list];
  }
  return list;
})();

interface PhoneInputProps {
  label: string;
  phoneCodeValue: string; // e.g. "+62"
  phoneNumberValue: string; // e.g. "81234567890"
  onPhoneCodeChange: (code: string) => void;
  onPhoneNumberChange: (number: string) => void;
  disabled?: boolean;
}

export default function PhoneInput({
  label,
  phoneCodeValue,
  phoneNumberValue,
  onPhoneCodeChange,
  onPhoneNumberChange,
  disabled = false
}: PhoneInputProps) {
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter countries in dropdown
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countriesData;
    return countriesData.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.includes(searchQuery)
    );
  }, [searchQuery]);

  // Selected country details helper
  const selectedCountryName = useMemo(() => {
    const found = countriesData.find((c) => c.code === phoneCodeValue);
    return found ? `${found.cca2} (${found.code})` : phoneCodeValue || "+62";
  }, [phoneCodeValue]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-1 text-xs text-left">
      <UI.Label>{label}</UI.Label>
      
      <div className="flex gap-2">
        {/* Left Side: Searchable Country Code selector */}
        <div className="relative w-32 shrink-0">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-left focus:ring-2 focus:outline-hidden flex items-center justify-between font-bold ${
              disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <span>{selectedCountryName}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-zinc-400"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-1.5 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-50 p-2 flex flex-col gap-2">
              <div className="relative flex items-center">
                <Icons.Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2" />
                <input
                  type="text"
                  placeholder="Cari negara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-7 pr-2 py-1 focus:outline-hidden"
                />
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c, idx) => (
                    <div
                      key={`${c.cca2}-${c.code}-${idx}`}
                      onClick={() => {
                        onPhoneCodeChange(c.code);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className="px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer text-zinc-800 dark:text-zinc-200 text-left font-semibold transition-colors flex justify-between items-center"
                    >
                      <span className="truncate max-w-[120px]">{c.name}</span>
                      <span className="text-sakode-blue dark:text-sky-400 font-bold">{c.code}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-zinc-400 italic text-left">Tidak ditemukan</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Numeric input box */}
        <div className="flex-1">
          <UI.Input
            type="text"
            placeholder="contoh: 81234567890"
            value={phoneNumberValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              // Only allow numbers, and auto-convert leading 0 or 62 to clean format
              let raw = e.target.value.replace(/\D/g, "");
              if (raw.startsWith("0")) {
                raw = raw.substring(1);
              } else if (raw.startsWith("62")) {
                raw = raw.substring(2);
              }
              onPhoneNumberChange(raw);
            }}
            disabled={disabled}
            accentColor={selectedColor}
            className="text-xs! py-2!"
          />
        </div>
      </div>
    </div>
  );
}
