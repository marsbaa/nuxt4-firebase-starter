# Design Document: Care Space Refinement

## Context

The existing View Member Details page (`/members/view/[id]`) has a placeholder "Pastoral Notes" section that needs to be refined into a proper Care Space. This redesign represents a critical alignment with the pastoral care principles established in [`PASTORAL_CARE_PRINCIPLES.md`](../../PASTORAL_CARE_PRINCIPLES.md).

The page currently emphasizes actions and member data equally. The refinement shifts emphasis to the narrative Care Space while maintaining essential context in a quieter, reference-oriented left panel.

### Current Architecture

- Two-column layout (320px left, fluid right)
- Left panel: Avatar + contact info + Quick Actions card
- Right panel: Placeholder Pastoral Notes + Member Information card
- Placeholder notes with hardcoded data
- No real Care Notes data structure

### Design Constraints

- Must align with [`PASTORAL_CARE_PRINCIPLES.md`](../../PASTORAL_CARE_PRINCIPLES.md)
- Firebase Firestore for Care Notes (queryable, structured data)
- Nuxt 4 + Vue 3 Composition API
- Tailwind CSS for styling
- Must maintain existing pastoral aesthetic (warm, calm, spacious)
- Accessibility: WCAG 2.1 Level AA
- Pastoral team-only visibility (no member access in v1)

## Goals / Non-Goals

### Goals

1. Transform page from administrative record to care-centered narrative space
2. Establish Care Space as primary visual and conceptual element
3. Create stable pastoral context column that supports without overwhelming
4. Implement real Care Notes data structure with edit capability and history preservation
5. Ensure language, tone, and visual hierarchy align with pastoral principles
6. Maintain responsive behavior and accessibility standards
7. Enforce pastoral team-only visibility for Care Notes

### Non-Goals

- Not adding task management or reminder features (future work)
- Not implementing Life Moments (separate future capability)
- Not implementing PDF export (removed from page entirely)
- Not changing member data structure
- Not adding analytics or metrics
- Not surfacing edit history in UI (v1—preserved but hidden)
- Not implementing role-based access beyond pastoral team-only

## Decisions

### Decision 1: Care Space as Primary Focus

**What**: Position Care Space as the dominant visual element in the right column, with Care Notes timeline taking precedence over other information.

**Why**:

- Aligns with pastoral mental model: "What care is happening?"
- Care notes represent the living, shared story—the core purpose of the page
- Administrative information (member details) should support, not compete with, the narrative

**Alternatives Considered**:

- Equal prominence for Care Space and Member Information: Rejected—dilutes focus
- Member Information first, Care Space second: Rejected—inverts priority

**Implementation**:

- Care Space card appears first in right column
- Larger heading treatment ("Care Space" vs "Member Information")
- More vertical space allocated to Care Notes
- Visual hierarchy through typography, spacing, and color

---

### Decision 2: Integrate Member Information into Left Context Column

**What**: Move the current "Member Information" card from right column into the left context column, creating a unified pastoral context reference.

**Why**:

- Reduces right column to single focus: Care Space
- Creates left column as stable, reference-oriented context
- Reduces vertical scrolling in right column
- Supports mental model of "grounding before reading notes"
- More efficient use of horizontal space

**Alternatives Considered**:

- Keep Member Information in right column, just soften it: Rejected—still competes for attention
- Create three columns: Rejected—overly complex, harder to make responsive

**Implementation**:

- Restructure left column to include:
  1. Avatar + Name (current)
  2. Contact Details (current)
  3. Personal Journey section (new grouping)
     - Date of Birth & Age
     - Marital Status
     - Small Group / Fellowship
     - Emergency Contact
  4. Quick Actions (current, visually softened)
- Use subtle visual separators between sections
- Maintain generous spacing

---

### Decision 3: Care Notes Data Structure (Firestore)

**What**: Store Care Notes in a dedicated Firestore collection with member references and edit history.

**Structure**:

```
/careNotes/{noteId}
  ├── memberId: string (indexed)
  ├── content: string
  ├── authorId: string
  ├── authorName: string
  ├── createdAt: Timestamp
  ├── updatedAt: Timestamp
  └── history: array [
      {
        content: string,
        editedAt: Timestamp,
        editedBy: string,
        editedByName: string
      }
    ]
```

