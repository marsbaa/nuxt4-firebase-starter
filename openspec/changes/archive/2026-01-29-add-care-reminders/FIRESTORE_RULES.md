# Firestore Security Rules for Care Reminders

## Overview

This document outlines the Firestore Security Rules required for the Care Reminders feature. These rules enforce pastoral team-only access to Care Reminders, mirroring the Care Notes permissions model.

## V1 Rules (Simplified - Authenticated Users Only)

In version 1, we use a simplified permissions model that assumes all authenticated users are trusted pastoral team members. This provides a balance between security and ease of implementation for the initial release.

### Complete Rules

Add these rules to your existing Firestore Security Rules in the Firebase Console:

**Path**: Firebase Console > Firestore Database > Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ... existing rules for users and careNotes ...

    // Care Reminders: Pastoral team-only access (v1 - authenticated users)
    // All authenticated users are assumed to be pastoral team members
    match /careReminders/{reminderId} {
      // Any authenticated user can read care reminders
      allow read: if request.auth != null;

      // Any authenticated user can create care reminders
      allow create: if request.auth != null
                    && request.resource.data.authorId == request.auth.uid
                    && request.resource.data.keys().hasAll(['memberId', 'text', 'dueDate', 'authorId', 'authorName', 'createdAt', 'isExpired'])
                    && request.resource.data.text is string
                    && request.resource.data.text.size() > 0
                    && request.resource.data.isExpired == false
                    && (request.resource.data.dueDate == null || request.resource.data.dueDate is timestamp);

      // Any authenticated user can update care reminders (for future edit/expiry functionality)
      // Updates must preserve the original memberId, authorId, and createdAt
      allow update: if request.auth != null
                    && request.resource.data.memberId == resource.data.memberId
                    && request.resource.data.authorId == resource.data.authorId
                    && request.resource.data.createdAt == resource.data.createdAt
                    && request.resource.data.text is string
                    && request.resource.data.text.size() > 0;

      // Any authenticated user can delete care reminders (for future delete functionality)
      allow delete: if request.auth != null;
    }
  }
}
```

### Rule Breakdown

#### Read Access

```javascript
allow read: if request.auth != null;
```

- Any authenticated user can view care reminders
- Unauthenticated requests are rejected
- Assumes all authenticated users are pastoral team members

#### Create Access

```javascript
allow create: if request.auth != null
              && request.resource.data.authorId == request.auth.uid
              && request.resource.data.keys().hasAll(['memberId', 'text', 'dueDate', 'authorId', 'authorName', 'createdAt', 'isExpired'])
              && request.resource.data.text is string
              && request.resource.data.text.size() > 0
              && request.resource.data.isExpired == false
              && (request.resource.data.dueDate == null || request.resource.data.dueDate is timestamp);
```

- User must be authenticated
- Author ID must match the authenticated user's ID (prevents impersonation)
- All required fields must be present
- Text must be a non-empty string
- isExpired must be false on creation
- dueDate must be either null or a valid timestamp

#### Update Access

```javascript
allow update: if request.auth != null
              && request.resource.data.memberId == resource.data.memberId
              && request.resource.data.authorId == resource.data.authorId
              && request.resource.data.createdAt == resource.data.createdAt
              && request.resource.data.text is string
              && request.resource.data.text.size() > 0;
