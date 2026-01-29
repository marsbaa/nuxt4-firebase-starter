<script setup lang="ts">
import type { CareNote } from "~/types/careNotes";

const props = defineProps<{
  notes: any; // Accept readonly from composable
  loading: boolean;
}>();

const emit = defineEmits<{
  "note-updated": [noteId: string, content: string];
}>();

// Computed to check if notes list is empty
const isEmpty = computed(() => !props.loading && props.notes.length === 0);
</script>

<template>
  <div class="care-note-list">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="loading-state"
      role="status"
      aria-label="Loading care notes"
    >
      <div class="skeleton-note" v-for="i in 3" :key="i">
        <div class="skeleton-content"></div>
        <div class="skeleton-meta"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="isEmpty"
      class="empty-state"
      role="status"
      aria-label="No care notes yet"
    >
      <AppIcon
        name="heroicons:chat-bubble-left-right"
        class="empty-icon"
        aria-hidden="true"
      />
      <p class="empty-message">No care notes yet</p>
      <p class="empty-hint">Share the first note to begin the care story</p>
    </div>

    <!-- Notes Timeline -->
    <div
      v-else
      class="notes-timeline"
      role="list"
      aria-label="Care notes timeline"
    >
      <CareNote
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @note-updated="
          (noteId, content) => emit('note-updated', noteId, content)
        "
      />
    </div>
  </div>
</template>

<style scoped>
/* Container */
.care-note-list {
  width: 100%;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-note {
  padding: 1.25rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-content {
  height: 4rem;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  border-radius: 0.375rem;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-meta {
  height: 1rem;
  width: 60%;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  border-radius: 0.375rem;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  background-color: #fafaf9;
  border: 1px dashed #d6d3d1;
  border-radius: 0.5rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #a8a29e;
  margin-bottom: 1rem;
}

.empty-message {
  font-size: 1rem;
  font-weight: 500;
  color: #57534e;
  margin: 0 0 0.5rem 0;
}

.empty-hint {
  font-size: 0.875rem;
  color: #78716c;
  margin: 0;
  max-width: 20rem;
}

/* Notes Timeline */
.notes-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .empty-message {
    font-size: 0.9375rem;
  }

  .empty-hint {
    font-size: 0.8125rem;
  }

  .skeleton-note {
    padding: 1rem;
  }
}
</style>
