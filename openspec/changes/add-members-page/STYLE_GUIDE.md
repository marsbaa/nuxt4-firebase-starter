# Members Page Style Guide

This document extracts the design tokens, color palette, typography, and styling patterns from the reference HTML design.

## Color Palette

### Primary Colors

```
primary: #c2a47a        // Warm tan - main action buttons, icons, accents
```

### Background Colors

```
Light Mode:
  background-light: #f9f8f6     // Main page background (off-white/cream)
  sidebar-light: #ffffff        // Sidebar and card backgrounds (white)

Dark Mode:
  background-dark: #1a1a17      // Main page background (dark charcoal)
  sidebar-dark: #262622         // Sidebar and card backgrounds (dark gray)
```

### Accent Colors

```
Light Mode:
  accent-green: #e3e8e1         // Active menu item background (soft sage green)

Dark Mode:
  accent-green-dark: #3a4138    // Active menu item background (darker green)
```

### Text Colors

```
Light Mode:
  Primary text: slate-900 (#0f172a)
  Secondary text: slate-600 (#475569)
  Muted text: slate-500 (#64748b)
  Disabled/subtle: slate-400 (#94a3b8)

Dark Mode:
  Primary text: white
  Secondary text: slate-200
  Muted text: slate-400
  Disabled/subtle: slate-500
```

### Border Colors

```
Light Mode:
  Default: slate-200 (#e2e8f0)
  Subtle: slate-100 (#f1f5f9)

Dark Mode:
  Default: slate-800 (#1e293b)
  Subtle: slate-800
```

### Interactive States

```
Hover States:
  Primary: hover:opacity-90 (buttons)
  Secondary: hover:bg-accent-green/50 (nav items)
  Icons: hover:text-primary hover:bg-primary/10

Delete Warning:
  hover:text-red-500 hover:bg-red-50
```

## Typography

### Font Families

```css
font-display: "Crimson Pro", serif     // Used for main headings (weights: 600, 700)
font-sans: "Inter", sans-serif         // Used for body text (weights: 400, 500, 600)
```

### Font Sizes

```
Page Title (h2): text-3xl (30px) font-bold
Subtitle: text-sm (14px)
Nav Items: text-sm (14px) font-medium
Table Headers: text-xs (12px) font-semibold uppercase
Table Body: text-sm (14px)
Member Name: text-sm (14px) font-semibold
Member Details: text-xs (12px)
Button Text: font-medium
```

### Font Weights

```
Bold/Strong: font-bold (700)
Semibold/Medium: font-semibold (600) or font-medium (500)
Regular: font-normal (400)
```

## Spacing

### Border Radius

```
Default: 0.75rem (12px) - used throughout
Buttons: rounded-xl (12px)
Cards: rounded-2xl (16px)
Avatar: rounded-full (circle)
```

### Padding/Spacing

```
Page Padding: p-8 (32px)
Card Padding: p-6 (24px)
Sidebar Padding: p-4 to p-6
Table Cell: px-6 py-4 (24px horizontal, 16px vertical)
Button: px-5 py-2.5 (20px horizontal, 10px vertical)
Icon Button: p-2 (8px)
```

### Gaps

```
Space between elements: space-x-2 to space-x-3 (8px - 12px)
Navigation items: space-y-1 (4px vertical)
```

## Components

### Avatar

```html
<div
  class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs"
>
  SA
</div>
```

- Size: 40x40px
- Background: primary color at 20% opacity
- Text: primary color, bold, xs (12px)
- Initials: uppercase, 2 letters

### Action Buttons (Icon)

```html
<button
  class="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
>
  <span class="material-symbols-rounded">visibility</span>
</button>
```

- Padding: 8px all sides
- Default: slate-400
- Hover: primary color with 10% opacity background
- Transition: colors

### Primary Action Button

```html
<button
  class="bg-primary hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition-all shadow-sm"
>
  <span class="material-symbols-rounded">add</span>
  <span>New Member</span>
</button>
```

- Background: primary color
- Hover: reduce opacity to 90%
- Text: white, medium weight
- Padding: 20px horizontal, 10px vertical
- Subtle shadow

### Search Input

```html
<input
  class="block w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-primary rounded-xl text-sm transition-all dark:text-white"
/>
```

