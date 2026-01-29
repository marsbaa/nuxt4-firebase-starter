# Care Notes Testing Guide

## Overview

This guide provides instructions for manually testing the Care Notes feature, including creating test data in Firestore and verifying the composable functionality.

## Prerequisites

Before testing, ensure:

1. ✅ Firebase project is set up
2. ✅ Firestore database is created
3. ✅ Firestore Security Rules are deployed (see [`FIRESTORE_RULES.md`](./FIRESTORE_RULES.md))
4. ✅ Development server is running (`npm run dev`)
5. ✅ You are signed in to the application

## Test 1: Manually Create Test Care Notes in Firestore

### 1.1 Navigate to Firestore Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database**
4. Click **"Start collection"** or select existing data

### 1.2 Create Care Notes Collection

If the `careNotes` collection doesn't exist yet:

1. Click **"Start collection"**
2. Enter collection ID: `careNotes`
3. Click **"Next"**

### 1.3 Add Test Care Note Documents

Add multiple test notes with the following structure:

**Document 1**:

- Document ID: Auto-ID
- Fields:
  ```
  memberId: string = "your-test-member-id"
  content: string = "First care note for testing. This member requested prayer for their family situation."
  authorId: string = "your-user-id"
  authorName: string = "Test Pastor"
  createdAt: timestamp = (click "Add field" → select "timestamp" → use current time)
  updatedAt: timestamp = (same as createdAt)
  history: array = [] (empty array)
  ```

**Document 2** (different timestamp):

- Document ID: Auto-ID
- Fields:
  ```
  memberId: string = "your-test-member-id" (same as Document 1)
  content: string = "Second care note - Follow up conversation about job search. They are feeling hopeful."
  authorId: string = "your-user-id"
  authorName: string = "Test Pastor"
  createdAt: timestamp = (earlier time, e.g., yesterday)
  updatedAt: timestamp = (same as createdAt)
  history: array = [] (empty array)
  ```

**Document 3** (for another member):

- Document ID: Auto-ID
- Fields:
  ```
  memberId: string = "different-member-id"
  content: string = "Care note for a different member. Testing query filtering."
  authorId: string = "your-user-id"
  authorName: string = "Test Pastor"
  createdAt: timestamp = (current time)
  updatedAt: timestamp = (same as createdAt)
  history: array = [] (empty array)
  ```

### 1.4 Find Your Member ID

To find a valid member ID:

1. Navigate to `/members` in your app
2. Click on a member to view their detail page
3. The URL will be `/members/view/{member-id}`
4. Copy the member ID from the URL
5. Use this ID for the `memberId` field in test notes

## Test 2: Verify Real-time Loading

### 2.1 Basic Display Test

1. Navigate to a member detail page: `/members/view/{member-id}`
2. Verify the page loads without errors
3. Check browser console for any errors
4. Verify care notes appear in the timeline (if you created test notes for this member)

### 2.2 Real-time Updates Test

1. Open the member detail page in one browser tab
2. Open Firestore Console in another tab
3. Add a new care note document for the same member
4. **Expected**: The new note should appear in the timeline automatically without refreshing
5. Edit an existing note's content in Firestore
6. **Expected**: The updated content should appear automatically

### 2.3 Empty State Test

1. Navigate to a member who has no care notes
2. **Expected**: An empty state message should display (once implemented in Task 2)
3. No errors should appear in console

## Test 3: Test Add Note Functionality

### 3.1 Basic Add Test

1. Navigate to a member detail page
2. Open the care notes input area (once implemented in Task 2)
3. Enter text: "Test care note from UI"
4. Click the "Share" button
5. **Expected**:
   - Success toast appears: "Care note added"
   - Input field clears
   - New note appears at the top of the timeline
   - Note has current timestamp and your name as author

### 3.2 Empty Input Validation

1. Navigate to care notes input
2. Try to submit without entering text
3. **Expected**:
   - Submission prevented
   - Gentle message appears: "Please share a care note"
   - Input field gains focus

### 3.3 Verify in Firestore

1. After adding a note through the UI
2. Open Firestore Console
3. Navigate to `careNotes` collection
4. Find the newly created document
5. **Expected**:
   - `memberId` matches the current member
   - `content` matches what you entered
   - `authorId` matches your user ID
   - `authorName` matches your display name
   - `createdAt` and `updatedAt` are set
   - `history` is an empty array

## Test 4: Test Update Note with History Preservation

### 4.1 Basic Update Test

1. Navigate to a member detail page with existing care notes
2. Click "Edit" on a care note (once implemented in Task 2)
3. Modify the content: "Updated care note content"
4. Click "Save"
5. **Expected**:
   - Success toast: "Care note updated"
   - Note returns to read-only state
   - Updated content displays in timeline

### 4.2 Verify History Preservation

1. After editing a note
2. Open Firestore Console
3. Find the edited document
4. **Expected**:
   - `content` field has the new content
   - `updatedAt` timestamp is updated
   - `createdAt` timestamp remains unchanged
   - `history` array has one entry with:
     - `content`: original text
     - `editedAt`: timestamp
     - `editedBy`: your user ID
     - `editedByName`: your display name

### 4.3 Multiple Edits Test

1. Edit the same note again with different content
2. Save changes
3. Check Firestore Console
4. **Expected**:
   - `history` array now has two entries
   - Each entry preserves its respective previous content
   - History entries are in chronological order

