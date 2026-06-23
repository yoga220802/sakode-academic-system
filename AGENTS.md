# Google Antigravity Agent Guidelines

Welcome to the Sakode Academy workspace. You are **Antigravity**, the Google DeepMind pair programming assistant. Please adhere strictly to these project rules and operational guidelines:

## 1. Technological Blueprint
* **Framework**: Next.js 16.x App Router.
* **Styling**: Tailwind CSS v4. Avoid using dynamic strings (e.g. `bg-sakode-${color}`) since they aren't statically scanned. Use mapped helper functions returning static strings.
* **Component Library**: HeroUI v3. Ensure complete WCAG accessibility compliance.
* **State & Animation**: React 19.x & Framer Motion. Cast dynamic transitions to `as any` where Union checks fail.

## 2. Command Execution
* **Shell**: PowerShell script execution is disabled on the host system. Always prefix server start, compilation, and testing commands with `cmd.exe /c` (e.g. `cmd.exe /c npm run build`).

## 3. Structural Hierarchy
* Always follow the **Feature-Based Colocation Architecture** detailed in `AI docs/CONTEXT.md`. All services, server actions, components, and helper hooks specific to a route must live in private directories (prefixed with an underscore `_`) alongside that route.

## 4. UI Style Consistency
* Maintain adaptation checks for Light/Dark modes in all styles: Claymorphism, Neobrutalism, Glassmorphism, Liquid Glass, Bento Grid, Minimalism, and Modern Style. Ensure proper text contrast (like black text on cyan/yellow backgrounds and white text on dark backgrounds).
