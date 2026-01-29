<script setup lang="ts">
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
        <!-- Timeline Dot -->
        <div class="skeleton-timeline">
          <div class="skeleton-dot"></div>
          <div class="skeleton-line" v-if="i < 3"></div>
        </div>
        <!-- Content Area -->
        <div class="skeleton-content-area">
          <div class="skeleton-header">
            <div class="skeleton-date"></div>
            <div class="skeleton-author"></div>
          </div>
          <div class="skeleton-content"></div>
        </div>
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
  gap: 0;
}

.skeleton-note {
  display: flex;
  gap: 1rem;
  padding: 0;
  margin-bottom: 2rem;
  position: relative;
}

.skeleton-note:last-child {
  margin-bottom: 0;
}

.skeleton-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 1.25rem;
  padding-top: 0.125rem;
}

.skeleton-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #e7e5e4;
  border: 2px solid #f5f5f4;
  z-index: 1;
}

.skeleton-line {
  position: absolute;
  top: 0.75rem;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  background-color: #e7e5e4;
}

.skeleton-content-area {
  flex: 1;
  min-width: 0;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.skeleton-date {
  height: 0.75rem;
  width: 8rem;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-author {
  height: 0.75rem;
  width: 9rem;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-content {
  height: 4rem;
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
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: transparent;
  border: none;
  border-radius: 0;
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
  gap: 0;
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
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .skeleton-timeline {
    width: 1rem;
  }

  .skeleton-line {
    bottom: -1.5rem;
  }

  .skeleton-dot {
    width: 0.375rem;
    height: 0.375rem;
  }

  .skeleton-date {
    width: 6rem;
    height: 0.625rem;
  }

  .skeleton-author {
    width: 7rem;
    height: 0.625rem;
  }
}
</style>
