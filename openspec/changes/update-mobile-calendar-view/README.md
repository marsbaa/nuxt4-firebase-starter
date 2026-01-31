# Mobile Calendar View Improvement

> **Change ID**: `update-mobile-calendar-view`  
> **Status**: Proposed  
> **Affected Capability**: [`care-calendar`](../../specs/care-calendar/spec.md)

## Quick Summary

Introduces a **weekly vertical view** as the primary mobile calendar experience, while retaining the monthly grid for desktop. This change improves readability and awareness on mobile devices without disrupting existing functionality or the desktop experience.

## Documents in This Proposal

- **[proposal.md](./proposal.md)** — Why this change matters and what it impacts
- **[design.md](./design.md)** — Technical decisions, architecture, and implementation approach
- **[tasks.md](./tasks.md)** — Step-by-step implementation checklist
- **[DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md)** — Detailed visual design specifications from reference screenshot
- **[specs/care-calendar/spec.md](./specs/care-calendar/spec.md)** — Specification deltas (ADDED and MODIFIED requirements)

## Problem

The current monthly grid calendar becomes too dense on mobile devices, reducing events to small, illegible indicators. This makes it difficult for pastors to quickly understand what's happening at a glance during brief mobile check-ins.

## Solution

- **Weekly vertical view** showing 7 days with full event details visible
- **Automatic viewport detection**: < 768px defaults to weekly, ≥ 768px defaults to monthly
- **User toggle available**: Switch between views on any device
- **No breaking changes**: Desktop experience unchanged, all existing functionality preserved

## Key Design Principles

✅ **Preserves**:

- All event types and data models
- Pastoral language and tone
- Desktop and tablet experiences
- Existing navigation and filtering

✨ **Enhances**:

- Mobile readability via vertical flow
- Natural day-by-day awareness
- Calm, spacious mobile layouts
- Brief check-in usability

## Implementation Approach

1. Create new `CalendarWeekView.vue` component
2. Add viewport detection and view toggle to `CareCalendar.vue`
3. Implement week navigation and date range logic
4. Ensure event rendering consistency across views
5. Test accessibility and mobile interactions
6. Polish transitions and visual design

## Validation Status

```bash
$ openspec validate update-mobile-calendar-view --strict
✓ Change 'update-mobile-calendar-view' is valid
```

## Next Steps

1. **Review proposal documents** — Ensure alignment with project vision
2. **Approve or request changes** — Provide feedback on approach
3. **Begin implementation** — Once approved, work through tasks.md sequentially
4. **Test thoroughly** — Verify mobile experience across devices
5. **Archive after deployment** — Move to archive/ and update specs/

## Questions or Feedback?

Review the full proposal documents above, particularly:

- Technical approach → [`design.md`](./design.md)
- Visual specifications → [`DESIGN_REFERENCE.md`](./DESIGN_REFERENCE.md)
- Requirements changes → [`specs/care-calendar/spec.md`](./specs/care-calendar/spec.md)

---

**Remember**: This proposal introduces mobile-specific enhancements without modifying core calendar functionality or desktop experiences. It's a progressive enhancement focused on mobile usability.
