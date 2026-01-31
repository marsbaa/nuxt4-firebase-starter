# Implementation Tasks

## 1. Create Event Detail Bottom Sheet Component

- [ ] 1.1 Create `EventDetailSheet.vue` component with bottom sheet UI pattern
- [ ] 1.2 Implement slide-up animation from bottom of screen
- [ ] 1.3 Add swipe-down and tap-outside dismiss functionality
- [ ] 1.4 Ensure calendar remains visible (dimmed) in background
- [ ] 1.5 Add proper ARIA labels and accessibility attributes for mobile screen readers

## 2. Implement Event Content Display

- [ ] 2.1 Add event title display with appropriate typography
- [ ] 2.2 Add date and time formatting (or date-only for all-day events)
- [ ] 2.3 Add event category badge display (Community Gathering, Member Milestone, etc.)
- [ ] 2.4 Add optional description text with appropriate line clamping
- [ ] 2.5 For member-related events, prominently display person's name
- [ ] 2.6 Ensure all text follows pastoral tone guidelines (no urgency, task language)

## 3. Add Secondary Navigation Actions

- [ ] 3.1 Add optional "Open full details" link/button (not primary CTA)
- [ ] 3.2 For member milestones, add "Go to person" link
- [ ] 3.3 Style actions as subtle, secondary affordances (not dominant buttons)
- [ ] 3.4 Ensure actions are accessible and tappable on mobile

## 4. Update Calendar Event Click Handling

- [ ] 4.1 Add viewport detection utility (check if < 768px)
- [ ] 4.2 Update `CalendarWeekView.vue` to trigger bottom sheet on mobile tap
- [ ] 4.3 Update `CalendarMonthView.vue` to trigger bottom sheet on mobile tap
- [ ] 4.4 Preserve direct navigation behavior for desktop/tablet (≥ 768px)
- [ ] 4.5 Pass event data to bottom sheet component when opened

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
- [ ] 6.4 Test with different event types (community events, birthdays, reminders)
- [ ] 6.5 Verify desktop behavior unchanged (direct navigation preserved)
- [ ] 6.6 Test keyboard navigation and screen reader compatibility
- [ ] 6.7 Verify sheet animations perform smoothly on lower-end devices

## 7. Documentation

- [ ] 7.1 Update component documentation for `EventDetailSheet.vue`
- [ ] 7.2 Document mobile interaction pattern in relevant code comments
