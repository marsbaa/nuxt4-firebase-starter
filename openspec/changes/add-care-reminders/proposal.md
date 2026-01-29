# Proposal: Add Care Reminders to Care Space

## Why

The Care Space successfully provides a narrative area for shared care notes, helping pastors and care teams hold the ongoing story of people they care for.

However, pastoral care also requires **holding gentle follow-ups in mind**—such as remembering to check in after a visit, following up after an anniversary or event, or offering prayer at a later time. These needs are distinct from narrative care history and represent **intentions held in memory**, not tasks to be completed.

Currently, there is no pastoral way to surface these gentle reminders within the context of caring for a specific person. This gap means pastors must rely on external systems (calendars, task apps) that carry productivity semantics and do not align with the pastoral care mental model.

## What Changes

### Conceptual Introduction

Introduce **Care Reminders** as a first-class concept within the existing Care Space.

**Care Reminders** are:

- Intentional follow-ups _held in mind_
- Contextual to a specific member
- Supportive of pastoral presence
- **Not tasks, not obligations, not deadlines**

They exist to **support memory**, not enforce action.

### Detailed Changes

1. **Introduce Care Reminders into the Care Space**
   - Care Reminders appear **inside the Care Space** on the Member Detail page
   - Positioned between:
     - the "Share an update" care note input
     - and the Care Notes timeline
   - No new pages or routes introduced

2. **Display Rules**
   - Show only **active (non-expired)** Care Reminders
   - Display **up to 3 reminders maximum** on the Member Detail page
   - Ordered by:
     1. Soonest upcoming reminder date
     2. Undated reminders last
   - No scrolling or pagination in this context
   - A future Calendar feature will surface all reminders globally (explicitly out of scope for this proposal)

3. **Visual Treatment**
   - Care Reminders should be immediately recognizable as distinct from Care Notes, without demanding attention
   - Allowed differentiation:
     - Slightly warmer or tinted background
     - Gentle outline or inset edge
     - Small, low-contrast "remembering" icon (e.g., outline bookmark, folded paper, handwritten note—avoid bell or alert metaphors)
   - Prohibited:
     - Urgency colors (red, orange)
     - Task or status indicators (checkboxes, progress bars)
     - Counters or badges
     - Strong borders or shadows

4. **Interaction (V1)**
   - Ability to **add a Care Reminder** from the Member Detail page
   - Language must be pastoral (e.g., "Add a care reminder")
   - **No completion states, no checkboxes**
   - Editing and deletion may be deferred if necessary, but **creation is required** for V1

5. **Data & Storage**
   - Use **Firebase Firestore**
   - Care Reminders stored separately from Care Notes
   - Each reminder linked to a member via `memberId`
   - Support:
     - Optional due date
     - Reminder text
     - Creation metadata

6. **Permissions (V1 Simplification)**
   - Care Reminders are visible to all authenticated users
   - Role-based restrictions (pastoral-only) explicitly deferred to a later phase
   - This is a conscious v1 tradeoff aligned with current Care Notes approach
   - This mirrors the current Care Notes visibility model and avoids introducing partial role logic in v1

### What Is Built in V1

**In Scope:**

- Care Reminders display section within Care Space
- Add Care Reminder functionality
- Show up to 3 active (non-expired) reminders
- Firestore data structure for Care Reminders
- Visual distinction from Care Notes (subtle, non-urgent)
- Pastoral language throughout
- Mobile-responsive layout
- Authenticated-user visibility (pastoral team intent)

**Explicitly Out of Scope (Not in V1):**

- Edit functionality for Care Reminders
- Delete functionality for Care Reminders
- Completion or "done" states
- Calendar UI or global reminder view
- Notifications or alerts
- Analytics or reporting
- Member-facing visibility
- Life Moments or events
- Task management semantics
- Overdue indicators or urgency patterns

### What Must Stay the Same

- Route and page identity (`/members/view/[id]`)
- Core member data structure
- Care Notes timeline behavior
- Care Space primary visual focus
- Authentication and permissions model
- Pastoral tone and language conventions

### What Must Be Avoided

