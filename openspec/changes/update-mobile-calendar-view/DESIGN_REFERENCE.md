# Design Reference: Mobile Weekly Calendar View

## Visual Design Specifications

This document captures the visual design specifications from the reference screenshot for the mobile weekly calendar view.

## Layout Structure

### Header Section

- **Month/Year Title**: Centered, serif font (e.g., "November 2024")
  - Font size: ~20-24px
  - Font weight: 400-500 (medium)
  - Color: Dark gray/black (#1a1a1a or similar)
- **"VIEW MONTH" Toggle**: Centered below title
  - Font size: ~11-12px
  - Font weight: 500
  - Text transform: uppercase
  - Letter spacing: 0.5-1px
  - Color: Muted gray (#999999 or similar)
- **Navigation Arrows**: Left and right of title
  - Simple chevron icons
  - Color: Neutral gray
  - Touch target: 44x44px minimum

### Week Range Selector

- **Week Range Display**: "Nov 3 - 9"
  - Background: Light neutral (e.g., #f5f5f5)
  - Border radius: 6-8px
  - Padding: 12px 16px
  - Font size: ~14px
  - Color: Dark gray
  - Dropdown chevron: Small, aligned right

## Day Section Structure

Each day follows this pattern:

### Day Header

- **Day Number**: Large, prominent
  - Font size: ~32-36px
  - Font weight: 300-400 (light)
  - Color: Light gray (#c0c0c0 or similar)
  - Example: "03", "04", "05"
- **Day Name**: Small, uppercase
  - Font size: ~11-12px
  - Font weight: 500
  - Text transform: uppercase
  - Letter spacing: 0.5-1px
  - Color: Medium gray (#999999)
  - Example: "SUNDAY", "MONDAY"

### Event Cards

Each event displayed as a card with:

**Structure:**

```
[Icon] Event Name
       Contextual Label • Time (if applicable)
```

**Visual Properties:**

- Background: Very light, subtle color based on event type
  - Community gatherings: Light teal/mint
  - Member milestones: Light peach/amber
  - Care reminders: Light blue
  - Church services: Light sage/olive
- Border radius: 8-12px
- Padding: 14-16px
- Margin: 8-12px vertical spacing between events

**Icon:**

- Size: 24x24px or 32x32px
- Style: Line/outline icons (not solid)
- Color: Matches event type theme
- Positioned: Left side, vertically centered
- Examples from reference:
  - Church icon for Lord's Day Service
  - Birthday cake icon for Birthday
  - People/gathering icon for Church Picnic

**Event Name:**

- Font size: ~15-16px
- Font weight: 500-600 (medium/semi-bold)
- Color: Dark gray/black (#1a1a1a)
- Example: "Lord's Day Service", "Arthur P. Birthday", "Church Picnic"

**Contextual Label:**

- Font size: ~13-14px
- Font weight: 400 (regular)
- Color: Medium gray (#666666)
- Format: "Label • Time" or just "Label"
- Examples:
  - "Communal Rhythm • 10:00 AM"
  - "Member Milestone"
  - "Community Gathering • Central Park"

### Spacing

- **Between day sections**: ~32-40px
- **Between events within a day**: ~12px
- **Horizontal margins**: ~16-20px from screen edges
- **Top/bottom padding**: ~24px

### Empty Days

- Show only day header (number + name)
- No event cards
- No "no events" message
- Maintains consistent vertical spacing

## Floating Action Button (FAB)

- **Position**: Fixed bottom-right
- **Size**: 56x56px
- **Color**: Accent color (e.g., sage green, muted teal)
- **Icon**: Plus symbol
- **Shadow**: Subtle elevation shadow
- **Purpose**: "New Event" creation

## Color Palette (from reference)

### Backgrounds

- Screen background: Off-white/cream (#fafafa or #f9f9f7)
- Event card backgrounds: Very light, semi-transparent colors
- Week range selector: Light neutral (#f5f5f5)

### Text

- Primary text (titles): Dark gray/black (#1a1a1a)
- Secondary text (labels): Medium gray (#666666)
- Tertiary text (day names, subtle info): Light gray (#999999)

### Accent Colors (Event Types)

- **Community Gatherings**: Soft teal/mint (#d4e8e4 background, #2d6e5e text/icon)
- **Member Milestones**: Warm peach/amber (#f5e8dc background, #b8673e text/icon)
- **Communal Rhythms**: Sage green (#e3e8de background, #5a6d4f text/icon)
- **Care Reminders**: Soft blue (#dce8f5 background, #3e5f8b text/icon)

## Typography Stack

Suggested fonts matching the aesthetic:

- **Headers**: Serif font (e.g., Lora, Merriweather, Georgia)
- **Body/UI**: Sans-serif (e.g., Inter, System UI, SF Pro)
- **Small caps labels**: Sans-serif with letter-spacing

## Interaction States

### Event Card Hover/Tap

- Slight scale: 1.02
- Subtle shadow increase
- Transition: 150-200ms ease

### Week Navigation

- Arrows darken on hover
- Immediate visual feedback on tap

### FAB

- Slight scale on tap: 0.95
- Ripple effect on touch

## Accessibility Notes

- All interactive elements: Minimum 44x44px touch targets
- Color contrast: WCAG AA minimum
  - Event text on light backgrounds: 4.5:1 minimum
  - Icons and labels: Clear differentiation
- Focus indicators: Visible 2px outline on keyboard focus
- Screen reader labels: Descriptive aria-labels on all controls

## Responsive Behavior

### Small Mobile (320px - 375px)

- Maintain all visual elements
- Reduce horizontal padding slightly (12-16px)
- Keep event cards full-width minus margins

### Standard Mobile (375px - 767px)

- Standard spacing as described above
- Comfortable reading width

### Tablet (768px+)

- Switch to monthly view by default
- Weekly view available via toggle

## Animation & Transitions

- **View switching**: 300ms ease-in-out fade/slide
- **Week navigation**: 250ms ease slide animation
- **Event card interactions**: 150ms ease scale/shadow
- **FAB appearance**: Fade up 200ms delay on page load

## Empty State

If entire week has no events:

- Show week header
- Show all 7 day headers
- Maintain spacing
- No "empty state" message needed
- Calm, uncluttered appearance

## Design Principles Applied

1. **Generous whitespace**: Prevents mobile overwhelm
2. **Clear hierarchy**: Day > Event > Details
3. **Subtle color**: Enough to distinguish, not to distract
4. **Readable typography**: Optimized for mobile reading
5. **Calm aesthetic**: No urgency, pressure, or loud elements
6. **Pastoral tone**: Feels like a quiet, trustworthy space
