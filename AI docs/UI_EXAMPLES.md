# AI docs - UI Style Guide & Live Component Examples

This document serves as the architectural specification and implementation guide for the **UI Examples & Style Guide** module (`/ui-examples`). 

The goal of this page is to showcase high-fidelity, interactive implementations of common UI components (buttons, forms, toast notifications, cards, tabs, and stats) across seven distinct design styles: **Claymorphism, Neobrutalism, Glassmorphism, Liquid Glass, Bento Grid, Minimalism, and Modern Style (Branded SaaS)**.

---

## 1. Routing & Directory Structure
Following the **Feature-Based Colocation Architecture** defined in [CONTEXT.md](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/AI%20docs/CONTEXT.md), the module is placed in the `app/ui-examples/` directory using private folders (`_components`, `_utils`, etc.) for local helper components.

### Folder Layout:
```
app/
└── ui-examples/
    ├── _components/            <-- Colocated components (shared across styles)
    │   ├── StyleSelector.tsx    <-- Interactive navigation selector buttons
    │   ├── ComponentShowcase.tsx <-- Shared wrapper layout displaying components
    │   ├── ModalPreview.tsx     <-- Reusable style-adaptive overlay dialog box
    │   ├── Icons.tsx            <-- Inline SVG icons utility
    │   └── ToastContainer.tsx   <-- Dynamic client-side toast manager (adaptive animations)
    │
    ├── [style]/
    │   ├── page.tsx            <-- Dynamic style route (RSC with static parameters)
    │   └── layout.tsx          <-- Layout for individual style preview (sub-header toolbar)
    │
    ├── layout.tsx              <-- Global layout for /ui-examples (header, breadcrumbs, official logo)
    └── page.tsx                <-- Entry-point: Selector Dashboard
```

---

## 2. Interactive Customization Widget
Each dynamic preview page contains a highly visible **Customization Widget** rendered at the top of the viewport (or as Box 0 inside the Bento Grid layout). This widget includes:

1. **Accent Color Palette Picker**:
   Allows real-time modification of the primary accent color across six brand options:
   - **Pink** (`sakode-pink` / `#FF409F`)
   - **Orange** (`sakode-orange` / `#F9723B`)
   - **Yellow** (`sakode-yellow` / `#EDAC1C`)
   - **Blue** (`sakode-blue` / `#54A5E4`)
   - **Green** (`sakode-green` / `#009670`)
   - **Cyan** (`sakode-cyan` / `#71CFFE`)

2. **Highly Visible Light/Dark Theme Switcher**:
   A prominent segmented control block that allows testing components instantly in both light and dark backgrounds, responding to `next-themes` reactively.

> [!IMPORTANT]
> **Tailwind Dynamic Compilation Rule**: All utility classes are resolved via static string switches (`getBgClass`, `getGradientClass`, etc.) so Tailwind v4 compiles them successfully at build time.

---

## 3. UI Styles & Design Systems (Adaptive Accessibility)
Styles dynamically adapt to both Light and Dark modes to guarantee high contrast, legible text, and proper component visibility.

### A. Claymorphism (`claymorphism`)
* **Principle**: Soft puffy plastic look with inner/outer shadows.
* **Light/Dark Shadows**: Layers inset shadow configurations to achieve squishy volumes.

### B. Neobrutalism (`neobrutalism`)
* **Principle**: Flat high-contrast neon boxes with solid thick black borders and flat offset shadows.
* **Dark Mode Secondary Button Fix**: Buttons change background to `dark:bg-zinc-800 dark:text-white` to prevent white text on white bg.

### C. Glassmorphism (`glassmorphism`)
* **Principle**: Frosted translucent surface over blurs.
* **Light Mode Fix**: Opaque surface `bg-white/70`, dark borders `border-zinc-200`, text `text-zinc-800`.
* **Primary Button**: In Light Mode, uses solid brand colors (`bg-sakode-[color]`) with contrast-safe dark text (`text-zinc-950`) for yellow/cyan accents.

### D. Liquid Glass (`liquid-glass`)
* **Principle**: Translucent overlay floating over dynamic animated gradient liquid blobs.
* **Dark Mode Fix**: Background switches to `dark:bg-zinc-950/60` to maintain glossiness, with custom color-matching glowing shadows (`dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),_0_0_20px_-3px_rgba(brand,0.15)]`).

### E. Bento Grid (`bento-grid`)
* **Principle**: Tight, structured asymmetric grid. Customizer widget occupies Grid Box 0 at the top. Grid items span columns (`col-span-2`, `row-span-2`) responsively. Modal Showcase acts as Box 7 (span 1) in the bottom-right slot.

### F. Minimalism (`minimalism`)
* **Principle**: Monochromatic look, large whitespace, thin hairlines. Aksen warna hanya digunakan pada highlight border hover tombol dan links.

### G. Modern Style / Branded SaaS (`sakode-modern`) [NEW]
* **Principle**: A professional visual layout that combines sleek SaaS components, thin technological grid mesh overlays, and glowing ambient backdrops.
* **Backdrops**: Displays thin vector digital blueprint grid lines (`bg-size-[32px_32px]`) coupled with soft, radial glowing gradients behind elements to simulate modern computing environments.
* **Containers**: High-end rounded cards (`rounded-3xl`) styled with thin, precise borders (`border-zinc-200/50 dark:border-zinc-800/80`) and deep drop shadows (`shadow-lg dark:shadow-2xl`).
* **Gradient Elements**: Highlights primary items using vibrant gradients (`bg-linear-to-r from-sakode-pink via-sakode-orange to-sakode-yellow`) coupled with subtle micro-scale interactive elevations (`hover:scale-[1.02] active:scale-[0.98] transition-all`).

---

## 4. Current Showcase Components (Implemented)
1. **Form Elements**: TextInput, custom Select dropdown, Switch toggles, with success/error simulated validators.
2. **Buttons**: Solid, outline, loading (with SVG spinners), and icon configurations.
3. **Toasts**: Floating alert notifications (success, error, info) utilizing style-matching entrance animations.
4. **Dialog & Modals**: An overlay component (`ModalPreview.tsx`) triggered by a theme-aligned action button. It matches the background blurs, spring rates, or borders of the parent visual style.
5. **Cards & Panels**: Mentor bio avatar templates, course previews, and interactive metrics counters.

---

## 5. Upcoming Showcase Components (Under Discussion)
To support advanced full-page templates in Sakode Academy, the following components are defined in the design library pipeline:

1. **Accordion / Collapse** (Syllabus & FAQ list)
2. **Steps / Progress Timeline** (Registration progress & Path milestones)
3. **Badge & Status Tag** (Difficulty level & transactional status tag)
4. **Avatar Group** (Enrolled students list)
5. **Alert & Callout Panels** (Announcements/System notices banner)
6. **Data Grid / Table** (Mentoring calendar appointments & payment transaction log sheets)
7. **Card Carousel / Slider** (Alumni reviews & recommendations)
8. **Interactive SVG Charts / Graphs** (Student progress stats & booking distribution)
9. **Breadcrumbs / Navigation Path** (Subpage breadcrumbs)
10. **Dropdown / Context Menus** (Action options overlay)
11. **Drag & Drop File Upload Zone** (Assignment submission box)

---
*Updated by Antigravity AI - 2026-06-23*
