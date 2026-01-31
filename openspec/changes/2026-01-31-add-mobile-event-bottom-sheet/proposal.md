# Proposal: Add Mobile Event Detail Bottom Sheet

## Why

On mobile devices, navigating away from the calendar to view basic event details is unnecessarily disruptive. It forces users out of their temporal context and turns a moment of awareness into an act of navigation.

The pastoral care app's Calendar serves as a **shared awareness surface** emphasising communal rhythms, liturgical cycles, and member milestones. It is designed for brief, reflective check-ins—especially on mobile. Currently, tapping a calendar event or birthday navigates the user to a separate detail page, breaking the sense of presence the calendar is meant to support.

This is especially problematic for:

- **Month view**, where details cannot be shown inline
- **Brief mobile interactions** where pastors simply want to understand _what an event is_ without committing to deeper action

The calendar should prioritise **in-place understanding before navigation**.

## What Changes

- Introduce an **Event Detail Bottom Sheet** as the primary interaction pattern for viewing calendar event details on mobile devices
- The bottom sheet appears when tapping:
  - An event in **Weekly View**
  - A day or event indicator in **Month View**
- The sheet slides up from the bottom while keeping the calendar visible in the background
- Content shown includes:
  - Event title
  - Date and time (or date only if applicable)
  - Event category (e.g. Communal Rhythm, Member Milestone, Liturgical Event)
  - Optional short descriptive line
  - For member-related events (e.g. birthdays), the person's name is shown clearly
- Actions provided:
  - Navigation to full detail page is **optional and secondary**
  - Actions such as "Open full details" or "Go to person" may be included but are not the primary interaction
- The sheet can be dismissed easily (swipe down or tap outside)

### Design Principles

This change:

- Preserves the calendar as an **awareness surface**
- Prioritises **understanding before action**
- Avoids productivity, task, or management metaphors
- Supports calm, pastoral interaction on mobile
- Reduces cognitive and navigational disruption

The first tap should answer: **"What is this?"**  
Not: **"Where am I going?"**

## Scope & Constraints

### In Scope

- Mobile-only interaction changes (viewport < 768px)
- Introduction of Event Detail Bottom Sheet component
- Replacing immediate navigation with in-place reveal for mobile calendar event taps
- Content display without editing functionality

### Out of Scope

- Changes to event data or semantics
- Editing or management functionality within the bottom sheet
- Desktop or tablet calendar behaviour (≥ 768px maintains current navigation pattern)
- Visual identity or copy changes beyond the bottom sheet component
- Changes to how events are created or stored

## Impact

- **Affected specs:** `care-calendar`
- **Affected code areas:**
  - Calendar event click handling on mobile (`CareCalendar.vue`, `CalendarWeekView.vue`, `CalendarMonthView.vue`)
  - New bottom sheet component for event detail reveal (e.g., `EventDetailSheet.vue`)
  - Conditional navigation logic based on viewport size
- **User impact:**
  - Reduced disruption and improved clarity on mobile
  - Faster understanding of event details without context loss
  - More pastorally aligned interaction on mobile devices
- **Risk level:** Low
  - No breaking changes to data structures or APIs
  - Existing event detail pages remain available and functional
  - Progressive enhancement pattern—desktop behaviour unchanged
  - Mobile users can still access full detail pages if needed

## Outcome

This change allows pastors to remain grounded in the calendar while gaining immediate understanding of events. It reinforces the calendar's role as a place of **noticing and remembrance**, rather than navigation and task execution.

The mobile calendar becomes gentler, clearer, and more pastorally aligned—supporting brief moments of awareness rather than forcing navigation.

## Success Criteria

- On mobile, tapping a calendar event displays the bottom sheet instead of navigating away
- The bottom sheet shows essential event information clearly and calmly
- Users can dismiss the sheet easily to return to calendar context
- Optional navigation to full detail pages remains available but non-primary
- Desktop and tablet behaviour remains unchanged (direct navigation preserved)
- The interaction feels calm, gentle, and pastorally appropriate
