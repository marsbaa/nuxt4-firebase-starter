# Pastoral Care App - Visual Style Guide

## Overview

This style guide documents the design system for the Pastoral Care App, ensuring consistent, accessible, and compassionate visual communication across all interfaces.

## Design Philosophy

The design embodies qualities essential to pastoral care:

- **Warmth**: Inviting earth tones and soft elements
- **Clarity**: Clean layouts and readable typography
- **Calm**: Gentle colors and generous whitespace
- **Accessibility**: WCAG 2.1 AA compliant for all users

---

## Color Palette

### Primary Colors (Soft Sage Green)

Represents growth, peace, and hope.

| Shade       | Hex       | Usage                                      |
| ----------- | --------- | ------------------------------------------ |
| primary-50  | `#f4f7f4` | Subtle backgrounds, hover states           |
| primary-100 | `#e5ede4` | Light backgrounds, table rows              |
| primary-200 | `#ccdccb` | Borders, dividers                          |
| primary-300 | `#a8c4a6` | Disabled states, placeholders              |
| primary-400 | `#89ab87` | Secondary buttons, icons                   |
| primary-500 | `#7a9b76` | Default primary color                      |
| primary-600 | `#5f7d5c` | ✓ Primary buttons, active states (WCAG AA) |
| primary-700 | `#4d644b` | ✓ Primary text on light (WCAG AA)          |
| primary-800 | `#405340` | ✓ Headers, emphasis (WCAG AA)              |
| primary-900 | `#364537` | ✓ High contrast text (WCAG AA)             |
| primary-950 | `#1c251c` | ✓ Maximum contrast (WCAG AAA)              |

**Accessibility Note**: Use primary-600 or darker for text on white backgrounds to meet WCAG 2.1 AA standards (4.5:1 contrast ratio).

### Secondary Colors (Warm Taupe)

Represents stability, grounding, and warmth.

| Shade         | Hex       | Usage                             |
| ------------- | --------- | --------------------------------- |
| secondary-50  | `#f7f6f4` | Card backgrounds, subtle sections |
| secondary-100 | `#edeae6` | Light backgrounds                 |
| secondary-200 | `#dbd5cd` | Borders, separators               |
| secondary-300 | `#c4baad` | Muted elements                    |
| secondary-400 | `#ac9f8e` | Icons, secondary UI               |
| secondary-500 | `#9c8b7a` | Default secondary color           |
| secondary-600 | `#8f7d6e` | Secondary actions                 |
| secondary-700 | `#77675c` | ✓ Text on light (WCAG AA)         |
| secondary-800 | `#63574e` | ✓ Emphasized text (WCAG AA)       |
| secondary-900 | `#524941` | ✓ High contrast (WCAG AA)         |
| secondary-950 | `#2b2521` | ✓ Maximum contrast (WCAG AAA)     |

### Accent Colors (Gentle Gold)

Represents light, guidance, and value.

| Shade      | Hex       | Usage                            |
| ---------- | --------- | -------------------------------- |
| accent-50  | `#faf8f0` | Subtle highlights                |
| accent-100 | `#f3efd9` | Light accent backgrounds         |
| accent-200 | `#e7ddb3` | Borders, gentle emphasis         |
| accent-300 | `#d8c584` | Icons, decorative                |
| accent-400 | `#c9a961` | Accent buttons                   |
| accent-500 | `#bf974d` | Default accent color             |
| accent-600 | `#a97d41` | Accent actions                   |
| accent-700 | `#8b6238` | ✓ Accent text (WCAG AA)          |
| accent-800 | `#735034` | ✓ Emphasized accent (WCAG AA)    |
| accent-900 | `#5f432e` | ✓ High contrast accent (WCAG AA) |
| accent-950 | `#362318` | ✓ Maximum contrast (WCAG AAA)    |

### Neutral Colors (Stone)

Soft, paper-like backgrounds and body text.

