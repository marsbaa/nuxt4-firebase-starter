<template>
  <!-- Desktop Card Row -->
  <div
    class="hidden md:flex items-center gap-4 bg-[#faf9f7] rounded-2xl px-6 py-5 hover:bg-[#f5f3f0] transition-colors"
  >
    <!-- Avatar -->
    <MemberAvatar :name="parsedName.fullName" size="lg" />

    <!-- Member Info -->
    <div class="flex-1 min-w-0">
      <!-- Name -->
      <h3 class="text-[17px] font-medium text-[#2d2a26] mb-1">
        {{ parsedName.fullName }}
      </h3>

      <!-- Age and Location -->
      <div class="flex items-center gap-2 text-[15px] text-[#8b8680]">
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
    </div>

    <!-- Contact Info (right side) -->
    <div v-if="member.contact" class="text-[15px] text-[#8b8680]">
      {{ formattedContact }}
    </div>

    <!-- Open Care Button -->
    <button
      class="px-4 py-2 text-[15px] font-medium text-[#b8885f] hover:text-[#a07750] transition-colors"
      @click="$emit('view')"
    >
      Open care
    </button>

    <!-- Menu Button -->
    <div class="relative">
      <button
        class="p-2 text-[#8b8680] hover:text-[#2d2a26] transition-colors"
        aria-label="More options"
        @click.stop="toggleMenu"
      >
        <AppIcon name="material-symbols:more-vert" :size="24" decorative />
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showMenu"
        class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10"
        @click.stop
      >
        <button
          class="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          @click="
            $emit('edit');
            showMenu = false;
          "
        >
          <AppIcon name="material-symbols:edit" :size="18" decorative />
          Edit member
        </button>
        <button
          class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          @click="
            $emit('delete');
            showMenu = false;
          "
        >
          <AppIcon name="material-symbols:delete" :size="18" decorative />
          Delete member
        </button>
      </div>
    </div>
  </div>

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

// Calculate age directly from birthday for mobile view
const ageOnly = computed(() => calculateAge(props.member.birthday));

// Format contact info with fallback
const formattedContact = computed(() => formatContact(props.member.contact));

// Menu state
const showMenu = ref(false);

// Toggle menu dropdown
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// Close menu when clicking outside
onMounted(() => {
  const handleClickOutside = () => {
    if (showMenu.value) {
      showMenu.value = false;
    }
  };
  document.addEventListener("click", handleClickOutside);
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>
