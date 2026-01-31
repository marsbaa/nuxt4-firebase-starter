# Proposal: Add Calendar Event Management

## Why

The Care Calendar currently supports one-off Community Events only, without ability to edit or delete them once created. This creates two problems:

1. **Weekly church rhythms cannot be represented** — Lord's Day services, Wednesday Bible Study, and other recurring gatherings require manual re-entry each week
2. **Calendar maintenance is impossible** — Events with errors or changed details become permanent clutter, undermining trust in the calendar as a reliable awareness surface

These limitations prevent the calendar from serving its intended purpose: to support communal rhythm awareness and gentle stewardship of shared time.

## What Changes

This proposal adds robust Event management capabilities to the Care Calendar, maintaining pastoral framing and calm interaction patterns across mobile and desktop.

### 1. Recurring Events

Add support for recurring Community Events:

- Weekly recurrence with selectable day(s) of the week
- Optional end conditions:
  - Never ends
  - Ends on a specific date
- Monthly recurrence (v2 — noted but not required for initial implementation)

**Framing**: Recurring events represent communal rhythms, not schedules to enforce.

### 2. Edit Events

Enable editing of existing Community Events:

- Title, description, date & time, all-day flag
- Recurrence settings (when applicable)

For recurring events, provide scope options:

- Edit this occurrence only
- Edit this and future occurrences
- Edit entire series

### 3. Delete Events

Enable deletion of Community Events with pastoral safety:

- Delete single one-off event
- For recurring events, provide scope options:
  - Delete this occurrence
  - Delete this and future occurrences
  - Delete entire series

Include gentle confirmation copy that avoids alarming language.

### 4. Add/Edit Surfaces (Mobile + Desktop)

Define how event forms appear across devices:

**Mobile (< 768px)**

- Full-height bottom sheet (overlay) with Close action
- Single-column, thumb-friendly form layout
- Sticky primary action button at bottom (Add Event / Save Changes)
- Destructive actions (Delete) visually separated and lower emphasis

**Desktop (≥ 768px)**

- Right-side drawer panel (calendar remains visible in background)
- Same form content with adapted spacing and width
- Destructive actions visually separated and lower emphasis

### 5. Form Structure

Event forms (both Add and Edit) should include:

- Event title (required)
- Date + start time (end time optional; do not require precision)
- All-day toggle
- Notes/description (optional) with helper text "Visible to the care team"
- Repeats toggle with recurrence controls (weekly day selection, end condition)
- Primary action: "Add Event" or "Save Changes"
- Secondary action: "Cancel"
- Edit mode only: Series management + delete actions in separated section

## Pastoral Framing

Why this matters:

- **Recurring rhythms are central to church life** — Weekly services, prayer gatherings, and communal rhythms should be represented faithfully without repetitive data entry
- **Edit/delete keeps the calendar trustworthy** — Ability to correct errors and update details preserves the calendar as a reliable awareness surface
- **Calm overlays preserve presence** — Bottom sheets (mobile) and drawers (desktop) keep users anchored in the calendar, reducing cognitive load
- **These features support stewardship** — The calendar becomes a surface for "holding shared time in mind," not managing tasks or enforcing schedules

## Non-Goals / Scope Boundaries

This proposal does NOT include:

- RSVP or attendance tracking
- Notifications or reminders for events
- Assignments or delegation of events
- Turning the calendar into an operational scheduler
- Member-specific event creation (Member Milestones and Care Reminders remain managed elsewhere)

Focus remains on correctness, stewardship, and trustworthy communal rhythm awareness.

## Impact

**Affected specs:**

- `care-calendar` (new requirements for recurring events, edit, delete, form interactions)

**Affected code:**

- [`app/types/calendarEvents.ts`](app/types/calendarEvents.ts) — Add recurrence fields to CalendarEvent type
- [`app/stores/calendarEvents.ts`](app/stores/calendarEvents.ts) — Add edit/delete actions, recurrence expansion logic
- [`app/components/CalendarEventForm.vue`](app/components/CalendarEventForm.vue) — New component for add/edit form
- [`app/components/CareCalendar.vue`](app/components/CareCalendar.vue) — Integration of form overlay/drawer
- [`app/components/CalendarMonthView.vue`](app/components/CalendarMonthView.vue) — Event click handling for edit mode
- [`app/components/CalendarWeekView.vue`](app/components/CalendarWeekView.vue) — Event click handling for edit mode
- Firestore rules and data model updates

**Acceptance Criteria:**

- Users can create weekly recurring events and see them appear correctly on the calendar
- Users can edit and delete one-off Community Events
- Users can edit recurring events with clear scope choices (this occurrence / future occurrences / entire series)
- Users can delete recurring events with clear scope choices
- Mobile uses a full-height bottom sheet overlay; desktop uses a right-side drawer; both preserve calendar context
- All interactions use pastoral language and calm visual design
- No task management or urgency patterns are introduced
