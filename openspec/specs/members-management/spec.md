# members-management Specification

## Purpose
TBD - created by archiving change add-members-page. Update Purpose after archive.
## Requirements
### Requirement: Members Page Layout

The system SHALL provide a Members page with a clear hierarchical layout consisting of a page header, search and summary bar, members table, and pagination footer.

#### Scenario: Page displays complete layout structure

- **GIVEN** a user is authenticated and navigates to the Members page
- **WHEN** the page loads
- **THEN** the page header displays the title "Members" and subtitle "Manage and care for your community members"
- **AND** the primary action button "+ New Member" appears in the top-right
- **AND** a search bar with placeholder "Search by name, email or location…" is visible
- **AND** the member count displays as "X members total" on the right side of the search bar
- **AND** the members table is rendered with columns: #, Member, Contact Info, Location, Actions
- **AND** pagination controls appear at the bottom showing "Showing X to Y of Z members"

### Requirement: Member Display in Table

The system SHALL display each member in a table row with essential pastoral care information including avatar, name, age, contact details, and location.

#### Scenario: Member row displays complete information

- **GIVEN** a member exists with complete data
- **WHEN** the Members page displays the member
- **THEN** the member row shows a row number in the # column
- **AND** displays a circular avatar with two-letter initials (first name + last name)
- **AND** shows the full name prominently
- **AND** shows date of birth and calculated age in the format "MMM DD, YYYY • Age XX"
- **AND** displays phone number in the Contact Info column
- **AND** shows suburb name with a location pin icon in the Location column
- **AND** provides three action icons: view (eye), edit (pencil), and delete (trash)

#### Scenario: Member row handles missing contact information

- **GIVEN** a member exists without phone or email
- **WHEN** the Members page displays the member
- **THEN** the Contact Info column shows muted text "No contact info"

#### Scenario: Member row handles missing location

- **GIVEN** a member exists without location data
- **WHEN** the Members page displays the member
- **THEN** the Location column shows muted text "No location"

### Requirement: Member Search Functionality

The system SHALL provide search functionality to filter the member list by name, email, or location.

#### Scenario: Search filters members by name

- **GIVEN** multiple members exist in the system
- **WHEN** a user types "Sandra" in the search input
- **THEN** the member list updates to show only members whose first or last name contains "Sandra"
- **AND** the member count updates to reflect filtered results

#### Scenario: Search filters members by location

- **GIVEN** multiple members exist with different locations
- **WHEN** a user types "Glen Waverley" in the search input
- **THEN** the member list updates to show only members with location containing "Glen Waverley"

#### Scenario: Search is case-insensitive

- **GIVEN** a member named "Sandra Auterson" exists
- **WHEN** a user types "sandra" in lowercase
- **THEN** the member "Sandra Auterson" appears in results

#### Scenario: Search input is debounced

- **GIVEN** a user is typing in the search input
- **WHEN** the user types rapidly
- **THEN** the search filter does not execute until 300ms after the last keystroke

#### Scenario: Clearing search shows all members

- **GIVEN** a search filter is active
- **WHEN** a user clears the search input
- **THEN** all members are displayed again
- **AND** the member count returns to the total count

### Requirement: Member Count Display

The system SHALL display the total number of members in the community.

#### Scenario: Member count reflects total members

- **GIVEN** 66 members exist in the system
- **WHEN** the Members page loads without filters
- **THEN** the count displays "66 members total"

#### Scenario: Member count updates with search filter

- **GIVEN** 66 total members exist
- **WHEN** a search filter returns 5 results
- **THEN** the count displays "5 members total"

### Requirement: Pagination

The system SHALL provide pagination controls to navigate through the member list with configurable page sizes.

#### Scenario: Pagination displays page status

- **GIVEN** 66 members exist with 5 members per page
- **WHEN** viewing page 1
- **THEN** pagination shows "Showing 1 to 5 of 66 members"
- **AND** page number 1 is highlighted
- **AND** page numbers 2, 3, and 14 are visible
- **AND** Previous button is disabled
- **AND** Next button is enabled

#### Scenario: Navigation to next page

- **GIVEN** a user is on page 1 of members
- **WHEN** the user clicks the Next button
- **THEN** the page advances to page 2
- **AND** pagination shows "Showing 6 to 10 of 66 members"
- **AND** page number 2 is highlighted
- **AND** Previous button becomes enabled

#### Scenario: Direct page navigation

- **GIVEN** a user is on page 1
- **WHEN** the user clicks page number "3"
- **THEN** the view jumps to page 3
- **AND** pagination shows "Showing 11 to 15 of 66 members"

#### Scenario: Pagination updates with search filter

- **GIVEN** a search filter returns 12 results
- **WHEN** viewing with 5 members per page
- **THEN** pagination shows 3 pages
- **AND** displays "Showing 1 to 5 of 12 members" on page 1

### Requirement: View Member Action

The system SHALL provide a view action to see detailed member information.

#### Scenario: View icon navigates to member detail

- **GIVEN** a member row is displayed
- **WHEN** a user clicks the eye icon in the Actions column
- **THEN** the system navigates to the member detail page
- **AND** displays complete member information

