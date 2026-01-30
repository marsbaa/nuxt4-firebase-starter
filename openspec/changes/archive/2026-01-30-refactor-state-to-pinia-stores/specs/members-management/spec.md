# members-management Specification Delta

## ADDED Requirements

### Requirement: Members Pinia Store for State Management

The system SHALL use a Pinia store for centralized member state management, eliminating duplicate API calls and providing a single source of truth.

#### Scenario: Store provides centralized members state

- **GIVEN** multiple components need access to members data
- **WHEN** components access the members store
- **THEN** all components share the same reactive state instance
- **AND** members data is fetched only once per session
- **AND** all components see updates simultaneously
- **AND** no duplicate API calls occur

#### Scenario: Store manages members CRUD operations

- **GIVEN** a component needs to perform CRUD operations on members
- **WHEN** the component calls store actions
- **THEN** the store provides `fetchMembers()`, `createMember()`, `updateMember()`, `deleteMember()` actions
- **AND** the store updates reactive state after operations complete
- **AND** all components observing the store see the changes
- **AND** toast notifications are centralized in store actions

#### Scenario: Store handles loading and error states

- **GIVEN** the members store is performing an async operation
- **WHEN** the operation is in progress
- **THEN** the store sets `isLoading` to true
- **AND** components can reactively display loading UI
- **AND** the store sets `error` state on failure
- **AND** the store clears error state on successful operations

#### Scenario: Store provides search and sort functionality

- **GIVEN** components need to search or sort members
- **WHEN** components access store getters or computed properties
- **THEN** the store provides `searchMembers(query)` getter
- **AND** the store provides `sortedMembers` getter
- **AND** filtering is performed efficiently on cached data
- **AND** no additional API calls are required for search/sort

### Requirement: Members Data Preloading on App Initialization

The system SHALL preload members data on app initialization to eliminate loading states on navigation.

#### Scenario: Members load on authenticated app init

- **GIVEN** a user successfully authenticates
- **WHEN** the app initialization plugin runs
- **THEN** the members store automatically fetches members
- **AND** members are available before user navigates to any page
- **AND** polling starts automatically for real-time updates
- **AND** the loading state is handled centrally

#### Scenario: Members refresh on authentication state change

- **GIVEN** the app is running
- **WHEN** the user authentication state changes (login/logout)
- **THEN** the members store fetches fresh data on login
- **AND** the store clears state and stops polling on logout
- **AND** the store resets to initial state on logout
- **AND** no stale data persists across sessions

### Requirement: Centralized Members Polling

The system SHALL manage member data polling in a single store instance to prevent resource waste.

#### Scenario: Single polling instance across app

- **GIVEN** multiple pages and components need members data
- **WHEN** the app is authenticated and running
- **THEN** only one polling interval is active
- **AND** the polling runs at 5-second intervals
- **AND** all components receive updates from the same poll
- **AND** no duplicate polling timers exist

#### Scenario: Polling lifecycle controlled by auth state

- **GIVEN** the members store manages polling
- **WHEN** the user logs in
- **THEN** the store calls `startPolling()` automatically
- **AND** continues polling while authenticated
- **WHEN** the user logs out
- **THEN** the store calls `stopPolling()` automatically
- **AND** clears the interval timer
- **AND** prevents memory leaks

### Requirement: Member Utility Functions Remain in Composable

The system SHALL keep pure utility functions separate from state management in a dedicated composable.

#### Scenario: Utility functions are importable separately

- **GIVEN** components need member utility functions
- **WHEN** components import from `~/composables/useMemberUtils`
- **THEN** functions like `parseMemberName()`, `formatBirthday()`, `calculateAge()`, `getMemberInitials()` are available
- **AND** functions are pure (no side effects, no state dependency)
- **AND** functions are tree-shakeable
- **AND** functions work independently of store

#### Scenario: Utilities support both store and component usage

