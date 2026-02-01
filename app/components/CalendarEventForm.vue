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
  clickedOccurrence?: CommunityGatheringEvent;
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
const visibleToCareTeam = ref(true);
const isRecurring = ref(false);
const recurrenceFrequency = ref<"weekly" | "monthly">("weekly");
const recurrenceDays = ref<string[]>([]);
const recurrenceEndCondition = ref<string>("never");
const isSubmitting = ref(false);
const titleInputRef = ref<HTMLInputElement | null>(null);
const descriptionRef = ref<HTMLTextAreaElement | null>(null);
const showDeleteConfirm = ref(false);
const deleteScope = ref<"this" | "future" | "all">("all");

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
  showDeleteConfirm.value = true;
  deleteScope.value = props.event.recurrence ? "all" : "this";
};

// Confirm delete
const confirmDelete = () => {
  if (!props.event) return;
  emit(
    "event-deleted",
    props.event.seriesId || props.event.id,
    deleteScope.value,
  );
  showDeleteConfirm.value = false;
};

// Cancel delete
const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

// Handle close (from header CLOSE button - no confirmation)
const handleClose = () => {
  resetForm();
  emit("cancel");
};

// Handle cancel (from Cancel button - no confirmation)
const handleCancel = () => {
  resetForm();
  emit("cancel");
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
  visibleToCareTeam.value = true;
  isRecurring.value = false;
  recurrenceFrequency.value = "weekly";
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
        id: props.event.seriesId || props.event.id,
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
              type: recurrenceFrequency.value,
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
              type: recurrenceFrequency.value,
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
    const dateStr = props.event.date.toDate().toISOString().split("T")[0];
    date.value = dateStr || "";
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
      recurrenceFrequency.value = props.event.recurrence.type;
      recurrenceDays.value = props.event.recurrence.daysOfWeek;
      const endCondition =
        props.event.recurrence.endCondition === "never"
          ? "never"
          : (
              props.event.recurrence.endCondition as { endsOn: Timestamp }
            ).endsOn
              .toDate()
              .toISOString()
              .split("T")[0];
      recurrenceEndCondition.value = endCondition || "never";
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
          {{ mode === "edit" ? "Edit Event" : "Add Event" }}
        </h3>
        <button
          type="button"
          class="close-link"
          :disabled="loading || isSubmitting"
          @click="handleClose"
        >
          CLOSE
        </button>
      </div>

      <!-- Form Fields -->
      <div class="form-fields">
        <!-- Title Input -->
        <div class="form-field">
          <input
            id="event-title"
            ref="titleInputRef"
            v-model="title"
            type="text"
            class="field-input title-input"
            :class="{ 'has-error': titleError }"
            placeholder="e.g. Lord's Day or Prayer Meeting"
            aria-label="Event title"
            :disabled="loading || isSubmitting"
            @keydown="handleKeydown"
            @blur="validateTitle"
          />
          <p v-if="titleError" class="field-error">{{ titleError }}</p>
        </div>

        <!-- Date and Time Row -->
        <div class="date-time-row">
          <div class="form-field">
            <label for="event-date" class="field-label-uppercase">DATE</label>
            <input
              id="event-date"
              v-model="date"
              type="date"
              class="field-input date-input"
              :class="{ 'has-error': dateError }"
              :min="minDate"
              :disabled="loading || isSubmitting"
              aria-label="Event date"
              @blur="validateDate"
            />
            <p v-if="dateError" class="field-error">{{ dateError }}</p>
          </div>

          <div class="form-field">
            <label for="event-time" class="field-label-uppercase">TIME</label>
            <input
              id="event-time"
              v-model="startTime"
              type="time"
              class="field-input time-input"
              :disabled="loading || isSubmitting || allDay"
              aria-label="Event time"
            />
          </div>
        </div>

        <!-- All Day Toggle -->
        <div class="form-field checkbox-field">
          <label class="checkbox-label">
            <input
              v-model="allDay"
              type="checkbox"
              class="checkbox-input"
              :disabled="loading || isSubmitting"
            />
            <span class="checkbox-text">All-day event</span>
          </label>
        </div>

        <!-- Description Textarea -->
        <div class="form-field">
          <label for="event-description" class="field-label-uppercase"
            >NOTES (OPTIONAL)</label
          >
          <textarea
            id="event-description"
            ref="descriptionRef"
            v-model="description"
            class="field-textarea"
            placeholder="Details about the gathering..."
            rows="3"
            aria-label="Optional notes for this event"
            :disabled="loading || isSubmitting"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Visible to Care Team Checkbox -->
        <div class="form-field checkbox-field">
          <label class="checkbox-label">
            <input
              v-model="visibleToCareTeam"
              type="checkbox"
              class="checkbox-input"
              :disabled="loading || isSubmitting"
            />
            <span class="checkbox-text">Visible to the care team</span>
          </label>
        </div>

        <!-- Recurrence Section -->
        <div class="form-field checkbox-field">
          <label class="checkbox-label">
            <input
              v-model="isRecurring"
              type="checkbox"
              class="checkbox-input"
              :disabled="loading || isSubmitting"
            />
            <span class="checkbox-text">Repeats</span>
          </label>
        </div>

        <!-- Recurrence Controls (if recurring) -->
        <div v-if="isRecurring" class="recurrence-controls">
          <!-- Frequency Selector -->
          <div class="frequency-selector">
            <button
              type="button"
              class="frequency-button"
              :class="{ active: recurrenceFrequency === 'weekly' }"
              :disabled="loading || isSubmitting"
              @click="recurrenceFrequency = 'weekly'"
            >
              Weekly
            </button>
            <button
              type="button"
              class="frequency-button"
              :class="{ active: recurrenceFrequency === 'monthly' }"
              :disabled="loading || isSubmitting"
              @click="recurrenceFrequency = 'monthly'"
            >
              Monthly
            </button>
          </div>

          <!-- Day Selector -->
          <div class="day-selector">
            <button
              v-for="(dayInfo, index) in [
                { label: 'S', value: 'sunday' },
                { label: 'M', value: 'monday' },
                { label: 'T', value: 'tuesday' },
                { label: 'W', value: 'wednesday' },
                { label: 'T', value: 'thursday' },
                { label: 'F', value: 'friday' },
                { label: 'S', value: 'saturday' },
              ]"
              :key="index"
              type="button"
              class="day-button"
              :class="{
                active: recurrenceDays.includes(dayInfo.value),
              }"
              :disabled="loading || isSubmitting"
              @click="toggleDay(dayInfo.value)"
            >
              {{ dayInfo.label }}
            </button>
          </div>

          <!-- Communal Rhythm Indicator -->
          <div class="communal-rhythm-indicator">
            <AppIcon name="heroicons:calendar" class="rhythm-icon" />
            <span class="rhythm-text">This is a communal rhythm</span>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <!-- Primary Action Button -->
        <button
          type="button"
          class="submit-button"
          :disabled="!title.trim() || !date || loading || isSubmitting"
          @click="handleSubmit"
        >
          {{ mode === "edit" ? "Save Changes" : "Add Event" }}
        </button>

        <!-- Cancel Link -->
        <button
          type="button"
          class="cancel-link"
          :disabled="loading || isSubmitting"
          @click="handleCancel"
        >
          Cancel
        </button>

        <!-- Delete Link (Edit Mode Only) -->
        <button
          v-if="mode === 'edit'"
          type="button"
          class="delete-link"
          :disabled="loading || isSubmitting"
          @click="handleDelete"
        >
          Delete this event
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="showDeleteConfirm"
      class="delete-confirmation-overlay"
      @click="cancelDelete"
    >
      <div class="delete-confirmation-dialog" @click.stop>
        <div class="confirmation-header">
          <h3 class="confirmation-title">Remove this gathering?</h3>
          <button
            type="button"
            class="confirmation-close"
            @click="cancelDelete"
          >
            <AppIcon name="heroicons:x-mark" class="close-icon" />
          </button>
        </div>
        <div class="confirmation-body">
          <p class="confirmation-message">
            This will remove the gathering from the calendar.
            {{ event?.recurrence ? "How would you like to proceed?" : "" }}
          </p>
          <div v-if="event?.recurrence" class="scope-options">
            <label class="scope-option">
              <input
                v-model="deleteScope"
                type="radio"
                value="this"
                class="scope-radio"
              />
              <span class="scope-text">Just this time</span>
            </label>
            <label class="scope-option">
              <input
                v-model="deleteScope"
                type="radio"
                value="future"
                class="scope-radio"
              />
              <span class="scope-text">This and future times</span>
            </label>
            <label class="scope-option">
              <input
                v-model="deleteScope"
                type="radio"
                value="all"
                class="scope-radio"
              />
              <span class="scope-text">All times</span>
            </label>
          </div>
        </div>
        <div class="confirmation-actions">
          <button
            type="button"
            class="confirmation-cancel"
            @click="cancelDelete"
          >
            Keep it
          </button>
          <button
            type="button"
            class="confirmation-confirm"
            @click="confirmDelete"
          >
            Yes, remove
          </button>
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
  background: #ffffff;
  border: 1px solid #e7e5e4;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Form Header */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0;
  border-bottom: none;
}

