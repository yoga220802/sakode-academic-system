export interface UIStyleInfo {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  bgGradient: string;
  colorName: string;
  tags: string[];
}

export const UI_STYLES: UIStyleInfo[] = [
  {
    slug: "claymorphism",
    name: "Claymorphism",
    description: "Estetika 3D lembut yang menyerupai plastisin atau tanah liat dengan bayangan ganda (inner & outer shadows).",
    longDescription:
      "Claymorphism menggabungkan warna pastel lembut dengan sudut membulat yang lebar (rounded-3xl) dan bayangan dalam (inset shadow) ganda untuk menciptakan ilusi kedalaman 3D yang empuk dan taktil. Sangat populer untuk desain antarmuka yang ramah dan interaktif.",
    bgGradient: "from-pink-400 to-indigo-400",
    colorName: "sakode-pink",
    tags: ["3D Soft", "Inner Shadows", "Friendly", "Rounded Corners"],
  },
  {
    slug: "neobrutalism",
    name: "Neobrutalism",
    description: "Desain kontras tinggi dengan garis tepi hitam tebal, warna neon solid, dan bayangan tajam bersudut 90 derajat.",
    longDescription:
      "Mendobrak aturan desain konvensional, Neobrutalism menggunakan warna dasar yang berani (seperti kuning kunyit sakode), border tebal hitam tanpa blur, tipografi sans-serif tebal/monospace, serta efek melayang instan ketika ditekan. Estetikanya mentah, tegas, dan modern.",
    bgGradient: "from-amber-400 to-orange-500",
    colorName: "sakode-yellow",
    tags: ["High Contrast", "Solid Shadows", "Raw Grid", "Bold Typography"],
  },
  {
    slug: "glassmorphism",
    name: "Glassmorphism",
    description: "Efek panel kaca buram semi-transparan dengan backdrop blur yang mengapung di atas latar belakang gradasi.",
    longDescription:
      "Glassmorphism berfokus pada sifat translusen panel (frosted glass) menggunakan backdrop-blur. Panel diletakkan di atas gradasi warna kontras, dikelilingi border putih tipis semi-transparan untuk merefleksikan pembiasan cahaya layaknya kaca fisik.",
    bgGradient: "from-purple-500 via-indigo-500 to-blue-500",
    colorName: "sakode-cyan",
    tags: ["Translucent", "Backdrop Blur", "Reflective Borders", "Subtle Glows"],
  },
  {
    slug: "liquid-glass",
    name: "Liquid Glass",
    description: "Variasi glassmorphism tingkat lanjut dengan elemen cair (liquid blobs) organik yang bergerak di belakang kaca pembias.",
    longDescription:
      "Liquid Glass mengambil estetika glassmorphism dan meningkatkannya dengan menempatkan SVG/blob cair organik yang bergerak secara asinkron di belakang panel kaca super buram. Menghasilkan efek pembiasan lensa (refraction) yang sangat premium dan hidup.",
    bgGradient: "from-rose-400 via-sakode-orange to-sakode-yellow",
    colorName: "sakode-orange",
    tags: ["Dynamic Blobs", "Hyper-refraction", "Organic Motion", "Vibrant"],
  },
  {
    slug: "bento-grid",
    name: "Bento Grid",
    description: "Tata letak modular asimetris berbentuk kotak-kotak mirip kotak bekal Jepang untuk mengorganisasi informasi secara rapi.",
    longDescription:
      "Bento Grid menyusun berbagai komponen yang berbeda ukuran ke dalam grid modular yang ketat. Menggunakan pembagian kolom dan baris yang responsif, layout ini memberikan struktur visual hierarkis yang sangat baik untuk dashboard dan portofolio.",
    bgGradient: "from-teal-400 to-emerald-500",
    colorName: "sakode-green",
    tags: ["Modular Grid", "Asymmetric Layout", "Dashboard Focus", "Responsive"],
  },
  {
    slug: "minimalism",
    name: "Minimalism",
    description: "Keindahan dalam kesederhanaan dengan ruang bernapas yang luas, garis tipis, palet warna monokromatik, dan fokus penuh pada konten.",
    longDescription:
      "Minimalism adalah estetika yang mengutamakan fungsi dengan menghilangkan elemen dekoratif berlebih. Desainnya bergantung pada penggunaan ruang putih (whitespace), tipografi kecil yang presisi, border garis tipis (hairlines), serta transisi linear yang sangat halus.",
    bgGradient: "from-zinc-300 to-zinc-500 dark:from-zinc-700 dark:to-zinc-900",
    colorName: "sakode-charcoal",
    tags: ["Monochromatic", "Whitespace", "Fine Hairlines", "Clean Typo"],
  },
  {
    slug: "sakode-modern",
    name: "Modern Style",
    description: "Gaya visual SaaS modern berkelas industri dengan pola garis kisi-kisi teknologi, mesh gradients berpendar lembut, dan tombol-tombol gradasi cerah.",
    longDescription:
      "Menggabungkan latar belakang kisi-kisi (grid blueprint) digital yang presisi, pendaran cahaya radial (mesh glow) yang futuristik, kartu semi-transparan ber-border tipis dengan sudut sangat melengkung (rounded-3xl), serta aksen gradasi dinamis untuk menghasilkan tampilan antarmuka premium yang bersih dan profesional.",
    bgGradient: "from-sakode-pink via-sakode-orange to-sakode-yellow",
    colorName: "sakode-pink",
    tags: ["Branded Grid", "Mesh Gradients", "Sleek SaaS", "High Rounded"],
  },
];
