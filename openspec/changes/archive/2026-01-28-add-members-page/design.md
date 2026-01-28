# Members Page Design

## Context

The Pastoral Care App requires a Members management interface that reflects the values of pastoral care: warmth, respect, trust, and calm. This design document specifies the visual language, interaction patterns, and technical decisions for the Members page.

The design must avoid corporate aesthetics and data-heavy presentations, instead fostering an experience that feels supportive and human-centered.

## Goals / Non-Goals

### Goals

- Create a warm, inviting interface that aligns with pastoral care values
- Present member information clearly without overwhelming the user
- Provide essential management actions (view, edit, delete) in a respectful manner
- Support efficient member lookup through search
- Scale gracefully for communities of various sizes (10-1000+ members)
- Maintain design consistency with existing authentication and dashboard pages

### Non-Goals

- Bulk operations or batch actions (maintains individual care focus)
- Advanced analytics or reporting features
- Member grouping or categorization (keep simple)
- Complex filtering beyond basic search
- Real-time collaboration features

## Decisions

### Visual Design Language

**Decision**: Use warm, earthy color palette with soft rounded corners and generous whitespace.

**Rationale**:

- Warm colors (soft browns, beiges) create emotional warmth and approachability
- Rounded corners (8-12px radius) feel gentle and welcoming vs. sharp corporate edges
- Generous spacing reduces cognitive load and creates breathing room
- Aligns with existing design system from authentication/dashboard specs

**Implementation**:

- Primary action button: Warm brown/tan (`bg-[#B4956E]` or similar)
- Background: Off-white or very light beige (`bg-stone-50`)
- Text: Soft dark gray instead of pure black
- Icons: Outline style, consistent 1.5-2px stroke weight
- Table: Card-style with subtle shadow, no harsh borders

### Layout Structure

**Decision**: Fixed header with scrollable table content and sticky pagination footer.

**Rationale**:

- Keeps primary action ("+ New Member") and search always visible
- Allows comfortable scrolling through member lists
- Pagination stays accessible without scrolling back to top

**Components**:

1. Page header (fixed)
2. Search bar and member count (fixed)
3. Member table (scrollable)
4. Pagination (sticky footer)

### Member Data Display

**Decision**: Show essential pastoral care context: identity (name, avatar), age, contact method, and location.

**Rationale**:

- Pastors need quick context for care visits and outreach
- Age helps with age-appropriate care and lifecycle events
- Location supports visit planning
- Contact info enables direct communication
- Birthdate visible supports pastoral care milestones

**Column Structure**:

- `#`: Row number for reference
- `Member`: Avatar + Full name + Birthdate + Age
- `Contact Info`: Phone number (primary) or "No contact info"
- `Location`: Suburb with subtle pin icon
- `Actions`: Icon-only (view, edit, delete)

**Alternatives Considered**:

- Showing email instead of phone: Phone chosen as more personal for pastoral context
- Adding "last contacted" date: Rejected to keep initial version simple
- Showing member status/tags: Deferred to keep focus on core information

### Search Functionality

**Decision**: Single search input filtering by name, email, or location with debounced client-side filtering.

**Rationale**:

- Simple single-field search reduces cognitive load
- Covers most common lookup scenarios
- Debouncing (300ms) prevents excessive re-renders
- Client-side for small-to-medium datasets (< 1000 members)

**Future Consideration**: For larger communities (1000+ members), move to server-side search with Firestore queries.

### Action Affordances

**Decision**: Icon-only actions (view, edit, delete) with tooltips and confirmation for destructive actions.

**Rationale**:

- Icons save space and create clean visual hierarchy
- Tooltips provide clarity on hover
- Delete requires confirmation dialog to prevent accidents
- Visual weight matches action severity (view lightest, delete with warning color on hover)

**Icons**:

- View: Eye icon (observation, non-invasive)
- Edit: Pencil icon (gentle modification)
- Delete: Trash icon (appears neutral, becomes warning on hover/confirm)

### Pagination Strategy

**Decision**: Page-based pagination with 5-20 members per page (default 5 as shown in design).

**Rationale**:

- Page numbers provide clear mental model of dataset size
- Small page sizes reduce scrolling and support focused attention
- Showing "X to Y of Z members" provides clear context
- Previous/Next arrows support keyboard navigation

**Alternatives Considered**:

- Infinite scroll: Rejected as it obscures dataset boundaries
- Load more button: Less clear than explicit pagination
- Virtual scrolling: Over-engineered for expected dataset sizes

### Member Avatar Design

**Decision**: Circular avatars with two-letter initials on warm background colors, randomly assigned per member.

**Rationale**:

- Creates visual identity without requiring photo uploads
- Warm palette choices maintain pastoral aesthetic
- Two letters (first name + last name) provide better recognition than one
- Consistent circle size (40-48px) balances visibility and table density

### Empty and Loading States

**Decision**:

- Empty state: Gentle message "No members yet" with suggestion to add first member
- Loading state: Subtle skeleton screens maintaining table structure

**Rationale**:

