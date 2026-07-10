export const PALETTE_COLORS = [
  {
    key: "cyan",
    name: "Cyan",
    hex: "#71CFFE",
    class: "sakode-cyan",
    secondary: "blue",
  },
  {
    key: "orange",
    name: "Orange",
    hex: "#F9723B",
    class: "sakode-orange",
    secondary: "pink",
  },
  {
    key: "yellow",
    name: "Kuning",
    hex: "#EDAC1C",
    class: "sakode-yellow",
    secondary: "orange",
  },
  {
    key: "charcoal",
    name: "Charcoal",
    hex: "#383838",
    class: "sakode-charcoal",
    secondary: "blue",
  },
  {
    key: "green",
    name: "Hijau",
    hex: "#009670",
    class: "sakode-green",
    secondary: "cyan",
  },
  {
    key: "blue",
    name: "Biru",
    hex: "#54A5E4",
    class: "sakode-blue",
    secondary: "cyan",
  },
  {
    key: "red",
    name: "Merah",
    hex: "#F94052",
    class: "sakode-red",
    secondary: "pink",
  },
  {
    key: "pink",
    name: "Pink",
    hex: "#FF409F",
    class: "sakode-pink",
    secondary: "purple",
  },
  {
    key: "purple",
    name: "Ungu",
    hex: "#BC71FE",
    class: "sakode-purple",
    secondary: "pink",
  },
] as const;

export type PaletteColorKey =
  (typeof PALETTE_COLORS)[number]["key"];

export type PaletteColor = (typeof PALETTE_COLORS)[number];

/* =========================================================
   Palette Lookup
   ========================================================= */

export const getPaletteColor = (
  color: PaletteColorKey,
): PaletteColor | undefined => {
  return PALETTE_COLORS.find((item) => item.key === color);
};

export const getPaletteHex = (
  color: PaletteColorKey,
): string => {
  return getPaletteColor(color)?.hex ?? "#54A5E4";
};

/* =========================================================
   Static Tailwind Class Map
   ========================================================= */

interface PaletteClassSet {
  bg: string;
  bg90: string;
  bg25: string;
  bg20: string;
  bg15: string;
  bg10: string;
  bg5: string;
  hoverBg: string;
  hoverBorder: string;
  border: string;
  text: string;
  shadow20: string;
  focusRing: string;
}

const paletteClassMap: Record<
  PaletteColorKey,
  PaletteClassSet
