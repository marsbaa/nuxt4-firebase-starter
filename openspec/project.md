# Project Context

## Purpose

The Pastoral Care App is a care-focused, relationship-driven system designed to help pastors, chaplains, deacons, and care teams remember people well and care for them faithfully. The app supports presence over productivity, continuity over efficiency, and shared understanding over task assignment.

**Critical**: All work on this project must align with the principles defined in [`PASTORAL_CARE_PRINCIPLES.md`](openspec/PASTORAL_CARE_PRINCIPLES.md). Read this document before proposing or implementing any feature.

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3, TypeScript)
- **Backend**: Firebase (Realtime Database, Authentication, Admin SDK)
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit), Playwright (e2e)
- **Runtime**: Node.js

## Project Conventions

### Code Style

- TypeScript with strict mode enabled
- Vue 3 Composition API with `<script setup>` syntax
- Tailwind CSS for styling (utility-first approach)
- Component files use PascalCase naming
- Composables use `use*` prefix
- Auto-imported components and composables (Nuxt conventions)

### Architecture Patterns

- **Pages**: Route-based views in `app/pages/`
- **Layouts**: Shared layouts in `app/layouts/`
- **Components**: Reusable UI components in `app/components/`
- **Composables**: Shared logic in `app/composables/`
- **API Routes**: Server endpoints in `server/api/`
- **Middleware**: Route protection in `app/middleware/` and `server/middleware/`

### Testing Strategy

- Unit tests with Vitest for composables and utilities
- E2E tests with Playwright for critical user flows
- Test files co-located with source code or in `test/` directory
- Focus on behavior over implementation details

### Git Workflow

Follow OpenSpec workflow for changes:

1. Create feature branch from main: `git checkout -b <change-id>`
2. Commit completed tasks with conventional commits: `feat(capability): description`
3. Update `tasks.md` after each completed task
4. Push and create PR when all tasks complete
5. After merge, archive the openspec change

See [`AGENTS.md`](AGENTS.md) for detailed git workflow instructions.

## Domain Context

### Critical Reading

**Before any work, read**: [`PASTORAL_CARE_PRINCIPLES.md`](openspec/PASTORAL_CARE_PRINCIPLES.md)

This document defines non-negotiable principles including:

- What this app is (and is not)
- Pastoral mental model: "What care is happening?" not "What work needs doing?"
- Core concepts: Care Notes, Care Reminders, Life Moments (never "tasks", "activities", "milestones")
- Tone & language rules: Calm, respectful, pastoral (never corporate, metrics-driven, urgent)
- Design principles: Reduce cognitive load, favor whitespace and softness

### Key Terminology

- **Care Notes**: Shared pastoral memory (not "activities" or "logs")
- **Care Reminders**: Gentle future-facing prompts (not "tasks" or "assignments")
- **Life Moments**: Significant events in a person's journey (not "milestones")
- **Following**: Shared awareness of care (not "ownership" or "assignment")

### UI/UX Guidelines

- Quiet, trustworthy space for caring
- Never feel like Jira, Asana, or Salesforce
- No productivity tracking or performance metrics
- Gentle hierarchy, ample whitespace
- Neutral, unobtrusive icons

## Important Constraints

### Technical

- Firebase Realtime Database (not Firestore)
- Server-side authentication with Firebase Admin SDK
- Client-side Firebase SDK for auth state
- Must support confidential, sensitive information

### Domain

- **Confidentiality**: Handle sensitive spiritual/emotional information
- **Continuity**: Support long-term relationships and context
- **Collaboration**: Enable care teams without ownership mentality
- **Discernment**: Support prayerful decision-making, not automated workflows

### Language

- Reject corporate/productivity language
- Use pastoral, person-centered terminology
- Test: "Does this help care for a person or just manage information?"

## External Dependencies

- **Firebase**: Authentication, Realtime Database, Admin SDK
- **Vercel**: Deployment and hosting (serverless functions)
- **Nuxt**: SSR framework with auto-imports
