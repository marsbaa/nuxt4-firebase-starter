<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

---

## ⚠️ CRITICAL: Pastoral Care Principles

**Before any work on this project, you MUST read:**

[`openspec/PASTORAL_CARE_PRINCIPLES.md`](openspec/PASTORAL_CARE_PRINCIPLES.md)

This document defines non-negotiable principles for all features, naming, design, and language in the Pastoral Care App. Every proposal and implementation must align with these principles or be rejected.

**Decision Rule**: Before proposing or implementing anything, ask:

> "Does this help someone care better for a person — or does it just help manage information?"

If the answer is the latter, do not proceed without reframing.

**Key Concepts**:

- Use "Care Notes" (not "activities" or "logs")
- Use "Care Reminders" (not "tasks" or "assignments")
- Use "Life Moments" (not "milestones")
- Tone must be calm, respectful, pastoral (never corporate or metrics-driven)
- UI should feel like "a quiet, trustworthy space for caring for people"

---

## Git Workflow for OpenSpec Changes

When implementing an openspec change, follow this git workflow:

### 1. After Proposal Approval

Once the proposal is approved, create a new branch:

```bash
git checkout -b <change-id>
```

### 2. During Implementation

After completing each task in `tasks.md`:

1. Add and commit the changes with a descriptive message:

```bash
git add .
git commit -m "feat(<capability>): <description of completed task>"
```

2. Update the corresponding task checkbox in `tasks.md` to `[x]`
3. Commit the task.md update:

```bash
git add openspec/changes/<change-id>/tasks.md
git commit -m "docs: update task completion status"
```

### 3. After All Tasks Complete

When all tasks in `tasks.md` are completed:

1. Push the branch to remote:

```bash
git push origin <change-id>
```

2. Create a Pull Request for review
3. Wait for approval and merge

### 4. After PR Merge

Once the PR is merged:

1. Switch back to main and pull latest:

```bash
git checkout main
git pull origin main
```

2. Delete the feature branch:

```bash
git branch -d <change-id>
git push origin --delete <change-id>
```

3. Archive the openspec change:

```bash
openspec archive <change-id>
```

4. Commit the archive:

```bash
git add openspec/
git commit -m "docs: archive openspec change <change-id>"
git push origin main
```

### Commit Message Conventions

- `feat(<capability>): <description>` - New feature implementation
- `fix(<capability>): <description>` - Bug fixes
- `refactor(<capability>): <description>` - Code refactoring
- `style(<capability>): <description>` - Styling changes
- `docs: <description>` - Documentation updates (including task.md updates)
- `test(<capability>): <description>` - Test additions or updates
