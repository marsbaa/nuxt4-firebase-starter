<!--
/**
 * CareReminder Component
 *
 * Displays a single care reminder with pastoral, non-urgent styling.
 * Care reminders are NOT tasks - they are gentle intentions held in mind.
 *
 * **Props:**
 * @param {CareReminder} reminder - The care reminder object containing id, text, dueDate, author info, timestamps
 *
 * **Design Principles:**
 * - Warm, subtle background (lightest amber/beige)
 * - Gentle outline or inset border
 * - Low-contrast "remembering" icon (bookmark-like)
 * - No urgency colors (red, orange)
 * - No task indicators (checkboxes, progress bars)
 * - Pastoral language ("Held by" not "Assigned to")
 *
 * @example
 * ```vue
 * <CareReminder :reminder="careReminder" />
 * ```
 */
-->
<script setup lang="ts">
import type { CareReminder } from "~/types/careReminders";

const props = defineProps<{
  reminder: CareReminder;
}>();

/**
 * Format due date for display in card header
 * Shows as "OCT 20" or "PENDING" if no date
 */
const formatDueDate = (timestamp: any) => {
  if (!timestamp) return "PENDING";

  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  // Format as "OCT 20"
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase()
    .replace(",", "");
};

const formattedDueDate = computed(() => formatDueDate(props.reminder.dueDate));
</script>

<template>
  <div class="care-reminder" role="listitem">
    <!-- Card Header with Date and Icon -->
    <div class="reminder-header">
      <span class="reminder-date">{{ formattedDueDate }}</span>
      <AppIcon
        name="heroicons:bookmark"
        class="reminder-icon"
        aria-hidden="true"
      />
    </div>

    <!-- Reminder Text Content -->
    <div class="reminder-content">
      <p class="reminder-text">{{ reminder.text }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Care Reminder Card Container */
.care-reminder {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.125rem;
  background: linear-gradient(to bottom, #fefcf9, #fdf9f3);
  border: 1px solid #f5f1e8;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  min-height: 120px;
}

/* Card Header - Date and Icon */
.reminder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(245, 241, 232, 0.6);
}

.reminder-date {
  font-size: 0.625rem;
  font-weight: 600;
  color: #a8a29e;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.reminder-icon {
  width: 1rem;
  height: 1rem;
  color: #c2a47a;
  opacity: 0.35;
}

/* Content Area */
.reminder-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
}

/* Reminder Text */
.reminder-text {
  color: #44403c;
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-word;
  margin: 0;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .care-reminder {
    padding: 0.875rem 1rem;
    min-height: 100px;
  }

  .reminder-header {
    margin-bottom: 0.625rem;
  }

  .reminder-date {
    font-size: 0.5625rem;
  }

  .reminder-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  .reminder-text {
    font-size: 0.8125rem;
  }
}

/* Subtle hover state (non-urgent) */
@media (hover: hover) {
  .care-reminder:hover {
    background: linear-gradient(to bottom, #fefcf9, #fcf6ed);
    border-color: #ebe5d8;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  }
}

/* Focus state for accessibility */
.care-reminder:focus-within {
  outline: 2px solid rgba(194, 164, 122, 0.2);
  outline-offset: 2px;
}
</style>
