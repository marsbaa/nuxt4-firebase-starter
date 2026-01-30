<script setup lang="ts">
import type { Member } from "~/composables/useMembers";

/**
 * MemberSearchInput Component
 *
 * A reusable search input component for finding and selecting members.
 * Features:
 * - Real-time search filtering
 * - Dropdown results display
 * - Selected member display with clear option
 * - Click-outside handling
 * - Keyboard navigation support
 * - Pastoral design language
 */

interface Props {
  /** Currently selected member ID */
  selectedMemberId?: string | null;
  /** Placeholder text for search input */
  placeholder?: string;
  /** Maximum number of results to show */
  maxResults?: number;
  /** Whether the component is in a loading state */
  loading?: boolean;
  /** Members list to search from */
  members?: readonly Member[];
  /** Whether members are being loaded */
  membersLoading?: boolean;
}

interface Emits {
  /** Emitted when a member is selected */
  (e: "select", memberId: string): void;
  /** Emitted when the selection is cleared */
  (e: "clear"): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedMemberId: null,
  placeholder: "Search members...",
  maxResults: 8,
  loading: false,
  members: () => [],
  membersLoading: false,
});

const emit = defineEmits<Emits>();

// Local state
const searchQuery = ref("");
const isDropdownOpen = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

// Filtered members based on search query
const filteredMembers = computed(() => {
  // If no search query, return all members
  if (!searchQuery.value.trim()) {
    return props.members;
  }

  // Filter members based on search query
  const query = searchQuery.value.toLowerCase();
  return props.members.filter((member) => {
    const { fullName } = parseMemberName(member.name);
    return (
      fullName.toLowerCase().includes(query) ||
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  });
});

// Selected member details
const selectedMember = computed(() => {
  if (!props.selectedMemberId) return null;
  return props.members.find((m) => m.id === props.selectedMemberId);
});

const selectedMemberName = computed(() => {
  if (!selectedMember.value) return null;
  return parseMemberName(selectedMember.value.name).fullName;
});

// Open dropdown and focus input
const openDropdown = () => {
  isDropdownOpen.value = true;
  nextTick(() => {
    searchInputRef.value?.focus();
  });
};

// Close dropdown and clear search
const closeDropdown = () => {
  isDropdownOpen.value = false;
  searchQuery.value = "";
};

// Select a member
const selectMember = (memberId: string) => {
  emit("select", memberId);
  closeDropdown();
};

// Clear selection
const clearSelection = () => {
  emit("clear");
  searchQuery.value = "";
};

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    closeDropdown();
  }
};

// Setup and cleanup
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="containerRef" class="member-search-input">
    <!-- Selected Member Display -->
    <div v-if="selectedMember" class="selected-member">
      <div class="selected-member-info">
        <Icon name="mdi:account" class="member-icon" />
        <span class="member-name">{{ selectedMemberName }}</span>
      </div>
      <button
        @click="clearSelection"
        class="clear-btn"
        aria-label="Clear member selection"
        type="button"
      >
        <Icon name="mdi:close" class="clear-icon" />
      </button>
    </div>

    <!-- Search Input -->
    <div v-else class="search-container">
      <div class="search-input-wrapper">
        <Icon name="mdi:magnify" class="search-icon" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="placeholder"
          :disabled="loading"
          autocomplete="off"
          @focus="openDropdown"
        />
      </div>

      <!-- Dropdown Results -->
      <div v-if="isDropdownOpen" class="search-dropdown">
        <div class="search-results">
          <!-- Loading State -->
          <div v-if="membersLoading || loading" class="search-state">
            <p class="state-text">Loading members...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="filteredMembers.length === 0" class="search-state">
            <p class="state-text">No members found</p>
            <p class="state-hint">Try a different search term</p>
          </div>

          <!-- Member List -->
          <div v-else class="member-list">
            <button
              v-for="member in filteredMembers.slice(0, maxResults)"
              :key="member.id"
              @click="selectMember(member.id!)"
              class="member-item"
              type="button"
            >
              <Icon name="mdi:account-circle" class="member-avatar" />
              <span class="member-item-name">
                {{ parseMemberName(member.name).fullName }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

.member-search-input {
  position: relative;
  width: 100%;
}

/* Selected Member Display */
.selected-member {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.875rem;
  background: #ffffff;
  border: 1px solid #d9bc9b;
  border-radius: 8px;
  gap: 0.5rem;
}

.selected-member-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.member-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #9c8b7a;
  flex-shrink: 0;
}

.member-name {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d2a26;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clear-btn {
  padding: 0.25rem;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #706c64;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.clear-btn:hover {
  background: rgba(112, 108, 100, 0.1);
  color: #2d2a26;
}

.clear-icon {
  width: 1rem;
  height: 1rem;
  display: block;
}

/* Search Container */
.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  width: 1.125rem;
  height: 1.125rem;
  color: #9c8b7a;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.5rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #2d2a26;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.search-input:hover {
  border-color: #d9bc9b;
}

.search-input:focus {
  outline: none;
  border-color: #7a9b76;
  box-shadow: 0 0 0 3px rgba(122, 155, 118, 0.1);
}

.search-input::placeholder {
  color: #9c8b7a;
}

.search-input:disabled {
  background: #f7f6f4;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(44, 44, 42, 0.1),
    0 2px 4px -1px rgba(44, 44, 42, 0.06);
  z-index: 10;
  overflow: hidden;
}

.search-results {
  max-height: 280px;
  overflow-y: auto;
}

/* Search States */
.search-state {
  padding: 2rem 1rem;
  text-align: center;
}

.state-text {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #706c64;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.state-hint {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  color: #9c8b7a;
  margin: 0;
}

/* Member List */
.member-list {
  display: flex;
  flex-direction: column;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #2d2a26;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
  width: 100%;
}

.member-item:hover {
  background: #f7f6f4;
}

.member-item:focus {
  outline: none;
  background: #f7f6f4;
}

.member-avatar {
  width: 1.5rem;
  height: 1.5rem;
  color: #9c8b7a;
  flex-shrink: 0;
}

.member-item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
