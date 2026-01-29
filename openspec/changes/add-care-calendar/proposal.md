# Proposal: Add Care Calendar

## Why

The pastoral care application currently supports personal care actions (Care Notes, Care Reminders) centered on individual Member Detail pages. However, pastors and care teams also need a way to hold awareness of **shared communal rhythms**—church gatherings, member milestones, liturgical seasons—without conflating this communal surface with personal care workflows.

Currently, there is no dedicated space for viewing the shared time and important dates of the church community. This gap makes it harder for care teams to notice rhythms, anticipate significant moments, and maintain a sense of shared calendar awareness alongside individual pastoral care.

## Problem Statement

Pastors and care teams need a calm, visual overview of shared time and important dates within the church community. This surface should:

- Help users notice rhythms, seasons, and gatherings
- Support communal awareness without productivity pressure
- Maintain clear separation from personal care actions (which belong on Member Detail pages)

The absence of such a surface creates a gap between individual care and communal rhythm, making it harder to care holistically for both people and community.

## Goals

1. **Provide a communal time surface** — A calm, visual overview of shared events and significant dates
2. **Support rhythm awareness** — Help users notice liturgical seasons, church gatherings, and member milestones
3. **Maintain mental model clarity** — Calendar = shared rhythm; Member pages = personal care
4. **Enable event creation** — Allow users to add events to shared communal time
5. **Offer gentle filtering** — Let users focus attention without overwhelming cognitive load

## Non-Goals

1. **Task management** — The calendar is not a task manager or to-do surface
2. **Care Note creation** — Care Notes belong on Member Detail pages, not the calendar
3. **Care Reminder creation** — Care Reminders belong on Member Detail pages, not the calendar
4. **Completion workflows** — No status tracking, checkboxes, or "done" semantics
5. **Productivity metrics** — No counts, overdue indicators, or efficiency measurements
6. **Member management** — Calendar may link to members but does not originate member actions

## User Value

### For Pastors

- See the church's shared rhythm at a glance
- Notice upcoming gatherings and member milestones
- Maintain awareness of liturgical seasons
- Add community events to shared time

### For Care Teams

- Shared visibility into communal rhythm
- Awareness of significant dates across the community
- Context for personal care (e.g., knowing a birthday is approaching before a visit)
- Reduced cognitive burden through gentle filtering

### For the Community

- Important events are remembered and honored
- Communal life is visible and intentional
- Rhythms of faith and fellowship are supported

## What Changes

### New Capability: Care Calendar

A new page and set of components providing a communal calendar surface.

### Primary Features

1. **Month View**
   - Traditional calendar grid showing the current month
   - Events displayed on their respective dates
   - Clear visual distinction between event types (Member Milestones, Community Gatherings, Liturgical Events)
   - Subtle today indicator
   - Month navigation (previous/next)
   - Liturgical context subtitle (e.g., "LITURGICAL CYCLE • COMMUNAL RHYTHMS")

2. **Agenda View**
   - Chronological list of upcoming events
   - Alternative to month view for linear reading
   - Same filtering capabilities as month view

3. **Event Types**
   - **Community Gatherings** — Church events, services, picnics, special gatherings
   - **Member Milestones** — Birthdays, anniversaries (sourced from member data)
   - **Care Reminders** — Read-only visibility of existing Care Reminders from Member pages (filtered by due date)
   - **Care Updates** — Read-only visibility signals indicating recent care activity
   - **Liturgical Events** — Seasonal observances, holy days (future enhancement)

4. **Event Creation Flow**
   - Primary CTA: "New Event" button
   - Creates events into shared communal time
   - Gentle, focused creation form
   - Does NOT create Care Notes or Care Reminders

5. **Focus Panel ("Focus your attention")**
   - Sidebar for filtering and focus
   - Member search (view-only filter)
   - Category toggles:
     - Care Reminders (visibility toggle)
     - Member Milestones (visibility toggle)
     - Care Updates (visibility toggle)
     - Community Gatherings (visibility toggle)
   - Optional: "Show completed reminders" toggle
   - Informational note reinforcing mental model: "Care notes and individual reminders are managed through Member Detail pages."

6. **Event Links**
   - Calendar items may link to Member Detail pages
   - Links support navigation, not action origination
   - Clicking a member milestone opens that member's page

7. **Search**
   - Search communal events by name/description
   - Supports discovery without browsing

### Visual Design Principles

- **Calm aesthetic** — Generous whitespace, soft visual hierarchy
- **Color-coded categories** — Subtle, accessible color coding for event types
- **Restrained CTAs** — "New Event" present but not dominant
- **Pastoral tone** — Tagline like "Grace in every shared moment"
- **Legend** — Bottom legend showing event type colors
- **No urgency indicators** — No red, no overdue, no alarm states

### Interaction Principles

