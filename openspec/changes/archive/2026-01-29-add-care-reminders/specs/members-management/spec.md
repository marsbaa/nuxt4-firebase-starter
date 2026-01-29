# members-management Specification Deltas

## ADDED Requirements

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