.form-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #292524;
  font-family: "Work Sans", sans-serif;
  line-height: 1.3;
}

.close-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #78716c;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: color 0.15s ease;
}

.close-link:hover:not(:disabled) {
  color: #44403c;
}

.close-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Form Fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Field Label */
.field-label-uppercase {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #78716c;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

/* Field Input */
.field-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #292524;
  background-color: #ffffff;
  border: 1px solid #d6d3d1;
  border-radius: 0.375rem;
  outline: none;
  transition: all 0.15s ease;
  font-family: "Work Sans", sans-serif;
}

.field-input:focus {
  border-color: #78716c;
  box-shadow: 0 0 0 2px rgba(120, 113, 108, 0.1);
}

.field-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f4;
}

.field-input::placeholder {
  color: #a8a29e;
  font-style: normal;
}

.field-input.has-error {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.field-input.has-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
}

/* Title Input Specific */
.title-input {
  font-size: 1rem;
  padding: 0.75rem 1rem;
}

/* Date and Time Row */
.date-time-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

/* Date Input Specific */
.date-input {
  max-width: none;
}

.date-input::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}

.date-input:hover::-webkit-calendar-picker-indicator {
  opacity: 0.8;
}

/* Time Input Specific */
.time-input {
  max-width: none;
}

.time-input::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}

