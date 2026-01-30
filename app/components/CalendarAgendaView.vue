<script setup lang="ts">
import type { CalendarEvent } from "~/types/calendarEvents";

interface Props {
  /** Array of calendar events to display */
  events: readonly CalendarEvent[];
  /** Loading state */
  loading?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  eventClick: [event: CalendarEvent];
}>();

/**
 * Get the start of the week (Sunday) for a given date
 */
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = day; // Days from Sunday
  d.setDate(d.getDate() - diff);
  return d;
};

/**
 * Get the end of the week (Saturday) for a given date
 */
const getWeekEnd = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = 6 - day; // Days to Saturday
  d.setDate(d.getDate() + diff);
  return d;
};

/**
 * Create a local date key string from a Date object
 * Format: YYYY-MM-DD in local timezone
 */
const getLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Group events by week (Sunday to Saturday)
 * Returns a Map where keys are week start date strings and values are arrays of events
 */
const groupedEvents = computed(() => {
  const groups = new Map<string, CalendarEvent[]>();

  props.events.forEach((event) => {
    const date = event.date.toDate();
    const weekStart = getWeekStart(date);
    const weekKey = getLocalDateKey(weekStart);

    if (!groups.has(weekKey)) {
      groups.set(weekKey, []);
    }
    groups.get(weekKey)!.push(event);
  });

  return groups;
});

/**
 * Get sorted week groups for display
 * Returns array of [weekKey, events[]] sorted by week start date
 * Events within each week are also sorted by their actual date
 */
const sortedDateGroups = computed(() => {
  return Array.from(groupedEvents.value.entries())
    .sort(([weekA], [weekB]) => weekA.localeCompare(weekB))
    .map(([weekKey, events]) => {
      // Sort events within the week by their actual date
      const sortedEvents = [...events].sort((a, b) => {
        const dateA = a.date.toDate().getTime();
        const dateB = b.date.toDate().getTime();
        return dateA - dateB;
      });
      return [weekKey, sortedEvents] as [string, CalendarEvent[]];
    });
});

/**
 * Format week range for group header
 * e.g., "January 4-10, 2026" or "December 29, 2025 - January 4, 2026" (for weeks spanning months/years)
 */
