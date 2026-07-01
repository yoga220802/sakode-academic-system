import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Icons } from "../shared/Icons";
import { PaletteColorKey, getBgClass, getBgOpacity15Class, getBgOpacity20Class, getBgOpacity25Class, getBgOpacity5Class, getBorderClass, getGradientClass, getGradientBgLightClass, getTextClass, getBorderRadiusClass } from "../shared/color-utils";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { accentColor?: PaletteColorKey }> = ({ className = "", accentColor, children, ...props }) => (
  <div
    className={`bg-white dark:bg-zinc-900 border-3 border-zinc-900 dark:border-white p-6 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,250,250,1)] text-zinc-900 dark:text-zinc-50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const Heading: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", children, ...props }) => (
  <h3 className={`text-lg font-black font-mono uppercase tracking-wide text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white pb-1 mb-4 ${className}`} {...props}>
    {children}
  </h3>
);

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = "", children, ...props }) => (
  <label className={`block text-xs font-black font-mono uppercase tracking-wide text-zinc-900 dark:text-white mb-1.5 ${className}`} {...props}>
    {children}
  </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean; accentColor?: PaletteColorKey }>(
  ({ className = "", hasError, accentColor = "blue", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-white font-mono py-2.5 px-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,1)] focus:outline-hidden focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] transition-all text-zinc-900 dark:text-white ${
        hasError ? "border-sakode-red focus:ring-sakode-red/30 dark:border-sakode-red" : ""
      } ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean; accentColor?: PaletteColorKey }>(
  ({ className = "", hasError, accentColor = "blue", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full bg-white dark:bg-zinc-950 border-3 border-zinc-900 dark:border-white font-mono py-2.5 px-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,1)] focus:outline-hidden focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] transition-all text-zinc-900 dark:text-white appearance-none cursor-pointer bg-white dark:bg-zinc-900 ${
        hasError ? "border-sakode-red focus:ring-sakode-red/30 dark:border-sakode-red" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export const Toggle: React.FC<{ checked: boolean; onChange: () => void; accentColor?: PaletteColorKey; "aria-label"?: string }> = ({ checked, onChange, accentColor = "blue", ...props }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked ? "true" : "false"}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer border-3 border-zinc-900 dark:border-white transition-colors duration-200 ease-in-out focus:outline-hidden ${
      checked ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"
    }`}
    {...props}
  >
    <span
      className={`pointer-events-none inline-block transform ring-0 transition duration-200 ease-in-out rounded-none h-4.5 w-4.5 bg-white dark:bg-zinc-900 ${
        checked ? "translate-x-5 bg-white" : "translate-x-0"
      }`}
    />
  </button>
);

