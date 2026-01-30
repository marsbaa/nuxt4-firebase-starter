# Design: Refactor State Management to Pinia Stores

## Context

The Pastoral Care App currently uses Vue composables for all data fetching and state management. While composables are excellent for encapsulating logic, they have limitations for global state:

**Current Pattern**:

```typescript
// Component A
const { members, fetchMembers } = useMembers();
fetchMembers(); // API call #1

// Component B (different part of tree)
const { members, fetchMembers } = useMembers();
fetchMembers(); // API call #2 - duplicate!
```

Each composable invocation creates a new reactive state instance, leading to:

- Duplicate API calls across components
- Wasted memory with redundant data
- Complex synchronization between instances
- Difficult data preloading patterns

**Constraints**:

- Must maintain existing behavior (no breaking changes)
- Must preserve real-time Firestore subscriptions
- Must work with Nuxt 4 SSR patterns
- Must support route-based data preloading
- Must maintain pastoral care principles (no corporate metrics language)

**Stakeholders**:

- Developers: Clearer state management patterns
- Users: Faster page loads, better performance
- Ops: Reduced Firebase API calls (cost savings)

## Goals / Non-Goals

### Goals

- ✅ Centralize all CRUD operations in Pinia stores
- ✅ Eliminate duplicate API calls and redundant state
- ✅ Enable data preloading on app initialization
- ✅ Support route-based data fetching (beforeRouteEnter)
- ✅ Maintain real-time Firestore subscriptions
- ✅ Preserve all existing functionality (zero behavior changes)
- ✅ Improve developer experience with Vue DevTools
- ✅ Keep utility functions accessible (parseMemberName, formatBirthday, etc.)

### Non-Goals

- ❌ Change component APIs or behavior
- ❌ Refactor UI or design patterns
- ❌ Modify Firestore security rules
- ❌ Change server API endpoints
- ❌ Add new features (pure refactor only)
- ❌ Convert to different state library (Pinia is Nuxt standard)

## Decisions

### Decision 1: Use Pinia for Global State Management

**Rationale**: Pinia is the official Vue state management library and comes built-in with Nuxt 4.

**Alternatives Considered**:

1. **Vuex** - Deprecated in favor of Pinia
2. **Custom global refs** - Less structure, no DevTools support
3. **Keep composables** - Doesn't solve duplicate state problem

**Why Pinia**:

- Official Nuxt 4 integration (no extra dependencies)
- Excellent TypeScript support
- Vue DevTools integration
- SSR-compatible out of the box
- Simpler API than Vuex (no mutations, direct actions)
- Better tree-shaking and code splitting

### Decision 2: Store Architecture - Domain-Driven

Create one store per domain entity:

```
stores/
├── members.ts          # Member CRUD + state
├── careNotes.ts        # Care notes CRUD + real-time
├── careReminders.ts    # Care reminders CRUD + real-time
└── calendarEvents.ts   # Event aggregation + filtering
```

**Rationale**: Matches existing composable structure, clear boundaries, easy to reason about.

**Alternatives Considered**:

1. **Single monolithic store** - Too complex, hard to maintain
2. **Store per page** - Duplicates logic, doesn't match domain model
3. **Store per feature** - Ambiguous boundaries, cross-cutting concerns

**Why Domain-Driven**:

- Natural mapping from composables
- Clear ownership of state and operations
- Easier testing and mocking
- Aligns with existing mental model

### Decision 3: Keep Utility Functions in Composables

Utility functions like `parseMemberName()`, `formatBirthday()`, `calculateAge()` will remain in composables, NOT moved to stores.

**Rationale**: These are pure functions with no state dependency. Composables are perfect for shared utilities.

**Pattern**:

```typescript
// app/composables/useMemberUtils.ts (renamed from useMembers)
export const parseMemberName = (name: string): ParsedName => { ... }
export const formatBirthday = (birthday: string): string => { ... }
export const calculateAge = (birthday: string): number => { ... }
export const getMemberInitials = (name: string): string => { ... }

// Components use utilities directly
import { parseMemberName, formatBirthday } from '~/composables/useMemberUtils'
```

**Why Keep in Composables**:

