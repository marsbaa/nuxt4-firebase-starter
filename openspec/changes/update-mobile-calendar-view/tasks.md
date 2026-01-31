# Implementation Tasks

## 1. Create Weekly View Component

- [x] 1.1 Create `CalendarWeekView.vue` component with vertical day layout
- [x] 1.2 Implement week range calculation and navigation
- [x] 1.3 Add event grouping by date within the week
- [x] 1.4 Display event details (name, time, contextual label) with appropriate typography
- [x] 1.5 Style for calm, spacious mobile reading experience
- [x] 1.6 Add navigation controls (prev week, next week, week range display)

## 2. Implement View Toggle and Responsive Logic

- [x] 2.1 Add view toggle UI (Week / Month) with mobile-first visibility
- [x] 2.2 Implement viewport detection in `CareCalendar.vue` (< 768px = mobile)
- [x] 2.3 Default to weekly view on mobile, monthly view on desktop
- [x] 2.4 Persist view preference in component state
- [x] 2.5 Handle view switching smoothly with transition

## 3. Adapt Month View for Mobile Secondary

- [x] 3.1 Adjust `CalendarMonthView.vue` for simplified mobile display
- [x] 3.2 Ensure month view remains accessible but non-dominant on mobile
- [x] 3.3 Maintain full desktop experience unchanged

## 4. Update Calendar Event Rendering

- [ ] 4.1 Ensure all event types render correctly in weekly view
- [ ] 4.2 Display contextual labels (Communal Rhythm, Member Milestone, etc.)
- [ ] 4.3 Preserve click navigation to member pages or event details
- [ ] 4.4 Maintain read-only status for Care Reminders and Care Updates

## 5. Test Mobile Experience

- [ ] 5.1 Test on various mobile viewport sizes (320px - 767px)
- [ ] 5.2 Verify all event types display correctly in weekly view
- [ ] 5.3 Test week navigation and date transitions
- [ ] 5.4 Verify view toggle works smoothly
- [ ] 5.5 Test with empty states and full calendars

## 6. Accessibility and Polish

- [ ] 6.1 Ensure keyboard navigation works in weekly view
- [ ] 6.2 Add appropriate ARIA labels for mobile view toggle
- [ ] 6.3 Test screen reader announcements for weekly view
- [ ] 6.4 Verify touch target sizes meet mobile standards (44x44px minimum)
- [ ] 6.5 Ensure color contrast maintained in mobile views

## 7. Integration and Coordination

- [ ] 7.1 Coordinate with Focus Panel behavior on mobile
- [ ] 7.2 Ensure search and filtering work across both views
- [ ] 7.3 Test with calendar event creation flow
- [ ] 7.4 Verify all existing calendar functionality preserved
