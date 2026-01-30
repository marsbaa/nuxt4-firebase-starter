# Tasks: Add Care Calendar

## 1. Foundation Setup

- [x] 1.1 Create calendar event types (`app/types/calendarEvents.ts`)
- [x] 1.2 Create Firestore collection structure for calendar events
- [x] 1.3 Create `useCalendarEvents()` composable for Firestore operations
- [x] 1.4 Add Firestore security rules for calendar events

## 2. Calendar Page Structure

- [x] 2.1 Create main calendar page (`app/pages/calendar.vue`)
- [x] 2.2 Add Calendar to navigation in dashboard layout
- [x] 2.3 Create `CareCalendar.vue` main container component
- [x] 2.4 Implement view toggle (Month/Agenda)

## 3. Month View Implementation

- [x] 3.1 Create `CalendarMonthView.vue` component
- [x] 3.2 Implement month grid layout with proper date handling
- [x] 3.3 Add month navigation (previous/next)
- [x] 3.4 Implement today indicator
- [x] 3.5 Add liturgical context subtitle display

## 4. Event Display

- [x] 4.1 Create `CalendarEvent.vue` component for individual events
- [x] 4.2 Implement visual distinction for event types (color coding)
- [x] 4.3 Add event type icons
- [x] 4.4 Create calendar legend component

## 5. Agenda View Implementation

- [x] 5.1 Create `CalendarAgendaView.vue` component
- [x] 5.2 Implement chronological event list
- [x] 5.3 Add date grouping for agenda items

## 6. Focus Panel

- [x] 6.1 Create `CalendarFocusPanel.vue` sidebar component
- [x] 6.2 Implement member search filter
- [x] 6.3 Add category visibility toggles
- [x] 6.4 Add informational note about Care Notes/Reminders
- [x] 6.5 Implement filter state management

## 7. Event Creation

- [x] 7.1 Create `CalendarEventForm.vue` component
- [x] 7.2 Implement "New Event" button and modal/drawer
- [x] 7.3 Add event creation form validation
- [x] 7.4 Implement event save to Firestore

## 8. Member Milestones Integration

- [x] 8.1 Query member data for birthdays and anniversaries
- [x] 8.2 Transform member milestones into calendar events
- [x] 8.3 Implement member milestone linking to detail pages

## 9. Care Reminders Integration

- [x] 9.1 Query Care Reminders by due date for calendar display
- [x] 9.2 Display Care Reminders as read-only calendar items
- [x] 9.3 Implement Care Reminder click navigation to member pages
- [x] 9.4 Implement "Show completed reminders" toggle functionality

## 10. Care Updates Integration

- [ ] 10.1 Determine Care Update signal logic (based on Care Notes)
- [ ] 10.2 Display Care Updates as read-only calendar signals
- [ ] 10.3 Implement Care Update click navigation to member pages

## 11. Search and Navigation

- [ ] 11.1 Implement calendar event search functionality
- [ ] 11.2 Add event click handlers for navigation
- [ ] 11.3 Implement member milestone click-to-detail navigation

## 12. Visual Polish

- [ ] 12.1 Apply pastoral design aesthetic (whitespace, soft hierarchy)
- [ ] 12.2 Implement calm color palette for event types
- [ ] 12.3 Create gentle empty states
- [ ] 12.4 Add "Grace in every shared moment" tagline
- [ ] 12.5 Ensure restrained CTA styling

## 13. Responsive Design

- [ ] 13.1 Implement mobile-responsive month view
- [ ] 13.2 Implement mobile-responsive agenda view
- [ ] 13.3 Implement collapsible focus panel for mobile
- [ ] 13.4 Test on various viewport sizes

## 14. Accessibility

- [ ] 14.1 Add proper ARIA labels and roles
- [ ] 14.2 Ensure keyboard navigation
- [ ] 14.3 Verify color contrast ratios
- [ ] 14.4 Test with screen readers

## 15. Testing and Validation

- [ ] 15.1 Write unit tests for calendar composable
- [ ] 15.2 Write component tests for calendar views
- [ ] 15.3 Test event creation flow
- [ ] 15.4 Test filter functionality
- [ ] 15.5 Verify pastoral language throughout
