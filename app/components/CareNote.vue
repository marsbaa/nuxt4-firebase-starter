<!--
/**
 * CareNote Component
 *
 * Displays a single care note with inline editing and history viewing capabilities.
 * Part of the Care Space timeline interface.
 *
 * **Props:**
 * @param {CareNote} note - The care note object containing id, content, author info, timestamps, and history
 *
 * **Emits:**
 * @emits note-updated - When a note is edited, emits (noteId, newContent)
 *
 * **Features:**
 * - Inline editing with textarea (only for note author)
 * - Edit history viewer (expandable, shows all previous versions)
 * - Timeline indicator with visual connection to other notes
 * - Hover-revealed action buttons (edit, history)
 * - Keyboard shortcuts (Escape to cancel, Cmd/Ctrl+Enter to save)
 * - Responsive design with mobile-optimized touch targets
 *
 * **Permissions:**
 * - View: All users can see all care notes
 * - Edit: Only the original author can edit (checked via isAuthor computed)
 * - History: Visible to all users if note has been edited
 *
 * **Design Language:**
 * Uses pastoral care language ("Shared by" not "Posted by")
 * Warm earth tones with generous spacing for calm, focused reading
 *
 * @example
 * ```vue
 * <CareNote
 *   :note="careNote"
 *   @note-updated="handleNoteUpdate"
 * />
 * ```
 */
-->
<script setup lang="ts">
import type { CareNote } from "~/types/careNotes";

const props = defineProps<{
  note: CareNote;
}>();

const emit = defineEmits<{
  "note-updated": [noteId: string, content: string];
}>();

// Edit mode state
const isEditing = ref(false);
const editContent = ref("");

// History view state
const showHistory = ref(false);

/**
 * Enter edit mode
 * Populates textarea with current content
 */
const startEdit = () => {
  editContent.value = props.note.content;
  isEditing.value = true;
};

/**
 * Cancel editing
 * Discards changes and returns to view mode
 */
const cancelEdit = () => {
  editContent.value = "";
  isEditing.value = false;
};

/**
 * Save edited content
 * Emits note-updated event for parent to handle
 * Parent will call useCareNotes.updateNote() which preserves history
 */
const saveEdit = () => {
  if (editContent.value.trim()) {
    emit("note-updated", props.note.id, editContent.value.trim());
    isEditing.value = false;
  }
};

