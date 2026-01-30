# dashboard Specification Delta

## MODIFIED Requirements

### Requirement: Opening Moment Component

The system SHALL display a random member as the "Opening Moment" to foster prayerful attentiveness, using the members Pinia store for data access.

#### Scenario: Component accesses members from store

- **GIVEN** the Opening Moment component is rendered
- **WHEN** the component initializes
- **THEN** the component accesses members via `const membersStore = useMembersStore()`
- **AND** uses `membersStore.members` for member selection
- **AND** uses `membersStore.isLoading` for loading state
- **AND** does not fetch members independently

### Requirement: Holding In Mind Component

The system SHALL display upcoming care reminders for multiple members, using the care reminders Pinia store for data access.

#### Scenario: Component accesses reminders from store

- **GIVEN** the Holding In Mind component is rendered
- **WHEN** the component initializes
- **THEN** the component accesses reminders via `const careRemindersStore = useCareRemindersStore()`
- **AND** uses store data for displaying reminders
- **AND** does not manage Firestore subscriptions independently

### Requirement: Person Search Component

The system SHALL provide a search interface for members, using the members Pinia store for data and search functionality.

#### Scenario: Component uses store for search

- **GIVEN** a user enters a search query
- **WHEN** the component performs search
- **THEN** the component uses `membersStore.searchMembers(query)` from store
- **AND** displays results from store's filtered members
- **AND** does not maintain separate search state

## ADDED Requirements

_No new requirements are being added. This is a refactor that updates data access patterns._

## REMOVED Requirements

_No requirements are being removed. This is a refactor that maintains all existing functionality while improving architecture._
