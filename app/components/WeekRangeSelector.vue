<script setup lang="ts">
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isSameWeek,
} from "date-fns";

interface Props {
  /** Currently selected week start date */
  selectedWeekStart: Date;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:selectedWeekStart": [date: Date];
}>();

// Selector open/closed state
const isOpen = ref(false);

// Get the current week start (for comparison)
const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 });

/**
 * Generate available weeks:
 * - 2 past weeks
 * - Current week
 * - 3 upcoming weeks
 */
const availableWeeks = computed(() => {
  const weeks = [];

  // Start from 2 weeks ago
  let weekStart = subWeeks(currentWeekStart, 2);

  // Generate 6 weeks total (2 past + current + 3 future)
  for (let i = 0; i < 6; i++) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
    const isCurrent = isSameWeek(weekStart, currentWeekStart, {
      weekStartsOn: 0,
    });
    const isPast = weekStart < currentWeekStart && !isCurrent;
    const isSelected = isSameWeek(weekStart, props.selectedWeekStart, {
      weekStartsOn: 0,
    });

    weeks.push({
      start: new Date(weekStart),
      end: new Date(weekEnd),
      label: formatWeekRange(weekStart, weekEnd),
      isCurrent,
      isPast,
      isSelected,
    });

    weekStart = addWeeks(weekStart, 1);
  }

  return weeks;
});

/**
 * Format week range for display
 * e.g., "Nov 3 – 9" or "Oct 27 – Nov 2"
 */
const formatWeekRange = (start: Date, end: Date): string => {
  // Same month
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, "MMM d")} – ${format(end, "d")}`;
  }

  // Different months
  return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
};

/**
 * Get the label for the currently selected week
 */
const selectedWeekLabel = computed(() => {
  const weekEnd = endOfWeek(props.selectedWeekStart, { weekStartsOn: 0 });
  return formatWeekRange(props.selectedWeekStart, weekEnd);
});

/**
 * Check if the selected week is the current week
 */
const isCurrentWeekSelected = computed(() => {
  return isSameWeek(props.selectedWeekStart, currentWeekStart, {
    weekStartsOn: 0,
  });
});

/**
 * Toggle selector open/closed
 */
const toggleSelector = () => {
  isOpen.value = !isOpen.value;
};

/**
 * Select a week
 */
const selectWeek = (weekStart: Date) => {
  emit("update:selectedWeekStart", weekStart);
  isOpen.value = false;
};

/**
 * Close selector when clicking outside
 */
const selectorRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectorRef.value &&
      !selectorRef.value.contains(event.target as Node)
    ) {
      isOpen.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>

<template>
  <div ref="selectorRef" class="week-range-selector">
    <!-- Collapsed State: Selected Week Display -->
    <button
      class="selector-trigger"
      :class="{ 'is-current': isCurrentWeekSelected }"
      @click="toggleSelector"
      aria-label="Select week range"
    >
      <span class="week-range-text">{{ selectedWeekLabel }}</span>
      <Icon name="mdi:calendar-blank-outline" class="selector-icon" />
    </button>

    <!-- Expanded State: Week Options -->
    <Transition name="selector-dropdown">
      <div v-if="isOpen" class="selector-dropdown">
        <div
          v-for="(week, index) in availableWeeks"
          :key="week.start.toISOString()"
          class="week-option"
          :class="{
            'is-current': week.isCurrent,
            'is-past': week.isPast,
            'is-selected': week.isSelected,
          }"
          @click="selectWeek(week.start)"
        >
          <span class="week-range-text">{{ week.label }}</span>

          <!-- Show status label only once per section, on the right -->
          <span
            v-if="week.isPast && index === 0"
            class="week-status week-status--guide"
            >RECENT</span
          >
          <span
            v-else-if="week.isCurrent"
            class="week-status week-status--current"
            >CURRENT WEEK</span
          >
          <span
            v-else-if="!week.isPast && !week.isCurrent && index === 3"
            class="week-status week-status--guide"
            >UPCOMING</span
          >
        </div>

        <button class="close-selector-btn" @click="isOpen = false">
          CLOSE SELECTOR
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500&family=Work+Sans:wght@400;500;600&display=swap");

.week-range-selector {
  position: relative;
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
}

/* Collapsed State: Trigger Button */
.selector-trigger {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background: #f9f8f7;
  border: 1px solid #e8e6e3;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.selector-trigger:hover {
  background: #f5f4f2;
  border-color: #d9d7d3;
}

.selector-trigger.is-current {
  background: rgba(95, 125, 92, 0.08);
  border-color: rgba(95, 125, 92, 0.2);
}

.selector-trigger.is-current:hover {
  background: rgba(95, 125, 92, 0.12);
  border-color: rgba(95, 125, 92, 0.3);
}

.week-range-text {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #2d2a26;
  letter-spacing: 0.01em;
}

.selector-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #c0bdb8;
  flex-shrink: 0;
}

/* Expanded State: Dropdown */
.selector-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e8e6e3;
  border-radius: 0.75rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 0.5rem;
  z-index: 100;
  max-height: 28rem;
  overflow-y: auto;
}

/* Week Option */
.week-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.week-option:hover {
  background: #f9f8f7;
}

.week-option.is-current {
  background: rgba(95, 125, 92, 0.08);
}

.week-option.is-current:hover {
  background: rgba(95, 125, 92, 0.12);
}

.week-option.is-past {
  opacity: 0.35;
}

.week-option.is-past:hover {
  opacity: 0.5;
}

.week-option.is-selected {
  background: rgba(95, 125, 92, 0.12);
}

.week-status {
  font-family: "Work Sans", sans-serif;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  position: absolute;
  right: 1rem;
}

/* Guide labels (RECENT, UPCOMING) - subtle and de-emphasized */
.week-status--guide {
  color: #d1cec9;
  font-weight: 500;
}

/* Current week label - more prominent */
.week-status--current {
  color: #5f7d5c;
}

.week-option .week-range-text {
  font-size: 1rem;
  color: #2d2a26;
}

/* Close Button */
.close-selector-btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background: transparent;
  border: none;
  border-top: 1px solid #e8e6e3;
  font-family: "Work Sans", sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #999999;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-selector-btn:hover {
  color: #706c64;
}

/* Dropdown Transition */
.selector-dropdown-enter-active,
.selector-dropdown-leave-active {
  transition: all 0.2s ease;
}

.selector-dropdown-enter-from,
.selector-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
