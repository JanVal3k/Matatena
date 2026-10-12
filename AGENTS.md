# AGENTS.md

## Project Overview
This repository contains a **React + TypeScript** web application, designed with an abstracted architecture to seamlessly adapt into a cross-platform desktop application for PC (e.g., via Tauri or Electron) in future phases.

## Tech Stack
- **Framework:** React 18+ (Vite)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS / CSS Modules
- **State Management:** React Context / Zustand
- **Testing:** Vitest + React Testing Library
- **Platform Architecture:** Platform-agnostic service layer

## Setup &amp; Scripts
- `npm install` — Install all dependencies
- `npm run dev` — Start the local Vite development server
- `npm run build` — Compile TypeScript and create production bundle
- `npm run lint` — Run ESLint check
- `npm run typecheck` — Run TypeScript type checking without emitting files
- `npm test` — Run unit and component tests

## Project Architecture &amp; Structure
```text
src/
├── components/     # Reusable UI components
├── features/       # Feature-based modular logic
├── hooks/          # Custom React hooks
├── services/       # Platform &amp; API services (abstracted for web/PC IPC)
├── types/          # Global TypeScript interfaces and types
└── utils/          # Pure helper functions

```

## Code Conventions &amp; Guidelines

* **TypeScript:** Enforce strict typing. Do **not** use `any`. Define explicit interface types for all component props and API responses.
* **React Standards:** Use functional components with hooks. Prefer composition over large monolithic components.
* **Desktop Readiness:** Decouple native OS / IPC logic from UI logic. All platform-specific interactions must go through interface adapters in `src/services/platform/`.
* **Prohibitions:**
  * Do not write direct DOM mutations.
  * Do not hardcode platform-specific APIs (window, IPC) directly inside UI components.

## Testing &amp; Quality Assurance

* Colocate tests with source files using `.test.tsx` or `.test.ts`.
* Write unit tests for utility functions and integration tests for critical component flows.
* Always verify changes with `npm run typecheck` and `npm test`.

## Agent Workflow Rules

* **Plan Mode First:** For multi-file changes or architecture updates, use Plan Mode (`TAB`) to outline the implementation steps before making changes.
* **Context Management:** Keep prompt scope focused. Use `@` references to attach only relevant files rather than scanning the entire codebase.
* **Rollbacks:** Use `/undo` immediately if an automated implementation introduces unwanted regressions.