- No state dependency
- Tree-shakeable imports
- Reusable across stores and components
- Matches Vue ecosystem patterns

### Decision 4: Preload Members Data on App Init

Members list will be fetched once on app initialization via a Nuxt plugin.

**Implementation**:

```typescript
// app/plugins/init-stores.client.ts
export default defineNuxtPlugin(async () => {
  const membersStore = useMembersStore();
  const { user } = useFirebase();

  // Fetch members when auth is ready
  if (user.value) {
    await membersStore.fetchMembers();
    membersStore.startPolling();
  }

  // Re-fetch on auth state changes
  watch(user, (newUser) => {
    if (newUser) {
      membersStore.fetchMembers();
      membersStore.startPolling();
    } else {
      membersStore.stopPolling();
      membersStore.$reset();
    }
  });
});
```

**Rationale**: Members data is needed across most pages (dashboard, calendar, member list). Preloading eliminates loading states and improves UX.

**Why Plugin over Middleware**:

- Runs once on app init (not per route)
- Survives navigation (persistent state)
- Cleaner lifecycle management

### Decision 5: Real-Time Subscriptions Stay in Stores

Firestore `onSnapshot` listeners will be managed within stores, not composables.

**Pattern**:

```typescript
// stores/careNotes.ts
export const useCareNotesStore = defineStore("careNotes", () => {
  const notes = ref<CareNote[]>([]);
  let unsubscribe: Unsubscribe | null = null;

  const subscribe = (memberId: string) => {
    if (unsubscribe) unsubscribe();

    const q = query(
      collection(db, "careNotes"),
      where("memberId", "==", memberId),
      orderBy("createdAt", "desc"),
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
      notes.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });
  };

  const cleanup = () => {
    if (unsubscribe) unsubscribe();
  };

  return { notes: readonly(notes), subscribe, cleanup };
});
```

**Usage in Components**:

```vue
<script setup>
const careNotesStore = useCareNotesStore();
const memberId = ref("member-123");

onMounted(() => careNotesStore.subscribe(memberId.value));
onUnmounted(() => careNotesStore.cleanup());

watch(memberId, (newId) => careNotesStore.subscribe(newId));
</script>
```

**Rationale**:

- Store manages subscription lifecycle
- Components only call subscribe/cleanup
- No duplicate listeners across components
- Cleaner component code

### Decision 6: Polling Controlled by App State

Members polling will start on auth and stop on logout. Single centralized polling instance.

**Implementation**:

```typescript
// stores/members.ts
export const useMembersStore = defineStore("members", () => {
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  const POLL_INTERVAL = 5000;

  const startPolling = () => {
    if (pollTimer) return; // Already polling
    pollTimer = setInterval(() => fetchMembers(), POLL_INTERVAL);
  };

  const stopPolling = () => {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };

  return { startPolling, stopPolling };
});
```

**Rationale**:

- Only one polling instance (not per component)
- Controlled lifecycle (start on auth, stop on logout)
- Prevents memory leaks

### Decision 7: Maintain Composable Wrappers (Optional, Deprecated)

During migration, optionally keep composables as thin wrappers for backward compatibility.

**Pattern**:

```typescript
// app/composables/useMembers.ts (deprecated wrapper)
/**
 * @deprecated Use useMembersStore() directly
 */
export const useMembers = () => {
  const store = useMembersStore();

  return {
    members: store.members,
    isLoading: store.isLoading,
    error: store.error,
    fetchMembers: store.fetchMembers,
    createMember: store.createMember,
    updateMember: store.updateMember,
    deleteMember: store.deleteMember,
  };
};
```

**Rationale**:

- Allows gradual migration
- Components continue working during transition
- Can remove once all components updated

**Decision**: This is optional. Direct store usage is preferred.

## Risks / Trade-offs

### Risk 1: Breaking Components During Migration

**Mitigation**:

- Migrate one component at a time
- Test each component thoroughly before moving to next
- Keep composable wrappers during transition
- Use feature flags if needed for gradual rollout

### Risk 2: Real-Time Subscription Lifecycle Bugs

**Mitigation**:

- Extensive testing of subscribe/cleanup patterns
- Add lifecycle logging in development
- Test with multiple tabs/windows open
- Monitor Firebase console for orphaned listeners