- Padding: 40px left (for icon), 16px right, 10px vertical
- Background: background-light color
- Border: transparent, becomes primary on focus
- Rounded: xl (12px)

### Table

```html
<table class="w-full text-left border-collapse">
  <thead
    class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider"
  >
    <!-- Header cells: px-6 py-4 -->
  </thead>
  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <!-- Body cells: px-6 py-4 -->
    </tr>
  </tbody>
</table>
```

- Headers: light background, uppercase, small text
- Rows: hover effect with background change
- Dividers: subtle lines between rows

### Card Container

```html
<div
  class="bg-white dark:bg-sidebar-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6"
>
  <!-- Content -->
</div>
```

- Background: white (light) or sidebar-dark (dark mode)
- Rounded: 2xl (16px)
- Shadow: sm
- Border: slate-200 or slate-800
- Padding: 24px

### Pagination

```html
<button class="px-3 py-1 rounded-lg bg-primary text-white text-sm font-medium">
  1
</button>
<button
  class="px-3 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium transition-colors"
>
  2
</button>
```

- Active: primary background, white text
- Inactive: hover effect, muted text
- Navigation arrows: icon buttons with borders

## Icons

### Icon Set

Material Symbols Rounded from Google Fonts

### Icon Configuration

```css
.material-symbols-rounded {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
.material-symbols-rounded.filled {
  font-variation-settings: "FILL" 1;
}
```

### Icon Names Used

- `favorite` (filled) - App logo
- `grid_view` - Dashboard
- `group` (filled) - Members List (active)
- `person` - Profile
- `settings` - Settings
- `logout` - Sign out
- `add` - New member
- `search` - Search input
- `cake` - Birthday
- `call` - Phone contact
- `location_on` - Location
- `visibility` - View action
- `edit` - Edit action
- `delete` - Delete action
- `chevron_left` / `chevron_right` - Pagination
- `dark_mode` - Theme toggle

### Icon Sizing

```
Default: 24px (text-xl or material-symbols-rounded default)
Small: text-xs (12px) - used in birthday display
Medium: text-lg (18px) - used for location/phone icons
Large: text-3xl (30px) - used for app logo
```

## Layout Structure

### Sidebar

```
Width: w-64 (256px)
Position: fixed h-full
Layout: flex flex-col
```

### Main Content

```
Margin: ml-64 (256px left margin to account for sidebar)
Padding: p-8 (32px)
Max Width: max-w-7xl mx-auto
```

### Responsive Breakpoints

```
md: 768px (for flex-row in search bar)
```

## Dark Mode

Toggle button (bottom right):

```html
<button
  class="fixed bottom-6 right-6 w-12 h-12 bg-white dark:bg-sidebar-dark border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center shadow-lg text-slate-500 hover:text-primary transition-all z-50"
>
  <span class="material-symbols-rounded">dark_mode</span>
</button>
```

Implementation: Toggle `dark` class on `<html>` element

## Animation & Transitions

### Transition Classes

```
transition-colors: For color changes (text, backgrounds)
transition-all: For multiple property changes
```

### Hover States

- Nav items: background color change
- Buttons: opacity or background color change
- Icon buttons: color and background change
- Table rows: background color change

## Implementation Notes for Nuxt/Vue

### Recommended Tailwind Config

```javascript
{
  theme: {
    extend: {
      colors: {
        primary: "#c2a47a",
        "background-light": "#f9f8f6",
        "background-dark": "#1a1a17",
        "sidebar-light": "#ffffff",
        "sidebar-dark": "#262622",
        "accent-green": "#e3e8e1",
        "accent-green-dark": "#3a4138",
      },
      fontFamily: {
        display: ["Crimson Pro", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
      },
    },
  },
}
```

### Required Font Imports

```html
<link
  href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@600;700&family=Inter:wght@400;500;600"
  rel="stylesheet"
/>
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  rel="stylesheet"
/>
```

### Component Organization

- Use existing `AppButton.vue` for primary button
- Use existing `AppInput.vue` for search input
- Use existing `AppCard.vue` for card containers
- Use existing `AppIcon.vue` for Material Symbols integration
- Create new `MemberAvatar.vue` for avatar display
- Create new `MemberTable.vue` for table layout
- Create new `Pagination.vue` for pagination controls
