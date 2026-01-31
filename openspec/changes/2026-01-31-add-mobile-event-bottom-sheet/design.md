# Design Document: Mobile Event Detail Bottom Sheet

## Context

The pastoral care app calendar is designed as a shared awareness surface for communal rhythms, liturgical cycles, and member milestones. On mobile devices, the current interaction pattern—tapping an event to navigate to a separate detail page—is disruptive and counter to the calendar's purpose of supporting brief, reflective check-ins.

This design document outlines the technical approach for introducing an Event Detail Bottom Sheet that preserves calendar context while providing event information on mobile devices.

**Key Constraints:**

- Must work seamlessly on mobile viewports (320px - 767px)
- Must not affect desktop/tablet behavior (≥ 768px)
- Must align with pastoral care principles (calm, non-urgent, supportive)
- Must be accessible and performant

## Goals / Non-Goals

### Goals

- Provide in-place event detail viewing on mobile without navigation
- Preserve calendar context and temporal awareness
- Support quick understanding ("What is this?") over forced navigation
- Maintain pastoral tone and visual calm
- Ensure accessibility for screen readers and keyboard navigation
- Keep implementation simple and maintainable

### Non-Goals

- Editing events from the bottom sheet (out of scope)
- Changing event data structures or storage
- Redesigning desktop calendar interactions
- Adding new event types or categories
- Complex animation choreography or page transitions

## Decisions

### Decision 1: Bottom Sheet Pattern Over Modal

**What:** Use a bottom sheet (drawer from bottom) rather than a centered modal dialog.

**Why:**

- Bottom sheets are native mobile pattern (iOS, Material Design)
- Easier to dismiss with natural swipe-down gesture
- Keeps calendar visible in background (context preservation)
- Feels less disruptive than full-screen modal
- Provides clear spatial relationship (sheet slides "over" calendar)

**Alternatives Considered:**

- **Full-screen modal:** Too disruptive, loses calendar context
- **Centered modal:** Less mobile-native, awkward dismissal
- **Inline expansion:** Works for list views, but not month grid

### Decision 2: Progressive Enhancement by Viewport

**What:** Use viewport width detection to conditionally show bottom sheet on mobile (< 768px) while preserving direct navigation on desktop (≥ 768px).

**Why:**

- Desktop users expect click → navigate pattern
- Mobile users benefit from reduced navigation
- Matches existing responsive breakpoint (`md:` in Tailwind)
- No breaking changes to desktop experience
- Simple conditional logic based on single measurement

**Implementation:**

```javascript
const isMobile = window.innerWidth < 768;
if (isMobile) {
  openBottomSheet(event);
} else {
  navigateToDetail(event);
}
```

### Decision 3: Vue Component with Composable State

**What:** Create `EventDetailSheet.vue` component with global state managed by a composable (e.g., `useEventDetailSheet`).

**Why:**

- Separates concerns (presentation vs. state)
- Allows multiple calendar views to trigger same sheet
- Composable provides clean API: `openSheet(event)`, `closeSheet()`
- Follows existing pattern in project (see `useToast`)
- Avoids prop drilling through calendar components

**Structure:**

```
app/
  components/
    EventDetailSheet.vue    # UI component
  composables/
    useEventDetailSheet.ts  # State management
```

### Decision 4: Simple Slide Animation with CSS Transitions

**What:** Use CSS transitions with transform for slide-up animation, not complex JavaScript animation libraries.

**Why:**

- Native CSS transitions are performant (GPU-accelerated)
- Simple to maintain and debug
- Consistent with existing component patterns in project
- No additional dependencies
- Works well with touch gesture libraries (if added later)

**CSS Pattern:**

```css
.sheet {
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
}
.sheet.open {
  transform: translateY(0);
}
```

### Decision 5: Optional Secondary Actions, Not Primary CTAs

**What:** Include "Open full details" and "Go to person" links as subtle, secondary affordances within the sheet content—not as prominent buttons or CTAs.

**Why:**

- Primary purpose is information display, not action navigation
- Aligns with pastoral principle: understanding before action
- Reduces visual noise and urgency
- Keeps focus on event content itself
- Users can still navigate if needed, but it's not pushed

**Visual Treatment:**

- Use subtle link styling (underline, calm color)
- Position at bottom of content, not top
- Small icon + text, not large button

### Decision 6: Swipe-to-Dismiss with Touch Events

**What:** Implement swipe-down dismissal using touch event listeners to detect drag gestures.

**Why:**

- Swipe-down is expected mobile pattern for bottom sheets
- Enhances mobile-native feel
- Provides additional dismissal method beyond tap-outside
- Improves accessibility for motor control users

**Implementation Approach:**

