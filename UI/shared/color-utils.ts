export type PaletteColorKey = "pink" | "orange" | "yellow" | "blue" | "green" | "cyan";

export const PALETTE_COLORS = [
  { key: "pink", name: "Pink", hex: "#FF409F", class: "sakode-pink", secondary: "orange" },
  { key: "orange", name: "Orange", hex: "#F9723B", class: "sakode-orange", secondary: "yellow" },
  { key: "yellow", name: "Kuning", hex: "#EDAC1C", class: "sakode-yellow", secondary: "orange" },
  { key: "blue", name: "Biru", hex: "#54A5E4", class: "sakode-blue", secondary: "cyan" },
  { key: "green", name: "Hijau", hex: "#009670", class: "sakode-green", secondary: "blue" },
  { key: "cyan", name: "Cyan", hex: "#71CFFE", class: "sakode-cyan", secondary: "blue" },
] as const;

export const getBgClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink";
    case "orange": return "bg-sakode-orange";
    case "yellow": return "bg-sakode-yellow";
    case "blue": return "bg-sakode-blue";
    case "green": return "bg-sakode-green";
    case "cyan": return "bg-sakode-cyan";
  }
};

export const getBgOpacity90Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink/90";
    case "orange": return "bg-sakode-orange/90";
    case "yellow": return "bg-sakode-yellow/90";
    case "blue": return "bg-sakode-blue/90";
    case "green": return "bg-sakode-green/90";
    case "cyan": return "bg-sakode-cyan/90";
  }
};

export const getBgHoverClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "hover:bg-sakode-pink";
    case "orange": return "hover:bg-sakode-orange";
    case "yellow": return "hover:bg-sakode-yellow";
    case "blue": return "hover:bg-sakode-blue";
    case "green": return "hover:bg-sakode-green";
    case "cyan": return "hover:bg-sakode-cyan";
  }
};

export const getBorderHoverClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "hover:border-sakode-pink";
    case "orange": return "hover:border-sakode-orange";
    case "yellow": return "hover:border-sakode-yellow";
    case "blue": return "hover:border-sakode-blue";
    case "green": return "hover:border-sakode-green";
    case "cyan": return "hover:border-sakode-cyan";
  }
};

export const getShadow20Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "shadow-sakode-pink/20";
    case "orange": return "shadow-sakode-orange/20";
    case "yellow": return "shadow-sakode-yellow/20";
    case "blue": return "shadow-sakode-blue/20";
    case "green": return "shadow-sakode-green/20";
    case "cyan": return "shadow-sakode-cyan/20";
  }
};

export const getBgOpacity25Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink/25";
    case "orange": return "bg-sakode-orange/25";
    case "yellow": return "bg-sakode-yellow/25";
    case "blue": return "bg-sakode-blue/25";
    case "green": return "bg-sakode-green/25";
    case "cyan": return "bg-sakode-cyan/25";
  }
};

export const getBgOpacity20Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink/20";
    case "orange": return "bg-sakode-orange/20";
    case "yellow": return "bg-sakode-yellow/20";
    case "blue": return "bg-sakode-blue/20";
    case "green": return "bg-sakode-green/20";
    case "cyan": return "bg-sakode-cyan/20";
  }
};

export const getBgOpacity15Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink/15";
    case "orange": return "bg-sakode-orange/15";
    case "yellow": return "bg-sakode-yellow/15";
    case "blue": return "bg-sakode-blue/15";
    case "green": return "bg-sakode-green/15";
    case "cyan": return "bg-sakode-cyan/15";
  }
};

export const getBgOpacity5Class = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "bg-sakode-pink/5";
    case "orange": return "bg-sakode-orange/5";
    case "yellow": return "bg-sakode-yellow/5";
    case "blue": return "bg-sakode-blue/5";
    case "green": return "bg-sakode-green/5";
    case "cyan": return "bg-sakode-cyan/5";
  }
};

export const getTextClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "text-sakode-pink";
    case "orange": return "text-sakode-orange";
    case "yellow": return "text-sakode-yellow";
    case "blue": return "text-sakode-blue";
    case "green": return "text-sakode-green";
    case "cyan": return "text-sakode-cyan";
  }
};

export const getBorderClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "border-sakode-pink";
    case "orange": return "border-sakode-orange";
    case "yellow": return "border-sakode-yellow";
    case "blue": return "border-sakode-blue";
    case "green": return "border-sakode-green";
    case "cyan": return "border-sakode-cyan";
  }
};

export const getFocusRingClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "focus:ring-sakode-pink/35";
    case "orange": return "focus:ring-sakode-orange/35";
    case "yellow": return "focus:ring-sakode-yellow/35";
    case "blue": return "focus:ring-sakode-blue/35";
    case "green": return "focus:ring-sakode-green/35";
    case "cyan": return "focus:ring-sakode-cyan/35";
  }
};

export const getGradientClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "from-sakode-pink to-sakode-orange";
    case "orange": return "from-sakode-orange to-sakode-yellow";
    case "yellow": return "from-sakode-yellow to-sakode-orange";
    case "blue": return "from-sakode-blue to-sakode-cyan";
    case "green": return "from-sakode-green to-sakode-blue";
    case "cyan": return "from-sakode-cyan to-sakode-blue";
  }
};

export const getGradientBgLightClass = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "from-sakode-pink/15 to-sakode-orange/20";
    case "orange": return "from-sakode-orange/15 to-sakode-yellow/20";
    case "yellow": return "from-sakode-yellow/15 to-sakode-orange/20";
    case "blue": return "from-sakode-blue/15 to-sakode-cyan/20";
    case "green": return "from-sakode-green/15 to-sakode-blue/20";
    case "cyan": return "from-sakode-cyan/15 to-sakode-blue/20";
  }
};

export const getLiquidGlassShadow = (color: PaletteColorKey) => {
  switch (color) {
    case "pink": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(255,64,159,0.15)]";
    case "orange": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(249,114,59,0.15)]";
    case "yellow": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(237,172,28,0.15)]";
    case "blue": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(84,165,228,0.15)]";
    case "green": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(0,150,112,0.15)]";
    case "cyan": return "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(113,207,254,0.15)]";
  }
};

export const getBorderRadiusClass = (style: string) => {
  if (style === "neobrutalism" || style === "minimalism") return "rounded-none";
  if (style === "bento-grid") return "rounded-xl";
  return "rounded-2xl";
};