> = {
  cyan: {
    bg: "bg-sakode-cyan",
    bg90: "bg-sakode-cyan/90",
    bg25: "bg-sakode-cyan/25",
    bg20: "bg-sakode-cyan/20",
    bg15: "bg-sakode-cyan/15",
    bg10: "bg-sakode-cyan/10",
    bg5: "bg-sakode-cyan/5",
    hoverBg: "hover:bg-sakode-cyan",
    hoverBorder: "hover:border-sakode-cyan",
    border: "border-sakode-cyan",
    text: "text-sakode-cyan",
    shadow20: "shadow-sakode-cyan/20",
    focusRing: "focus:ring-sakode-cyan/35",
  },

  orange: {
    bg: "bg-sakode-orange",
    bg90: "bg-sakode-orange/90",
    bg25: "bg-sakode-orange/25",
    bg20: "bg-sakode-orange/20",
    bg15: "bg-sakode-orange/15",
    bg10: "bg-sakode-orange/10",
    bg5: "bg-sakode-orange/5",
    hoverBg: "hover:bg-sakode-orange",
    hoverBorder: "hover:border-sakode-orange",
    border: "border-sakode-orange",
    text: "text-sakode-orange",
    shadow20: "shadow-sakode-orange/20",
    focusRing: "focus:ring-sakode-orange/35",
  },

  yellow: {
    bg: "bg-sakode-yellow",
    bg90: "bg-sakode-yellow/90",
    bg25: "bg-sakode-yellow/25",
    bg20: "bg-sakode-yellow/20",
    bg15: "bg-sakode-yellow/15",
    bg10: "bg-sakode-yellow/10",
    bg5: "bg-sakode-yellow/5",
    hoverBg: "hover:bg-sakode-yellow",
    hoverBorder: "hover:border-sakode-yellow",
    border: "border-sakode-yellow",
    text: "text-sakode-yellow",
    shadow20: "shadow-sakode-yellow/20",
    focusRing: "focus:ring-sakode-yellow/35",
  },

  charcoal: {
    bg: "bg-sakode-charcoal",
    bg90: "bg-sakode-charcoal/90",
    bg25: "bg-sakode-charcoal/25",
    bg20: "bg-sakode-charcoal/20",
    bg15: "bg-sakode-charcoal/15",
    bg10: "bg-sakode-charcoal/10",
    bg5: "bg-sakode-charcoal/5",
    hoverBg: "hover:bg-sakode-charcoal",
    hoverBorder: "hover:border-sakode-charcoal",
    border: "border-sakode-charcoal",
    text: "text-sakode-charcoal",
    shadow20: "shadow-sakode-charcoal/20",
    focusRing: "focus:ring-sakode-charcoal/35",
  },

  green: {
    bg: "bg-sakode-green",
    bg90: "bg-sakode-green/90",
    bg25: "bg-sakode-green/25",
    bg20: "bg-sakode-green/20",
    bg15: "bg-sakode-green/15",
    bg10: "bg-sakode-green/10",
    bg5: "bg-sakode-green/5",
    hoverBg: "hover:bg-sakode-green",
    hoverBorder: "hover:border-sakode-green",
    border: "border-sakode-green",
    text: "text-sakode-green",
    shadow20: "shadow-sakode-green/20",
    focusRing: "focus:ring-sakode-green/35",
  },

  blue: {
    bg: "bg-sakode-blue",
    bg90: "bg-sakode-blue/90",
    bg25: "bg-sakode-blue/25",
    bg20: "bg-sakode-blue/20",
    bg15: "bg-sakode-blue/15",
    bg10: "bg-sakode-blue/10",
    bg5: "bg-sakode-blue/5",
    hoverBg: "hover:bg-sakode-blue",
    hoverBorder: "hover:border-sakode-blue",
    border: "border-sakode-blue",
    text: "text-sakode-blue",
    shadow20: "shadow-sakode-blue/20",
    focusRing: "focus:ring-sakode-blue/35",
  },

  red: {
    bg: "bg-sakode-red",
    bg90: "bg-sakode-red/90",
    bg25: "bg-sakode-red/25",
    bg20: "bg-sakode-red/20",
    bg15: "bg-sakode-red/15",
    bg10: "bg-sakode-red/10",
    bg5: "bg-sakode-red/5",
    hoverBg: "hover:bg-sakode-red",
    hoverBorder: "hover:border-sakode-red",
    border: "border-sakode-red",
    text: "text-sakode-red",
    shadow20: "shadow-sakode-red/20",
    focusRing: "focus:ring-sakode-red/35",
  },

  pink: {
    bg: "bg-sakode-pink",
    bg90: "bg-sakode-pink/90",
    bg25: "bg-sakode-pink/25",
    bg20: "bg-sakode-pink/20",
    bg15: "bg-sakode-pink/15",
    bg10: "bg-sakode-pink/10",
    bg5: "bg-sakode-pink/5",
    hoverBg: "hover:bg-sakode-pink",
    hoverBorder: "hover:border-sakode-pink",
    border: "border-sakode-pink",
    text: "text-sakode-pink",
    shadow20: "shadow-sakode-pink/20",
    focusRing: "focus:ring-sakode-pink/35",
  },

  purple: {
    bg: "bg-sakode-purple",
    bg90: "bg-sakode-purple/90",
    bg25: "bg-sakode-purple/25",
    bg20: "bg-sakode-purple/20",
    bg15: "bg-sakode-purple/15",
    bg10: "bg-sakode-purple/10",
    bg5: "bg-sakode-purple/5",
    hoverBg: "hover:bg-sakode-purple",
    hoverBorder: "hover:border-sakode-purple",
    border: "border-sakode-purple",
    text: "text-sakode-purple",
    shadow20: "shadow-sakode-purple/20",
    focusRing: "focus:ring-sakode-purple/35",
  },
};

/* =========================================================
   Basic Class Helpers
   ========================================================= */

export const getBgClass = (
  color: PaletteColorKey,
): string => paletteClassMap[color].bg;

export const getBgOpacity90Class = (
  color: PaletteColorKey,
): string => paletteClassMap[color].bg90;

export const getBgOpacity25Class = (
  color: PaletteColorKey,
): string => paletteClassMap[color].bg25;

export const getBgOpacity20Class = (
  color: PaletteColorKey,
): string => paletteClassMap[color].bg20;

export const getBgOpacity15Class = (
  color: PaletteColorKey,
): string => paletteClassMap[color].bg15;