.time-input:hover::-webkit-calendar-picker-indicator {
  opacity: 0.8;
}

/* Field Textarea */
.field-textarea {
  width: 100%;
  min-height: 4rem;
  max-height: 10rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #292524;
  background-color: #ffffff;
  border: 1px solid #d6d3d1;
  border-radius: 0.375rem;
  resize: vertical;
  outline: none;
  transition: all 0.15s ease;
  font-family: "Work Sans", sans-serif;
}

.field-textarea:focus {
  border-color: #78716c;
  box-shadow: 0 0 0 2px rgba(120, 113, 108, 0.1);
}

.field-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f4;
}

.field-textarea::placeholder {
  color: #a8a29e;
  font-style: normal;
}

/* Field Error */
.field-error {
  margin: 0;
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 500;
}

/* Checkbox Field */
.checkbox-field {
  margin: 0.25rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 1.125rem;
  height: 1.125rem;
  border: 1.5px solid #d6d3d1;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.15s ease;
  accent-color: #44403c;
}

.checkbox-input:hover {
  border-color: #78716c;
}

.checkbox-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #44403c;
  font-weight: 400;
}

/* Form Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: none;
}

/* Submit Button */
.submit-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #0f766e;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Work Sans", sans-serif;
}

.submit-button:hover:not(:disabled) {
  background-color: #115e59;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Cancel Link */
.cancel-link {
  background: none;
  border: none;
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #78716c;
  cursor: pointer;
  text-align: center;
  transition: color 0.15s ease;
  font-family: "Work Sans", sans-serif;
}

.cancel-link:hover:not(:disabled) {
  color: #44403c;
}

.cancel-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Delete Link */
.delete-link {
  background: none;
  border: none;
  padding: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #6b7280;
  cursor: pointer;
  text-align: center;
  transition: color 0.15s ease;
  font-family: "Work Sans", sans-serif;
  margin-top: 1rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 1rem;
}

.delete-link:hover:not(:disabled) {
  color: #374151;
}

.delete-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Recurrence Controls */
.recurrence-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: 0;
  margin-top: 0.5rem;
}

