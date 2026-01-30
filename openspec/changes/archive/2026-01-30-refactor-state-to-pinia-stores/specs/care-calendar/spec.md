# care-calendar Specification Delta

## ADDED Requirements

### Requirement: Calendar Events Pinia Store for State Management

The system SHALL use a Pinia store for centralized calendar event state management, aggregating events from multiple sources.

#### Scenario: Store aggregates events from multiple sources

- **GIVEN** the calendar needs to display events from multiple sources
- **WHEN** components access the calendar events store
- **THEN** the store aggregates Community Gatherings, Member Milestones, and Care Reminders
- **AND** all components share the same aggregated events state
- **AND** events are fetched and combined once per session
- **AND** filtering is performed efficiently on cached data

#### Scenario: Store manages event subscriptions

- **GIVEN** the calendar requires real-time event data
- **WHEN** the calendar page initializes
- **THEN** the store sets up Firestore subscriptions for community events
- **AND** the store loads member milestones from members data
- **AND** the store subscribes to care reminders
- **AND** all subscriptions are cleaned up when not needed

#### Scenario: Store provides filtering and search

- **GIVEN** users need to filter calendar events
- **WHEN** components apply filters
- **THEN** the store provides `updateFilters()` action
- **AND** the store's `allEvents` computed property reflects filters
- **AND** filtering is performed on cached data without re-fetching
- **AND** filters include: member, event type, search query

### Requirement: Care Notes and Reminders Stores for Timeline Data

The system SHALL use dedicated Pinia stores for care notes and care reminders real-time data.

#### Scenario: Care notes store manages subscriptions

- **GIVEN** a component needs care notes for a member
- **WHEN** the component calls `careNotesStore.subscribe(memberId)`
- **THEN** the store establishes a Firestore onSnapshot listener
- **AND** updates reactive state with real-time changes
- **AND** the component calls `careNotesStore.cleanup()` on unmount
- **AND** prevents duplicate subscriptions across components

#### Scenario: Care reminders store manages subscriptions

- **GIVEN** a component needs care reminders for a member
- **WHEN** the component calls `careRemindersStore.subscribe(memberId)`
- **THEN** the store establishes a Firestore onSnapshot listener
- **AND** filters expired reminders client-side
- **AND** sorts by due date (soonest first)
- **AND** updates reactive state with real-time changes

## MODIFIED Requirements

### Requirement: Calendar View Displays Aggregated Events

The system SHALL provide calendar views (month and agenda) that display events from multiple sources, using the calendar events Pinia store.

#### Scenario: Calendar accesses aggregated events from store

- **GIVEN** a user views the calendar page
- **WHEN** the calendar view renders
- **THEN** the component accesses events via `const calendarStore = useCalendarEventsStore()`
- **AND** displays events from `calendarStore.allEvents` computed property
- **AND** uses `calendarStore.loading` for loading states
- **AND** does not fetch events independently

### Requirement: Focus Panel Member Search

The system SHALL provide a focus panel for member-specific calendar filtering, using the members Pinia store.

#### Scenario: Focus panel uses members store for search

- **GIVEN** a user searches for a member in the focus panel
- **WHEN** the component performs search
- **THEN** the component uses `membersStore.members` for member list
- **AND** uses `membersStore.searchMembers(query)` for filtering
- **AND** does not maintain separate members state

## REMOVED Requirements

_No requirements are being removed. This is a refactor that maintains all existing functionality while improving architecture._
