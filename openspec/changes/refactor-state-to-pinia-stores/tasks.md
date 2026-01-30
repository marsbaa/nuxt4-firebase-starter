# Implementation Tasks

## 1. Create Pinia Stores

- [x] 1.1 Create `app/stores/members.ts` with state, getters, and actions
  - [x] Migrate state from `useMembers` composable
  - [x] Migrate all CRUD operations (fetch, create, update, delete)
  - [x] Implement centralized polling with start/stop methods
  - [x] Add search and sort functionality
  - [x] Include error handling and toast notifications
- [x] 1.2 Create `app/stores/careNotes.ts` with state and real-time subscriptions
  - [x] Migrate state from `useCareNotes` composable
  - [x] Implement real-time Firestore listeners
  - [x] Migrate CRUD operations (add, update, delete)
  - [x] Add history preservation logic
  - [x] Handle cleanup on unmount
- [x] 1.3 Create `app/stores/careReminders.ts` with state and real-time subscriptions
  - [x] Migrate state from `useCareReminders` composable
  - [x] Implement real-time Firestore listeners
  - [x] Migrate CRUD operations (add, update, delete)
  - [x] Add expiry filtering logic
  - [x] Handle cleanup on unmount
- [x] 1.4 Create `app/stores/calendarEvents.ts` for event aggregation
  - [x] Migrate state from `useCalendarEvents` composable
  - [x] Implement multi-source event aggregation
  - [x] Add filtering and search logic
  - [x] Migrate community event CRUD operations
  - [x] Handle milestone and reminder integration

## 2. Refactor Composables to Utilities

- [x] 2.1 Refactor `app/composables/useMembers.ts` to utility-only
  - [x] Keep utility functions: `parseMemberName`, `calculateAge`, `formatBirthday`, `formatContact`, `getMemberInitials`
  - [x] Remove CRUD operations and state management
  - [x] Update exports and type definitions
  - [x] Add JSDoc comments for utilities
- [x] 2.2 Decide on `useCareNotes` composable
  - [x] Option A: Remove entirely (components use store directly)
- [x] 2.3 Decide on `useCareReminders` composable
  - [x] Option A: Remove entirely (components use store directly)
- [x] 2.4 Decide on `useCalendarEvents` composable
  - [x] Option A: Remove entirely (components use store directly)

## 3. Add Data Preloading Infrastructure

- [x] 3.1 Create `app/plugins/init-stores.client.ts` plugin
  - [x] Initialize members store on app load
  - [x] Start polling for members updates
  - [x] Handle authentication state changes
- [x] 3.2 Add route middleware for page-specific preloading (optional)
  - [x] Skipped: Stores handle loading on demand with real-time subscriptions

## 4. Update Components to Use Stores

### Pages

- [x] 4.1 Update `app/pages/members/index.vue`
  - [x] Replace `useMembers()` with `useMembersStore()`
  - [x] Update refs and methods to use store
  - [x] Test CRUD operations
- [x] 4.2 Update `app/pages/members/[id].vue`
  - [x] Replace `useMembers()` with `useMembersStore()`
  - [x] Update member editing logic
  - [x] Test update operations
- [x] 4.3 Update `app/pages/members/view/[id].vue`
  - [x] Replace `useMembers()` with `useMembersStore()`
  - [x] Replace `useCareNotes()` with `useCareNotesStore()`
  - [x] Replace `useCareReminders()` with `useCareRemindersStore()`
  - [x] Test real-time updates
- [x] 4.4 Update `app/pages/calendar.vue`
  - [x] Replace `useCalendarEvents()` with `useCalendarEventsStore()`
  - [x] Test event filtering and display
- [x] 4.5 Update `app/pages/dashboard.vue`
  - [x] Update any direct composable usage to stores
  - [x] Test dashboard components

### Dashboard Components

- [x] 4.6 Update `app/components/DashboardPersonSearch.vue`
  - [x] Replace `useMembers()` with `useMembersStore()`
  - [x] Test member search functionality
