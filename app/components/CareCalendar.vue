<script setup lang="ts">
import type {
  CalendarEvent,
  CalendarFilters,
  CreateCommunityGatheringInput,
} from "~/types/calendarEvents";

// Use calendar events composable
const { allEvents, loading, filters, updateFilters, addCommunityEvent } =
  useCalendarEvents();

const toast = useToast();

// View state: 'month' or 'agenda'
const currentView = ref<"month" | "agenda">("month");

// Event form modal state
const showEventForm = ref(false);
const isCreatingEvent = ref(false);

// Switch between month and agenda view
const switchView = (view: "month" | "agenda") => {
  currentView.value = view;
};

// Check if a view is active
const isActiveView = (view: "month" | "agenda") => {
  return currentView.value === view;
};

// Open event form modal
const openEventForm = () => {
  showEventForm.value = true;
};

// Close event form modal
const closeEventForm = () => {
  showEventForm.value = false;
};

// Handle event creation
const handleEventCreated = async (input: CreateCommunityGatheringInput) => {
  isCreatingEvent.value = true;
  try {
    await addCommunityEvent(input);
    closeEventForm();
  } catch (error) {
    console.error("Error creating event:", error);
    // Toast is already shown by the composable
  } finally {
    isCreatingEvent.value = false;
  }
};

// Handle event click from agenda view
const handleEventClick = (event: CalendarEvent) => {
  // Navigate to member detail page if memberId exists
  if (event.memberId) {
    navigateTo(`/members/view/${event.memberId}`);
  }
};

// Handle filter updates from focus panel
const handleFilterUpdate = (updates: Partial<CalendarFilters>) => {
  updateFilters(updates);
};
</script>

<template>
  <div class="care-calendar">
    <!-- View Toggle -->
    <div class="calendar-controls">
      <div class="view-toggle">
        <button
          @click="switchView('month')"
          class="toggle-btn"
          :class="{ 'is-active': isActiveView('month') }"
          aria-label="Switch to month view"
        >
          <Icon name="mdi:calendar" class="toggle-icon" />
          <span class="toggle-text">Month</span>
        </button>
        <button
          @click="switchView('agenda')"
          class="toggle-btn"
          :class="{ 'is-active': isActiveView('agenda') }"
          aria-label="Switch to agenda view"
        >
          <Icon name="mdi:format-list-bulleted" class="toggle-icon" />
          <span class="toggle-text">Agenda</span>
        </button>
      </div>

      <div class="calendar-actions">
        <button
          class="new-event-btn"
          aria-label="Create new event"
          @click="openEventForm"
        >
          <Icon name="mdi:plus" class="btn-icon" />
          <span class="btn-text">New Event</span>
        </button>
      </div>
    </div>

    <!-- Event Form Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showEventForm"
          class="modal-backdrop"
          @click="closeEventForm"
        >
          <div class="modal-content" @click.stop>
            <button
              class="modal-close"
              aria-label="Close modal"
              @click="closeEventForm"
            >
              <Icon name="mdi:close" class="close-icon" />
            </button>
            <CalendarEventForm
              :loading="isCreatingEvent"
              @event-created="handleEventCreated"
              @cancel="closeEventForm"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Calendar Content -->
    <div class="calendar-content">
      <!-- Main Calendar View -->
      <div class="calendar-main">
        <!-- Month View -->
        <div v-if="currentView === 'month'" class="calendar-view">
          <CalendarMonthView
            :events="allEvents"
            @event-click="handleEventClick"
          />
        </div>

        <!-- Agenda View -->
        <div v-else-if="currentView === 'agenda'" class="calendar-view">
          <CalendarAgendaView
            :events="allEvents"
            :loading="loading"
            @event-click="handleEventClick"
          />
        </div>
      </div>

      <!-- Focus Panel (right sidebar) -->
      <CalendarFocusPanel
        :filters="filters"
        :loading="loading"
        @update:filters="handleFilterUpdate"
      />
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

.care-calendar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(44, 44, 42, 0.1);
  padding: 2rem;
  min-height: 600px;
}

/* Calendar Controls */
.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e8e8e5;
}

/* View Toggle */
.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: #f7f6f4;
  padding: 0.25rem;
  border-radius: 10px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #706c64;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover:not(.is-active) {
  background: rgba(255, 255, 255, 0.7);
  color: #2d2a26;
}

.toggle-btn.is-active {
  background: #ffffff;
  color: #5f7d5c;
  font-weight: 600;
  box-shadow: 0 1px 2px 0 rgba(44, 44, 42, 0.1);
}

.toggle-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.toggle-text {
  flex: 1;
}

/* Calendar Actions */
.calendar-actions {
  display: flex;
  gap: 0.75rem;
}

.new-event-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #5f7d5c;
  background: rgba(122, 155, 118, 0.1);
  border: 1px solid rgba(122, 155, 118, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-event-btn:hover {
  background: rgba(122, 155, 118, 0.15);
  border-color: rgba(122, 155, 118, 0.3);
  box-shadow: 0 1px 2px 0 rgba(122, 155, 118, 0.15);
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.btn-text {
  flex: 1;
}

/* Calendar Content */
.calendar-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  flex: 1;
}

/* Calendar Main View */
.calendar-main {
  flex: 1;
  min-height: 400px;
}

.calendar-view {
  height: 100%;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .care-calendar {
    padding: 1.5rem;
  }

  .calendar-content {
    grid-template-columns: 1fr auto;
    gap: 1.5rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .care-calendar {
    padding: 1rem;
  }

  .calendar-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .view-toggle {
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
    justify-content: center;
  }

  .calendar-actions {
    width: 100%;
  }

  .new-event-btn {
    width: 100%;
    justify-content: center;
  }

  .calendar-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .toggle-text {
    display: none;
  }

  .btn-text {
    display: none;
  }

  .toggle-btn,
  .new-event-btn {
    justify-content: center;
  }
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 44, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9999;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 40rem;
  max-height: 90vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow:
    0 10px 25px -5px rgba(44, 44, 42, 0.1),
    0 10px 10px -5px rgba(44, 44, 42, 0.04);
  padding: 1.5rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: rgba(247, 246, 244, 0.8);
  border: 1px solid #e8e8e5;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: #f7f6f4;
  border-color: #d6cbb8;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #706c64;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}

/* Modal Responsive */
@media (max-width: 768px) {
  .modal-backdrop {
    padding: 0.5rem;
  }

  .modal-content {
    max-width: 100%;
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .modal-close {
    top: 0.75rem;
    right: 0.75rem;
  }
}
</style>
