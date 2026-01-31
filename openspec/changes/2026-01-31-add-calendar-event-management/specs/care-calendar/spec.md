# care-calendar Specification Delta

## ADDED Requirements

### Requirement: Recurring Community Events

The system SHALL support recurring Community Events to represent regular communal rhythms (weekly services, prayer gatherings, etc.) without requiring repetitive manual entry.

Recurring events create multiple event instances based on a recurrence pattern. Users can manage the entire series or individual occurrences.

#### Scenario: Creating a Weekly Recurring Event

- **WHEN** a user creates a new Community Event
- **AND** enables the "Repeats" toggle
- **AND** selects "Weekly" recurrence
- **AND** selects one or more days of the week
- **AND** optionally sets an end condition (never ends / ends on date)
- **THEN** the recurring event is saved to Firestore
- **AND** event instances appear on the calendar for each occurrence based on the pattern
- **AND** the recurrence pattern is visible when viewing or editing the event

#### Scenario: Weekly Recurrence Pattern Display

- **WHEN** a recurring weekly event exists
- **THEN** event instances appear on the calendar on the selected days of the week
- **AND** each instance is visually identified as part of a recurring series (subtle indicator)
- **AND** instances continue according to the end condition (never or until end date)

#### Scenario: End Condition - Never Ends

- **WHEN** a recurring event is created with end condition "Never ends"
- **THEN** event instances are generated for a reasonable lookahead period (e.g., 12 months)
- **AND** instances continue to be generated as the calendar advances

#### Scenario: End Condition - Ends on Date

- **WHEN** a recurring event is created with a specific end date
- **THEN** event instances are generated only up to and including the end date
- **AND** no instances appear after the end date

#### Scenario: Monthly Recurrence (v2 - Future Enhancement)

- **WHEN** monthly recurrence is requested (v2 feature)
- **THEN** this is noted as a future enhancement
- **AND** initial implementation focuses on weekly recurrence only

---

### Requirement: Edit Community Events

The system SHALL allow users to edit existing Community Events, including both one-off events and recurring events, with clear scope management for recurring series.

Editing preserves the pastoral mental model: events represent communal time, and corrections support trustworthy stewardship.

#### Scenario: Editing a One-Off Event

- **WHEN** a user clicks on a one-off Community Event in the calendar
- **THEN** the Event Form opens in Edit mode
- **AND** all event fields are pre-populated with current values
- **WHEN** the user modifies fields and saves
- **THEN** the event is updated in Firestore
- **AND** the calendar reflects the changes immediately

#### Scenario: Editing a Recurring Event - This Occurrence Only

- **WHEN** a user clicks on an occurrence of a recurring event
- **AND** selects "Edit this occurrence only"
- **THEN** the Event Form opens with current values
- **WHEN** the user modifies fields and saves
- **THEN** only that specific occurrence is updated (exception created)
- **AND** other occurrences in the series remain unchanged
- **AND** the calendar reflects the change

#### Scenario: Editing a Recurring Event - This and Future Occurrences

- **WHEN** a user clicks on an occurrence of a recurring event
- **AND** selects "Edit this and future occurrences"
- **THEN** the Event Form opens with current values
- **WHEN** the user modifies fields and saves
- **THEN** the selected occurrence and all future occurrences are updated
- **AND** past occurrences remain unchanged
- **AND** the calendar reflects the changes

#### Scenario: Editing a Recurring Event - Entire Series

- **WHEN** a user clicks on any occurrence of a recurring event
- **AND** selects "Edit entire series"
- **THEN** the Event Form opens with series-level values
- **WHEN** the user modifies fields and saves
- **THEN** all occurrences (past, present, and future) are updated
- **AND** the calendar reflects the changes across all instances

#### Scenario: Edit Form Pastoral Language

- **WHEN** the Event Form is displayed in Edit mode
- **THEN** all copy uses pastoral language ("Save Changes", not "Update")
- **AND** series scope options are clearly worded (e.g., "Just this time", "This and future times", "All times")
- **AND** no task management or urgency terminology is used

---

### Requirement: Delete Community Events

The system SHALL allow users to delete Community Events with gentle confirmation and clear scope management for recurring series.

Deletion preserves calendar trustworthiness by removing outdated or incorrect events while providing safety through confirmation and scoped options.