### 4.4 Cancel Edit Test

1. Click "Edit" on a care note
2. Modify the content
3. Click "Cancel"
4. **Expected**:
   - Edit mode closes
   - Original content remains displayed
   - No changes saved to Firestore

## Test 5: Test Query Filtering

### 5.1 Member-specific Notes

1. Create notes for Member A
2. Create notes for Member B
3. View Member A's detail page
4. **Expected**: Only Member A's notes appear
5. View Member B's detail page
6. **Expected**: Only Member B's notes appear

### 5.2 Order Verification

1. View a member with multiple care notes
2. **Expected**:
   - Notes appear in reverse chronological order (newest first)
   - Most recent note is at the top
   - Older notes follow in descending order

## Test 6: Test Permissions Enforcement

### 6.1 Unauthenticated Access Test

1. Sign out of the application
2. Try to navigate to `/members/view/{member-id}`
3. **Expected**:
   - Redirected to login page by auth middleware
   - No care notes data fetched

### 6.2 Firestore Rules Test (Console)

1. Open Firestore Console
2. Navigate to **Rules** tab
3. Click **"Rules Playground"**

**Test: Unauthenticated Read**

- Simulate: Unauthenticated
- Operation: Get
- Path: `/careNotes/test-note-id`
- **Expected**: ❌ Permission denied

**Test: Authenticated Read**

- Simulate: Authenticated (any UID)
- Operation: Get
- Path: `/careNotes/test-note-id`
- **Expected**: ✅ Allowed

### 6.3 Console Error Test

1. While signed in, open browser DevTools Console
2. Navigate to a member detail page
3. Check for permission errors
4. **Expected**: No permission denied errors

## Test 7: Test Error Handling

### 7.1 Network Error Simulation

1. Open DevTools
2. Navigate to **Network** tab
3. Set throttling to "Offline"
4. Navigate to a member detail page
5. **Expected**:
   - Loading state appears
   - Error toast appears: "Unable to load care notes. Please try again."
   - No crashes

### 7.2 Empty Content Submission

1. Try to submit an empty care note
2. **Expected**:
   - Toast appears: "Please share a care note"
   - Error is thrown and caught
   - No Firestore write attempted

## Test 8: Test Loading States

### 8.1 Initial Load

1. Navigate to a member detail page
2. Observe the loading behavior
3. **Expected**:
   - `loading` state is `true` initially
   - Skeleton screens or loading indicator displays (once implemented)
   - After data loads, `loading` becomes `false`

### 8.2 Network Throttling Test

1. Open DevTools
2. Set Network throttling to "Slow 3G"
3. Navigate to a member detail page
4. **Expected**:
   - Loading state is visible for longer
   - No flashing or layout shift
   - Smooth transition to loaded state

## Test 9: Test Composable Directly (Developer)

### 9.1 Browser Console Test

1. Navigate to a member detail page
2. Open browser console
3. Verify no errors during composable initialization

### 9.2 Code-level Test (Optional)

Create a minimal test page:

```vue
<script setup lang="ts">
const memberId = ref("your-test-member-id");
const { notes, loading, error, addNote, updateNote } = useCareNotes(memberId);

// Log state changes
watch(notes, (newNotes) => {
  console.log("Notes updated:", newNotes);
});

watch(loading, (isLoading) => {
  console.log("Loading state:", isLoading);
});

watch(error, (err) => {
  if (err) console.error("Error state:", err);
});
</script>

<template>
  <div>
    <p>Loading: {{ loading }}</p>
    <p>Error: {{ error }}</p>
    <p>Notes count: {{ notes.length }}</p>
    <pre>{{ notes }}</pre>
  </div>
</template>
```

## Common Issues & Troubleshooting

### Issue: Notes not appearing

**Check**:

- Is the member ID correct?
- Are the security rules deployed?
- Is the user authenticated?
- Check browser console for errors
- Verify Firestore collection name is `careNotes`

### Issue: Real-time updates not working

**Check**:

- Is the snapshot listener properly set up?
- Check browser console for WebSocket connection errors
- Verify Firestore is in correct mode (not offline)

### Issue: Permission denied errors

**Check**:

- Are security rules correctly deployed?
- Is the user authenticated?
- Check `request.auth` in Firestore Rules Playground

### Issue: History not preserving

**Check**:

- Is `arrayUnion` being used correctly?
- Is the previous content being read before update?
- Check Firestore Console to verify history structure

## Success Criteria

✅ Task 1.8 is complete when:

1. Care notes can be created manually in Firestore
2. Notes appear in the member detail page timeline
3. Real-time updates work (adding/editing in Firestore reflects in UI)
4. Query filtering works (only shows notes for current member)
5. Notes are ordered correctly (newest first)
6. No console errors during normal operation

✅ Task 1.9 is complete when:

1. Unauthenticated users cannot access care notes
2. Firestore Rules Playground tests pass
3. Auth middleware redirects unauthenticated users
4. No permission errors for authenticated users

## Next Steps

After completing these tests:

1. Document any issues found
2. Mark Task 1.8 and 1.9 as complete in `tasks.md`
3. Commit changes with message: `feat(careNotes): implement data structure and composable`
4. Proceed to Task 2: New Components implementation
