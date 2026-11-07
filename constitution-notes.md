# QuoteCraft: Constitution Notes

Input for `/speckit.constitution`. These are the non-negotiable rules of the project. They are principles, not features: what to build lives in the spec, and how to build it lives in the plan.

Everyday instructions (commands, folder map, how to explain code) live in `AGENTS.md`. Visual rules live in `BRAND.md`. The constitution points to them and does not copy them. If anything conflicts, the constitution wins.

## Core Principles

### 1. Simple, readable code
Code MUST be easy for a junior developer to read. Components are small and do one job. No abstraction is created until the same code is needed in 3 places. No clever tricks, no dead code.
*Check:* a beginner can explain any file after reading it once.

### 2. Pricing logic is pure and test-first
All pricing math MUST live in `lib/pricing.ts` as plain functions with no React inside. Every pricing rule MUST have a test written BEFORE its code. A test MUST NOT be changed just to make it pass.
*Check:* deleting a pricing rule makes at least one test fail.

### 3. The spec is the source of truth
Nothing is built that is not in the spec. If a requirement is unclear or missing, stop and ask. If a rule changes, update the spec, the code, and the tests together.
*Check:* every feature in the app maps to a line in the spec.

### 4. One brand, no improvising
All UI MUST follow `BRAND.md` and use its design tokens, never raw color or font values. The "Do Not" list in `BRAND.md` is a hard rule.
*Check:* no hex color appears in a component file.

### 5. Accessible by default
Every input has a visible label, everything works with the keyboard, focus is always visible, text contrast is at least 4.5:1, touch targets are at least 44px, and motion respects reduced-motion settings.
*Check:* the whole quote can be completed with the keyboard alone.

### 6. Small, verified steps
Work happens one task at a time. A task is done only when `npm run build` and all tests pass. Each finished task is committed separately.
*Check:* the git history shows one clear commit per task.

### 7. Minimal dependencies and scope
No new package is added without explicit approval. QuoteCraft stays front-end only: no database, no login, no payments, no multi-quote storage.
*Check:* `package.json` contains only what the plan lists.

## Additional Constraints
- Stack: Next.js (App Router), TypeScript, Tailwind CSS, Vitest.
- Currency is EGP, shown with thousands separators.
- The last quote is saved in the browser's localStorage only.
- Works at 375px wide and at desktop width.

## Development Workflow
- Order: constitution, specify, clarify, plan, tasks, analyze, implement.
- Implementation runs one phase or task at a time and stops for review.
- Every code change is explained to the project owner in simple language.
- Review is done by a different model than the one that wrote the code.

## Governance
- This constitution overrides `AGENTS.md`, `BRAND.md`, and any other document.
- It changes only when the project owner explicitly approves, with a version bump and a one-line reason.
- Any plan or task that breaks a principle MUST be fixed or must justify the exception in writing.
