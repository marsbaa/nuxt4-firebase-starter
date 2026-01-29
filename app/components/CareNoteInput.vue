<script setup lang="ts">
const props = defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  "note-added": [content: string];
}>();

// Input state
const content = ref("");
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
        placeholder="Share a care note…"
        rows="3"
        aria-label="Share a care note for this person"
        :disabled="loading || isSubmitting"
        @keydown="handleKeydown"
      />

      <!-- Submit Button -->
      <div class="input-actions">
        <AppButton
          variant="primary"
          size="sm"
          :disabled="!content.trim() || loading || isSubmitting"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          Share
        </AppButton>
      </div>
    </div>

    <!-- Keyboard hint -->
    <p class="keyboard-hint">
      <AppIcon name="heroicons:command-line" class="hint-icon" />
      Press <kbd>⌘ Enter</kbd> or <kbd>Ctrl Enter</kbd> to share
    </p>
  </div>
</template>

<style scoped>
/* Container */
.care-note-input {
  width: 100%;
}

.input-container {
  background-color: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.625rem;
  padding: 1rem;
  transition: all 0.2s ease;
}

.input-container:focus-within {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

/* Textarea */
.input-textarea {
  width: 100%;
  min-height: 4.5rem;
  max-height: 20rem;
  padding: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #1f2937;
  background-color: transparent;
  border: none;
  resize: none;
  outline: none;
  font-family: inherit;
  overflow-y: hidden;
}

.input-textarea::placeholder {
  color: #9ca3af;
}

.input-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Actions */
.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

/* Keyboard Hint */
.keyboard-hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
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
  color: #4b5563;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
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

  .keyboard-hint {
    display: none; /* Hide keyboard hint on mobile */
  }

  .input-actions button {
    width: 100%;
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
