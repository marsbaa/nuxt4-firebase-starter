# Implementation Tasks: Add Care Dashboard

## 1. Opening Moment Component

- [x] 1.1 Create `DashboardOpeningMoment.vue` component
- [x] 1.2 Implement contextual greeting based on time of day
- [x] 1.3 Add reflective question or gentle prompt
- [x] 1.4 Style with pastoral design language (generous whitespace, warm colors)
- [x] 1.5 Ensure responsive layout for mobile

## 2. Person Search Integration

- [x] 2.1 Create `DashboardPersonSearch.vue` component or integrate `MemberSearchInput.vue`
- [x] 2.2 Position search prominently in center of dashboard
- [x] 2.3 Wire up navigation to Care Space on person selection
- [x] 2.4 Ensure search functionality works with existing member data
- [x] 2.5 Add pastoral language and placeholder text
- [x] 2.6 Style with minimal, calm aesthetic

## 3. Holding in Mind (Care Reminders Surface)

- [x] 3.1 Create `DashboardHoldingInMind.vue` component
- [x] 3.2 Query upcoming Care Reminders (next 5, ordered by date)
- [x] 3.3 Display person's name, reminder context, and date
- [x] 3.4 Link each reminder to the person's Care Space
- [x] 3.5 Implement empty state with supportive language
- [x] 3.6 Style as a gentle list (no checkboxes, no task affordances)
- [x] 3.7 Add section heading "Holding in mind" or similar pastoral language
- [x] 3.8 Ensure responsive layout

## 4. Shared Rhythms (Calendar Events Surface)

- [x] 4.1 Create `DashboardSharedRhythms.vue` component
- [x] 4.2 Query upcoming Calendar Events (next 3, within 7 days)
- [x] 4.3 Display event name, date, and type
- [x] 4.4 Link to full Care Calendar
- [x] 4.5 Implement empty state with supportive language
- [x] 4.6 Style as a gentle list with calendar context
- [x] 4.7 Add section heading "Shared rhythms" or "Coming together"
- [x] 4.8 Ensure responsive layout

## 5. Dashboard Page Refactor

- [x] 5.1 Refactor `app/pages/dashboard.vue` to implement new Care Dashboard design
- [x] 5.2 Implement single-column, vertically-stacked layout
- [x] 5.3 Integrate all dashboard components in order: Opening Moment → Search → Holding in Mind → Shared Rhythms
- [x] 5.4 Ensure generous spacing between sections (3-4rem)
- [x] 5.5 Center content with comfortable max-width (max-w-3xl or max-w-4xl)
- [x] 5.6 Remove any existing generic dashboard content
- [x] 5.7 Ensure pastoral language throughout
- [x] 5.8 Add loading states for async components

## 6. Styling and Visual Polish

- [x] 6.1 Verify all components use pastoral color palette
- [x] 6.2 Ensure generous whitespace throughout
- [x] 6.3 Verify soft, minimal visual weight (subtle shadows, gentle borders)
- [x] 6.4 Test responsive layout on mobile, tablet, and desktop
- [x] 6.5 Verify keyboard navigation works for all interactive elements
- [x] 6.6 Check accessibility (WCAG 2.1 AA standards)

## 7. Integration Testing

- [x] 7.1 Test navigation from dashboard to Care Spaces
- [x] 7.2 Test navigation from dashboard to Care Calendar
- [x] 7.3 Verify Care Reminders data integration works correctly
- [x] 7.4 Verify Calendar Events data integration works correctly
- [x] 7.5 Test person search navigation
- [x] 7.6 Test empty states for reminders and events
- [x] 7.7 Test loading states
- [x] 7.8 Verify dashboard remains default post-login route

## 8. Documentation and Cleanup

- [x] 8.1 Update any relevant comments or documentation
- [x] 8.2 Remove unused code or components
- [x] 8.3 Verify no console errors or warnings
- [x] 8.4 Final visual review against pastoral care principles
