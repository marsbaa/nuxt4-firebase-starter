<!--
/**
 * CareReminderInput Component
 *
 * Provides a gentle input interface for adding new care reminders.
 * Uses pastoral language and warm, supportive styling.
 *
 * **Props:**
 * @param {boolean} loading - Loading state indicator
 *
 * **Emits:**
 * @emits reminder-added - When a reminder is added, emits (text, dueDate)
 *
 * **Features:**
 * - Text input with pastoral placeholder
 * - Optional date picker for due date
 * - Keyboard shortcuts (Cmd/Ctrl+Enter to submit)
 * - Empty input prevention with gentle feedback
 * - Auto-clear after successful submission
 * - Warm, non-urgent visual treatment
 *
 * **Design Principles:**
 * - No task management language
 * - No deadline or urgency framing
 * - Gentle, supportive interactions
 * - Calm color palette (warm earth tones)
 *
 * @example
 * ```vue
 * <CareReminderInput @reminder-added="handleReminderAdd" />
 * ```
 */
-->
<script setup lang="ts">
const props = defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  "reminder-added": [text: string, dueDate: Date | null];
}>();

// Input state
const text = ref("");
const dueDate = ref("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isSubmitting = ref(false);

// Auto-expand textarea
const adjustHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

// Watch content changes to adjust height
watch(text, () => {
  nextTick(() => adjustHeight());
});

// Handle submit
const handleSubmit = async () => {
  if (!text.value.trim() || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  try {
    // Convert date string to Date object or null
    const dueDateValue = dueDate.value ? new Date(dueDate.value) : null;

    emit("reminder-added", text.value.trim(), dueDateValue);

    // Clear inputs
    text.value = "";
    dueDate.value = "";

    // Reset textarea height
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = "auto";
      }
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Cmd/Ctrl + Enter to submit
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    handleSubmit();
  }
};

// Auto-focus and adjust height on mount
onMounted(() => {
  adjustHeight();
});

// Get minimum date (today) for date picker
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});
</script>

<template>
  <div class="care-reminder-input">
    <div class="input-container">
      <!-- Textarea for reminder text -->
      <textarea
        ref="textareaRef"
        v-model="text"
        class="input-textarea"
        placeholder="What would you like to remember...?"
        rows="2"
        aria-label="Add a care reminder for this person"
        :disabled="loading || isSubmitting"
        @keydown="handleKeydown"
      />

      <!-- Optional date picker -->
      <div class="input-row">
        <div class="date-picker-group">
          <label for="reminder-date" class="date-label">
            <AppIcon name="heroicons:calendar" class="date-icon" />
            <span>Optional reminder date</span>
          </label>
          <input
            id="reminder-date"
            v-model="dueDate"
            type="date"
            class="date-input"
            :min="minDate"
            :disabled="loading || isSubmitting"
            aria-label="Choose when to be reminded"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="input-actions">
        <AppButton
          variant="primary"
          size="sm"
          :disabled="!text.trim() || loading || isSubmitting"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          Add Care Reminder
        </AppButton>
      </div>
    </div>

    <!-- Keyboard hint -->
    <p class="keyboard-hint">
      <AppIcon name="heroicons:command-line" class="hint-icon" />
      Press <kbd>⌘ Enter</kbd> or <kbd>Ctrl Enter</kbd> to add
    </p>
  </div>
</template>

<style scoped>
/* Container */
.care-reminder-input {
  width: 100%;
}

.input-container {
  background: linear-gradient(to bottom, #fefcf9, #fdf9f3);
  border: 1px solid #f5f1e8;
  border-radius: 0.5rem;
  padding: 1.25rem;
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 2px 0 rgba(252, 248, 243, 0.3);
}

.input-container:focus-within {
  background: linear-gradient(to bottom, #fffefa, #fdf9f3);
  border-color: #ebe5d8;
  box-shadow:
    inset 0 1px 2px 0 rgba(252, 248, 243, 0.3),
    0 0 0 3px rgba(194, 164, 122, 0.05);
}

/* Textarea */
.input-textarea {
  width: 100%;
  min-height: 3rem;
  max-height: 12rem;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #44403c;
  background-color: transparent;
  border: none;
  resize: none;
  outline: none;
  font-family: inherit;
  overflow-y: hidden;
}

.input-textarea::placeholder {
  color: #a8a29e;
  font-style: italic;
}

.input-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Input Row */
.input-row {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f5f1e8;
}

/* Date Picker Group */
.date-picker-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

/* Actions */
.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Keyboard Hint */
.keyboard-hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  font-size: 0.75rem;
  color: #a8a29e;
}

.hint-icon {
  width: 0.875rem;
  height: 0.875rem;
}

kbd {
  padding: 0.125rem 0.375rem;
  font-size: 0.6875rem;
  font-family:
    ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  color: #78716c;
  background-color: #f5f4f2;
  border: 1px solid #e7e5e4;
  border-radius: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .input-container {
    padding: 1rem;
  }

  .input-textarea {
    font-size: 0.8125rem;
    min-height: 2.5rem;
  }

  .date-input {
    max-width: 100%;
    font-size: 0.875rem;
  }

  .keyboard-hint {
    display: none; /* Hide keyboard hint on mobile */
  }

  .input-actions button {
    width: 100%;
  }
}

/* Focus and hover states for accessibility */
.input-textarea:focus,
.date-input:focus {
  outline: none;
}

/* Smooth transitions */
.input-container,
.input-textarea,
.date-input,
.input-actions button {
  transition: all 0.15s ease;
}
</style>
