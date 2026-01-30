<script setup lang="ts">
import type { CalendarFilters } from "~/types/calendarEvents";

/**
 * CalendarFocusPanel Component
 *
 * Provides filter controls for the Care Calendar to help users focus their attention
 * without cognitive overload. Includes member search and category visibility toggles.
 *
 * Features:
 * - Member search/filter
 * - Category visibility toggles
 * - Show completed reminders toggle
 * - Informational note about mental model separation
 * - Pastoral design language
 * - Collapsible panel (collapsed by default)
 */

interface Props {
  filters: CalendarFilters;
  loading?: boolean;
}

interface Emits {
  (e: "update:filters", filters: Partial<CalendarFilters>): void;
}

// Panel collapse state (collapsed by default)
const isCollapsed = ref(true);

// General search query state (for searching event titles/descriptions)
const generalSearchQuery = ref("");

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Get members for search
const { members, isLoading: membersLoading } = useMembers();

// Local search query state
const memberSearchQuery = ref("");
const isSearchOpen = ref(false);

// Filtered members based on search
const filteredMembers = computed(() => {
  if (!memberSearchQuery.value.trim()) {
    return members.value;
  }

  const query = memberSearchQuery.value.toLowerCase();
  return members.value.filter((member) => {
    const { fullName } = parseMemberName(member.name);
    return (
      fullName.toLowerCase().includes(query) ||
      member.name.toLowerCase().includes(query)
    );
  });
});

// Selected member name for display
const selectedMemberName = computed(() => {
  if (!props.filters.selectedMemberId) return null;
  const member = members.value.find(
    (m) => m.id === props.filters.selectedMemberId,
  );
  if (!member) return null;
  return parseMemberName(member.name).fullName;
});

// Category labels and their pastoral meanings
const categories = [
  {
    key: "community-gathering" as const,
    label: "Community Gatherings",
    icon: "mdi:calendar-heart",
    description: "Church events and shared moments",
  },
  {
    key: "member-milestone" as const,
    label: "Member Milestones",
    icon: "mdi:cake-variant",
    description: "Birthdays and anniversaries",
  },
  {
    key: "care-reminder" as const,
    label: "Care Reminders",
    icon: "mdi:bell",
    description: "Upcoming care intentions",
  },
];

// Toggle category visibility
const toggleCategory = (key: keyof CalendarFilters["visibleTypes"]) => {
  const newVisibleTypes = {
    ...props.filters.visibleTypes,
    [key]: !props.filters.visibleTypes[key],
  };
  emit("update:filters", { visibleTypes: newVisibleTypes });
};

// Toggle completed reminders
const toggleCompletedReminders = () => {
  emit("update:filters", {
    showCompletedReminders: !props.filters.showCompletedReminders,
  });
};

// Select a member filter
const selectMember = (memberId: string) => {
  emit("update:filters", { selectedMemberId: memberId });
  memberSearchQuery.value = "";
  isSearchOpen.value = false;
};

// Clear member filter
const clearMemberFilter = () => {
  emit("update:filters", { selectedMemberId: null });
  memberSearchQuery.value = "";
};

// Handle general search query changes
const handleSearchQuery = () => {
  emit("update:filters", { searchQuery: generalSearchQuery.value });
};

// Clear general search
const clearGeneralSearch = () => {
  generalSearchQuery.value = "";
  emit("update:filters", { searchQuery: "" });
};

// Toggle search dropdown
const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value) {
    nextTick(() => {
      const input = document.getElementById("member-search-input");
      input?.focus();
    });
  }
};

// Close search dropdown
const closeSearch = () => {
  isSearchOpen.value = false;
  memberSearchQuery.value = "";
};

// Handle click outside
const searchContainer = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (
    searchContainer.value &&
    !searchContainer.value.contains(event.target as Node)
  ) {
    closeSearch();
  }
};