- Listen for `touchstart`, `touchmove`, `touchend` on sheet
- Track vertical delta during drag
- If delta > threshold and direction is down, dismiss
- Add visual feedback during drag (sheet follows finger)

**Library Consideration:**

- Start with vanilla touch events
- If complexity grows, consider `@vueuse/gesture` for robust gesture handling

### Decision 7: Accessibility-First Approach

**What:** Treat bottom sheet as an ARIA dialog with proper focus management and keyboard support.

**Why:**

- Modal dialogs have well-defined accessibility patterns
- Screen reader users need context and navigation
- Keyboard users must be able to dismiss and interact
- Aligns with WCAG 2.1 Level AA requirement (existing spec)

**Implementation:**

- `role="dialog"` on sheet container
- `aria-modal="true"` to indicate modal context
- `aria-labelledby` pointing to event title
- Focus trap within sheet while open
- Escape key dismisses sheet
- Return focus to triggering element on close

## Risks / Trade-offs

### Risk: Gesture Conflict with Browser Scroll

**Description:** On mobile, swipe-down gesture might conflict with page scroll or pull-to-refresh.

**Mitigation:**

- Prevent default touch behavior on sheet container
- Only interpret swipe when starting from sheet, not backdrop
- Add visual handle at top of sheet (common pattern)
- Test on multiple browsers/devices

### Risk: Animation Performance on Low-End Devices

**Description:** CSS transforms might stutter on older mobile devices with limited GPU.

**Mitigation:**

- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating layout properties (width, height, padding)
- Test on lower-end devices (iPhone SE, older Android)
- Provide `prefers-reduced-motion` fallback

### Trade-off: Mobile-Only Feature Creates Platform Inconsistency

**Description:** Desktop users don't get the bottom sheet, creating different interaction patterns.

**Justification:**

- Desktop users have more screen real estate (can handle navigation)
- Mobile users benefit more from context preservation
- Progressive enhancement is acceptable when it improves mobile UX
- Consistent within each platform (mobile = sheet, desktop = navigation)

### Risk: Sheet Content Overflow on Small Screens

**Description:** Event descriptions might be long, causing sheet to extend beyond viewport.

**Mitigation:**

- Set max-height on sheet (e.g., 80% of viewport height)
- Make sheet content scrollable if needed
- Use line clamping for descriptions with "read more" pattern
- Test on small devices (iPhone SE 1st gen: 320px width)

## Migration Plan

This is a new feature addition, not a migration. Implementation can proceed incrementally:

### Phase 1: Component Creation

- Build `EventDetailSheet.vue` with static content
- Add to `CareCalendar.vue` parent
- Test animation and dismissal without event data

### Phase 2: State Management

- Create `useEventDetailSheet` composable
- Wire up `openSheet` and `closeSheet` methods
- Test programmatic opening/closing

### Phase 3: Integration

- Update `CalendarWeekView.vue` mobile event click handler
- Update `CalendarMonthView.vue` mobile event click handler
- Add viewport detection logic
- Preserve desktop navigation behavior

### Phase 4: Polish & Testing

- Add swipe-to-dismiss gesture
- Implement accessibility attributes
- Test on multiple devices and browsers
- Validate with screen reader

### Rollback Plan

If issues arise:

1. Set feature flag to disable bottom sheet
2. Fall back to direct navigation on mobile
3. No data changes needed (pure UI change)
4. Can be disabled without affecting calendar functionality

## Open Questions

### Q1: Should the sheet show event creator/author information?

**Status:** Deferred

**Context:** Community events have a creator, but showing "Created by Rev. Smith" might not align with pastoral tone.

**Decision:** Start without showing creator. Can add later if user testing shows need.

---

### Q2: Should we animate the backdrop fade-in separately?

**Status:** To be determined in implementation

**Options:**

- Fade backdrop in/out independently
- Backdrop follows sheet timing
- Instant backdrop (no animation)

**Recommendation:** Start with backdrop following sheet timing for simplicity.

---

### Q3: How should we handle bottom sheet on landscape mobile orientation?

**Status:** To be tested

**Concern:** Bottom sheets can take up too much horizontal space in landscape.

**Options:**

- Use full height in landscape (acceptable if content is brief)
- Switch to smaller sheet height in landscape
- Convert to centered modal in landscape

**Recommendation:** Test with real content; likely full-height is acceptable for brief event details.

---

## References

- [Material Design: Bottom Sheets](https://m3.material.io/components/bottom-sheets/overview)
- [iOS Human Interface Guidelines: Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)
- [WAI-ARIA: Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.1: Focus Management](https://www.w3.org/WAI/WCAG21/Understanding/focus-order)
