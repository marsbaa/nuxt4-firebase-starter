<script setup lang="ts">
// View state: 'month' or 'agenda'
const currentView = ref<"month" | "agenda">("month");

// Switch between month and agenda view
const switchView = (view: "month" | "agenda") => {
  currentView.value = view;
};

// Check if a view is active
const isActiveView = (view: "month" | "agenda") => {
  return currentView.value === view;
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
        <button class="new-event-btn" aria-label="Create new event">
          <Icon name="mdi:plus" class="btn-icon" />
          <span class="btn-text">New Event</span>
        </button>
      </div>
    </div>

    <!-- Calendar Content -->
    <div class="calendar-content">
      <!-- Focus Panel (left sidebar) -->
      <aside class="focus-panel">
        <h2 class="panel-heading">Focus your attention</h2>
        <div class="panel-content">
          <p class="panel-note">
            Category filters and member search will appear here
          </p>
          <p class="panel-info">
            Care notes and individual reminders are managed through Member
            Detail pages.
          </p>
        </div>
      </aside>

      <!-- Main Calendar View -->
      <div class="calendar-main">
        <!-- Month View -->
        <div v-if="currentView === 'month'" class="calendar-view">
          <div class="empty-state">
            <Icon name="mdi:calendar-outline" class="empty-icon" />
            <p class="empty-message">Month view will be displayed here</p>
          </div>
        </div>

        <!-- Agenda View -->
        <div v-else-if="currentView === 'agenda'" class="calendar-view">
          <div class="empty-state">
            <Icon name="mdi:format-list-bulleted" class="empty-icon" />
            <p class="empty-message">Agenda view will be displayed here</p>
          </div>
        </div>
      </div>
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
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  flex: 1;
}

/* Focus Panel */
.focus-panel {
  background: #fafaf8;
  border: 1px solid #e8e8e5;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
}

.panel-heading {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 1rem;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-note {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #706c64;
  margin: 0;
  line-height: 1.5;
}

.panel-info {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #9c8b7a;
  margin: 0;
  padding: 0.875rem;
  background: rgba(217, 188, 155, 0.08);
  border-left: 2px solid #d9bc9b;
  border-radius: 6px;
  line-height: 1.5;
}

/* Calendar Main View */
.calendar-main {
  flex: 1;
  min-height: 400px;
}

.calendar-view {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #d9bc9b;
  opacity: 0.5;
}

.empty-message {
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  color: #9c8b7a;
  margin: 0;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .care-calendar {
    padding: 1.5rem;
  }

  .calendar-content {
    grid-template-columns: 240px 1fr;
    gap: 1.5rem;
  }

  .focus-panel {
    padding: 1.25rem;
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

  .focus-panel {
    padding: 1rem;
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
</style>
