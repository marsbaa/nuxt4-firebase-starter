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
  <div class="care-note" role="listitem">
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
          aria-label="Edit care note"
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
</template>

<style scoped>
/* Care Note Container */
.care-note {
  padding: 1.5rem;
  border-radius: 0.625rem;
  background-color: #ffffff;
  border: 1px solid #e7e5e4;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.02);
}

.care-note:hover {
  border-color: #d6d3d1;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 0.06);
}

/* View Mode */
.note-view {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.note-content {
  color: #292524;
  font-size: 0.9375rem;
  line-height: 1.65;
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
  color: #a8a29e;
}

.note-author {
  font-weight: 500;
  color: #78716c;
}

.note-separator {
  color: #d6d3d1;
}

.note-date,
.note-time {
  color: #a8a29e;
}

.edit-button {
  margin-left: auto;
  padding: 0.25rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #a8a29e;
  background-color: transparent;
  border: 1px solid #e7e5e4;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.edit-button:hover {
  color: #78716c;
  background-color: #fafaf9;
  border-color: #d6d3d1;
}

.edit-button:focus {
  outline: 2px solid #c2a47a;
  outline-offset: 2px;
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
  border: 1.5px solid #e7e5e4;
  border-radius: 0.5rem;
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
  transition: all 0.15s ease;
}

.edit-textarea:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #c2a47a;
  box-shadow: 0 0 0 3px rgba(194, 164, 122, 0.1);
}

.edit-textarea::placeholder {
  color: #a8a29e;
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
