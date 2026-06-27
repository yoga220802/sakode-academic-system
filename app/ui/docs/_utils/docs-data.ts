import { PaletteColorKey } from "@/UI/shared/color-utils";

export interface TemplateParams {
  style?: string;
  accentColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  ascentColor?: string;
  variant?: string;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  content?: string;
  placeholder?: string;
  value?: string;
  hasError?: boolean;
  checked?: boolean;
  activeId?: number | null;
  activeIndex?: number;
  extraCount?: number;
  type?: string;
  title?: string;
  toastType?: string;
  toastMessage?: string;
  isOpen?: boolean;
  isDragging?: boolean;
}

export interface ComponentDoc {
  name: string;
  description: string;
  props: {
    name: string;
    type: string;
    defaultValue: string;
    description: string;
  }[];
  codeTemplate: (params: TemplateParams) => string;
}

export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  Button: {
    name: "Button",
    description: "Komponen tombol interaktif dengan animasi mikro (whileTap/hover) berbasis Framer Motion, serta status loading spinner terintegrasi.",
    props: [
      { name: "variant", type: "'primary' | 'secondary'", defaultValue: "'primary'", description: "Menentukan gaya visual utama atau alternatif (outline/soft)." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Warna aksen latar belakang untuk varian primary." },
      { name: "isLoading", type: "boolean", defaultValue: "false", description: "Menampilkan ikon pemutar spinner dan menonaktifkan klik tombol." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Menonaktifkan interaksi tombol." },
    ],
    codeTemplate: ({ style, accentColor, variant, isLoading, disabled, label }: TemplateParams) => {
      const parts = [];
      if (variant !== "primary") parts.push(`variant="${variant}"`);
      if (accentColor !== "pink" && variant === "primary") parts.push(`accentColor="${accentColor}"`);
      if (isLoading) parts.push("isLoading");
      if (disabled) parts.push("disabled");
      
      const propsStr = parts.length > 0 ? " " + parts.join(" ") : "";
      return `import { Button } from "@/UI/${style}";

// Contoh Penggunaan
<Button${propsStr}>
  ${label || "Daftar Sekarang"}
</Button>`;
    }
  },
  Card: {
    name: "Card",
    description: "Kontainer panel pembungkus informasi utama yang menyesuaikan drop shadow, border-radius, border, dan glassmorphism efek berdasarkan gaya terpilih.",
    props: [
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "undefined", description: "Menentukan warna aksen border/bayangan (opsional pada beberapa gaya)." },
      { name: "className", type: "string", defaultValue: "''", description: "Kelas CSS Tailwind tambahan untuk kustomisasi ukuran/layout." },
    ],
    codeTemplate: ({ style, accentColor, content }: TemplateParams) => {
      const accentProp = accentColor ? ` accentColor="${accentColor}"` : "";
      return `import { Card, Heading } from "@/UI/${style}";

// Contoh Penggunaan
<Card${accentProp}>
  <Heading>Kartu Informasi</Heading>
  <p className="text-sm text-zinc-500">${content || "Isi konten kartu di sini."}</p>
</Card>`;
    }
  },
  Input: {
    name: "Input",
    description: "Input teks standar untuk pengisian formulir dengan visual focus rings dan state error yang terintegrasi.",
    props: [
      { name: "hasError", type: "boolean", defaultValue: "false", description: "Menandai input dalam keadaan tidak valid (memunculkan border merah)." },
      { name: "placeholder", type: "string", defaultValue: "undefined", description: "Teks bantuan di dalam kolom input." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Menonaktifkan input teks." },
    ],
    codeTemplate: ({ style, hasError, placeholder, disabled, value }: TemplateParams) => {
      const parts = [];
      if (placeholder) parts.push(`placeholder="${placeholder}"`);
      if (hasError) parts.push("hasError");
      if (disabled) parts.push("disabled");
      if (value) parts.push(`value="${value}"`);

      const propsStr = parts.length > 0 ? " " + parts.join(" ") : "";
      return `import { Input } from "@/UI/${style}";

// Contoh Penggunaan
<Input${propsStr} />`;
    }
  },
  Select: {
    name: "Select",
    description: "Elemen dropdown untuk memilih satu opsi dari daftar pilihan.",
    props: [
      { name: "hasError", type: "boolean", defaultValue: "false", description: "Menandai pilihan dalam keadaan error." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Menonaktifkan dropdown menu." },
    ],
    codeTemplate: ({ style, hasError, disabled }: TemplateParams) => {
      const parts = [];
      if (hasError) parts.push("hasError");
      if (disabled) parts.push("disabled");

      const propsStr = parts.length > 0 ? " " + parts.join(" ") : "";
      return `import { Select } from "@/UI/${style}";

// Contoh Penggunaan
<Select${propsStr}>
  <option value="">Pilih Program</option>
  <option value="nextjs">Next.js Bootcamp</option>
  <option value="nodejs">Node.js Backend</option>
</Select>`;
    }
  },
  Toggle: {
    name: "Toggle",
    description: "Switch toggle on/off yang mendukung aksesibilitas (WAI-ARIA) dan visualisasi status yang lancar.",
    props: [
      { name: "checked", type: "boolean", defaultValue: "false", description: "Menentukan apakah status aktif (true) atau tidak (false)." },
      { name: "onChange", type: "() => void", defaultValue: "undefined", description: "Aksi callback yang dipicu ketika status toggle diubah." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Warna aksen latar saat toggle berstatus aktif." },
    ],
    codeTemplate: ({ style, checked, accentColor }: TemplateParams) => {
      const accentProp = accentColor !== "pink" ? ` accentColor="${accentColor}"` : "";
      return `import { Toggle } from "@/UI/${style}";

// Contoh Penggunaan
<Toggle 
  checked={${checked}} 
  onChange={() => handleToggle()}${accentProp}
  aria-label="Contoh Switch"
/>`;
    }
  },
  Accordion: {
    name: "Accordion",
    description: "Daftar runtutan panel lipat (collapse) yang cocok digunakan untuk silabus kelas atau daftar FAQ.",
    props: [
      { name: "items", type: "{ id: number; q: string; a: string }[]", defaultValue: "[]", description: "Array berisi objek pertanyaan (q) dan jawaban (a)." },
      { name: "activeId", type: "number | null", defaultValue: "null", description: "ID accordion item yang sedang terbuka." },
      { name: "onToggle", type: "(id: number) => void", defaultValue: "undefined", description: "Callback dipicu ketika menekan tombol header item." },
    ],
    codeTemplate: ({ style, activeId }: TemplateParams) => {
      return `import { Accordion } from "@/UI/${style}";

const faqItems = [
  { id: 1, q: "Apa itu Next.js?", a: "Framework React untuk Production." },
  { id: 2, q: "Apa itu Tailwind?", a: "Utility-first CSS framework." }
];

// Contoh Penggunaan
<Accordion 
  items={faqItems}
  activeId={${activeId === undefined ? null : activeId}}
  onToggle={(id) => handleToggleId(id)}
/>`;
    }
  },
  Timeline: {
    name: "Timeline",
    description: "Langkah-langkah berurutan atau penanda milstone (steps timeline) pendaftaran.",
    props: [
      { name: "steps", type: "{ step: string; title: string; desc: string }[]", defaultValue: "[]", description: "Daftar objek langkah pendaftaran." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Warna lingkaran nomor langkah aktif." },
    ],
    codeTemplate: ({ style, accentColor }: TemplateParams) => {
      const accentProp = accentColor !== "pink" ? ` accentColor="${accentColor}"` : "";
      return `import { Timeline } from "@/UI/${style}";

const pendaftaranSteps = [
  { step: "01", title: "Registrasi", desc: "Buat akun baru." },
  { step: "02", title: "Pilih Kelas", desc: "Pilih jalur belajar." }
];

// Contoh Penggunaan
<Timeline steps={pendaftaranSteps}${accentProp} />`;
    }
  },
  Badge: {
    name: "Badge",
    description: "Tag status berukuran mini untuk menunjukkan level tingkat kesulitan atau status pembayaran.",
    props: [
      { name: "variant", type: "'accent' | 'success' | 'warning' | 'default'", defaultValue: "'default'", description: "Varian status visual badge." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Warna dasar jika variant diset ke 'accent'." },
    ],
    codeTemplate: ({ style, variant, accentColor, label }: TemplateParams) => {
      const parts = [];
      if (variant !== "default") parts.push(`variant="${variant}"`);
      if (accentColor !== "pink" && variant === "accent") parts.push(`accentColor="${accentColor}"`);

      const propsStr = parts.length > 0 ? " " + parts.join(" ") : "";
      return `import { Badge } from "@/UI/${style}";

// Contoh Penggunaan
<Badge${propsStr}>
  ${label || "Pemula (Basic)"}
</Badge>`;
    }
  },
  AvatarGroup: {
    name: "AvatarGroup",
    description: "Menampilkan daftar murid aktif sekelas dalam tumpukan lingkaran avatar bertumpuk.",
    props: [
      { name: "initials", type: "string[]", defaultValue: "[]", description: "Daftar inisial siswa (maksimal 4 disarankan)." },
      { name: "extraCount", type: "number", defaultValue: "0", description: "Angka tambahan sisa siswa terdaftar (+X)." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Warna aksen lingkaran counter tambahan." },
    ],
    codeTemplate: ({ style, extraCount, accentColor }: TemplateParams) => {
      return `import { AvatarGroup } from "@/UI/${style}";

// Contoh Penggunaan
<AvatarGroup 
  initials={["AN", "RY", "CL"]} 
  extraCount={${extraCount || 10}}
  accentColor="${accentColor}"
/>`;
    }
  },
  Alert: {
    name: "Alert",
    description: "Panel pesan peringatan penting atau notifikasi pengumuman dari sistem akademis.",
    props: [
      { name: "title", type: "string", defaultValue: "undefined", description: "Judul tebal pengumuman." },
      { name: "type", type: "'info' | 'warning'", defaultValue: "'info'", description: "Menentukan warna latar belakang dan ikon peringatan." },
    ],
    codeTemplate: ({ style, type, title, content }: TemplateParams) => {
      const typeProp = type !== "info" ? ` type="${type}"` : "";
      return `import { Alert } from "@/UI/${style}";

// Contoh Penggunaan
<Alert title="${title || "Pemberitahuan Sistem"}"${typeProp}>
  ${content || "Mentoring akan segera dimulai."}
</Alert>`;
    }
  },
  Table: {
    name: "Table",
    description: "Tabel log jadwal mentoring atau invoice pembayaran akademik yang rapi dan adaptif.",
    props: [
      { name: "schedules", type: "{ course: string; date: string; mentor: string; status: string }[]", defaultValue: "[]", description: "Data baris log jadwal." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Warna highlight baris aktif." },
    ],
    codeTemplate: ({ style, accentColor }: TemplateParams) => {
      const accentProp = accentColor !== "pink" ? ` accentColor="${accentColor}"` : "";
      return `import { Table } from "@/UI/${style}";

const dataSchedules = [
  { course: "Next.js", date: "24 Juni", mentor: "Rian Y.", status: "Aktif" }
];

// Contoh Penggunaan
<Table schedules={dataSchedules}${accentProp} />`;
    }
  },
  Carousel: {
    name: "Carousel",
    description: "Komponen review alumni/slider testimoni dengan tombol geser halaman testimoni aktif.",
    props: [
      { name: "testimonials", type: "{ name: string; role: string; review: string }[]", defaultValue: "[]", description: "Array berisi data testimoni." },
      { name: "activeIndex", type: "number", defaultValue: "0", description: "Index data testimoni aktif saat ini." },
      { name: "onPrev", type: "() => void", defaultValue: "undefined", description: "Callback tombol navigasi sebelumnya." },
      { name: "onNext", type: "() => void", defaultValue: "undefined", description: "Callback tombol navigasi berikutnya." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Aksen warna visual pelengkap carousel." },
    ],
    codeTemplate: ({ style, activeIndex, accentColor }: TemplateParams) => {
      const accentProp = accentColor !== "pink" ? ` accentColor="${accentColor}"` : "";
      return `import { Carousel } from "@/UI/${style}";

const reviews = [
  { name: "Andi", role: "Siswa", review: "Sangat menyenangkan!" }
];

// Contoh Penggunaan
<Carousel 
  testimonials={reviews} 
  activeIndex={${activeIndex}} 
  onPrev={() => handlePrev()} 
  onNext={() => handleNext()}${accentProp}
/>`;
    }
  },
  Chart: {
    name: "Chart",
    description: "Statistik visual batang asimetris dari tugas mingguan menggunakan markup murni CSS-First Tailwind.",
    props: [
      { name: "bars", type: "{ label: string; val: string }[]", defaultValue: "[]", description: "Array berisi label dan kelas persentase tinggi ('h-[X%]')." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Aksen warna grafik batang." },
    ],
    codeTemplate: ({ style, accentColor }: TemplateParams) => {
      const accentProp = accentColor !== "pink" ? ` accentColor="${accentColor}"` : "";
      return `import { Chart } from "@/UI/${style}";

const barStats = [
  { label: "M1", val: "h-[30%]" },
  { label: "M2", val: "h-[70%]" }
];

// Contoh Penggunaan
<Chart bars={barStats}${accentProp} />`;
    }
  },
  Breadcrumbs: {
    name: "Breadcrumbs",
    description: "Petunjuk alur navigasi subhalaman kelas aktif.",
    props: [
      { name: "items", type: "{ label: string; active?: boolean }[]", defaultValue: "[]", description: "Daftar link navigasi halaman." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Warna tulisan menu aktif." },
    ],
    codeTemplate: ({ style, accentColor }: TemplateParams) => {
      const accentProp = accentColor !== "pink" ? ` accentColor="${accentColor}"` : "";
      return `import { Breadcrumbs } from "@/UI/${style}";

const pathItems = [
  { label: "Kelas" },
  { label: "Next.js", active: true }
];

// Contoh Penggunaan
<Breadcrumbs items={pathItems}${accentProp} />`;
    }
  },
  Dropdown: {
    name: "Dropdown",
    description: "Menu opsi tindakan profil melayang dengan penutup animasi transisi terintegrasi.",
    props: [
      { name: "isOpen", type: "boolean", defaultValue: "false", description: "Menampilkan/menyembunyikan daftar menu opsi." },
      { name: "onToggle", type: "() => void", defaultValue: "undefined", description: "Memicu buka tutup menu dropdown." },
      { name: "triggerText", type: "string", defaultValue: "undefined", description: "Teks tombol pemicu dropdown." },
      { name: "items", type: "{ label: string; onClick: () => void }[]", defaultValue: "[]", description: "Daftar aksi pilihan menu dropdown." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Aksen warna tombol dropdown." },
    ],
    codeTemplate: ({ style, isOpen, accentColor }: TemplateParams) => {
      const accentProp = accentColor !== "pink" ? ` accentColor="${accentColor}"` : "";
      return `import { Dropdown } from "@/UI/${style}";

const options = [
  { label: "Dashboard", onClick: () => openDashboard() }
];

// Contoh Penggunaan
<Dropdown
  isOpen={${isOpen}}
  onToggle={() => handleToggleDropdown()}
  triggerText="Opsi Profil"
  items={options}${accentProp}
/>`;
    }
  },
  UploadZone: {
    name: "UploadZone",
    description: "Kotak area seret file (drag and drop) untuk pengumpulan tugas belajar murid.",
    props: [
      { name: "isDragging", type: "boolean", defaultValue: "false", description: "State drag aktif ketika file melayang di atas area." },
      { name: "onDragOver", type: "(e: DragEvent) => void", defaultValue: "undefined", description: "Handler event drag over." },
      { name: "onDragLeave", type: "() => void", defaultValue: "undefined", description: "Handler event drag leave." },
      { name: "onDrop", type: "(e: DragEvent) => void", defaultValue: "undefined", description: "Handler event drop file." },
      { name: "uploadedFiles", type: "string[]", defaultValue: "[]", description: "Daftar nama-nama file yang berhasil diunggah." },
      { name: "onRemoveFile", type: "(index: number) => void", defaultValue: "undefined", description: "Handler membatalkan upload file tertentu." },
      { name: "accentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Warna border area ketika file di-drag." },
    ],
    codeTemplate: ({ style, isDragging, accentColor }: TemplateParams) => {
      const accentProp = accentColor !== "pink" ? ` accentColor="${accentColor}"` : "";
      return `import { UploadZone } from "@/UI/${style}";

// Contoh Penggunaan
<UploadZone
  isDragging={${isDragging}}
  onDragOver={(e) => handleDragOver(e)}
  onDragLeave={() => handleDragLeave()}
  onDrop={(e) => handleDrop(e)}
  uploadedFiles={["tugas_frontend.zip"]}
  onRemoveFile={(idx) => handleRemove(idx)}${accentProp}
/>`;
    }
  },
  Toast: {
    name: "Toast",
    description: "Notifikasi melayang yang muncul di pojok kanan atas layar dengan warna dan animasi masuk yang sesuai dengan tema visual.",
    props: [
      { name: "type", type: "'success' | 'error' | 'info'", defaultValue: "'success'", description: "Menentukan jenis informasi dan ikon toast." },
      { name: "message", type: "string", defaultValue: "undefined", description: "Pesan utama yang ditampilkan di dalam toast." },
    ],
    codeTemplate: ({ toastType, toastMessage }: TemplateParams) => {
      return `import { showToast } from "@/app/ui/_components/ToastContainer";

// Memicu Notifikasi Toast
showToast("${toastType || "success"}", "${toastMessage || "Selamat! Akun belajar Anda telah aktif."}");`;
    }
  },
  Modal: {
    name: "Modal",
    description: "Dialog overlay interaktif dengan efek background blur, border, dan spring rate transisi animasi sesuai gaya visual terpilih.",
    props: [
      { name: "isOpen", type: "boolean", defaultValue: "false", description: "Mengatur apakah modal dalam kondisi terbuka." },
      { name: "onClose", type: "() => void", defaultValue: "undefined", description: "Aksi callback untuk mendeteksi penutupan modal." },
      { name: "style", type: "string", defaultValue: "undefined", description: "Gaya visual yang disematkan ke modal." },
      { name: "primaryColor", type: "PaletteColorKey", defaultValue: "'cyan'", description: "Warna aksen utama modal (Primary)." },
      { name: "secondaryColor", type: "PaletteColorKey", defaultValue: "'orange'", description: "Warna aksen alternatif modal (Secondary)." },
      { name: "ascentColor", type: "PaletteColorKey", defaultValue: "'pink'", description: "Warna aksen penanda modal (Ascent)." },
    ],
    codeTemplate: ({ style, primaryColor, secondaryColor, ascentColor }: TemplateParams) => {
      return `import ModalPreview from "@/app/ui/_components/ModalPreview";

// Contoh Penggunaan
<ModalPreview
  isOpen={isOpen}
  onClose={() => handleCloseModal()}
  style="${style}"
  primaryColor="${primaryColor || "cyan"}"
  secondaryColor="${secondaryColor || "orange"}"
  ascentColor="${ascentColor || "pink"}"
/>`;
    }
  }
};