// Load members and setup click handler when component mounts
onMounted(() => {
  // Load members
  const { startPolling } = useMembers();
  const cleanupPolling = startPolling();

  // Click outside handler
  document.addEventListener("click", handleClickOutside);

  // Cleanup both on unmount
  onUnmounted(() => {
    cleanupPolling();
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>

<template>
  <aside class="focus-panel" :class="{ 'is-collapsed': isCollapsed }">
    <div class="panel-header">
      <h2 class="panel-heading">Focus your attention</h2>
      <button
        @click="toggleCollapse"
        class="collapse-btn"
        :aria-label="isCollapsed ? 'Expand panel' : 'Collapse panel'"
        :aria-expanded="!isCollapsed"
      >
        <Icon
          :name="isCollapsed ? 'mdi:chevron-left' : 'mdi:chevron-right'"
          class="collapse-icon"
        />
      </button>
    </div>

    <div v-show="!isCollapsed" class="panel-content">
      <!-- General Search Section -->
      <section class="filter-section">
        <h3 class="section-label">Search Events</h3>

        <div class="search-input-container">
          <div class="search-field">
            <Icon name="mdi:magnify" class="search-field-icon" />
            <input
              v-model="generalSearchQuery"
              @input="handleSearchQuery"
              type="text"
              class="search-field-input"
              placeholder="Search by title or description..."
              autocomplete="off"
            />
            <button
              v-if="generalSearchQuery"
              @click="clearGeneralSearch"
              class="search-clear-btn"
              aria-label="Clear search"
            >
              <Icon name="mdi:close" class="clear-icon" />
            </button>
          </div>
        </div>

        <p class="filter-hint">Find events by their title or description</p>
      </section>

      <!-- Member Filter Section -->
      <section class="filter-section">
        <h3 class="section-label">Filter by Member</h3>

        <div class="member-filter" ref="searchContainer">
          <!-- Selected Member Display -->
          <div v-if="selectedMemberName" class="selected-member">
            <div class="selected-member-info">
              <Icon name="mdi:account" class="member-icon" />
              <span class="member-name">{{ selectedMemberName }}</span>
            </div>
            <button
              @click="clearMemberFilter"
              class="clear-btn"
              aria-label="Clear member filter"
            >
              <Icon name="mdi:close" class="clear-icon" />
            </button>
          </div>

          <!-- Search Input -->
          <div v-else class="search-wrapper">
            <button
              @click="toggleSearch"
              class="search-trigger"
              :aria-expanded="isSearchOpen"
              aria-label="Search for a member"
            >
              <Icon name="mdi:magnify" class="search-icon" />
              <span class="search-text">Search members...</span>
            </button>

            <!-- Search Dropdown -->
            <div v-if="isSearchOpen" class="search-dropdown">
              <div class="search-input-wrapper">
                <Icon name="mdi:magnify" class="input-icon" />
                <input
                  id="member-search-input"
                  v-model="memberSearchQuery"
                  type="text"
                  class="search-input"
                  placeholder="Type a name..."
                  autocomplete="off"
                />
              </div>

              <div class="search-results">
                <div v-if="membersLoading" class="search-state">
                  <p class="state-text">Loading members...</p>
                </div>

                <div
                  v-else-if="filteredMembers.length === 0"
                  class="search-state"
                >
                  <p class="state-text">No members found</p>
                </div>

                <div v-else class="member-list">
                  <button
                    v-for="member in filteredMembers.slice(0, 8)"
                    :key="member.id"
                    @click="selectMember(member.id!)"
                    class="member-item"
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

        <p class="filter-hint">View events related to a specific person</p>
      </section>

      <!-- Category Toggles Section -->
      <section class="filter-section">
        <h3 class="section-label">Visible Categories</h3>

        <div class="category-toggles">
          <label
            v-for="category in categories"
            :key="category.key"
            class="category-toggle"
          >
            <input
              type="checkbox"
              :checked="filters.visibleTypes[category.key]"
              @change="toggleCategory(category.key)"
              class="toggle-checkbox"
            />
            <div class="toggle-content">
              <div class="toggle-header">
                <Icon :name="category.icon" class="category-icon" />
                <span class="category-label">{{ category.label }}</span>
              </div>
              <p class="category-description">{{ category.description }}</p>
            </div>
            <div class="toggle-indicator" />
          </label>
        </div>
      </section>

      <!-- Completed Reminders Toggle -->
      <section class="filter-section">
        <label class="simple-toggle">
          <input
            type="checkbox"
            :checked="filters.showCompletedReminders"
            @change="toggleCompletedReminders"
            class="toggle-checkbox"
          />
          <div class="toggle-text">
            <span class="toggle-label">Show completed reminders</span>
            <p class="toggle-hint">Include past-due care reminders</p>
          </div>
          <div class="toggle-indicator" />
        </label>
      </section>

      <!-- Informational Note -->
      <aside class="panel-info">
        <Icon name="mdi:information-outline" class="info-icon" />
        <p class="info-text">
          Care notes and individual reminders are managed through Member Detail
          pages.
        </p>
      </aside>
    </div>
  </aside>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

.focus-panel {
  background: #fafaf8;
  border: 1px solid #e8e8e5;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 1rem;
  transition: all 0.3s ease;
  width: 280px;
}

.focus-panel.is-collapsed {
  width: 48px;
  padding: 1rem 0.75rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.focus-panel.is-collapsed .panel-header {
  margin-bottom: 0;
  flex-direction: column;
  align-items: center;
}

.panel-heading {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0;
  line-height: 1.3;
  transition: opacity 0.2s ease;
}

.focus-panel.is-collapsed .panel-heading {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.875rem;
  white-space: nowrap;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: #f7f6f4;
  border-color: #d9bc9b;
}

.collapse-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #706c64;
  transition: color 0.2s ease;
}

.collapse-btn:hover .collapse-icon {
  color: #2d2a26;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Filter Section */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  font-weight: 600;
  color: #706c64;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

/* Member Filter */
.member-filter {
  position: relative;
}

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

/* Search */
.search-wrapper {
  position: relative;
}

.search-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #9c8b7a;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.search-trigger:hover {
  border-color: #d9bc9b;
  color: #706c64;
}

.search-trigger:focus {
  outline: none;
  border-color: #7a9b76;
  box-shadow: 0 0 0 3px rgba(122, 155, 118, 0.1);
}

.search-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.search-text {
  flex: 1;
}

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

.search-input-wrapper {
  position: relative;
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0ed;
}

.input-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9c8b7a;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #2d2a26;
  background: #f7f6f4;
  border: 1px solid transparent;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  background: #ffffff;
  border-color: #7a9b76;
}

.search-input::placeholder {
  color: #9c8b7a;
}

.search-results {
  max-height: 240px;
  overflow-y: auto;
}

.search-state {
  padding: 2rem 1rem;
  text-align: center;
}

.state-text {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #9c8b7a;
  margin: 0;
}

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
}

.member-item:hover {
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

.filter-hint {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  color: #9c8b7a;
  margin: 0;
  line-height: 1.4;
}

/* General Search Input */
.search-input-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-field {
  position: relative;
  display: flex;
  align-items: center;
}

.search-field-icon {
  position: absolute;
  left: 0.875rem;
  width: 1.125rem;
  height: 1.125rem;
  color: #9c8b7a;
  pointer-events: none;
  z-index: 1;
}

.search-field-input {
  width: 100%;
  padding: 0.625rem 2.75rem 0.625rem 2.5rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #2d2a26;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.search-field-input:focus {
  outline: none;
  border-color: #7a9b76;
  box-shadow: 0 0 0 3px rgba(122, 155, 118, 0.1);
}

.search-field-input::placeholder {
  color: #9c8b7a;
}

.search-clear-btn {
  position: absolute;
  right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #706c64;
  transition: all 0.2s ease;
  z-index: 1;
}

.search-clear-btn:hover {
  background: rgba(112, 108, 100, 0.1);
  color: #2d2a26;
}

/* Category Toggles */
.category-toggles {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-toggle {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-toggle:hover {
  border-color: #d9bc9b;
  box-shadow: 0 1px 2px 0 rgba(44, 44, 42, 0.05);
}

.toggle-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.toggle-content {
  flex: 1;
  min-width: 0;
}

.toggle-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.category-icon {
  width: 1rem;
  height: 1rem;
  color: #9c8b7a;
  flex-shrink: 0;
}

.category-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d2a26;
  line-height: 1.3;
}

.category-description {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  color: #9c8b7a;
  margin: 0;
  line-height: 1.4;
}

.toggle-indicator {
  width: 1rem;
  height: 1rem;
  border: 2px solid #d9bc9b;
  border-radius: 4px;
  flex-shrink: 0;
  transition: all 0.2s ease;
  position: relative;
}

.toggle-checkbox:checked + .toggle-content ~ .toggle-indicator {
  background: #7a9b76;
  border-color: #7a9b76;
}

.toggle-checkbox:checked + .toggle-content ~ .toggle-indicator::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  background: #ffffff;
  border-radius: 2px;
}

/* Simple Toggle */
.simple-toggle {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.simple-toggle:hover {
  border-color: #d9bc9b;
  box-shadow: 0 1px 2px 0 rgba(44, 44, 42, 0.05);
}

.toggle-text {
  flex: 1;
  min-width: 0;
}

.toggle-label {
  display: block;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d2a26;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.toggle-hint {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  color: #9c8b7a;
  margin: 0;
  line-height: 1.4;
}

/* Info Note */
.panel-info {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(217, 188, 155, 0.08);
  border-left: 2px solid #d9bc9b;
  border-radius: 6px;
}

.info-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #d9bc9b;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-text {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #9c8b7a;
  margin: 0;
  line-height: 1.5;
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .focus-panel {
    position: static;
    width: 100%;
  }

  .focus-panel.is-collapsed {
    width: 100%;
    padding: 1rem;
  }

  .focus-panel.is-collapsed .panel-header {
    flex-direction: row;
  }

  .focus-panel.is-collapsed .panel-heading {
    writing-mode: horizontal-tb;
    text-orientation: initial;
    font-size: 1rem;
  }
}
</style>
