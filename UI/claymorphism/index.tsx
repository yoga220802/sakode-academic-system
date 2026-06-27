import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Icons } from "../shared/Icons";
import {
  PaletteColorKey,
  getBgClass,
  getBgOpacity15Class,
  getBgOpacity20Class,
  getBgOpacity25Class,
  getBgOpacity5Class,
  getBorderClass,
  getGradientClass,
  getGradientBgLightClass,
  getTextClass,
  getBorderRadiusClass
} from "../shared/color-utils";

// 1. Card Component
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { accentColor?: PaletteColorKey }> = ({ className = "", accentColor, children, ...props }) => (
  <div
    className={`bg-slate-50/90 dark:bg-zinc-800/40 rounded-3xl p-6 shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.06),_inset_6px_6px_12px_rgba(255,255,255,0.9),_8px_8px_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.3),_inset_6px_6px_12px_rgba(255,255,255,0.08),_8px_8px_20px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-zinc-800/10 text-slate-800 dark:text-zinc-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// 2. Heading Component
export const Heading: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", children, ...props }) => (
  <h3 className={`text-lg font-bold text-slate-800 dark:text-white mb-4 ${className}`} {...props}>
    {children}
  </h3>
);

// 3. Label Component
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = "", children, ...props }) => (
  <label className={`block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1.5 ${className}`} {...props}>
    {children}
  </label>
);

// 4. Input Component
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }>(
  ({ className = "", hasError, ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full bg-slate-100/80 dark:bg-zinc-900/60 rounded-2xl py-2.5 px-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),_inset_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),_inset_-3px_-3px_6px_rgba(255,255,255,0.05)] border-0 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden transition-all text-slate-800 dark:text-zinc-100 ${
        hasError ? "border-2 border-sakode-red focus:ring-sakode-red/30 dark:border-sakode-red" : ""
      } ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

// 5. Select Component
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }>(
  ({ className = "", hasError, children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full bg-slate-100/80 dark:bg-zinc-900/60 rounded-2xl py-2.5 px-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),_inset_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),_inset_-3px_-3px_6px_rgba(255,255,255,0.05)] border-0 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden transition-all text-slate-800 dark:text-zinc-100 appearance-none cursor-pointer bg-white dark:bg-zinc-900 ${
        hasError ? "border-2 border-sakode-red focus:ring-sakode-red/30 dark:border-sakode-red" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

// 6. Toggle Component
export const Toggle: React.FC<{ checked: boolean; onChange: () => void; accentColor?: PaletteColorKey; "aria-label"?: string }> = ({ checked, onChange, accentColor = "pink", ...props }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked ? "true" : "false"}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
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

// 7. Button Component
export const Button = React.forwardRef<HTMLButtonElement, Omit<HTMLMotionProps<"button">, "ref" | "children"> & { children?: React.ReactNode; variant?: "primary" | "secondary"; accentColor?: PaletteColorKey; isLoading?: boolean }>(
  ({ className = "", children, variant = "primary", accentColor = "pink", isLoading, ...props }, ref) => {
    let btnClass = "";
    if (variant === "primary") {
      const textColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-zinc-950 font-bold" : "text-white";
      btnClass = `${getBgClass(accentColor)} ${textColor} rounded-2xl font-bold py-2.5 px-5 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.15),_inset_4px_4px_8px_rgba(255,255,255,0.35),_2px_4px_8px_rgba(0,0,0,0.1)] hover:scale-102 active:scale-98 transition-all shrink-0`;
    } else {
      btnClass = "bg-indigo-50 dark:bg-zinc-700/30 hover:bg-indigo-100 dark:hover:bg-zinc-700/50 text-indigo-700 dark:text-indigo-300 rounded-2xl font-bold py-2.5 px-5 shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.05),_inset_3px_3px_6px_rgba(255,255,255,0.7),_2px_2px_6px_rgba(0,0,0,0.06)] hover:scale-102 active:scale-98 transition-all shrink-0";
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
          className={`overflow-hidden rounded-2xl border border-slate-100/80 dark:border-zinc-800/25 bg-slate-50/50 dark:bg-zinc-800/10 transition-all duration-300 ${
            isOpen
              ? "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),_inset_-2px_-2px_4px_rgba(255,255,255,0.8),_4px_4px_8px_rgba(0,0,0,0.05)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),_inset_-2px_-2px_4px_rgba(255,255,255,0.06)]"
              : "shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.05),_inset_3px_3px_6px_rgba(255,255,255,0.9),_4px_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.3),_inset_3px_3px_6px_rgba(255,255,255,0.06),_4px_4px_10px_rgba(0,0,0,0.3)]"
          }`}
        >
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className="w-full flex items-center justify-between p-4 font-bold text-left transition-colors text-slate-800 dark:text-zinc-100"
          >
            <span className="text-sm">{item.q}</span>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.06),_inset_1px_1px_2px_rgba(255,255,255,0.9),_2px_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.3),_inset_1px_1px_2px_rgba(255,255,255,0.06),_2px_2px_4px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-zinc-700/50 transform transition-all duration-300 ${isOpen ? "rotate-45" : ""}`}>
              <Icons.Plus className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            </span>
          </button>
          {isOpen && (
            <div className="p-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/20 dark:bg-zinc-950/25">
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
}> = ({ steps, accentColor = "pink" }) => {
  const textColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-zinc-955" : "text-white";
  return (
    <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-6">
      {steps.map((item, idx) => (
        <div key={idx} className="relative">
          <span className={`absolute -left-8.75 top-0 w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-black ${textColor} ${getBgClass(accentColor)} border border-white/20 dark:border-black/10 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),_inset_2px_2px_4px_rgba(255,255,255,0.4),_2px_2px_6px_rgba(0,0,0,0.08)]`}>
            {item.step}
          </span>
          <div>
            <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight">{item.title}</h4>
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
}> = ({ children, accentColor = "pink", variant = "default" }) => {
  const isDarkText = accentColor === "yellow" || accentColor === "cyan";
  const badgeColors = {
    default: "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 border-slate-200/50 dark:border-zinc-700/50 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.9),_2px_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_inset_2px_2px_4px_rgba(255,255,255,0.06),_2px_2px_4px_rgba(0,0,0,0.2)]",
    accent: `${getBgClass(accentColor)} ${isDarkText ? "text-zinc-955" : "text-white"} border-white/20 dark:border-black/10 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),_inset_2px_2px_4px_rgba(255,255,255,0.4),_2px_2px_4px_rgba(0,0,0,0.08)]`,
    success: "bg-emerald-50 dark:bg-zinc-800/80 text-emerald-800 dark:text-emerald-350 border-emerald-300/40 dark:border-emerald-800/25 shadow-[inset_-2px_-2px_4px_rgba(0,100,50,0.06),_inset_2px_2px_4px_rgba(255,255,255,0.8),_2px_2px_4px_rgba(0,0,0,0.04)] dark:shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_inset_2px_2px_4px_rgba(255,255,255,0.06)]",
    warning: "bg-amber-50 dark:bg-zinc-800/80 text-amber-800 dark:text-amber-350 border-amber-300/40 dark:border-amber-800/25 shadow-[inset_-2px_-2px_4px_rgba(100,50,0,0.06),_inset_2px_2px_4px_rgba(255,255,255,0.8),_2px_2px_4px_rgba(0,0,0,0.04)] dark:shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_inset_2px_2px_4px_rgba(255,255,255,0.06)]",
  };

  return (
    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${badgeColors[variant]}`}>
      {children}
    </span>
  );
};

// 11. AvatarGroup Component
export const AvatarGroup: React.FC<{
  initials: string[];
  extraCount: number;
  accentColor?: PaletteColorKey;
}> = ({ initials, extraCount, accentColor = "pink" }) => {
  const extraTextColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-zinc-950" : "text-white";
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2.5 overflow-hidden p-0.5">
        {initials.map((initial, idx) => (
          <div
            key={idx}
            className="inline-block h-8 w-8 rounded-full border border-slate-100 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold text-slate-700 dark:text-zinc-300 text-center leading-8 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05),_inset_2px_2px_4px_rgba(255,255,255,0.9),_2px_2px_6px_rgba(0,0,0,0.05)] dark:shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_inset_2px_2px_4px_rgba(255,255,255,0.06)]"
          >
            {initial}
          </div>
        ))}
        <div className={`inline-block h-8 w-8 rounded-full border border-white/20 dark:border-black/10 ${getBgClass(accentColor)} ${extraTextColor} flex items-center justify-center text-[9px] font-black shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),_inset_2px_2px_4px_rgba(255,255,255,0.4),_2px_2px_6px_rgba(0,0,0,0.08)]`}>
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
  const colorClass = isWarning
    ? "bg-amber-50 dark:bg-zinc-800/80 border-amber-300/40 dark:border-amber-800/20 text-amber-900 dark:text-amber-300 shadow-[inset_-3px_-3px_8px_rgba(100,50,0,0.04),_inset_3px_3px_8px_rgba(255,255,255,0.9),_3px_3px_8px_rgba(0,0,0,0.03)] dark:shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.25),_inset_3px_3px_8px_rgba(255,255,255,0.05)]"
    : "bg-sky-50 dark:bg-zinc-800/80 border-sky-300/40 dark:border-sky-800/20 text-sky-900 dark:text-sky-300 shadow-[inset_-3px_-3px_8px_rgba(0,50,100,0.04),_inset_3px_3px_8px_rgba(255,255,255,0.9),_3px_3px_8px_rgba(0,0,0,0.03)] dark:shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.25),_inset_3px_3px_8px_rgba(255,255,255,0.05)]";

  return (
    <div className={`flex items-start gap-3.5 p-4.5 rounded-2xl border ${colorClass} text-xs`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-white/20 dark:border-black/10 shadow-[inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.1),_inset_1.5px_1.5px_3px_rgba(255,255,255,0.6)] ${isWarning ? "bg-amber-400 text-amber-950" : "bg-sky-400 text-sky-950"}`}>
        {isWarning ? <Icons.AlertTriangle className="w-4 h-4 shrink-0" /> : <Icons.Info className="w-4 h-4 shrink-0" />}
      </div>
      <div className="flex-1 space-y-1">
        <span className="font-extrabold text-sm block leading-none">{title}</span>
        <div className="text-zinc-600 dark:text-zinc-350 leading-relaxed font-medium">{children}</div>
      </div>
    </div>
  );
};

// 13. Table Component
export const Table: React.FC<{
  schedules: { course: string; date: string; mentor: string; status: string }[];
  accentColor?: PaletteColorKey;
}> = ({ schedules, accentColor = "pink" }) => (
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
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                item.status === "Selesai"
                  ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  : `${getBgOpacity15Class(accentColor)} ${getTextClass(accentColor)}`
              }`}>
                {item.status}
              </span>
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
}> = ({ testimonials, activeIndex, onPrev, onNext, accentColor = "pink" }) => {
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
  styleName?: string;
}> = ({ bars, accentColor = "pink" }) => (
  <div className="h-36 w-full flex items-end justify-between gap-3 pt-6 px-1">
    {bars.map((bar, idx) => (
      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
        <div className="w-full relative group h-full flex items-end">
          <div
            className={`w-full rounded-t-xl transition-all duration-300 ${bar.val} ${getBgClass(accentColor)} border-t border-x border-white/20 shadow-[inset_-3px_0_6px_rgba(0,0,0,0.18),_inset_3px_3px_6px_rgba(255,255,255,0.45),_2px_2px_8px_rgba(0,0,0,0.08)]`}
          />
          <span className="absolute -top-6.5 left-1/2 translate-x-[-50%] text-[8px] font-black bg-zinc-900/90 text-white rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            {bar.val.replace("h-[", "").replace("%]", "")}%
          </span>
        </div>
        <span className="text-[9px] font-bold text-zinc-400 tracking-wider block uppercase">{bar.label}</span>
      </div>
    ))}
  </div>
);

// 16. Breadcrumbs Component
export const Breadcrumbs: React.FC<{
  items: { label: string; active?: boolean }[];
  accentColor?: PaletteColorKey;
}> = ({ items, accentColor = "pink" }) => (
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
}> = ({ isOpen, onToggle, triggerText, items, accentColor = "pink", styleName = "claymorphism" }) => (
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
}> = ({ isDragging, onDragOver, onDragLeave, onDrop, uploadedFiles = [], onRemoveFile, accentColor = "pink", styleName = "claymorphism" }) => (
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

export const claymorphism = {
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
