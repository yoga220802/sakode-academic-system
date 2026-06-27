# Sakode Academy - Project Context & Fullstack Architecture Reference

Welcome! This document serves as the single source of truth for the **Sakode Academy** project. It outlines the project context, technical stack, and a strict architectural blueprint for both Frontend (FE) and Backend (BE) development. 

Any AI agent starting a new session in this workspace must read and adhere to this document to ensure consistent, clean, and modular code delivery.

---

## 1. Project Overview & Current Progress
**Sakode Academy** is a fullstack IT course learning portal designed for managing course registrations, trial classes, learning materials, and mentoring schedules.

* **Target Launch Date**: July 10, 2026 (`2026-07-10T00:00:00`)
* **Current Status**: 30% (Interactive welcome landing page, global aesthetics config switcher FAB supporting custom branding hex overrides, fully styled `/login` & `/register` routes under route group `(auth)`, dynamic client-side `AuthProvider` session manager, and unified RBAC adaptive `/dashboard` with widgets for Murid, Mentor, Mentor Lead, and Admin are fully completed)
* **Subscribers File**: Emails registered via the newsletter are saved locally to `data/subscribers.json`

---

## 2. Core Features (Project Roadmap)
The application will consist of 5 core fullstack modules:
1. **Pendaftaran Siswa Baru (Student Registration)**: Registration pipeline for new IT students to sign up for classes.
2. **Pendaftaran Trial Gratis (Trial Registration)**: Booking system for free trial sessions to experience the platform.
3. **Modul Pembelajaran IT (Learning Modules)**: Access to structured IT curriculum modules, organized from basic to advanced standard industrial levels.
4. **Plotting & Profil Mentor (Mentor Management)**: Profiling system to view mentor credentials and handle allocation/plotting of mentors to students.
5. **Penjadwalan Mentoring Sesi (Mentor Scheduling)**: Calendar scheduling system for 1-on-1 private mentoring sessions with industry practitioners.

---

## 3. Technology Stack & Packages
* **Framework**: Next.js 16.2.9 (App Router with Turbopack)
* **Library**: React 19.2.4
* **Styling**: Tailwind CSS v4 (CSS-first engine)
* **Component Library**: HeroUI v3 (Compound components architecture, wcag-compliant React Aria) & Custom Namespace-Based Local UI Engine (`@/UI`)
* **Animations**: Framer Motion
* **Theming**: `next-themes` (Class-based toggle on the `<html>` tag)
* **Database Target**: Schema models are prepared for Drizzle ORM / Prisma. For initial staging, JSON/SQLite drivers can be colocated in `app/_database/`.

---

## 4. Fullstack Architectural Blueprint (FE & BE)
To keep the codebase maintainable and scalable as a single-repo fullstack project, we follow a **Feature-Based Colocation Architecture** using Next.js **Private Folders** (folders prefixed with an underscore `_`) and **Route Groups**. 

All Frontend UI, Backend Logic, Database Queries, and APIs associated with a specific route must be colocated inside that route's folder in `app/`. Shared code is placed in global private folders at the root `app/` level.

### Layered Architecture Structure:

```
app/
├── _actions/             <-- Shared Server Actions (BE)
├── _components/          <-- Shared UI components (FE)
│   ├── AuthContext.tsx   <-- AuthProvider managing mock session state
│   ├── UIStyleContext.tsx <-- UIStyleProvider managing selectedStyle & color hex
│   ├── StyleSwitcherFAB.tsx <-- Draggable global visual selector FAB
│   └── WelcomePage.tsx   <-- Welcome landing page view
├── _database/            <-- Database configuration & schemas (BE)
│   ├── db.ts             <-- DB Client (e.g. Prisma client, Drizzle db, or local JSON driver)
│   └── schema.ts         <-- DB Table / Schema definitions
├── _hooks/               <-- Shared custom React hooks (FE)
├── _services/            <-- Shared Business Logic & DB queries (BE Service Layer)
├── _types/               <-- Shared TS interfaces and types
│   └── auth.ts           <-- UserRole ("admin" | "mentor" | "mentor_lead" | "murid") & UserSession types
│
├── (auth)/               <-- Route group: authentication pages
│   ├── login/
│   │   └── page.tsx      <-- Renders login form & sandbox quick logins
│   └── register/
│       └── page.tsx      <-- Renders student registration form
│
├── (welcome)/            <-- Route group: welcome landing page entry
│   └── page.tsx
│
├── dashboard/            <-- Unified layout dashboard routing (RBAC)
│   ├── _components/      <-- Adaptive widgets colocated inside dashboard
│   │   ├── AdminWidget.tsx      <-- Widget rendering stats & log audits for admin
│   │   ├── MentorLeadWidget.tsx <-- Widget rendering student plotting allocation queues
│   │   ├── MentorWidget.tsx     <-- Widget rendering teaching schedule calendars
│   │   ├── StudentWidget.tsx    <-- Widget rendering student progress bars & active courses
│   │   ├── Sidebar.tsx          <-- Sidebar menu dynamically filtered by user session role
│   │   └── Header.tsx           <-- Header bar with profile card and theme toggles
│   ├── page.tsx          <-- Renders active role widget inside Framer Motion AnimatePresence
│   └── layout.tsx        <-- Main panel layout container containing Sidebar & Header
│
├── layout.tsx            <-- Root Layout (sets suppressHydrationWarning and Providers)
├── providers.tsx         <-- ThemeProvider, UIStyleProvider, and AuthProvider wrapper
└── globals.css           <-- Custom Tailwind theme variables and CSS overrides
```

### Request-Response Data Flow (Architecture Cycle):