- **GIVEN** utilities are separated from state management
- **WHEN** components or stores need name parsing or formatting
- **THEN** both can import utilities directly
- **AND** utilities work with plain data objects
- **AND** no circular dependencies exist
- **AND** code remains maintainable and testable

## MODIFIED Requirements

### Requirement: Members Page Layout

The system SHALL provide a Members page with a clear hierarchical layout consisting of a page header, search and summary bar, members table, and pagination footer, using the members Pinia store for data.

#### Scenario: Page displays complete layout structure with store data

- **GIVEN** a user is authenticated and navigates to the Members page
- **WHEN** the page loads
- **THEN** the page accesses the members store via `const membersStore = useMembersStore()`
- **AND** displays members from `membersStore.members`
- **AND** shows loading state from `membersStore.isLoading`
- **AND** the page header displays the title "Members" and subtitle "Manage and care for your community members"
- **AND** the primary action button "+ New Member" appears in the top-right
- **AND** a search bar with placeholder "Search by name, email or location…" is visible
- **AND** the member count displays as "X members total" from store state
- **AND** the members table is rendered with columns: #, Member, Contact Info, Location, Actions
- **AND** pagination controls appear at the bottom showing "Showing X to Y of Z members"

### Requirement: Loading State

The system SHALL display a loading state while fetching member data, using the store's centralized loading state.

#### Scenario: Loading displays skeleton screens from store state

- **GIVEN** the Members page is loading member data
- **WHEN** `membersStore.isLoading` is true
- **THEN** skeleton screens appear in the table structure
- **AND** maintain the same layout as actual member rows
- **AND** use subtle pulse animation
- **AND** the loading state is shared across all components

### Requirement: Data Persistence

The system SHALL store and retrieve member data from server API endpoints with Firebase Admin SDK, coordinated through the members store.

#### Scenario: Members load from server API via store

- **GIVEN** members exist in Firestore
- **WHEN** the members store fetches data
- **THEN** the store calls `/api/members` endpoint with authentication token
- **AND** the server uses Firebase Admin SDK to query Firestore
- **AND** the store updates reactive state with returned data
- **AND** parses the name field and calculates age using utility functions
- **AND** displays formatted data in the table

#### Scenario: Real-time updates via polling from store

- **GIVEN** the Members page is open
- **WHEN** the store's polling interval fires (every 5 seconds)
- **THEN** the store fetches updated members from server API
- **AND** the change appears in all components observing store state
- **AND** the member count updates accordingly
- **AND** only one polling request is made (not per component)

#### Scenario: New member persists via store action

- **GIVEN** a user creates a new member
- **WHEN** the form calls `membersStore.createMember(memberData)`
- **THEN** the store sends POST request to `/api/members`
- **AND** the server creates entry in Firestore with Firebase Admin SDK
- **AND** the store refreshes members list automatically
- **AND** sets `createdAt`, `updatedAt` timestamps server-side
- **AND** sets `createdBy` to the current user's ID

#### Scenario: Updated member persists via store action

- **GIVEN** a user edits an existing member
- **WHEN** the form calls `membersStore.updateMember(memberId, memberData)`
- **THEN** the store sends PATCH request to `/api/members/{memberId}`
- **AND** the server updates Firestore entry with Firebase Admin SDK
- **AND** the store refreshes members list automatically
- **AND** the `updatedAt` timestamp is refreshed server-side
- **AND** the `updatedBy` field is set to the current user's ID

#### Scenario: Deleted member removes via store action

- **GIVEN** a user confirms member deletion
- **WHEN** the UI calls `membersStore.deleteMember(memberId)`
- **THEN** the store sends DELETE request to `/api/members/{memberId}`
- **AND** the server removes entry from Firestore with Firebase Admin SDK
- **AND** the store refreshes members list automatically
- **AND** the member no longer appears in any queries

## REMOVED Requirements

_No requirements are being removed. This is a refactor that maintains all existing functionality while improving architecture._
