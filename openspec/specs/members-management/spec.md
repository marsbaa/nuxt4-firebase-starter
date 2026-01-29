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

The system SHALL provide a view action to see detailed member information with emphasis on the Care Space as the primary narrative area.

#### Scenario: View icon navigates to Care Space-centered detail page

- **GIVEN** a member row is displayed in the members list
- **WHEN** a user clicks the eye icon in the Actions column
- **THEN** the system navigates to the member detail page at `/members/view/[id]`
- **AND** displays the Care Space prominently in the right column
- **AND** shows the Personal Context column on the left as a stable reference
- **AND** the page focuses on narrative care information over administrative data
- **AND** does NOT show Export PDF button

#### Scenario: View action has accessible label

- **GIVEN** a member "Sandra Auterson" is displayed
- **WHEN** a user hovers over the view icon
- **THEN** a tooltip appears showing "View Sandra Auterson"
- **AND** screen readers announce "View Sandra Auterson"

---

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

### Requirement: Care Space Display

The system SHALL provide a Care Space as the primary narrative area on the member detail page, displaying a timeline of Care Notes in reverse chronological order.

#### Scenario: Care Space is the primary visual focus

- **GIVEN** a user navigates to a member detail page
- **WHEN** the page loads
- **THEN** the Care Space appears prominently in the right column
- **AND** uses a larger heading than other sections
- **AND** occupies the top position in the right column
- **AND** visually emphasizes narrative content over administrative data

#### Scenario: Care Space displays the heading "Care Space"

- **GIVEN** a user views a member detail page
- **WHEN** the Care Space section renders
- **THEN** the section heading reads "Care Space" (not "Pastoral Notes", "Activities", or "Logs")
- **AND** uses pastoral typography (Crimson Pro serif, warm tones)

---

### Requirement: Care Notes Timeline

The system SHALL display Care Notes in a reverse chronological timeline, optimized for reading and narrative continuity.

#### Scenario: Care Notes display in reverse chronological order

- **GIVEN** multiple Care Notes exist for a member
- **WHEN** the Care Space renders
- **THEN** the most recent Care Note appears first
- **AND** older notes follow in descending order by creation timestamp
- **AND** the timeline flows naturally for reading from top to bottom

#### Scenario: Care Note displays complete information

- **GIVEN** a Care Note exists with content, author, and timestamp
- **WHEN** the note is displayed in the timeline
- **THEN** the note shows the full text content
- **AND** displays the author's name subtly (e.g., "With [Author Name]" or "[Author Name] shared")
- **AND** shows the creation date in absolute format (e.g., "Oct 12, 2023")
- **AND** does NOT display status, completion, or task semantics

#### Scenario: Care Note has no metrics or counters

- **GIVEN** a Care Note is displayed
- **WHEN** a user views the note
- **THEN** the note does NOT show like counts, view counts, or engagement metrics
- **AND** does NOT display task completion checkboxes
- **AND** does NOT include productivity-oriented elements

#### Scenario: Care Notes are visually separated

- **GIVEN** multiple Care Notes exist in the timeline
- **WHEN** the timeline renders
- **THEN** each note is visually separated with subtle dividers
- **AND** generous vertical spacing exists between notes
- **AND** the last note has no bottom divider

---

### Requirement: Care Note Input

The system SHALL provide a gentle, pastoral input interface for adding new Care Notes to the timeline.

#### Scenario: Care Note input is calm and inviting

- **GIVEN** a user views the Care Space
- **WHEN** the input interface is visible
- **THEN** the input uses a large, auto-expanding textarea
- **AND** includes generous padding for comfortable typing
- **AND** uses a placeholder like "Share a care note…" (not "Log activity" or "Enter details")
- **AND** has a warm, inviting appearance

#### Scenario: Submit button uses pastoral language

- **GIVEN** a user is adding a Care Note
- **WHEN** the input interface is displayed
- **THEN** the submit button is labeled "Share" (not "Submit", "Log", "Add", or "Report")
- **AND** uses warm, pastoral color styling
- **AND** has rounded corners consistent with design system

#### Scenario: Adding a Care Note provides gentle feedback

