## MODIFIED Requirements

### Requirement: Dashboard Home Page

The system SHALL provide a Care Dashboard as the home/root page within the authenticated experience, serving as an orientation space where pastoral care begins each time the app is opened.

#### Scenario: Display opening moment

- **WHEN** a pastor views the Care Dashboard
- **THEN** a calm, contextual greeting and gentle reflective question are displayed to set pastoral posture before engagement

#### Scenario: Contextual greeting

- **WHEN** the opening moment is displayed
- **THEN** the greeting reflects time of day (morning, afternoon, evening) or liturgical season with warm, pastoral language

#### Scenario: Prominent person search

- **WHEN** the Care Dashboard is displayed
- **THEN** person search is prominently positioned as the primary entry point, reinforcing that care begins with a person

#### Scenario: Navigate to Care Space from search

- **WHEN** a pastor selects a person from the dashboard search
- **THEN** they are navigated directly to that person's Care Space

#### Scenario: Single-column layout

- **WHEN** the Care Dashboard is displayed on any viewport size
- **THEN** content is arranged in a single, vertically-stacked column with generous whitespace (3-4rem between sections)

#### Scenario: Centered with comfortable max-width

- **WHEN** the Care Dashboard is viewed on larger screens
- **THEN** content is centered with a comfortable max-width (max-w-3xl or max-w-4xl) to reduce visual strain and support focus

## ADDED Requirements

### Requirement: Holding in Mind (Care Reminders Surface)

The system SHALL display a gentle surface of upcoming Care Reminders to help pastors remember people without creating productivity pressure.

#### Scenario: Display upcoming Care Reminders

- **WHEN** the Care Dashboard is loaded
- **THEN** the next 3-5 Care Reminders (ordered by date) are displayed under the heading "Holding in mind" or similar pastoral language

#### Scenario: Reminder content display

- **WHEN** a Care Reminder is shown on the dashboard
- **THEN** it displays the person's name, reminder context, and intended date in a gentle list format without checkboxes or task affordances

#### Scenario: Navigate to Care Space from reminder

- **WHEN** a pastor clicks on a Care Reminder
- **THEN** they are navigated to that person's Care Space (not to complete the reminder inline)

#### Scenario: Empty state for reminders

- **WHEN** no upcoming Care Reminders exist
- **THEN** an empty state with supportive pastoral language is displayed (e.g., "This space is ready when you are")

#### Scenario: No overdue or alert indicators

- **WHEN** Care Reminders are displayed on the dashboard
- **THEN** no "overdue", "late", or urgency-driven visual indicators are shown, maintaining a calm tone

### Requirement: Shared Rhythms (Calendar Events Surface)

The system SHALL display a light surface of upcoming communal events from the Care Calendar to provide awareness of shared rhythms without scheduling pressure.

#### Scenario: Display upcoming Calendar Events

- **WHEN** the Care Dashboard is loaded
- **THEN** the next 2-3 Calendar Events within the next 7 days are displayed under the heading "Shared rhythms" or "Coming together"

#### Scenario: Event content display

- **WHEN** a Calendar Event is shown on the dashboard
- **THEN** it displays the event name, date, and type (e.g., fellowship, service, pastoral gathering) in a gentle list format

#### Scenario: Navigate to Care Calendar

- **WHEN** a pastor clicks on the Shared Rhythms section or a "View calendar" link
- **THEN** they are navigated to the full Care Calendar page

#### Scenario: Empty state for events

- **WHEN** no upcoming Calendar Events exist within 7 days
- **THEN** an empty state with supportive pastoral language is displayed

#### Scenario: Awareness not scheduling

- **WHEN** Calendar Events are displayed on the dashboard
- **THEN** they are presented as awareness and context, not as scheduling demands or action items

### Requirement: Dashboard as Orientation Space

The system SHALL design the Care Dashboard to function as a threshold space that orients pastors emotionally and pastorally before deeper engagement.

#### Scenario: Pause before pastoral work

- **WHEN** a pastor opens the app and sees the Care Dashboard
- **THEN** the design creates a sense of pause and presence (not urgency or task direction)

#### Scenario: Invitation into care

- **WHEN** the Care Dashboard is displayed
- **THEN** the tone, language, and visual design invite pastors into care rather than directing them into work

#### Scenario: No productivity metrics

- **WHEN** the Care Dashboard is displayed
- **THEN** no metrics, counts, completion rates, or productivity indicators are shown

#### Scenario: No alert-driven urgency

- **WHEN** the Care Dashboard is displayed
- **THEN** no "overdue", "needs attention", red badges, or alert-driven elements are present

#### Scenario: Minimal visual weight

- **WHEN** the Care Dashboard components are displayed
- **THEN** they use minimal visual weight with subtle shadows, gentle borders, and ample whitespace

#### Scenario: Text-forward presentation

- **WHEN** the Care Dashboard is displayed
- **THEN** content is primarily text-based with reduced iconography, supporting clarity and calm

## REMOVED Requirements

### Requirement: Display user summary

**Reason**: The Care Dashboard shifts from a generic authenticated home displaying user account information to a pastoral orientation space focused on people and care context. User account details are more appropriately accessed via profile or settings.

**Migration**: Account creation date and email information are available in the profile page. No data migration needed; this is a UI change only.

### Requirement: Quick action links

**Reason**: Generic "quick links to profile and settings" do not align with the Care Dashboard's purpose as an orientation space. Navigation to these areas is handled by the main navigation sidebar.

**Migration**: Profile and settings links remain accessible via the main dashboard navigation. No data migration needed; this is a UI change only.