| Shade     | Hex       | Usage                         |
| --------- | --------- | ----------------------------- |
| stone-50  | `#fafaf8` | Page backgrounds              |
| stone-100 | `#f5f5f3` | Card backgrounds              |
| stone-200 | `#e8e8e5` | Borders, dividers             |
| stone-300 | `#d5d5d0` | Disabled text                 |
| stone-400 | `#b5b5ae` | Placeholders                  |
| stone-500 | `#9a9a91` | Secondary text                |
| stone-600 | `#7f7f77` | Body text                     |
| stone-700 | `#6b6b68` | ✓ Primary text (WCAG AA)      |
| stone-800 | `#5a5a58` | ✓ Emphasized text (WCAG AA)   |
| stone-900 | `#4c4c4a` | ✓ Headers (WCAG AA)           |
| stone-950 | `#2c2c2a` | ✓ Maximum contrast (WCAG AAA) |

### Semantic Colors

#### Success (Softened Green)

For affirming completion and positive outcomes.

| Shade       | Use Case                     |
| ----------- | ---------------------------- |
| success-50  | Success backgrounds          |
| success-600 | ✓ Success text (WCAG AA)     |
| success-700 | ✓ Success emphasis (WCAG AA) |

#### Warning (Gentle Orange)

For gentle cautions and important notices.

| Shade       | Use Case                     |
| ----------- | ---------------------------- |
| warning-50  | Warning backgrounds          |
| warning-600 | ✓ Warning text (WCAG AA)     |
| warning-700 | ✓ Warning emphasis (WCAG AA) |

#### Danger (Softened Red)

For errors and critical alerts (softened tone).

| Shade      | Use Case                   |
| ---------- | -------------------------- |
| danger-50  | Error backgrounds          |
| danger-600 | ✓ Error text (WCAG AA)     |
| danger-700 | ✓ Error emphasis (WCAG AA) |

#### Info (Calm Blue)

For helpful information and guidance.

| Shade    | Use Case                  |
| -------- | ------------------------- |
| info-50  | Info backgrounds          |
| info-600 | ✓ Info text (WCAG AA)     |
| info-700 | ✓ Info emphasis (WCAG AA) |

---

## Typography

### Font Family

```css
font-family:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
```

System fonts ensure native feel and excellent performance.

### Font Sizes

| Size | px/rem          | Line Height | Use Case                              |
| ---- | --------------- | ----------- | ------------------------------------- |
| xs   | 12px / 0.75rem  | 1.625       | Captions, labels                      |
| sm   | 14px / 0.875rem | 1.625       | **Minimum body text** (accessibility) |
| base | 16px / 1rem     | 2           | **Default body text**                 |
| lg   | 18px / 1.125rem | 1.75        | Large body text, introductions        |
| xl   | 20px / 1.25rem  | 1.625       | Small headings                        |
| 2xl  | 24px / 1.5rem   | 1.625       | H4 headings                           |
| 3xl  | 30px / 1.875rem | 1.625       | H3 headings                           |
| 4xl  | 36px / 2.25rem  | 1.625       | H2 headings                           |
| 5xl  | 48px / 3rem     | 1.625       | H1 headings                           |

**Accessibility**: Never use text smaller than 14px (sm) for readability.

### Font Weights

| Weight   | Value | Use Case                        |
| -------- | ----- | ------------------------------- |
| normal   | 400   | Body text, descriptions         |
| medium   | 500   | **Headings** (softer than bold) |
| semibold | 600   | Emphasis, labels                |
| bold     | 700   | Strong emphasis (use sparingly) |

### Letter Spacing

| Spacing | Value    | Use Case                  |
| ------- | -------- | ------------------------- |
| tight   | -0.025em | Large headings (48px+)    |
| normal  | 0        | Default                   |
| wide    | 0.025em  | **Headings for openness** |

### Line Height

| Height  | Value | Use Case                              |
| ------- | ----- | ------------------------------------- |
| normal  | 1.5   | Default                               |
| relaxed | 1.625 | **Headings for breathing room**       |
| loose   | 2     | **Body text for comfortable reading** |

---

## Spacing

### Standard Scale

Based on 4px (0.25rem) increments for consistent rhythm.

| Class | Size | Use Case            |
| ----- | ---- | ------------------- |
| p-2   | 8px  | Tight padding       |
| p-3   | 12px | Small elements      |
| p-4   | 16px | Default padding     |
| p-6   | 24px | Comfortable padding |
| p-8   | 32px | Generous padding    |
| p-12  | 48px | Section spacing     |
| p-16  | 64px | Large sections      |