- **GIVEN** a user submits a new Care Note
- **WHEN** the note is successfully saved
- **THEN** a success toast appears with message "Care note added" (not "Success!" or "Note logged")
- **AND** the input field clears immediately
- **AND** the new note appears at the top of the timeline
- **AND** the feedback is calm and unobtrusive

#### Scenario: Empty input is gently prevented

- **GIVEN** a user attempts to submit an empty Care Note
- **WHEN** the submit button is clicked
- **THEN** the submission is prevented
- **AND** a gentle message appears (e.g., "Please share a care note" not "Required field")
- **AND** the input field gains focus

---

### Requirement: Care Notes Editable with History

The system SHALL allow pastoral team members to edit Care Notes, preserving edit history for integrity and memory.

#### Scenario: Care Note is editable inline

- **GIVEN** a Care Note is displayed in the timeline
- **WHEN** a pastoral team member views the note
- **THEN** an edit action is available (e.g., icon, button, or hover state)
- **AND** clicking edit reveals an inline textarea with the current content
- **AND** Save and Cancel buttons appear

#### Scenario: Saving edited Care Note preserves history

- **GIVEN** a pastoral team member edits a Care Note
- **WHEN** the Save button is clicked
- **THEN** the previous content is appended to the note's history array
- **AND** the current content is updated with the new text
- **AND** the updatedAt timestamp is set to current time
- **AND** the history entry includes: previous content, editedAt timestamp, editedBy user ID, editedByName
- **AND** the original createdAt timestamp remains unchanged

#### Scenario: Edit history is not displayed in UI (v1)

- **GIVEN** a Care Note has been edited with history preserved
- **WHEN** the note is displayed in the timeline
- **THEN** the note shows only the current content
- **AND** does NOT show "edited" indicator or badge
- **AND** does NOT display revision count or history list
- **AND** history is preserved in data structure but not surfaced

#### Scenario: Canceling edit reverts to original state

- **GIVEN** a pastoral team member is editing a Care Note
- **WHEN** the Cancel button is clicked
- **THEN** the edit mode closes
- **AND** the note displays the original content
- **AND** no changes are saved
- **AND** the note returns to read-only state

#### Scenario: Edit provides gentle feedback

- **GIVEN** a pastoral team member saves an edited Care Note
- **WHEN** the save operation completes
- **THEN** a gentle toast appears with message "Care note updated" (not "Changes saved" or "Success!")
- **AND** the note returns to read-only state
- **AND** the updated content appears in the timeline

---

### Requirement: Care Notes Data Structure (Firestore)

The system SHALL store Care Notes in Firebase Firestore in a dedicated collection with member references and edit history.

#### Scenario: Care Notes are stored in Firestore collection

- **GIVEN** a Care Note is created for a member
- **WHEN** the note is saved
- **THEN** the note is stored in Firestore collection `/careNotes`
- **AND** the document includes: memberId, content, authorId, authorName, createdAt, updatedAt, history (array)
- **AND** the noteId is auto-generated by Firestore
- **AND** memberId is indexed for efficient querying

#### Scenario: Care Notes load in real-time

- **GIVEN** a user has the member detail page open
- **WHEN** another user adds a Care Note for the same member
- **THEN** the new note appears in the timeline without manual refresh
- **AND** appears with smooth transition animation
- **AND** maintains reverse chronological order

#### Scenario: Care Notes query is ordered by creation time

- **GIVEN** Care Notes are fetched from Firestore
- **WHEN** the query executes
- **THEN** the query uses `.where('memberId', '==', id).orderBy('createdAt', 'desc')`
- **AND** may use `.limit(50)` to constrain result size
- **AND** returns notes sorted by creation timestamp (newest first)

#### Scenario: Care Notes use Firestore for better querying

- **GIVEN** the system requires queryable, structured Care Notes
- **WHEN** deciding between RTDB and Firestore
- **THEN** Firestore is used because:
- **AND** it provides better ordering and pagination (`.orderBy()`, `.limit()`)
- **AND** it supports future visibility rules with `.where()` clauses
- **AND** it has flexible querying for future features
- **AND** it provides built-in offline caching

---

### Requirement: Pastoral Team-Only Visibility

The system SHALL restrict Care Notes visibility and editing to authenticated users, with the intent that all authenticated users are trusted pastoral team members.

