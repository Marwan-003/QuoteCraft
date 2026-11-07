# Feature Specification: QuoteCraft Quote Calculator

**Feature Branch**: `N/A`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Build the specification from the product requirements. Describe what users need and why only. Keep every pricing rule exactly as written and put the non-goals under \"out of scope\"."

## Clarifications

### Session 2026-11-06

- Q: Does selecting "Bilingual (Arabic + English)" mean the client's website will be bilingual, or that the quote screen itself should switch languages? → A: It describes the client's website; the quote stays in English.
- Q: Should the spec require the project's full accessibility baseline or only keyboard access? → A: Include visible labels, keyboard operation, visible focus, 4.5:1 contrast, 44px touch targets, and reduced motion.
- Q: Does "Multi-page site (up to 5 pages)" cap the total page count at 5, or is Extra pages uncapped? → A: "Up to 5 pages" describes the base package; Extra pages is uncapped and charged 1,200 each.
- Q: Should the app provide an explicit "new quote" action, or is editing the current quote enough? → A: No separate action; editing the current quote replaces the remembered one.
- Q: Must the salesperson enter a client name and project name before copying or printing, or are both optional? → A: Both are optional; blank labels are omitted.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Build a quote from project type and add-ons (Priority: P1)

A salesperson on a client call chooses one project type, adjusts the available add-ons, and sees a clear total with a line-by-line breakdown straight away.

**Why this priority**: This is the product's core job. Without a correct, live quote there is nothing to copy, print, or remember.

**Independent Test**: A salesperson can select one project type, change add-ons, and verify the total and breakdown without using copy, print, or saved-quote behavior.

**Acceptance Scenarios**:

1. **Given** no project type is selected, **When** the quote opens, **Then** the total shows 0 EGP and the breakdown is empty.
2. **Given** Landing page is selected, **When** the salesperson looks for Extra pages, **Then** Extra pages is unavailable, adds no charge, and a plain explanation says extra pages are not available for a landing page.
3. **Given** Multi-page is selected, **When** the salesperson enters 2 extra pages and turns on SEO setup, Hosting setup, and Bilingual, **Then** the breakdown lists each charge and the total is 25,650 EGP.
4. **Given** E-commerce is selected, **When** the salesperson turns on Bilingual, **Then** the Bilingual charge is 8,750 EGP, no add-on amount changes, and the quote stays in English.
5. **Given** any option or quantity changes, **When** the change is made, **Then** the total and breakdown update immediately with no separate save or submit step.
6. **Given** a phone-sized or desktop screen, **When** the salesperson builds a quote, **Then** every control, amount, and the total remain visible and reachable.
7. **Given** keyboard-only use, **When** the salesperson moves through the quote, **Then** every interactive control is reachable and shows visible focus.

---

### User Story 2 - Identify and share the quote (Priority: P2)

A salesperson adds the client and project names, then copies the quote as text or prints a clean version to share with the client.

**Why this priority**: A price is only useful when it is tied to a client and project and can leave the screen without retyping.

**Independent Test**: Enter names on a completed quote, copy it, and print it; confirm both outputs contain the same names, charges, breakdown, and total.

**Acceptance Scenarios**:

1. **Given** a completed quote with client name "Acme" and project name "Website redesign", **When** the salesperson copies it as text, **Then** the copied text contains both names, the project type, every selected charge, the breakdown amounts, and the total.
2. **Given** the same quote, **When** the salesperson prints it, **Then** the printed version shows the same names, charges, amounts, and total without on-screen controls.
3. **Given** client and project names are blank, **When** the salesperson copies or prints the quote, **Then** no empty name labels appear and both actions remain available.
4. **Given** no project type is selected, **When** the salesperson tries to copy or print, **Then** both actions are unavailable.

---

### User Story 3 - Keep the last quote after a refresh (Priority: P3)

A salesperson who refreshes the page during a client call finds the last quote exactly as it was, instead of rebuilding it.

