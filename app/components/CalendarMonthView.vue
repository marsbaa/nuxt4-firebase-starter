<script setup lang="ts">
import { ref, computed } from "vue";
import CalendarEvent from "./CalendarEvent.vue";
import CalendarLegend from "./CalendarLegend.vue";
import type { CalendarEvent as CalendarEventType } from "~/types/calendarEvents";

// Props for passing events
interface Props {
  events?: readonly CalendarEventType[];
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
});

// Emit for event clicks
const emit = defineEmits<{
  eventClick: [event: CalendarEventType];
}>();

// Event click handler
const handleEventClick = (event: CalendarEventType) => {
  emit("eventClick", event);
};

// Current displayed month
const currentDate = ref(new Date());

// Get month/year display
const monthYear = computed(() => {
  return currentDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

// Calendar grid generation
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Start from Sunday before the first day
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // Generate 6 weeks (42 days) to ensure full calendar grid
  const days = [];
  const currentDay = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(currentDay),
      day: currentDay.getDate(),
      isCurrentMonth: currentDay.getMonth() === month,
      isToday: isToday(currentDay),
    });
    currentDay.setDate(currentDay.getDate() + 1);
  }

  return days;
});

// Check if a date is today
const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Navigation functions
const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  );
};

// Day names
const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Get icon name for event type
const getEventIcon = (type: CalendarEventType["type"]): string => {
  const iconMap: Record<CalendarEventType["type"], string> = {
    "community-gathering": "mdi:calendar-star",
    "member-milestone": "mdi:cake-variant",
    "care-reminder": "mdi:bell-outline",
    "care-update": "mdi:heart-outline",
    "liturgical-event": "mdi:book-cross",
  };
  return iconMap[type];
};

// Get events for a specific day
const getEventsForDay = (date: Date) => {
  return props.events.filter((event) => {
    const eventDate = event.date.toDate();
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
};
</script>

<template>
  <div class="calendar-month-view">
    <!-- Month Header -->
    <div class="calendar-header">
      <button
        @click="previousMonth"
        class="nav-btn"
        aria-label="Previous month"
      >
        <Icon name="mdi:chevron-left" class="nav-icon" />
      </button>

      <div class="header-content">
        <h2 class="month-title">{{ monthYear }}</h2>
        <p class="calendar-subtitle">LITURGICAL CYCLE • COMMUNAL RHYTHMS</p>
      </div>

      <button @click="nextMonth" class="nav-btn" aria-label="Next month">
        <Icon name="mdi:chevron-right" class="nav-icon" />
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid">
      <!-- Day Names Header -->
      <div
        v-for="dayName in dayNames"
        :key="dayName"
        class="calendar-day-header"
      >
        {{ dayName }}
      </div>

      <!-- Calendar Days -->
      <div
        v-for="day in calendarDays"
        :key="day.date.toISOString()"
        class="calendar-day"
        :class="{
          'is-other-month': !day.isCurrentMonth,
          'is-today': day.isToday,
        }"
      >
        <div class="day-number">
          {{ day.day }}
          <span v-if="day.isToday" class="today-label">TODAY</span>
        </div>

        <!-- Events for this day -->
        <div class="day-events">
          <CalendarEvent
            v-for="event in getEventsForDay(day.date)"
            :key="event.id"
            :title="event.title"
            :type="event.type"
            :icon="getEventIcon(event.type)"
            :member-id="event.memberId"
            @click="handleEventClick(event)"
          />
        </div>
      </div>
    </div>

    <!-- Calendar Legend -->
    <CalendarLegend
      :show-types="[
        'member-milestone',
        'community-gathering',
        'liturgical-event',
      ]"
    />

    <!-- Tagline -->
    <div class="calendar-footer">
      <p class="tagline">"Grace in every shared moment"</p>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

.calendar-month-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

/* Calendar Header */
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e8e8e5;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: transparent;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  color: #706c64;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.nav-btn:hover {
  background: #f7f6f4;
  border-color: #d9d6d0;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.header-content {
  flex: 1;
  text-align: center;
}

.month-title {
  font-family: "Crimson Pro", serif;
  font-size: 2rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.calendar-subtitle {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: #9c8b7a;
  text-transform: uppercase;
  margin: 0;
}

/* Calendar Grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e8e8e5;
  border: 1px solid #e8e8e5;
  border-radius: 12px;
  overflow: hidden;
}

.calendar-day-header {
  background: #fafaf8;
  padding: 1rem 0.75rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.688rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #9c8b7a;
  text-align: center;
  text-transform: uppercase;
}

.calendar-day {
  background: #ffffff;
  min-height: 120px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: background 0.2s ease;
}

.calendar-day:hover {
  background: #fafaf8;
}

.calendar-day.is-other-month {
  background: #f7f6f4;
  opacity: 0.5;
}

.calendar-day.is-today {
  background: rgba(122, 155, 118, 0.03);
  border: 1px solid rgba(122, 155, 118, 0.2);
  margin: -1px;
}

.day-number {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #706c64;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.today-label {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #5f7d5c;
  text-transform: uppercase;
  padding: 0.125rem 0.375rem;
  background: rgba(122, 155, 118, 0.1);
  border-radius: 4px;
}

/* Day Events */
.day-events {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
}

/* Calendar Footer */
.calendar-footer {
  text-align: center;
  padding-top: 1rem;
}

.tagline {
  font-family: "Crimson Pro", serif;
  font-size: 0.938rem;
  font-style: italic;
  color: #9c8b7a;
  margin: 0;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .calendar-day {
    min-height: 100px;
    padding: 0.625rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .month-title {
    font-size: 1.5rem;
  }

  .calendar-subtitle {
    font-size: 0.625rem;
  }

  .calendar-day {
    min-height: 80px;
    padding: 0.5rem;
  }

  .day-number {
    font-size: 0.75rem;
  }

  .today-label {
    font-size: 0.563rem;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .calendar-header {
    gap: 0.75rem;
  }

  .nav-btn {
    width: 2rem;
    height: 2rem;
  }

  .nav-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .month-title {
    font-size: 1.25rem;
  }

  .calendar-subtitle {
    display: none;
  }

  .calendar-day {
    min-height: 60px;
    padding: 0.375rem;
  }

  .calendar-day-header {
    padding: 0.75rem 0.5rem;
    font-size: 0.625rem;
  }

  .tagline {
    font-size: 0.813rem;
  }
}
</style>
