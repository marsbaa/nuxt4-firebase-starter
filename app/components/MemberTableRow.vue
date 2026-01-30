<template>
  <!-- Desktop Table Row -->
  <tr
    class="hidden md:table-row border-b border-slate-200 hover:bg-slate-50/50 transition-colors"
  >
    <!-- Row Number -->
    <td
      class="px-6 py-5 text-sm text-slate-400 dark:text-slate-500 whitespace-nowrap"
    >
      {{ rowNumber }}
    </td>

    <!-- Member Info -->
    <td class="px-6 py-5">
      <div class="flex items-center space-x-3">
        <MemberAvatar :name="parsedName.fullName" />
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-slate-900">
            {{ parsedName.fullName }}
          </span>
          <div
            class="flex items-center space-x-1 text-xs text-slate-400 dark:text-slate-500"
          >
            <AppIcon
              name="material-symbols:cake"
              :size="12"
              decorative
              custom-class="text-slate-400"
            />
            <span>{{ formattedBirthday }}</span>
          </div>
        </div>
      </div>
    </td>

    <!-- Contact Info -->
    <td class="px-6 py-5">
      <div
        v-if="member.contact"
        class="flex items-center space-x-2 text-sm text-slate-700"
      >
        <AppIcon
          name="material-symbols:call"
          :size="16"
          decorative
          custom-class="text-amber-700"
        />
        <span>{{ formattedContact }}</span>
      </div>
      <span v-else class="text-sm italic text-slate-400">No contact info</span>
    </td>

    <!-- Location -->
    <td class="px-6 py-5">
      <div
        v-if="member.suburb"
        class="flex items-center space-x-2 text-sm text-slate-900"
      >
        <AppIcon
          name="material-symbols:location-on"
          :size="16"
          decorative
          custom-class="text-amber-700"
        />
        <span>{{ member.suburb }}</span>
      </div>
    </td>

    <!-- Actions -->
    <td class="px-6 py-5 text-right">
      <div class="flex items-center justify-end space-x-1">
        <button
          class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="View member details"
          @click="$emit('view')"
        >
          <AppIcon name="material-symbols:visibility" :size="20" decorative />
        </button>
        <button
          class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Edit member"
          @click="$emit('edit')"
        >
          <AppIcon name="material-symbols:edit" :size="20" decorative />
        </button>
        <button
          class="p-2 text-slate-400 hover:text-red-500 transition-colors"
          aria-label="Delete member"
          @click="$emit('delete')"
        >
          <AppIcon name="material-symbols:delete" :size="20" decorative />
        </button>
      </div>
    </td>
  </tr>

  <!-- Mobile Card View -->
  <button
    class="md:hidden w-full bg-white rounded-xl px-4 py-4 flex items-center gap-3 text-left hover:bg-[#faf9f7] active:bg-[#f5f3f0] transition-colors border border-transparent"
    @click="$emit('view')"
  >
    <!-- Avatar -->
    <MemberAvatar :name="parsedName.fullName" size="lg" />

    <!-- Member Info -->
    <div class="flex-1 min-w-0">
      <!-- Name -->
      <h3
        class="text-[17px] font-medium text-[#2d2a26] mb-1 truncate leading-snug"
      >
        {{ parsedName.fullName }}
      </h3>

      <!-- Age and Location -->
      <div class="flex items-center gap-2 text-[15px] text-[#8b8680] mb-0.5">
        <span>{{ ageOnly }} years</span>
        <div v-if="member.suburb" class="flex items-center gap-1">
          <AppIcon
            name="material-symbols:location-on"
            :size="16"
            decorative
            custom-class="text-[#8b8680]"
          />
          <span>{{ member.suburb }}</span>
        </div>
      </div>

      <!-- Contact (if available) -->
      <div v-if="member.contact" class="text-[15px] text-[#8b8680]">
        {{ formattedContact }}
      </div>
    </div>

    <!-- Chevron -->
    <AppIcon
      name="material-symbols:chevron-right"
      :size="24"
      decorative
      custom-class="text-[#d4cec6] flex-shrink-0"
    />
  </button>
</template>

<script setup lang="ts">
import type { Member } from "~/composables/useMembers";
import {
  parseMemberName,
  formatBirthday,
  formatContact,
  calculateAge,
} from "~/composables/useMembers";

/**
 * MemberTableRow - Responsive member row/card component
 *
 * Displays a member as a table row on desktop and as a card on mobile.
 * Shows avatar, name, age, location, contact info, and provides navigation.
 */

interface Props {
  /** Member data to display */
  member: Member;
  /** Row number for display (desktop only) */
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

// Calculate age directly from birthday for mobile view
const ageOnly = computed(() => calculateAge(props.member.birthday));

// Format contact info with fallback
const formattedContact = computed(() => formatContact(props.member.contact));
</script>