```mermaid
graph TD
    A[Client Component / FE] -->|Form Submit / Action Trigger| B[Server Action / API Route]
    B -->|Parse & Validate Inputs e.g. Zod| C[Service Layer / _services]
    C -->|Execute Business Rules & Queries| D[Database Layer / _database]
    D -->|Return Raw Data / Records| C
    C -->|Format Domain Entities| B
    B -->|Return Typed Result e.g. success/error object| A
```

### Architectural Layering Guidelines:

#### A. Frontend (FE) Layer
1. **Views & Components (`_components/`)**:
   * Keep components thin. They should focus on rendering UI and handling user interaction.
   * Put route-specific components inside the local route's `_components/` directory.
   * Reuse shared UI components from the root `app/_components/` directory.
2. **React Hooks (`_hooks/`)**:
   * Put all state-synchronization, API queries, or form validation hooks inside local or global `_hooks/` folders.

#### B. Backend (BE) Layer
To ensure separation of concerns, the backend is divided into three distinct layers:

1. **Mutation Layer (Next.js Server Actions - `_actions/`)**:
   * Located inside local route `_actions/` folders.
   * Actions must serve as simple controllers. They receive input parameters, check session/auth, call the **Service Layer** to do the work, and return a standardized result object.
   * Standard Result Object Format:
     ```typescript
     export type ActionResponse<T = any> = 
       | { success: true; data: T; message?: string }
       | { success: false; error: string; code?: string };
     ```
   * Actions must NOT contain raw database queries or complex business validation directly.
2. **REST API Layer (Next.js API Routes - `app/api/`)**:
   * Use REST endpoints inside `app/api/<feature>/route.ts` only for external webhooks, public APIs, or integrations.
   * Like Server Actions, API handlers must be thin and delegate all business logic to the **Service Layer**.
3. **Business Logic Layer (Services - `_services/`)**:
   * Located inside local route `_services/` or root `app/_services/`.
   * Services encapsulate core business rules, entity validations, and database interactions (Read/Write).
   * **Rule**: Both Server Actions and API Routes must reuse these service functions to guarantee logic consistency.
4. **Database/ORM Layer (`app/_database/`)**:
   * Database client connections and ORM schemas must reside in the private folder `app/_database/`.
   * Raw schemas and migration files are placed here.

---

## 5. Design Tokens & Branding
Branding values are derived from `/public/assets/Palette.svg` and configured inside `@theme` in `app/globals.css`.

### Theme Colors:
* `sakode-pink` (`#FF409F`)
* `sakode-orange` (`var(--sakode-secondary-color, #F9723B)`) - *Secondary Color*
* `sakode-yellow` (`#EDAC1C`) - *Gold Color representation*
* `sakode-blue` (`var(--sakode-primary-color, #54A5E4)`) - *Primary Color*
* `sakode-green` (`var(--sakode-accent-color, #009670)`) - *Accent / Ascent Color*
* `sakode-cyan` (`#71CFFE`)
* `sakode-charcoal` (`#383838`)

> [!NOTE]
> Primary, Secondary, and Accent colors are mapped to CSS custom variables (`--sakode-primary-color`, etc.) to support dynamic custom branding overrides in real-time from the Aesthetics Configurator FAB.

### Theme Configuration (next-themes):
* Light Mode (`:root`): `--background: #f9fafb` (zinc-50), `--foreground: #09090b` (zinc-950).
* Dark Mode (`.dark`): `--background: #030307` (deep dark), `--foreground: #f4f4f5` (zinc-100).
* Transitions: `body` background-color and text transition over `300ms` globally.

---

## 6. Guidelines for Future AI Agent Sessions
1. **Maintain File Colocation**: Keep components, hooks, actions, and services colocated inside route directories using private folder (`_components`, `_actions`, `_services`) conventions.
2. **Clean Server Actions**: Ensure Server Actions remain thin controllers that validate the request and call service functions. Keep database access isolated in the Service Layer.
3. **Follow Tailwind CSS v4 CSS-First Conventions**:
   * Do not use custom bracket classes if they can be written as modular variables (e.g. `h-150` instead of `h-[600px]`).
   * Use `bg-linear-to-r` instead of `bg-gradient-to-r`.
   * Use `translate-x-[-50%]` instead of `-translate-x-[50%]`.
   * Use standard suffix logic for important overrides (e.g. `text-xs!` instead of `!text-xs`).
4. **React 19 Event Typings**: Use `SyntheticEvent<HTMLFormElement>` for form events, as standard `FormEvent` is deprecated.
5. **Asynchronous Mounting**: When mounting client-side state, wrap triggers inside `requestAnimationFrame` to avoid linter warnings regarding synchronous state mutations in `useEffect`.
6. **No Emoji Overuse**: Emojis should not be used for primary SaaS visual components. Rely on professional numbers or clean typography instead.
7. **Consistent Action Responses**: Always return standard JSON objects with success/error/data structures from actions. Do not throw arbitrary exceptions to the client.
8. **Use Custom Namespace UI Library (`@/UI`)**: To build custom visual styled layouts (e.g. Claymorphism, Neobrutalism, etc.) without third-party component library overhead, use components from `@/UI` (e.g. `<claymorphism.Button>`, `<neobrutalism.Input>`). This is located at the root-level `UI/` folder, completely safe from App Router route generation. Refer to [CUSTOM_UI_BUILDING.md](CUSTOM_UI_BUILDING.md) for details on adding new components to the style system.
9. **Form Element Accessibility**: Always provide `title` and `aria-label` attributes for all form input/button controls to pass WCAG Axe compliance. Do not leave interactive controls unlabeled.


