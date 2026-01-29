<!--
/**
 * CareReminderList Component
 *
 * Displays a collection of care reminders (max 3) with loading and empty states.
 * Uses pastoral language and gentle visual treatment.
 *
 * **Props:**
 * @param {CareReminder[]} reminders - Array of care reminders (readonly from composable)
 * @param {boolean} loading - Loading state indicator
 *
 * **Display Rules:**
 * - Show only active (non-expired) reminders
 * - Maximum 3 reminders displayed
 * - Ordered by soonest due date first, undated last
 *
 * **Design Principles:**
 * - Skeleton loading with subtle pulse animation
 * - Empty state with pastoral language ("No care reminders yet")
 * - Warm, supportive visual treatment
 * - No urgency or task-driven aesthetics
 *
 * @example
 * ```vue
 * <CareReminderList :reminders="reminders" :loading="loading" />
 * ```
 */
-->
<script setup lang="ts">
import type { CareReminder } from "~/types/careReminders";

const props = defineProps<{
  reminders: readonly CareReminder[];
  loading: boolean;
}>();

// Computed to check if reminders list is empty
const isEmpty = computed(() => !props.loading && props.reminders.length === 0);
</script>

<template>
  <div class="care-reminder-list">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="loading-state"
      role="status"
      aria-live="polite"
      aria-label="Loading care reminders"
    >
      <div class="skeleton-reminder" v-for="i in 3" :key="i">
        <div class="skeleton-icon"></div>
        <div class="skeleton-content-area">
          <div class="skeleton-text"></div>
          <div class="skeleton-footer">
            <div class="skeleton-date"></div>
            <div class="skeleton-author"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="isEmpty"
      class="empty-state"
      role="status"
      aria-label="No care reminders yet"
    >
      <AppIcon
        name="heroicons:bookmark"
        class="empty-icon"
        aria-hidden="true"
      />
      <p class="empty-message">No care reminders yet</p>
      <p class="empty-hint">Add a reminder to hold gentle follow-ups in mind</p>
    </div>

    <!-- Reminders Collection -->
    <div
      v-else
      class="reminders-collection"
      role="list"
      aria-label="Active care reminders"
    >
      <CareReminder
        v-for="reminder in reminders"
        :key="reminder.id"
        :reminder="reminder"
      />
    </div>
  </div>
</template>

<style scoped>
/* Container */
.care-reminder-list {
  width: 100%;
}

/* Loading State */
.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  width: 100%;
}

.skeleton-reminder {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.125rem;
  background: linear-gradient(to bottom, #fefcf9, #fdf9f3);
  border: 1px solid #f5f1e8;
  border-radius: 0.5rem;
  min-height: 120px;
}

.skeleton-icon {
  align-self: flex-end;
  width: 1rem;
  height: 1rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #f5f1e8 0%, #ebe5d8 50%, #f5f1e8 100%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-text {
  height: 2.5rem;
  background: linear-gradient(90deg, #f5f1e8 0%, #ebe5d8 50%, #f5f1e8 100%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-footer {
  display: flex;
  gap: 0.625rem;
  margin-top: auto;
}

.skeleton-date {
  height: 0.625rem;
  width: 3rem;
  background: linear-gradient(90deg, #f5f1e8 0%, #ebe5d8 50%, #f5f1e8 100%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-author {
  height: 0.625rem;
  width: 6rem;
  background: linear-gradient(90deg, #f5f1e8 0%, #ebe5d8 50%, #f5f1e8 100%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  text-align: center;
  background: linear-gradient(to bottom, #fefcf9, #fdf9f3);
  border: 1px solid #f5f1e8;
  border-radius: 0.5rem;
}

.empty-icon {
  width: 2rem;
  height: 2rem;
  color: #c2a47a;
  opacity: 0.3;
  margin-bottom: 0.75rem;
}

.empty-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: #78716c;
  margin: 0 0 0.375rem 0;
}

.empty-hint {
  font-size: 0.75rem;
  color: #a8a29e;
  margin: 0;
  max-width: 18rem;
  font-style: italic;
}

/* Reminders Collection */
.reminders-collection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .empty-message {
    font-size: 0.8125rem;
  }

  .empty-hint {
    font-size: 0.6875rem;
  }

  .loading-state {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .skeleton-reminder {
    padding: 0.875rem 1rem;
    min-height: 100px;
  }

  .skeleton-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  .reminders-collection {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
