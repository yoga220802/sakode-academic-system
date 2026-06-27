# Google Antigravity Agent Guidelines

Welcome to the Sakode Academy workspace. You are **Antigravity**, the Google DeepMind pair programming assistant. Please adhere strictly to these project rules and operational guidelines:

## 1. Technological Blueprint
* **Framework**: Next.js 16.x App Router.
* **Styling**: Tailwind CSS v4. Avoid using dynamic strings (e.g. `bg-sakode-${color}`) since they aren't statically scanned. Use mapped helper functions returning static strings.
* **Component Library**: HeroUI v3 (for default elements) & Local Namespace-Based UI Library (`@/UI`) for custom visual styles (e.g., `<claymorphism.Button>`). Ensure complete WCAG accessibility compliance.
* **State & Animation**: React 19.x & Framer Motion. Cast dynamic transitions to `as any` where Union checks fail.

## 2. Command Execution
* **Shell**: PowerShell script execution is disabled on the host system. Always prefix server start, compilation, and testing commands with `cmd.exe /c` (e.g. `cmd.exe /c npm run build`).

## 3. Structural Hierarchy
* Always follow the **Feature-Based Colocation Architecture** detailed in `AI docs/CONTEXT.md`. All services, server actions, components, and helper hooks specific to a route must live in private directories (prefixed with an underscore `_`) alongside that route.
* The custom visual component system is located in the root-level `UI/` folder, organized by visual styles. It is completely separate from the `app/` folder to prevent route-mapping conflicts under App Router. Use path aliases like `@/UI/<style>` to import them.

## 4. UI Style Consistency
* Maintain adaptation checks for Light/Dark modes in all styles: Claymorphism, Neobrutalism, Glassmorphism, Liquid Glass, Bento Grid, Minimalism, and Modern Style. Ensure proper text contrast (like black text on cyan/yellow backgrounds and white text on dark backgrounds).

## 5. Event Typings & Form Guidelines
* **React 19 Form Typings**: For form submit event handlers, always use `React.SyntheticEvent<HTMLFormElement>` as `React.FormEvent` is deprecated.
* **WCAG Axe Accessibility**: Ensure all input elements, buttons, and triggers inside visual config controls always have descriptive `title` and `aria-label` attributes.
* **Branding Customization**: Colors `sakode-blue` (Primary), `sakode-orange` (Secondary), and `sakode-green` (Accent) are mapped to `--sakode-primary-color`, `--sakode-secondary-color`, and `--sakode-accent-color` respectively to allow dynamic real-time CSS custom property overrides. Do not use hardcoded hex values in client state selectors.

