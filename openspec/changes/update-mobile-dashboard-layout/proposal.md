## Why

The current mobile dashboard relies on a hamburger menu for primary navigation. While appropriate for secondary actions, this pattern is not ideal for **one-handed use** or **brief, frequent interactions**, which are common in pastoral contexts.

To improve mobile usability—while preserving the app’s calm, pastoral posture—we should introduce a **fixed bottom navigation bar for mobile devices only**, without altering content, tone, or visual design.

---

## What Changes

- Introduce a **fixed bottom navigation bar** on mobile screens only.
- Bottom navigation includes three existing destinations:
  - **People**
  - **Calendar**
  - **More**

- Adjust spacing and vertical flow on mobile to:
  - Support smoother scrolling
  - Improve one-handed reachability

- **No changes** to:
  - Content or wording
  - Visual styling, colours, or typography
  - Page structure or information hierarchy

This is a **layout-only enhancement**, not a screen redesign.

---

## Impact

- **Affected specs:** Dashboard (mobile layout only)
- **Affected code:** Dashboard layout components
  (e.g. `app/layouts/dashboard.vue` and related layout components)
- **Risk:** Low
  - No breaking changes
  - Mobile-only enhancement
  - Desktop and tablet layouts unaffected
