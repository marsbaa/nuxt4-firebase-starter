<!--
/**
 * CalendarEventForm Component
 *
 * Provides a gentle form interface for creating Community Gathering events.
 * Uses pastoral language and warm, supportive styling.
 *
 * **Props:**
 * @param {boolean} loading - Loading state indicator
 *
 * **Emits:**
 * @emits event-created - When an event is created successfully
 * @emits cancel - When the user cancels event creation
 *
 * **Features:**
 * - Title input with pastoral placeholder
 * - Date picker for event date (required)
 * - Description textarea (optional)
 * - Form validation with gentle feedback
 * - Keyboard shortcuts (Cmd/Ctrl+Enter to submit)
 * - Auto-clear after successful submission
 * - Warm, inviting visual treatment
 *
 * **Design Principles:**
 * - Uses "Community Gathering" language (not "event")
 * - Warm, supportive interactions
 * - Gentle, calm color palette
 * - No urgency or task-oriented language
 *
 * @example
 * ```vue
 * <CalendarEventForm 
 *   @event-created="handleEventCreated" 
 *   @cancel="handleCancel"
 * />
 * ```
 */
-->
<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import type {
  CreateCommunityGatheringInput,
  CommunityGatheringEvent,
  UpdateCommunityGatheringInput,
} from "~/types/calendarEvents";

const props = defineProps<{
  loading?: boolean;
  mode?: "add" | "edit";
  event?: CommunityGatheringEvent;
}>();

const emit = defineEmits<{
  "event-created": [input: CreateCommunityGatheringInput];
  "event-updated": [input: UpdateCommunityGatheringInput];
  "event-deleted": [id: string, scope?: "this" | "future" | "all"];
  cancel: [];
}>();

const { user } = useFirebase();
const { profile } = useProfile();

// Form state
const title = ref("");
const date = ref("");
const allDay = ref(true);
const startTime = ref("");
const endTime = ref("");
const description = ref("");
const isRecurring = ref(false);
const recurrenceDays = ref<string[]>([]);
const recurrenceEndCondition = ref<string>("never");
const isSubmitting = ref(false);
const titleInputRef = ref<HTMLInputElement | null>(null);
const descriptionRef = ref<HTMLTextAreaElement | null>(null);

// Validation
const titleError = ref("");
const dateError = ref("");

// Validate title
const validateTitle = () => {
  if (!title.value.trim()) {
    titleError.value = "Please provide a name for this gathering";
    return false;
  }
  titleError.value = "";
  return true;
};

// Validate date
const validateDate = () => {
  if (!date.value) {
    dateError.value = "Please choose a date for this gathering";
    return false;
  }
  dateError.value = "";
  return true;
};

// Handle delete
const handleDelete = () => {
  if (!props.event) return;

  const scope = props.event.recurrence ? "all" : undefined; // For now, default to all for recurring
  if (confirm("Are you sure you want to remove this gathering?")) {
    emit("event-deleted", props.event.id, scope);
  }
};

// Handle cancel
const handleCancel = () => {
  const hasContent =
    title.value.trim() || description.value.trim() || date.value;
  if (!hasContent || confirm("Discard this gathering?")) {
    resetForm();
    emit("cancel");
  }
};

// Toggle day selection for recurrence
const toggleDay = (day: string) => {
  const index = recurrenceDays.value.indexOf(day);
  if (index > -1) {
    recurrenceDays.value.splice(index, 1);
  } else {
    recurrenceDays.value.push(day);
  }
};

// Reset form
const resetForm = () => {
  title.value = "";
  date.value = "";
  allDay.value = true;
  startTime.value = "";
  endTime.value = "";
  description.value = "";
  isRecurring.value = false;
  recurrenceDays.value = [];
  recurrenceEndCondition.value = "never";
  titleError.value = "";
  dateError.value = "";
  if (descriptionRef.value) {
    descriptionRef.value.style.height = "auto";
  }
};

// Auto-expand description textarea
const adjustHeight = () => {
  if (descriptionRef.value) {
    descriptionRef.value.style.height = "auto";
    descriptionRef.value.style.height = `${descriptionRef.value.scrollHeight}px`;
  }
};

// Watch description changes to adjust height
watch(description, () => {
  nextTick(() => adjustHeight());
});