#### Scenario: Deleting a One-Off Event

- **WHEN** a user opens a one-off Community Event in Edit mode
- **AND** clicks the "Delete Event" action
- **THEN** a gentle confirmation dialog appears
- **AND** the dialog explains what will be removed (pastoral copy, e.g., "This event will be removed from the calendar")
- **WHEN** the user confirms deletion
- **THEN** the event is removed from Firestore
- **AND** the event disappears from the calendar
- **AND** the form overlay/drawer closes

#### Scenario: Deleting a Recurring Event - This Occurrence Only

- **WHEN** a user opens an occurrence of a recurring event in Edit mode
- **AND** clicks the "Delete Event" action
- **AND** selects "Delete this occurrence only"
- **THEN** a gentle confirmation dialog appears
- **WHEN** the user confirms
- **THEN** only that specific occurrence is removed (exception created)
- **AND** other occurrences in the series remain visible
- **AND** the calendar updates to reflect the removal

#### Scenario: Deleting a Recurring Event - This and Future Occurrences

- **WHEN** a user opens an occurrence of a recurring event in Edit mode
- **AND** clicks the "Delete Event" action
- **AND** selects "Delete this and future occurrences"
- **THEN** a gentle confirmation dialog appears
- **WHEN** the user confirms
- **THEN** the selected occurrence and all future occurrences are removed
- **AND** past occurrences remain visible
- **AND** the calendar updates

#### Scenario: Deleting a Recurring Event - Entire Series

- **WHEN** a user opens any occurrence of a recurring event in Edit mode
- **AND** clicks the "Delete Event" action
- **AND** selects "Delete entire series"
- **THEN** a gentle confirmation dialog appears explaining all occurrences will be removed
- **WHEN** the user confirms
- **THEN** all occurrences (past, present, future) are removed from Firestore
- **AND** the entire series disappears from the calendar
- **AND** the form overlay/drawer closes

#### Scenario: Delete Confirmation Pastoral Language

- **WHEN** a delete confirmation dialog is displayed
- **THEN** all copy uses gentle, pastoral language
- **AND** no alarming or urgent terminology is used (avoid "Warning!", "Permanent!", etc.)
- **AND** the confirmation action is clearly labeled (e.g., "Yes, remove this event")
- **AND** a cancel option is clearly available

---

### Requirement: Event Form Overlay (Mobile)

The system SHALL provide a full-height bottom sheet overlay on mobile devices (viewport < 768px) for adding and editing Community Events, keeping users anchored in the calendar context.

The bottom sheet preserves calendar visibility while providing a focused form interaction, supporting the calendar's role as an awareness surface.

#### Scenario: Opening Add Event Form on Mobile

- **WHEN** a user on a mobile device clicks "New Event"
- **THEN** a full-height bottom sheet slides up from the bottom of the screen
- **AND** the calendar remains visible but dimmed in the background
- **AND** the Event Form is displayed in Add mode within the sheet
- **AND** a Close action is visible in the sheet header

#### Scenario: Opening Edit Event Form on Mobile

- **WHEN** a user on a mobile device taps a Community Event in the calendar
- **THEN** a full-height bottom sheet slides up from the bottom
- **AND** the Event Form is displayed in Edit mode with pre-populated values
- **AND** a Close action is visible

#### Scenario: Dismissing Bottom Sheet

- **WHEN** a user clicks the Close action or taps outside the bottom sheet
- **THEN** the bottom sheet smoothly animates down and closes
- **AND** the calendar view is fully restored
- **AND** any unsaved changes are discarded (with optional confirmation if changes were made)

#### Scenario: Bottom Sheet Form Layout

- **WHEN** the Event Form is displayed in the bottom sheet
- **THEN** form fields are arranged in a single column
- **AND** inputs are thumb-friendly and touch-optimized
- **AND** the primary action button ("Add Event" / "Save Changes") is sticky at the bottom
- **AND** generous spacing ensures comfortable scrolling

#### Scenario: Bottom Sheet Accessibility

- **WHEN** the bottom sheet is open on mobile
- **THEN** focus is trapped within the sheet
- **AND** appropriate ARIA labels are present for screen readers
- **AND** all tappable elements meet minimum touch target size (44x44 CSS pixels)
- **AND** the sheet respects safe area insets

---

### Requirement: Event Form Drawer (Desktop)

