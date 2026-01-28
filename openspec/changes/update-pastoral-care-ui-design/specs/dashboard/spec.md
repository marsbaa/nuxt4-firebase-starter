# dashboard Delta Specification

## MODIFIED Requirements

### Requirement: Dashboard Styling

The system SHALL style the dashboard using Tailwind CSS with a pastoral care design system that emphasizes warmth, calm, and trust.

#### Scenario: Pastoral color palette

- **WHEN** dashboard components are rendered
- **THEN** they use warm earth tones (sage green, taupe, warm grays) instead of corporate blues

#### Scenario: Generous spacing and whitespace

- **WHEN** dashboard sections and components are displayed
- **THEN** they include generous spacing (3rem-4rem between sections, 1.5rem-2rem within sections) for visual calm

#### Scenario: Soft component appearance

- **WHEN** dashboard cards, buttons, and interactive elements are displayed
- **THEN** they use gentle rounded corners (`rounded-lg` or `rounded-xl`), subtle shadows (`shadow-sm`), and muted borders (`border-stone-200`)

#### Scenario: Accessible color scheme

- **WHEN** the dashboard is displayed
- **THEN** colors meet WCAG 2.1 AA accessibility standards (4.5:1 contrast ratio minimum)

#### Scenario: Visual feedback on interactions

- **WHEN** a user interacts with dashboard elements (buttons, links)
- **THEN** appropriate hover and active states are shown with subtle color shifts and gentle shadow increases

#### Scenario: Warm typography

- **WHEN** text is rendered throughout the dashboard
- **THEN** it uses medium font weights (`font-medium` for headings), generous line heights (`leading-relaxed` or `leading-loose`), and comfortable sizing (16px base minimum)

### Requirement: Dashboard Home Page

The system SHALL provide a home/root page within the dashboard with warm, care-focused presentation.

#### Scenario: Display welcome message

- **WHEN** a user views the dashboard home page
- **THEN** a personalized welcome message with their name is displayed using warm, respectful language

#### Scenario: Display user summary

- **WHEN** the dashboard home page is loaded
- **THEN** basic user information (email, account creation date) is shown in cards with generous padding and soft styling

#### Scenario: Quick action links

- **WHEN** viewing the dashboard home
- **THEN** quick links to profile and settings are available with clear, supportive language (e.g., "Your profile" instead of "Manage profile")

#### Scenario: Care-focused content tone

- **WHEN** content is displayed on the dashboard
- **THEN** language is care-focused (e.g., "Care for those you serve") rather than productivity-focused (e.g., "Boost your productivity")

### Requirement: Dashboard Navigation

The system SHALL provide navigation within the dashboard with calm, clear styling that feels like gentle guidance.

#### Scenario: Display navigation menu

- **WHEN** the dashboard is loaded
- **THEN** a navigation menu with links to dashboard, profile, and logout is displayed with soft background colors and comfortable spacing

#### Scenario: Active route indication

- **WHEN** a user is on a specific dashboard section
- **THEN** the corresponding navigation item is highlighted with a soft primary color background and rounded corners, not bold borders

#### Scenario: Mobile navigation toggle

- **WHEN** the dashboard is viewed on mobile
- **THEN** the navigation can be toggled open and closed with smooth animations and a gentle overlay

#### Scenario: Rounded navigation icons

- **WHEN** navigation items are displayed
- **THEN** icons use rounded style at comfortable size (24px) with regular stroke weight

## ADDED Requirements

### Requirement: Pastoral Care Visual Language

The system SHALL implement a consistent pastoral care visual language throughout the dashboard.

#### Scenario: Earth tone color palette

- **WHEN** any dashboard element uses colors
- **THEN** colors are drawn from the pastoral palette: sage green (`#7A9B76`), warm taupe (`#9C8B7A`), gentle gold (`#C9A961`), and warm neutrals (`stone` color family)

#### Scenario: Semantic colors with softness

- **WHEN** success, warning, error, or info states are displayed
- **THEN** they use softened semantic colors (gentle green, warm amber, muted terracotta, soft blue-gray) that feel affirming not alarming

#### Scenario: Content max-width for readability

- **WHEN** dashboard content is displayed on larger screens
- **THEN** content is centered with comfortable max-width (`max-w-4xl`) to improve readability and reduce visual strain

#### Scenario: Card elevation with subtlety

- **WHEN** cards or elevated surfaces are displayed
- **THEN** elevation is communicated through subtle shadows (`shadow-sm` resting, `shadow-md` hover) not heavy dramatic shadows

### Requirement: Supportive Content Presentation

The system SHALL present content in a way that supports focus and reduces cognitive load.

#### Scenario: Single-column or two-column layouts

- **WHEN** multiple items or cards are displayed
- **THEN** they are arranged in 1-2 columns maximum on desktop, never 3-4 columns, to reduce visual density

#### Scenario: Vertical information flow

- **WHEN** related information is displayed
- **THEN** it is arranged vertically with clear spacing to support natural reading flow

#### Scenario: Empty states with supportive language

- **WHEN** no content is available to display
- **THEN** empty states use supportive language (e.g., "This space is ready when you are") not cold technical messages (e.g., "No data found")

#### Scenario: Clear visual hierarchy

- **WHEN** dashboard content is rendered
- **THEN** headings, body text, and secondary text are clearly distinguished through size, weight, and color without harsh contrast
