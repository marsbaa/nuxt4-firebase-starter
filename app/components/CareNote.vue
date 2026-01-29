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

// Toggle edit mode
const startEdit = () => {
  editContent.value = props.note.content;
  isEditing.value = true;
};

const cancelEdit = () => {
  editContent.value = "";
  isEditing.value = false;
};

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

  // Format as "Oct 12, 2023"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (timestamp: any) => {
  if (!timestamp) return "";

  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  // Format as "2:30 PM"
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

// Check if current user is the author
const { user } = useFirebase();
const isAuthor = computed(() => user.value?.uid === props.note.authorId);
</script>

<template>
  <div class="care-note">
    <!-- View Mode -->
    <div v-if="!isEditing" class="note-view">
      <!-- Content -->
      <p class="note-content">{{ note.content }}</p>

      <!-- Meta information -->
      <div class="note-meta">
        <span class="note-author">{{ note.authorName }} shared</span>
        <span class="note-separator">·</span>
        <span class="note-date">{{ formatDate(note.createdAt) }}</span>
        <span class="note-time">{{ formatTime(note.createdAt) }}</span>

        <!-- Edit button (only for author) -->
        <button
          v-if="isAuthor"
          type="button"
          class="edit-button"
          @click="startEdit"
          aria-label="Edit this care note"
        >
          Edit
        </button>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="note-edit">
      <!-- Textarea for editing -->
      <textarea
        v-model="editContent"
        class="edit-textarea"
        rows="4"
        placeholder="Edit care note..."
        aria-label="Edit care note content"
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
</template>

<style scoped>
/* Care Note Container */
.care-note {
  padding: 1.25rem;
  border-radius: 0.5rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.care-note:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
}

/* View Mode */
.note-view {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.note-content {
  color: #1f2937;
  font-size: 0.9375rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.8125rem;
  color: #6b7280;
}

.note-author {
  font-weight: 500;
  color: #4b5563;
}

.note-separator {
  color: #d1d5db;
}

.note-date,
.note-time {
  color: #6b7280;
}

.edit-button {
  margin-left: auto;
  padding: 0.25rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  background-color: transparent;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.edit-button:hover {
  color: #4b5563;
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.edit-button:focus {
  outline: 2px solid #d97706;
  outline-offset: 2px;
}

/* Edit Mode */
.note-edit {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #1f2937;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
  transition: all 0.15s ease;
}

.edit-textarea:focus {
  outline: none;
  background-color: white;
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.edit-textarea::placeholder {
  color: #9ca3af;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .care-note {
    padding: 1rem;
  }

  .note-content {
    font-size: 0.875rem;
  }

  .note-meta {
    font-size: 0.75rem;
  }

  .edit-button {
    font-size: 0.75rem;
    padding: 0.1875rem 0.5rem;
  }

  .edit-actions {
    width: 100%;
  }

  .edit-actions button {
    flex: 1;
  }
}
</style>