export const Button = React.forwardRef<HTMLButtonElement, Omit<HTMLMotionProps<"button">, "ref" | "children"> & { children?: React.ReactNode; } & { variant?: "primary" | "secondary"; accentColor?: PaletteColorKey; isLoading?: boolean }>(
  ({ className = "", children, variant = "primary", accentColor = "blue", isLoading, ...props }, ref) => {
    let btnClass = "";
    if (variant === "primary") {
      btnClass = `${getBgClass(accentColor)} text-zinc-900 border-3 border-zinc-900 font-bold uppercase tracking-wider text-xs py-2.5 px-5 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75 shrink-0`;
    } else {
      btnClass = `bg-white dark:bg-zinc-800 ${getTextClass(accentColor)} dark:text-white border-3 border-zinc-900 dark:border-white font-bold uppercase tracking-wider text-xs py-2.5 px-5 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75 shrink-0`;
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ y: 2, x: 2 }}
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
  <div className="space-y-4">
    {items.map((item) => {
      const isOpen = activeId === item.id;
      return (
        <div
          key={item.id}
          className="border-2 border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,1)] rounded-none overflow-hidden"
        >
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className={`w-full flex items-center justify-between p-4 font-mono font-black text-left text-zinc-900 dark:text-white transition-colors ${
              isOpen ? "bg-zinc-150/40 dark:bg-zinc-800/40" : "bg-transparent"
            }`}
          >
            <span className="text-sm uppercase tracking-tight">{item.q}</span>
            <span className={`w-6 h-6 border-2 border-zinc-900 dark:border-white flex items-center justify-center bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] dark:shadow-[1.5px_1.5px_0px_rgba(255,255,255,1)] transform transition-all duration-150 ${isOpen ? "rotate-45" : ""}`}>
              <Icons.Plus className="w-3.5 h-3.5" />
            </span>
          </button>
          {isOpen && (
            <div className="p-4 text-xs font-mono leading-relaxed text-zinc-800 dark:text-zinc-300 border-t-2 border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-950/25">
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
}> = ({ steps, accentColor = "blue" }) => {
  const textColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-black" : "text-white";
  return (
    <div className="relative pl-8 border-l-2 border-zinc-900 dark:border-white space-y-6">
      {steps.map((item, idx) => (
        <div key={idx} className="relative">
          <span className={`absolute -left-11.25 top-0 w-6.5 h-6.5 border-2 border-zinc-900 dark:border-white flex items-center justify-center text-[10px] font-mono font-black ${textColor} ${getBgClass(accentColor)} shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none`}>
            {item.step}
          </span>
          <div>
            <h4 className="text-sm font-mono font-black uppercase text-zinc-900 dark:text-white leading-tight">{item.title}</h4>
            <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-1">{item.desc}</p>
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
}> = ({ children, accentColor = "blue", variant = "default" }) => {
  const isDarkText = accentColor === "yellow" || accentColor === "cyan";
  const badgeColors = {
    default: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
    accent: `${getBgClass(accentColor)} ${isDarkText ? "text-black" : "text-white"}`,
    success: "bg-emerald-400 text-black",
    warning: "bg-amber-400 text-black",
  };

  return (
    <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 border-2 border-zinc-900 dark:border-white shadow-[1.5px_1.5px_0px_rgba(24,24,27,1)] dark:shadow-[1.5px_1.5px_0px_rgba(250,250,250,1)] rounded-none ${badgeColors[variant]}`}>
      {children}
    </span>
  );
};

// 11. AvatarGroup Component
export const AvatarGroup: React.FC<{
  initials: string[];
  extraCount: number;
  accentColor?: PaletteColorKey;
}> = ({ initials, extraCount, accentColor = "blue" }) => {
  const extraTextColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-black" : "text-white";
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2.5 overflow-hidden p-0.5">
        {initials.map((initial, idx) => (
          <div
            key={idx}
            className="inline-block h-8 w-8 border-2 border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800 items-center justify-center text-[10px] font-mono font-black text-zinc-900 dark:text-white text-center leading-7 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] dark:shadow-[1.5px_1.5px_0px_rgba(255,255,255,1)] rounded-none"
          >
            {initial}
          </div>
        ))}
        <div className={`inline-block h-8 w-8 border-2 border-zinc-900 dark:border-white ${getBgClass(accentColor)} ${extraTextColor} flex items-center justify-center text-[9px] font-mono font-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] dark:shadow-[1.5px_1.5px_0px_rgba(255,255,255,1)] rounded-none`}>
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
  const bgClass = isWarning
    ? "bg-sakode-yellow text-zinc-900 border-zinc-900 dark:border-white shadow-[3px_3px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_rgba(255,255,255,1)]"
    : "bg-sakode-cyan text-zinc-900 border-zinc-900 dark:border-white shadow-[3px_3px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_rgba(255,255,255,1)]";
  return (
    <div className={`flex items-start gap-3.5 p-4 border-2 ${bgClass} text-xs font-mono rounded-none`}>
      {isWarning ? <Icons.AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" /> : <Icons.Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />}
      <div>
        <span className="font-black block uppercase tracking-wider mb-1">{title}</span>
        <div className="font-bold leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

// 13. Table Component
export const Table: React.FC<{
  schedules: { course: string; date: string; mentor: string; status: string }[];
  accentColor?: PaletteColorKey;
}> = ({ schedules, accentColor = "blue" }) => (
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
}> = ({ testimonials, activeIndex, onPrev, onNext, accentColor = "blue" }) => {
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
export const Chart: React.FC<{
  bars: { label: string; val: string }[];
  accentColor?: PaletteColorKey;
}> = ({ bars, accentColor = "blue" }) => (
  <div className="h-32 w-full flex items-end justify-between gap-3.5 pt-4">
    {bars.map((bar, idx) => (
      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
        <div className="w-full relative group h-full flex items-end">
          <div
            className={`w-full border-2 border-zinc-900 dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] rounded-none transition-all duration-300 ${bar.val} ${getBgClass(accentColor)}`}
          />
          <span className="absolute -top-7 left-1/2 translate-x-[-50%] text-[8.5px] font-mono bg-zinc-900 dark:bg-zinc-800 text-white border border-zinc-900 dark:border-white rounded-none px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {bar.val.replace("h-[", "").replace("%]", "")}%
          </span>
        </div>
        <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 font-mono tracking-wider block">{bar.label}</span>
      </div>
    ))}
  </div>
);

// 16. Breadcrumbs Component
export const Breadcrumbs: React.FC<{
  items: { label: string; active?: boolean }[];
  accentColor?: PaletteColorKey;
}> = ({ items, accentColor = "blue" }) => (
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
}> = ({ isOpen, onToggle, triggerText, items, accentColor = "blue", styleName = "neobrutalism" }) => (
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
}> = ({ isDragging, onDragOver, onDragLeave, onDrop, uploadedFiles = [], onRemoveFile, accentColor = "blue", styleName = "neobrutalism" }) => (
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

export const neobrutalism = {
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
