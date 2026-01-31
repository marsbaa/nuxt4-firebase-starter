# Implementation Tasks

## 1. Data Model & Store Updates

- [x] 1.1 Update `CalendarEvent` type in [`app/types/calendarEvents.ts`](app/types/calendarEvents.ts) to include recurrence fields (recurrence type, weekly days, end condition, parent series ID)
- [x] 1.2 Add `updateEvent()` action to [`app/stores/calendarEvents.ts`](app/stores/calendarEvents.ts) with support for series scope (this/future/all)
- [x] 1.3 Add `deleteEvent()` action to [`app/stores/calendarEvents.ts`](app/stores/calendarEvents.ts) with support for series scope (this/future/all)
- [x] 1.4 Implement recurrence expansion logic in store (generate recurring event instances for display)
- [x] 1.5 Update Firestore rules to support event updates and deletes with proper authentication checks

## 2. Event Form Component

- [x] 2.1 Create [`app/components/CalendarEventForm.vue`](app/components/CalendarEventForm.vue) with form fields (title, date, time, all-day, description, recurrence)
- [x] 2.2 Implement recurrence controls (weekly day selector, end condition selector)
- [x] 2.3 Add form validation with pastoral error messaging
- [x] 2.4 Implement Add mode (create new event)
- [x] 2.5 Implement Edit mode (load existing event, show series management options for recurring events)
- [x] 2.6 Add delete functionality with gentle confirmation dialog and series scope options
- [x] 2.7 Ensure all copy uses pastoral language (no task management terminology)

## 3. Mobile Bottom Sheet Integration

- [x] 3.1 Update [`app/components/CareCalendar.vue`](app/components/CareCalendar.vue) to manage form overlay state
- [x] 3.2 Implement full-height bottom sheet for mobile (< 768px) with slide-up animation
- [x] 3.3 Render `CalendarEventForm` within bottom sheet on mobile
- [x] 3.4 Add Close action to dismiss bottom sheet
- [x] 3.5 Implement dimmed calendar background when bottom sheet is open
- [x] 3.6 Ensure bottom sheet respects safe area insets

## 4. Desktop Drawer Integration

- [x] 4.1 Implement right-side drawer panel for desktop (≥ 768px) with slide-in animation
- [x] 4.2 Render `CalendarEventForm` within drawer on desktop
- [x] 4.3 Ensure calendar remains visible in background when drawer is open
- [x] 4.4 Add Close action to dismiss drawer

## 5. Event Interaction Updates

- [ ] 5.1 Update event click handling in [`app/components/CalendarMonthView.vue`](app/components/CalendarMonthView.vue) to open Edit mode for Community Events
- [ ] 5.2 Update event click handling in [`app/components/CalendarWeekView.vue`](app/components/CalendarWeekView.vue) to open Edit mode for Community Events
- [ ] 5.3 Preserve existing bottom sheet behavior for Member Milestones and Care Reminders (navigation to member page)
- [ ] 5.4 Ensure "New Event" button opens Add mode in form overlay/drawer

## 6. Visual Design & Polish

- [ ] 6.1 Apply pastoral visual design standards (generous whitespace, calm typography, subtle colors)
- [ ] 6.2 Ensure destructive actions (Delete) are visually separated and lower emphasis
- [ ] 6.3 Style recurrence controls to be clear but unobtrusive
- [ ] 6.4 Implement gentle confirmation dialogs with pastoral copy
- [ ] 6.5 Test responsive behavior across mobile widths (320px - 767px) and desktop widths (≥ 768px)

## 7. Accessibility

- [ ] 7.1 Ensure keyboard navigation works for all form controls
- [ ] 7.2 Add appropriate ARIA labels for screen readers
- [ ] 7.3 Trap focus within overlay/drawer when open
- [ ] 7.4 Support Escape key to dismiss overlay/drawer
- [ ] 7.5 Verify color contrast meets WCAG AA standards

## 8. Testing & Validation

- [ ] 8.1 Test creating one-off events
- [ ] 8.2 Test creating weekly recurring events with end conditions
- [ ] 8.3 Test editing one-off events
- [ ] 8.4 Test editing recurring events (this occurrence / future occurrences / entire series)
- [ ] 8.5 Test deleting one-off events
- [ ] 8.6 Test deleting recurring events with all scope options
- [ ] 8.7 Verify recurrence expansion displays correctly across month/week views
- [ ] 8.8 Verify mobile bottom sheet behavior
- [ ] 8.9 Verify desktop drawer behavior
- [ ] 8.10 Validate pastoral language throughout (no task management terminology)
