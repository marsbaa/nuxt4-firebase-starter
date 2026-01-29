# Implementation Tasks: Add Care Reminders to Care Space

## 1. Data Layer

- [x] 1.1 Create Firestore collection structure for `/careReminders`
- [x] 1.2 Create `useCareReminders()` composable for Firestore operations
- [x] 1.3 Implement `addCareReminder()` method with Firestore write
- [x] 1.4 Implement `getCareReminders()` query with filtering and ordering
- [x] 1.5 Update Firestore Security Rules for authenticated-user access to Care Reminders

## 2. UI Components

- [x] 2.1 Create `CareReminder.vue` component for individual reminder display
- [x] 2.2 Create `CareReminderList.vue` component for reminder collection (max 3)
- [x] 2.3 Create `CareReminderInput.vue` component for adding new reminders
- [x] 2.4 Design visual treatment (warm background, subtle outline, low-contrast icon)

## 3. Care Space Integration

- [x] 3.1 Update `CareSpace.vue` to include Care Reminders section
- [x] 3.2 Position Care Reminders between input and timeline
- [x] 3.3 Add section heading "Care Reminders" with pastoral typography
- [x] 3.4 Implement gentle section divider and spacing

## 4. Care Reminder Input

- [x] 4.1 Implement text input with pastoral placeholder
- [x] 4.2 Add optional date picker for due date
- [x] 4.3 Implement "Add care reminder" button with pastoral styling
- [x] 4.4 Handle empty input prevention with gentle feedback
- [x] 4.5 Clear input after successful submission

## 5. Care Reminder Display

- [x] 5.1 Implement display of reminder text
- [x] 5.2 Display optional due date with calm formatting (e.g., "Jan 15")
- [x] 5.3 Display author name subtly (e.g., "Held by [Name]")
- [x] 5.4 Show only active (non-expired) reminders
- [x] 5.5 Limit display to 3 reminders maximum
- [x] 5.6 Order by: soonest due date first, undated last

## 6. Loading and Empty States

- [x] 6.1 Implement skeleton loading state for Care Reminders
- [x] 6.2 Implement empty state with pastoral language (e.g., "No care reminders yet")
- [x] 6.3 Ensure loading states use subtle pulse animation

## 7. Styling and Visual Design

- [x] 7.1 Apply warm, subtle background tint (lightest amber/beige)
- [x] 7.2 Add gentle inset or outline border
- [x] 7.3 Include small, low-contrast "remembering" icon
- [x] 7.4 Ensure no urgency colors (red, orange)
- [x] 7.5 Ensure no task indicators (checkboxes, progress bars)
- [x] 7.6 Maintain generous spacing consistent with Care Space

## 8. Accessibility

- [x] 8.1 Ensure keyboard navigation works for reminder input and display
- [x] 8.2 Add ARIA labels for screen readers
- [x] 8.3 Verify color contrast meets WCAG 2.1 Level AA standards
- [x] 8.4 Ensure focus indicators are visible on interactive elements

## 9. Responsive Design

- [x] 9.1 Ensure Care Reminders display properly on mobile viewports
- [x] 9.2 Verify touch target sizes meet 44x44px minimum
- [x] 9.3 Maintain layout order: input → reminders → timeline on mobile

## 10. Testing and Validation

- [x] 10.1 Test adding Care Reminders with and without due dates
- [x] 10.2 Test display ordering (soonest first, undated last)
- [x] 10.3 Test max 3 reminders display limit
- [x] 10.4 Test expiry logic (past dates not displayed)
- [x] 10.5 Test real-time updates when reminders are added
- [x] 10.6 Test accessibility with keyboard and screen reader
- [x] 10.7 Test responsive behavior across viewports
- [x] 10.8 Verify pastoral language throughout

## 11. Documentation

- [ ] 11.1 Update spec delta with ADDED requirements
- [ ] 11.2 Document Firestore structure in code comments
- [ ] 11.3 Update any relevant user documentation (if applicable)
