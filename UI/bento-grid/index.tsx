import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Icons } from "../shared/Icons";
import { PaletteColorKey, getBgClass, getFocusRingClass, getBgOpacity15Class, getBgOpacity20Class, getBgOpacity25Class, getBgOpacity5Class, getBorderClass, getGradientClass, getGradientBgLightClass, getTextClass, getBorderRadiusClass } from "../shared/color-utils";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { accentColor?: PaletteColorKey }> = ({ className = "", accentColor, children, ...props }) => (
  <div
    className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-zinc-800 dark:text-zinc-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const Heading: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", children, ...props }) => (
  <h3 className={`text-lg font-bold text-zinc-850 dark:text-zinc-100 mb-4 ${className}`} {...props}>
    {children}
  </h3>
);

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = "", children, ...props }) => (
  <label className={`block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 ${className}`} {...props}>
    {children}
  </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean; accentColor?: PaletteColorKey }>(
  ({ className = "", hasError, accentColor = "green", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2.5 px-4 focus:ring-2 ${getFocusRingClass(accentColor)} focus:outline-hidden transition-all text-zinc-900 dark:text-zinc-100 ${
        hasError ? "border-sakode-red focus:ring-sakode-red/30 dark:border-sakode-red" : ""
      } ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean; accentColor?: PaletteColorKey }>(
  ({ className = "", hasError, accentColor = "green", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2.5 px-4 focus:ring-2 ${getFocusRingClass(accentColor)} focus:outline-hidden transition-all text-zinc-900 dark:text-zinc-100 appearance-none cursor-pointer bg-white dark:bg-zinc-900 ${
        hasError ? "border-sakode-red focus:ring-sakode-red/30 dark:border-sakode-red" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export const Toggle: React.FC<{ checked: boolean; onChange: () => void; accentColor?: PaletteColorKey; "aria-label"?: string }> = ({ checked, onChange, accentColor = "green", ...props }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked ? "true" : "false"}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-zinc-200 dark:border-zinc-800 transition-colors duration-200 ease-in-out focus:outline-hidden ${
      checked ? getBgClass(accentColor) : "bg-zinc-200 dark:bg-zinc-800"
    }`}
    {...props}
  >
    <span
      className={`pointer-events-none inline-block transform ring-0 transition duration-200 ease-in-out rounded-full h-5 w-5 bg-white dark:bg-zinc-900 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

export const Button = React.forwardRef<HTMLButtonElement, Omit<HTMLMotionProps<"button">, "ref" | "children"> & { children?: React.ReactNode; } & { variant?: "primary" | "secondary"; accentColor?: PaletteColorKey; isLoading?: boolean }>(
  ({ className = "", children, variant = "primary", accentColor = "green", isLoading, ...props }, ref) => {
    let btnClass = "";
    if (variant === "primary") {
      const textColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-zinc-950 font-bold" : "text-white";
      btnClass = `${getBgClass(accentColor)} hover:opacity-95 ${textColor} rounded-lg font-medium py-2.5 px-5 shadow-sm transition-all shrink-0`;
    } else {
      btnClass = "bg-transparent border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium py-2.5 px-5 transition-colors shrink-0";
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={`${btnClass} inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Icons.Loader className="w-4 h-4 text-current animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

// 8. Accordion Component
export const Accordion: React.FC<{
  items: { id: number; q: string; a: string }[];
  activeId: number | null;
  onToggle: (id: number) => void;
}> = ({ items, activeId, onToggle }) => (
  <div className="space-y-3.5">
    {items.map((item) => {
      const isOpen = activeId === item.id;
      return (
        <div
          key={item.id}
          className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-205"
        >
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className={`w-full flex items-center justify-between p-4.5 font-bold text-left transition-colors ${
              isOpen ? "bg-zinc-50 dark:bg-zinc-900/60" : "bg-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            }`}
          >
            <span className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">{item.q}</span>
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/45 dark:border-zinc-705/45 text-zinc-500 dark:text-zinc-400 transform transition-transform duration-200 ${isOpen ? "rotate-45 bg-zinc-250 dark:bg-zinc-750 text-zinc-805 dark:text-zinc-195" : ""}`}>
              <Icons.Plus className="w-3.5 h-3.5" />
            </span>
          </button>
          {isOpen && (
            <div className="p-4.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-450 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/45 dark:bg-zinc-900/30">
              {item.a}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// 9. Timeline Component
export const Timeline: React.FC<{
  steps: { step: string; title: string; desc: string }[];
  accentColor?: PaletteColorKey;
}> = ({ steps, accentColor = "green" }) => {
  const textColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-zinc-950" : "text-white";
  return (
    <div className="relative pl-7 border-l border-zinc-200 dark:border-zinc-800 space-y-6">
      {steps.map((item, idx) => (
        <div key={idx} className="relative">
          <span className={`absolute -left-9.5 top-0.5 w-6.5 h-6.5 rounded-lg flex items-center justify-center text-[10px] font-black ${textColor} ${getBgClass(accentColor)} border border-zinc-300/10 dark:border-zinc-850 shadow-xs`}>
            {item.step}
          </span>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/65 dark:border-zinc-800/65 p-3.5 rounded-xl shadow-3xs hover:border-zinc-305 dark:hover:border-zinc-695 transition-all">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">{item.title}</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// 10. Badge Component
export const Badge: React.FC<{
  children: React.ReactNode;
  accentColor?: PaletteColorKey;
  variant?: "accent" | "success" | "warning" | "default";
}> = ({ children, accentColor = "green", variant = "default" }) => {
  const isDarkText = accentColor === "yellow" || accentColor === "cyan";
  const badgeColors = {
    default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-850 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700/50",
    accent: `${getBgClass(accentColor)} ${isDarkText ? "text-zinc-955 font-extrabold" : "text-white font-bold"} border-zinc-900/10 dark:border-white/10`,
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
  };

  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border shadow-3xs ${badgeColors[variant]}`}>
      {children}
    </span>
  );
};

// 11. AvatarGroup Component
export const AvatarGroup: React.FC<{
  initials: string[];
  extraCount: number;
  accentColor?: PaletteColorKey;
}> = ({ initials, extraCount, accentColor = "green" }) => {
  const extraTextColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-zinc-950" : "text-white";
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2 overflow-hidden p-0.5">
        {initials.map((initial, idx) => (
          <div
            key={idx}
            className="inline-block h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-850 bg-zinc-100 dark:bg-zinc-800 items-center justify-center text-[10px] font-bold text-zinc-750 dark:text-zinc-350 text-center leading-7 shadow-3xs"
          >
            {initial}
          </div>
        ))}
        <div className={`inline-block h-8 w-8 rounded-lg border border-zinc-200/50 dark:border-zinc-850/50 ${getBgClass(accentColor)} ${extraTextColor} flex items-center justify-center text-[9px] font-black shadow-3xs`}>
          +{extraCount}
        </div>
      </div>
    </div>
  );
};

// 12. Alert Component
export const Alert: React.FC<{
  title: string;
  children: React.ReactNode;
  type?: "warning" | "info";
}> = ({ title, children, type = "info" }) => {
  const isWarning = type === "warning";
  const borderClass = isWarning
    ? "border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200"
    : "border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-200";
  return (
    <div className={`flex items-start gap-3.5 p-4 rounded-xl border ${borderClass} text-xs font-semibold shadow-3xs`}>
      {isWarning ? <Icons.AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" /> : <Icons.Info className="w-4.5 h-4.5 shrink-0 mt-0.5 text-sky-600 dark:text-sky-400" />}
      <div>
        <span className="font-extrabold block mb-0.5">{title}</span>
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

// 13. Table Component
export const Table: React.FC<{
  schedules: { course: string; date: string; mentor: string; status: string }[];
  accentColor?: PaletteColorKey;
}> = ({ schedules, accentColor = "green" }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs border-collapse">
      <thead>
        <tr className="border-b border-zinc-200 dark:border-zinc-800 font-extrabold text-zinc-400 uppercase tracking-wider">
          <th className="pb-3 pr-2">Kelas Kursus</th>
          <th className="pb-3 pr-2">Tanggal Mentoring</th>
          <th className="pb-3 pr-2">Mentor</th>
          <th className="pb-3 text-right">Status</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((item, idx) => (
          <tr key={idx} className="border-b border-zinc-150/40 dark:border-zinc-800/40 hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10">
            <td className="py-3 font-extrabold text-zinc-900 dark:text-white pr-2">{item.course}</td>
            <td className="py-3 text-zinc-500 dark:text-zinc-400 pr-2">{item.date}</td>
            <td className="py-3 text-zinc-700 dark:text-zinc-300 pr-2">{item.mentor}</td>
            <td className="py-3 text-right">
              <Badge
                variant={item.status === "Selesai" ? "default" : "accent"}
                accentColor={accentColor}
              >
                {item.status}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 14. Carousel Component
export const Carousel: React.FC<{
  testimonials: { name: string; role: string; review: string }[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  accentColor?: PaletteColorKey;
}> = ({ testimonials, activeIndex, onPrev, onNext, accentColor = "green" }) => {
  const activeReview = testimonials[activeIndex];
  return (
    <div className="min-h-24 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wider">13. Ulasan Alumni (Carousel)</h4>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Slide sebelumnya"
            title="Slide sebelumnya"
          >
            <Icons.ArrowLeft className="w-3.5 h-3.5 text-zinc-500" />
          </button>
          <button
            onClick={onNext}
            className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Slide berikutnya"
            title="Slide berikutnya"
          >
            <Icons.ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
        &ldquo;{activeReview.review}&rdquo;
      </p>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className="block text-xs font-extrabold text-zinc-900 dark:text-white">{activeReview.name}</span>
          <span className="text-[10px] text-zinc-400">{activeReview.role}</span>
        </div>
        <div className="flex gap-0.5 text-amber-500">
          <Icons.Star className="w-3 h-3 fill-current" />
          <Icons.Star className="w-3 h-3 fill-current" />
          <Icons.Star className="w-3 h-3 fill-current" />
          <Icons.Star className="w-3 h-3 fill-current" />
          <Icons.Star className="w-3 h-3 fill-current" />
        </div>
      </div>
    </div>
  );
};

// 15. Chart Component
// 15. Chart Component
export const Chart: React.FC<{
  bars: { label: string; val: string }[];
  accentColor?: PaletteColorKey;
}> = ({ bars, accentColor = "green" }) => (
  <div className="h-32 w-full flex items-end justify-between gap-3 pt-4">
    {bars.map((bar, idx) => (
      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
        <div className="w-full relative group h-full flex items-end">
          <div
            className={`w-full rounded-t-lg transition-all duration-300 border border-zinc-200/50 dark:border-zinc-800/60 shadow-3xs ${bar.val} ${getBgClass(accentColor)}`}
          />
          <span className="absolute -top-7 left-1/2 translate-x-[-50%] text-[8.5px] font-black bg-zinc-900 text-white rounded-lg px-2 py-0.5 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {bar.val.replace("h-[", "").replace("%]", "")}%
          </span>
        </div>
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-550 dark:text-zinc-455 block">{bar.label}</span>
      </div>
    ))}
  </div>
);

// 16. Breadcrumbs Component
export const Breadcrumbs: React.FC<{
  items: { label: string; active?: boolean }[];
  accentColor?: PaletteColorKey;
}> = ({ items, accentColor = "green" }) => (
  <nav className="flex text-xs font-semibold text-zinc-400 gap-1.5 flex-wrap items-center">
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <span>/</span>}
        <span className={item.active ? `font-black ${getTextClass(accentColor)}` : "hover:text-zinc-900 dark:hover:text-white cursor-pointer"}>
          {item.label}
        </span>
      </React.Fragment>
    ))}
  </nav>
);

// 17. Dropdown Component
export const Dropdown: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  triggerText: string;
  items: { label: string; onClick: () => void }[];
  accentColor?: PaletteColorKey;
  styleName?: string;
}> = ({ isOpen, onToggle, triggerText, items, accentColor = "green", styleName = "bento-grid" }) => (
  <div className="relative inline-block text-left z-20">
    <Button
      variant="secondary"
      accentColor={accentColor}
      onClick={onToggle}
      className="py-2! px-4! flex items-center gap-2"
    >
      <span>{triggerText}</span>
      <Icons.X className={`w-3.5 h-3.5 transform transition-transform ${isOpen ? "" : "rotate-45"}`} />
    </Button>

    {isOpen && (
      <div
        className={`absolute left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg p-1.5 space-y-1 z-30 ${getBorderRadiusClass(styleName)}`}
      >
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className="w-full text-left text-xs font-semibold py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

// 18. UploadZone Component
export const UploadZone: React.FC<{
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  uploadedFiles?: string[];
  onRemoveFile?: (index: number) => void;
  accentColor?: PaletteColorKey;
  styleName?: string;
}> = ({ isDragging, onDragOver, onDragLeave, onDrop, uploadedFiles = [], onRemoveFile, accentColor = "green", styleName = "bento-grid" }) => (
  <div>
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`border-2 border-dashed py-8 px-4 text-center cursor-pointer transition-all ${getBorderRadiusClass(styleName)} ${
        isDragging
          ? `${getBorderClass(accentColor)} ${getBgOpacity5Class(accentColor)}`
          : "border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <Icons.X className="w-8 h-8 text-zinc-400 rotate-45" />
        <span className="text-xs font-extrabold text-zinc-900 dark:text-white block">
          Tarik file Anda ke sini, atau klik untuk memilih
        </span>
        <span className="text-[10px] text-zinc-400 block">Mendukung format PDF, ZIP, PNG (Maks 10MB)</span>
      </div>
    </div>

    {uploadedFiles.length > 0 && (
      <div className="mt-4 space-y-2">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">File Diunggah</span>
        <div className="space-y-1.5">
          {uploadedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/30 text-xs border border-zinc-200/20">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-xs">{file}</span>
              {onRemoveFile && (
                <button
                  onClick={() => onRemoveFile(idx)}
                  className="text-rose-500 hover:text-rose-600"
                  aria-label="Batalkan unggahan file"
                  title="Batalkan unggahan file"
                >
                  <Icons.X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export const bentoGrid = {
  Card,
  Heading,
  Label,
  Input,
  Select,
  Toggle,
  Button,
  Accordion,
  Timeline,
  Badge,
  AvatarGroup,
  Alert,
  Table,
  Carousel,
  Chart,
  Breadcrumbs,
  Dropdown,
  UploadZone
};
