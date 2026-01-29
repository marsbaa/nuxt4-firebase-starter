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
 * **Emits:**
 * @emits update - When a reminder is updated, emits (reminderId, text, dueDate)
 *
 * **Design Principles:**
 * - Warm, subtle background (lightest amber/beige)
 * - Gentle outline or inset border
 * - Low-contrast "remembering" icon (bookmark-like)
 * - No urgency colors (red, orange)
 * - No task indicators (checkboxes, progress bars)
 * - Pastoral language ("Held by" not "Assigned to")
 * - Edit button appears on hover for updating reminders
 *
 * @example
 * ```vue
 * <CareReminder :reminder="careReminder" @update="handleUpdate" />
 * ```
 */
-->
<script setup lang="ts">
import type { CareReminder } from "~/types/careReminders";

const props = defineProps<{
  reminder: CareReminder;
}>();

const emit = defineEmits<{
  update: [reminderId: string, text: string, dueDate: Date | null];
}>();

// Edit state
const isEditing = ref(false);
const editText = ref("");
const editDueDate = ref("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isSubmitting = ref(false);

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

/**
 * Format date for input field (YYYY-MM-DD)
 */
const formatDateForInput = (timestamp: any): string => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toISOString().split("T")[0];
};

const formattedDueDate = computed(() => formatDueDate(props.reminder.dueDate));

// Get minimum date (today) for date picker
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

// Start editing
const startEditing = () => {
  editText.value = props.reminder.text;
  editDueDate.value = formatDateForInput(props.reminder.dueDate);
  isEditing.value = true;
  nextTick(() => {
    textareaRef.value?.focus();
    adjustHeight();
  });
};

// Cancel editing
const cancelEditing = () => {
  if (!editText.value.trim() || editText.value === props.reminder.text) {
    isEditing.value = false;
    editText.value = "";
    editDueDate.value = "";
    return;
  }

  if (confirm("Discard your changes?")) {
    isEditing.value = false;
    editText.value = "";
    editDueDate.value = "";
  }
};

// Save changes
const saveChanges = async () => {
  if (!editText.value.trim() || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  try {
    const dueDateValue = editDueDate.value ? new Date(editDueDate.value) : null;
    emit("update", props.reminder.id, editText.value.trim(), dueDateValue);

    isEditing.value = false;
    editText.value = "";
    editDueDate.value = "";
  } finally {
    isSubmitting.value = false;
  }
};

// Auto-expand textarea
const adjustHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

// Watch content changes to adjust height
watch(editText, () => {
  nextTick(() => adjustHeight());
});

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Cmd/Ctrl + Enter to submit
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    saveChanges();
  }
  // Escape to cancel
  if (event.key === "Escape") {
    cancelEditing();
  }
};
</script>

<template>
  <div class="care-reminder" role="listitem">
    <!-- Edit Mode -->
    <div v-if="isEditing" class="edit-container">
      <!-- Textarea for reminder text -->
      <textarea
        ref="textareaRef"
        v-model="editText"
        class="edit-textarea"
        placeholder="What would you like to remember...?"
        rows="2"
        aria-label="Edit care reminder"
        :disabled="isSubmitting"
        @keydown="handleKeydown"
      />

      <!-- Date picker -->
      <div class="edit-date-row">
        <label for="edit-reminder-date" class="date-label">
          <AppIcon name="heroicons:calendar" class="date-icon" />
          <span>Reminder date</span>
        </label>
        <input
          id="edit-reminder-date"
          v-model="editDueDate"
          type="date"
          class="date-input"
          :min="minDate"
          :disabled="isSubmitting"
          aria-label="Choose when to be reminded"
        />
      </div>

      <!-- Actions -->
      <div class="edit-actions">
        <button
          class="action-button cancel-button"
          :disabled="isSubmitting"
          @click="cancelEditing"
          aria-label="Cancel editing"
          title="Cancel"
        >
          <AppIcon name="heroicons:x-mark" />
        </button>
        <button
          class="action-button save-button"
          :disabled="!editText.trim() || isSubmitting"
          @click="saveChanges"
          aria-label="Save changes"
          title="Save"
        >
          <AppIcon v-if="!isSubmitting" name="heroicons:check" />
          <span v-else class="spinner"></span>
        </button>
      </div>
    </div>

    <!-- View Mode -->
    <template v-else>
      <!-- Card Header with Date, Icon, and Edit Button -->
      <div class="reminder-header">
        <span class="reminder-date">{{ formattedDueDate }}</span>
        <div class="header-actions">
          <button
            class="edit-button"
            @click="startEditing"
            aria-label="Edit care reminder"
            title="Edit reminder"
          >
            <AppIcon name="heroicons:pencil" />
          </button>
          <AppIcon
            name="heroicons:bookmark"
            class="reminder-icon"
            aria-hidden="true"
          />
        </div>
      </div>

      <!-- Reminder Text Content -->
      <div class="reminder-content">
        <p class="reminder-text">{{ reminder.text }}</p>
      </div>
    </template>
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
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

