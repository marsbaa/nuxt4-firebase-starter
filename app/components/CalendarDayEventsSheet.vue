<script setup lang="ts">
/**
 * CalendarDayEventsSheet Component
 *
 * A bottom sheet for displaying all calendar events for a specific day.
 * Triggered when users click the "+N more" link in the month view.
 *
 * Features:
 * - Slide-up animation from bottom of screen
 * - Swipe-down gesture to dismiss
 * - Tap outside (backdrop) to dismiss
 * - Escape key to dismiss
 * - Shows all events for the selected day
 * - Pastoral tone with calm, generous whitespace
 */
import type { CalendarEvent } from "~/types/calendarEvents";

interface Props {
  isOpen: boolean;
  date: Date | null;
  events: CalendarEvent[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  "event-click": [event: CalendarEvent];
}>();

// Format date for display
const formatDate = (date: Date | null) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

// Get icon name for event type
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

// Get event type label
const getEventTypeLabel = (type: CalendarEvent["type"]): string => {
  const labelMap: Record<CalendarEvent["type"], string> = {
    "community-gathering": "COMMUNITY GATHERING",
    "member-milestone": "MEMBER MILESTONE",
    "care-reminder": "CARE REMINDER",
    "care-update": "CARE UPDATE",
    "liturgical-event": "LITURGICAL EVENT",
  };
  return labelMap[type];
};

// Handle backdrop click
const handleBackdropClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).classList.contains("sheet-backdrop")) {
    emit("close");
  }
};

// Handle escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    emit("close");
  }
};

// Handle event click
const handleEventClick = (event: CalendarEvent) => {
  emit("event-click", event);
  emit("close");
};

// Listen for escape key when sheet is open
onMounted(() => {
  if (process.client) {
    document.addEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("keydown", handleKeydown);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="isOpen && date"
        class="sheet-backdrop"
        @click="handleBackdropClick"
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-events-title"
      >
        <div class="calendar-day-events-sheet">
          <!-- Handle for visual swipe indicator -->
          <div class="sheet-handle" aria-hidden="true"></div>

          <!-- Content -->
          <div class="sheet-content">
            <!-- Date Header -->
            <h2 id="day-events-title" class="sheet-title">
              {{ formatDate(date) }}
            </h2>

            <!-- Events List -->
            <div class="events-list">
              <button
                v-for="event in events"
                :key="event.id"
                class="event-item"
                @click="handleEventClick(event)"
              >
                <Icon :name="getEventIcon(event.type)" class="event-icon" />
                <div class="event-details">
                  <span class="event-type-label">{{
                    getEventTypeLabel(event.type)
                  }}</span>
                  <span class="event-title">{{ event.title }}</span>
                  <span v-if="event.description" class="event-description">{{
                    event.description
                  }}</span>
                </div>
              </button>
            </div>

            <!-- Close Button -->
            <div class="sheet-close-section">
              <button
                class="sheet-close-button"
                @click="emit('close')"
                aria-label="Close sheet"
              >
                <span class="close-text">CLOSE</span>
                <Icon name="mdi:close" class="close-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

.sheet-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 44, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.calendar-day-events-sheet {
  width: 100%;
  max-width: 100%;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(44, 44, 42, 0.15);
  transform: translateY(0);
  transition: transform 0.3s ease-out;
  max-height: 80vh;
  overflow-y: auto;
}

.sheet-handle {
  width: 40px;
  height: 4px;
  background: #e8e8e5;
  border-radius: 2px;
  margin: 12px auto 0;
}

.sheet-content {
  padding: 2rem 1.5rem;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sheet-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0;
  text-align: center;
  line-height: 1.3;
}

/* Events List */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #fafaf8;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.event-item:hover {
  background: #f7f6f4;
  border-color: #d4d3d0;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(44, 44, 42, 0.08);
}

.event-item:active {
  transform: translateY(0);
}

.event-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  color: #706c64;
  margin-top: 0.125rem;
}

.event-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-type-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #9c8b7a;
  text-transform: uppercase;
}

.event-title {
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  font-weight: 500;
  color: #2d2a26;
  line-height: 1.4;
}

.event-description {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #706c64;
  line-height: 1.5;
}

/* Close Section */
.sheet-close-section {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid #e8e8e5;
}

.sheet-close-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sheet-close-button:hover {
  background: #fafaf8;
  border-color: #d4d3d0;
}

.close-text {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #706c64;
}

.close-icon {
  width: 1rem;
  height: 1rem;
  color: #706c64;
}

/* Transitions */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s ease;
}

.sheet-enter-active .calendar-day-events-sheet,
.sheet-leave-active .calendar-day-events-sheet {
  transition: transform 0.3s ease-out;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .calendar-day-events-sheet,
.sheet-leave-to .calendar-day-events-sheet {
  transform: translateY(100%);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .sheet-content {
    padding: 1.5rem 1.25rem;
  }

  .sheet-title {
    font-size: 1.25rem;
  }

  .event-item {
    padding: 0.875rem;
  }

  .event-title {
    font-size: 0.875rem;
  }

  .event-description {
    font-size: 0.75rem;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .calendar-day-events-sheet {
    transition: none;
  }

  .sheet-enter-active,
  .sheet-leave-active {
    transition: none;
  }
}
</style>
