# Firestore Security Rules for Care Notes

## Overview

This document outlines the Firestore Security Rules required for the Care Space feature. These rules enforce pastoral team-only access to Care Notes.

## V1 Rules (Simplified - Authenticated Users Only)

In version 1, we use a simplified permissions model that assumes all authenticated users are trusted pastoral team members. This provides a balance between security and ease of implementation for the initial release.

### Complete Rules

Add these rules to your Firestore Security Rules in the Firebase Console:

**Path**: Firebase Console > Firestore Database > Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Care Notes: Pastoral team-only access (v1 - authenticated users)
    // All authenticated users are assumed to be pastoral team members
    match /careNotes/{noteId} {
      // Any authenticated user can read care notes
      allow read: if request.auth != null;

      // Any authenticated user can create care notes
      allow create: if request.auth != null
                    && request.resource.data.authorId == request.auth.uid
                    && request.resource.data.keys().hasAll(['memberId', 'content', 'authorId', 'authorName', 'createdAt', 'updatedAt', 'history'])
                    && request.resource.data.history is list
                    && request.resource.data.content is string
                    && request.resource.data.content.size() > 0;

      // Any authenticated user can update care notes
      // Updates must preserve the original memberId, authorId, and createdAt
      allow update: if request.auth != null
                    && request.resource.data.memberId == resource.data.memberId
                    && request.resource.data.authorId == resource.data.authorId
                    && request.resource.data.createdAt == resource.data.createdAt
                    && request.resource.data.content is string
                    && request.resource.data.content.size() > 0;

      // Any authenticated user can delete care notes
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

- Any authenticated user can view care notes
- Unauthenticated requests are rejected
- Assumes all authenticated users are pastoral team members

#### Create Access

```javascript
allow create: if request.auth != null
              && request.resource.data.authorId == request.auth.uid
              && request.resource.data.keys().hasAll(['memberId', 'content', 'authorId', 'authorName', 'createdAt', 'updatedAt', 'history'])
              && request.resource.data.history is list
              && request.resource.data.content is string
              && request.resource.data.content.size() > 0;
```

- User must be authenticated
- Author ID must match the authenticated user's ID (prevents impersonation)
- All required fields must be present
- History must be an array
- Content must be a non-empty string

#### Update Access

```javascript
allow update: if request.auth != null
              && request.resource.data.memberId == resource.data.memberId
              && request.resource.data.authorId == resource.data.authorId
              && request.resource.data.createdAt == resource.data.createdAt
              && request.resource.data.content is string
              && request.resource.data.content.size() > 0;
```

- User must be authenticated
- Member ID cannot be changed (notes stay with the member)
- Author ID cannot be changed (preserves original author)
- Creation timestamp cannot be changed (maintains chronological integrity)
- Content must be a non-empty string

#### Delete Access

```javascript
allow delete: if request.auth != null;
```

- Any authenticated user can delete care notes
- Assumes pastoral team context where deletion is a rare, deliberate action

## Testing the Rules

### Test Unauthenticated Access (Should Fail)

In the Firebase Console, use the Rules Playground to test:

**Simulate**: Unauthenticated user  
**Operation**: Get  
**Path**: `/careNotes/test-note-id`

**Expected Result**: ❌ Permission denied

### Test Authenticated Read (Should Succeed)

**Simulate**: Authenticated user (any UID)  
**Operation**: Get  
**Path**: `/careNotes/test-note-id`

**Expected Result**: ✅ Allowed

### Test Authenticated Create (Should Succeed)

**Simulate**: Authenticated user (UID: `test-user-123`)  
**Operation**: Create  
**Path**: `/careNotes/new-note-id`  
**Data**:

```json
{
  "memberId": "member-123",
  "content": "This is a test care note",
  "authorId": "test-user-123",
  "authorName": "Test User",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "history": []
}
```

**Expected Result**: ✅ Allowed

### Test Create with Wrong Author ID (Should Fail)

**Simulate**: Authenticated user (UID: `test-user-123`)  
**Operation**: Create  
**Path**: `/careNotes/new-note-id`  
**Data**:

```json
{
  "memberId": "member-123",
  "content": "This is a test care note",
  "authorId": "different-user-456",
  "authorName": "Test User",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "history": []
}
```

**Expected Result**: ❌ Permission denied

## Future Enhancements (V2+)

In future versions, we will add explicit role-based access control:

### Custom Claims Approach

Add custom claims to Firebase Authentication tokens:

```javascript
match /careNotes/{noteId} {
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

match /careNotes/{noteId} {
  allow read, write: if request.auth != null && isPastoralTeam();
}
```

These enhancements will provide more granular control without requiring changes to the UI, language, or mental model of the Care Space feature.

## Deployment Checklist

- [ ] Copy the V1 rules to Firebase Console
- [ ] Test unauthenticated access rejection
- [ ] Test authenticated user read access
- [ ] Test authenticated user create access
- [ ] Test authenticated user update access
- [ ] Test that authorId and memberId cannot be changed
- [ ] Monitor Firebase logs for permission errors
- [ ] Document any custom role requirements for future versions

## Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Playground](https://firebase.google.com/docs/rules/simulator)
- [Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
