## ADDED Requirements

### Requirement: Weekly View Display

The system SHALL provide a Weekly View as an alternative calendar display optimized for mobile devices, showing a vertical list of days with events grouped under each day.

The Weekly View prioritizes readability and awareness on small screens, displaying one week at a time with full event details visible without interaction.

#### Scenario: Viewing Current Week on Mobile

- **WHEN** a user views the Care Calendar on a mobile device (viewport < 768px)
- **THEN** the Weekly View is displayed by default
- **AND** the current week is shown (7 days starting from most recent Sunday or Monday)
- **AND** the current day is subtly highlighted
- **AND** the week range is displayed in the header (e.g., "Nov 3 - 9")

#### Scenario: Weekly View Day Structure

- **WHEN** viewing the Weekly View
- **THEN** each day is displayed as a vertical section
- **AND** each day shows the day number (large) and day name (small, uppercase)
- **AND** events for that day are listed below the day header
- **AND** days with no events show the day header only (no "no events" message)

#### Scenario: Event Display in Weekly View

- **WHEN** events are displayed in the Weekly View
- **THEN** each event shows:
  - An icon representing its type
  - The event name
  - The event time (if applicable)
  - A contextual label (e.g., "Communal Rhythm", "Member Milestone")
- **AND** events use the same color coding as Monthly View
- **AND** events are tappable/clickable with clear touch targets (minimum 44x44px)

#### Scenario: Week Navigation

- **WHEN** viewing the Weekly View
- **THEN** previous and next week navigation controls are available
- **WHEN** a user taps the previous week control
- **THEN** the calendar displays the previous week
- **WHEN** a user taps the next week control
- **THEN** the calendar displays the next week
- **AND** the week range header updates accordingly

#### Scenario: Week Boundary Handling

- **WHEN** displaying a week that crosses month boundaries
- **THEN** all 7 days are shown regardless of month
- **AND** the week range label reflects both months (e.g., "Nov 30 - Dec 6")

---

### Requirement: View Toggle Between Weekly and Monthly

The system SHALL provide a view toggle allowing users to switch between Weekly View and Monthly View on any device, with automatic defaults based on viewport size.

#### Scenario: Automatic View Selection on Mobile

- **WHEN** the Care Calendar loads on a mobile device (viewport < 768px)
- **THEN** the Weekly View is displayed by default
- **AND** a toggle control is visible to switch to Monthly View

#### Scenario: Automatic View Selection on Desktop

- **WHEN** the Care Calendar loads on a desktop or tablet device (viewport ≥ 768px)
- **THEN** the Monthly View is displayed by default
- **AND** a toggle control is visible to switch to Weekly View

#### Scenario: Switching from Weekly to Monthly View

- **WHEN** a user is viewing the Weekly View
- **AND** they tap the "Month" toggle option
- **THEN** the view switches to Monthly View
- **AND** the currently displayed week's month is shown in the Monthly View
- **AND** the view preference is maintained while navigating

#### Scenario: Switching from Monthly to Weekly View

- **WHEN** a user is viewing the Monthly View
- **AND** they tap the "Week" toggle option
- **THEN** the view switches to Weekly View
- **AND** the week containing the current date is displayed
- **AND** the view preference is maintained while navigating

#### Scenario: View Toggle Accessibility

- **WHEN** the view toggle is displayed
- **THEN** it is keyboard accessible
- **AND** screen readers announce the current view and toggle options
- **AND** ARIA labels clearly indicate the toggle purpose

---

### Requirement: Event Interaction Consistency Across Views

The system SHALL ensure that event interactions (navigation, filtering, display) work identically in both Weekly View and Monthly View.

#### Scenario: Event Navigation in Weekly View

- **WHEN** a user taps a Community Event in Weekly View
- **THEN** the event detail or edit view is displayed (same as Monthly View behavior)
- **WHEN** a user taps a Member Milestone in Weekly View
- **THEN** they are navigated to that member's detail page
- **WHEN** a user taps a Care Reminder in Weekly View
- **THEN** they are navigated to the associated member's Care Space

#### Scenario: Filtering Events in Weekly View

- **WHEN** Focus Panel filters are applied (event type toggles, member search)
- **AND** the Weekly View is active
- **THEN** only filtered events are displayed in the weekly day sections
- **AND** filtering behavior is identical to Monthly View

#### Scenario: Search in Weekly View

- **WHEN** calendar search is active
- **AND** the Weekly View is active
- **THEN** only matching events are displayed in the weekly day sections
- **AND** search behavior is identical to Monthly View

---

## MODIFIED Requirements

### Requirement: Responsive Design

The system SHALL provide a responsive layout that adapts gracefully to different viewport sizes, with view-specific optimizations for mobile devices.

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

---

## ADDED Requirements

### Requirement: Weekly View Visual Design

The system SHALL implement visual design standards specific to the Weekly View that maintain the calm, pastoral aesthetic while optimizing for mobile readability.

#### Scenario: Weekly View Typography

- **WHEN** the Weekly View is displayed
- **THEN** day numbers are large and readable (e.g., "03" in light gray)
- **AND** day names are uppercase and subtle (e.g., "SUNDAY" in light gray)
- **AND** event names use clear, readable font sizes for mobile
- **AND** contextual labels are visibly distinct but not dominant

#### Scenario: Weekly View Spacing

- **WHEN** the Weekly View is displayed
- **THEN** generous whitespace separates each day section
- **AND** events within a day have comfortable vertical spacing
- **AND** the layout feels calm and uncluttered

#### Scenario: Weekly View Empty Days

- **WHEN** a day in the Weekly View has no events
- **THEN** only the day header is shown
- **AND** no "no events" message or placeholder is displayed
- **AND** the empty space maintains visual calm

#### Scenario: Weekly View Week Range Header

- **WHEN** the Weekly View is displayed
- **THEN** the week range is clearly shown (e.g., "Nov 3 - 9")
- **AND** the header includes subtle affordances for week selection (if implemented)
- **AND** navigation controls are visible but not visually dominant