export const getBgOpacity10Class = (
  color: PaletteColorKey,
): string => paletteClassMap[color].bg10;

export const getBgOpacity5Class = (
  color: PaletteColorKey,
): string => paletteClassMap[color].bg5;

export const getBgHoverClass = (
  color: PaletteColorKey,
): string => paletteClassMap[color].hoverBg;

export const getBorderHoverClass = (
  color: PaletteColorKey,
): string => paletteClassMap[color].hoverBorder;

export const getBorderClass = (
  color: PaletteColorKey,
): string => paletteClassMap[color].border;

export const getTextClass = (
  color: PaletteColorKey,
): string => paletteClassMap[color].text;

export const getShadow20Class = (
  color: PaletteColorKey,
): string => paletteClassMap[color].shadow20;

export const getFocusRingClass = (
  color: PaletteColorKey,
): string => paletteClassMap[color].focusRing;

/* =========================================================
   Main Gradient Classes
   ========================================================= */

/**
 * Tambahkan class arah gradient pada komponen, misalnya:
 *
 * bg-linear-to-r
 * bg-linear-to-br
 * bg-linear-to-b
 */
const gradientMap: Record<PaletteColorKey, string> = {
  cyan:
    "from-sakode-cyan via-sakode-blue to-sakode-purple",

  blue:
    "from-sakode-blue via-sakode-cyan to-sakode-purple",

  orange:
    "from-sakode-orange to-sakode-pink",

  yellow:
    "from-sakode-yellow to-sakode-orange",

  green:
    "from-sakode-green to-sakode-cyan",

  red:
    "from-sakode-red to-sakode-pink",

  pink:
    "from-sakode-pink to-sakode-purple",

  purple:
    "from-sakode-purple to-sakode-pink",

  charcoal:
    "from-sakode-charcoal to-sakode-blue",
};

export const getGradientClass = (
  color: PaletteColorKey,
): string => gradientMap[color];

/* =========================================================
   Light Gradient Background Classes
   ========================================================= */

const gradientBgLightMap: Record<
  PaletteColorKey,
  string
> = {
  cyan:
    "from-sakode-cyan/20 via-sakode-blue/10 to-sakode-purple/10",

  blue:
    "from-sakode-blue/20 via-sakode-cyan/10 to-sakode-purple/10",

  orange:
    "from-sakode-orange/15 to-sakode-pink/10",

  yellow:
    "from-sakode-yellow/20 to-sakode-orange/10",

  green:
    "from-sakode-green/15 to-sakode-cyan/15",

  red:
    "from-sakode-red/15 to-sakode-pink/10",

  pink:
    "from-sakode-pink/15 to-sakode-purple/10",

  purple:
    "from-sakode-purple/15 to-sakode-pink/10",

  charcoal:
    "from-sakode-charcoal/10 to-sakode-blue/10",
};

export const getGradientBgLightClass = (
  color: PaletteColorKey,
): string => gradientBgLightMap[color];

/* =========================================================
   Recommended Brand Gradients
   ========================================================= */

export const SAKODE_GRADIENTS = {
  brand:
    "from-sakode-blue via-sakode-cyan to-sakode-purple",

  primaryButton:
    "from-sakode-orange to-sakode-pink",

  learning:
    "from-sakode-green to-sakode-cyan",

  warm:
    "from-sakode-yellow to-sakode-orange",

  creative:
    "from-sakode-purple to-sakode-pink",

  danger:
    "from-sakode-red to-sakode-pink",

  dark:
    "from-sakode-charcoal to-sakode-blue",
} as const;

export type SakodeGradientKey =
  keyof typeof SAKODE_GRADIENTS;

export const getSakodeGradient = (
  gradient: SakodeGradientKey,
): string => SAKODE_GRADIENTS[gradient];

/* =========================================================
   Liquid Glass Dark Shadows
   ========================================================= */

const liquidGlassShadowMap: Record<
  PaletteColorKey,
  string
> = {
  cyan:
    "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(113,207,254,0.15)]",

  orange:
    "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(249,114,59,0.15)]",

  yellow:
    "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(237,172,28,0.15)]",

  charcoal:
    "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(56,56,56,0.15)]",

  green:
    "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(0,150,112,0.15)]",

  blue:
    "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(84,165,228,0.15)]",

  red:
    "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(249,64,82,0.15)]",

  pink:
    "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(255,64,159,0.15)]",

  purple:
    "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(188,113,254,0.15)]",
};