#### Scenario: View action has accessible label

- **GIVEN** a member "Sandra Auterson" is displayed
- **WHEN** a user hovers over the view icon
- **THEN** a tooltip appears showing "View Sandra Auterson"
- **AND** screen readers announce "View Sandra Auterson"

### Requirement: Edit Member Action

The system SHALL provide an edit action to modify member information.

#### Scenario: Edit icon navigates to edit form

- **GIVEN** a member row is displayed
- **WHEN** a user clicks the pencil icon in the Actions column
- **THEN** the system opens an edit interface (modal or page)
- **AND** pre-populates the form with current member data

#### Scenario: Edit action has accessible label

- **GIVEN** a member "Lucas Badenhop" is displayed
- **WHEN** a user hovers over the edit icon
- **THEN** a tooltip appears showing "Edit Lucas Badenhop"
- **AND** screen readers announce "Edit Lucas Badenhop"

### Requirement: Delete Member Action

The system SHALL provide a delete action with confirmation to remove members from the system.

#### Scenario: Delete requires confirmation

- **GIVEN** a member row is displayed
- **WHEN** a user clicks the trash icon in the Actions column
- **THEN** a confirmation dialog appears
- **AND** the dialog displays "Are you sure you want to delete [Member Name]?"
- **AND** provides "Cancel" and "Delete" options

#### Scenario: Confirmed deletion removes member

- **GIVEN** a delete confirmation dialog is open
- **WHEN** a user clicks "Delete"
- **THEN** the member is removed from Firestore
- **AND** the member disappears from the table
- **AND** the member count updates
- **AND** a success message displays "Member deleted successfully"

#### Scenario: Cancelled deletion preserves member

- **GIVEN** a delete confirmation dialog is open
- **WHEN** a user clicks "Cancel"
- **THEN** the dialog closes
- **AND** the member remains in the table
- **AND** no changes are made to the database

#### Scenario: Delete action has accessible label

- **GIVEN** a member "Paul Bailey" is displayed
- **WHEN** a user hovers over the delete icon
- **THEN** a tooltip appears showing "Delete Paul Bailey"
- **AND** screen readers announce "Delete Paul Bailey"

### Requirement: New Member Action

The system SHALL provide a primary action button to create new members.

#### Scenario: New Member button opens creation interface

- **GIVEN** a user is viewing the Members page
- **WHEN** the user clicks the "+ New Member" button
- **THEN** a member creation interface opens (modal or page)
- **AND** displays an empty form for member details

#### Scenario: New Member button is prominently styled

- **GIVEN** the Members page is displayed
- **WHEN** a user views the page header
- **THEN** the "+ New Member" button appears in the top-right
- **AND** has a warm, inviting background color
- **AND** uses rounded corners consistent with the design system

### Requirement: Member Avatar Display

The system SHALL generate and display circular avatars with initials for each member.

#### Scenario: Avatar shows two-letter initials

- **GIVEN** a member named "Sandra Auterson"
- **WHEN** the member is displayed in the table
- **THEN** the avatar shows "SA" in capital letters
- **AND** uses a warm background color
- **AND** displays in a circular shape

#### Scenario: Avatar handles single name

- **GIVEN** a member with only a first name "Sandra"
- **WHEN** the member is displayed
- **THEN** the avatar shows "S" as a single initial

### Requirement: Warm Pastoral Design Aesthetics

The system SHALL apply visual styling that reflects pastoral care values of warmth, calm, and respect.

#### Scenario: Page uses warm, earthy color palette

- **GIVEN** the Members page is rendered
- **WHEN** a user views the interface
- **THEN** the background uses off-white or soft beige tones
- **AND** primary actions use warm brown/tan colors
- **AND** text uses soft dark gray instead of pure black
- **AND** icons use outline style with consistent stroke weight

#### Scenario: Layout uses generous spacing and rounded corners

- **GIVEN** the Members page is rendered
- **WHEN** a user views the table
- **THEN** rows have generous vertical spacing (padding)
- **AND** the table card uses rounded corners
- **AND** interactive elements have rounded corners
- **AND** subtle shadows provide depth without harshness

#### Scenario: Actions appear gentle and respectful

- **GIVEN** action icons are displayed
- **WHEN** a user views or hovers over icons
- **THEN** icons appear neutral and non-aggressive
- **AND** delete icon does not use bright red in default state
- **AND** warning colors only appear on hover or confirmation

### Requirement: Responsive Layout

The system SHALL provide responsive layouts optimized for desktop, tablet, and mobile devices.

#### Scenario: Desktop displays full table layout

- **GIVEN** the viewport width is greater than 1024px
- **WHEN** the Members page renders
- **THEN** all table columns are visible
- **AND** layout matches the reference design with comfortable spacing

#### Scenario: Mobile switches to card layout

- **GIVEN** the viewport width is less than 768px
- **WHEN** the Members page renders
- **THEN** the table switches to a card-based layout
- **AND** member information stacks vertically within each card
- **AND** action buttons have larger touch targets (minimum 44x44px)

### Requirement: Loading State

