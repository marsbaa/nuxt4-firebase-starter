# Event Detail Bottom Sheet Proposal

**Change ID:** `2026-01-31-add-mobile-event-bottom-sheet`

**Status:** Pending Review

**Type:** Feature Addition (Mobile UX Enhancement)

---

## Summary

This proposal introduces an **Event Detail Bottom Sheet** for mobile calendar interactions, replacing disruptive navigation with in-place event detail viewing. This change preserves the calendar's role as an awareness surface and supports brief, reflective mobile check-ins without forcing users to leave their temporal context.

---

## Quick Links

- [`proposal.md`](proposal.md) - Problem statement, changes, impact, and scope
- [`design.md`](design.md) - Technical decisions, architecture, and implementation approach
- [`tasks.md`](tasks.md) - Implementation checklist
- [`specs/care-calendar/spec.md`](specs/care-calendar/spec.md) - Requirements delta (ADDED & MODIFIED)

---

## What's Changing

### Mobile Only (< 768px)

- Tapping a calendar event opens a bottom sheet instead of navigating away
- Users see event details (title, date, category, description) in-place
- Sheet can be dismissed with swipe-down or tap-outside
- Optional secondary navigation to full detail pages available
- Calendar remains visible (dimmed) in background

### Desktop/Tablet (≥ 768px)

- **No change** - existing navigation behavior preserved
- Clicking an event still navigates directly to detail page

---

## Alignment with Pastoral Care Principles

✅ **Presence over productivity** - Keeps users grounded in calendar context  
✅ **Understanding before action** - First tap answers "What is this?"  
✅ **Calm, pastoral tone** - No urgency, gentle interactions  
✅ **Mobile-appropriate** - Respects brief, reflective check-in pattern  
✅ **Awareness surface** - Calendar remains place of noticing, not navigation hub

---

## Risk Level: **Low**

- Pure UI enhancement, no data structure changes
- Desktop behavior unchanged (zero impact)
- Progressive enhancement pattern (can be disabled if needed)
- No breaking changes to APIs or event storage
- Existing event detail pages remain functional

---

## Next Steps

1. **Review** - Stakeholders review proposal, design, and requirements
2. **Approve** - Confirm alignment with product vision and pastoral principles
3. **Implement** - Follow [`tasks.md`](tasks.md) checklist
4. **Test** - Validate on multiple mobile devices and browsers
5. **Deploy** - Ship to production
6. **Archive** - Run `openspec archive 2026-01-31-add-mobile-event-bottom-sheet` after deployment

---

## Questions or Feedback?

See [Open Questions](design.md#open-questions) in `design.md` for unresolved decisions.