#### Scenario: Firestore Security Rules enforce authenticated-user access (V1)

- **GIVEN** Firestore Security Rules are configured for v1
- **WHEN** a request is made to read or write Care Notes
- **THEN** the request is only allowed if the user is authenticated
- **AND** unauthenticated requests are rejected
- **AND** all authenticated users are granted access (with intent of pastoral team trust)

#### Scenario: Unauthenticated users cannot access Care Notes

- **GIVEN** an unauthenticated user attempts to access Care Notes
- **WHEN** the request is evaluated by Firestore Security Rules
- **THEN** the request is rejected
- **AND** an appropriate error is returned
- **AND** no Care Notes data is exposed

#### Scenario: UI requires authentication for Care Space

- **GIVEN** a user is not authenticated
- **WHEN** they attempt to view a member detail page
- **THEN** they are redirected to login
- **AND** no Care Notes data is fetched from Firestore
- **AND** the Care Space is not rendered

#### Scenario: Future role-based enforcement is planned

- **GIVEN** the system is in v1 with simplified authentication-only access
- **WHEN** planning for future enhancements
- **THEN** explicit role-based permissions will be added (e.g., pastor, associate pastor, care coordinator)
- **AND** Firestore Security Rules will be updated to check role claims
- **AND** no changes to UI, language, or mental model will be required

---

### Requirement: Personal Context Column

The system SHALL provide a unified pastoral context column on the left side of the member detail page, serving as a stable reference without competing with the Care Space.

#### Scenario: Personal Context column is visually calm

- **GIVEN** a user views the member detail page
- **WHEN** the left column renders
- **THEN** the column uses generous spacing between sections
- **AND** uses subtle visual separators (not heavy borders)
- **AND** has a reference-oriented appearance (not action-focused)
- **AND** does NOT dominate visual attention

#### Scenario: Personal Context includes Personal Journey information

- **GIVEN** a member has complete data
- **WHEN** the Personal Context column displays
- **THEN** a "Personal Journey" section is visible
- **AND** includes Date of Birth and age
- **AND** includes marital status
- **AND** includes fellowship/small group affiliation
- **AND** includes emergency contact ("in-case-of-need contact")

#### Scenario: Personal Context maintains Quick Actions with softened prominence

- **GIVEN** the Personal Context column displays
- **WHEN** the Quick Actions section renders
- **THEN** the actions remain accessible (Edit Profile, Send Message)
- **AND** the section heading is smaller or less prominent than in original design
- **AND** button styling is softer (less saturated colors, gentler hover states)

---

### Requirement: Pastoral Language and Tone

The system SHALL use pastoral, person-centered language throughout the member detail page, avoiding corporate and productivity-oriented terminology.

#### Scenario: Page uses pastoral terminology

- **GIVEN** a user views the member detail page
- **WHEN** labels, headings, and buttons are rendered
- **THEN** the page uses "Care Space" (not "Pastoral Notes", "Activity Log", "Case Notes")
- **AND** uses "Personal Journey" (not "Member Information", "Profile Data")
- **AND** uses "Share" for adding care notes (not "Submit", "Log", "Report")
- **AND** uses "With [Author]" or "[Author] shared" (not "By [Author]" or "Logged by")

#### Scenario: Feedback messages are calm and pastoral

- **GIVEN** a user performs an action (e.g., adding or editing a care note)
- **WHEN** feedback is displayed
- **THEN** messages use calm language (e.g., "Care note added", "Care note updated")
- **AND** avoid exclamatory or urgent language (not "Success!", "Done!", "Complete!")
- **AND** maintain respectful, supportive tone

---

### Requirement: Export PDF Removed

The system SHALL NOT provide PDF export functionality for the member detail page.

#### Scenario: Export PDF button is removed

- **GIVEN** a user views the member detail page
- **WHEN** the page header renders
- **THEN** there is NO "Export PDF" button
- **AND** there is NO print icon or similar export action
- **AND** the page is purely a living care space (not a document)

#### Scenario: Export PDF functionality is removed

- **GIVEN** the codebase previously had PDF export logic
- **WHEN** the Care Space refinement is implemented
- **THEN** all PDF generation code is removed
- **AND** all PDF-related dependencies are removed (if unused elsewhere)
- **AND** no PDF export affordances remain in UI or code