- Empty state shouldn't feel like failure, but opportunity
- Skeleton screens prevent layout shift and maintain spatial consistency
- Loading indicators should be calm (no aggressive spinners)

## Data Model

### Member Type

Based on the existing Firebase Realtime Database structure:

```typescript
interface Member {
  id: string; // Firebase RTDB key
  name: string; // Format: "LASTNAME, FIRSTNAME" (all caps)
  birthday: string; // ISO date string: "YYYY-MM-DD"
  contact: string; // Phone number in +61 format, or empty string
  email: string; // Usually empty string
  suburb: string; // Location text
  memberSince: string; // ISO date string: "YYYY-MM-DD", or empty string
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  createdBy: string; // Firebase user ID
  importedAt?: string; // ISO timestamp (from data migration)
  updatedBy?: string; // Firebase user ID (if updated)
}
```

### Firebase RTDB Structure

**Existing Structure** (from data export):

```
/members
  /{memberId}
    - name: string               // "LASTNAME, FIRSTNAME"
    - birthday: string           // "YYYY-MM-DD"
    - contact: string            // "+61..." or ""
    - email: string              // "" (mostly empty)
    - suburb: string             // "Suburb Name"
    - memberSince: string        // "YYYY-MM-DD" or ""
    - createdAt: string          // ISO timestamp
    - updatedAt: string          // ISO timestamp
    - createdBy: string          // user ID
    - importedAt?: string        // ISO timestamp (legacy)
    - updatedBy?: string         // user ID (if updated)
```

**Data Processing Notes**:

- Name must be parsed to extract firstName and lastName from "LASTNAME, FIRSTNAME" format
- Birthday string needs to be parsed and age calculated
- Contact field serves as phone (no separate phone field)
- Email field exists but is rarely populated (empty strings)
- Suburb is plain text (no structured location object)

**Migration Notes**:

- This implementation works with the existing Firebase RTDB structure
- No schema migration required
- UI layer will parse and format data from existing structure
- When creating/editing members, maintain the existing "LASTNAME, FIRSTNAME" format

## Risks / Trade-offs

### Risk: Client-side search performance with large datasets

**Impact**: Search may become sluggish with 1000+ members.

**Mitigation**:

- Start with client-side for simplicity
- Monitor performance metrics
- If needed, migrate to Firestore queries or search service
- Document threshold (500-1000 members) for re-evaluation

### Risk: Deletion without audit trail

**Impact**: Accidental deletions may be unrecoverable.

**Mitigation**:

- Require explicit confirmation dialog
- Consider soft-delete (mark as deleted vs. hard delete) in future iteration
- Log deletion events to Firestore audit collection

### Trade-off: Icon-only actions vs. text labels

**Chosen**: Icon-only for cleaner visual design.

**Trade-off**: May reduce discoverability for first-time users.

**Mitigation**:

- Add tooltips for all action icons
- Use universally recognized icons (eye, pencil, trash)
- Consider adding text labels on mobile/tablet where space permits

### Trade-off: Pagination vs. infinite scroll

**Chosen**: Traditional pagination for clarity and control.

**Trade-off**: Requires extra clicks to navigate large lists.

**Benefit**: Clear mental model, better for careful review of members (pastoral context).

## Accessibility Considerations

- Semantic HTML: Use `<table>` with proper `<thead>`, `<tbody>` structure
- ARIA labels: Add `aria-label` to icon-only buttons
- Keyboard navigation:
  - Tab order: Search → New Member button → table rows → action buttons → pagination
  - Enter/Space to activate buttons
  - Arrow keys for pagination navigation
- Focus indicators: Visible focus rings on all interactive elements
- Color contrast: Ensure text meets WCAG AA standards (4.5:1 minimum)
- Screen reader:
  - Announce member count
  - Announce pagination state
  - Provide context for action buttons ("View Sandra Auterson", not just "View")

## Responsive Behavior

### Desktop (> 1024px)

- Full table layout as shown in design
- All columns visible
- Comfortable spacing

### Tablet (768px - 1024px)

- Maintain table layout
- Reduce spacing slightly
- Consider stacking contact info and location

### Mobile (< 768px)

- Switch to card-based layout (not table)
- Stack information vertically
- Larger touch targets for actions
- Simplified pagination (prev/next only)

## Migration Plan

N/A - This is a new capability with no existing implementation to migrate.

## Open Questions

1. **Member creation flow**: Should "New Member" open a modal or navigate to separate page?
   - **Recommendation**: Start with modal for simpler flow, evaluate based on form complexity.

2. **Default sort order**: By creation date, name, or last contact date?
   - **Recommendation**: Alphabetical by last name for easy lookup. Add sort controls in future iteration.

3. **Contact info display**: Show both phone and email if available, or prioritize one?
   - **Current**: Show phone primarily. Email visible in detail view.

4. **Location granularity**: Show full address or just suburb?
   - **Current**: Suburb only for privacy and simplicity. Full address in detail view if needed.

5. **Member profile photos**: Support in initial version?
   - **Recommendation**: Defer to post-MVP. Initials provide sufficient visual identity.
