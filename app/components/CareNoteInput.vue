<script setup lang="ts">
const props = defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  "note-added": [content: string];
  cancel: [];
}>();

// Input state
const content = ref("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isSubmitting = ref(false);

// Handle cancel
const handleCancel = () => {
  if (!content.value.trim() || confirm("Discard your note?")) {
    content.value = "";
    emit("cancel");
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
watch(content, () => {
  nextTick(() => adjustHeight());
});

// Handle submit
const handleSubmit = async () => {
  if (!content.value.trim() || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  try {
    emit("note-added", content.value.trim());
    content.value = "";
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
  // Escape to cancel
  if (event.key === "Escape" && !content.value.trim()) {
    emit("cancel");
  }
};

// Auto-focus on mount
onMounted(() => {
  adjustHeight();
});
</script>

<template>
  <div class="care-note-input">
    <div class="input-container">
      <!-- Textarea -->
      <textarea
        ref="textareaRef"
        v-model="content"
        class="input-textarea"
        placeholder="Share an update..."
        rows="3"
        aria-label="Share a care note for this person"
        :disabled="loading || isSubmitting"
        @keydown="handleKeydown"
      />

      <!-- Actions -->
      <div class="input-actions">
        <!-- Keyboard hint -->
        <p class="keyboard-hint">
          <AppIcon name="heroicons:command-line" class="hint-icon" />
          Press <kbd>⌘ Enter</kbd> or <kbd>Ctrl Enter</kbd> to share
        </p>

        <!-- Buttons -->
        <div class="action-buttons">
          <AppButton
            variant="secondary"
            size="sm"
            :disabled="loading || isSubmitting"
            @click="handleCancel"
          >
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            size="sm"
            :disabled="!content.trim() || loading || isSubmitting"
            :loading="isSubmitting"
            @click="handleSubmit"
          >
            Add Care Note
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.care-note-input {
  width: 100%;
}

.input-container {
  background-color: #fafaf9;
  border: 1px solid #f5f5f4;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.2s ease;
  box-shadow: none;
}

.input-container:focus-within {
  background-color: #ffffff;
  border-color: #e7e5e4;
  box-shadow: 0 0 0 3px rgba(194, 164, 122, 0.05);
}

/* Textarea */
.input-textarea {
  width: 100%;
  min-height: 5rem;
  max-height: 20rem;
  padding: 0;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: #292524;
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

/* Actions */
.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f5f5f4;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Keyboard Hint */
.keyboard-hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
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
    padding: 0.875rem;
  }

  .input-textarea {
    font-size: 0.875rem;
    min-height: 4rem;
  }

  .input-actions {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .keyboard-hint {
    display: none; /* Hide keyboard hint on mobile */
  }

  .action-buttons {
    width: 100%;
  }

  .action-buttons button {
    flex: 1;
  }
}

/* Focus and hover states for accessibility */
.input-textarea:focus {
  outline: none;
}

/* Smooth transitions */
.input-container,
.input-textarea,
.input-actions button {
  transition: all 0.15s ease;
}
</style>