export const getLiquidGlassShadow = (
  color: PaletteColorKey,
): string => liquidGlassShadowMap[color];

/* =========================================================
   Border Radius by UI Style
   ========================================================= */

export type SakodeUIStyle =
  | "neobrutalism"
  | "claymorphism"
  | "glassmorphism"
  | "liquid-glass"
  | "minimalism"
  | "bento-grid"
  | "sakode-modern";

export const getBorderRadiusClass = (
  style: string,
): string => {
  if (
    style === "neobrutalism" ||
    style === "minimalism"
  ) {
    return "rounded-none";
  }

  if (style === "bento-grid") {
    return "rounded-xl";
  }

  return "rounded-2xl";
};

/* =========================================================
   Hex and HSL Utilities
   ========================================================= */

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

/**
 * Menormalisasi format hex menjadi 6 karakter tanpa tanda #.
 */
function normalizeHex(hex: string): string {
  const cleanHex = hex.trim().replace(/^#/, "");

  if (/^[0-9a-fA-F]{3}$/.test(cleanHex)) {
    return cleanHex
      .split("")
      .map((character) => character + character)
      .join("")
      .toUpperCase();
  }

  if (/^[0-9a-fA-F]{6}$/.test(cleanHex)) {
    return cleanHex.toUpperCase();
  }

  throw new Error(
    `Invalid HEX color: "${hex}". Use format #RGB or #RRGGBB.`,
  );
}

export function hexToHsl(hex: string): HslColor {
  const normalizedHex = normalizeHex(hex);

  const red =
    parseInt(normalizedHex.substring(0, 2), 16) / 255;

  const green =
    parseInt(normalizedHex.substring(2, 4), 16) / 255;

  const blue =
    parseInt(normalizedHex.substring(4, 6), 16) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  let hue = 0;
  let saturation = 0;

  const lightness = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;

    saturation =
      lightness > 0.5
        ? delta / (2 - max - min)
        : delta / (max + min);

    switch (max) {
      case red:
        hue =
          (green - blue) / delta +
          (green < blue ? 6 : 0);
        break;

      case green:
        hue = (blue - red) / delta + 2;
        break;

      case blue:
        hue = (red - green) / delta + 4;
        break;
    }

    hue /= 6;
  }

  return {
    h: Math.round(hue * 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

export function hslToHex(
  h: number,
  s: number,
  l: number,
): string {
  const normalizedHue = ((h % 360) + 360) % 360;
  const normalizedSaturation = Math.min(
    100,
    Math.max(0, s),
  );
  const normalizedLightness = Math.min(
    100,
    Math.max(0, l),
  );

  const saturation = normalizedSaturation / 100;
  const lightness = normalizedLightness / 100;

  const chroma =
    (1 - Math.abs(2 * lightness - 1)) * saturation;

  const hueSection = normalizedHue / 60;

  const secondaryComponent =
    chroma *
    (1 - Math.abs((hueSection % 2) - 1));

  const matchValue = lightness - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (normalizedHue < 60) {
    red = chroma;
    green = secondaryComponent;
  } else if (normalizedHue < 120) {
    red = secondaryComponent;
    green = chroma;
  } else if (normalizedHue < 180) {
    green = chroma;
    blue = secondaryComponent;
  } else if (normalizedHue < 240) {
    green = secondaryComponent;
    blue = chroma;
  } else if (normalizedHue < 300) {
    red = secondaryComponent;
    blue = chroma;
  } else {
    red = chroma;
    blue = secondaryComponent;
  }

  const toHex = (value: number): string =>
    Math.round((value + matchValue) * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

/* =========================================================
   Color Relationship Utilities
   ========================================================= */

export function getComplementary(hex: string): string {
  const { h, s, l } = hexToHsl(hex);

  return hslToHex((h + 180) % 360, s, l);
}

/**
 * Menghasilkan split complementary pertama pada sudut +150°.
 */
export function getSplitComplementary(
  hex: string,
): string {
  const { h, s, l } = hexToHsl(hex);

  return hslToHex((h + 150) % 360, s, l);
}

/**
 * Menghasilkan dua warna split complementary:
 * +150° dan +210°.
 */
export function getSplitComplementaryPair(
  hex: string,
): [string, string] {
  const { h, s, l } = hexToHsl(hex);

  return [
    hslToHex((h + 150) % 360, s, l),
    hslToHex((h + 210) % 360, s, l),
  ];
}