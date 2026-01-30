# Migration Guide: From Composables to Pinia Stores

This guide documents the changes made during the refactor from Vue composables to Pinia stores for state management.

## Overview

The application has been refactored to use Pinia stores instead of composables for state management. This provides better centralized state management, improved reactivity, and easier testing.

## Key Changes

### 1. State Management Pattern

**Before:**

```typescript
// In components
const { members, isLoading, fetchMembers } = useMembers();
```

**After:**

```typescript
// In components
const membersStore = useMembersStore();
const { members, isLoading } = storeToRefs(membersStore);
await membersStore.fetchMembers();
```

### 2. Removed Composables

The following composables were completely removed as their functionality moved to stores:

- `useCareNotes` → `useCareNotesStore`
- `useCareReminders` → `useCareRemindersStore`
- `useCalendarEvents` → `useCalendarEventsStore`

### 3. Retained Utility Composable

`useMembers` was refactored to contain only utility functions:

- `parseMemberName()`
- `calculateAge()`
- `formatBirthday()`
- `formatContact()`
- `getMemberInitials()`
- `sortMembersByName()`

These utilities are still imported from `~/composables/useMembers`.

### 4. Real-time Subscriptions

Care Notes and Care Reminders now use real-time Firestore subscriptions instead of polling:

- Automatic updates when data changes
- No manual refresh needed
- Better performance and user experience

### 5. Centralized Data Loading

Members data is now preloaded on app initialization via `app/plugins/init-stores.client.ts`.

## Component Migration Examples

### Members List Page

**Before:**

```vue
<script setup>
const { members, isLoading, searchMembers } = useMembers();
</script>
```

**After:**

```vue
<script setup>
const membersStore = useMembersStore();
const { members, isLoading } = storeToRefs(membersStore);
const { searchMembers } = membersStore;
</script>
```

### Care Space Component

**Before:**

```vue
<script setup>
const { notes, addNote } = useCareNotes();
const { reminders, addReminder } = useCareReminders();
</script>
```

**After:**

```vue
<script setup>
const careNotesStore = useCareNotesStore();
const careRemindersStore = useCareRemindersStore();

const { notes } = storeToRefs(careNotesStore);
const { reminders } = storeToRefs(careRemindersStore);
</script>
```

## Benefits

1. **Centralized State**: All state is now managed in dedicated stores
2. **Better Reactivity**: Pinia provides more predictable reactivity patterns
3. **Real-time Updates**: Firestore subscriptions provide live data updates
4. **Improved Performance**: Reduced API calls and better caching
5. **Easier Testing**: Stores can be tested independently
6. **Type Safety**: Better TypeScript support with Pinia

## Breaking Changes

- Composables `useCareNotes`, `useCareReminders`, and `useCalendarEvents` are no longer available
- Components must import and use the corresponding Pinia stores
- State access pattern changed from destructuring to `storeToRefs()`
- Actions are now called on the store instance instead of destructured functions

## Rollback Plan

If issues arise, the previous composable-based implementation is available in git history before this refactor. However, the new Pinia-based approach is recommended for its improved architecture and performance benefits.
