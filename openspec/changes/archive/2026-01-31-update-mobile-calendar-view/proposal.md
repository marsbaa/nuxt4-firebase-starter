# Proposal: Improve Mobile Calendar Experience

## Why

On mobile devices, the current monthly grid calendar becomes too dense and visually compressed. Events are reduced to small indicators or icons, making it difficult for pastors to understand what is happening at a glance. This limits the calendar’s effectiveness as a tool for noticing upcoming moments, holding communal rhythms in mind, and anticipating significant dates in pastoral life.

The calendar serves as a shared awareness surface—not a task manager—and should support how pastors naturally think about time: **day by day, week by week**, especially on mobile devices where interactions are brief and frequent.

---

## What Changes

- Introduce a **weekly vertical view** as the **primary mobile calendar experience** (devices < 768px)
- Display one week at a time, with days listed vertically in sequence
- Group events under each day, showing name, time, and contextual labels
- Retain the monthly view as a **secondary, contextual option**, accessible via toggle
- Preserve all existing event types, language, and pastoral tone
- No changes to desktop or tablet experiences
- No introduction of task, agenda, or reminder-style patterns

The design supports calm scrolling and readability, favouring awareness and anticipation over scheduling or task completion.

---

## Impact

- **Affected specs:** `care-calendar`
- **Affected code:**
  - `app/components/CareCalendar.vue` – View detection and toggle
  - `app/components/CalendarMonthView.vue` – Mobile layout adjustments
  - `app/components/CalendarWeekView.vue` – New primary mobile view
  - `app/pages/calendar.vue` – Responsive view coordination

- **User impact:** Improved mobile readability and awareness without disrupting desktop experience
- **Risk level:** Low
  - No breaking changes
  - Desktop calendar remains unchanged
  - Existing data and events reused
  - Progressive enhancement pattern

---

## Design Principles Alignment

This change preserves:

- Existing calendar meaning, tone, and language
- Pastoral, non-urgent posture
- Event types and semantics
- Desktop and tablet experiences

It enhances:

- Mobile readability through vertical flow over dense grids
- Calm, spacious layouts on small screens
- Brief, repeated mobile check-ins
- Natural day-by-day awareness
