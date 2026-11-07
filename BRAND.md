# QuoteCraft Brand Guide

Version 1.0 · Read this before building or changing any UI. Use the tokens in this file. Never invent colors, fonts, sizes, or wording that are not listed here.

## 1. Brand Basics
- **What it is:** a quote calculator that an agency's sales team uses during client calls.
- **Who uses it:** sales staff, often under time pressure, often on a phone or a shared laptop.
- **Main job:** turn a client's request into a clear, trustworthy price in under a minute.
- **Design idea:** a studio price sheet. Think paper, pencil, ruler, and one highlighter pen used on the number that matters. The total is the only loud thing on the screen.
- **Personality:** precise, calm, plain-spoken.
- **Not:** playful, salesy, flashy, techy-futuristic.

## 2. Logo
- A text wordmark only: "QuoteCraft", Bricolage Grotesque Bold, color Lapis.
- Clear space around it: at least the height of the letter "Q" on every side.
- Minimum size: 20px tall.
- Do not add an icon, gradient, shadow, or outline to it.

## 3. Color
Palette is small on purpose. Two brand colors (Lapis, Highlighter) and five neutrals.

| Token | Hex | Use |
|---|---|---|
| Paper | `#F5F6F2` | Page background |
| Sheet | `#FFFFFF` | The quote sheet only |
| Ink | `#1A2238` | Main text, headings |
| Graphite | `#4A5368` | Secondary text, hints |
| Pencil | `#6B7385` | Borders, dividers, icons. Never for text |
| Lapis | `#274690` | Buttons, links, focus ring, wordmark |
| Highlighter | `#FFD84D` | ONLY the band behind the grand total |
| Red pencil | `#B3261E` | Errors only |

Rules:
- Highlighter is never used for buttons, borders, icons, or text. It appears once per screen: behind the total.
- Use Ink on Highlighter, never Lapis.
- No gradients, no tinted shadows, no pure black.
- Contrast (measured, WCAG): Ink on Paper 14.6:1, Graphite on Paper 7.1:1, Lapis on Paper 8.2:1, white on Lapis 8.9:1, Ink on Highlighter 11.4:1, Red pencil on Paper 6.0:1. Pencil on Paper is 4.4:1, so it is for borders and icons only.

## 4. Typography
Two families, clearly different. Load both with `next/font/google`.
- **Bricolage Grotesque** (700): headings and the total. Gives the brand its character.
- **IBM Plex Sans** (400, 500, 600): everything else. Has tabular numbers, which keeps prices aligned.

| Role | Size / line height | Font and weight |
|---|---|---|
| Total amount | 49px / 1.1 | Bricolage 700, tabular numbers |
| Page title (h1) | 39px / 1.15 | Bricolage 700 |
| Section title (h2) | 25px / 1.25 | Bricolage 700 |
| Group title (h3) | 20px / 1.3 | Bricolage 700 |
| Body | 16px / 1.6 | Plex Sans 400 |
| Label / button | 16px / 1.4 | Plex Sans 500 |
| Small / hint | 14px / 1.5 | Plex Sans 400 |

Rules:
- Scale ratio is 1.25. Do not add sizes outside the table.
- All prices and numbers use tabular numbers (`font-variant-numeric: tabular-nums`) and are right-aligned in lists.
- Line length: max 65 characters for paragraphs.
- Sentence case everywhere. No ALL CAPS, no letter-spaced eyebrow labels above headings.
- Do not color or italicize a single word in a headline.
- Fallbacks: `system-ui, sans-serif`.

## 5. Spacing, Shape, Depth
- **Spacing scale (px):** 4, 8, 16, 24, 32, 48. Nothing else.
- **Radius:** 6px on buttons and inputs, 2px on the quote sheet. Two values on purpose: controls feel touchable, the sheet feels like paper.
- **Depth:** no soft grey drop shadows. Separate things with a 1px Pencil line or by Paper vs Sheet contrast.
- **Icons:** lucide-react, 20px, stroke 1.5px, color Pencil or Ink. No emoji as icons.

## 6. Layout
- Left aligned. Numbers right aligned.
- **Desktop (1024px and up):** two columns. Left: the options as one flowing list with dividers (not a grid of cards). Right: the quote sheet, sticky at the top. Max content width 1080px.
- **Mobile (under 1024px):** one column. The total sits in a bar fixed to the bottom of the screen so it is always visible.
- Test at 375px and at 1280px.
- Do not turn content into rows of identical cards. Use dividers and spacing to group things.

## 7. Components
- **Primary button:** Lapis background, white text, 6px radius, 44px minimum height. Hover: 8% darker. Only one primary button per screen ("Copy quote as text").
- **Secondary button:** transparent, 1px Lapis border, Lapis text.
- **Inputs:** Sheet background, 1px Pencil border, 6px radius, visible label above, 44px height. Error state: Red pencil border and message below.
- **Choice list (project types):** radio rows with a 1px divider between, name on the left, price on the right.
- **Quote sheet:** Sheet background, 1px Pencil border, 2px radius, 24px padding. Line items left, amounts right, 1px divider above the total.
- **Total:** Bricolage 49px on a Highlighter band. The band is the single memorable element in the interface.
- **Focus ring:** 2px Lapis outline with 2px offset, on every interactive element.

## 8. Motion
- Only motion that answers an action: when an option changes, the total number cross-fades in 150ms and the highlighter band stays put.
- No page-load animations, no scroll reveals, no hover effects on non-interactive elements.
- Respect `prefers-reduced-motion`: turn all motion off.

## 9. Voice and Copy
Write like a clear colleague: plain verbs, sentence case, no filler. Name things the way a salesperson would say them.

| Situation | Write this | Never this |
|---|---|---|
| Button | Copy quote as text | Submit |
| After the button | Quote copied | Success! |
| Empty state | Choose a project type to start your quote. | Welcome to QuoteCraft! |
| Error | Extra pages aren't available for a landing page. Choose Multi-page site to add pages. | Oops! Something went wrong. |
| Currency | 15,000 EGP | EGP15000 |

Rules:
- Keep one name for one action across the whole flow (the button "Copy quote as text" leads to the message "Quote copied").
- Errors say what happened and how to fix it. They never apologize.
- No lorem ipsum. Use real service names and real prices.
- No arrow symbols (→) added to buttons or links.

## 10. Do Not (the "AI look" checklist)
- Purple or blue gradient backgrounds, glow blobs, glassmorphism.
- A row of three identical rounded cards.
- Emoji as icons, or a centered hero with a giant gradient headline.
- Numbered markers (01, 02, 03) unless the content truly is a sequence.
- Fade-and-slide-up animations on every section.
- Default Inter on everything.

## 11. Design Tokens (Tailwind CSS v4)
Paste into `app/globals.css`. Components must use these tokens, not raw hex values.

```css
@theme {
  --color-paper: #F5F6F2;
  --color-sheet: #FFFFFF;
  --color-ink: #1A2238;
  --color-graphite: #4A5368;
  --color-pencil: #6B7385;
  --color-lapis: #274690;
  --color-highlighter: #FFD84D;
  --color-red-pencil: #B3261E;

  --font-display: "Bricolage Grotesque", system-ui, sans-serif;
  --font-body: "IBM Plex Sans", system-ui, sans-serif;

  --radius-control: 6px;
  --radius-sheet: 2px;
}
```

## 12. Change Log
- 1.0: first version.
