# icon-system Delta Specification

## ADDED Requirements

### Requirement: Pastoral Icon Styling

The system SHALL use icon styling that supports the pastoral care visual language with soft, human, and approachable characteristics.

#### Scenario: Rounded icon style

- **WHEN** icons are displayed throughout the application
- **THEN** they use rounded or curved styles (e.g., Heroicons outline, Feather icons) rather than sharp or geometric styles

#### Scenario: Regular stroke weight

- **WHEN** icons are rendered
- **THEN** they use regular stroke weight (1.5px-2px) not bold, for a softer appearance

#### Scenario: Comfortable icon sizing

- **WHEN** icons are displayed in the UI
- **THEN** they use comfortable sizes (20px-24px for navigation and UI elements, 16px minimum for inline icons) with sufficient padding

#### Scenario: Icon color harmony

- **WHEN** icons are displayed
- **THEN** they use colors from the pastoral palette (primary/secondary text colors, warm grays) that harmonize with surrounding text and elements

### Requirement: Symbolic Appropriateness

The system SHALL choose icon symbols that align with pastoral care values and avoid corporate or technical symbolism.

#### Scenario: Dashboard icon

- **WHEN** the dashboard navigation icon is displayed
- **THEN** it uses a home or layout icon that feels welcoming and orienting, not controlling

#### Scenario: Profile icon

- **WHEN** the profile navigation icon is displayed
- **THEN** it uses a user circle icon that feels personal and respectful, not like an ID badge or account symbol

#### Scenario: Settings icon

- **WHEN** the settings navigation icon is displayed
- **THEN** it uses a gear or sliders icon that suggests customization and functionality without overwhelming technical complexity

#### Scenario: Logout icon

- **WHEN** the logout action icon is displayed
- **THEN** it uses a door or arrow icon that suggests gentle exit, not termination or disconnection

#### Scenario: Success icons

- **WHEN** success states are indicated with icons
- **THEN** they use gentle affirmation symbols (soft checkmark, not aggressive badge) in muted success colors

#### Scenario: Information icons

- **WHEN** informational content includes icons
- **THEN** they use symbols that clarify and support understanding without adding visual noise

### Requirement: Consistent Icon Application

The system SHALL apply icons consistently throughout the interface to support recognition and reduce cognitive load.

#### Scenario: Navigation consistency

- **WHEN** icons are used in navigation
- **THEN** they maintain consistent size (24px), stroke weight, and spacing throughout all navigation contexts

#### Scenario: Icon-text pairing

- **WHEN** icons accompany text labels
- **THEN** they are positioned consistently (typically left of text) with appropriate spacing and vertical alignment

#### Scenario: Standalone icon clarity

- **WHEN** icons are used without text labels
- **THEN** they are sufficiently clear and recognizable, with tooltips or aria-labels for accessibility

#### Scenario: Icon density

- **WHEN** multiple icons appear in proximity
- **THEN** they maintain adequate spacing to avoid visual clutter and support individual recognition
