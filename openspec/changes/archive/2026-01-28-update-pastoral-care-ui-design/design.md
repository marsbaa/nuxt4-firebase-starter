# Pastoral Care UI Design Specification

## Context

The Pastoral Care App serves pastors, chaplains, care coordinators, and ministry leaders who provide spiritual and emotional support. These users frequently work with:

- Sensitive conversations and confidential information
- People experiencing personal struggles or crises
- Long-term relational care relationships
- Emotional and spiritual weight

The current UI uses a generic starter template aesthetic that feels corporate, busy, and transactional. This creates a mismatch between the interface and the sacred, vulnerable nature of pastoral care work.

### Design Constraints

- **No functional changes**: All existing features, pages, and flows remain identical
- **Tailwind CSS only**: Use existing Tailwind configuration and utility classes
- **Component structure**: Maintain current component architecture
- **Responsive design**: Preserve mobile, tablet, and desktop responsiveness
- **Accessibility**: Meet or exceed current WCAG 2.1 AA standards

### Success Criteria

The UI should evoke:

- **Calm** (not busy or overwhelming)
- **Warmth** (not cold or corporate)
- **Safety** (not technical or sterile)
- **Humanity** (not transactional or automated)
- **Trust** (not aggressive or sales-oriented)

Users should feel: "This is a safe, calm, trustworthy space for caring for people."

## Goals / Non-Goals

### Goals

1. **Create visual calm**: Reduce visual noise, increase breathing room, soften colors and edges
2. **Establish warmth**: Use earth tones, gentle curves, and approachable typography
3. **Support focus**: Clear hierarchy, generous spacing, purposeful contrast
4. **Communicate care**: Language and visual elements that acknowledge the weight of pastoral work
5. **Build trust**: Professional but human, structured but flexible, clear but gentle

### Non-Goals

1. **NOT** adding features, analytics, or productivity metrics
2. **NOT** creating new pages, routes, or workflows
3. **NOT** implementing gamification, achievement systems, or engagement mechanics
4. **NOT** using bright, energetic, or playful design language
5. **NOT** adopting trendy, flashy, or "modern startup" aesthetics

## Design Decisions

### 1. Color Palette

**Decision**: Replace standard blue-based palette with warm, pastoral earth tones.

**Primary Palette**:

- **Primary**: Soft sage green (`#7A9B76` / `slate-600` alternative) - Growth, peace, hope
- **Secondary**: Warm taupe (`#9C8B7A` / `stone-500` alternative) - Stability, grounding, warmth
- **Accent**: Gentle gold (`#C9A961` / `amber-600` alternative) - Light, guidance, value

**Neutral Palette**:

- **Background**: Warm off-white (`#FAFAF8` / `stone-50`) - Soft, paper-like
- **Surface**: Lightest warm gray (`#F5F5F3` / `stone-100`) - Subtle elevation
- **Text primary**: Deep charcoal (`#2C2C2A` / `stone-800`) - Readable, not harsh
- **Text secondary**: Medium gray (`#6B6B68` / `stone-600`) - Softer information
- **Borders**: Subtle warm gray (`#E8E8E5` / `stone-200`) - Gentle separation

**Semantic Colors** (softened):

- **Success**: Gentle green (`#6B9B6A` / `green-600`) - Soft affirmation
- **Warning**: Warm amber (`#D4A574` / `amber-500`) - Gentle caution
- **Error**: Muted terracotta (`#C67B6B` / `red-400`) - Dignified alert
- **Info**: Soft blue-gray (`#7B93A8` / `slate-500`) - Calm information

**Rationale**: Earth tones are naturally calming and associated with growth, stability, and nature—appropriate metaphors for spiritual care. Avoid pure blacks and whites for softer contrast. Avoid bright, saturated colors that feel energetic or commercial.

**Alternatives Considered**:

- Pure grayscale: Too sterile and clinical
- Purple/spiritual colors: Too on-the-nose, potentially exclusive
- Blue corporate palette: Already in place, too business-like

### 2. Typography

**Decision**: Use softer, more humanist typeface styling with generous spacing.

**Tailwind Font Configuration**:

- **Sans-serif**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif`
- Prefer system fonts for performance and familiarity
- Consider adding Google Font "Inter" or "Source Sans Pro" for consistent warmth

**Type Scale**:

- **Headings**: Use `font-medium` (500) instead of `font-bold` (700) for softness
- **Body**: Default `font-normal` (400), comfortable 16px base
- **Small text**: 14px minimum for accessibility

**Line Height**:

- Headings: `leading-relaxed` (1.625) for breathing room
- Body: `leading-loose` (2) for comfortable reading
- Dense content: `leading-relaxed` minimum (1.625)

**Letter Spacing**:

- Headings: `tracking-wide` (0.025em) for openness
- Body: Default tracking
- All caps (avoid): `tracking-wider` if necessary

**Rationale**: Softer font weights feel less authoritative and more approachable. Generous spacing improves readability and reduces visual density. System fonts ensure consistent rendering and performance.

**Alternatives Considered**:

- Serif fonts: Too formal or academic for app interface
- Bold headings: Too aggressive and corporate
- Tight spacing: Increases cognitive load

### 3. Spacing and Layout

**Decision**: Significantly increase whitespace and component breathing room.

**Spacing Scale**:

- **Section gaps**: `space-y-12` (3rem) or `space-y-16` (4rem) between major sections
- **Component gaps**: `space-y-6` (1.5rem) or `space-y-8` (2rem) within sections
- **Element gaps**: `space-y-4` (1rem) for related elements
- **Padding**: Use `p-6` or `p-8` for cards instead of `p-4`
- **Max width**: Use `max-w-4xl` for content areas (not full width)

**Container Strategy**:

- Center content with generous side margins on larger screens
- Use `container mx-auto px-4` with comfortable max-widths
- Avoid edge-to-edge content that feels cramped

**Visual Density**:

- Reduce items per row (prefer 1-2 columns over 3-4)
- Increase card heights for breathing room
- Use vertical layouts where possible for flow

**Rationale**: Whitespace creates visual calm and directs attention. Users dealing with emotional content need space to think and process. Generous padding makes interactive elements easier to target.

**Alternatives Considered**:

- Dense layouts: Overwhelming and anxiety-inducing
- Minimal spacing: Feels cramped and rushed
- Full-width layouts: Hard to read and feels corporate

### 4. Component Styling

**Decision**: Soften all component appearances with gentle curves, subtle shadows, and muted borders.

**Borders and Corners**:

- **Border radius**: Use `rounded-lg` (0.5rem) or `rounded-xl` (0.75rem) for cards
- **Input radius**: Use `rounded-md` (0.375rem) for form elements
- **Button radius**: Use `rounded-lg` for primary actions
- **Border width**: Use `border` (1px) not `border-2` for subtlety
- **Border color**: Use warm neutrals (`border-stone-200`)

**Shadows**:

- **Cards**: `shadow-sm` (subtle) for resting state
- **Hover**: `shadow-md` (gentle lift) for interactivity
- **Modals**: `shadow-lg` (clear elevation) for focus
- **Avoid**: Heavy shadows (`shadow-2xl`) that feel dramatic

**Interactive States**:

- **Hover**: Subtle background color shift, gentle shadow increase
- **Active**: Minimal visual change (no harsh press effects)
- **Focus**: Soft ring in primary color (`ring-2 ring-sage-600 ring-offset-2`)
- **Disabled**: Reduced opacity (50%) with subtle grayscale

**Buttons**:

- **Primary**: Solid primary color, medium padding, soft shadow
- **Secondary**: Outline style with border, transparent background
- **Ghost**: Text only with hover background
- **Icon buttons**: Square or circular with subtle hover state

**Cards**:

- Background: White or very light surface color
- Padding: Generous (`p-6` or `p-8`)
- Border: Subtle (`border border-stone-200`)
- Shadow: Very subtle (`shadow-sm`)

**Rationale**: Softened elements feel approachable and safe. Sharp corners and hard shadows create tension. Subtle interactivity respects the user's focus and doesn't demand attention.

**Alternatives Considered**:

- Sharp corners: Too technical and sterile
- Heavy shadows: Too dramatic and commercial
- Flat design: Too stark without depth cues

### 5. Icon System

**Decision**: Use softer, more organic icon styling that feels human and approachable.

**Icon Guidelines**:

- **Stroke weight**: Use regular weight (1.5px-2px) not bold
- **Style**: Prefer rounded/curved over sharp/angular
- **Size**: Use comfortable sizes (20px-24px for UI, 16px minimum)
- **Color**: Match text colors (primary/secondary gray) for cohesion

**Icon Set**:

- Continue using Iconify with Heroicons or similar rounded icon sets
- Avoid geometric/sharp icon families (material icons sharp)
- Consider: Heroicons outline, Feather icons, or similar rounded sets

**Symbolic Choices**:

- **Dashboard**: Home or layout icons (welcoming)
- **Profile**: User circle (personal, not ID card)
- **Settings**: Gear or sliders (functionality, not complexity)
- **Logout**: Door or arrow (gentle exit, not termination)

**Usage**:

- Always provide sufficient padding around icons
- Use icons to support text, not replace it
- Maintain consistent sizing within contexts

**Rationale**: Softer icons feel less technical and more human. Rounded strokes echo the gentle curve language throughout the design. Icons should clarify, not decorate.

**Alternatives Considered**:

- Bold icons: Too heavy and demanding attention
- Sharp geometric: Too technical and industrial
- Minimalist icons: Can feel cold without warmth

### 6. Navigation Design

**Decision**: Create calm, clear navigation that feels like gentle guidance, not system control.

**Sidebar Navigation** (if applicable):

- Background: Subtle warm surface color (`bg-stone-50`)
- Active state: Soft primary color background with rounded corners
- Hover state: Gentle background color shift
- Icons: Rounded, comfortable size (24px)
- Spacing: Generous padding between items (`py-3`)

**Top Navigation** (if applicable):

- Height: Comfortable (`h-16` or `h-20`) not cramped
- Background: White or very light surface
- Shadow: Very subtle bottom border or shadow
- User menu: Clear but unobtrusive

**Mobile Navigation**:

- Menu toggle: Soft icon, comfortable tap target
- Drawer: Smooth animation, gentle overlay
- Close action: Easy to find and use

**Active State Indicators**:

- Soft color background instead of bold borders
- Subtle icon color change
- Gentle highlight, not aggressive selection

**Rationale**: Navigation should orient users without demanding attention. Soft backgrounds and gentle highlights guide without shouting. Clear hierarchy helps users understand where they are.

**Alternatives Considered**:

- Bold active states: Too aggressive and demanding
- Minimal indicators: Can be confusing and unclear
- Colorful highlights: Can feel playful or trivial

### 7. Form Design

**Decision**: Create calm, clear forms that feel supportive and non-judgmental.

**Form Inputs**:

- Height: Comfortable (`h-11` or `h-12`) for easy interaction
- Padding: Generous (`px-4 py-3`)
- Border: Subtle in resting state (`border-stone-300`)
- Focus: Soft ring in primary color
- Background: White or very light surface

**Labels**:

- Position: Above input for clarity
- Weight: Medium (`font-medium`) for emphasis
- Color: Primary text color
- Spacing: Comfortable margin below (`mb-2`)

**Error States**:

- Color: Muted terracotta (not bright red)
- Message: Gentle, supportive language
- Icon: Optional, not aggressive (soft alert icon)
- Border: Soft error color, not harsh

**Helper Text**:

- Color: Secondary text color
- Size: Slightly smaller than input text
- Tone: Supportive and explanatory

**Validation**:

- Real-time: Gentle, non-intrusive
- Success states: Subtle (avoid aggressive green checkmarks)
- Error messages: Specific, helpful, respectful

**Rationale**: Forms are often points of friction and anxiety. Gentle styling and supportive language reduce stress. Clear labeling and spacing reduce errors.

**Alternatives Considered**:

- Minimal forms: Can be unclear and frustrating
- Bright error colors: Increase anxiety and feel punitive
- Inline validation: Can be distracting while typing

### 8. Content Tone and Language

**Decision**: Use warm, respectful, human language that acknowledges the weight of pastoral work.

**Voice Characteristics**:

- **Calm**: Use complete sentences, avoid urgency or exclamations
- **Respectful**: Use dignified language, avoid casual slang
- **Supportive**: Frame as help, not demands or requirements
- **Clear**: Be specific and direct without being cold
- **Human**: Acknowledge emotions and difficulty when appropriate

**Examples**:

❌ **Avoid**:

- "Boost your productivity!"
- "Manage your contacts"
- "Track your metrics"
- "Maximize engagement"

✅ **Prefer**:

- "Welcome back, [Name]"
- "Care for those you serve"
- "Connect with your community"
- "Support people well"

**Button Text**:

- ❌ "Submit", "Execute", "Process"
- ✅ "Save changes", "Continue", "Update profile"

**Error Messages**:

- ❌ "Invalid input", "Error 404", "Failed"
- ✅ "Please check your email address", "We couldn't find that page", "Something went wrong—please try again"

**Empty States**:

- ❌ "No data found", "Empty list"
- ✅ "You haven't added any contacts yet", "This space is ready when you are"

**Rationale**: Language shapes perception and emotion. Corporate, transactional language creates distance. Warm, human language builds trust and reduces anxiety in sensitive contexts.

**Alternatives Considered**:

- Casual/friendly tone: Can feel inappropriate for serious contexts
- Minimal text: Can feel cold or unclear
- Religious language: May exclude or assume specific traditions

## Risks / Trade-offs

### Risk: Warmth Perceived as Unprofessional

**Mitigation**:

- Maintain clarity and structure—warmth comes from tone, not lack of organization
- Use professional language that's warm, not casual or cute
- Test with actual pastors and care workers for feedback
- Balance softness with competence through clear information hierarchy

### Risk: Increased Spacing Reduces Information Density

**Mitigation**:

- Users working with sensitive content benefit from focus over density
- Important information remains above the fold with proper hierarchy
- Scrolling is acceptable when content is clear and purposeful
- Consider progressive disclosure for dense information

### Risk: Soft Colors May Reduce Contrast/Accessibility

**Mitigation**:

- Test all color combinations against WCAG 2.1 AA standards
- Ensure text meets 4.5:1 contrast ratio minimum
- Provide sufficient color contrast for interactive elements
- Use color plus other indicators (icons, spacing) for meaning

### Risk: Subjectivity of "Calm" and "Warm"

**Mitigation**:

- Base decisions on research about calming design principles
- Test with target users (pastors, chaplains, care workers)
- Iterate based on feedback, not assumptions
- Document rationale for decisions to guide future updates

## Migration Plan

### Phase 1: Theme Configuration

1. Update [`tailwind.config.ts`](tailwind.config.ts) with new color palette
2. Define custom spacing scale if needed
3. Configure font settings and line heights
4. Test theme changes in isolation

### Phase 2: Base Components

1. Update [`AppButton.vue`](app/components/AppButton.vue) styling
2. Update [`AppInput.vue`](app/components/AppInput.vue) styling
3. Update [`AppCard.vue`](app/components/AppCard.vue) styling
4. Update [`AppAlert.vue`](app/components/AppAlert.vue) styling
5. Test components in isolation with new theme

### Phase 3: Layout Updates

1. Update [`app/layouts/dashboard.vue`](app/layouts/dashboard.vue) navigation styling
2. Adjust spacing and layout structure
3. Test layout on mobile, tablet, and desktop

### Phase 4: Page Updates

1. Update authentication pages ([`login.vue`](app/pages/login.vue), [`register.vue`](app/pages/register.vue))
2. Update [`dashboard.vue`](app/pages/dashboard.vue) home page
3. Update [`profile.vue`](app/pages/profile.vue) and [`settings.vue`](app/pages/settings.vue)
4. Update language and copy throughout

### Phase 5: Polish and Testing

1. Comprehensive accessibility audit
2. Cross-browser testing
3. Responsive design verification
4. User feedback collection from target audience

### Rollback Strategy

- All changes are CSS/styling—can revert Git commits easily
- No database migrations or data changes required
- No API or backend changes to coordinate
- Tailwind configuration changes are isolated and reversible

## Open Questions

1. **Font Selection**: Should we add a custom Google Font (Inter, Source Sans Pro) or rely on system fonts?
   - _Recommendation_: Start with system fonts, add custom font only if needed for brand consistency

2. **Logo/Branding**: Does the application have a logo or brand identity to incorporate?
   - _Recommendation_: Defer branding decisions to separate initiative, focus on UI foundation

3. **User Customization**: Should users have theme preferences (dark mode, color choices)?
   - _Recommendation_: Out of scope for this update, consider for future enhancement

4. **Iconography**: Is there existing iconography or brand guidelines to follow?
   - _Recommendation_: Use Heroicons outline set as default, document for consistency

5. **Accessibility Standards**: Are there specific compliance requirements beyond WCAG 2.1 AA?
   - _Recommendation_: Default to WCAG 2.1 AA, document any additional requirements

6. **Testing Approach**: What is the preferred method for user testing with target audience?
   - _Recommendation_: Arrange feedback sessions with 3-5 pastors/care workers post-implementation