---

### Requirement: Care Space Loading States

The system SHALL display appropriate loading and empty states for the Care Space with pastoral language.

#### Scenario: Care Space displays loading state

- **GIVEN** Care Notes are being fetched from Firestore
- **WHEN** the Care Space renders before data arrives
- **THEN** skeleton screens appear in the timeline structure
- **AND** maintain the same layout as actual notes
- **AND** use subtle pulse animation
- **AND** do NOT show aggressive spinners or progress bars

#### Scenario: Care Space displays empty state

- **GIVEN** a member has no Care Notes
- **WHEN** the Care Space renders with empty data
- **THEN** a gentle empty state message displays
- **AND** reads "No care notes yet. Share the first note to begin the care story." (or similar pastoral language)
- **AND** does NOT say "No data", "No records", or "No activities"
- **AND** invites action without pressure

---

### Requirement: Care Space Accessibility

The system SHALL ensure the Care Space and Care Notes timeline meet WCAG 2.1 Level AA accessibility standards.

#### Scenario: Care Space is keyboard navigable

- **GIVEN** a user navigates with keyboard only
- **WHEN** the user presses Tab
- **THEN** the Care Note input receives focus
- **AND** the submit button is reachable via Tab
- **AND** edit buttons on notes are reachable via Tab
- **AND** focus indicators are visible on all interactive elements
- **AND** focus order is logical (input → submit → timeline notes → edit buttons)

#### Scenario: Care Notes announce properly to screen readers

- **GIVEN** a screen reader user views the Care Space
- **WHEN** the timeline is read
- **THEN** each note is announced with author, date, and content
- **AND** the Care Space heading is properly structured (h2 or appropriate level)
- **AND** ARIA labels provide context where needed
- **AND** edit buttons have descriptive labels (e.g., "Edit care note by [Author]")

#### Scenario: Care Space color contrast meets standards

- **GIVEN** the Care Space is rendered
- **WHEN** text and interactive elements are displayed
- **THEN** all text meets 4.5:1 contrast ratio minimum
- **AND** large text meets 3:1 contrast ratio minimum
- **AND** interactive elements have sufficient contrast in all states (default, hover, focus)

---

### Requirement: Care Space Responsive Behavior

The system SHALL adapt the Care Space layout for tablet and mobile viewports, prioritizing the narrative content.

#### Scenario: Mobile layout prioritizes Care Space

- **GIVEN** the viewport width is less than 768px
- **WHEN** the member detail page renders
- **THEN** the Care Space appears before the Personal Context column
- **AND** the Care Space occupies full width
- **AND** the Personal Context column follows below

#### Scenario: Care Note input is mobile-friendly

- **GIVEN** a user views the Care Space on mobile
- **WHEN** the input interface is displayed
- **THEN** the textarea is large enough for comfortable typing
- **AND** the submit button has touch target size of at least 44x44px
- **AND** the textarea auto-expands as content increases

#### Scenario: Edit mode is mobile-friendly

- **GIVEN** a user edits a Care Note on mobile
- **WHEN** edit mode is active
- **THEN** the edit textarea is large enough for comfortable typing
- **AND** Save and Cancel buttons have touch target size of at least 44x44px
- **AND** buttons are spaced adequately to prevent accidental taps

---

### Requirement: Care Reminders Display in Care Space

The system SHALL provide a Care Reminders section within the Care Space to display gentle follow-up intentions held in mind for a specific member.

#### Scenario: Care Reminders section appears in Care Space

- **GIVEN** a user views a member detail page
- **WHEN** the Care Space renders
- **THEN** a "Care Reminders" section appears between the care note input and the care notes timeline
- **AND** the section uses pastoral typography (Crimson Pro serif, warm tones)
- **AND** the section heading reads "Care Reminders" (not "Tasks", "Follow-ups", or "To-Do")

#### Scenario: Care Reminders are visually distinct from Care Notes

