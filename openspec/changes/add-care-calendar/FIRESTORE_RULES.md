# Firestore Security Rules for Calendar Events

## Overview

This document outlines the Firestore Security Rules required for the Care Calendar feature. These rules enforce pastoral team-only access to Community Gathering events while maintaining existing access patterns for Care Reminders and Member data.

## Calendar Events Collection Rules

### Complete Rules for `calendarEvents` Collection

Add these rules to your Firestore Security Rules in the Firebase Console alongside existing rules:

**Path**: Firebase Console > Firestore Database > Rules

```javascript
// Calendar Events: Community Gatherings (user-created events)
// All authenticated users are assumed to be pastoral team members
match /calendarEvents/{eventId} {
  // Any authenticated user can read calendar events
  allow read: if request.auth != null;

  // Any authenticated user can create calendar events
  allow create: if request.auth != null
                && request.resource.data.createdBy == request.auth.uid
                && request.resource.data.keys().hasAll(['title', 'date', 'createdBy', 'createdByName', 'createdAt'])
                && request.resource.data.title is string
                && request.resource.data.title.size() > 0
                && request.resource.data.date is timestamp;

  // Any authenticated user can update calendar events
  // Updates must preserve the original author and creation timestamp
  allow update: if request.auth != null
                && request.resource.data.createdBy == resource.data.createdBy
                && request.resource.data.createdAt == resource.data.createdAt
                && request.resource.data.title is string
                && request.resource.data.title.size() > 0;

  // Any authenticated user can delete calendar events
  allow delete: if request.auth != null;
}
```

### Rule Breakdown

#### Read Access

```javascript
allow read: if request.auth != null;
```

- Any authenticated user can view calendar events
- Unauthenticated requests are rejected
- Assumes all authenticated users are pastoral team members

#### Create Access

```javascript
allow create: if request.auth != null
              && request.resource.data.createdBy == request.auth.uid
              && request.resource.data.keys().hasAll(['title', 'date', 'createdBy', 'createdByName', 'createdAt'])
              && request.resource.data.title is string
              && request.resource.data.title.size() > 0
              && request.resource.data.date is timestamp;
```

- User must be authenticated
- Creator ID must match the authenticated user's ID (prevents impersonation)
- All required fields must be present: title, date, createdBy, createdByName, createdAt
- Title must be a non-empty string
- Date must be a valid timestamp

#### Update Access

```javascript
allow update: if request.auth != null
              && request.resource.data.createdBy == resource.data.createdBy
              && request.resource.data.createdAt == resource.data.createdAt
              && request.resource.data.title is string
              && request.resource.data.title.size() > 0;
```

- User must be authenticated
- Creator ID cannot be changed (preserves original creator)
- Creation timestamp cannot be changed (maintains chronological integrity)
- Title must be a non-empty string

#### Delete Access

```javascript
allow delete: if request.auth != null;
```

- Any authenticated user can delete calendar events
- Assumes pastoral team context where deletion is a rare, deliberate action

## Related Collections

The Care Calendar also reads from existing collections. Ensure these rules are in place:

### Care Reminders

Care Reminders are displayed on the calendar as read-only items. The existing `careReminders` collection rules should allow authenticated users to read reminders:

```javascript
match /careReminders/{reminderId} {
  allow read: if request.auth != null;
  // ... existing create, update rules
}
```

### Members

Member Milestones (birthdays, anniversaries) are derived from the `members` collection. The existing rules should allow authenticated users to read member data:

```javascript
match /members/{memberId} {
  allow read: if request.auth != null;
  // ... existing create, update, delete rules
}
```

## Testing the Rules

### Test Unauthenticated Access (Should Fail)

In the Firebase Console, use the Rules Playground to test:

**Simulate**: Unauthenticated user  
**Operation**: Get  
**Path**: `/calendarEvents/test-event-id`

**Expected Result**: ❌ Permission denied

### Test Authenticated Read (Should Succeed)

**Simulate**: Authenticated user (any UID)  
**Operation**: Get  
**Path**: `/calendarEvents/test-event-id`

