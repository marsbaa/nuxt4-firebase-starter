# Implementation Tasks: Care Space Refinement

## 1. Data Structure & Composable (Firestore)

- [x] 1.1 Document Care Notes schema in project documentation (Firestore structure)
- [x] 1.2 Create TypeScript interface for CareNote type (with history field)
- [x] 1.3 Set up Firestore collection `/careNotes` structure
- [x] 1.4 Implement Firestore Security Rules for authenticated-user access (v1 simplified)
- [x] 1.5 Implement `useCareNotes()` composable with Firestore snapshot listener
- [x] 1.6 Add CRUD operations (addNote, updateNote with history preservation)
- [x] 1.7 Implement error handling and loading states
- [x] 1.8 Test composable with Firestore (create test care notes manually)
- [x] 1.9 Test permissions enforcement (verify unauthenticated access rejected)

## 2. New Components

- [x] 2.1 Create `CareNote.vue` component (individual note display with inline edit)
- [x] 2.2 Add edit mode toggle to `CareNote.vue` (textarea, Save/Cancel buttons)
- [x] 2.3 Create `CareNoteList.vue` component (timeline with loading/empty states)
- [x] 2.4 Create `CareNoteInput.vue` component (gentle input with auto-expand textarea)
- [x] 2.5 Create `CareSpace.vue` component (orchestrates notes list and input)
- [x] 2.6 Create `PersonalContext.vue` component (refactored left column)
- [x] 2.7 Test each component in isolation with mock data
- [x] 2.8 Test edit functionality in `CareNote.vue` (edit mode, save, cancel)

## 3. Page Refactoring

- [x] 3.1 Backup current `[id].vue` implementation (git commit before changes)
- [x] 3.2 Remove "Export PDF" button from page header
- [x] 3.3 Remove Export PDF functionality and related code
- [x] 3.4 Restructure page layout to use new components
- [x] 3.5 Replace placeholder notes with real Care Notes from Firestore via `useCareNotes()`
- [x] 3.6 Integrate `PersonalContext.vue` for left column
- [x] 3.7 Integrate `CareSpace.vue` for right column
- [x] 3.8 Remove old "Pastoral Notes" and "Member Information" card implementations
- [x] 3.9 Update page title and metadata if needed

## 4. Language & Copy Updates

- [x] 4.1 Replace "Pastoral Notes" with "Care Space"
- [x] 4.2 Replace "Member Information" with "Personal Journey" (in left context)
- [x] 4.3 Update "+ Add Note" to "Share a care note"
- [x] 4.4 Update "By [Author]" to "[Author] shared" or "With [Author]"
- [x] 4.5 Update "ACTIVE MEMBER" badge to "Member since [date]" or similar
- [x] 4.6 Review and update all button labels, placeholders, and tooltips
- [x] 4.7 Update aria-labels for accessibility
- [x] 4.8 Update toast messages (e.g., "Care note added" not "Note logged successfully")

## 5. Styling & Visual Hierarchy

- [x] 5.1 Update Care Space card styling (larger heading, prominent position)
- [x] 5.2 Soften left column visual density (spacing, separators)
- [x] 5.3 Reduce prominence of Quick Actions (smaller heading, subtle buttons)
- [x] 5.4 Style CareNote component with subtle date/time and author
- [x] 5.5 Style CareNote edit mode (inline textarea, Save/Cancel buttons)
- [x] 5.6 Style CareNoteInput with gentle, inviting design
- [x] 5.7 Ensure consistent use of warm, pastoral color palette
- [x] 5.8 Test visual hierarchy: Care Space should be obvious focal point

## 6. Responsive Behavior

- [x] 6.1 Test desktop layout (>1024px) - two-column as designed
- [x] 6.2 Test tablet layout (768px-1024px) - single column, Care Space first
- [x] 6.3 Test mobile layout (<768px) - single column, optimized spacing
- [x] 6.4 Ensure touch targets meet 44x44px minimum on mobile
- [x] 6.5 Test auto-expanding textarea on mobile devices (input and edit mode)
- [x] 6.6 Test edit functionality on mobile (inline edit, buttons)
- [x] 6.7 Verify no horizontal scroll on any viewport size