**Why this priority**: Losing a quote mid-call wastes time and makes the tool feel unreliable, but the core quote works without this safety net.

**Independent Test**: Set up a quote with names and several options, refresh the page, and compare the restored quote with the original.

**Acceptance Scenarios**:

1. **Given** a quote with selections and names, **When** the page is refreshed, **Then** the same selections, names, and total return.
2. **Given** no previous quote exists, **When** the page opens, **Then** a fresh empty quote appears.
3. **Given** the saved quote cannot be read, **When** the page opens, **Then** a fresh empty quote appears without an error message.

---

### Edge Cases

- The salesperson switches from Multi-page or E-commerce to Landing page after entering extra pages: the extra-page quantity resets to zero and no extra-page charge remains.
- Extra pages is left blank, zero, negative, fractional, or non-numeric: only whole numbers of zero or more count, and an invalid entry does not change the last valid total.
- Extra pages is used with E-commerce: it is allowed and charged at 1,200 per page.
- Bilingual is turned on or off after add-ons are chosen: the surcharge always applies to the project base price only.
- Client or project names are very long: the quote remains readable and does not lose or overlap amounts.
- A quote has enough items to span more than one printed page: every item and the total still appear.
- The page is refreshed mid-entry: the last valid quote returns.
- Copy or print is attempted before a project type is chosen: both are unavailable and the salesperson is not given an empty quote to share.
- A saved quote is missing or unreadable: the product starts fresh without showing an error.
- Extra pages is entered above 5: the quantity is accepted and charged at 1,200 per page.
- A saved quote has Landing page selected with a non-zero extra-page quantity: the quantity is treated as zero and no extra-page charge appears.
- The salesperson edits a restored quote: the edited version replaces the remembered one, and there is no separate new-quote action.

## Requirements *(mandatory)*

### Pricing Rules

These rules are fixed for this release and MUST be applied exactly as written:

- Landing page 8,000 / Multi-page 15,000 / E-commerce 35,000
- Extra page 1,200 each (not allowed on Landing page)
- SEO setup 3,000 / Hosting setup 1,500
- Bilingual adds +25% on the project base price only (not on add-ons)

### Functional Requirements

- **FR-001**: The system MUST let the salesperson choose exactly one project type: Landing page, Multi-page site (up to 5 pages), or E-commerce.
- **FR-002**: The system MUST let the salesperson set an Extra pages quantity as a whole number of zero or more when the project type is Multi-page or E-commerce. There is no upper limit on the quantity.
- **FR-003**: The system MUST prevent Extra pages from being added when Landing page is selected and MUST explain why in plain language.
- **FR-004**: The system MUST let the salesperson turn SEO setup, Hosting setup, and Bilingual (Arabic + English) on or off independently. Bilingual describes the client's website; the quote stays in English.
- **FR-005**: The system MUST show a live total in EGP, with thousands separators, after every change.
- **FR-006**: The system MUST show a line-by-line breakdown with the project base price, the Extra pages charge when greater than zero, each selected add-on, the Bilingual surcharge when selected, and the total.
- **FR-007**: The system MUST make the displayed total equal the sum of the displayed line items.
- **FR-008**: The system MUST apply the Bilingual surcharge to the project base price only and MUST NOT apply it to add-ons or Extra pages.
- **FR-009**: The system MUST let the salesperson enter a client name and a project name; both are optional.
- **FR-010**: The system MUST show the client and project names on the quote when they are provided.
- **FR-011**: The system MUST let the salesperson copy the quote as text.
- **FR-012**: The system MUST let the salesperson print a print-friendly version of the quote.
- **FR-013**: The copied and printed quote MUST contain the client name and project name when provided, the project type, every selected charge, the line-by-line breakdown, and the total.
- **FR-014**: The system MUST remember the most recent quote so a page refresh does not lose selections, names, or the total.
- **FR-015**: The system MUST restore the most recent quote on the same device when the page is opened again.
- **FR-016**: The system MUST start a fresh quote without an error when no saved quote exists or saved quote data cannot be read.
- **FR-017**: The system MUST update the total and breakdown immediately after every option, quantity, or name change, with no separate save or submit step.
- **FR-018**: The system MUST show 0 EGP and an empty breakdown until a project type is chosen.
- **FR-019**: The system MUST keep copy and print unavailable until a project type is chosen; client and project names do not affect availability.
- **FR-020**: The system MUST be fully usable on phone-sized and desktop screens.
- **FR-021**: The system MUST give every input a visible label, MUST be fully operable by keyboard, MUST show visible focus on every interactive control, MUST keep text contrast at least 4.5:1, MUST make touch targets at least 44px, and MUST respect reduced-motion settings.
- **FR-022**: The system MUST show a clear, plain-language message when a selected option is unavailable or an entry is invalid.
- **FR-023**: The system MUST keep a single current quote; editing it replaces the remembered quote, and there is no separate new-quote action.

