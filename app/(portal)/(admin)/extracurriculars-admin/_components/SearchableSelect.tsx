"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUIStyle } from "@/app/_components/UIStyleContext";
import * as UIStyles from "@/UI";
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
  const { selectedStyle, selectedColor } = useUIStyle();
  const UI = UIStyles.UI[selectedStyle as keyof typeof UIStyles.UI] || UIStyles.UI["sakode-modern"];

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute the value to display in the input box:
  // When open, show what the user is typing to filter options.
  // When closed, show the final chosen value (e.g. selected province/city name).
  const displayValue = isOpen ? searchQuery : (value || "");

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
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col text-xs text-left">
      <UI.Label className="mb-0.5">{label}</UI.Label>
      <div className="relative">
        <UI.Input
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (!disabled) {
              setSearchQuery(""); // Clear temporary search query on focus for easy search
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          accentColor={selectedColor}
          className="pr-8! text-xs! py-2!"
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
