# care-calendar Specification Delta

## ADDED Requirements

### Requirement: Mobile Event Detail Bottom Sheet

The system SHALL provide an Event Detail Bottom Sheet on mobile devices (viewport < 768px) as the primary interaction pattern for viewing calendar event details without leaving the calendar context.

The bottom sheet appears when a user taps a calendar event and displays essential event information in-place, prioritising understanding before navigation. This supports the calendar's role as an awareness surface rather than a navigation hub.

#### Scenario: Bottom Sheet Display on Event Tap (Mobile)

- **WHEN** a user on a mobile device (viewport < 768px) taps a calendar event
- **THEN** an Event Detail Bottom Sheet slides up from the bottom of the screen
- **AND** the calendar remains visible but dimmed in the background
- **AND** the bottom sheet displays the event's essential information

#### Scenario: Bottom Sheet Content Display

- **WHEN** the Event Detail Bottom Sheet is displayed
- **THEN** the following information is shown:
  - Event title with appropriate pastoral typography
  - Date and time (or date only for all-day events)
  - Event category badge (e.g., "COMMUNAL RHYTHM", "MEMBER MILESTONE")
  - Optional short description (if present)
- **AND** for member-related events (birthdays, anniversaries), the person's name is prominently displayed
- **AND** all text follows pastoral tone guidelines (no urgency or task language)

#### Scenario: Bottom Sheet Dismissal by Swipe

- **WHEN** a user swipes down on the Event Detail Bottom Sheet
- **THEN** the sheet smoothly animates down and closes
- **AND** the calendar view is fully restored without navigation

#### Scenario: Bottom Sheet Dismissal by Tap Outside

- **WHEN** a user taps outside the Event Detail Bottom Sheet (on the dimmed calendar)
- **THEN** the sheet closes and the calendar view is restored
- **AND** no navigation occurs

#### Scenario: Secondary Navigation from Bottom Sheet

- **WHEN** the Event Detail Bottom Sheet displays a community event
- **THEN** an optional "Open full details" link is visible but not visually dominant
- **WHEN** the user taps the link
- **THEN** they are navigated to the full event detail page

#### Scenario: Member Navigation from Bottom Sheet

- **WHEN** the Event Detail Bottom Sheet displays a member-related event (birthday, anniversary)
- **THEN** a "Go to person" link is visible
- **WHEN** the user taps the link
- **THEN** they are navigated to that member's detail page

#### Scenario: Bottom Sheet Accessibility

- **WHEN** the Event Detail Bottom Sheet is displayed
- **THEN** appropriate ARIA labels are present for screen readers
- **AND** the sheet is announced as a dialog
- **AND** focus is trapped within the sheet while open
- **AND** pressing Escape key (if present) dismisses the sheet
- **AND** all tappable elements meet minimum touch target size (44x44 CSS pixels)

#### Scenario: Bottom Sheet Visual Design

- **WHEN** the Event Detail Bottom Sheet is displayed
- **THEN** it follows pastoral visual design standards (calm, generous whitespace)
- **AND** category colors are subtle and accessible
- **AND** font sizes are optimized for mobile readability
- **AND** the backdrop overlay is gentle and not harsh
- **AND** the sheet respects safe area insets on mobile devices
- **AND** animations are smooth and not jarring

#### Scenario: Desktop Behavior Unchanged

- **WHEN** a user on a desktop or tablet device (viewport ≥ 768px) clicks a calendar event
- **THEN** they are navigated directly to the event detail page (existing behavior)
- **AND** no bottom sheet is displayed
- **AND** the interaction pattern remains unchanged from previous implementation

---

## MODIFIED Requirements

### Requirement: Responsive Design

The system SHALL provide a responsive layout that adapts gracefully to different viewport sizes, with view-specific optimizations and interaction patterns tailored for mobile devices.

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

- **WHEN** a user on a mobile device (viewport < 768px) taps a calendar event
- **THEN** the Event Detail Bottom Sheet is displayed instead of immediate navigation
- **AND** the user can view event details without losing calendar context
- **WHEN** a user on a desktop or tablet device (viewport ≥ 768px) clicks a calendar event
- **THEN** direct navigation to the event detail page occurs (existing behavior)