### Key Entities

- **Quote**: The single quote being prepared. It holds the client name, project name, one project type, the extra-page quantity, the selected add-ons, the displayed line items, and the total.
- **Project type**: One of Landing page, Multi-page site (up to 5 pages), or E-commerce. Each has a fixed base price.
- **Add-on**: An optional charge selected by the salesperson: Extra pages, SEO setup, Hosting setup, or Bilingual (Arabic + English).
- **Line item**: One label and one EGP amount shown in the breakdown, such as a base price, a page charge, an add-on, the Bilingual surcharge, or the total.

## Out of Scope

The following non-goals are explicitly out of scope and MUST NOT be built:

- Login
- Database
- Payments
- PDF export
- Multiple saved quotes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A salesperson can go from a client's request to a complete, copyable quote in under 60 seconds.
- **SC-002**: Every option or quantity change updates the total and breakdown within 1 second, with no separate save or submit step.
- **SC-003**: 100% of quotes match the four pricing rules exactly. For example, Multi-page with 2 extra pages, SEO setup, Hosting setup, and Bilingual shows 25,650 EGP.
- **SC-004**: 100% of copied and printed quotes contain the names when provided, the project type, every selected charge, and the total, with no missing or extra lines.
- **SC-005**: 100% of refreshed quotes restore the same selections, names, and total.
- **SC-006**: A keyboard-only user can complete, copy, and print a quote without using a pointer.
- **SC-007**: A salesperson can complete a quote on a phone-sized screen and on a desktop screen without horizontal scrolling or losing access to a control.
- **SC-008**: 5 of 5 sales team members complete a sample quote without help on their first attempt.
- **SC-009**: 100% of interactive controls have visible labels and visible focus, text contrast is at least 4.5:1, touch targets are at least 44px, and reduced-motion settings remove non-essential motion.

## Assumptions

- Client and project names are optional. When blank, the quote still works, blank labels are omitted from copied and printed output, and copy and print remain available.
- Extra pages are whole numbers of zero or more. Selecting Landing page resets the extra-page quantity to zero.
- The "up to 5 pages" text is part of the Multi-page option name. This release does not define a separate included-page allowance or an upper limit, so every page entered under Extra pages is charged 1,200 on Multi-page and E-commerce.
- Bilingual (Arabic + English) describes the client's website, not the quote interface; the quote stays in English.
- Until a project type is chosen, the total is 0 EGP, the breakdown is empty, and copy and print are unavailable.
- Only one quote exists at a time. There is no separate new-quote action; editing the current quote replaces the remembered one.
- The most recent quote is remembered on the current device only; it is not shared across devices or people.
- All amounts are whole EGP shown with thousands separators.
- The quote needs no external data, account, or setup; all values come from the salesperson's selections and entries.
- A salesperson may change options in any order, and the total always reflects the current state.