const formatDateHeader = (weekStartString: string): string => {
  // Parse the local date key (YYYY-MM-DD)
  const [yearStr, monthStr, dayStr] = weekStartString.split("-");
  const weekStart = new Date(
    parseInt(yearStr!),
    parseInt(monthStr!) - 1,
    parseInt(dayStr!),
  );
  const weekEnd = getWeekEnd(weekStart);

  const startMonth = weekStart.toLocaleDateString("en-US", { month: "long" });
  const startDay = weekStart.getDate();
  const startYear = weekStart.getFullYear();

  const endMonth = weekEnd.toLocaleDateString("en-US", { month: "long" });
  const endDay = weekEnd.getDate();
  const endYear = weekEnd.getFullYear();

  // Same month and year
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay}–${endDay}, ${startYear}`;
  }
  // Same year, different months
  else if (startYear === endYear) {
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
  }
  // Different years
  else {
    return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
  }
};

/**
 * Get icon name for event type
 */
const getEventIcon = (type: CalendarEvent["type"]): string => {
  const iconMap: Record<CalendarEvent["type"], string> = {
    "community-gathering": "mdi:calendar-star",
    "member-milestone": "mdi:cake-variant",
    "care-reminder": "mdi:bell-outline",
    "care-update": "mdi:heart-outline",
    "liturgical-event": "mdi:book-cross",
  };
  return iconMap[type];
};

/**
 * Format event date to show day of week and date
 * e.g., "Monday, Jan 5"
 */
const formatEventDate = (event: CalendarEvent): string => {
  const date = event.date.toDate();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

/**
 * Handle event click - emit to parent for navigation
 */
const handleEventClick = (event: CalendarEvent) => {
  emit("eventClick", event);
};

/**
 * Check if the current week contains today
 */
const isCurrentWeek = (weekStartString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse the local date key (YYYY-MM-DD)
  const [yearStr, monthStr, dayStr] = weekStartString.split("-");
  const weekStart = new Date(
    parseInt(yearStr!),
    parseInt(monthStr!) - 1,
    parseInt(dayStr!),
  );
  const weekEnd = getWeekEnd(weekStart);
  return today >= weekStart && today <= weekEnd;
};

/**
 * Check if a week is in the past (week end is before today)
 */
const isPast = (weekStartString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse the local date key (YYYY-MM-DD)
  const [yearStr, monthStr, dayStr] = weekStartString.split("-");
  const weekStart = new Date(
    parseInt(yearStr!),
    parseInt(monthStr!) - 1,
    parseInt(dayStr!),
  );
  const weekEnd = getWeekEnd(weekStart);
  return weekEnd < today;
};
</script>

<template>
  <div class="agenda-view">
    <!-- Loading State -->
    <div v-if="loading" class="agenda-loading">
      <Icon name="mdi:loading" class="loading-icon" />
      <p class="loading-text">Loading events...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="sortedDateGroups.length === 0" class="agenda-empty">
      <Icon name="mdi:calendar-blank-outline" class="empty-icon" />
      <h3 class="empty-heading">A quiet season</h3>
      <p class="empty-message">
        No events appear in this view. Consider adding a community gathering or
        adjusting your filters.
      </p>
    </div>

    <!-- Agenda List -->
    <div v-else class="agenda-list">
      <div
        v-for="[dateKey, dateEvents] in sortedDateGroups"
        :key="dateKey"
        class="agenda-group"
      >
        <!-- Week Header -->
        <div
          class="date-header"
          :class="{
            'date-header--today': isCurrentWeek(dateKey),
            'date-header--past': isPast(dateKey),
          }"
        >
          <span class="date-label">{{ formatDateHeader(dateKey) }}</span>
          <span v-if="isCurrentWeek(dateKey)" class="today-badge"
            >This Week</span
          >
        </div>

        <!-- Events for this date -->
        <div class="events-list">
          <div
            v-for="event in dateEvents"
            :key="event.id"
            class="agenda-event"
            :class="`agenda-event--${event.type}`"
            @click="handleEventClick(event)"
            role="button"
            tabindex="0"
            @keypress.enter="handleEventClick(event)"
            @keypress.space.prevent="handleEventClick(event)"
          >
            <div class="event-marker">
              <Icon :name="getEventIcon(event.type)" class="event-icon" />
            </div>
            <div class="event-content">
              <div class="event-header">
                <h4 class="event-title">{{ event.title }}</h4>
                <span class="event-date">{{ formatEventDate(event) }}</span>
              </div>
              <p v-if="event.description" class="event-description">
                {{ event.description }}
              </p>
              <div v-if="event.memberName" class="event-meta">
                <Icon name="mdi:account-outline" class="meta-icon" />
                <span class="meta-text">{{ event.memberName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pastoral Tagline -->
    <div v-if="sortedDateGroups.length > 0" class="agenda-footer">
      <p class="footer-tagline">Grace in every shared moment</p>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

.agenda-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 400px;
}

/* Loading State */
.agenda-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
}

.loading-icon {
  width: 2rem;
  height: 2rem;
  color: #9c8b7a;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  color: #706c64;
  margin: 0;
}

/* Empty State */
.agenda-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #d9bc9b;
  opacity: 0.4;
}

.empty-heading {
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0;
}

.empty-message {
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  color: #706c64;
  margin: 0;
  max-width: 400px;
  line-height: 1.6;
}

/* Agenda List */
.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Agenda Group (events by date) */
.agenda-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Date Header */
.date-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e8e8e5;
}

.date-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  font-weight: 600;
  color: #2d2a26;
}

.date-header--today .date-label {
  color: #5f7d5c;
}

.date-header--past .date-label {
  color: #9c8b7a;
}

.today-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #5f7d5c;
  background: rgba(122, 155, 118, 0.1);
  border: 1px solid rgba(122, 155, 118, 0.2);
  border-radius: 12px;
}

/* Events List */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 1rem;
}

/* Individual Agenda Event */
.agenda-event {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-left-width: 3px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.agenda-event:hover {
  box-shadow: 0 2px 8px rgba(44, 44, 42, 0.08);
  transform: translateX(4px);
}

.agenda-event:focus {
  outline: 2px solid rgba(122, 155, 118, 0.5);
  outline-offset: 2px;
}

/* Event type border colors */
.agenda-event--member-milestone {
  border-left-color: #cfb8cb;
}

.agenda-event--community-gathering {
  border-left-color: #a9c1cd;
}

.agenda-event--liturgical-event {
  border-left-color: #d9bc9b;
}

.agenda-event--care-reminder {
  border-left-color: #7a9b76;
}

.agenda-event--care-update {
  border-left-color: #bfae9d;
}

/* Event Marker */
.event-marker {
  display: flex;
  align-items: flex-start;
  flex-shrink: 0;
  padding-top: 0.125rem;
}

.event-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #706c64;
}

.agenda-event--member-milestone .event-icon {
  color: #8b6d88;
}

.agenda-event--community-gathering .event-icon {
  color: #5a7a8c;
}

.agenda-event--liturgical-event .event-icon {
  color: #9c8b7a;
}

.agenda-event--care-reminder .event-icon {
  color: #5f7d5c;
}

.agenda-event--care-update .event-icon {
  color: #8c7a6a;
}

/* Event Content */
.event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.event-title {
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0;
  line-height: 1.4;
}

.event-date {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9c8b7a;
  white-space: nowrap;
}

.event-description {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #706c64;
  margin: 0;
  line-height: 1.5;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #9c8b7a;
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.meta-text {
  line-height: 1;
}

/* Agenda Footer */
.agenda-footer {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  margin-top: 1rem;
  border-top: 1px solid #e8e8e5;
}

.footer-tagline {
  font-family: "Crimson Pro", serif;
  font-size: 0.938rem;
  font-style: italic;
  color: #9c8b7a;
  margin: 0;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .agenda-list {
    gap: 1.5rem;
  }

  .agenda-event {
    padding: 0.875rem;
    gap: 0.875rem;
  }

  .event-title {
    font-size: 0.875rem;
  }

  .event-description {
    font-size: 0.813rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .agenda-view {
    gap: 1rem;
  }

  .agenda-list {
    gap: 1.25rem;
  }

  .events-list {
    padding-left: 0.5rem;
    gap: 0.625rem;
  }

  .agenda-event {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .event-icon {
    width: 1rem;
    height: 1rem;
  }

  .event-title {
    font-size: 0.813rem;
  }

  .event-description {
    font-size: 0.75rem;
  }

  .event-meta {
    font-size: 0.75rem;
  }

  .empty-heading {
    font-size: 1.25rem;
  }

  .empty-message {
    font-size: 0.875rem;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .date-label {
    font-size: 0.875rem;
  }

  .today-badge {
    font-size: 0.688rem;
    padding: 0.188rem 0.5rem;
  }

  .agenda-event {
    padding: 0.625rem;
    gap: 0.625rem;
  }

  .event-title {
    font-size: 0.75rem;
  }

  .event-description {
    font-size: 0.688rem;
  }
}
</style>
