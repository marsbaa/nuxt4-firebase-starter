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
 * Format due date for display
 * Shows as "Jan 15" or "January 15" depending on screen size
 */
const formatDueDate = (timestamp: any) => {
  if (!timestamp) return null;

  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  // Format as "Jan 15"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formattedDueDate = computed(() =>
  props.reminder.dueDate ? formatDueDate(props.reminder.dueDate) : null,
);
</script>

<template>
  <div class="care-reminder" role="listitem">
    <!-- Icon -->
    <div class="reminder-icon-container">
      <AppIcon
        name="heroicons:bookmark"
        class="reminder-icon"
        aria-hidden="true"
      />
    </div>

    <!-- Content -->
    <div class="reminder-content">
      <div class="reminder-text">{{ reminder.text }}</div>

      <!-- Footer: Due date and author -->
      <div class="reminder-footer">
        <span v-if="formattedDueDate" class="reminder-due-date">{{
          formattedDueDate
        }}</span>
        <span class="reminder-author">Held by {{ reminder.authorName }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Care Reminder Container */
.care-reminder {
  display: flex;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  background: linear-gradient(to bottom, #fefcf9, #fdf9f3);
  border: 1px solid #f5f1e8;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 2px 0 rgba(252, 248, 243, 0.3);
}

/* Icon Container */
.reminder-icon-container {
  flex-shrink: 0;
  padding-top: 0.125rem;
}

.reminder-icon {
  width: 1rem;
  height: 1rem;
  color: #c2a47a;
  opacity: 0.4;
}

/* Content Area */
.reminder-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Reminder Text */
.reminder-text {
  color: #44403c;
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-word;
}

/* Footer */
.reminder-footer {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.reminder-due-date {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #c2a47a;
  letter-spacing: 0.02em;
  padding: 0.125rem 0.5rem;
  background-color: rgba(194, 164, 122, 0.08);
  border-radius: 0.25rem;
}

.reminder-author {
  font-size: 0.6875rem;
  color: #a8a29e;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .care-reminder {
    gap: 0.75rem;
    padding: 0.875rem 1rem;
  }

  .reminder-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  .reminder-text {
    font-size: 0.8125rem;
  }

  .reminder-due-date,
  .reminder-author {
    font-size: 0.625rem;
  }
}

/* Subtle hover state (non-urgent) */
@media (hover: hover) {
  .care-reminder:hover {
    background: linear-gradient(to bottom, #fefcf9, #fcf6ed);
    border-color: #ebe5d8;
  }
}

/* Focus state for accessibility */
.care-reminder:focus-within {
  outline: 2px solid rgba(194, 164, 122, 0.2);
  outline-offset: 2px;
}
</style>