### Extended Spacing

For generous whitespace in pastoral care context.

| Class | Size  | Use Case             |
| ----- | ----- | -------------------- |
| p-18  | 72px  | Extra large sections |
| p-22  | 88px  | Page headers         |
| p-26  | 104px | Hero sections        |
| p-30  | 120px | Maximum spacing      |

---

## Border Radius

Soft, gentle corners throughout.

| Class       | Size | Use Case               |
| ----------- | ---- | ---------------------- |
| rounded-sm  | 4px  | Small elements, badges |
| rounded     | 6px  | Default                |
| rounded-md  | 6px  | **Form inputs**        |
| rounded-lg  | 8px  | **Buttons, cards**     |
| rounded-xl  | 12px | Large cards            |
| rounded-2xl | 16px | Modal dialogs          |
| rounded-3xl | 24px | Special elements       |

---

## Shadows

Subtle, gentle shadows for depth without harshness.

| Class          | Use Case                               |
| -------------- | -------------------------------------- |
| shadow-sm      | Subtle cards, light elevation          |
| shadow         | Default cards                          |
| shadow-md      | **Hover states** (gentle lift)         |
| shadow-lg      | Modals, dropdowns                      |
| shadow-soft    | Maintained from original (soft effect) |
| shadow-soft-lg | Maintained from original (soft large)  |

---

## Components

### Buttons

#### Primary Button