- **GIVEN** Care Reminders are displayed in the Care Space
- **WHEN** a user views the section
- **THEN** Care Reminders use a subtle, warm background tint (e.g., lightest amber/beige)
- **AND** have a gentle inset or outline border
- **AND** include a small, low-contrast "remembering" icon (e.g., outline bookmark, folded paper, handwritten note—avoid bell or alert metaphors)
- **AND** do NOT use urgency colors (red, orange, yellow highlights)
- **AND** do NOT include task indicators (checkboxes, progress bars, completion badges)

#### Scenario: Care Reminders do not dominate Care Space

- **GIVEN** Care Reminders are displayed in the Care Space
- **WHEN** a user views the member detail page
- **THEN** the Care Reminders section is visually distinct but subtle
- **AND** the Care Notes timeline remains the primary visual focus
- **AND** Care Reminders use smaller text size than Care Notes
- **AND** generous spacing separates reminders from timeline

---

### Requirement: Care Reminders Display Rules

The system SHALL display only active Care Reminders with a maximum of 3 reminders shown on the Member Detail page.

#### Scenario: Only active reminders are displayed

- **GIVEN** a member has both active and inactive Care Reminders
- **WHEN** the Care Reminders section renders
- **THEN** only active reminders are displayed
- **AND** reminders with `dueDate` in the past are NOT displayed
- **AND** inactive reminders are filtered from the query

#### Scenario: Maximum 3 reminders are shown

- **GIVEN** a member has 5 active Care Reminders
- **WHEN** the Care Reminders section renders
- **THEN** only the first 3 reminders are displayed
- **AND** reminders are ordered by soonest due date first
- **AND** no "show more" or pagination controls appear

#### Scenario: Reminders are ordered by due date

- **GIVEN** a member has multiple active Care Reminders
- **WHEN** the reminders are displayed
- **THEN** reminders with `dueDate` appear first, ordered ascending (soonest first)
- **AND** reminders with `null` dueDate appear last
- **AND** the ordering supports pastoral presence (soonest attention first)

---

### Requirement: Care Reminder Content Display

The system SHALL display Care Reminder text, optional due date, and author information with pastoral language and calm formatting.

#### Scenario: Care Reminder displays complete information

- **GIVEN** a Care Reminder exists with text, due date, and author
- **WHEN** the reminder is displayed
- **THEN** the reminder text appears prominently
- **AND** the due date is shown in calm format (e.g., "Jan 15" not "01/15/2026" or "In 3 days")
- **AND** the author name is displayed subtly (e.g., "Held by [Author Name]")
- **AND** no urgency language is used (no "overdue", "due soon", "urgent")

#### Scenario: Care Reminder without due date displays gracefully

- **GIVEN** a Care Reminder exists with text but no due date
- **WHEN** the reminder is displayed
- **THEN** the reminder text appears prominently
- **AND** no date placeholder or "no date" text is shown
- **AND** the reminder appears after dated reminders in the list
- **AND** the author name is displayed subtly

---

### Requirement: Add Care Reminder Functionality

The system SHALL provide a pastoral interface for adding new Care Reminders with optional due dates.

#### Scenario: Add Care Reminder input is calm and inviting

- **GIVEN** a user views the Care Space
- **WHEN** the Care Reminders section is visible
- **THEN** an input interface for adding reminders is present
- **AND** includes a textarea or text input with pastoral placeholder (e.g., "Hold a care reminder in mind…")
- **AND** includes an optional date picker for due date
- **AND** uses warm, inviting appearance consistent with Care Space
- **AND** has generous padding for comfortable interaction

#### Scenario: Add button uses pastoral language

- **GIVEN** a user is adding a Care Reminder
- **WHEN** the input interface is displayed
- **THEN** the submit button is labeled "Add care reminder" (not "Create task", "Add reminder", "Submit")
- **AND** uses warm, pastoral color styling
- **AND** has rounded corners consistent with design system
- **AND** does NOT use urgency colors or aggressive styling

#### Scenario: Adding a Care Reminder provides gentle feedback

- **GIVEN** a user submits a new Care Reminder
- **WHEN** the reminder is successfully saved
- **THEN** a success toast appears with message "Care reminder added" (not "Success!", "Task created")
- **AND** the input field clears immediately
- **AND** the new reminder appears at the appropriate position in the list
- **AND** the feedback is calm and unobtrusive

#### Scenario: Empty input is gently prevented