### Risk 3: Performance Regression

**Mitigation**:

- Benchmark before/after with Chrome DevTools
- Monitor Firebase API call counts
- Test with large datasets (>100 members)
- Verify no memory leaks with prolonged use

### Trade-off: More Boilerplate for Subscriptions

**Before** (Composable):

```typescript
const { notes } = useCareNotes(memberId); // Auto-subscribes
```

**After** (Store):

```typescript
const store = useCareNotesStore();
onMounted(() => store.subscribe(memberId.value));
onUnmounted(() => store.cleanup());
```

**Rationale**: The explicitness is worth it for:

- Better control over subscription lifecycle
- No hidden magic in composable
- Clearer in component code what's happening
- Prevents accidental duplicate subscriptions

### Trade-off: Initial Bundle Size Increase

Pinia adds ~10KB gzipped to bundle. However, this is:

- Already included in Nuxt 4 (no extra dependency)
- Offset by better tree-shaking of stores vs composables
- Worth it for performance gains from reduced API calls

## Migration Plan

### Phase 1: Create Stores (Week 1)

1. Create all store files with complete implementations
2. Write unit tests for store logic
3. Test stores in isolation with mock data
4. Verify real-time subscriptions work correctly

### Phase 2: Migrate Core Pages (Week 1-2)

1. Members index page (`pages/members/index.vue`)
2. Member detail page (`pages/members/view/[id].vue`)
3. Dashboard page (`pages/dashboard.vue`)
4. Calendar page (`pages/calendar.vue`)

Test each page thoroughly before moving to next.

### Phase 3: Migrate Components (Week 2)

1. Dashboard components (DashboardPersonSearch, DashboardOpeningMoment, etc.)
2. Calendar components (CalendarFocusPanel, CareCalendar, etc.)
3. Care Space components (CareNoteList, CareReminderList, etc.)
4. Member components (MemberTable, MemberSearchInput, etc.)

### Phase 4: Refactor Composables (Week 2-3)

1. Extract utility functions to separate files
2. Remove CRUD operations from composables
3. Update all imports in components
4. Add deprecation warnings if keeping wrappers

### Phase 5: Add Preloading (Week 3)

1. Create init plugin for members preloading
2. Add route middleware for page-specific data
3. Test navigation performance
4. Verify no duplicate fetches

### Phase 6: Cleanup (Week 3)

1. Remove deprecated composable code
2. Update documentation
3. Final testing pass
4. Performance benchmarking

### Rollback Plan

If critical issues arise:

1. Git revert to pre-migration state
2. Identify specific component causing issues
3. Fix in isolation on feature branch
4. Re-deploy once stable

The gradual migration approach allows partial rollback if needed (e.g., revert specific pages while keeping others).

## Open Questions

1. **Should we keep composable wrappers or remove entirely?**
   - Leaning toward: Remove entirely, use stores directly
   - Simpler mental model, one clear pattern

2. **Should we preload care notes/reminders on app init?**
   - Leaning toward: No, only fetch on member page
   - Not needed globally, would waste bandwidth

3. **Should we add request deduplication for concurrent fetches?**
   - Leaning toward: Not initially, add if becomes problem
   - YAGNI - stores should prevent duplicates naturally

4. **Should we persist some store state to localStorage?**
   - Leaning toward: No, always fetch fresh from server
   - Avoid stale data issues, Firebase is fast enough

## Success Criteria

This refactor is successful if:

✅ All existing functionality works identically
✅ No duplicate API calls in network tab
✅ Page navigation is faster (data preloaded)
✅ Only one polling instance active
✅ Vue DevTools shows clean store state
✅ All components using stores consistently
✅ Code is easier to understand and maintain
✅ No memory leaks or orphaned subscriptions
✅ Performance benchmarks show improvement
✅ Zero user-facing breaking changes

## References

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Nuxt 4 State Management](https://nuxt.com/docs/getting-started/state-management)
- [Vue Composables Best Practices](https://vuejs.org/guide/reusability/composables.html)
- [Firestore onSnapshot Lifecycle](https://firebase.google.com/docs/firestore/query-data/listen)
