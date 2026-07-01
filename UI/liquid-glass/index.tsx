import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Icons } from "../shared/Icons";
import { PaletteColorKey, getBgClass, getGradientClass, getShadow20Class, getLiquidGlassShadow, getFocusRingClass, getBgOpacity15Class, getBgOpacity20Class, getBgOpacity25Class, getBgOpacity5Class, getBorderClass, getGradientBgLightClass, getTextClass, getBorderRadiusClass } from "../shared/color-utils";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { accentColor?: PaletteColorKey }> = ({ className = "", accentColor = "blue", children, ...props }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tracking cursor relative offset (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Springs to smoothen real-time rotation transition
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { damping: 25, stiffness: 200 });
  
  // Shine cursor coordinates relative to card element
  const [shinePos, setShinePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(relativeX);
    y.set(relativeY);
    
    setShinePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
      className={`relative p-6 text-zinc-800 dark:text-white/90 transition-shadow duration-300 ${className}`}
      {...(props as any)}
    >
      {/* Liquid Glass Background layer with directional borders */}
      <div 
        className={`absolute inset-0 z-0 bg-white/75 dark:bg-zinc-950/50 backdrop-blur-2xl rounded-2xl shadow-2xl ${getLiquidGlassShadow(accentColor)} border-t border-l border-t-white/35 border-l-white/35 border-b border-r border-b-white/10 border-r-white/10`}
      />

      {/* Specular Corner Shine (Water Drop highlight effect) */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35)_0%,transparent_70%)] pointer-events-none rounded-tl-2xl z-10" />

      {/* Specular Highlight Gloss (Light Refraction) Overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${shinePos.x}px ${shinePos.y}px, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%)`,
          }}
        />
      )}
      
      {/* Content wrapper popped out slightly to create 3D depth with sharp rendering */}
      <div style={{ transform: "translate3d(0, 0, 0.01px)", backfaceVisibility: "hidden" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export const Heading: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", children, ...props }) => (
  <h3 className={`text-lg font-bold text-zinc-850 dark:text-white/90 mb-4 ${className}`} {...props}>
    {children}
  </h3>
);

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = "", children, ...props }) => (
  <label className={`block text-xs font-semibold text-zinc-500 dark:text-white/70 mb-1.5 ${className}`} {...props}>
    {children}
  </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean; accentColor?: PaletteColorKey }>(
  ({ className = "", hasError, accentColor = "blue", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full bg-white/60 dark:bg-black/25 border border-zinc-200 dark:border-white/15 rounded-xl py-2.5 px-4 focus:ring-2 ${getFocusRingClass(accentColor)} focus:outline-hidden text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/40 transition-all ${
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
      className={`w-full bg-white/60 dark:bg-black/25 border border-zinc-200 dark:border-white/15 rounded-xl py-2.5 px-4 focus:ring-2 ${getFocusRingClass(accentColor)} focus:outline-hidden text-zinc-900 dark:text-white appearance-none cursor-pointer bg-white dark:bg-zinc-900 ${
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
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-zinc-300 dark:border-white/25 transition-colors duration-200 ease-in-out focus:outline-hidden ${
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

export const Button = React.forwardRef<HTMLButtonElement, Omit<HTMLMotionProps<"button">, "ref" | "children"> & { children?: React.ReactNode; } & { variant?: "primary" | "secondary"; accentColor?: PaletteColorKey; isLoading?: boolean; isGradient?: boolean }>(
  ({ className = "", children, variant = "primary", accentColor = "blue", isLoading, isGradient, ...props }, ref) => {
    let btnClass = "";
    if (variant === "primary") {
      const textColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-zinc-950 font-bold" : "text-white";
      if (isGradient) {
        btnClass = `bg-gradient-to-r ${getGradientClass(accentColor)} hover:opacity-90 ${textColor} rounded-xl font-semibold py-2.5 px-5 shadow-lg ${getShadow20Class(accentColor)} transition-all duration-300 shrink-0`;
      } else {
        btnClass = `${getBgClass(accentColor)} hover:opacity-90 ${textColor} rounded-xl font-semibold py-2.5 px-5 shadow-lg ${getShadow20Class(accentColor)} transition-all duration-300 shrink-0`;
      }
    } else {
      btnClass = `bg-zinc-800/5 hover:bg-zinc-800/10 dark:bg-white/5 dark:hover:bg-white/12 ${getTextClass(accentColor)} dark:text-white/90 border border-zinc-300 dark:border-white/10 rounded-xl font-medium py-2.5 px-5 transition-all shrink-0`;
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
  <div className="space-y-4">
    {items.map((item) => {
      const isOpen = activeId === item.id;
      return (
        <div
          key={item.id}
          className="bg-white/15 dark:bg-white/4 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden"
        >
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className={`w-full flex items-center justify-between p-4.5 font-bold text-left transition-colors ${
              isOpen ? "bg-white/20 dark:bg-white/10" : "bg-transparent hover:bg-white/10 dark:hover:bg-white/5"
            }`}
          >
            <span className="text-sm">{item.q}</span>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center bg-white/25 dark:bg-white/10 border border-white/20 dark:border-white/10 shadow-sm transform transition-all duration-300 ${isOpen ? "rotate-45" : ""}`}>
              <Icons.Plus className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
            </span>
          </button>
          {isOpen && (
            <div className="p-4.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 border-t border-white/15 dark:border-white/5 bg-white/5 dark:bg-black/15">
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
  const textColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-zinc-955" : "text-white";
  return (
    <div className="relative pl-7 border-l-2 border-white/15 dark:border-white/5 space-y-7">
      {steps.map((item, idx) => (
        <div key={idx} className="relative animate-fade-in">
          <span className={`absolute -left-10 top-0.5 w-7.5 h-7.5 rounded-full flex items-center justify-center text-[10px] font-black ${textColor} bg-linear-to-br ${getGradientClass(accentColor)} border border-white/40 dark:border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.15)] shadow-current/10 backdrop-blur-md`}>
            {item.step}
          </span>
          <div>
            <h4 className="text-sm font-black text-zinc-900 dark:text-white leading-tight">{item.title}</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1">{item.desc}</p>
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
    default: "bg-white/25 text-zinc-700 dark:bg-white/5 dark:text-zinc-300 border-white/20 dark:border-white/10",
    accent: `bg-linear-to-br ${getGradientClass(accentColor)} ${isDarkText ? "text-zinc-955 font-extrabold" : "text-white font-bold"} border-white/40 dark:border-white/20 shadow-md`,
    success: "bg-emerald-500/25 text-emerald-800 dark:bg-emerald-955/20 dark:text-emerald-350 border-emerald-500/30 dark:border-emerald-500/15 shadow-xs",
    warning: "bg-amber-500/25 text-amber-800 dark:bg-amber-955/20 dark:text-amber-350 border-amber-500/30 dark:border-amber-500/15 shadow-xs",
  };

  return (
    <span className={`text-[10px] font-extrabold px-3.5 py-1 rounded-full border backdrop-blur-md ${badgeColors[variant]}`}>
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
  const extraTextColor = (accentColor === "yellow" || accentColor === "cyan") ? "text-zinc-955" : "text-white";
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2.5 overflow-hidden p-0.5">
        {initials.map((initial, idx) => (
          <div
            key={idx}
            className="inline-block h-8 w-8 rounded-full border border-white/25 dark:border-white/10 bg-white/20 dark:bg-white/5 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 text-center leading-7 shadow-xs backdrop-blur-md"
          >
            {initial}
          </div>
        ))}
        <div className={`inline-block h-8 w-8 rounded-full border border-white/40 dark:border-white/20 bg-linear-to-br ${getGradientClass(accentColor)} ${extraTextColor} flex items-center justify-center text-[9px] font-black shadow-md backdrop-blur-md`}>
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
    ? "bg-amber-500/15 text-amber-900 dark:text-amber-250 border-t-amber-400/40 border-l-amber-400/40 border-b-amber-600/15 border-r-amber-600/15"
    : "bg-sky-500/15 text-sky-900 dark:text-sky-250 border-t-sky-400/40 border-l-sky-400/40 border-b-sky-600/15 border-r-sky-600/15";
  return (
    <div className={`relative flex items-start gap-3.5 p-4 rounded-xl border backdrop-blur-xl ${bgClass} text-xs overflow-hidden shadow-sm`}>
      {/* Specular corner highlight */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3)_0%,transparent_70%)] pointer-events-none rounded-tl-xl z-0" />
      
      {isWarning ? <Icons.AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-500 relative z-10" /> : <Icons.Info className="w-4.5 h-4.5 shrink-0 mt-0.5 text-sky-500 relative z-10" />}
      <div className="relative z-10">
        <span className="font-black block mb-0.5">{title}</span>
        <div className="leading-relaxed font-semibold opacity-95">{children}</div>
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
// 15. Chart Component
export const Chart: React.FC<{
  bars: { label: string; val: string }[];
  accentColor?: PaletteColorKey;
}> = ({ bars, accentColor = "blue" }) => (
  <div className="h-32 w-full flex items-end justify-between gap-3 pt-4">
    {bars.map((bar, idx) => (
      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
        <div className="w-full relative group h-full flex items-end overflow-hidden rounded-t-xl">
          <div
            className={`w-full rounded-t-xl border-t border-l border-r border-t-white/30 border-l-white/30 border-r-white/15 transition-all duration-300 ${bar.val} bg-gradient-to-t ${getGradientClass(accentColor)} opacity-90`}
          />
          {/* Liquid specular vertical sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent pointer-events-none z-0 rounded-t-xl" />
          <span className="absolute -top-7 left-1/2 translate-x-[-50%] text-[9px] font-black bg-white/25 dark:bg-black/35 text-zinc-900 dark:text-white border-t border-l border-white/30 backdrop-blur-md rounded-md px-2 py-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {bar.val.replace("h-[", "").replace("%]", "")}%
          </span>
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">{bar.label}</span>
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
}> = ({ isOpen, onToggle, triggerText, items, accentColor = "blue", styleName = "liquid-glass" }) => (
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
}> = ({ isDragging, onDragOver, onDragLeave, onDrop, uploadedFiles = [], onRemoveFile, accentColor = "blue", styleName = "liquid-glass" }) => (
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

export const liquidGlass = {
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