```

- User must be authenticated
- Member ID cannot be changed (reminders stay with the member)
- Author ID cannot be changed (preserves original author)
- Creation timestamp cannot be changed (maintains chronological integrity)
- Text must be a non-empty string
- **Note**: Update functionality is not in V1 but rules are prepared for future use

#### Delete Access

```javascript
allow delete: if request.auth != null;
```

- Any authenticated user can delete care reminders
- Assumes pastoral team context where deletion is a rare, deliberate action
- **Note**: Delete functionality is not in V1 but rules are prepared for future use

## Testing the Rules

### Test Unauthenticated Access (Should Fail)

In the Firebase Console, use the Rules Playground to test:

**Simulate**: Unauthenticated user  
**Operation**: Get  
**Path**: `/careReminders/test-reminder-id`

**Expected Result**: ❌ Permission denied

### Test Authenticated Read (Should Succeed)

**Simulate**: Authenticated user (any UID)  
**Operation**: Get  
**Path**: `/careReminders/test-reminder-id`

**Expected Result**: ✅ Allowed

### Test Authenticated Create (Should Succeed)

**Simulate**: Authenticated user (UID: `test-user-123`)  
**Operation**: Create  
**Path**: `/careReminders/new-reminder-id`  
**Data**:

```json
{
  "memberId": "member-123",
  "text": "Check in after hospital visit",
  "dueDate": null,
  "authorId": "test-user-123",
  "authorName": "Test User",
  "createdAt": "timestamp",
  "isExpired": false
}
```

**Expected Result**: ✅ Allowed

### Test Create with Due Date (Should Succeed)

**Simulate**: Authenticated user (UID: `test-user-123`)  
**Operation**: Create  
**Path**: `/careReminders/new-reminder-id`  
**Data**:

```json
{
  "memberId": "member-123",
  "text": "Follow up after anniversary",
  "dueDate": "timestamp",
  "authorId": "test-user-123",
  "authorName": "Test User",
  "createdAt": "timestamp",
  "isExpired": false
}
```

**Expected Result**: ✅ Allowed

### Test Create with Wrong Author ID (Should Fail)

**Simulate**: Authenticated user (UID: `test-user-123`)  
**Operation**: Create  
**Path**: `/careReminders/new-reminder-id`  
**Data**:

```json
{
  "memberId": "member-123",
  "text": "Check in after hospital visit",
  "dueDate": null,
  "authorId": "different-user-456",
  "authorName": "Test User",
  "createdAt": "timestamp",
  "isExpired": false
}
```

**Expected Result**: ❌ Permission denied

### Test Create with Empty Text (Should Fail)

**Simulate**: Authenticated user (UID: `test-user-123`)  
**Operation**: Create  
**Path**: `/careReminders/new-reminder-id`  
**Data**:

```json
{
  "memberId": "member-123",
  "text": "",
  "dueDate": null,
  "authorId": "test-user-123",
  "authorName": "Test User",
  "createdAt": "timestamp",
  "isExpired": false
}
```

**Expected Result**: ❌ Permission denied

## Future Enhancements (V2+)

In future versions, we will add explicit role-based access control, mirroring the Care Notes approach:

### Custom Claims Approach

Add custom claims to Firebase Authentication tokens:

```javascript
match /careReminders/{reminderId} {
  allow read, write: if request.auth != null
                     && request.auth.token.role in ['pastor', 'associate_pastor', 'care_coordinator'];
}
```

### Roles Collection Approach

Store roles in a Firestore collection:

```javascript
function isPastoralTeam() {
  return exists(/databases/$(database)/documents/users/$(request.auth.uid))
         && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['pastor', 'associate_pastor', 'care_coordinator'];
}

match /careReminders/{reminderId} {
  allow read, write: if request.auth != null && isPastoralTeam();
}
```

These enhancements will provide more granular control without requiring changes to the UI, language, or mental model of the Care Reminders feature.

## Deployment Checklist

- [ ] Copy the V1 rules to Firebase Console (add to existing rules)
- [ ] Test unauthenticated access rejection
- [ ] Test authenticated user read access
- [ ] Test authenticated user create access
- [ ] Test that authorId and memberId cannot be changed
- [ ] Test empty text validation
- [ ] Test dueDate type validation (null or timestamp)
- [ ] Monitor Firebase logs for permission errors
- [ ] Document any custom role requirements for future versions

## Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Playground](https://firebase.google.com/docs/rules/simulator)
- [Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
