# Implementation Tasks

## 1. Data Layer

- [x] 1.1 Define TypeScript interfaces for Member data model (matching RTDB structure)
- [x] 1.2 Create `useMembers.ts` composable for CRUD operations with Firebase RTDB
- [x] 1.3 Implement real-time member list fetching from `/members` path
- [x] 1.4 Create utility functions to parse "LASTNAME, FIRSTNAME" name format
- [x] 1.5 Create utility functions to calculate age from birthday string

## 2. Components

- [x] 2.1 Create `MemberAvatar.vue` component with initials display
- [x] 2.2 Create `MemberTable.vue` component for table display
- [x] 2.3 Create `MemberTableRow.vue` for individual member entries
- [x] 2.4 Create `Pagination.vue` component for navigation
- [x] 2.5 Update `AppIcon.vue` with required icons (eye, pencil, trash, location-pin, search)

## 3. Main Page

- [x] 3.1 Create `app/pages/members.vue` with layout structure
- [x] 3.2 Implement page header with title and subtitle
- [x] 3.3 Add "New Member" button with routing
- [x] 3.4 Implement search bar with debounced filtering
- [x] 3.5 Add member count display
- [x] 3.6 Integrate member table component
- [x] 3.7 Implement pagination logic
- [x] 3.8 Add action handlers (view, edit, delete with confirmation)

## 4. Styling

- [x] 4.1 Apply warm, pastoral color palette
- [x] 4.2 Implement rounded corners and soft shadows
- [x] 4.3 Style table with generous spacing
- [x] 4.4 Create hover states for interactive elements
- [x] 4.5 Ensure responsive layout for mobile/tablet

## 5. Navigation

- [ ] 5.1 Add "Members List" link to dashboard layout navigation
- [ ] 5.2 Update active state highlighting in navigation

## 6. Member Forms (Future)

- [ ] 6.1 Create member creation page/modal
- [ ] 6.2 Create member edit page/modal
- [ ] 6.3 Create member detail view page

## 7. Testing & Polish

- [ ] 7.1 Test search functionality
- [ ] 7.2 Test pagination with various data sizes
- [ ] 7.3 Verify delete confirmation works properly
- [ ] 7.4 Test responsive behavior
- [ ] 7.5 Verify accessibility (keyboard navigation, screen readers)
- [ ] 7.6 Add empty state for no members
- [ ] 7.7 Add loading state for data fetching