// Format timestamp for display
const formatDate = (timestamp: any) => {
  if (!timestamp) return "";

  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  // Format as "October 12, 2023"
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Check if current user is the author
const { user } = useFirebase();
const isAuthor = computed(() => user.value?.uid === props.note.authorId);

// Check if note has history
const hasHistory = computed(
  () => props.note.history && props.note.history.length > 0,
);

// Toggle history view
const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

// Format full date and time for history
const formatDateTime = (timestamp: any) => {
  if (!timestamp) return "";

  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  // Format as "October 12, 2023 at 2:30 PM"
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="care-note" role="listitem">
    <!-- Timeline Dot -->
    <div class="timeline-indicator">
      <div class="timeline-dot"></div>
      <div class="timeline-line"></div>
    </div>

    <!-- Note Content Area -->
    <div class="note-content-area">
      <!-- Header: Date on left, Shared by on right -->
      <div class="note-header">
        <div class="note-date">{{ formatDate(note.createdAt) }}</div>
        <div class="note-meta-right">
          <span class="note-author">Shared by {{ note.authorName }}</span>
        </div>
      </div>

      <!-- View Mode -->
      <div v-if="!isEditing" class="note-view">
        <p class="note-content">{{ note.content }}</p>

        <!-- Action buttons below the note -->
        <div class="note-actions">
          <!-- Edit button (only for author) -->
          <button
            v-if="isAuthor"
            type="button"
            class="action-button"
            @click="startEdit"
            aria-label="Edit care note"
          >
            <AppIcon name="heroicons:pencil" class="action-icon" />
          </button>

          <!-- History button (only if has history) -->
          <button
            v-if="hasHistory"
            type="button"
            class="action-button"
            @click="toggleHistory"
            :aria-expanded="showHistory"
            :aria-label="
              showHistory ? 'Hide edit history' : 'View edit history'
            "
          >
            <AppIcon name="heroicons:clock" class="action-icon" />
          </button>
        </div>

        <!-- History View -->
        <div v-if="showHistory && hasHistory" class="history-list">
          <div class="history-header">Previous versions:</div>
          <div
            v-for="(entry, index) in note.history"
            :key="index"
            class="history-entry"
          >
            <div class="history-entry-header">
              <span class="history-entry-date">{{
                formatDateTime(entry.editedAt)
              }}</span>
              <span class="history-entry-author"
                >by {{ entry.editedByName }}</span
              >
            </div>
            <p class="history-entry-content">{{ entry.content }}</p>
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="note-edit">
        <!-- Textarea for editing -->
        <textarea
          v-model="editContent"
          class="edit-textarea"
          rows="4"
          placeholder="Edit your care note…"
          aria-label="Care note content editor"
          @keydown.escape="cancelEdit"
          @keydown.meta.enter="saveEdit"
          @keydown.ctrl.enter="saveEdit"
        />

        <!-- Action buttons -->
        <div class="edit-actions">
          <AppButton variant="secondary" size="sm" @click="cancelEdit">
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            size="sm"
            @click="saveEdit"
            :disabled="!editContent.trim()"
          >
            Save
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Care Note Container */
.care-note {
  display: flex;
  gap: 1rem;
  padding: 0;
  margin-bottom: 2rem;
  position: relative;
  transition: all 0.2s ease;
}

.care-note:last-child {
  margin-bottom: 0;
}

.care-note:last-child .timeline-line {
  display: none;
}

/* Timeline Indicator */
.timeline-indicator {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 1.25rem;
  padding-top: 0.125rem;
}

.timeline-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid #d6d3d1;
  z-index: 1;
  transition: all 0.2s ease;
}

.timeline-line {
  position: absolute;
  top: 0.75rem;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  background-color: #e7e5e4;
}

/* Note Content Area */
.note-content-area {
  flex: 1;
  min-width: 0;
}

/* Note Header */
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.note-date {
  font-size: 0.6875rem;
  font-weight: 400;
  color: #d6d3d1;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.note-meta-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.note-author {
  font-size: 0.6875rem;
  font-weight: 400;
  color: #d6d3d1;
  font-style: italic;
}

/* View Mode */
.note-view {
  display: flex;
  flex-direction: column;
}

/* Note Content */
.note-content {
  color: #292524;
  font-size: 0.9375rem;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

/* Action Buttons Container */
.note-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;
  margin-top: 0.5rem;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.care-note:hover .note-actions {
  opacity: 1;
}

/* Action Button */
.action-button {
  padding: 0.375rem;
  color: #a8a29e;
  background-color: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  min-height: 1.75rem;
}

.action-button:hover {
  color: #78716c;
  background-color: #f5f5f4;
}

.action-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* Edit Mode */
.note-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-textarea {
  width: 100%;
  padding: 1rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: #292524;
  background-color: #fafaf9;
  border: 1px solid #f5f5f4;
  border-radius: 0.375rem;
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
  transition: all 0.15s ease;
}

.edit-textarea:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #e7e5e4;
  box-shadow: 0 0 0 3px rgba(194, 164, 122, 0.05);
}

.edit-textarea::placeholder {
  color: #a8a29e;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* History List */
.history-list {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fafaf9;
  border: 1px solid #f5f5f4;
  border-radius: 0.375rem;
}

.history-header {
  font-size: 0.75rem;
  font-weight: 600;
  color: #78716c;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.75rem;
}

.history-entry {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f4;
}

.history-entry:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.history-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.375rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.history-entry-date {
  font-size: 0.6875rem;
  color: #a8a29e;
  font-weight: 500;
}

.history-entry-author {
  font-size: 0.6875rem;
  color: #a8a29e;
  font-style: italic;
}

.history-entry-content {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #57534e;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  opacity: 0.85;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .care-note {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .timeline-line {
    bottom: -1.5rem;
  }

  .timeline-indicator {
    width: 1rem;
  }

  .timeline-dot {
    width: 0.375rem;
    height: 0.375rem;
  }

  .note-date,
  .note-author {
    font-size: 0.625rem;
  }

  .note-content {
    font-size: 0.875rem;
  }

  .note-actions {
    /* Always visible on mobile since hover doesn't work well on touch */
    opacity: 1;
  }

  .action-button {
    /* Ensure touch target is at least 44x44px */
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding: 0.625rem;
  }

  .edit-actions {
    width: 100%;
  }

  .edit-actions button {
    flex: 1;
  }
}
</style>
