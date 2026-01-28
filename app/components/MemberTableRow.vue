<template>
  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
    <!-- Row Number -->
    <td
      class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap"
    >
      {{ rowNumber }}
    </td>

    <!-- Member Info -->
    <td class="px-6 py-4">
      <div class="flex items-center space-x-3">
        <MemberAvatar :name="parsedName.fullName" />
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ parsedName.fullName }}
          </span>
          <div
            class="flex items-center space-x-1 text-xs text-slate-400 dark:text-slate-500"
          >
            <AppIcon
              name="material-symbols:cake"
              :size="12"
              decorative
              class-name="text-slate-400"
            />
            <span>{{ formattedBirthday }}</span>
          </div>
        </div>
      </div>
    </td>

    <!-- Contact Info -->
    <td class="px-6 py-4">
      <div
        v-if="member.contact"
        class="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300"
      >
        <AppIcon
          name="material-symbols:call"
          :size="18"
          decorative
          class-name="text-slate-400"
        />
        <span>{{ formattedContact }}</span>
      </div>
      <span v-else class="text-sm italic text-slate-400">No contact info</span>
    </td>

    <!-- Location -->
    <td class="px-6 py-4">
      <div
        class="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300"
      >
        <AppIcon
          v-if="member.suburb"
          name="material-symbols:location-on"
          :size="18"
          decorative
          class-name="text-slate-400"
        />
        <span>{{ member.suburb || "No location" }}</span>
      </div>
    </td>

    <!-- Actions -->
    <td class="px-6 py-4">
      <div class="flex items-center space-x-2">
        <button
          class="p-2 text-slate-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          aria-label="View member details"
          @click="$emit('view')"
        >
          <AppIcon name="material-symbols:visibility" :size="20" decorative />
        </button>
        <button
          class="p-2 text-slate-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          aria-label="Edit member"
          @click="$emit('edit')"
        >
          <AppIcon name="material-symbols:edit" :size="20" decorative />
        </button>
        <button
          class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          aria-label="Delete member"
          @click="$emit('delete')"
        >
          <AppIcon name="material-symbols:delete" :size="20" decorative />
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Member } from "~/composables/useMembers";
import {
  parseMemberName,
  formatBirthday,
  formatContact,
} from "~/composables/useMembers";

/**
 * MemberTableRow - Individual table row for displaying member information
 *
 * Displays a single member's information in table format with avatar, name, birthday,
 * contact info, location, and action buttons.
 */

interface Props {
  /** Member data to display */
  member: Member;
  /** Row number for display */
  rowNumber: number;
}

defineEmits<{
  /** Emitted when view button is clicked */
  view: [];
  /** Emitted when edit button is clicked */
  edit: [];
  /** Emitted when delete button is clicked */
  delete: [];
}>();

const props = defineProps<Props>();

// Parse member name for display
const parsedName = computed(() => parseMemberName(props.member.name));

// Format birthday with age
const formattedBirthday = computed(() => formatBirthday(props.member.birthday));

// Format contact info with fallback
const formattedContact = computed(() => formatContact(props.member.contact));
</script>
