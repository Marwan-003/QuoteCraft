<!--
Sync Impact Report
Version change: template (unratified) → 1.0.0
Modified principles: template placeholders → I. Simple, readable code; II. Test-first pricing;
  III. Spec is the source of truth; IV. One brand, no improvising; V. Accessible by default;
  VI. Small, verified steps; VII. Minimal dependencies and scope
Added sections: Additional Constraints (document ownership), Development Workflow, Governance
Removed sections: none
Deferred TODOs: none
-->

# QuoteCraft Constitution

## Core Principles

### I. Simple, readable code
Code MUST be readable by a junior developer after one pass. Components do one job. No abstraction
is created until the same code is needed in three places. No clever tricks and no dead code.

**Check:** a beginner can explain any file after reading it once.

### II. Test-first pricing
All pricing math MUST live in `lib/pricing.ts` as plain functions with no React. A failing test
MUST exist before its pricing code is written. A test MUST NOT be weakened to make code pass.

**Check:** deleting one pricing rule makes at least one test fail.

### III. Spec is the source of truth
Only what the spec states is built. An unclear or missing requirement MUST stop work until it is
resolved. A rule change MUST update the spec, code, and tests in the same change.

**Check:** every feature in the app maps to a line in the spec.

### IV. One brand, no improvising
All UI MUST follow `BRAND.md` and use its design tokens. Raw color, font, spacing, and size values
MUST NOT appear in components. Every item in the `BRAND.md` "Do Not" list is a hard rule.

**Check:** no hex color value appears in a component file.

### V. Accessible by default
Every input MUST have a visible label. The full quote MUST be completable by keyboard, focus MUST
be visible, text contrast MUST be at least 4.5:1, touch targets MUST be at least 44px, and motion
MUST respect reduced-motion settings.

**Check:** a keyboard-only user can finish a quote.

### VI. Small, verified steps
Work MUST proceed one task at a time. A task is done only when the build and test commands listed
in `AGENTS.md` pass. Each finished task MUST be committed on its own.

**Check:** git history shows one commit per task.

### VII. Minimal dependencies and scope
QuoteCraft MUST stay front-end only: no database, login, payments, or multi-quote storage. A new
package MUST NOT be added without explicit project-owner approval.

**Check:** `package.json` lists only dependencies the plan has approved.

## Additional Constraints

`AGENTS.md` owns everyday instructions: tech stack, commands, folder map, pricing rules summary,
and explanation style. `BRAND.md` owns visual rules. The spec owns features. This constitution
does not copy them; it requires compliance with them and wins any conflict.

## Development Workflow

Work follows this order: constitution, specify, clarify, plan, tasks, analyze, implement.
Implementation runs one phase or task at a time and stops for owner review. Every code change is
explained in simple language. Code is reviewed by a different model than the one that wrote it.

## Governance

This constitution supersedes `AGENTS.md`, `BRAND.md`, and every other project document. It is
amended only with the project owner's explicit approval. Each amendment MUST include a semantic
version bump and a one-line reason. MAJOR covers removed or redefined principles, MINOR covers new
or materially expanded principles or sections, and PATCH covers clarifications. Every plan, task,
and review MUST verify compliance; any violation MUST be fixed or justified in writing and
approved by the owner.

**Version**: 1.0.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
