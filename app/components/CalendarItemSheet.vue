<script setup lang="ts">
import type { CalendarEvent } from "~/types/calendarEvents";

// Use the sheet composable
const { isOpen, currentItem, closeSheet } = useCalendarItemSheet();

// Touch handling for swipe-to-dismiss
let startY = 0;
let currentY = 0;
let isDragging = false;

// Handle touch start
const handleTouchStart = (event: TouchEvent) => {
  if (event.touches[0]) {
    startY = event.touches[0].clientY;
    isDragging = true;
  }
};

// Handle touch move
const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging || !event.touches[0]) return;

  currentY = event.touches[0].clientY;
  const deltaY = currentY - startY;

  // Only allow downward swipe
  if (deltaY > 0) {
    event.preventDefault();
    // Apply transform to sheet
    const sheet = event.currentTarget as HTMLElement;
    sheet.style.transform = `translateY(${deltaY}px)`;
  }
};

// Handle touch end
const handleTouchEnd = () => {
  if (!isDragging) return;

  const deltaY = currentY - startY;

  // Reset transform
  const sheet = document.querySelector(".calendar-item-sheet") as HTMLElement;
  if (sheet) {
    sheet.style.transform = "";
  }

  // If swiped down more than 100px, close sheet
  if (deltaY > 100) {
    closeSheet();
  }

  isDragging = false;
};

// Handle backdrop click
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeSheet();
  }
};

// Handle escape key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeSheet();
  }
};

// Format date for display
const formatDate = (timestamp: any) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get item type label
const getItemTypeLabel = (item: CalendarEvent) => {
  switch (item.type) {
    case "community-gathering":
      return "Communal Rhythm";
    case "liturgical-event":
      return "Liturgical Event";
    case "member-milestone":
      return item.milestoneType === "birthday"
        ? "Birthday"
        : "Member Milestone";
    case "care-reminder":
      return "Care Reminder";
    case "care-update":
      return "Care Update";
    default:
      return "";
  }
};

// Get primary display text
const getPrimaryText = (item: CalendarEvent) => {
  if (item.type === "member-milestone" || item.type === "care-reminder") {
    return item.memberName || "Unknown Person";
  }
  return item.title;
};

// Get secondary display text
const getSecondaryText = (item: CalendarEvent) => {
  if (item.type === "member-milestone") {
    return item.milestoneType === "birthday" ? "Birthday" : "Member Milestone";
  }
  if (item.type === "care-reminder") {
    return item.title;
  }
  return item.title;
};

// Get action links
const getActionLinks = (item: CalendarEvent) => {
  const links = [];

  if (item.type === "community-gathering" || item.type === "liturgical-event") {
    links.push({
      text: "Open full details",
      action: () => {
        // Navigate to event detail page
        closeSheet();
        // TODO: Implement navigation
      },
    });
  }

  if (
    (item.type === "member-milestone" || item.type === "care-reminder") &&
    item.memberId
  ) {
    links.push({
      text:
        item.type === "care-reminder" ? "View in care space" : "Go to person",
      action: () => {
        closeSheet();
        navigateTo(`/members/view/${item.memberId}`);
      },
    });
  }

  return links;
};

// Listen for escape key when sheet is open
onMounted(() => {
  if (process.client) {
    document.addEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("keydown", handleKeydown);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="isOpen && currentItem"
        class="sheet-backdrop"
        @click="handleBackdropClick"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`sheet-title-${currentItem.id}`"
      >
        <div
          class="calendar-item-sheet"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Handle for visual swipe indicator -->
          <div class="sheet-handle" aria-hidden="true"></div>

          <!-- Content -->
          <div class="sheet-content">
            <!-- Primary Text -->
            <h2
              :id="`sheet-title-${currentItem.id}`"
              class="sheet-primary-text"
            >
              {{ getPrimaryText(currentItem) }}
            </h2>

            <!-- Secondary Text -->
            <p class="sheet-secondary-text">
              {{ getSecondaryText(currentItem) }}
            </p>

            <!-- Type Label -->
            <span class="sheet-type-label">
              {{ getItemTypeLabel(currentItem) }}
            </span>

            <!-- Date -->
            <p class="sheet-date">
              {{ formatDate(currentItem.date) }}
            </p>

            <!-- Description (if available) -->
            <p v-if="currentItem.description" class="sheet-description">
              {{ currentItem.description }}
            </p>

            <!-- Action Links -->
            <div
              v-if="getActionLinks(currentItem).length"
              class="sheet-actions"
            >
              <a
                v-for="link in getActionLinks(currentItem)"
                :key="link.text"
                href="#"
                class="sheet-action-link"
                @click.prevent="link.action"
              >
                {{ link.text }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 44, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.calendar-item-sheet {
  width: 100%;
  max-width: 100%;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(44, 44, 42, 0.15);
  transform: translateY(0);
  transition: transform 0.3s ease-out;
  max-height: 80vh;
  overflow-y: auto;
}

.sheet-handle {
  width: 40px;
  height: 4px;
  background: #e8e8e5;
  border-radius: 2px;
  margin: 12px auto 0;
}

.sheet-content {
  padding: 1.5rem;
  padding-top: 1rem;
}

.sheet-primary-text {
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.sheet-secondary-text {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #706c64;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.sheet-type-label {
  display: inline-block;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #5f7d5c;
  background: rgba(122, 155, 118, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  margin-bottom: 1rem;
}

.sheet-date {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #9c8b7a;
  margin: 0 0 1rem 0;
}

.sheet-description {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #2d2a26;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
}

.sheet-actions {
  border-top: 1px solid #f7f6f4;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sheet-action-link {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #5f7d5c;
  text-decoration: underline;
  text-decoration-color: rgba(122, 155, 118, 0.3);
  transition: all 0.2s ease;
}

.sheet-action-link:hover {
  text-decoration-color: #5f7d5c;
}

/* Transitions */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .calendar-item-sheet,
.sheet-leave-to .calendar-item-sheet {
  transform: translateY(100%);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .sheet-content {
    padding: 1.25rem;
  }

  .sheet-primary-text {
    font-size: 1.375rem;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .calendar-item-sheet {
    transition: none;
  }

  .sheet-enter-active,
  .sheet-leave-active {
    transition: none;
  }
}
</style>