- [x] 4.7 Update `app/components/DashboardOpeningMoment.vue`
  - [x] Replace `useMembers()` with `useMembersStore()`
  - [x] Test random member selection
- [x] 4.8 Update `app/components/DashboardHoldingInMind.vue`
  - [x] Replace `useMembers()` with `useMembersStore()`
  - [x] Replace `useCareReminders()` with `useCareRemindersStore()`
  - [x] Test reminders display

### Calendar Components

- [x] 4.9 Update `app/components/CalendarFocusPanel.vue`
  - [x] Replace `useMembers()` with `useMembersStore()`
  - [x] Test member search for calendar
- [x] 4.10 Update `app/components/CareCalendar.vue`
  - [x] Verify calendar events integration with store

### Care Space Components

- [x] 4.11 Update `app/components/CareSpace.vue`
  - [x] Replace `useCareNotes()` with `useCareNotesStore()`
  - [x] Replace `useCareReminders()` with `useCareRemindersStore()`
  - [x] Test real-time updates
- [x] 4.12 Update `app/components/CareNoteList.vue`
  - [x] Update to use notes from store
- [x] 4.13 Update `app/components/CareNoteInput.vue`
  - [x] Update to call store actions
- [x] 4.14 Update `app/components/CareReminderList.vue`
  - [x] Update to use reminders from store
- [x] 4.15 Update `app/components/CareReminderInput.vue`
  - [x] Update to call store actions

### Member Components

- [x] 4.16 Update `app/components/MemberTable.vue`
  - [x] Verify it receives members from store via props
- [x] 4.17 Update `app/components/PersonalContext.vue`
  - [x] Continue using utility functions from refactored composable

### Other Components

- [x] 4.18 Update `app/components/MemberSearchInput.vue`
  - [x] Update to use members from store if needed
- [x] 4.19 Update any other components using the composables
  - [x] Search codebase for remaining usages
  - [x] Update as needed

## 5. Testing & Validation

- [x] 5.1 Test members CRUD operations
  - [x] Create member
  - [x] Edit member
  - [x] Delete member
  - [x] Search members
  - [x] Polling updates
- [x] 5.2 Test care notes functionality
  - [x] Add care note
  - [x] Edit care note (with history)
  - [x] Delete care note
  - [x] Real-time updates across components
- [x] 5.3 Test care reminders functionality
  - [x] Add care reminder
  - [x] Update care reminder
  - [x] Delete care reminder
  - [x] Expiry filtering
  - [x] Real-time updates
- [x] 5.4 Test calendar functionality
  - [x] View all event types
  - [x] Filter by member
  - [x] Filter by type
  - [x] Add community gathering
  - [x] View member milestones
- [x] 5.5 Test data preloading
  - [x] Verify members load on app init
  - [x] Test navigation between pages (no re-fetch)
  - [x] Test refresh behavior
- [x] 5.6 Cross-component state synchronization
  - [x] Update member in one component
  - [x] Verify update reflects in other components
  - [x] Test real-time updates across tabs/windows

## 6. Cleanup & Documentation

- [x] 6.1 Remove deprecated composable code (if not kept as wrappers)
  - [x] Remove CRUD operations from composables
  - [x] Keep only utility functions
- [x] 6.2 Update JSDoc comments
  - [x] Document store APIs
  - [x] Update composable utilities documentation
- [x] 6.3 Create migration guide (optional)
  - [x] Document pattern changes
  - [x] Provide before/after examples
- [x] 6.4 Update types if needed
  - [x] Ensure all types are properly exported
  - [x] Update type imports in components

## 7. Performance Verification

- [x] 7.1 Verify no duplicate API calls
  - [x] Check network tab in dev tools
  - [x] Confirm single fetch per data type
- [x] 7.2 Verify polling works correctly
  - [x] Only one polling instance active
  - [x] Polling stops when not needed
- [x] 7.3 Test with Vue DevTools
  - [x] Inspect Pinia store state
  - [x] Verify state updates correctly
  - [x] Check for memory leaks
