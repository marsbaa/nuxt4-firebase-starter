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

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Get members for search
const membersStore = useMembersStore();

// Fetch members on mount if not loaded
onMounted(async () => {
  if (membersStore.members.length === 0) {
    await membersStore.fetchMembers();
  }
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

// Handle member selection
const handleMemberSelect = (memberId: string) => {
  emit("update:filters", { selectedMemberId: memberId });
};

// Handle member clear
const handleMemberClear = () => {
  emit("update:filters", { selectedMemberId: null });
};
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
      <!-- Member Filter Section -->
      <section class="filter-section">
        <h3 class="section-label">Filter by Member</h3>

        <MemberSearchInput
          :selected-member-id="filters.selectedMemberId"
          :loading="loading"
          :members="membersStore.members"
          :members-loading="membersStore.isLoading"
          placeholder="Search members..."
          @select="handleMemberSelect"
          @clear="handleMemberClear"
        />

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

.filter-hint {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  color: #9c8b7a;
  margin: 0;
  line-height: 1.4;
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
