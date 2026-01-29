# members-management Delta Specification

## ADDED Requirements

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

## MODIFIED Requirements

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

## REMOVED Requirements

_None - This refinement extends existing capabilities without removing functionality._

---

## RENAMED Requirements

_None - Existing requirement names remain valid, though internal implementation changes significantly._
