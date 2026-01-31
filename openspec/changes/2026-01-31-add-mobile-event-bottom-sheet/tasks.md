# Implementation Tasks

## 1. Create Calendar Item Bottom Sheet Component

- [x] 1.1 Create `CalendarItemSheet.vue` component with bottom sheet UI pattern
- [x] 1.2 Implement slide-up animation from bottom of screen
- [x] 1.3 Add swipe-down and tap-outside dismiss functionality
- [x] 1.4 Ensure calendar remains visible (dimmed) in background
- [x] 1.5 Add proper ARIA labels and accessibility attributes for mobile screen readers
- [x] 1.6 Support multiple item types (events, birthdays, reminders) with type detection

## 2. Implement Content Display by Type

- [x] 2.1 Create type-specific content templates for Events, Birthdays, and Reminders
- [x] 2.2 **Events**: Display title, date/time, category label, optional description
- [x] 2.3 **Birthdays/Member Milestones**: Display person's name (primary), "Birthday" or "Member Milestone" label, date (age if applicable), optional gentle descriptor
- [x] 2.4 **Reminders**: Display reminder text (primary), linked person if applicable, date context, no completion controls
- [x] 2.5 Add appropriate typography and formatting for each type
- [x] 2.6 Ensure all text follows pastoral tone guidelines (no urgency, no task language)

## 3. Add Type-Appropriate Secondary Actions

- [ ] 3.1 **Events**: Add optional "Open full details" link (not primary CTA)
- [ ] 3.2 **Birthdays/Member Milestones**: Add "Go to person" link
- [ ] 3.3 **Reminders**: Add "View in care space" link (if applicable)
- [ ] 3.4 Style all actions as subtle, secondary affordances (not dominant buttons)
- [ ] 3.5 Ensure actions are accessible and tappable on mobile
- [ ] 3.6 Do not add task-style actions (no "Complete", no checkboxes)

## 4. Update Calendar Click Handling for All Item Types

- [ ] 4.1 Add viewport detection utility (check if < 768px)
- [ ] 4.2 Update `CalendarWeekView.vue` to trigger bottom sheet on mobile tap for all item types
- [ ] 4.3 Update `CalendarMonthView.vue` to trigger bottom sheet on mobile tap for all item types
- [ ] 4.4 Preserve direct navigation behavior for desktop/tablet (≥ 768px)
- [ ] 4.5 Pass item data and type to bottom sheet component when opened
- [ ] 4.6 Implement data mapping to populate sheet consistently for events, birthdays, and reminders

## 5. Visual Design and Styling

- [ ] 5.1 Apply pastoral visual design standards (calm, generous whitespace)
- [ ] 5.2 Ensure category colors are subtle and accessible
- [ ] 5.3 Use appropriate font sizes for mobile readability
- [ ] 5.4 Add gentle backdrop overlay when sheet is open
- [ ] 5.5 Ensure bottom sheet respects safe area insets on mobile devices

## 6. Testing and Validation

- [ ] 6.1 Test on various mobile viewport sizes (320px - 767px)
- [ ] 6.2 Verify swipe-down dismiss works smoothly
- [ ] 6.3 Verify tap-outside dismiss works correctly
- [ ] 6.4 Test with all calendar item types: events, birthdays/member milestones, and reminders
- [ ] 6.5 Verify content displays correctly and pastorally for each item type
- [ ] 6.6 Verify desktop behavior unchanged for all item types (direct navigation preserved)
- [ ] 6.7 Test keyboard navigation and screen reader compatibility across all item types
- [ ] 6.8 Verify sheet animations perform smoothly on lower-end devices
- [ ] 6.9 Confirm no task-style interactions appear for reminders (no completion controls)

## 7. Documentation

- [ ] 7.1 Update component documentation for `CalendarItemSheet.vue`
- [ ] 7.2 Document mobile interaction pattern for all calendar item types in relevant code comments
- [ ] 7.3 Document content rules and display differences by type (events, birthdays, reminders)
