# AI docs - Custom UI Component Architecture & Extensions Guide

This document is the architectural blueprint, design specification, and step-by-step developer guide for the local, custom namespace-based UI component engine of **Sakode Academy** (located under `@/UI`). 

It details the current file structure, available components, design guidelines, and the step-by-step procedure for adding new components to the system.

---

## 1. Directory Structure & Architecture
To prevent Next.js App Router from treating UI style components as routes, the design system is placed in the root-level `UI/` folder, mapped via the `@/UI` path alias.

### Folder Layout:
```
sakode-academy/ (Root)
├── app/
│   └── ui/                     <-- Showcase routing page (/ui)
│       └── _components/
│           ├── ComponentShowcase.tsx <-- Renders style-adaptive interactive elements
│           └── ModalPreview.tsx     <-- Style-adaptive modal overlay
│
└── UI/                             <-- Custom Component Library (Strict Namespace Code)
    ├── index.ts                    <-- Main entry-point exporting all namespaces
    ├── shared/                     <-- Utility functions & asset files
    │   ├── color-utils.ts          <-- Color palette static classes mapping (Tailwind v4 safe)
    │   └── Icons.tsx               <-- Central SVG icons mapping
    │
    ├── claymorphism/               <-- Claymorphism Namespace Components
    │   └── index.tsx               <-- Exports claymorphism.Card, claymorphism.Button, etc.
    ├── neobrutalism/               <-- Neobrutalism Namespace Components
    │   └── index.tsx
    ├── glassmorphism/              <-- Glassmorphism Namespace Components
    │   └── index.tsx
    ├── liquid-glass/               <-- Liquid Glass Namespace Components
    │   └── index.tsx
    ├── bento-grid/                 <-- Bento Grid Namespace Components
    │   └── index.tsx
    ├── minimalism/                 <-- Minimalism Namespace Components
    │   └── index.tsx
    └── sakode-modern/              <-- Modern Style Namespace Components
        └── index.tsx
```

---

## 2. Currently Implemented Components (18 Total)
Every style folder exports an object containing the following 18 components:

### Core Elements (Form & Interactive)
1. **`Card`**: Main border/shadow container for information.
2. **`Heading`**: Styled typography for headers.
3. **`Label`**: Small, prominent text label for inputs.
4. **`Input`**: Standard text input component with custom style-matching focus rings and validation error borders.
5. **`Select`**: Dropdown component with styled options.
6. **`Toggle`**: Accent-colored Switch toggle (`role="switch"`, `aria-checked`).
7. **`Button`**: Interactive trigger supporting variants (`primary` | `secondary`), `isLoading` state (with SVG spinners), and Framer Motion micro-interactions.

### Layout & Information Presentation
8. **`Accordion`**: Expandable syllabus/FAQ panels.
9. **`Timeline`**: Timeline milestones (registration progress, path milestones).
10. **`Badge`**: Visual status tag (`default`, `accent`, `success`, `warning`).
11. **`AvatarGroup`**: Stacked initials/avatars overlay.
12. **`Alert`**: Styled system banners/notices.
13. **`Table`**: Data grids for calendar appointments & billing.
14. **`Carousel`**: Alumni review carousel with active slide index transition controls.
15. **`Chart`**: Interactive bar chart built with semantic HTML & Framer Motion.
16. **`Breadcrumbs`**: Contextual subpage navigation paths.
17. **`Dropdown`**: Hoverable/clickable context actions menu overlay.
18. **`UploadZone`**: Drag-and-drop file submission container.

---

## 3. How to Use Custom UI Components in the Codebase

Import the global `UI` namespace and destructure or call components dynamically using the style name.

### Static Call Example:
```tsx
import { claymorphism } from "@/UI";

export default function MyWidget() {
  return (
    <claymorphism.Card>
      <claymorphism.Heading>Daftar Sesi</claymorphism.Heading>
      <claymorphism.Button variant="primary" accentColor="pink">
        Mulai Belajar
      </claymorphism.Button>
    </claymorphism.Card>
  );
}
```

### Dynamic Resolution Example (e.g. in /ui):
```tsx
import { UI as UIStyles } from "@/UI";

export default function AdaptiveCard({ styleName }: { styleName: string }) {
  // Resolve theme dynamically from namespace dictionary
  const UI = UIStyles[styleName as keyof typeof UIStyles] || UIStyles["sakode-modern"];
  
  return (
    <UI.Card>
      <UI.Heading>Selamat Datang</UI.Heading>
    </UI.Card>
  );
}
```