// Handle submit
const handleSubmit = async () => {
  if (isSubmitting.value) return;

  // Validate form
  const isTitleValid = validateTitle();
  const isDateValid = validateDate();

  if (!isTitleValid || !isDateValid) {
    return;
  }

  if (!user.value) {
    console.error("User is not authenticated");
    return;
  }

  isSubmitting.value = true;
  try {
    if (props.mode === "edit" && props.event) {
      const input: UpdateCommunityGatheringInput = {
        id: props.event.id,
        title: title.value.trim(),
        date: new Date(date.value),
        description: description.value.trim() || undefined,
        allDay: allDay.value,
        startTime: allDay.value
          ? undefined
          : startTime.value
            ? new Date(`${date.value}T${startTime.value}`)
            : undefined,
        endTime: allDay.value
          ? undefined
          : endTime.value
            ? new Date(`${date.value}T${endTime.value}`)
            : undefined,
        recurrence: isRecurring.value
          ? {
              type: "weekly",
              daysOfWeek: recurrenceDays.value,
              endCondition:
                recurrenceEndCondition.value === "never"
                  ? "never"
                  : {
                      endsOn: Timestamp.fromDate(
                        new Date(recurrenceEndCondition.value),
                      ),
                    },
            }
          : undefined,
      };
      emit("event-updated", input);
    } else {
      const input: CreateCommunityGatheringInput = {
        title: title.value.trim(),
        date: new Date(date.value),
        description: description.value.trim() || undefined,
        allDay: allDay.value,
        startTime: allDay.value
          ? undefined
          : startTime.value
            ? new Date(`${date.value}T${startTime.value}`)
            : undefined,
        endTime: allDay.value
          ? undefined
          : endTime.value
            ? new Date(`${date.value}T${endTime.value}`)
            : undefined,
        recurrence: isRecurring.value
          ? {
              type: "weekly",
              daysOfWeek: recurrenceDays.value,
              endCondition:
                recurrenceEndCondition.value === "never"
                  ? "never"
                  : {
                      endsOn: Timestamp.fromDate(
                        new Date(recurrenceEndCondition.value),
                      ),
                    },
            }
          : undefined,
        createdBy: user.value.uid,
        createdByName:
          profile.value?.displayName || user.value.email || "Anonymous",
      };

      emit("event-created", input);
      resetForm();
    }
  } catch (error) {
    console.error("Error preparing event:", error);
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
  // Escape to cancel (only if form is empty)
  if (
    event.key === "Escape" &&
    !title.value.trim() &&
    !description.value.trim() &&
    !date.value
  ) {
    emit("cancel");
  }
};

// Load event data for edit mode
const loadEventForEdit = () => {
  if (props.mode === "edit" && props.event) {
    title.value = props.event.title;
    date.value = props.event.date.toDate().toISOString().split("T")[0];
    allDay.value = props.event.allDay;
    startTime.value = props.event.startTime
      ? props.event.startTime.toDate().toTimeString().slice(0, 5)
      : "";
    endTime.value = props.event.endTime
      ? props.event.endTime.toDate().toTimeString().slice(0, 5)
      : "";
    description.value = props.event.description || "";
    isRecurring.value = !!props.event.recurrence;
    if (props.event.recurrence) {
      recurrenceDays.value = props.event.recurrence.daysOfWeek;
      recurrenceEndCondition.value =
        props.event.recurrence.endCondition === "never"
          ? "never"
          : (
              props.event.recurrence.endCondition as { endsOn: Timestamp }
            ).endsOn
              .toDate()
              .toISOString()
              .split("T")[0];
    }
  }
};

// Watch for event changes in edit mode
watch(
  () => props.event,
  () => {
    if (props.mode === "edit") {
      loadEventForEdit();
    }
  },
  { immediate: true },
);

// Auto-focus and adjust height on mount
onMounted(() => {
  nextTick(() => {
    if (props.mode !== "edit") {
      titleInputRef.value?.focus();
    }
    adjustHeight();
  });
});

// Get minimum date (today) for date picker
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

// Clear validation error on input
watch(title, () => {
  if (titleError.value) titleError.value = "";
});

watch(date, () => {
  if (dateError.value) dateError.value = "";
});
</script>

<template>
  <div class="calendar-event-form">
    <div class="form-container">
      <!-- Form Header -->
      <div class="form-header">
        <h3 class="form-title">
          {{
            mode === "edit"
              ? "Edit Community Gathering"
              : "Create a Community Gathering"
          }}
        </h3>
        <p class="form-subtitle">
          {{
            mode === "edit"
              ? "Update the details of this gathering"
              : "Mark shared moments in your church community's life together"
          }}
        </p>
        <div v-if="mode === 'edit'" class="form-header-actions">
          <AppButton
            variant="danger"
            size="sm"
            :disabled="loading || isSubmitting"
            @click="handleDelete"
          >
            <AppIcon name="heroicons:trash" class="button-icon" />
            Remove Gathering
          </AppButton>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="form-fields">
        <!-- Title Input -->
        <div class="form-field">
          <label for="event-title" class="field-label">
            <AppIcon name="heroicons:pencil" class="label-icon" />
            <span>Gathering Name</span>
          </label>
          <input
            id="event-title"
            ref="titleInputRef"
            v-model="title"
            type="text"
            class="field-input"
            :class="{ 'has-error': titleError }"
            placeholder="Sunday Service, Fellowship Picnic, Prayer Meeting..."
            aria-label="Name for this gathering"
            :disabled="loading || isSubmitting"
            @keydown="handleKeydown"
            @blur="validateTitle"
          />
          <p v-if="titleError" class="field-error">{{ titleError }}</p>
        </div>

        <!-- Date Input -->
        <div class="form-field">
          <label for="event-date" class="field-label">
            <AppIcon name="heroicons:calendar" class="label-icon" />
            <span>Date</span>
          </label>
          <input
            id="event-date"
            v-model="date"
            type="date"
            class="field-input date-input"
            :class="{ 'has-error': dateError }"
            :min="minDate"
            :disabled="loading || isSubmitting"
            aria-label="Choose the date for this gathering"
            @blur="validateDate"
          />
          <p v-if="dateError" class="field-error">{{ dateError }}</p>
        </div>

        <!-- All Day Toggle -->
        <div class="form-field">
          <label class="field-label">
            <AppIcon name="heroicons:clock" class="label-icon" />
            <span>All Day Event</span>
          </label>
          <label class="toggle">
            <input
              v-model="allDay"
              type="checkbox"
              :disabled="loading || isSubmitting"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <!-- Time Inputs (if not all day) -->
        <div v-if="!allDay" class="form-field time-fields">
          <div class="time-field">
            <label for="event-start-time" class="field-label">
              <AppIcon name="heroicons:play" class="label-icon" />
              <span>Start Time</span>
            </label>
            <input
              id="event-start-time"
              v-model="startTime"
              type="time"
              class="field-input time-input"
              :disabled="loading || isSubmitting"
              aria-label="Start time for this gathering"
            />
          </div>
          <div class="time-field">
            <label for="event-end-time" class="field-label">
              <AppIcon name="heroicons:stop" class="label-icon" />
              <span>End Time (Optional)</span>
            </label>
            <input
              id="event-end-time"
              v-model="endTime"
              type="time"
              class="field-input time-input"
              :disabled="loading || isSubmitting"
              aria-label="End time for this gathering"
            />
          </div>
        </div>

        <!-- Description Textarea -->
        <div class="form-field">
          <label for="event-description" class="field-label">
            <AppIcon name="heroicons:document-text" class="label-icon" />
            <span>Additional Context (Optional)</span>
          </label>
          <textarea
            id="event-description"
            ref="descriptionRef"
            v-model="description"
            class="field-textarea"
            placeholder="Share any additional details about this gathering..."
            rows="3"
            aria-label="Optional description for this gathering"
            :disabled="loading || isSubmitting"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Recurrence Section -->
        <div class="form-field">
          <label class="field-label">
            <AppIcon name="heroicons:arrow-path" class="label-icon" />
            <span>Repeats</span>
          </label>
          <label class="toggle">
            <input
              v-model="isRecurring"
              type="checkbox"
              :disabled="loading || isSubmitting"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <!-- Recurrence Controls (if recurring) -->
        <div v-if="isRecurring" class="recurrence-controls">
          <div class="form-field">
            <label class="field-label">
              <span>Repeat on</span>
            </label>
            <div class="day-selector">
              <button
                v-for="day in [
                  'monday',
                  'tuesday',
                  'wednesday',
                  'thursday',
                  'friday',
                  'saturday',
                  'sunday',
                ]"
                :key="day"
                type="button"
                class="day-button"
                :class="{ active: recurrenceDays.includes(day) }"
                :disabled="loading || isSubmitting"
                @click="toggleDay(day)"
              >
                {{ day.charAt(0).toUpperCase() }}
              </button>
            </div>
          </div>

          <div class="form-field">
            <label class="field-label">
              <span>End condition</span>
            </label>
            <select
              v-model="recurrenceEndCondition"
              class="field-input"
              :disabled="loading || isSubmitting"
            >
              <option value="never">Never ends</option>
              <option value="ends-on">Ends on date</option>
            </select>
          </div>

          <div v-if="recurrenceEndCondition !== 'never'" class="form-field">
            <label for="recurrence-end-date" class="field-label">
              <span>End date</span>
            </label>
            <input
              id="recurrence-end-date"
              v-model="recurrenceEndCondition"
              type="date"
              class="field-input date-input"
              :min="date"
              :disabled="loading || isSubmitting"
              aria-label="End date for recurrence"
            />
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <!-- Keyboard hint -->
        <p class="keyboard-hint">
          <AppIcon name="heroicons:command-line" class="hint-icon" />
          Press <kbd>⌘ Enter</kbd> or <kbd>Ctrl Enter</kbd> to save
        </p>

        <!-- Buttons -->
        <div class="action-buttons">
          <AppButton
            variant="secondary"
            size="md"
            :disabled="loading || isSubmitting"
            @click="handleCancel"
          >
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            size="md"
            :disabled="!title.trim() || !date || loading || isSubmitting"
            :loading="isSubmitting"
            @click="handleSubmit"
          >
            {{ mode === "edit" ? "Save Changes" : "Create Gathering" }}
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.calendar-event-form {
  width: 100%;
  max-width: 36rem;
  margin: 0 auto;
}

