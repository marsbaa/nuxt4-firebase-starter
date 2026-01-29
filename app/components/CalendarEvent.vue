<script setup lang="ts">
import type { CalendarEventType } from "~/types/calendarEvents";

interface Props {
  /** Event title */
  title: string;
  /** Event type for visual styling */
  type: CalendarEventType;
  /** Icon name from Iconify */
  icon: string;
  /** Optional member ID for navigation */
  memberId?: string;
  /** Optional reminder ID for navigation */
  reminderId?: string;
}

const props = defineProps<Props>();

// Emit click event for parent to handle navigation
const emit = defineEmits<{
  click: [];
}>();

// Get event class based on type
const eventClass = computed(() => {
  return `calendar-event calendar-event--${props.type}`;
});

// Handle event click
const handleClick = () => {
  emit("click");
};
</script>

<template>
  <div :class="eventClass" @click="handleClick" role="button" tabindex="0">
    <Icon :name="icon" class="event-icon" aria-hidden="true" />
    <span class="event-title">{{ title }}</span>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap");

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

.calendar-event:focus {
  outline: 2px solid rgba(122, 155, 118, 0.5);
  outline-offset: 2px;
}

/* Event type styling - Member Milestones (purple/mauve) */
.calendar-event--member-milestone {
  background: rgba(207, 184, 203, 0.15);
  color: #8b6d88;
  border: 1px solid rgba(207, 184, 203, 0.3);
}

.calendar-event--member-milestone:hover {
  background: rgba(207, 184, 203, 0.2);
  border-color: rgba(207, 184, 203, 0.4);
}

/* Community Gatherings (blue-grey) */
.calendar-event--community-gathering {
  background: rgba(169, 193, 205, 0.15);
  color: #5a7a8c;
  border: 1px solid rgba(169, 193, 205, 0.3);
}

.calendar-event--community-gathering:hover {
  background: rgba(169, 193, 205, 0.2);
  border-color: rgba(169, 193, 205, 0.4);
}

/* Liturgical Events (warm tan) */
.calendar-event--liturgical-event {
  background: rgba(217, 188, 155, 0.15);
  color: #9c8b7a;
  border: 1px solid rgba(217, 188, 155, 0.3);
}

.calendar-event--liturgical-event:hover {
  background: rgba(217, 188, 155, 0.2);
  border-color: rgba(217, 188, 155, 0.4);
}

/* Care Reminders (green) */
.calendar-event--care-reminder {
  background: rgba(122, 155, 118, 0.15);
  color: #5f7d5c;
  border: 1px solid rgba(122, 155, 118, 0.3);
}

.calendar-event--care-reminder:hover {
  background: rgba(122, 155, 118, 0.2);
  border-color: rgba(122, 155, 118, 0.4);
}

/* Care Updates (soft brown) */
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

/* Responsive - Tablet */
@media (max-width: 1024px) {
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
  .calendar-event {
    font-size: 0.625rem;
    padding: 0.25rem 0.375rem;
    gap: 0.25rem;
  }

  .event-icon {
    width: 0.688rem;
    height: 0.688rem;
  }
}

/* Small mobile - icon only */
@media (max-width: 480px) {
  .event-title {
    display: none;
  }
}
</style>
