# Proposal: Add Mobile Event Detail Bottom Sheet

## Why

On mobile devices, navigating away from the calendar to view basic details is unnecessarily disruptive. It forces users out of their temporal context and turns a moment of awareness into an act of navigation.

The pastoral care app's Calendar serves as a **shared awareness surface** emphasising communal rhythms, liturgical cycles, member milestones, and care intentions held in time. It is designed for brief, reflective check-ins—especially on mobile. Currently, tapping a calendar event, birthday, or reminder navigates the user to a separate detail page, breaking the sense of presence the calendar is meant to support.

This disruption problem applies not only to **calendar events**, but also to:

- **Birthdays / member milestones** that appear on the calendar
- **Reminders** (care intentions) that surface on the calendar

This is especially problematic for:

- **Month view**, where details cannot be shown inline
- **Brief mobile interactions** where pastors simply want to understand _what an item is_ without committing to deeper action

The calendar should prioritise **in-place understanding before navigation**—for anything shown on the calendar.

## What Changes

- Introduce an **Event Detail Bottom Sheet** as the primary interaction pattern for viewing calendar item details on mobile devices
- The bottom sheet is a **shared reveal pattern** for all calendar items on mobile
- The bottom sheet appears when tapping:
  - **Events** (communal rhythms, liturgical events, gatherings) in Weekly View or Month View
  - **Birthdays / member milestones** shown on the calendar
  - **Reminders** (care intentions held in time) that surface on the calendar
- The sheet slides up from the bottom while keeping the calendar visible in the background

### Content Rules by Type (Minimal and Calm)

The bottom sheet displays different information depending on the tapped item type:

#### Events

- Title
- Date/time
- Category label (Communal Rhythm / Liturgical / etc.)
- Optional short description

#### Birthdays / Member Milestones

- Person's name (primary)
- Label: "Birthday" or "Member Milestone"
- Date (and age only if already part of existing semantics)
- Optional gentle descriptor (no task language)

#### Reminders

- Reminder text (primary)
- Linked person (if applicable)
- Date context
- No completion controls, no urgency indicators

### Actions

- Navigation is **secondary and optional**
- First tap is always **reveal**, not routing
- Actions remain restrained:
  - **Events**: "Open full details"
  - **Birthdays**: "Go to person"
  - **Reminders**: "View in care space" (if applicable)
- Do not introduce task-style actions (no "Complete", no checkboxes)
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
- Replacing immediate navigation with in-place reveal for mobile calendar taps
- Bottom sheet support for **events**, **birthdays**, and **reminders** on mobile calendar taps
- Content display without editing functionality

### Out of Scope

- Changes to event, birthday, or reminder data or semantics
- Editing or management functionality within the bottom sheet
- Reminder completion or task management interactions
- Editing workflows inside the bottom sheet
- Desktop or tablet calendar behaviour (≥ 768px maintains current navigation pattern)
- Visual identity or copy changes beyond the bottom sheet component
- Changes to how events, birthdays, or reminders are created or stored

## Impact

- **Affected specs:** `care-calendar`
- **Affected code areas:**
  - Calendar item click handling on mobile (`CareCalendar.vue`, `CalendarWeekView.vue`, `CalendarMonthView.vue`)
  - New bottom sheet component for calendar item detail reveal (e.g., `CalendarItemSheet.vue`)
  - Conditional navigation logic based on viewport size
  - Data mapping to populate the sheet consistently for all calendar item types (events, birthdays, reminders)
- **User impact:**
  - Reduced disruption and improved clarity on mobile
  - Faster understanding of calendar item details without context loss
  - More pastorally aligned interaction on mobile devices
- **Risk level:** Low
  - No breaking changes to data structures or APIs
  - Existing detail pages remain available and functional
  - Progressive enhancement pattern—desktop behaviour unchanged
  - Mobile users can still access full detail pages if needed

## Outcome

This change allows pastors to remain grounded in the calendar while gaining immediate understanding of events. It reinforces the calendar's role as a place of **noticing and remembrance**, rather than navigation and task execution.

The mobile calendar becomes gentler, clearer, and more pastorally aligned—supporting brief moments of awareness rather than forcing navigation.

## Success Criteria

- On mobile, tapping an **event, birthday, or reminder** displays the bottom sheet instead of navigating away
- The bottom sheet shows minimal, calm details appropriate to the tapped item type
- Essential information is displayed clearly and in pastorally appropriate language
- Users can dismiss the sheet easily to return to calendar context
- Optional navigation to full detail pages remains available but non-primary
- Desktop and tablet behaviour remains unchanged (direct navigation preserved)
- The interaction feels calm, gentle, and pastorally appropriate across all calendar item types
