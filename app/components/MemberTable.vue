<template>
  <div class="md:bg-white">
    <!-- Desktop Card List View -->
    <div class="hidden md:block space-y-3">
      <MemberTableRow
        v-for="(member, index) in members"
        :key="member.id"
        :member="member"
        :row-number="startIndex + index + 1"
        @view="$emit('view', member)"
        @edit="$emit('edit', member)"
        @delete="$emit('delete', member)"
      />

      <!-- Empty state -->
      <div
        v-if="members.length === 0"
        class="flex flex-col items-center py-12 space-y-3"
      >
        <AppIcon
          name="material-symbols:group"
          :size="48"
          custom-class="text-slate-300"
          decorative
        />
        <div class="text-center">
          <p class="text-lg font-medium text-slate-600">
            {{ emptyMessage }}
          </p>
          <p class="text-sm text-slate-500 mt-1">
            {{ emptySubMessage }}
          </p>
        </div>
      </div>

      <!-- Footer slot for desktop -->
      <div v-if="$slots.footer" class="pt-6 pb-4">
        <slot name="footer" />
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <MemberTableRow
        v-for="(member, index) in members"
        :key="member.id"
        :member="member"
        :row-number="startIndex + index + 1"
        @view="$emit('view', member)"
        @edit="$emit('edit', member)"
        @delete="$emit('delete', member)"
      />

      <!-- Empty state -->
      <div
        v-if="members.length === 0"
        class="flex flex-col items-center py-12 space-y-3"
      >
        <AppIcon
          name="material-symbols:group"
          :size="48"
          custom-class="text-slate-300"
          decorative
        />
        <div class="text-center">
          <p class="text-lg font-medium text-slate-600">
            {{ emptyMessage }}
          </p>
          <p class="text-sm text-slate-500 mt-1">
            {{ emptySubMessage }}
          </p>
        </div>
      </div>

      <!-- Footer slot for mobile -->
      <div v-if="$slots.footer" class="pt-4 border-t border-slate-200">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Member } from "~/composables/useMembers";

/**
 * MemberTable - Displays members in a responsive layout
 *
 * Shows member information in a table layout on desktop and card layout on mobile.
 * Includes empty state handling and emits events for member actions.
 */

interface Props {
  /** Array of members to display */
  members: Member[];
  /** Starting index for row numbering (for pagination) */
  startIndex?: number;
  /** Message to show when table is empty */
  emptyMessage?: string;
  /** Sub-message for empty state */
  emptySubMessage?: string;
}

defineEmits<{
  /** Emitted when view button is clicked for a member */
  view: [member: Member];
  /** Emitted when edit button is clicked for a member */
  edit: [member: Member];
  /** Emitted when delete button is clicked for a member */
  delete: [member: Member];
}>();

withDefaults(defineProps<Props>(), {
  startIndex: 0,
  emptyMessage: "No members found",
  emptySubMessage: "Try adjusting your search or add a new member",
});
</script>
