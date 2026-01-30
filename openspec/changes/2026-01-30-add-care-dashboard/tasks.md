# Implementation Tasks: Add Care Dashboard

## 1. Opening Moment Component

- [ ] 1.1 Create `DashboardOpeningMoment.vue` component
- [ ] 1.2 Implement contextual greeting based on time of day
- [ ] 1.3 Add reflective question or gentle prompt
- [ ] 1.4 Style with pastoral design language (generous whitespace, warm colors)
- [ ] 1.5 Ensure responsive layout for mobile

## 2. Person Search Integration

- [ ] 2.1 Create `DashboardPersonSearch.vue` component or integrate `MemberSearchInput.vue`
- [ ] 2.2 Position search prominently in center of dashboard
- [ ] 2.3 Wire up navigation to Care Space on person selection
- [ ] 2.4 Ensure search functionality works with existing member data
- [ ] 2.5 Add pastoral language and placeholder text
- [ ] 2.6 Style with minimal, calm aesthetic

## 3. Holding in Mind (Care Reminders Surface)

- [ ] 3.1 Create `DashboardHoldingInMind.vue` component
- [ ] 3.2 Query upcoming Care Reminders (next 5, ordered by date)
- [ ] 3.3 Display person's name, reminder context, and date
- [ ] 3.4 Link each reminder to the person's Care Space
- [ ] 3.5 Implement empty state with supportive language
- [ ] 3.6 Style as a gentle list (no checkboxes, no task affordances)
- [ ] 3.7 Add section heading "Holding in mind" or similar pastoral language
- [ ] 3.8 Ensure responsive layout

## 4. Shared Rhythms (Calendar Events Surface)

- [ ] 4.1 Create `DashboardSharedRhythms.vue` component
- [ ] 4.2 Query upcoming Calendar Events (next 3, within 7 days)
- [ ] 4.3 Display event name, date, and type
- [ ] 4.4 Link to full Care Calendar
- [ ] 4.5 Implement empty state with supportive language
- [ ] 4.6 Style as a gentle list with calendar context
- [ ] 4.7 Add section heading "Shared rhythms" or "Coming together"
- [ ] 4.8 Ensure responsive layout

## 5. Dashboard Page Refactor

- [ ] 5.1 Refactor `app/pages/dashboard.vue` to implement new Care Dashboard design
- [ ] 5.2 Implement single-column, vertically-stacked layout
- [ ] 5.3 Integrate all dashboard components in order: Opening Moment → Search → Holding in Mind → Shared Rhythms
- [ ] 5.4 Ensure generous spacing between sections (3-4rem)
- [ ] 5.5 Center content with comfortable max-width (max-w-3xl or max-w-4xl)
- [ ] 5.6 Remove any existing generic dashboard content
- [ ] 5.7 Ensure pastoral language throughout
- [ ] 5.8 Add loading states for async components

## 6. Styling and Visual Polish

- [ ] 6.1 Verify all components use pastoral color palette
- [ ] 6.2 Ensure generous whitespace throughout
- [ ] 6.3 Verify soft, minimal visual weight (subtle shadows, gentle borders)
- [ ] 6.4 Test responsive layout on mobile, tablet, and desktop
- [ ] 6.5 Verify keyboard navigation works for all interactive elements
- [ ] 6.6 Check accessibility (WCAG 2.1 AA standards)

## 7. Integration Testing

- [ ] 7.1 Test navigation from dashboard to Care Spaces
- [ ] 7.2 Test navigation from dashboard to Care Calendar
- [ ] 7.3 Verify Care Reminders data integration works correctly
- [ ] 7.4 Verify Calendar Events data integration works correctly
- [ ] 7.5 Test person search navigation
- [ ] 7.6 Test empty states for reminders and events
- [ ] 7.7 Test loading states
- [ ] 7.8 Verify dashboard remains default post-login route

## 8. Documentation and Cleanup

- [ ] 8.1 Update any relevant comments or documentation
- [ ] 8.2 Remove unused code or components
- [ ] 8.3 Verify no console errors or warnings
- [ ] 8.4 Final visual review against pastoral care principles
