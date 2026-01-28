# Add Members Page

## Why

The Pastoral Care App needs a dedicated Members page to allow care providers to view, search, and manage their community members with care and respect. This capability is essential for pastors, chaplains, and care coordinators to maintain relationships and provide pastoral support effectively. Currently, there is no interface for members management in the application.

## What Changes

- Add new Members page with warm, pastoral-focused design
- Implement member listing with avatar, name, age, and location display
- Add search functionality to filter members by name, email, or location
- Include member count display showing total community size
- Provide respectful action buttons (view, edit, delete) with gentle iconography
- Implement pagination for member lists
- Add "New Member" creation button
- Design with warm, calm aesthetics aligned with pastoral care values

## Impact

- **Affected specs**: New capability `members-management`
- **Affected code**:
  - New page: `app/pages/members.vue`
  - New components: Member list, member table, member avatar components
  - Potential composables: `useMembers.ts` for data fetching and parsing
  - Dashboard layout navigation (add Members link)
- **Breaking changes**: None
- **Dependencies**: Uses existing Firebase Realtime Database `/members` collection (no migration required)