.form-container {
  background: linear-gradient(to bottom, #fefcf9, #fdf9f3);
  border: 1px solid #f5f1e8;
  border-radius: 0.75rem;
  padding: 1.75rem;
  box-shadow:
    inset 0 1px 2px 0 rgba(252, 248, 243, 0.3),
    0 2px 4px 0 rgba(44, 44, 42, 0.05);
}

/* Form Header */
.form-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f5f1e8;
}

.form-title {
  margin: 0 0 0.375rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #44403c;
  font-family: "Crimson Pro", Georgia, serif;
  line-height: 1.3;
}

.form-subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #78716c;
  font-style: italic;
}

/* Form Fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Field Label */
.field-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #57534e;
  cursor: pointer;
}

.label-icon {
  width: 1rem;
  height: 1rem;
  color: #c2a47a;
  opacity: 0.6;
}

/* Field Input */
.field-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: #44403c;
  background-color: #ffffff;
  border: 1px solid #e7e5e4;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.15s ease;
  font-family: inherit;
}

.field-input:focus {
  background-color: #fffefa;
  border-color: #d6cbb8;
  box-shadow: 0 0 0 3px rgba(194, 164, 122, 0.1);
}

.field-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f4f2;
}

.field-input::placeholder {
  color: #a8a29e;
  font-style: italic;
}