**Why Firestore (not RTDB)**:

- **Better ordering and pagination**: `.orderBy('createdAt', 'desc').limit(50)` is cleaner and more performant
- **Future visibility rules**: Easier to implement `.where('visibility', '==', 'team')` queries
- **Query flexibility**: Supports complex filtering for future features
- **Standard for structured collections**: Firestore is better suited for queryable, structured data
- **Offline caching**: Built-in offline support without extra configuration

**Why Separate Collection**:

- Clean separation of concerns (members vs care activity)
- Easier to query all notes for a member
- Better indexing and performance for timeline queries
- Supports future multi-member note references if needed

**Edit History Approach**:

- When note is edited, previous content is appended to `history` array
- Each history entry includes: content, editedAt timestamp, editedBy ID, editedByName
- Original `createdAt` never changes (preserves chronological integrity)
- `updatedAt` reflects most recent edit
- History preserved for memory and integrity, but not surfaced in v1 UI

**Why This History Strategy Aligns with Pastoral Care**:

- **Humility**: Allows correction without shame ("I can refine my note")
- **Memory**: Preserves original context if needed later
- **Trust**: No audit trail framing—just quiet preservation
- **Continuity**: Maintains care narrative without erasure

**Alternatives Considered**:

- Store in RTDB nested under members: Rejected—RTDB doesn't handle ordering/pagination well
- No edit history: Rejected—pastors need ability to refine notes with integrity
- Separate document per edit: Rejected—overly complex, harder to query
- Versioning visible in UI: Rejected for v1—adds noise, not ready to design sensitively

**Implementation**:

- Use Firestore `collection('careNotes').doc()` to generate unique noteId
- Query notes via `collection('careNotes').where('memberId', '==', id).orderBy('createdAt', 'desc').limit(50)`
- Display in reverse chronological order (latest first)
- Real-time snapshot listener updates timeline automatically
- On edit: append to `history` array, update `content` and `updatedAt`

---

### Decision 4: Gentle Care Note Input Design

**What**: Implement a calm, single-field input for adding Care Notes with pastoral language.

**Design**:

- Large textarea with generous padding
- Placeholder: "Share a care note…" or "Add to the care story…"
- Submit button labeled "Share" (not "Submit", "Log", or "Add")
- No required fields or validation beyond non-empty
- Auto-expanding textarea
- Success feedback: Gentle toast "Care note added" (not "Success!" or "Logged")

**Why**:

- Aligns with pastoral language (sharing vs. logging)
- Reduces friction for adding narrative content
- Avoids form-like, administrative feel
- Supports spontaneous, reflective note-taking

**Alternatives Considered**:

- Modal dialog for adding notes: Rejected—adds unnecessary friction
- Rich text editor: Rejected—over-engineered for current need, adds complexity
- Multiple fields (type, category, etc.): Rejected—introduces task management semantics

**Implementation**:

- Component: `CareNoteInput.vue`
- Auto-focus on click, expand on focus
- `v-model` bound to local state
- On submit: write to Firestore, clear input, show toast
- Composable: `useCareNotes()` for CRUD operations

---

### Decision 5: Typography and Language Updates

**What**: Comprehensive review and update of all copy to align with pastoral principles.

**Changes**:
| Current | Updated | Rationale |
|---------|---------|-----------|
| "Pastoral Notes" | "Care Space" | More inclusive, narrative-focused |
| "Member Information" | "Personal Journey" | Person-centered, less administrative |
| "Quick Actions" | "Care Intentions" or keep "Quick Actions" | Softer framing (discuss with stakeholders) |
| "+ Add Note" | "Share a care note" | Pastoral language |
| "By [Author]" | "With [Author]" or "[Author] shared" | Collaborative tone |
| "ACTIVE MEMBER" badge | "Member since [date]" | Less status-focused |

**Why**: Language shapes perception. Corporate language undermines pastoral purpose.

**Implementation**:

- Update all hardcoded strings in template
- Review console.log messages (should be pastoral too)
- Update button aria-labels for accessibility

---

### Decision 6: Component Architecture