## 7. Accessibility

- [x] 7.1 Keyboard navigation: Tab through page elements in logical order
- [x] 7.2 Ensure all interactive elements have visible focus indicators
- [x] 7.3 Test with screen reader (VoiceOver on macOS or NVDA/JAWS on Windows)
- [x] 7.4 Verify ARIA labels and roles are correct
- [x] 7.5 Check color contrast ratios (4.5:1 for text, 3:1 for large text)
- [x] 7.6 Test with keyboard-only navigation
- [x] 7.7 Run automated accessibility audit (axe DevTools or Lighthouse)

## 8. Real-time & Performance

- [ ] 8.1 Test real-time updates: Add note in one browser tab, verify it appears in another
- [ ] 8.2 Test real-time updates: Edit note in one tab, verify it updates in another
- [ ] 8.3 Test with realistic data volume (50+ care notes)
- [ ] 8.4 Test edit history preservation (verify history array populated correctly)
- [ ] 8.5 Measure page load time (should remain under 2 seconds)
- [ ] 8.6 Monitor Firestore read/write operations in console
- [ ] 8.7 Implement query limits (e.g., `.limit(50)`) if needed
- [ ] 8.8 Test loading states and skeleton screens

## 9. Error Handling

- [ ] 9.1 Handle network errors gracefully (show toast, don't crash)
- [ ] 9.2 Handle Firestore permission errors (unauthenticated user rejection)
- [ ] 9.3 Handle empty input submission (validate non-empty content)
- [ ] 9.4 Handle edit failures (conflict resolution, optimistic updates)
- [ ] 9.5 Handle missing member data gracefully
- [ ] 9.6 Test error states with mock errors
- [ ] 9.7 Test unauthenticated access scenarios (verify rejection)

## 10. Testing & QA

- [ ] 10.1 Manual QA on Chrome, Firefox, Safari
- [ ] 10.2 Manual QA on iOS (Safari) and Android (Chrome)
- [ ] 10.3 Test with real pastoral user (if possible)
- [ ] 10.4 Gather feedback on language and tone
- [ ] 10.5 Verify all placeholder data is removed
- [ ] 10.6 Verify Export PDF functionality is completely removed
- [ ] 10.7 Test edit functionality thoroughly (inline edit, history preservation)
- [ ] 10.8 Test back navigation to members list

## 11. Documentation

- [ ] 11.1 Update README with Care Space concept explanation
- [ ] 11.2 Document Care Notes Firestore structure for team (including history approach)
- [ ] 11.3 Document Firestore Security Rules rationale
- [ ] 11.4 Document pastoral team-only visibility model
- [ ] 11.5 Add inline code comments for complex logic (especially edit history)
- [ ] 11.6 Update any relevant project documentation
- [ ] 11.7 Add JSDoc comments to composable and key components

## 12. Spec Updates

- [ ] 12.1 Review and finalize delta spec for members-management
- [ ] 12.2 Run `openspec validate refine-member-view-care-space --strict`
- [ ] 12.3 Fix any validation errors
- [ ] 12.4 Ensure all scenarios have proper `#### Scenario:` format
- [ ] 12.5 Request approval before merging

## 13. Deployment & Monitoring

- [ ] 13.1 Create feature branch: `git checkout -b refine-member-view-care-space`
- [ ] 13.2 Commit implementation with conventional commits (feat, fix, docs, etc.)
- [ ] 13.3 Push branch and create pull request
- [ ] 13.4 Address code review feedback
- [ ] 13.5 Merge to main after approval
- [ ] 13.6 Monitor Firestore usage after deployment (reads, writes, storage)
- [ ] 13.7 Monitor Firestore Security Rules effectiveness (rejected unauthenticated attempts)
- [ ] 13.8 Monitor user feedback and error logs
- [ ] 13.9 Monitor edit history array sizes for performance concerns

## 14. Archive

- [ ] 14.1 After successful deployment, archive the change
- [ ] 14.2 Run `openspec archive refine-member-view-care-space`
- [ ] 14.3 Verify archived change validation passes
- [ ] 14.4 Commit archive with message: `docs: archive openspec change refine-member-view-care-space`
- [ ] 14.5 Clean up feature branch
