<script setup lang="ts">
const props = defineProps<{
  memberId: string;
  memberName: string;
}>();

// Use the care notes composable
const { notes, loading, addNote, updateNote } = useCareNotes(props.memberId);

// Handle adding a new note
const handleNoteAdded = async (content: string) => {
  try {
    await addNote(content);
  } catch (error) {
    console.error("Error adding care note:", error);
  }
};

// Handle updating an existing note
const handleNoteUpdated = async (noteId: string, content: string) => {
  try {
    await updateNote(noteId, content);
  } catch (error) {
    console.error("Error updating care note:", error);
  }
};
</script>

<template>
  <div class="care-space">
    <!-- Header -->
    <div class="care-space-header">
      <h2 class="care-space-title">Care Space</h2>
      <p class="care-space-subtitle">
        A shared space for {{ memberName }}'s care journey
      </p>
    </div>

    <!-- Care Note Input -->
    <div class="care-space-input">
      <CareNoteInput :loading="loading" @note-added="handleNoteAdded" />
    </div>

    <!-- Care Notes Timeline -->
    <div class="care-space-timeline">
      <CareNoteList
        :notes="notes"
        :loading="loading"
        @note-updated="handleNoteUpdated"
      />
    </div>
  </div>
</template>

<style scoped>
/* Container */
.care-space {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.care-space-header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.care-space-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #292524;
  margin: 0;
  letter-spacing: -0.025em;
}

.care-space-subtitle {
  font-size: 0.9375rem;
  color: #78716c;
  margin: 0;
  line-height: 1.5;
}

/* Input Section */
.care-space-input {
  /* Input component has its own styling */
}

/* Timeline Section */
.care-space-timeline {
  /* Timeline component has its own styling */
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .care-space {
    gap: 1.25rem;
  }

  .care-space-title {
    font-size: 1.375rem;
  }

  .care-space-subtitle {
    font-size: 0.875rem;
  }
}

/* Smooth transitions for all elements */
.care-space * {
  transition: all 0.15s ease;
}
</style>