- Background: `accent-500` (#bf974d)
- Hover: `accent-600` (#a97d41)
- Text: White
- Padding: `py-3 px-6`
- Border radius: `rounded-lg`
- Shadow: `shadow-sm` → `shadow-md` on hover

#### Secondary Button

- Background: `secondary-200` (#dbd5cd)
- Hover: `secondary-300` (#c4baad)
- Text: `secondary-900` (#524941)
- Same padding and radius as primary

#### Danger Button

- Background: `danger-50` (#faf4f3)
- Hover: `danger-100` (#f4e6e3)
- Text: `danger-700` (#873f32)
- Border: `border-danger-200`

### Form Inputs

#### Text Input

- Background: `stone-50` (#fafaf8)
- Border: `stone-300` (#d5d5d0)
- Focus border: `secondary-400` (#ac9f8e)
- Padding: `py-3 px-4`
- Border radius: `rounded-md`
- Focus ring: 2px offset with `secondary-400`

#### Text Area

- Same as text input
- Minimum height: 120px
- Resize: vertical only

### Cards

#### Default Card

- Background: White
- Border: `stone-200` (#e8e8e5)
- Padding: `p-8`
- Border radius: `rounded-xl`
- Shadow: `shadow-sm`

#### Section Card

- Background: `stone-50` (#fafaf8)
- Border: `stone-200`
- Same padding and radius

### Alerts

#### Success Alert

- Background: `success-50` (#f2f7f2)
- Border: `success-200` (#c5dbc4)
- Text: `success-800` (#2d4430)
- Icon: `success-600` (#416845)

#### Warning Alert

- Background: `warning-50` (#faf6f0)
- Border: `warning-200` (#e7d2b6)
- Text: `warning-800` (#744a34)
- Icon: `warning-600` (#a96f44)

#### Danger Alert

- Background: `danger-50` (#faf4f3)
- Border: `danger-200` (#ead1cb)
- Text: `danger-800` (#70362d)
- Icon: `danger-600` (#a24d3d)

#### Info Alert

- Background: `info-50` (#f4f7f9)
- Border: `info-200` (#d7e1e8)
- Text: `info-800` (#4a5664)
- Icon: `info-600` (#677c93)

---

## Icons

### Size Standards

- Small: 16px (w-4 h-4)
- Default: 20px (w-5 h-5)
- Medium: 24px (w-6 h-6)
- Large: 32px (w-8 h-8)

### Icon Colors

- Primary actions: `primary-600`
- Secondary actions: `secondary-600`
- Accent: `accent-600`
- Neutral: `stone-600`

### Icon Style

- Use rounded/soft icon sets (e.g., Heroicons Outline)
- Maintain 2px stroke width for consistency
- Add title attributes for accessibility

---

## Accessibility Guidelines

### Color Contrast (WCAG 2.1 AA)

#### Minimum Ratios

- Normal text (< 18px): **4.5:1**
- Large text (≥ 18px or 14px bold): **3:1**
- UI components: **3:1**

#### Tested Combinations

✓ All primary-600+ on white backgrounds
✓ All secondary-700+ on white backgrounds
✓ All accent-700+ on white backgrounds
✓ All stone-700+ on white backgrounds
✓ White text on primary-600+ backgrounds
✓ White text on semantic-600+ backgrounds

### Focus Indicators

- Width: 2px
- Offset: 2px
- Color: Context-appropriate (secondary-400 for forms, accent-400 for actions)
- Always visible and clear against backgrounds

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order follows visual flow
- Skip links for navigation
- Escape key dismisses modals/menus

### Screen Reader Support

- Semantic HTML (header, nav, main, article, section)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Form labels properly associated with inputs

### Motion

- Respect `prefers-reduced-motion`
- Transitions: max 300ms
- No auto-playing animations
- Provide pause controls for any motion

---

## Responsive Breakpoints

| Breakpoint | Width  | Device                           |
| ---------- | ------ | -------------------------------- |
| sm         | 640px  | Mobile landscape                 |
| md         | 768px  | Tablet portrait                  |
| lg         | 1024px | Tablet landscape / Small desktop |
| xl         | 1280px | Desktop                          |
| 2xl        | 1536px | Large desktop                    |

### Mobile-First Approach

- Design for mobile (320px) first
- Progressive enhancement for larger screens
- Touch targets minimum 44x44px
- Comfortable spacing on small screens

---

## Content Guidelines

### Tone of Voice

- **Warm**: Welcoming and compassionate
- **Clear**: Simple and direct language
- **Calm**: Avoid urgency or pressure
- **Respectful**: Honor dignity and agency

### Writing Principles

1. Use "you" instead of "your" for warmth
2. Prefer active voice
3. Keep sentences short (< 20 words)
4. Avoid jargon and technical terms
5. Use affirming language, not celebratory
6. Frame errors as gentle guidance

### Example Copy

#### ✗ Don't

- "Error: Invalid credentials"
- "Success! You're awesome!"
- "Click here to proceed"

#### ✓ Do

- "We couldn't find an account with those details"
- "Your changes have been saved"
- "Continue to your dashboard"

---

## File References

### Configuration

- `tailwind.config.ts` - Complete theme configuration
- All colors documented with usage guidelines
- Accessibility notes included

### Components

- `app/components/AppButton.vue` - Button component
- `app/components/AppInput.vue` - Form input component
- `app/components/AppCard.vue` - Card component
- `app/components/AppAlert.vue` - Alert component
- `app/components/AppIcon.vue` - Icon wrapper

### Pages

- `app/pages/login.vue` - Login page
- `app/pages/register.vue` - Registration page
- `app/pages/dashboard.vue` - Main dashboard
- `app/pages/profile.vue` - User profile
- `app/pages/settings.vue` - Settings page

---

## Testing Checklist

### Visual Consistency

- [ ] All pages use consistent color palette
- [ ] Spacing is generous and consistent
- [ ] Typography hierarchy is clear
- [ ] Shadows and borders are subtle

### Accessibility

- [ ] Color contrast ratios verified (WCAG 2.1 AA)
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation works throughout
- [ ] Screen reader compatibility verified
- [ ] Tested with axe or WAVE accessibility tools

### Responsive Design

- [ ] Mobile (320px - 768px) tested
- [ ] Tablet (768px - 1024px) tested
- [ ] Desktop (1024px+) tested
- [ ] Touch targets minimum 44x44px
- [ ] No horizontal scrolling on small screens

### Cross-Browser

- [ ] Chrome/Chromium tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] Edge tested

---

## Future Considerations

### Potential Additions

1. Dark mode (would need careful color adjustments)
2. Print stylesheets for reports
3. Email templates matching design system
4. Illustration library
5. Animation guidelines
6. Data visualization colors

### Maintenance

- Review color palette annually
- Update for WCAG 2.2/3.0 as needed
- Gather user feedback regularly
- Monitor accessibility issues
- Keep components documented

---

## Contact & Feedback

For questions about this style guide or suggestions for improvements, please reach out to the development team or create an issue in the project repository.

_Last updated: January 2026_
