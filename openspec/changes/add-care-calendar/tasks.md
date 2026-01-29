# Tasks: Add Care Calendar

## 1. Foundation Setup

- [ ] 1.1 Create calendar event types (`app/types/calendarEvents.ts`)
- [ ] 1.2 Create Firestore collection structure for calendar events
- [ ] 1.3 Create `useCalendarEvents()` composable for Firestore operations
- [ ] 1.4 Add Firestore security rules for calendar events

## 2. Calendar Page Structure

- [ ] 2.1 Create main calendar page (`app/pages/calendar.vue`)
- [ ] 2.2 Add Calendar to navigation in dashboard layout
- [ ] 2.3 Create `CareCalendar.vue` main container component
- [ ] 2.4 Implement view toggle (Month/Agenda)

## 3. Month View Implementation

- [ ] 3.1 Create `CalendarMonthView.vue` component
- [ ] 3.2 Implement month grid layout with proper date handling
- [ ] 3.3 Add month navigation (previous/next)
- [ ] 3.4 Implement today indicator
- [ ] 3.5 Add liturgical context subtitle display

## 4. Event Display

- [ ] 4.1 Create `CalendarEvent.vue` component for individual events
- [ ] 4.2 Implement visual distinction for event types (color coding)
- [ ] 4.3 Add event type icons
- [ ] 4.4 Create calendar legend component

## 5. Agenda View Implementation

- [ ] 5.1 Create `CalendarAgendaView.vue` component
- [ ] 5.2 Implement chronological event list
- [ ] 5.3 Add date grouping for agenda items

## 6. Focus Panel

- [ ] 6.1 Create `CalendarFocusPanel.vue` sidebar component
- [ ] 6.2 Implement member search filter
- [ ] 6.3 Add category visibility toggles
- [ ] 6.4 Add informational note about Care Notes/Reminders
- [ ] 6.5 Implement filter state management

## 7. Event Creation

- [ ] 7.1 Create `CalendarEventForm.vue` component
- [ ] 7.2 Implement "New Event" button and modal/drawer
- [ ] 7.3 Add event creation form validation
- [ ] 7.4 Implement event save to Firestore

## 8. Member Milestones Integration

- [ ] 8.1 Query member data for birthdays and anniversaries
- [ ] 8.2 Transform member milestones into calendar events
- [ ] 8.3 Implement member milestone linking to detail pages

## 9. Care Reminders Integration

- [ ] 9.1 Query Care Reminders by due date for calendar display
- [ ] 9.2 Display Care Reminders as read-only calendar items
- [ ] 9.3 Implement Care Reminder click navigation to member pages
- [ ] 9.4 Implement "Show completed reminders" toggle functionality

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
