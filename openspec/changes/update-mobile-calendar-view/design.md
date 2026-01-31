# Design Document: Mobile Calendar View

## Context

The Care Calendar currently uses a monthly grid view as the primary display across all devices. While effective on desktop, this approach becomes challenging on mobile devices where screen real estate is limited and event details become illegible.

This document outlines the technical approach for introducing a weekly vertical view optimized for mobile devices while preserving the existing desktop experience.

**Constraints:**

- Must preserve all existing event types and data models
- Cannot disrupt desktop or tablet experiences
- Must maintain pastoral tone and visual standards
- Should work with existing Focus Panel and search functionality

**Stakeholders:**

- Pastors using mobile devices for brief check-ins
- Desktop users requiring month-level overview (unchanged)

## Goals / Non-Goals

**Goals:**

- Provide a readable, vertical calendar view for mobile devices
- Default to weekly view on mobile (< 768px) without requiring user configuration
- Maintain ability to switch to monthly view for context
- Preserve all existing functionality (filtering, search, navigation to members)
- Support calm, uncluttered mobile reading experience

**Non-Goals:**

- Redesigning event types or data structures
- Changing desktop or tablet layouts
- Adding new calendar features or event creation flows
- Introducing task management patterns
- Modifying Focus Panel behavior (remains consistent across views)

## Decisions

### 1. Weekly Vertical View as Mobile Primary

**Decision:** Introduce a dedicated `CalendarWeekView.vue` component that displays 7 days vertically.

**Rationale:**

- Vertical scrolling is natural on mobile and accommodates full event details
- Weekly scope provides sufficient context without overwhelming
- Separates mobile and desktop concerns cleanly in codebase

**Alternatives considered:**

- Agenda view as primary: Too abstract, lacks weekly rhythm awareness
- Compressed monthly grid: Still too dense, requires excessive zooming
- 3-day rolling view: Too narrow for weekly patterns

### 2. Automatic Viewport Detection

**Decision:** Use `window.matchMedia('(max-width: 767px)')` to detect mobile and default to weekly view.

**Rationale:**

- Matches Tailwind breakpoints (`md:` = 768px)
- Avoids user configuration or localStorage complexity
- Provides immediate optimal experience

**Alternatives considered:**

- User preference setting: Adds unnecessary complexity
- CSS-only responsive: Doesn't allow view-specific logic separation

### 3. View Toggle Remains Available

**Decision:** Allow users to switch between Week and Month views via toggle, even on mobile.

**Rationale:**

- Some users may want month context for planning
- Non-destructive enhancement — choice remains
- Toggle becomes less prominent on mobile (secondary action)

**Alternatives considered:**

- Remove monthly view on mobile: Too restrictive
- Force monthly on desktop, weekly on mobile: Removes user agency

### 4. Event Rendering Consistency

**Decision:** Reuse existing event type logic and navigation patterns in weekly view.

**Rationale:**

- All event types (Community Gatherings, Member Milestones, Care Reminders, Care Updates) work identically
- Click navigation to member pages preserved
- Contextual labels maintained

**Technical approach:**

- Pass filtered events to `CalendarWeekView.vue`
- Use same event components (`CalendarEvent.vue`) with layout variations
- Maintain read-only status for Care Reminders/Updates

### 5. Focus Panel and Search Integration

**Decision:** Focus Panel filters and search apply to both views equally.

**Rationale:**

- Consistent mental model
- Filter state lives in parent component
- No view-specific filtering logic needed

**Implementation:**

- `CareCalendar.vue` manages filter state
- Both `CalendarWeekView` and `CalendarMonthView` receive filtered events
- Toggle between views maintains filter context

## Component Architecture

```
CareCalendar.vue (Parent)
├── View toggle (Week / Month)
├── Focus Panel (filters, search)
├── CalendarWeekView.vue (Mobile primary)
│   ├── Week navigation (← Week of Nov 3-9 →)
│   └── Day sections (vertical)
│       └── CalendarEvent.vue (reused)
└── CalendarMonthView.vue (Desktop primary)
    ├── Month grid
    └── CalendarEvent.vue (reused)
```