**What**: Extract reusable components for maintainability and clarity.

**New Components**:

1. **`CareSpace.vue`**
   - Props: `memberId`, `memberName`
   - Manages Care Notes timeline and input
   - Orchestrates data loading and real-time updates
   - Contains `CareNoteInput` and `CareNoteList`

2. **`CareNoteList.vue`**
   - Props: `notes[]`, `loading`, `empty`
   - Renders timeline of Care Notes
   - Handles loading skeleton and empty states
   - Each note rendered by `CareNote.vue`

3. **`CareNote.vue`**
   - Props: `note { id, content, authorName, createdAt, authorId, updatedAt }`
   - Displays single care note with formatting
   - Shows subtle date/time and author
   - Includes inline edit capability (toggle edit mode)
   - Emits: `@note-updated`
   - Edit mode: textarea with "Save" and "Cancel" buttons

4. **`CareNoteInput.vue`**
   - Props: `memberId`
   - Emits: `@note-added`
   - Handles note creation with gentle UI
   - Auto-expanding textarea
   - Calm submit interaction

5. **`PersonalContext.vue`** (Refactor of left panel)
   - Props: `member`
   - Unified left column context
   - Sections: Avatar, Contact, Personal Journey, Actions
   - Visually calm and reference-oriented

**Why**:

- Single Responsibility Principle
- Easier testing and maintenance
- Reusable for potential future views
- Clearer code organization

**Alternatives Considered**:

- Keep everything in `[id].vue`: Rejected—file too large, harder to maintain
- More granular components (e.g., separate `CareNoteAvatar`, `CareNoteDate`): Rejected—over-engineered

**Implementation**:

- Create in `app/components/` directory
- Use Vue 3 Composition API with `<script setup>`
- Auto-imported via Nuxt conventions
- Maintain existing styling conventions (scoped styles, Tailwind utilities)

---

### Decision 7: Remove Export PDF Functionality

**What**: Remove the "Export PDF" button and all associated PDF generation functionality from the member detail page.

**Why**:

- **This is a living care space**, not a reporting surface
- PDF export implies document-oriented thinking (records, printouts, archives)
- Contradicts pastoral principle: presence over productivity
- Care notes should be read in context, not extracted as standalone documents
- Reduces complexity and maintenance burden

**Alternatives Considered**:

- Keep PDF export but redesign it: Rejected—still frames page as a record/document
- Make PDF export optional/hidden: Rejected—still exists, still implies wrong mental model

**Implementation**:

- Remove "Export PDF" button from page header
- Remove any PDF generation logic (if implemented)
- Remove PDF-related dependencies
- No migration needed—feature simply disappears

**Pastoral Rationale**:

- Care is ongoing, not archived
- Context matters—notes should be read alongside member info and care timeline
- Reduces temptation to treat care space as administrative record

---

### Decision 8: Pastoral Team-Only Visibility

**What**: Care Notes are only viewable and editable by members of the pastoral team. No member-facing access in v1.

**Why**:

- **Trust and confidentiality**: Care notes contain sensitive pastoral observations
- **Professional care context**: Notes are for pastoral team communication, not personal records
- **Simplifies v1**: Avoids complex role and permission logic
- **Aligns with pastoral practice**: Care teams need private space for discernment and coordination

**V1 Permissions Approach**:

Care Notes within the Care Space are intended to be **shared only within the pastoral team**.

In v1, the system assumes that **all authenticated users are trusted pastoral carers**. As such, Care Notes are accessible to authenticated users, with the understanding that access implies pastoral responsibility and confidentiality.

This approach:

- Prioritizes early usability and continuity of care
- Preserves the pastoral intent of the feature
- Trusts the authentication boundary as the access boundary

Explicit role-based permissions (e.g. pastor, associate pastor, care coordinator) will be introduced in a future phase to formally enforce this boundary without requiring changes to language, layout, or mental model.

**Permissions Model (V1)**:

- **Authenticated Users** (trusted pastoral team):
  - Can view all care notes
  - Can add new care notes
  - Can edit their own care notes (and potentially others', to be determined)
- **Unauthenticated Users**:
  - No access to care notes
  - Cannot view member detail pages

**Implementation**:

- Firestore Security Rules enforce authenticated-user-only read/write
- Example rule (V1 simplified):
  ```
  match /careNotes/{noteId} {
    allow read, write: if request.auth != null;
  }
  ```
- Future: Add role/claim checks (e.g., `request.auth.token.role == 'pastor'`)

**Future Considerations** (Not in v1):

- Explicit role-based access (pastor, associate pastor, care coordinator, deacon)
- Member-viewable care notes (with different visibility levels)
- Note-level visibility flags
- Custom claims or role fields to enforce pastoral team membership

---

### Decision 9: Composable for Care Notes Operations (Firestore)

**What**: Create `useCareNotes()` composable for all Care Notes CRUD operations with Firestore.

**API**:

```typescript
export function useCareNotes(memberId: Ref<string> | string) {
  const notes = ref<CareNote[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  // Real-time subscription
  const subscribe = () => {
    /* Firestore snapshot listener */
  };

  // CRUD operations
  const addNote = async (content: string) => {
    /* Add to Firestore */
  };
  const updateNote = async (noteId: string, content: string) => {
    /* Edit with history */
  };
  const deleteNote = async (noteId: string) => {
    /* Future, if needed */
  };

  // Lifecycle
  onMounted(subscribe);

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
  };
}
```

**Why**:

- Centralizes data logic
- Reusable across components
- Easier to test
- Follows Nuxt/Vue conventions
- Supports real-time updates via Firestore snapshot listeners

**Implementation**:

- File: `app/composables/useCareNotes.ts`
- Use Firestore SDK from `useFirebase()` composable
- Handle errors gracefully with `useToast()` for user feedback
- Auto-unsubscribe on unmount
- `updateNote` appends to history array before updating content
- Enforce pastoral team-only access via Firestore security rules

**Edit Implementation Detail**:

```typescript
const updateNote = async (noteId: string, newContent: string) => {
  const noteRef = doc(db, "careNotes", noteId);
  const currentNote = await getDoc(noteRef);
  const currentData = currentNote.data();

  await updateDoc(noteRef, {
    history: arrayUnion({
      content: currentData.content,
      editedAt: serverTimestamp(),
      editedBy: currentUser.id,
      editedByName: currentUser.name,
    }),
    content: newContent,
    updatedAt: serverTimestamp(),
  });
};
```

---

### Decision 10: Mobile Responsive Strategy

**What**: Adjust layout priority for mobile viewports to emphasize Care Space.

**Breakpoint Strategy**:

- **Desktop (>1024px)**: Current two-column layout
- **Tablet (768px - 1024px)**: Switch to single column, Care Space first, then context
- **Mobile (<768px)**: Single column, Care Space first, context collapsed or accordion

**Why**:

- Care Space is the primary content—should be first on mobile
- Context column is reference material—can be secondary or collapsible
- Reduces scroll fatigue on mobile

**Implementation**:

- Use CSS Grid with `@media` queries
- Flex-direction changes for responsive stacking
- Maintain accessibility and touch target sizes (min 44x44px)
- Test on actual mobile devices

---

## Risks / Trade-offs

### Risk 1: Care Notes Data Migration

**Risk**: If Care Notes need to be migrated from placeholder to real structure, there may be data loss or confusion.  
**Mitigation**: Current implementation uses hardcoded placeholder data—no real data exists, so no migration needed. Future: document schema clearly for team.

### Risk 2: Left Column Density

**Risk**: Integrating Member Information into left context column could make it visually dense.  
**Mitigation**:

- Use generous spacing between sections
- Subtle visual separators (not heavy borders)
- Consider collapsible sections for non-essential info
- Test with real content to assess density

### Risk 3: Performance with Many Care Notes

**Risk**: Timeline with hundreds of notes could cause performance issues.  
**Mitigation**:

- Implement pagination or infinite scroll (future enhancement)
- Load most recent 20-50 notes initially
- Provide "Load more" interaction
- Monitor Firebase read costs

### Risk 4: Real-time Updates Overhead

**Risk**: Real-time Firestore listeners for Care Notes could increase Firebase usage and costs.  
**Mitigation**:

- Use `.limit(50)` query to reduce data transfer
- Monitor usage via Firebase console
- Firestore caching reduces redundant reads
- Document best practices for team
- Consider polling as fallback if costs become concern

### Risk 5: Edit History Array Growth

**Risk**: History array could grow large for frequently edited notes, impacting read/write performance.  
**Mitigation**:

- Monitor history array sizes in production
- Consider capping history length (e.g., keep last 10 edits) in future
- History stored in same document—no additional read cost for timeline view
- If needed, move old history to separate subcollection (future optimization)

---

## Migration Plan

### Phase 1: Component Development (Low Risk)

1. Create new components (`CareSpace`, `CareNote`, `CareNoteInput`, etc.)
2. Create `useCareNotes()` composable
3. Test components in isolation with mock data
4. Review with stakeholders for language/tone approval

### Phase 2: Data Structure Setup (Medium Risk)

1. Set up Firestore collection structure for Care Notes
2. Implement Firestore Security Rules for pastoral team-only access
3. Manually create test care notes for a few members in Firestore
4. Test real-time snapshot listeners with live data
5. Verify data persistence, query performance, and edit history preservation
6. Test permissions enforcement (reject unauthorized access)

### Phase 3: Page Refactoring (High Risk)

1. Remove Export PDF button and functionality from page
2. Refactor `[id].vue` to use new components
3. Replace hardcoded placeholder data with real Care Notes from Firestore
4. Integrate PersonalContext component for left column
5. Add edit functionality to CareNote component
6. Update all language/copy per decision 5
7. Test responsive behavior thoroughly
8. Test edit functionality and history preservation

### Phase 4: Testing & Refinement (Medium Risk)

1. Manual QA across devices (desktop, tablet, mobile)
2. Accessibility audit (keyboard nav, screen readers)
3. Performance testing with realistic data volumes
4. Gather feedback from pastoral users
5. Iterate on language/design based on feedback

### Rollback Plan

- Feature flag implementation (optional): serve old version if critical issues found
- Keep old component code in version control for quick rollback
- Monitor Firebase errors and user feedback closely post-launch

---

## Open Questions

1. **Quick Actions Placement**: Should "Quick Actions" stay in left column or move elsewhere?
   - Recommendation: Keep in left column but visually soften (smaller heading, less prominent buttons)

2. **Care Note Edit Permissions**: Can pastoral team members edit each other's notes, or only their own?
   - Recommendation for v1: Allow editing own notes only. Future: discuss team editing policy.

3. **Author Attribution**: Should notes show full name or just initials/avatar?
   - Recommendation: Full name for clarity and accountability within care teams.

4. **Empty State for Care Notes**: What message for members with no care notes?
   - Recommendation: "No care notes yet. Share the first note to begin the care story."

5. **Timestamp Display**: Relative ("2 days ago") or absolute ("Oct 12, 2023")?
   - Recommendation: Absolute for long-term reference. Relative time can be confusing after weeks/months.

6. **Edit History UI**: Should v1 show an "edited" indicator, or keep edits completely transparent?
   - Recommendation for v1: No indicator—preserve seamless narrative. Future: consider subtle "edited" note.

**Resolved Questions:**

- **Care Note Editing**: ✅ Yes, editable with history preservation (Decision 3)
- **Export PDF**: ✅ Removed entirely (Decision 7)
- **Visibility**: ✅ Pastoral team-only in v1 (Decision 8)

---

## Success Metrics

This design is successful if:

1. **Qualitative**: Pastoral users report page feels like "entering a care space" not "reviewing a record"
2. **Qualitative**: Language and tone receive positive feedback from care teams
3. **Technical**: Page load time remains under 2 seconds with 50 care notes
4. **Technical**: Zero accessibility violations in automated testing
5. **Technical**: Mobile layout usable without horizontal scroll or layout breaks
6. **Behavioral**: Users add Care Notes naturally without training or documentation

## Next Steps

1. **Review and Approval**: Share this design doc with stakeholders for feedback
2. **Prototype**: Create clickable prototype with new components (optional)
3. **Implementation**: Follow migration plan phases
4. **Documentation**: Update relevant README and onboarding materials with new terminology
5. **Training**: Brief care team on new Care Space concept and usage
