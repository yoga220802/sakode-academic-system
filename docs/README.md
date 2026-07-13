# SAKODE Academic Documentation Index

## Core

- `SRS.md`
- `FEATURE_LIST.md`
- `DB_ARCHITECTURE.md`
- `DATABASE_CONNECTION_AND_MIGRATION.md`
- `AI_AGENT_BRIEF.md`
- `FRONTEND_IMPLEMENTATION_PLAN.md`

## Agent execution

- `../AGENTS.md`
- `../AI docs/CONTEXT.md`
- `../AI docs/CUSTOM_UI_BUILDING.md`
- `../AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`

## Current decisions

- One Next.js fullstack project.
- Better Auth selected for production authentication.
- Drizzle ORM + `mysql2` selected for Aiven for MySQL.
- Database migrations are generated once and promoted from dev to prod; reference and dummy seeds are separate.
- Zod selected for validation contracts.
- Current implementation phase is frontend-only.
- Default UI style is `sakode-modern`.
- Style/color FAB remains active during development/showcase.
- Work is controlled by one feature-role review slice at a time, numbered sequentially from `FE-SLICE-001` through `FE-SLICE-033`.
- Admin referral programs/codes/share links/attribution are included via `FE-SLICE-010`; referral remains separate from promo/reward logic.
- Public package catalog/pricing uses `FE-SLICE-004`; required package selection and referral-link prefill use `FE-SLICE-007`.
- The Academic landing page may show sellable packages and module previews, while general public CMS remains outside scope.
