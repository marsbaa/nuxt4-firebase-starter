# Refactor State Management to Pinia Stores

## Why

Currently, CRUD operations and data fetching are scattered across multiple composables ([`useMembers`](app/composables/useMembers.ts:144), [`useCareNotes`](app/composables/useCareNotes.ts:78), [`useCareReminders`](app/composables/useCareReminders.ts:74), [`useCalendarEvents`](app/composables/useCalendarEvents.ts:50)). This leads to:

1. **Duplicate API calls**: Each component using a composable creates its own instance and fetches data independently
2. **No global state cache**: Members data, care notes, and reminders aren't shared across components
3. **Inefficient polling**: Multiple polling instances running for the same data (e.g., [`startPolling()`](app/composables/useMembers.ts:220) creates a new interval per component)
4. **Memory overhead**: Duplicate reactive refs for identical data across component instances
5. **Difficult data preloading**: Cannot easily fetch data on app initialization or route navigation guards

Moving CRUD operations to Pinia stores will provide:

- Single source of truth for all app state
- Shared cache across all components
- Centralized data fetching on app load or route enter
- Better performance with eliminated duplicate API calls
- SSR-compatible state management
- Better DevTools debugging

## What Changes

- **Create Pinia stores** for each data domain:
  - [`app/stores/members.ts`](app/stores/members.ts:1) - Members CRUD and state
  - [`app/stores/careNotes.ts`](app/stores/careNotes.ts:1) - Care notes CRUD and real-time updates
  - [`app/stores/careReminders.ts`](app/stores/careReminders.ts:1) - Care reminders CRUD and real-time updates
  - [`app/stores/calendarEvents.ts`](app/stores/calendarEvents.ts:1) - Calendar events and aggregation

- **Refactor composables** to become utility-only:
  - Keep pure utility functions (parseMemberName, formatBirthday, calculateAge, etc.)
  - Remove CRUD operations and state management
  - Create thin composable wrappers that access stores (optional pattern)

- **Update components** to use stores:
  - Replace `const { members, fetchMembers } = useMembers()` with `const membersStore = useMembersStore()`
  - Access state via store properties: `membersStore.members`, `membersStore.isLoading`
  - Call store actions: `membersStore.fetchMembers()`, `membersStore.createMember()`

- **Add data preloading**:
  - Fetch members on app initialization ([`app/plugins/init-stores.client.ts`](app/plugins/init-stores.client.ts:1))
  - Use route middleware for page-specific data ([`beforeRouteEnter`](app/pages/members/index.vue:1) or middleware)

- **Centralize polling**:
  - Single polling instance in members store
  - Start/stop based on route or app state

## Impact

### Affected Specs

- `members-management` - CRUD operations moved to store
- `care-calendar` - State aggregation moved to store
- `dashboard` - Data fetching patterns updated

### Affected Code

**Stores (New)**:

- `app/stores/members.ts` - Members state and CRUD
- `app/stores/careNotes.ts` - Care notes state and CRUD
- `app/stores/careReminders.ts` - Care reminders state and CRUD
- `app/stores/calendarEvents.ts` - Calendar events aggregation

**Composables (Refactored)**:

- [`app/composables/useMembers.ts`](app/composables/useMembers.ts:1) - Keep utilities, remove CRUD
- [`app/composables/useCareNotes.ts`](app/composables/useCareNotes.ts:1) - Remove (or keep as store wrapper)
- [`app/composables/useCareReminders.ts`](app/composables/useCareReminders.ts:1) - Remove (or keep as store wrapper)
- [`app/composables/useCalendarEvents.ts`](app/composables/useCalendarEvents.ts:1) - Remove (or keep as store wrapper)

**Pages (Updated)** - All components using the composables:

- [`app/pages/members/index.vue`](app/pages/members/index.vue:18)
- [`app/pages/members/[id].vue`](app/pages/members/[id].vue:12)
- [`app/pages/members/view/[id].vue`](app/pages/members/view/[id].vue:12)
- [`app/pages/calendar.vue`](app/pages/calendar.vue:1)
- [`app/pages/dashboard.vue`](app/pages/dashboard.vue:1)

**Components (Updated)**:

- [`app/components/DashboardPersonSearch.vue`](app/components/DashboardPersonSearch.vue:4)
- [`app/components/DashboardOpeningMoment.vue`](app/components/DashboardOpeningMoment.vue:2)
- [`app/components/DashboardHoldingInMind.vue`](app/components/DashboardHoldingInMind.vue:15)
- [`app/components/CalendarFocusPanel.vue`](app/components/CalendarFocusPanel.vue:39)
- [`app/components/CareSpace.vue`](app/components/CareSpace.vue:1)
- [`app/components/MemberTable.vue`](app/components/MemberTable.vue:1)
- All other components referencing the composables

### Breaking Changes

- **None** - This is an internal refactor. External behavior remains identical.
- Composable APIs remain available (either as store wrappers or utilities)
- Component interfaces unchanged

### Migration Strategy

1. Create stores with identical APIs to current composables
2. Test stores in isolation
3. Migrate components one by one
4. Keep composables as deprecated wrappers during transition (optional)
5. Remove old composable code once all migrations complete

### Performance Impact

- **Positive**: Reduced API calls, eliminated duplicate state, single polling instance
- **Positive**: Faster page loads with preloaded data
- **Neutral**: Pinia adds ~10KB gzipped (already included in Nuxt 4)

### Developer Experience

- **Positive**: Better debugging with Vue DevTools
- **Positive**: Clearer state management patterns
- **Positive**: Easier testing with store mocks
- **Neutral**: Slight learning curve for Pinia patterns (standard in Vue ecosystem)
