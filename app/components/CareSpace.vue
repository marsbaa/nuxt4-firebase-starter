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
} = useCareReminders(props.memberId);

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
  } catch (error) {
    console.error("Error adding care reminder:", error);
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
        <h3 class="reminders-title">Care Reminders</h3>
      </div>

      <!-- Care Reminder Input -->
      <div class="reminders-input">
        <CareReminderInput
          :loading="remindersLoading"
          @reminder-added="handleReminderAdded"
        />
      </div>

      <!-- Care Reminder List -->
      <div class="reminders-list">
        <CareReminderList :reminders="reminders" :loading="remindersLoading" />
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
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #f5f1e8;
}

.reminders-header {
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

  .reminders-title {
    font-size: 1rem;
  }
}

/* Smooth transitions for all elements */
.care-space * {
  transition: all 0.15s ease;
}
</style>
