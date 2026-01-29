<script setup lang="ts">
import { ref, computed } from "vue";

// Props for passing events (will be used later)
interface Props {
  events?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
});

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

// Mock events for demonstration (matching the screenshot)
const mockEvents = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  // Only show events for November 2024 to match the screenshot
  if (year !== 2024 || month !== 10) return [];

  return [
    {
      id: "1",
      date: new Date(2024, 10, 4),
      title: "Arthur P. Birthday",
      type: "member-milestone",
      icon: "mdi:cake-variant",
    },
    {
      id: "2",
      date: new Date(2024, 10, 14),
      title: "Church Picnic",
      type: "community-gathering",
      icon: "mdi:church",
    },
    {
      id: "3",
      date: new Date(2024, 10, 20),
      title: "The Millers Anniv.",
      type: "member-milestone",
      icon: "mdi:cake-variant",
    },
    {
      id: "4",
      date: new Date(2024, 10, 28),
      title: "Thanksgiving",
      type: "liturgical-event",
      icon: "mdi:food-turkey",
    },
  ];
});

// Get events for a specific day
const getEventsForDay = (date: Date) => {
  return mockEvents.value.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear(),
  );
};

// Get event style classes
const getEventClass = (eventType: string) => {
  const baseClass = "calendar-event";
  return `${baseClass} ${baseClass}--${eventType}`;
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
          <div
            v-for="event in getEventsForDay(day.date)"
            :key="event.id"
            :class="getEventClass(event.type)"
          >
            <Icon :name="event.icon" class="event-icon" />
            <span class="event-title">{{ event.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Legend -->
    <div class="calendar-legend">
      <div class="legend-item">
        <span class="legend-dot legend-dot--member-milestone"></span>
        <span class="legend-label">Member Milestones</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot legend-dot--community-gathering"></span>
        <span class="legend-label">Community Gatherings</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot legend-dot--liturgical-event"></span>
        <span class="legend-label">Liturgical Events</span>
      </div>
    </div>

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

.calendar-event {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem;
  border-radius: 6px;
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.3;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calendar-event:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(44, 44, 42, 0.08);
}

.calendar-event--member-milestone {
  background: rgba(207, 184, 203, 0.15);
  color: #8b6d88;
  border: 1px solid rgba(207, 184, 203, 0.3);
}

.calendar-event--member-milestone:hover {
  background: rgba(207, 184, 203, 0.2);
  border-color: rgba(207, 184, 203, 0.4);
}

.calendar-event--community-gathering {
  background: rgba(169, 193, 205, 0.15);
  color: #5a7a8c;
  border: 1px solid rgba(169, 193, 205, 0.3);
}

.calendar-event--community-gathering:hover {
  background: rgba(169, 193, 205, 0.2);
  border-color: rgba(169, 193, 205, 0.4);
}

.calendar-event--liturgical-event {
  background: rgba(217, 188, 155, 0.15);
  color: #9c8b7a;
  border: 1px solid rgba(217, 188, 155, 0.3);
}

.calendar-event--liturgical-event:hover {
  background: rgba(217, 188, 155, 0.2);
  border-color: rgba(217, 188, 155, 0.4);
}

.calendar-event--care-reminder {
  background: rgba(122, 155, 118, 0.15);
  color: #5f7d5c;
  border: 1px solid rgba(122, 155, 118, 0.3);
}

.calendar-event--care-reminder:hover {
  background: rgba(122, 155, 118, 0.2);
  border-color: rgba(122, 155, 118, 0.4);
}

.calendar-event--care-update {
  background: rgba(191, 174, 157, 0.15);
  color: #8c7a6a;
  border: 1px solid rgba(191, 174, 157, 0.3);
}

.calendar-event--care-update:hover {
  background: rgba(191, 174, 157, 0.2);
  border-color: rgba(191, 174, 157, 0.4);
}

.event-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.event-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Calendar Legend */
.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  padding: 1.5rem 1rem;
  border-top: 1px solid #e8e8e5;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot--member-milestone {
  background: rgba(207, 184, 203, 0.6);
  border: 1px solid rgba(207, 184, 203, 0.8);
}

.legend-dot--community-gathering {
  background: rgba(169, 193, 205, 0.6);
  border: 1px solid rgba(169, 193, 205, 0.8);
}

.legend-dot--liturgical-event {
  background: rgba(217, 188, 155, 0.6);
  border: 1px solid rgba(217, 188, 155, 0.8);
}

.legend-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #706c64;
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

  .calendar-event {
    font-size: 0.688rem;
    padding: 0.313rem 0.438rem;
  }

  .event-icon {
    width: 0.75rem;
    height: 0.75rem;
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

  .calendar-event {
    font-size: 0.625rem;
    padding: 0.25rem 0.375rem;
    gap: 0.25rem;
  }

  .event-icon {
    width: 0.688rem;
    height: 0.688rem;
  }

  .legend-item {
    font-size: 0.75rem;
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

  .event-title {
    display: none;
  }

  .legend-item {
    gap: 0.375rem;
  }

  .legend-dot {
    width: 0.625rem;
    height: 0.625rem;
  }

  .tagline {
    font-size: 0.813rem;
  }
}
</style>
