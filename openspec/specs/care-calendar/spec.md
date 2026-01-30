# care-calendar Specification

## Purpose
TBD - created by archiving change add-care-calendar. Update Purpose after archive.
## Requirements
### Requirement: Care Calendar Page

The system SHALL provide a Care Calendar page accessible at `/calendar` that displays a visual overview of shared communal time within the church community.

The Care Calendar serves as a communal surface for rhythm awareness, distinct from personal care workflows on Member Detail pages. It supports attentiveness over efficiency and avoids task management patterns.

#### Scenario: Accessing the Care Calendar

- **WHEN** an authenticated user navigates to `/calendar`
- **THEN** the Care Calendar page loads with the current month displayed
- **AND** all visible event categories are shown by default
- **AND** the focus panel is accessible

#### Scenario: Calendar Navigation Integration

- **WHEN** a user is on the dashboard
- **THEN** a navigation link to "Calendar" is visible
- **AND** clicking it navigates to the Care Calendar page

---

### Requirement: Month View Display

The system SHALL provide a Month View as the default calendar display, showing a traditional calendar grid with events positioned on their respective dates.

#### Scenario: Viewing Current Month

- **WHEN** a user views the Care Calendar
- **THEN** the current month is displayed as a grid with day cells
- **AND** the current day is subtly highlighted as "TODAY"
- **AND** a liturgical context subtitle is shown (e.g., "LITURGICAL CYCLE • COMMUNAL RHYTHMS")

#### Scenario: Month Navigation

- **WHEN** a user clicks the previous month arrow
- **THEN** the calendar displays the previous month
- **WHEN** a user clicks the next month arrow
- **THEN** the calendar displays the next month

#### Scenario: Events Displayed on Dates

- **WHEN** events exist for dates in the current month
- **THEN** events are displayed within their respective day cells
- **AND** events are visually distinguished by type using subtle color coding

---

### Requirement: Agenda View Display

The system SHALL provide an Agenda View as an alternative to Month View, showing a chronological list of upcoming events.

#### Scenario: Switching to Agenda View

- **WHEN** a user clicks the "Agenda" toggle
- **THEN** the calendar switches from Month View to Agenda View
- **AND** events are displayed in chronological order

#### Scenario: Agenda Date Grouping

- **WHEN** viewing the Agenda View
- **THEN** events are grouped by date
- **AND** each date group shows the date as a header

---

### Requirement: Event Type Classification

The system SHALL classify calendar events into distinct types with visual differentiation:

- **Community Gatherings** — Church events, services, picnics, special gatherings
- **Member Milestones** — Birthdays, anniversaries sourced from member data
- **Care Reminders** — Read-only visibility of existing Care Reminders from Member pages (filtered by due date)
- **Care Updates** — Read-only visibility signals indicating recent care activity
- **Liturgical Events** — Seasonal observances, holy days (future enhancement)

#### Scenario: Visual Distinction of Event Types

- **WHEN** multiple event types appear on the calendar
- **THEN** each type has a distinct, subtle color indicator
- **AND** a legend at the bottom of the calendar explains the color coding

#### Scenario: Event Type Icons

- **WHEN** an event is displayed
- **THEN** an appropriate icon accompanies the event based on its type
- **AND** icons are neutral and unobtrusive

---

### Requirement: Community Event Creation

The system SHALL allow authenticated users to create Community Events via a "New Event" button, adding events to shared communal time.

#### Scenario: Creating a Community Event

- **WHEN** a user clicks the "New Event" button
- **THEN** an event creation form is presented
- **AND** the form requests: title, date, and optional description
- **WHEN** the user completes the form and submits
- **THEN** the event is saved to Firestore
- **AND** the event appears on the calendar

#### Scenario: Event Creation Language

- **WHEN** creating an event
- **THEN** all form labels and buttons use pastoral language
- **AND** the submit action is labeled "Add Event" or similar (not "Submit" or "Create Task")

#### Scenario: Event Creation Restrictions

- **WHEN** a user is on the calendar
- **THEN** they CANNOT create Care Notes from the calendar
- **AND** they CANNOT create Care Reminders from the calendar
- **AND** the only creation action is "New Event" for community events

---

### Requirement: Member Milestones Display

The system SHALL display Member Milestones (birthdays, anniversaries) on the calendar, sourced from existing member data.

#### Scenario: Birthday Display

- **WHEN** a member has a date of birth recorded
- **THEN** their birthday appears on the calendar as a Member Milestone
- **AND** the event shows the member's name (e.g., "Arthur P. Birthday")

#### Scenario: Anniversary Display

- **WHEN** a member has an anniversary date recorded
- **THEN** their anniversary appears on the calendar as a Member Milestone
- **AND** the event shows appropriate context (e.g., "The Millers Anniv.")

#### Scenario: Milestone Navigation to Member

- **WHEN** a user clicks on a Member Milestone event
- **THEN** they are navigated to that member's detail page
- **AND** the navigation opens the member's Care Space context

---

### Requirement: Care Reminders Visibility

The system SHALL display Care Reminders on the calendar as read-only items, sourced from existing Care Reminders associated with members. These are displayed for awareness only; creation and management of Care Reminders remains on Member Detail pages.

#### Scenario: Care Reminders Display