The system SHALL provide a right-side drawer panel on desktop devices (viewport ≥ 768px) for adding and editing Community Events, preserving calendar visibility while providing focused form interaction.

The drawer keeps the calendar visible in the background, supporting context-aware event management.

#### Scenario: Opening Add Event Form on Desktop

- **WHEN** a user on a desktop device clicks "New Event"
- **THEN** a right-side drawer panel slides in from the right
- **AND** the calendar remains visible but slightly dimmed on the left
- **AND** the Event Form is displayed in Add mode within the drawer
- **AND** a Close action is visible in the drawer header

#### Scenario: Opening Edit Event Form on Desktop

- **WHEN** a user on a desktop device clicks a Community Event in the calendar
- **THEN** a right-side drawer panel slides in from the right
- **AND** the Event Form is displayed in Edit mode with pre-populated values
- **AND** a Close action is visible

#### Scenario: Dismissing Drawer

- **WHEN** a user clicks the Close action or clicks outside the drawer (on the calendar)
- **THEN** the drawer smoothly animates out and closes
- **AND** the calendar view is fully restored
- **AND** any unsaved changes are discarded (with optional confirmation if changes were made)

#### Scenario: Drawer Form Layout

- **WHEN** the Event Form is displayed in the drawer
- **THEN** form fields are comfortably spaced for desktop interaction
- **AND** the drawer width is appropriate (e.g., 400-500px)
- **AND** the primary action button is visible and accessible
- **AND** scrolling is smooth if content exceeds drawer height

#### Scenario: Drawer Accessibility

- **WHEN** the drawer is open on desktop
- **THEN** focus is trapped within the drawer
- **AND** appropriate ARIA labels are present
- **AND** Escape key dismisses the drawer
- **AND** keyboard navigation works for all form controls

---

### Requirement: Event Form Fields and Validation

The system SHALL provide clear, pastoral form fields for creating and editing Community Events, with gentle validation and helper text.

Form fields support both one-off and recurring events, with progressive disclosure of recurrence options.

#### Scenario: Required Event Title

- **WHEN** a user attempts to submit the Event Form without a title
- **THEN** a gentle validation message appears (e.g., "Please add a title for this event")
- **AND** the title field is highlighted
- **AND** the form does not submit

#### Scenario: Date and Time Input

- **WHEN** the Event Form is displayed
- **THEN** date and start time fields are provided
- **AND** end time is optional (not required)
- **AND** an "All-day" toggle is available
- **WHEN** "All-day" is enabled
- **THEN** time fields are hidden or disabled

#### Scenario: Event Description Field

- **WHEN** the Event Form is displayed
- **THEN** an optional description/notes field is provided
- **AND** helper text states "Visible to the care team"
- **AND** the field is clearly marked as optional

#### Scenario: Repeats Toggle and Recurrence Controls

- **WHEN** the Event Form is displayed
- **THEN** a "Repeats" toggle is provided (off by default)
- **WHEN** the user enables "Repeats"
- **THEN** recurrence controls appear (weekly day selector, end condition)
- **AND** controls are clearly labeled with pastoral language
- **WHEN** the user disables "Repeats"
- **THEN** recurrence controls are hidden

#### Scenario: Weekly Day Selector

- **WHEN** weekly recurrence is enabled
- **THEN** a day selector displays all days of the week
- **AND** the user can select one or more days
- **AND** at least one day must be selected for valid weekly recurrence

#### Scenario: End Condition Selector

- **WHEN** recurrence is enabled
- **THEN** an end condition selector is provided
- **AND** options include "Never ends" and "Ends on [date]"
- **WHEN** "Ends on date" is selected
- **THEN** a date picker appears for selecting the end date
- **AND** the end date must be after the start date

#### Scenario: Form Validation Pastoral Language

- **WHEN** validation messages are displayed
- **THEN** all messages use gentle, pastoral language
- **AND** no harsh or technical error messages are shown
- **AND** messages guide the user toward correction without blame

---

## MODIFIED Requirements

### Requirement: Community Event Creation

The system SHALL allow authenticated users to create Community Events via a "New Event" button, with support for both one-off and recurring events, using pastoral form interactions that adapt across mobile and desktop devices.

Community Events add shared rhythms to the calendar and are visible to all care team members.

#### Scenario: Creating a One-Off Community Event