/* Frequency Selector */
.frequency-selector {
  display: flex;
  gap: 0.5rem;
}

.frequency-button {
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #57534e;
  background-color: #ffffff;
  border: 1px solid #d6d3d1;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Work Sans", sans-serif;
}

.frequency-button:hover:not(:disabled) {
  background-color: #f5f5f4;
  border-color: #78716c;
}

.frequency-button.active {
  background-color: #44403c;
  border-color: #44403c;
  color: #ffffff;
}

.frequency-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Day Selector */
.day-selector {
  display: flex;
  gap: 0.375rem;
  justify-content: center;
}

.day-button {
  width: 2.5rem;
  height: 2.5rem;
  border: 1.5px solid #d6d3d1;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #57534e;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Work Sans", sans-serif;
}

.day-button:hover:not(:disabled) {
  background-color: #f5f5f4;
  border-color: #78716c;
}

.day-button.active {
  background-color: #44403c;
  border-color: #44403c;
  color: #ffffff;
}

.day-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Communal Rhythm Indicator */
.communal-rhythm-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #ffffff;
  border-radius: 0.375rem;
}

.rhythm-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #78716c;
}

.rhythm-text {
  font-size: 0.8125rem;
  color: #57534e;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .calendar-event-form {
    min-height: 100vh;
  }

  .form-container {
    padding: 1.5rem;
    padding-top: max(1.5rem, env(safe-area-inset-top));
    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
    border: none;
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
  }

  .form-title {
    font-size: 1rem;
  }

  .form-fields {
    gap: 1.25rem;
  }

  .date-time-row {
    grid-template-columns: 1fr;
  }

  .day-selector {
    gap: 0.25rem;
  }

  .day-button {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.8125rem;
  }

  .delete-confirmation-dialog {
    padding: 1.25rem;
    margin: 1rem;
  }
}

/* Delete Confirmation Overlay */
.delete-confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-confirmation-dialog {
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 28rem;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.confirmation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.confirmation-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #292524;
  font-family: "Work Sans", sans-serif;
}

.confirmation-close {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #78716c;
  transition: color 0.15s ease;
}

.confirmation-close:hover {
  color: #44403c;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.confirmation-body {
  margin-bottom: 1.5rem;
}

.confirmation-message {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #44403c;
  line-height: 1.5;
  font-family: "Work Sans", sans-serif;
}

.scope-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scope-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.scope-radio {
  width: 1rem;
  height: 1rem;
  border: 1.5px solid #d6d3d1;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s ease;
  accent-color: #0f766e;
}

.scope-text {
  font-size: 0.875rem;
  color: #44403c;
  font-weight: 400;
  font-family: "Work Sans", sans-serif;
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.confirmation-cancel {
  background: none;
  border: 1px solid #d6d3d1;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Work Sans", sans-serif;
}

.confirmation-cancel:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.confirmation-confirm {
  background-color: #dc2626;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Work Sans", sans-serif;
}

.confirmation-confirm:hover {
  background-color: #b91c1c;
}

/* Smooth transitions */
.field-input,
.field-textarea,
.day-button,
.frequency-button,
.submit-button,
.cancel-link,
.delete-link {
  transition: all 0.15s ease;
}
</style>