.field-input.has-error {
  border-color: #d97757;
  background-color: #fef8f5;
}

.field-input.has-error:focus {
  border-color: #c96543;
  box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.1);
}

/* Date Input Specific */
.date-input {
  max-width: 14rem;
}

.date-input::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}

.date-input:hover::-webkit-calendar-picker-indicator {
  opacity: 0.8;
}

/* Field Textarea */
.field-textarea {
  width: 100%;
  min-height: 5rem;
  max-height: 12rem;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #44403c;
  background-color: #ffffff;
  border: 1px solid #e7e5e4;
  border-radius: 0.5rem;
  resize: vertical;
  outline: none;
  transition: all 0.15s ease;
  font-family: inherit;
}

.field-textarea:focus {
  background-color: #fffefa;
  border-color: #d6cbb8;
  box-shadow: 0 0 0 3px rgba(194, 164, 122, 0.1);
}

.field-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f4f2;
}

.field-textarea::placeholder {
  color: #a8a29e;
  font-style: italic;
}

/* Field Error */
.field-error {
  margin: 0;
  font-size: 0.75rem;
  color: #d97757;
  font-weight: 500;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.25rem;
  border-top: 1px solid #f5f1e8;
}

.action-buttons {
  display: flex;
  gap: 0.625rem;
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
  .form-container {
    padding: 1.25rem;
  }

  .form-title {
    font-size: 1.125rem;
  }

  .form-subtitle {
    font-size: 0.8125rem;
  }

  .form-fields {
    gap: 1rem;
  }

  .field-input,
  .field-textarea {
    font-size: 0.875rem;
  }

  .date-input {
    max-width: 100%;
  }

  .form-actions {
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

  .action-buttons :deep(button) {
    flex: 1;
  }
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e7e5e4;
  border-radius: 1rem;
  transition: 0.3s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 1.125rem;
  width: 1.125rem;
  left: 0.1875rem;
  bottom: 0.1875rem;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle-slider {
  background-color: #c2a47a;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(1.5rem);
}

/* Time Fields */
.time-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.time-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-input {
  max-width: none;
}

/* Recurrence Controls */
.recurrence-controls {
  background-color: #fefcf9;
  border: 1px solid #f5f1e8;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 0.5rem;
}

.day-selector {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.day-button {
  width: 2rem;
  height: 2rem;
  border: 1px solid #e7e5e4;
  background-color: white;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: #57534e;
  cursor: pointer;
  transition: all 0.15s ease;
}

.day-button:hover {
  background-color: #f5f4f2;
  border-color: #d6cbb8;
}

.day-button.active {
  background-color: #c2a47a;
  border-color: #c2a47a;
  color: white;
}

.day-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Form Header Actions */
.form-header-actions {
  margin-top: 1rem;
}

.button-icon {
  width: 1rem;
  height: 1rem;
}

/* Smooth transitions */
.field-input,
.field-textarea,
.day-button,
.toggle-slider {
  transition: all 0.15s ease;
}
</style>
