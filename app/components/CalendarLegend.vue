<script setup lang="ts">
import type { CalendarEventType } from "~/types/calendarEvents";

// Legend items configuration
interface LegendItem {
  type: CalendarEventType;
  label: string;
  dotClass: string;
}

const legendItems: LegendItem[] = [
  {
    type: "member-milestone",
    label: "Member Milestones",
    dotClass: "legend-dot--member-milestone",
  },
  {
    type: "community-gathering",
    label: "Community Gatherings",
    dotClass: "legend-dot--community-gathering",
  },
  {
    type: "liturgical-event",
    label: "Liturgical Events",
    dotClass: "legend-dot--liturgical-event",
  },
  {
    type: "care-reminder",
    label: "Care Reminders",
    dotClass: "legend-dot--care-reminder",
  },
  {
    type: "care-update",
    label: "Care Updates",
    dotClass: "legend-dot--care-update",
  },
];

// Props for filtering which items to show
interface Props {
  /** Optionally show only specific event types */
  showTypes?: CalendarEventType[];
}

const props = withDefaults(defineProps<Props>(), {
  showTypes: () => [
    "member-milestone",
    "community-gathering",
    "liturgical-event",
    "care-reminder",
    "care-update",
  ],
});

// Computed filtered legend items
const visibleLegendItems = computed(() => {
  if (!props.showTypes || props.showTypes.length === 0) {
    return legendItems;
  }
  return legendItems.filter((item) => props.showTypes.includes(item.type));
});
</script>

<template>
  <div class="calendar-legend">
    <div
      v-for="item in visibleLegendItems"
      :key="item.type"
      class="legend-item"
    >
      <span class="legend-dot" :class="item.dotClass" aria-hidden="true"></span>
      <span class="legend-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap");

.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  padding: 1.5rem 1rem;
  border-top: 1px solid #e8e8e5;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Member Milestones (purple/mauve) */
.legend-dot--member-milestone {
  background: rgba(207, 184, 203, 0.6);
  border: 1px solid rgba(207, 184, 203, 0.8);
}

/* Community Gatherings (blue-grey) */
.legend-dot--community-gathering {
  background: rgba(169, 193, 205, 0.6);
  border: 1px solid rgba(169, 193, 205, 0.8);
}

/* Liturgical Events (warm tan) */
.legend-dot--liturgical-event {
  background: rgba(217, 188, 155, 0.6);
  border: 1px solid rgba(217, 188, 155, 0.8);
}

/* Care Reminders (green) */
.legend-dot--care-reminder {
  background: rgba(122, 155, 118, 0.6);
  border: 1px solid rgba(122, 155, 118, 0.8);
}

/* Care Updates (soft brown) */
.legend-dot--care-update {
  background: rgba(191, 174, 157, 0.6);
  border: 1px solid rgba(191, 174, 157, 0.8);
}

.legend-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #706c64;
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .calendar-legend {
    gap: 1rem;
    padding: 1rem 0.5rem;
  }

  .legend-item {
    font-size: 0.75rem;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .calendar-legend {
    gap: 0.75rem;
  }

  .legend-item {
    gap: 0.375rem;
  }

  .legend-dot {
    width: 0.625rem;
    height: 0.625rem;
  }

  .legend-label {
    font-size: 0.75rem;
  }
}
</style>