- **GIVEN** a user attempts to submit an empty Care Reminder
- **WHEN** the submit button is clicked
- **THEN** the submission is prevented
- **AND** a gentle message appears (e.g., "Please share what you'd like to hold in mind")
- **AND** the input field gains focus
- **AND** no harsh error styling is used

---

### Requirement: Care Reminders Data Structure (Firestore)

The system SHALL store Care Reminders in Firebase Firestore in a dedicated collection with member references and optional due dates.

#### Scenario: Care Reminders are stored in Firestore collection

- **GIVEN** a Care Reminder is created for a member
- **WHEN** the reminder is saved
- **THEN** the reminder is stored in Firestore collection `/careReminders`
- **AND** the document includes: memberId, text, dueDate (Timestamp or null), authorId, authorName, createdAt, isExpired (boolean)
- **AND** the reminderId is auto-generated by Firestore
- **AND** memberId is indexed for efficient querying

#### Scenario: Care Reminders load in real-time

- **GIVEN** a user has the member detail page open
- **WHEN** another user adds a Care Reminder for the same member
- **THEN** the new reminder appears in the list without manual refresh
- **AND** appears with smooth transition animation
- **AND** maintains proper ordering (soonest due date first)

#### Scenario: Care Reminders query is filtered and ordered

- **GIVEN** Care Reminders are fetched from Firestore
- **WHEN** the query executes
- **THEN** the query uses `.where('memberId', '==', id).where('isExpired', '==', false).orderBy('dueDate', 'asc').limit(3)`
- **AND** only active (non-expired) reminders are returned
- **AND** reminders are ordered by due date (soonest first)
- **AND** maximum 3 reminders are returned

---

### Requirement: Care Reminders Activity Logic

The system SHALL mark Care Reminders as inactive once their due date has passed, without requiring explicit completion or dismissal.

#### Scenario: Inactive reminders are not displayed

- **GIVEN** a Care Reminder has `dueDate` in the past
- **WHEN** the Care Reminders section renders
- **THEN** the reminder is NOT displayed on the Member Detail page
- **AND** the reminder remains in Firestore (marked or computed as inactive)
- **AND** future Calendar feature will surface all reminders (including inactive ones) for review

#### Scenario: Reminders without due dates never become inactive

- **GIVEN** a Care Reminder has `dueDate: null`
- **WHEN** the Care Reminders section renders
- **THEN** the reminder is always displayed (unless future explicit dismissal added)
- **AND** the reminder appears after dated reminders in the list
- **AND** remains active indefinitely

---

### Requirement: Care Reminders Authenticated-User Visibility

The system SHALL restrict Care Reminders visibility and creation to authenticated users, with the intent that all authenticated users are trusted pastoral team members.

#### Scenario: Firestore Security Rules enforce authenticated-user access

- **GIVEN** Firestore Security Rules are configured for v1
- **WHEN** a request is made to read or write Care Reminders
- **THEN** the request is only allowed if the user is authenticated
- **AND** unauthenticated requests are rejected
- **AND** all authenticated users are granted access (this mirrors the current Care Notes visibility model and avoids introducing partial role logic in v1)

#### Scenario: Unauthenticated users cannot access Care Reminders

- **GIVEN** an unauthenticated user attempts to access Care Reminders
- **WHEN** the request is evaluated by Firestore Security Rules
- **THEN** the request is rejected
- **AND** an appropriate error is returned
- **AND** no Care Reminders data is exposed

---

### Requirement: Care Reminders Loading and Empty States

The system SHALL display appropriate loading and empty states for Care Reminders with pastoral language.

#### Scenario: Care Reminders display loading state

- **GIVEN** Care Reminders are being fetched from Firestore
- **WHEN** the Care Reminders section renders before data arrives
- **THEN** skeleton screens appear in the reminder structure
- **AND** maintain the same layout as actual reminders
- **AND** use subtle pulse animation
- **AND** do NOT show aggressive spinners or progress bars

#### Scenario: Care Reminders display empty state

- **GIVEN** a member has no active Care Reminders
- **WHEN** the Care Reminders section renders with empty data
- **THEN** a gentle empty state message displays
- **AND** reads "No care reminders yet" (or similar pastoral language)
- **AND** does NOT say "No tasks", "No follow-ups", or "No data"
- **AND** invites action without pressure

