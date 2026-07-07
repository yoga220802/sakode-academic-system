/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icons } from "@/UI/shared/Icons";

interface Option {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  options: Option[];
  value: string; // The selected name
  onChange: (selected: Option) => void;
  disabled?: boolean;
}

export default function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync selected value to query display when not searching
  useEffect(() => {
    setSearchQuery(value || "");
  }, [value]);

  // Filter options based on typed input
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery(value || ""); // Reset search to current value
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value]);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-1 text-xs">
      <span className="font-extrabold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide block mb-0.5">
        {label}
      </span>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (!disabled) {
              setSearchQuery(""); // Clear input on focus for easy search
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          className={`w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 focus:ring-2 focus:outline-hidden pr-8 ${
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        />
        <div className="absolute right-2.5 top-2.5 pointer-events-none text-zinc-400">
          <Icons.Search className="w-3.5 h-3.5" />
        </div>

        {isOpen && !disabled && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt);
                    setSearchQuery(opt.name);
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer text-zinc-800 dark:text-zinc-200 text-left font-medium transition-colors"
                >
                  {opt.name}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-zinc-400 italic text-left">Tidak ditemukan data</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
