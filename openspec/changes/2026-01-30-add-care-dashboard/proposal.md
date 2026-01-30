# Proposal: Add Care Dashboard

## Why

The pastoral care application currently supports deep, person-centered care through individual Care Spaces, narrative recording of pastoral encounters, gentle Care Reminders, and a Care Calendar for communal rhythms. However, care begins _after_ navigation—the pastor must choose where to go before being oriented. This creates a subtle but significant gap: there is no moment of pause, no place where remembering comes before acting, no surface that shapes pastoral posture before interaction.

The Care Dashboard addresses this gap by providing an **orientation space**—the natural starting place where care begins each time the app is opened.

## What Changes

### Conceptual Addition

The Care Dashboard is not a new direction, but a **natural continuation** of the existing pastoral philosophy. It functions as:

- A **pause before pastoral work** (not a summary of work done)
- An **invitation into care** (not direction into tasks)
- A **place of remembering** (not reporting)

### Core Elements

The dashboard introduces four primary elements that lead naturally into existing features:

1. **Opening Moment**
   - Calm greeting that reflects time of day or liturgical season
   - A single reflective question or gentle prompt
   - Sets pastoral posture before navigation
   - Establishes emotional and spiritual tone
   - The Opening Moment is brief and lightweight, designed to be read—not responded to—before moving into care

2. **Search as Primary Entry**
   - Prominent, centered search for finding a person
   - Direct pathway into existing Care Spaces
   - Reinforces that care begins with a person, not a system
   - Simple, unobtrusive design

3. **"Holding in Mind" (Care Reminders Surface)**
   - Small, restrained view of upcoming Care Reminders
   - Framed as people to remember, not obligations to complete
   - Shows person's name, reminder context, and intended date
   - No completion checkboxes or task affordances
   - Limited to next 3-5 reminders to avoid overwhelming
   - Links directly to the person's Care Space
   - Gentle language: "Holding in mind" not "Tasks" or "To-dos"
   - An empty state affirms that nothing urgent is required—only continued attentiveness

4. **Shared Rhythms (Calendar Context)**
   - Light surface of upcoming communal events from Care Calendar
   - Next 2-3 events within the coming week
   - Presented as awareness, not scheduling
   - Shows event name, date, and type (e.g., fellowship, service, pastoral gathering)
   - Links to full Care Calendar for deeper engagement
   - Gentle heading: "Shared rhythms" or "Coming together"

### Visual Design Intent

The dashboard should feel like:

- **A threshold space** - Between entering the app and engaging in care
- **A gentle landing** - Calm, spacious, uncluttered
- **A pastoral lens** - Shaping how the pastor sees their week
- **An invitation** - Drawing into care without urgency

Design characteristics:

- Generous whitespace and vertical breathing room
- Centered, single-column layout (no dense multi-column grids)
- Soft, warm color palette consistent with existing pastoral design
- Minimal visual weight (no heavy cards, borders, or shadows)
- Text-forward presentation (reduce iconography)
- No metrics, counts, badges, or alerts

### What Is Built in V1

**In Scope:**

- Dashboard page at `/dashboard` route
- Opening moment with contextual greeting
- Person search as primary action (integrates with existing member search)
- "Holding in Mind" section showing upcoming Care Reminders
- "Shared Rhythms" section showing upcoming calendar events
- Pastoral language and tone throughout
- Mobile-responsive layout
- Integration with existing Care Reminders and Calendar data
- Direct navigation to Care Spaces and Care Calendar

**Explicitly Out of Scope (Not in V1):**

- Customizable dashboard widgets or layout
- Dashboard preferences or settings
- Statistics, metrics, or analytics
- Activity feeds or recent activity logs
- Notifications or alerts system
- Multiple dashboard views or personas
- Team activity or collaboration features
- Any productivity tracking or performance indicators

### What Must Stay the Same

- Existing Care Spaces remain unchanged
- Care Reminders data structure and behavior unchanged
- Care Calendar structure and behavior unchanged
- Member search functionality preserved
- Authentication and permissions model unchanged
- Pastoral care principles and language maintained

### What Must Be Avoided

- Task management metaphors (dashboards as "control panels")
- Productivity language ("today's tasks", "overdue", "completion rate")
- Metrics-driven surfaces (counts, percentages, trends)
- Alert-driven urgency ("overdue", "needs attention", red indicators)
- Dense information displays (packed cards, tables, charts)
- Corporate SaaS patterns (widgets, KPIs, performance summaries)
- Gamification elements (streaks, goals, achievements)

## Impact

### Affected Specs

- **dashboard**: MODIFIED requirements to transform from generic authenticated home to pastoral Care Dashboard

### Affected Code

- `app/pages/dashboard.vue` - Major refactor to implement Care Dashboard design
- Potential new components:
  - `DashboardOpeningMoment.vue` - Greeting and reflective prompt
  - `DashboardPersonSearch.vue` - Prominent search for people (may reuse `MemberSearchInput.vue`)
  - `DashboardHoldingInMind.vue` - Care Reminders surface
  - `DashboardSharedRhythms.vue` - Calendar events surface
- Integration with existing composables:
  - `useCareReminders()` - Query upcoming reminders
  - `useCalendarEvents()` - Query upcoming events
  - `useMembers()` - Search functionality
- Layout updates to `app/layouts/dashboard.vue` if needed for dashboard-specific presentation
- Tailwind styling aligned with pastoral design system

### Technical Details

**Data Integration:**

- Query Care Reminders ordered by date, limited to next 5
- Query Calendar Events for next 7 days, limited to next 3
- Use existing Firestore collections (no new data structures)
- Client-side filtering and sorting where appropriate

**Routing:**

- Dashboard remains at `/dashboard` route
- Remains default post-login destination
- Navigation to Care Spaces via `/members/view/[id]`
- Navigation to Care Calendar via `/calendar`

**Responsive Design:**

- Single-column layout for all viewport sizes
- Stack elements vertically on mobile
- Maintain generous spacing on all devices
- Ensure search remains prominent on mobile

**Performance Considerations:**

- Limit queries to small result sets (3-5 items)
- Use Firestore query limits for efficiency
- Lazy load components where appropriate
- Maintain fast initial page load

### Progressive Enhancement Considerations

- Skeleton states for loading Care Reminders and Events
- Graceful empty states with pastoral language
- Offline support via Firestore caching
- Accessibility standards maintained (WCAG 2.1 Level AA)
- Keyboard navigation for all interactive elements

## Success Criteria

This proposal is successful if:

> The dashboard feels inevitable given what already exists—strengthening coherence rather than adding complexity. Pastors feel invited into care, not directed into work, and the system feels complete, not busier.

Key indicators:

- Dashboard serves as a natural daily entry point
- Pastors feel oriented emotionally and pastorally
- Transition into Care Spaces and Calendar feels smooth and intentional
- No productivity pressure or task-driven anxiety
- Language throughout is calm, respectful, and pastoral
- Visual design creates a sense of pause and presence
- Empty states feel supportive, not disappointing
- Overall tone reinforces the app's theological and relational intent
