<template>
  <div
    class="bg-white dark:bg-sidebar-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
  >
    <table class="w-full text-left border-collapse">
      <thead
        class="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider"
      >
        <tr>
          <th class="px-6 py-4">#</th>
          <th class="px-6 py-4">Member</th>
          <th class="px-6 py-4">Contact Info</th>
          <th class="px-6 py-4">Location</th>
          <th class="px-6 py-4">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
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
        <tr v-if="members.length === 0">
          <td colspan="5" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center space-y-3">
              <AppIcon
                name="material-symbols:group"
                :size="48"
                class-name="text-slate-300 dark:text-slate-600"
                decorative
              />
              <div>
                <p
                  class="text-lg font-medium text-slate-600 dark:text-slate-400"
                >
                  {{ emptyMessage }}
                </p>
                <p class="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  {{ emptySubMessage }}
                </p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Member } from "~/composables/useMembers";

/**
 * MemberTable - Displays members in a table layout
 *
 * Shows member information in a structured table with columns for member details,
 * contact info, location, and action buttons. Includes empty state handling.
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