---

### Requirement: Care Reminders Accessibility

The system SHALL ensure Care Reminders meet WCAG 2.1 Level AA accessibility standards.

#### Scenario: Care Reminders are keyboard navigable

- **GIVEN** a user navigates with keyboard only
- **WHEN** the user presses Tab
- **THEN** the Care Reminder input receives focus
- **AND** the date picker (if present) is reachable via Tab
- **AND** the "Add care reminder" button is reachable via Tab
- **AND** focus indicators are visible on all interactive elements
- **AND** focus order is logical (input → date → button)

#### Scenario: Care Reminders announce properly to screen readers

- **GIVEN** a screen reader user views the Care Reminders section
- **WHEN** the section is read
- **THEN** each reminder is announced with text, date, and author
- **AND** the "Care Reminders" heading is properly structured (h3 or appropriate level)
- **AND** ARIA labels provide context where needed
- **AND** the "Add care reminder" button has a descriptive label

#### Scenario: Care Reminders color contrast meets standards

- **GIVEN** the Care Reminders section is rendered
- **WHEN** text and interactive elements are displayed
- **THEN** all text meets 4.5:1 contrast ratio minimum
- **AND** large text meets 3:1 contrast ratio minimum
- **AND** interactive elements have sufficient contrast in all states (default, hover, focus)

---

### Requirement: Care Reminders Responsive Behavior

The system SHALL adapt the Care Reminders section for tablet and mobile viewports while maintaining layout order.

#### Scenario: Mobile layout maintains Care Reminders position

- **GIVEN** the viewport width is less than 768px
- **WHEN** the Care Space renders
- **THEN** the Care Reminders section appears after the care note input
- **AND** the Care Reminders section appears before the care notes timeline
- **AND** the section occupies full width
- **AND** maintains generous spacing

#### Scenario: Care Reminder input is mobile-friendly

- **GIVEN** a user views Care Reminders on mobile
- **WHEN** the input interface is displayed
- **THEN** the textarea is large enough for comfortable typing
- **AND** the "Add care reminder" button has touch target size of at least 44x44px
- **AND** the date picker (if present) is touch-friendly
- **AND** buttons are spaced adequately to prevent accidental taps

---

### Requirement: Care Reminders Pastoral Language

The system SHALL use pastoral, intention-focused language throughout Care Reminders, avoiding task-oriented terminology.

#### Scenario: Care Reminders use pastoral terminology

- **GIVEN** a user interacts with Care Reminders
- **WHEN** labels, headings, and buttons are rendered
- **THEN** the section uses "Care Reminders" (not "Tasks", "Follow-ups", "To-Do")
- **AND** uses "Hold in mind" or "Care reminder" (not "Task", "Assignment")
- **AND** uses "Held by [Author]" (not "Created by", "Assigned to")
- **AND** uses "Add care reminder" (not "Create task", "Add to-do")

#### Scenario: Care Reminders feedback is calm and pastoral

- **GIVEN** a user adds a Care Reminder
- **WHEN** feedback is displayed
- **THEN** messages use calm language (e.g., "Care reminder added")
- **AND** avoid exclamatory or urgent language (not "Success!", "Done!", "Task created!")
- **AND** maintain respectful, supportive tone

---

### Requirement: Care Reminders Do Not Include Completion States

The system SHALL NOT provide completion, dismissal, or task-like status tracking for Care Reminders in v1.

#### Scenario: Care Reminders have no checkboxes or completion UI

- **GIVEN** a Care Reminder is displayed
- **WHEN** a user views the reminder
- **THEN** the reminder does NOT have a checkbox
- **AND** does NOT have a "mark complete" button
- **AND** does NOT have status indicators (complete, pending, overdue)
- **AND** does NOT have task-oriented visual elements

#### Scenario: Care Reminders become inactive by date, not by completion

- **GIVEN** a Care Reminder has a due date
- **WHEN** the due date passes
- **THEN** the reminder is automatically marked inactive (or computed as inactive)
- **AND** the reminder is no longer displayed on the Member Detail page
- **AND** no explicit completion action is required
- **AND** activity status is date-based, not action-based