1. **Attentiveness over efficiency** — Support noticing, not completing
2. **Gentle defaults** — All categories visible by default; users focus if needed
3. **Optional complexity** — Filters available but not required
4. **Mental model reinforcement** — UI clearly communicates that personal care belongs on member pages
5. **Soft empty states** — When no events exist, show warm, inviting empty state (not "No data")

### What Is Built in V1

**In Scope:**

- Care Calendar page with route `/calendar`
- Month view with event display
- Agenda view alternative
- Event creation flow (Community Events only in v1)
- Member Milestones sourced from member data (birthdays, anniversaries)
- Care Reminders visibility (read-only, sourced from existing reminders by due date)
- Care Updates visibility (read-only signals of recent care activity)
- Focus panel with category filters (all four categories: Care Reminders, Member Milestones, Care Updates, Community Gatherings)
- "Show completed reminders" toggle
- Visual distinction between event types
- Mobile-responsive layout
- Navigation integration

**Explicitly Out of Scope (Not in V1):**

- Liturgical calendar integration (future enhancement)
- Recurring events
- Event editing (create-only in v1)
- Event deletion
- iCal/Google Calendar sync
- Notifications for upcoming events
- Multi-day event display
- Time-of-day granularity (date-only in v1)

### What Must Stay the Same

- Member Detail pages remain the home for Care Notes and Care Reminders
- No changes to existing care workflows
- Navigation and authentication patterns unchanged
- Pastoral language and tone throughout

### What Must Be Avoided

- Task management patterns (checkboxes, assignments, status)
- Productivity language ("to-do", "overdue", "complete")
- Urgency-driven UI (red, warnings, alerts)
- Metrics or counts ("3 events this week")
- Analytics dashboards
- Workflow or process management

## Impact

### Affected Specs

- **NEW care-calendar**: New capability for the Care Calendar feature

### Affected Code

- New page: `app/pages/calendar.vue`
- New components:
  - `CareCalendar.vue` — Main calendar container
  - `CalendarMonthView.vue` — Month grid display
  - `CalendarAgendaView.vue` — Agenda list display
  - `CalendarEvent.vue` — Individual event display
  - `CalendarFocusPanel.vue` — Sidebar filter panel
  - `CalendarEventForm.vue` — Event creation form
- New composable: `useCalendarEvents()` for Firestore operations
- New types: `app/types/calendarEvents.ts`
- Firestore collection: `/calendarEvents`
- Security rules: Firestore rules for calendar events
- Navigation update: Add "Calendar" to dashboard layout

### Technical Details

**Firestore Structure:**

```
/calendarEvents/{eventId}
  ├── title: string
  ├── description: string (optional)
  ├── eventType: 'community' | 'milestone' | 'liturgical'
  ├── date: Timestamp
  ├── memberId: string (optional, for milestones)
  ├── memberName: string (optional, for milestones)
  ├── createdBy: string
  ├── createdAt: Timestamp
  └── metadata: object (optional, for future extensions)
```

**Member Milestones:**

- Birthdays and anniversaries sourced from existing member data
- Displayed as read-only calendar entries
- Clicking navigates to member detail page
- No separate storage (derived from member data)

### Progressive Enhancement Considerations

- Calendar should load gracefully with skeleton states
- Mobile layout should prioritize month/agenda views
- Maintain accessibility standards (WCAG 2.1 Level AA)
- Responsive design for all viewports
- Offline support via Firestore caching

## Open Questions / Future Considerations

1. **Liturgical calendar integration** — How should liturgical seasons be defined? Manual entry, imported calendar, or preset templates?

2. **Recurring events** — V1 is single-occurrence only. Future versions may support weekly/monthly/annual recurrence.

3. **Event editing/deletion** — V1 is create-only. Future versions will need edit and delete with appropriate confirmation flows.

4. **External calendar sync** — Should the calendar support import/export via iCal or integration with Google Calendar?

5. **Notifications** — Should users receive reminders about upcoming events? If so, how to balance helpfulness with avoiding urgency/pressure?

6. **Multi-site/multi-community** — How should the calendar adapt for churches with multiple congregations or care teams?

## Success Criteria

This feature is successful if:

> Pastors and care teams can glance at the calendar and feel a sense of communal rhythm—noticing what's coming, who is being remembered, and when the community gathers—without feeling any pressure to complete, manage, or optimize.

Key indicators:

- Language is entirely pastoral (no corporate terminology)
- Calendar feels like a communal surface, not a task manager
- Personal care actions (Care Notes, Care Reminders) remain on Member Detail pages
- Focus panel provides gentle filtering without cognitive overload
- Event creation feels like adding to shared time, not scheduling tasks
- Overall page tone is calm, attentive, and supportive of communal awareness
- Users understand the mental model: Calendar = shared rhythm; Member pages = personal care