The system SHALL display a loading state while fetching member data from Firestore.

#### Scenario: Loading displays skeleton screens

- **GIVEN** the Members page is loading member data
- **WHEN** the data has not yet arrived
- **THEN** skeleton screens appear in the table structure
- **AND** maintain the same layout as actual member rows
- **AND** use subtle pulse animation

### Requirement: Empty State

The system SHALL display an empty state when no members exist or no search results are found.

#### Scenario: Empty state for no members

- **GIVEN** no members exist in the system
- **WHEN** the Members page loads
- **THEN** a gentle empty state message displays
- **AND** shows "No members yet" or similar warm message
- **AND** suggests "Add your first member to get started"
- **AND** prominently displays the "+ New Member" button

#### Scenario: Empty state for no search results

- **GIVEN** a search filter returns no results
- **WHEN** the filtered view is empty
- **THEN** displays "No members found matching your search"
- **AND** suggests clearing or modifying the search

### Requirement: Accessibility

The system SHALL meet WCAG 2.1 Level AA accessibility standards for the Members page.

#### Scenario: Keyboard navigation works throughout page

- **GIVEN** a user navigates using only keyboard
- **WHEN** the user presses Tab
- **THEN** focus moves through: search input → "+ New Member" button → table rows → action buttons → pagination controls
- **AND** visible focus indicators appear on all interactive elements

#### Scenario: Screen readers announce page structure

- **GIVEN** a screen reader user loads the Members page
- **WHEN** the page renders
- **THEN** the page title and subtitle are announced
- **AND** the table structure is correctly identified
- **AND** action buttons include descriptive labels
- **AND** member count is announced

#### Scenario: Color contrast meets standards

- **GIVEN** the Members page is displayed
- **WHEN** text and interactive elements are rendered
- **THEN** all text meets 4.5:1 contrast ratio minimum
- **AND** large text (18pt+) meets 3:1 contrast ratio minimum
- **AND** interactive elements have sufficient contrast in all states

### Requirement: Data Persistence

The system SHALL store and retrieve member data from Firebase Realtime Database in real-time.

#### Scenario: Members load from RTDB on page load

- **GIVEN** members exist in the Firebase RTDB `/members` path
- **WHEN** the Members page loads
- **THEN** the system queries RTDB for all members
- **AND** parses the name field from "LASTNAME, FIRSTNAME" format
- **AND** calculates age from birthday string
- **AND** displays formatted data in the table

#### Scenario: Real-time updates reflect in the UI

- **GIVEN** the Members page is open
- **WHEN** another user adds or modifies a member
- **THEN** the change appears in real-time without manual refresh
- **AND** the member count updates accordingly

#### Scenario: New member persists to RTDB

- **GIVEN** a user creates a new member
- **WHEN** the form is submitted
- **THEN** a new entry is created in `/members/{memberId}`
- **AND** includes all provided member fields in the existing structure
- **AND** name is formatted as "LASTNAME, FIRSTNAME"
- **AND** sets `createdAt` and `updatedAt` ISO timestamps
- **AND** sets `createdBy` to the current user's ID

#### Scenario: Updated member persists to RTDB

- **GIVEN** a user edits an existing member
- **WHEN** the form is submitted
- **THEN** the RTDB entry is updated with new data
- **AND** the `updatedAt` timestamp is refreshed
- **AND** the `updatedBy` field is set to the current user's ID

#### Scenario: Deleted member removes from RTDB

- **GIVEN** a user confirms member deletion
- **WHEN** the delete action completes
- **THEN** the entry is removed from the `/members` path
- **AND** the member no longer appears in any queries

### Requirement: Name Parsing

The system SHALL parse the "LASTNAME, FIRSTNAME" format from the Firebase RTDB and display names properly.

#### Scenario: Name parsing for display

- **GIVEN** a member with name "Auterson, SANDRA"
- **WHEN** the member is displayed
- **THEN** the full name displays as "Sandra Auterson" (proper case)
- **AND** the avatar shows "SA" initials

#### Scenario: Name parsing for single names

- **GIVEN** a member with name "SANDRA" (no comma)
- **WHEN** the member is displayed
- **THEN** the full name displays as "Sandra"
- **AND** the avatar shows "S" initial

#### Scenario: Name parsing handles special characters

- **GIVEN** a member with name "D'Souza, ANNA"
- **WHEN** the member is displayed
- **THEN** the full name displays as "Anna D'Souza"
- **AND** preserves the apostrophe correctly

### Requirement: Age Calculation

The system SHALL calculate and display member age from the birthday field.

#### Scenario: Age calculation from ISO date string

- **GIVEN** a member with birthday "1945-01-19"
- **WHEN** the current date is 2026-01-28
- **THEN** the system calculates age as 81
- **AND** displays "Jan 19, 1945 • Age 81"

#### Scenario: Age calculation handles leap years

- **GIVEN** a member with birthday "1996-02-29" (leap year birthday)
- **WHEN** the current date is a non-leap year
- **THEN** the system correctly calculates age
- **AND** displays birthday as "Feb 29, 1996 • Age X"