- **WHEN** a user clicks the "New Event" button
- **THEN** the Event Form opens in Add mode (bottom sheet on mobile, drawer on desktop)
- **AND** the form requests: title, date, start time, optional description
- **AND** "Repeats" toggle is available but off by default
- **WHEN** the user completes required fields and submits
- **THEN** the event is saved to Firestore
- **AND** the event appears on the calendar
- **AND** the form overlay/drawer closes

#### Scenario: Creating a Recurring Community Event

- **WHEN** a user clicks the "New Event" button
- **AND** enables the "Repeats" toggle
- **AND** configures recurrence settings (weekly days, end condition)
- **AND** submits the form
- **THEN** the recurring event series is saved to Firestore
- **AND** event instances appear on the calendar based on the recurrence pattern
- **AND** the form overlay/drawer closes

#### Scenario: Event Creation Language

- **WHEN** creating an event
- **THEN** all form labels and buttons use pastoral language
- **AND** the submit action is labeled "Add Event" (not "Submit" or "Create Task")
- **AND** recurrence labels use communal rhythm framing (e.g., "Repeats weekly on...")

#### Scenario: Event Creation Restrictions

- **WHEN** a user is on the calendar
- **THEN** they CANNOT create Care Notes from the calendar
- **AND** they CANNOT create Care Reminders from the calendar
- **AND** the only creation action is "New Event" for Community Events (one-off or recurring)

#### Scenario: Form Overlay/Drawer Behavior

- **WHEN** the Event Form is open
- **THEN** on mobile (< 768px), a full-height bottom sheet is displayed
- **AND** on desktop (≥ 768px), a right-side drawer is displayed
- **AND** the calendar remains visible in the background (dimmed)
- **AND** users can dismiss the form without saving by clicking Close or outside the form

---

### Requirement: Responsive Design

The system SHALL provide a responsive layout that adapts gracefully to different viewport sizes, with view-specific optimizations and interaction patterns tailored for mobile devices.

Event form overlays (bottom sheet on mobile, drawer on desktop) adapt to viewport size to preserve calendar context while providing focused form interactions.

#### Scenario: Mobile Weekly View Default

- **WHEN** viewing the calendar on a mobile device (viewport < 768px)
- **THEN** the Weekly View is displayed by default
- **AND** the view toggle allows switching to Monthly View if desired

#### Scenario: Desktop Monthly View Default

- **WHEN** viewing the calendar on a desktop or tablet device (viewport ≥ 768px)
- **THEN** the Monthly View is displayed by default
- **AND** the view toggle allows switching to Weekly View if desired

#### Scenario: Mobile Focus Panel

- **WHEN** viewing the calendar on a mobile device
- **THEN** the Focus Panel is collapsible or accessible via a toggle
- **AND** it does not obscure the main calendar view
- **AND** Focus Panel behavior is consistent across Weekly and Monthly views

#### Scenario: Weekly View Responsiveness

- **WHEN** viewing the Weekly View on varying mobile widths (320px - 767px)
- **THEN** day sections adapt to the available width
- **AND** event cards remain readable and tappable
- **AND** generous vertical spacing is maintained

#### Scenario: Mobile Event Interaction Pattern

- **WHEN** a user on a mobile device (viewport < 768px) taps a Community Event
- **THEN** the Event Form opens in Edit mode within a full-height bottom sheet
- **AND** the user can view/edit event details without losing calendar context
- **WHEN** a user on a mobile device taps a Member Milestone or Care Reminder
- **THEN** the existing Event Detail Bottom Sheet is displayed (navigation to member page)
- **WHEN** a user on a desktop device (viewport ≥ 768px) clicks a Community Event
- **THEN** the Event Form opens in Edit mode within a right-side drawer
- **WHEN** a user on a desktop device clicks a Member Milestone or Care Reminder
- **THEN** direct navigation to the member detail page occurs (existing behavior)

#### Scenario: Event Form Responsive Adaptation

- **WHEN** the Event Form is displayed on mobile (< 768px)
- **THEN** it appears as a full-height bottom sheet
- **AND** form fields are single-column and touch-optimized
- **WHEN** the Event Form is displayed on desktop (≥ 768px)
- **THEN** it appears as a right-side drawer
- **AND** form fields are comfortably spaced for desktop interaction

---
