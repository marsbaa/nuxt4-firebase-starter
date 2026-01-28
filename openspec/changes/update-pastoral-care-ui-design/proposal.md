# Pastoral Care UI Design Update

## Why

The current Nuxt 4 + Firebase starter template uses a generic, corporate-style UI that is not appropriate for a pastoral care application. The app will support pastors, chaplains, care coordinators, and ministry leaders who work with sensitive, emotional, and confidential information. The UI needs to reflect the **care-focused, relationship-driven nature** of pastoral work, creating a calm, warm, and safe environment that reduces cognitive load and anxiety.

Users may be dealing with personal struggles, confidential conversations, and emotional weight. The current interface feels transactional and technical, when it should feel like **a quiet room, not an office system**—supporting dignity, trust, and gentle guidance.

## What Changes

This is a **design-only update** that transforms the look and feel of existing UI elements without adding features, pages, or changing functionality.

### Visual Design Changes

- Update color palette from corporate blues to warm, pastoral tones (soft earth tones, gentle neutrals, calming accents)
- Adjust typography for warmth and readability (softer font choices, increased line height, comfortable sizing)
- Increase spacing and whitespace throughout for breathing room and reduced visual density
- Soften component appearance with gentle rounded corners, subtle shadows, and muted borders
- Refine icon styling for softer, more human visual language

### Layout and Component Updates

- **Dashboard navigation**: Maintain structure but update styling for warmth and clarity
- **Welcome banner**: Keep functionality but redesign for gentle, reassuring tone
- **Account summary cards**: Preserve information display but soften visual presentation
- **Quick links**: Maintain navigation but update styling for approachability
- **Authentication pages**: Keep functionality but create calmer, more welcoming experience

### Tone and Language

- Update copy to be reassuring, respectful, and calm (avoiding corporate, transactional, or "SaaS" language)
- Use gentle, supportive language that acknowledges the weight of pastoral work
- Frame features as tools for care rather than productivity metrics

### Design Boundaries

- **NO** new features or functionality
- **NO** new pages or routes
- **NO** changes to authentication or backend logic
- **NO** analytics-style dashboards or productivity metrics
- **ONLY** visual design, layout refinement, and tone adjustments

## Impact

### Affected Capabilities

- **dashboard** - Visual styling, spacing, tone, and component appearance
- **authentication** - Form styling, error messaging tone, welcome experience
- **icon-system** - Icon style guidance for pastoral context

### Affected Code

- [`app/layouts/dashboard.vue`](app/layouts/dashboard.vue) - Dashboard layout styling
- [`app/pages/dashboard.vue`](app/pages/dashboard.vue) - Dashboard home page appearance
- [`app/pages/login.vue`](app/pages/login.vue) - Login page design
- [`app/pages/register.vue`](app/pages/register.vue) - Registration page design
- [`app/pages/profile.vue`](app/pages/profile.vue) - Profile page styling
- [`app/pages/settings.vue`](app/pages/settings.vue) - Settings page appearance
- [`app/components/AppCard.vue`](app/components/AppCard.vue) - Card component styling
- [`app/components/AppButton.vue`](app/components/AppButton.vue) - Button component design
- [`app/components/AppInput.vue`](app/components/AppInput.vue) - Form input styling
- [`app/components/AppAlert.vue`](app/components/AppAlert.vue) - Alert/message styling
- [`tailwind.config.ts`](tailwind.config.ts) - Theme configuration for pastoral design system

### User Experience Impact

- Users will feel **calmer and more supported** in their care work
- The interface will communicate **trust, dignity, and confidentiality**
- Reduced visual noise will **lower cognitive load** during sensitive conversations
- The overall tone will align with the **pastoral, care-focused mission** of the application

### Technical Impact

- **No breaking changes** to functionality or API
- **No database or schema changes**
- **No authentication flow changes**
- Changes are primarily CSS/Tailwind configuration and component styling
- Existing component structure remains intact