**State Management:**

- Current view mode (week/month)
- Current date/week range
- Filter state (event types, member filter)
- Event data (from Pinia store - unchanged)

## Responsive Breakpoints

- **Mobile**: < 768px → Weekly view default
- **Tablet**: ≥ 768px → Monthly view default
- **Desktop**: ≥ 1024px → Monthly view default

Toggle remains available at all breakpoints.

## Visual Design Notes

### Weekly View Styling

Based on the design reference image:

- Clean, serif header font for month/year (e.g., "November 2024")
- Subtle "VIEW MONTH" toggle in caps, muted color
- Week range display (e.g., "Nov 3 - 9") with dropdown affordance
- Large day numbers in muted gray
- Day names in uppercase, light gray
- Event cards with subtle backgrounds
- Icon + event name + contextual label (e.g., "Communal Rhythm • 10:00 AM")
- Generous vertical spacing between days
- Floating action button (FAB) for "New Event" (bottom right)

### Color Semantics (Preserved)

- Community Gatherings: Soft green/teal
- Member Milestones: Warm amber/peach
- Care Reminders: Subtle blue
- Care Updates: Neutral gray

Icons maintain existing pastoral icon set.

## Migration Plan

This is a pure enhancement with zero breaking changes:

**Phase 1: Component Creation**

1. Build `CalendarWeekView.vue` with static mock data
2. Test layout on mobile devices
3. Integrate with existing event store

**Phase 2: Integration**

1. Add viewport detection to `CareCalendar.vue`
2. Implement view toggle
3. Wire up event filtering and navigation

**Phase 3: Polish**

1. Accessibility testing
2. Touch target verification
3. Animation transitions

**Rollback:**

- Simply hide weekly view component if issues arise
- No data migration or cleanup required

## Risks / Trade-offs

### Risk: Increased Component Complexity

- **Mitigation**: Keep `CalendarWeekView` isolated; no shared state mutations
- **Impact**: Low — component is self-contained

### Risk: Inconsistent Event Rendering

- **Mitigation**: Reuse `CalendarEvent.vue` with layout props
- **Impact**: Low — existing component handles variations

### Trade-off: Additional Code Maintenance

- **Justification**: Mobile usability improvement outweighs minor maintenance cost
- **Mitigation**: Comprehensive component tests

### Trade-off: User Learning Curve

- **Justification**: Automatic detection minimizes confusion
- **Mitigation**: View toggle clearly labeled; familiar weekly calendar pattern

## Open Questions

- [x] **Should the weekly view show partial weeks (e.g., Nov 30 - Dec 6)?**
  - **Answer**: Yes, weeks should flow naturally across month boundaries
- [x] **Should Focus Panel collapse on mobile by default?**
  - **Answer**: Out of scope for this change; Focus Panel mobile behavior is a separate concern

- [x] **Should we persist view preference?**
  - **Answer**: No, automatic detection is sufficient; avoids state complexity

## Accessibility Considerations

- Keyboard navigation: Tab through days, Enter to select events
- Screen reader: Announce week range, day headers, event count per day
- ARIA labels: `role="region"` for weekly view, `aria-label="Week of November 3-9"`
- Touch targets: Minimum 44x44px for week navigation arrows and toggle
- Focus indicators: Visible focus rings on all interactive elements

## Performance Considerations

- Weekly view only renders 7 days vs. 28-31 (lighter than monthly)
- Event filtering happens once in parent; views receive pre-filtered data
- No additional API calls required
- Lazy load weekly view component on mobile detection

## Testing Strategy

1. **Unit Tests**: Week calculation, date range logic
2. **Component Tests**: Event rendering, navigation, toggle behavior
3. **Integration Tests**: Filter state, search interaction
4. **Manual Testing**:
   - Various mobile devices (iPhone SE, Pixel, iPad mini)
   - Viewport resizing
   - Event-heavy calendars
   - Empty states
5. **Accessibility Tests**: Keyboard navigation, screen reader testing