- Task management patterns (checkboxes, status, completion)
- Urgency-driven UI (overdue, alerts, red/orange colors)
- Productivity language ("task", "assignment", "deadline")
- Analytics or metrics (completion rates, overdue counts)
- Calendar semantics in this context (defer to future Calendar feature)
- Competing with Care Space narrative focus

## Impact

### Affected Specs

- **members-management**: ADDED requirements for Care Reminders within Care Space

### Affected Code

- `app/pages/members/view/[id].vue` - Add Care Reminders section between input and timeline
- New components:
  - `CareReminderList.vue` - Display list of active care reminders (max 3)
  - `CareReminder.vue` - Individual care reminder display
  - `CareReminderInput.vue` - Gentle input for new care reminders
- New composable: `useCareReminders()` for Firestore operations
- Firestore collection structure: `/careReminders` with memberId references
- Security rules: Firestore rules for authenticated-user access
- Styling updates to maintain pastoral aesthetic while distinguishing reminders

### Technical Details

**Firestore Structure:**

```
/careReminders/{reminderId}
  ├── memberId: string
  ├── text: string
  ├── dueDate: Timestamp | null
  ├── authorId: string
  ├── authorName: string
  ├── createdAt: Timestamp
  └── isExpired: boolean (computed field, optional)
```

**Why Firestore:**

- Consistent with Care Notes implementation
- Superior ordering and filtering (`.orderBy()`, `.where()`)
- Future support for visibility rules
- Built-in offline caching
- Standard practice for structured, queryable collections

**Display Logic:**

- Query: `.where('memberId', '==', id).where('isExpired', '==', false).orderBy('dueDate', 'asc').limit(3)`
- Ordering:
  1. Reminders with `dueDate` appear first, ordered ascending (soonest first)
  2. Reminders with `null` dueDate appear last
- Only active (non-expired) reminders shown
- Maximum 3 reminders displayed on Member Detail page

**Expiry Logic:**

- A reminder is considered inactive once its `dueDate` has passed
- Only active reminders are shown on the Member Detail page
- Future Calendar feature will surface all reminders (including inactive ones) for review
- V1 does not provide completion or dismissal—activity status is purely date-based

**Permissions:**

- Firestore Security Rules enforce authenticated-user access
- Aligned with current Care Notes approach
- Read/Write: restricted to authenticated users
- Future role-based permissions deferred to later phase

### Visual Design Notes

**Distinction from Care Notes:**

- Care Reminders use a **subtle visual treatment** that is distinct but not dominant
- Suggested approach:
  - Soft, warm background tint (e.g., lightest amber/beige)
  - Gentle inset or outline border
  - Small "remembering" icon (e.g., outline bookmark, folded paper, handwritten note—avoid bell or alert metaphors)
  - Slightly smaller text size than Care Notes
  - No bold headings or prominent dates

**Prohibited Visual Patterns:**

- No urgency colors (red, orange, yellow highlights)
- No task indicators (checkboxes, progress bars, completion badges)
- No counters or metrics
- No aggressive borders or shadows
- No "overdue" styling

**Integration with Care Space:**

- Care Reminders section appears **after** the Care Note input
- Care Reminders section appears **before** the Care Notes timeline
- Section heading: "Care Reminders" (not "Tasks", "Follow-ups", "To-Do")
- Subtle section divider (line or spacing)
- Maintains generous spacing consistent with Care Space aesthetic

### Progressive Enhancement Considerations

- Care Reminders should load gracefully with skeleton states
- Mobile layout should maintain order: input → reminders → timeline
- Maintain accessibility standards (WCAG 2.1 Level AA)
- Responsive design considerations for all viewports
- Offline support via Firestore caching (default behavior)

### Migration Approach

- No existing data to migrate
- Care Reminders stored in separate `/careReminders` collection
- Reference members via `memberId` field
- No impact on existing Care Notes data or functionality

## Success Criteria

This proposal is successful if:

> "A pastor can quickly see what they are gently holding in mind for a person, without feeling managed, rushed, or pressured."

Key indicators:

- Care Reminders are immediately understandable at a glance
- They do not dominate the Care Space
- They do not feel like work or obligations
- The page still reads primarily as a narrative care space
- Language is entirely pastoral (no task or deadline terminology)
- Visual treatment is calm and supportive (no urgency patterns)
- Adding a Care Reminder feels like setting an intention, not creating a task
