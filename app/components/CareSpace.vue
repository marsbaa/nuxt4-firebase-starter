<!--
/**
 * CareSpace Component
 *
 * Main orchestrator for the Care Space - a focused, calm environment for
 * documenting and reflecting on pastoral care interactions.
 *
 * This component combines:
 * - CareNoteInput: Gentle interface for adding new care notes
 * - CareReminderInput: Interface for adding care reminders
 * - CareReminderList: Display of active care reminders (max 3)
 * - CareNoteList: Timeline view of existing notes with real-time updates
 *
 * **Props:**
 * @param {string} memberId - The ID of the member (required)
 * @param {string} memberName - The display name of the member (required)
 *
 * **Features:**
 * - Real-time synchronization via useCareNotes and useCareReminders composables
 * - Optimistic UI updates
 * - Automatic error handling with toast notifications
 * - Responsive layout for mobile, tablet, and desktop
 * - WCAG AA accessible
 *
 * **Design Philosophy:**
 * Feels like "a journal for caring for someone" - narrative and reflective,
 * not transactional or metrics-driven.
 *
 * @example
 * ```vue
 * <CareSpace
 *   member-id="member-123"
 *   member-name="John Smith"
 * />
 * ```
 */
-->
<script setup lang="ts">
const props = defineProps<{
  memberId: string;
  memberName: string;
}>();

// Use the care notes composable for real-time sync
const { notes, loading, addNote, updateNote } = useCareNotes(props.memberId);

// Use the care reminders composable for real-time sync
const {
  reminders,
  loading: remindersLoading,
  addReminder,
  deleteReminder,
  updateReminder,
} = useCareReminders(props.memberId);

// Control visibility of reminder input form
const showReminderInput = ref(false);

/**
 * Handle adding a new care note
 * Delegates to useCareNotes addNote function
 * Errors are handled by the composable with toast notifications
 */
const handleNoteAdded = async (content: string) => {
  try {
    await addNote(content);
  } catch (error) {
    console.error("Error adding care note:", error);
  }
};

/**
 * Handle updating an existing care note
 * Preserves edit history automatically via useCareNotes
 * Errors are handled by the composable with toast notifications
 */
const handleNoteUpdated = async (noteId: string, content: string) => {
  try {
    await updateNote(noteId, content);
  } catch (error) {
    console.error("Error updating care note:", error);
  }
};

/**
 * Handle adding a new care reminder
 * Delegates to useCareReminders addReminder function
 * Errors are handled by the composable with toast notifications
 */
const handleReminderAdded = async (text: string, dueDate: Date | null) => {
  try {
    await addReminder(text, dueDate);
    // Hide the form after successful submission
    showReminderInput.value = false;
  } catch (error) {
    console.error("Error adding care reminder:", error);
  }
};

/**
 * Handle updating an existing care reminder
 * Delegates to useCareReminders updateReminder function
 * Errors are handled by the composable with toast notifications
 */
const handleReminderUpdated = async (
  reminderId: string,
  text: string,
  dueDate: Date | null,
) => {
  try {
    await updateReminder(reminderId, text, dueDate);
  } catch (error) {
    console.error("Error updating care reminder:", error);
  }
};

/**
 * Toggle the reminder input form visibility
 */
const toggleReminderInput = () => {
  showReminderInput.value = !showReminderInput.value;
};

/**
 * Handle deleting a care reminder
 * Delegates to useCareReminders deleteReminder function
 * Errors are handled by the composable with toast notifications
 */
const handleReminderDeleted = async (reminderId: string) => {
  try {
    await deleteReminder(reminderId);
  } catch (error) {
    console.error("Error deleting care reminder:", error);
  }
};
</script>

<template>
  <div class="care-space" role="region" aria-label="Care Space">
    <!-- Header -->
    <div class="care-space-header">
      <h2 class="care-space-title">Care Space</h2>
      <p class="care-space-subtitle">
        Holding the narrative of our shared journey.
      </p>
    </div>

    <!-- Care Note Input -->
    <div class="care-space-input">
      <CareNoteInput :loading="loading" @note-added="handleNoteAdded" />
    </div>

    <!-- Care Reminders Section -->
    <div class="care-space-reminders">
      <div class="reminders-header">
        <div class="reminders-header-content">
          <h3 class="reminders-title">Care Reminders</h3>
          <p class="reminders-subtitle">Gentle follow-ups held in mind</p>
        </div>
        <!-- Care Reminder Button (always visible in header) -->
        <AppButton
          variant="ghost"
          size="sm"
          :disabled="remindersLoading"
          @click="toggleReminderInput"
          class="add-reminder-button"
        >
          <AppIcon name="heroicons:plus" class="button-icon" />
          Add a care reminder
        </AppButton>
      </div>

      <!-- Care Reminder Input Form (shown when visible) -->
      <div v-if="showReminderInput" class="reminders-input">
        <CareReminderInput
          :loading="remindersLoading"
          @reminder-added="handleReminderAdded"
          @cancel="showReminderInput = false"
        />
      </div>

      <!-- Care Reminder List -->
      <div class="reminders-list">
        <CareReminderList
          :reminders="reminders"
          :loading="remindersLoading"
          @update="handleReminderUpdated"
          @delete="handleReminderDeleted"
        />
      </div>
    </div>

    <!-- Care Notes Timeline -->
    <div class="care-space-timeline">
      <CareNoteList
        :notes="notes"
        :loading="loading"
        @note-updated="handleNoteUpdated"
      />
    </div>
  </div>
</template>

<style scoped>
/* Container */
.care-space {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

/* Header */
.care-space-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.care-space-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d2a26;
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.care-space-subtitle {
  font-size: 0.7rem;
  color: #78716c;
  margin: 0;
  line-height: 1.5;
  font-style: italic;
}

/* Care Reminders Section */
.care-space-reminders {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.reminders-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.reminders-header-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reminders-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #44403c;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.reminders-subtitle {
  font-size: 0.6875rem;
  color: #a8a29e;
  margin: 0;
  line-height: 1.4;
  font-style: italic;
}

.add-reminder-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #78716c;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.button-icon {
  width: 1rem;
  height: 1rem;
}

.reminders-input {
  width: 100%;
}

.reminders-list {
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .care-space {
    gap: 1.25rem;
  }

  .care-space-title {
    font-size: 1.375rem;
  }

  .care-space-subtitle {
    font-size: 0.875rem;
  }

  .care-space-reminders {
    gap: 1rem;
    padding-top: 1.5rem;
    margin-top: 1.5rem;
  }

  .reminders-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .reminders-title {
    font-size: 1rem;
  }

  .reminders-subtitle {
    font-size: 0.625rem;
  }
}

/* Smooth transitions for all elements */
.care-space * {
  transition: all 0.15s ease;
}
</style>