---

## 4. How to Add a New Component to All Custom UIs
When the design requirements call for a new component (e.g., adding a `<styleName>.Tooltip`), follow these steps precisely to maintain system integrity.

### Step 1: Write the component for each UI Style
Open each of the seven style folders and implement the component in its `index.tsx` file. Ensure that the styling complies with that style's visual guidelines.

> [!IMPORTANT]
> **Accessibility Check**: Always include appropriate HTML semantics and `aria-*` parameters where necessary.

#### Claymorphism Tooltip Example (`UI/claymorphism/index.tsx`):
```tsx
export const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
  <div className="relative group inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 px-3 py-1.5 text-xs text-slate-800 dark:text-zinc-100 bg-slate-50/95 dark:bg-zinc-800/90 rounded-xl shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.06),_inset_3px_3px_6px_rgba(255,255,255,0.9),_4px_4px_12px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-zinc-800/10">
      {content}
    </div>
  </div>
);
```

#### Neobrutalism Tooltip Example (`UI/neobrutalism/index.tsx`):
```tsx
export const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
  <div className="relative group inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 px-3 py-1.5 text-xs font-mono font-black text-zinc-900 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,1)]">
      {content}
    </div>
  </div>
);
```

### Step 2: Add the Component to the Export Object
At the bottom of each style's `index.tsx`, append your new component to the default export mapping.

```typescript
// Inside UI/claymorphism/index.tsx:
export const claymorphism = {
  Card,
  Heading,
  // ... (existing exports)
  UploadZone,
  Tooltip // <-- Add this line
};
```
Make sure you repeat this step for `neobrutalism`, `glassmorphism`, `liquid-glass`, `bento-grid`, `minimalism`, and `sakode-modern`.

### Step 3: Update the Dynamic Types
To avoid TypeScript errors when pages resolve components dynamically, you must update the TypeScript interface types.

Open [app/ui/_components/ComponentShowcase.tsx](../app/ui/_components/ComponentShowcase.tsx) and [app/ui/_components/ModalPreview.tsx](../app/ui/_components/ModalPreview.tsx) (and any other dynamic showcase scripts):

Add the new component signature to the `UIStyleComponentSet` (or the local UI cast type definition):
```typescript
type UIStyleComponentSet = {
  Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { accentColor?: PaletteColorKey }>;
  // ...
  UploadZone: React.FC<{ ... }>;
  Tooltip: React.FC<{ content: string; children: React.ReactNode }>; // <-- Add this line
};
```

### Step 4: Add the Component to the Showcase Route
To test and demonstrate the new component:
1. Open [ComponentShowcase.tsx](../app/ui/_components/ComponentShowcase.tsx).
2. Create a rendering function for the new component, e.g.:
   ```tsx
   const renderTooltipSection = () => (
     <UI.Card accentColor={selectedColor}>
       <UI.Heading>19. Tooltip Hint</UI.Heading>
       <UI.Tooltip content="Informasi detail mengenai materi kursus">
         <span className="cursor-pointer underline">Arahkan Kursor Ke Sini</span>
       </UI.Tooltip>
     </UI.Card>
   );
   ```
3. Place `renderTooltipSection()` into the page layouts (both the Bento Grid layout block and the default Sequential Flow columns).

### Step 5: Test and Verify the Compilation
Always verify compilation to make sure there are no syntax or TypeScript type checking errors.

Run the following validation command:
```bash
cmd.exe /c npm run build
```

---

## 5. Coding & Tailwind v4 Safety Rules

When coding custom UI components, enforce these rules strictly:

> [!CAUTION]
> **No Dynamic Tailwind String Interpolation**:
> Do not write class names like `bg-sakode-${accentColor}` or `border-${color}-500`. Tailwind CSS v4 scans code statically and will NOT compile dynamically interpolated strings. 
> Instead, map the keys to static class names in [color-utils.ts](../UI/shared/color-utils.ts) and call the helpers (e.g., `getBgClass(accentColor)`).

* **Color contrast guidelines**: Text contrast must comply with accessibility specifications:
  * Black text (`text-zinc-950` or `text-zinc-900`) must be used over **Yellow** or **Cyan** backgrounds.
  * White text (`text-white`) must be used over **Pink**, **Orange**, **Blue**, or **Green** backgrounds.
* **Framer Motion Types**: Union types on motion attributes might sometimes throw errors in React 19. If you encounter event mapping conflicts, cast the handlers or transitions to `as any`.