- **WHEN** Care Reminders exist with due dates in the current month
- **THEN** they appear on the calendar on their respective due dates
- **AND** they are visually identified as Care Reminders
- **AND** they are read-only (no completion or editing from the calendar)

#### Scenario: Care Reminder Click Navigation

- **WHEN** a user clicks on a Care Reminder item
- **THEN** they are navigated to the associated member's detail page
- **AND** the member's Care Space is displayed

#### Scenario: Show Completed Reminders Toggle

- **WHEN** the Focus Panel is visible
- **THEN** a "Show completed reminders" toggle is available
- **WHEN** the toggle is off (default)
- **THEN** completed Care Reminders are hidden from the calendar
- **WHEN** the toggle is on
- **THEN** completed Care Reminders are visible on the calendar

---

### Requirement: Care Updates Visibility

The system SHALL display Care Updates on the calendar as read-only signals indicating recent care activity. These provide awareness of when care has occurred without exposing note content.

#### Scenario: Care Updates Display

- **WHEN** Care Notes have been added for members on dates in the current month
- **THEN** Care Update signals may appear on those dates
- **AND** they indicate care activity without showing note content
- **AND** they are read-only

#### Scenario: Care Update Click Navigation

- **WHEN** a user clicks on a Care Update item
- **THEN** they are navigated to the associated member's detail page

---

### Requirement: Focus Panel

The system SHALL provide a Focus Panel sidebar allowing users to filter and focus their calendar view without cognitive overload.

#### Scenario: Focus Panel Display

- **WHEN** viewing the Care Calendar
- **THEN** a Focus Panel is visible with the heading "Focus your attention"
- **AND** the panel includes category visibility toggles
- **AND** the panel includes a member search filter

#### Scenario: Category Filtering

- **WHEN** a user toggles off a category (e.g., "Community Gatherings")
- **THEN** events of that category are hidden from the calendar
- **WHEN** a user toggles on a category
- **THEN** events of that category are visible on the calendar

#### Scenario: Member Filter

- **WHEN** a user searches for a member in the Focus Panel
- **THEN** the calendar filters to show only events related to that member
- **AND** this is a view-only filter (no creation actions)

#### Scenario: Mental Model Reinforcement

- **WHEN** viewing the Focus Panel
- **THEN** an informational note states: "Care notes and individual reminders are managed through Member Detail pages."
- **AND** this reinforces the mental model separation between calendar and member pages

---

### Requirement: Calendar Search

The system SHALL provide search functionality for discovering communal events by name or description.

#### Scenario: Searching Events

- **WHEN** a user types in the search field
- **THEN** the calendar filters to show matching events
- **AND** matching is performed on event title and description

---

### Requirement: Pastoral Tone and Language

The system SHALL use calm, pastoral language throughout the Care Calendar, avoiding corporate, task-management, or urgency-driven terminology.

#### Scenario: Calendar Tagline

- **WHEN** viewing the calendar footer area
- **THEN** a pastoral tagline is displayed (e.g., "Grace in every shared moment")

#### Scenario: No Task Language

- **WHEN** any text is displayed on the Care Calendar
- **THEN** it MUST NOT use terms like: "task", "to-do", "overdue", "complete", "assign", "deadline"
- **AND** it SHOULD use terms aligned with pastoral care: "event", "gathering", "milestone", "remember"

#### Scenario: No Urgency Indicators

- **WHEN** events are displayed
- **THEN** there are no red colors, warning icons, or overdue states
- **AND** all visual indicators remain calm and non-urgent

---

### Requirement: Visual Design Standards

The system SHALL implement visual design standards that create a calm, pastoral aesthetic for the Care Calendar.

#### Scenario: Whitespace and Hierarchy

- **WHEN** the calendar is displayed
- **THEN** generous whitespace surrounds calendar elements
- **AND** visual hierarchy is soft, not aggressive

#### Scenario: Restrained CTAs

- **WHEN** the "New Event" button is displayed
- **THEN** it is visible but not visually dominant
- **AND** it does not create urgency or pressure

#### Scenario: Empty State

- **WHEN** no events exist for the displayed period
- **THEN** a gentle, warm empty state is shown
- **AND** the empty state invites without pressuring (not "No data found")

---

### Requirement: Responsive Design

The system SHALL provide a responsive layout that adapts gracefully to different viewport sizes.

#### Scenario: Mobile Month View

- **WHEN** viewing the calendar on a mobile device
- **THEN** the month view adapts to the smaller screen
- **AND** events remain readable and tappable

#### Scenario: Mobile Focus Panel

- **WHEN** viewing the calendar on a mobile device
- **THEN** the Focus Panel is collapsible or accessible via a toggle
- **AND** it does not obscure the main calendar view

---

### Requirement: Accessibility Standards

The system SHALL meet WCAG 2.1 Level AA accessibility standards for the Care Calendar.

#### Scenario: Keyboard Navigation

- **WHEN** a user navigates the calendar using keyboard only
- **THEN** all interactive elements are reachable and operable
- **AND** focus indicators are visible

#### Scenario: Screen Reader Support

- **WHEN** a screen reader user accesses the calendar
- **THEN** calendar structure and events are announced appropriately
- **AND** ARIA labels provide meaningful context

#### Scenario: Color Contrast

- **WHEN** event type colors are used
- **THEN** color alone is not the only means of distinction
- **AND** contrast ratios meet WCAG AA requirements

