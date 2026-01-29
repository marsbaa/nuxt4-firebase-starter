# Proposal: Refine Member View with Care Space

## Why

The existing "View Member Details" page uses "Pastoral Notes" as a placeholder. This needs to be refined into a proper "Care Space" that aligns with the pastoral care principles—shifting from a record-oriented view to a narrative, care-centered space that helps pastors and care teams understand and continue caring for a person.

The current left panel serves primarily as an action hub. It should become a stable pastoral context column that provides quick grounding before reading care notes, supporting presence over productivity.

## What Changes

### Conceptual Shift

Move from: **"Member record with notes"**  
To: **"A living care space holding a person's ongoing story"**

### Detailed Changes

1. **Replace "Pastoral Notes" section with "Care Space"**
   - Rename and restructure the section to become the primary narrative area
   - Implement Care Notes timeline (reverse chronological)
   - Add gentle entry point for new Care Notes
   - Enable editing of Care Notes with pastorally sensitive history preservation
   - Use calm, pastoral language (e.g., "Share" instead of "Submit")

2. **Redesign Left Panel as Context Column**
   - Transform from action hub to pastoral context reference
   - Include:
     - Avatar and name
     - Basic contact details (email, phone, location)
     - Personal Journey information:
       - Date of birth and age
       - Season of life / marital status
       - Fellowship / small group
       - Emergency contact (in-case-of-need contact)
   - Reduce visual density
   - Soften call-to-action emphasis
   - Maintain Quick Actions but with less prominence

3. **Care Notes Implementation**
   - Store in Firebase Firestore (not Realtime Database) for:
     - Better ordering and pagination
     - Future visibility rules support
     - Query flexibility
   - Each note contains:
     - Long-form text content
     - Author attribution
     - Original creation timestamp
     - Edit history (previous versions preserved)
     - Date/time (visually subtle)
   - Editable by pastoral team members
   - Edit history preserved but not surfaced in main UI (available if needed)
   - No status, completion, or task semantics
   - Optimized for reading, not scanning
   - No metrics, counters, or summaries

4. **Integrate Member Information into Left Context Column**
   - Current "Member Information" card will be integrated into left context column
   - Creates unified pastoral reference on the left
   - Leaves right column exclusively for Care Space

5. **Language and Tone Updates**
   - Replace all corporate/administrative language
   - Use pastoral, person-centered terminology
   - Ensure all copy reflects: "helping care for a person" not "managing information"

6. **Remove Export PDF**
   - Export PDF functionality will be removed
   - This page is a living care space, not a reporting surface
   - Removes "Export PDF" button from header

### What Is Built in V1

**In Scope:**

- Care Space with editable Care Notes timeline
- Edit functionality with history preservation (hidden in UI by default)
- Personal Context column (integrated left panel)
- Pastoral language throughout
- Firestore data structure for Care Notes
- Pastoral team-only visibility (no member access)
- Mobile-responsive layout

**Explicitly Out of Scope (Not in V1):**

- Edit history UI display (history preserved but not shown)
- Care Reminders / task management
- Life Moments
- Visibility rules beyond pastoral team-only
- Role-based access beyond pastor/pastoral team
- PDF export or printable views
- Analytics or reporting

### What Must Stay the Same

- Route and page identity (`/members/view/[id]`)
- Core member data structure
- Authentication and permissions model
- Back navigation to members list

### What Must Be Avoided

- Task management patterns
- Status indicators and progress tracking
- Productivity language ("log", "submit", "report")
- Analytics or reporting concepts
- Metrics-driven UI elements
- Audit trail or compliance framing

## Impact

### Affected Specs

- **members-management**: MODIFIED requirements for View Member Detail page

### Affected Code

- `app/pages/members/view/[id].vue` - Significant layout refactor while preserving route, data flow, and existing integrations.
- New components:
  - `CareSpace.vue` - Care notes timeline and entry
  - `CareNote.vue` - Individual care note display with edit capability
  - `CareNoteInput.vue` - Gentle input for new care notes
  - `PersonalContext.vue` - Left column context reference
- New composable: `useCareNotes()` for Firestore operations
- Firestore collection structure: `/careNotes` with memberId references
- Security rules: Firestore rules for pastoral team-only access
- Styling updates to align with pastoral aesthetic
- Remove Export PDF button and associated functionality

### Technical Details

**Firestore Structure:**

```
/careNotes/{noteId}
  ├── memberId: string
  ├── content: string
  ├── authorId: string
  ├── authorName: string
  ├── createdAt: Timestamp
  ├── updatedAt: Timestamp
  └── history: [
      {
        content: string,
        editedAt: Timestamp,
        editedBy: string
      }
    ]
```

**Why Firestore:**

- Superior ordering and pagination (`.orderBy()`, `.limit()`)
- Better support for future visibility rules (`.where()` clauses)
- More flexible querying for future features
- Standard practice for structured, queryable collections

**Edit History Strategy:**

- Previous versions stored in `history` array field
- Each edit appends to history with: content, editedAt, editedBy
- History preserved for integrity and memory, not surfaced in main UI
- Supports pastoral value: care notes can be corrected with humility, but memory is preserved
- Future enhancement could show "edited" indicator, but not in v1

**Permissions:**

- Firestore Security Rules enforce pastoral team-only access
- No member-facing access in v1
- Read: restricted to authenticated pastoral team members
- Write: restricted to authenticated pastoral team members

### Visibility & Access (V1)

Care Notes within the Care Space are intended to be **shared only within the pastoral team**.

In v1, the system assumes that **all authenticated users are trusted pastoral carers**. As such, Care Notes are accessible to authenticated users, with the understanding that access implies pastoral responsibility and confidentiality.

This approach prioritizes early usability and continuity of care while preserving the pastoral intent of the feature. Explicit role-based permissions (e.g. pastor, associate pastor, care coordinator) will be introduced in a future phase to formally enforce this boundary without requiring changes to language, layout, or mental model.

**Pastoral Team Definition:**

- Refers to authenticated users with pastoral responsibility
- Examples: pastors, associate pastors
- Identified via authentication system (e.g., custom claim, role field in future)

### Progressive Enhancement Considerations

- Care Notes should load gracefully with skeleton states
- Mobile layout should prioritize Care Space over context column
- Maintain accessibility standards (WCAG 2.1 Level AA)
- Responsive design considerations for all viewports
- Offline support via Firestore caching (default behavior)

### Migration Approach

- Placeholder "Pastoral Notes" data will be removed (no migration needed)
- Existing member data in Firestore remains intact
- Care Notes stored in separate `/careNotes` collection
- Reference members via `memberId` field

## Success Criteria

This refinement is successful if:

> A pastor opening this page feels they are entering a quiet, trustworthy space to understand and continue caring for a person—not reviewing a record or completing work.

Key indicators:

- Language is entirely pastoral (no corporate terminology)
- Care Space is the visual focus (not actions or administrative data)
- Left context column provides grounding without cognitive overload
- Adding a Care Note feels like sharing, not reporting
- Editing a Care Note feels natural and respectful (not correcting errors in a log)
- Overall page tone is calm, respectful, and supportive of discernment
- Page feels like a living space, not a document or report