**Expected Result**: ✅ Allowed

### Test Authenticated Create (Should Succeed)

**Simulate**: Authenticated user (UID: `test-user-123`)  
**Operation**: Create  
**Path**: `/calendarEvents/new-event-id`  
**Data**:

```json
{
  "title": "Community Picnic",
  "date": "timestamp",
  "description": "Annual church picnic at Memorial Park",
  "createdBy": "test-user-123",
  "createdByName": "Test User",
  "createdAt": "timestamp"
}
```

**Expected Result**: ✅ Allowed

### Test Create with Wrong Creator ID (Should Fail)

**Simulate**: Authenticated user (UID: `test-user-123`)  
**Operation**: Create  
**Path**: `/calendarEvents/new-event-id`  
**Data**:

```json
{
  "title": "Community Picnic",
  "date": "timestamp",
  "createdBy": "different-user-456",
  "createdByName": "Test User",
  "createdAt": "timestamp"
}
```

**Expected Result**: ❌ Permission denied

### Test Update Preserving Creator (Should Succeed)

**Simulate**: Authenticated user (any UID)  
**Operation**: Update  
**Path**: `/calendarEvents/existing-event-id`  
**Existing Data**:

```json
{
  "title": "Community Picnic",
  "date": "timestamp",
  "createdBy": "test-user-123",
  "createdByName": "Test User",
  "createdAt": "timestamp"
}
```

**New Data**:

```json
{
  "title": "Community Picnic (Updated)",
  "date": "new-timestamp",
  "description": "Updated description",
  "createdBy": "test-user-123",
  "createdByName": "Test User",
  "createdAt": "timestamp"
}
```

**Expected Result**: ✅ Allowed

### Test Update Changing Creator (Should Fail)

**Simulate**: Authenticated user (any UID)  
**Operation**: Update  
**Path**: `/calendarEvents/existing-event-id`  
**Attempting to change**: `createdBy` or `createdAt`

**Expected Result**: ❌ Permission denied

## Data Integrity Considerations

### Indexes

Firestore will automatically create indexes for common queries. If you encounter index errors, create these composite indexes:

1. **Calendar Events by Date**
   - Collection: `calendarEvents`
   - Fields: `date` (Ascending)
   - Query scope: Collection

### Data Validation

The composable layer provides additional validation:

- Event titles are trimmed and must not be empty
- Dates must be valid Date objects before conversion to Timestamp
- Optional descriptions are trimmed or set to null
- Creator information is automatically populated from authenticated user

## Security Model

### V1 Rules (Current Implementation)

In version 1, we use a simplified permissions model that assumes all authenticated users are trusted pastoral team members. This aligns with the existing pattern used for Care Notes and Care Reminders.

**Key Principles:**

- All authenticated users can read all calendar events
- All authenticated users can create community gathering events
- Member Milestones and Care Reminders are read-only on the calendar
- Creator identity is enforced at creation time
- Creator and creation timestamp are immutable

### Future Enhancements (V2+)

In future versions, we may add explicit role-based access control:

#### Custom Claims Approach

```javascript
match /calendarEvents/{eventId} {
  allow read, write: if request.auth != null
                     && request.auth.token.role in ['pastor', 'associate_pastor', 'care_coordinator'];
}
```

#### Event Visibility Controls

Future versions might include:

- Private vs. public events
- Specific team visibility
- Member-specific event permissions

## Deployment Checklist

- [ ] Copy the calendar events rules to Firebase Console
- [ ] Verify existing `careReminders` read rules are in place
- [ ] Verify existing `members` read rules are in place
- [ ] Test unauthenticated access rejection
- [ ] Test authenticated user read access
- [ ] Test authenticated user create access
- [ ] Test authenticated user update access
- [ ] Test that createdBy and createdAt cannot be changed
- [ ] Monitor Firebase logs for permission errors
- [ ] Document any custom role requirements for future versions

## Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Playground](https://firebase.google.com/docs/rules/simulator)
- [Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
