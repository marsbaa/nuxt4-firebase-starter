<script setup lang="ts">
import type { CalendarEvent } from "~/types/calendarEvents";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
  eachDayOfInterval,
} from "date-fns";

interface Props {
  /** Calendar events to display in the weekly view */
  events: CalendarEvent[];
}

const props = defineProps<Props>();

// Emit events for parent component
const emit = defineEmits<{
  "event-click": [event: CalendarEvent];
}>();

// Current week start date (state)
const currentWeekStart = ref<Date>(
  startOfWeek(new Date(), { weekStartsOn: 0 }),
); // Sunday

// Computed: Week range for display (e.g., "Nov 3 - 9")
const weekRangeLabel = computed(() => {
  const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 0 });

  // If same month
  if (currentWeekStart.value.getMonth() === weekEnd.getMonth()) {
    return `${format(currentWeekStart.value, "MMM d")} - ${format(weekEnd, "d")}`;
  }

  // Different months
  return `${format(currentWeekStart.value, "MMM d")} - ${format(weekEnd, "MMM d")}`;
});

// Computed: Month and year for header (e.g., "November 2024")
const monthYearLabel = computed(() => {
  return format(currentWeekStart.value, "MMMM yyyy");
});

// Computed: Array of 7 days in the current week
const weekDays = computed(() => {
  const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: currentWeekStart.value, end: weekEnd });
});

// Computed: Group events by day
const eventsByDay = computed(() => {
  const grouped = new Map<string, CalendarEvent[]>();

  weekDays.value.forEach((day: Date) => {
    const dayKey = format(day, "yyyy-MM-dd");
    grouped.set(dayKey, []);
  });

  props.events.forEach((event) => {
    // Convert Firestore Timestamp to Date
    const eventDate = event.date.toDate();
    const dayKey = format(eventDate, "yyyy-MM-dd");

    if (grouped.has(dayKey)) {
      grouped.get(dayKey)!.push(event);
    }
  });

  // Sort events by date within each day
  grouped.forEach((dayEvents) => {
    dayEvents.sort(
      (a, b) => a.date.toDate().getTime() - b.date.toDate().getTime(),
    );
  });

  return grouped;
});

// Navigate to previous week
const goToPreviousWeek = () => {
  currentWeekStart.value = subWeeks(currentWeekStart.value, 1);
};

// Navigate to next week
const goToNextWeek = () => {
  currentWeekStart.value = addWeeks(currentWeekStart.value, 1);
};

// Handle event click
const handleEventClick = (event: CalendarEvent) => {
  emit("event-click", event);
};

// Get contextual label for event type
const getEventLabel = (event: CalendarEvent): string => {
  switch (event.type) {
    case "community-gathering":
      return "Communal Rhythm";
    case "member-milestone":
      return "Member Milestone";
    case "care-reminder":
      return "Care Reminder";
    case "care-update":
      return "Care Update";
    case "liturgical-event":
      return "Liturgical Event";
    default:
      return "";
  }
};

// Get formatted time for event
const getEventTime = (event: CalendarEvent): string | null => {
  const eventDate = event.date.toDate();
  const hours = eventDate.getHours();
  const minutes = eventDate.getMinutes();

  // If time is midnight (00:00), assume it's an all-day event
  if (hours === 0 && minutes === 0) {
    return null;
  }

  return format(eventDate, "h:mm a");
};

// Get icon for event type
const getEventIcon = (event: CalendarEvent): string => {
  switch (event.type) {
    case "community-gathering":
      return "mdi:account-group";
    case "member-milestone":
      return "mdi:cake-variant";
    case "care-reminder":
      return "mdi:bell-outline";
    case "care-update":
      return "mdi:note-text-outline";
    case "liturgical-event":
      return "mdi:church";
    default:
      return "mdi:calendar";
  }
};

// Check if day is today
const isDayToday = (day: Date): boolean => {
  return isToday(day);
};
</script>