/* Edit Button */
.edit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  color: #78716c;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s ease;
}

.edit-button:hover {
  background: rgba(194, 164, 122, 0.1);
  color: #c2a47a;
}

.edit-button:focus {
  opacity: 1;
  outline: 2px solid rgba(194, 164, 122, 0.2);
  outline-offset: 2px;
}

.edit-button :deep(svg) {
  width: 1rem;
  height: 1rem;
}

/* Show edit button on card hover */
@media (hover: hover) {
  .care-reminder:hover .edit-button {
    opacity: 1;
  }

  .care-reminder:hover {
    background: linear-gradient(to bottom, #fefcf9, #fcf6ed);
    border-color: #ebe5d8;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  }
}

/* Always show edit button on touch devices */
@media (hover: none) {
  .edit-button {
    opacity: 1;
  }
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

/* Edit Container */
.edit-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Edit Textarea */
.edit-textarea {
  width: 100%;
  min-height: 3rem;
  max-height: 12rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #44403c;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #ebe5d8;
  resize: none;
  outline: none;
  font-family: inherit;
  overflow-y: hidden;
}

.edit-textarea::placeholder {
  color: #a8a29e;
  font-style: italic;
}

.edit-textarea:focus {
  border-bottom-color: #c2a47a;
}

.edit-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Edit Date Row */
.edit-date-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(245, 241, 232, 0.6);
}

.date-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #78716c;
  font-weight: 500;
  cursor: pointer;
}

.date-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #c2a47a;
  opacity: 0.5;
}

.date-input {
  width: 100%;
  max-width: 12rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: #44403c;
  background-color: #fefcf9;
  border: 1px solid #ebe5d8;
  border-radius: 0.375rem;
  outline: none;
  transition: all 0.15s ease;
  font-family: inherit;
}

.date-input:focus {
  background-color: #ffffff;
  border-color: #d6cbb8;
  box-shadow: 0 0 0 3px rgba(194, 164, 122, 0.08);
}

.date-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Custom date input styling */
.date-input::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}

.date-input:hover::-webkit-calendar-picker-indicator {
  opacity: 0.8;
}

/* Edit Actions */
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(245, 241, 232, 0.6);
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s ease;
  background: transparent;
}

.cancel-button {
  border-color: #e7e5e4;
  color: #78716c;
}

.cancel-button:hover:not(:disabled) {
  background: #f5f4f2;
  border-color: #d6d3d1;
  color: #57534e;
}

.save-button {
  border-color: #c2a47a;
  color: #c2a47a;
  background: rgba(194, 164, 122, 0.05);
}

.save-button:hover:not(:disabled) {
  background: #c2a47a;
  color: #ffffff;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button:focus {
  outline: 2px solid rgba(194, 164, 122, 0.2);
  outline-offset: 2px;
}

/* Spinner for loading state */
.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(194, 164, 122, 0.2);
  border-top-color: #c2a47a;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

  .edit-button {
    width: 1.25rem;
    height: 1.25rem;
  }

  .edit-button :deep(svg) {
    width: 0.875rem;
    height: 0.875rem;
  }

  .edit-textarea {
    font-size: 0.8125rem;
    min-height: 2.5rem;
  }

  .date-input {
    max-width: 100%;
    font-size: 0.875rem;
  }

  .action-button {
    width: 1.875rem;
    height: 1.875rem;
  }

  .action-button :deep(svg) {
    width: 1rem;
    height: 1rem;
  }
}

/* Focus state for accessibility */
.care-reminder:focus-within {
  outline: 2px solid rgba(194, 164, 122, 0.2);
  outline-offset: 2px;
}
</style>
