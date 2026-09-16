# Yam Date Simulator — AI Coding Guidelines

These rules apply to all AI-assisted development in this repository.

## 1. Core Architecture Rules

This project is intentionally built as a lightweight, local-first Vanilla JavaScript game.

Important constraints:

- Keep the project fully compatible with `file://`.
- Do NOT introduce ES Modules (`import` / `export`).
- Do NOT introduce React, Vue, Angular, bundlers, npm runtime dependencies, or build steps.
- Do NOT convert `.js` files to TypeScript.
- Scripts are loaded through classic `<script>` tags in `index.html`.
- Existing systems may communicate through `window`, shared global objects, or context wrappers.
- Preserve the current architecture unless the user explicitly asks for a structural refactor.

The goal is:
- simple local execution
- offline compatibility
- very low overhead
- minimal setup
- small project size

## 2. FAST PATCH MODE — DEFAULT

Use FAST PATCH MODE for:

- small bug fixes
- UI fixes
- CSS fixes
- scrolling/layout issues
- isolated event-handler bugs
- minor gameplay corrections
- small accessibility fixes

Rules:

- Start only with the directly relevant file(s).
- Do NOT scan the entire repository.
- Do NOT automatically inspect companion files.
- Do NOT repeatedly reopen large files.
- Search only for the exact function, DOM ID, CSS class, variable, or symbol needed.
- Inspect another file only when the current code clearly depends on it.
- Prefer modifying 1–3 files maximum.
- Once the root cause is identified, patch it immediately.
- Do not refactor unrelated working code.
- Verify only the affected feature.

A small CSS or UI bug must NOT trigger a full architecture investigation.

## 3. SAFE STRUCTURAL MODE

Use broader investigation only when the user explicitly requests:

- refactoring
- moving files
- splitting files
- changing shared state
- modifying script load order
- adding a new subsystem
- large engine changes
- changes affecting multiple systems

In this mode:

- inspect dependencies first
- inspect `index.html` load order when relevant
- inspect `sw.js` when paths/files/assets change
- perform wider regression checks

## 4. Preserve Story and Game Content

Unless explicitly requested, do NOT change:

- Hebrew dialogue
- jokes or meme text
- scene keys
- ending keys
- routes
- choice destinations
- story order
- existing gameplay behavior

Do not rewrite content during technical fixes.

## 5. JSDoc Typing

Use JSDoc for TypeScript-like editor support when useful.

Allowed:

```js
/**
 * @typedef {Object} ExampleCtx
 * @property {number} hp
 */

/** @type {HTMLElement|null} */
const element = document.getElementById("example");

Do NOT introduce real TypeScript syntax such as:

interface Example {}
type Example = {}
declare global {}
const hp: number = 100;

Keep the project plain JavaScript.

Existing JSDoc context wrappers should be treated as trusted documentation.

6. Global and Shared State

Prefer existing shared APIs and context wrappers.

Do not create unnecessary new global variables.

If a system already exposes state through an existing context object or window API, reuse it.

Do not redesign global state during a small patch.

7. Keyboard Support

If you modify an existing keyboard-controlled feature, preserve keyboard support.

For gameplay controls:

prefer physical keyboard codes using event.code
support layout-independent input where practical
Hebrew keyboard layout must not break gameplay controls

If a feature already supports:

WASD
Arrow Keys
Enter / Space
Escape / Backspace

do not accidentally remove that behavior.

Do NOT audit unrelated keyboard systems during a normal bug fix.

8. PWA / Offline / Service Worker

The project must remain compatible with:

file://
localhost / HTTP
offline PWA usage

Only inspect or modify sw.js when:

a file is added
a file is removed
a file is moved
a static asset path changes

If a new static file is added, update the ASSETS list when required.

Do not touch the Service Worker for unrelated UI or gameplay fixes.

Preserve the existing HTTP-only Service Worker registration behavior.

9. Assets

When adding new assets:

keep images organized in the existing image folders
keep audio in the existing audio folders
prefer compressed formats
avoid unnecessarily large media files

Do not reprocess existing assets unless requested.

10. Minimal Change Principle

For every task:

Identify the smallest relevant area.
Make the smallest safe change.
Avoid unrelated cleanup.
Avoid opportunistic refactors.
Preserve current behavior outside the requested fix.
Verify the exact feature that was changed.

If more than 3 files appear necessary for a small fix, stop and reassess before expanding scope.

11. Performance / Investigation Limit

For normal small tasks:

no repository-wide exploration
no broad architecture review
no unnecessary dependency discovery
no repeated reading of the same file sections
no speculative refactoring

Trust the existing architecture unless the bug proves it is relevant.

12. Reporting

After a small fix, report briefly:

root cause
files changed
what was fixed
verification result

Do not produce a long architectural report unless requested.

Core Principle

Scale the investigation to the task.

Small bug:
→ small investigation
→ small patch
→ focused verification

Structural change:
→ dependency analysis
→ careful implementation
→ broader verification