<template>
  <div class="calendar-week-view">
    <!-- Header: Month/Year and Navigation -->
    <div class="week-header">
      <button
        class="nav-btn nav-btn--prev"
        aria-label="Previous week"
        @click="goToPreviousWeek"
      >
        <Icon name="mdi:chevron-left" class="nav-icon" />
      </button>

      <div class="header-center">
        <h2 class="month-year-title">{{ monthYearLabel }}</h2>
      </div>

      <button
        class="nav-btn nav-btn--next"
        aria-label="Next week"
        @click="goToNextWeek"
      >
        <Icon name="mdi:chevron-right" class="nav-icon" />
      </button>
    </div>

    <!-- Week Range Selector -->
    <div class="week-range-selector">
      <span class="week-range-label">{{ weekRangeLabel }}</span>
    </div>

    <!-- Week Days List -->
    <div class="week-days-list">
      <div
        v-for="day in weekDays"
        :key="format(day, 'yyyy-MM-dd')"
        class="day-section"
        :class="{ 'is-today': isDayToday(day) }"
      >
        <!-- Day Header -->
        <div class="day-header">
          <div class="day-number">{{ format(day, "dd") }}</div>
          <div class="day-name">{{ format(day, "EEEE").toUpperCase() }}</div>
        </div>

        <!-- Events for this day -->
        <div
          v-if="eventsByDay.get(format(day, 'yyyy-MM-dd'))?.length"
          class="day-events"
        >
          <div
            v-for="event in eventsByDay.get(format(day, 'yyyy-MM-dd'))"
            :key="event.id"
            class="event-card"
            :class="`event-card--${event.type}`"
            @click="handleEventClick(event)"
          >
            <div class="event-card-icon">
              <Icon :name="getEventIcon(event)" class="event-icon" />
            </div>
            <div class="event-card-content">
              <div class="event-name">{{ event.title }}</div>
              <div class="event-meta">
                <span class="event-label">{{ getEventLabel(event) }}</span>
                <template v-if="getEventTime(event)">
                  <span class="event-meta-divider">•</span>
                  <span class="event-time">{{ getEventTime(event) }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500&family=Work+Sans:wght@400;500;600&display=swap");

.calendar-week-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

/* Header */
.week-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.month-year-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #1a1a1a;
  margin: 0;
  text-align: center;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  min-width: 2.75rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #706c64;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(112, 108, 100, 0.08);
  color: #2d2a26;
}

.nav-btn:active {
  transform: scale(0.95);
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Week Range Selector */
.week-range-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
  margin: 0 auto;
  max-width: 12rem;
}

.week-range-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d2a26;
  letter-spacing: 0.01em;
}

/* Week Days List */
.week-days-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Day Section */
.day-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.day-section.is-today .day-number {
  color: #5f7d5c;
}

/* Day Header */
.day-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.day-number {
  font-family: "Crimson Pro", serif;
  font-size: 2rem;
  font-weight: 300;
  color: #c0c0c0;
  line-height: 1;
  min-width: 3rem;
}

.day-name {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: #999999;
  letter-spacing: 0.05em;
  padding-top: 0.25rem;
}

/* Day Events */
.day-events {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 3.75rem;
}

/* Event Card */
.event-card {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 3.5rem;
}

.event-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(44, 44, 42, 0.08);
}

.event-card:active {
  transform: translateY(0);
}

/* Event type styling - Community Gatherings */
.event-card--community-gathering {
  background: rgba(169, 193, 205, 0.12);
  border: 1px solid rgba(169, 193, 205, 0.25);
}

.event-card--community-gathering:hover {
  background: rgba(169, 193, 205, 0.18);
  border-color: rgba(169, 193, 205, 0.35);
}

.event-card--community-gathering .event-icon {
  color: #5a7a8c;
}

/* Member Milestones */
.event-card--member-milestone {
  background: rgba(207, 184, 203, 0.12);
  border: 1px solid rgba(207, 184, 203, 0.25);
}

.event-card--member-milestone:hover {
  background: rgba(207, 184, 203, 0.18);
  border-color: rgba(207, 184, 203, 0.35);
}

.event-card--member-milestone .event-icon {
  color: #8b6d88;
}

/* Care Reminders */
.event-card--care-reminder {
  background: rgba(122, 155, 118, 0.12);
  border: 1px solid rgba(122, 155, 118, 0.25);
}

.event-card--care-reminder:hover {
  background: rgba(122, 155, 118, 0.18);
  border-color: rgba(122, 155, 118, 0.35);
}

.event-card--care-reminder .event-icon {
  color: #5f7d5c;
}

/* Care Updates */
.event-card--care-update {
  background: rgba(191, 174, 157, 0.12);
  border: 1px solid rgba(191, 174, 157, 0.25);
}

.event-card--care-update:hover {
  background: rgba(191, 174, 157, 0.18);
  border-color: rgba(191, 174, 157, 0.35);
}

.event-card--care-update .event-icon {
  color: #8c7a6a;
}

/* Liturgical Events */
.event-card--liturgical-event {
  background: rgba(217, 188, 155, 0.12);
  border: 1px solid rgba(217, 188, 155, 0.25);
}

.event-card--liturgical-event:hover {
  background: rgba(217, 188, 155, 0.18);
  border-color: rgba(217, 188, 155, 0.35);
}

.event-card--liturgical-event .event-icon {
  color: #9c8b7a;
}

/* Event Card Content */
.event-card-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding-top: 0.125rem;
}

.event-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.event-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.event-name {
  font-family: "Work Sans", sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.4;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.8125rem;
  color: #666666;
  line-height: 1.3;
}

.event-label {
  font-weight: 400;
}

.event-meta-divider {
  color: #999999;
}

.event-time {
  font-weight: 400;
}

/* Responsive - Larger mobile */
@media (min-width: 375px) {
  .month-year-title {
    font-size: 1.625rem;
  }

  .day-number {
    font-size: 2.125rem;
  }
}

/* Responsive - Tablet and up (hide on desktop as fallback) */
@media (min-width: 768px) {
  .calendar-week-view {
    max-width: 48rem;
    margin: 0 auto;
  }
}
</style>
