<script setup lang="ts">
/**
 * CalendarItemSheet Component
 *
 * A mobile-optimized bottom sheet for displaying calendar item details.
 * Triggered when users tap calendar items on mobile viewports (< 768px).
 *
 * Supports multiple item types:
 * - Community Gatherings: Events with title, date/time, description, and "Open full details" link
 * - Member Milestones: Birthdays and milestones with person's name, date, and "Go to person" link
 * - Care Reminders: Reminders with title, linked person, date, and "View in care space" link
 * - Liturgical Events: Church events with title, date/time, description, and "Open full details" link
 * - Care Updates: Updates with title, date/time, and description
 *
 * Features:
 * - Slide-up animation from bottom of screen
 * - Swipe-down gesture to dismiss
 * - Tap outside (backdrop) to dismiss
 * - Escape key to dismiss
 * - Accessible with ARIA labels and focus management
 * - Pastoral tone with calm, generous whitespace
 *
 * Mobile Interaction Pattern:
 * On mobile (< 768px): Calendar item tap → Opens this bottom sheet
 * On desktop (≥ 768px): Calendar item click → Direct navigation to detail page
 *
 * @see useCalendarItemSheet - State management composable
 * @see CareCalendar.vue - Parent component that handles viewport detection
 */
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
    month: "long",
    day: "numeric",
  });
};

// Format time for display
const formatTime = (timestamp: any) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Content Display Rules by Item Type
 *
 * Each calendar item type has specific display rules to maintain pastoral tone:
 *
 * Events (community-gathering, liturgical-event):
 * - Type Label: "Communal Rhythm" or "Liturgical Event"
 * - Primary Text: Event title
 * - Description: Optional event description in italic quote style
 * - Action: "Open full details" link
 *
 * Birthdays/Member Milestones:
 * - Type Label: "Birthday" or "Member Milestone"
 * - Primary Text: Person's name (e.g., "John Smith")
 * - Description: Optional gentle descriptor
 * - Action: "Go to person" link to member profile
 *
 * Care Reminders:
 * - Type Label: "Care Reminder"
 * - Primary Text: Reminder text
 * - Description: Not shown (reminders are brief)
 * - Action: "View in care space" link (if person linked)
 * - Note: No completion controls (not task-style)
 *
 * Care Updates:
 * - Type Label: "Care Update"
 * - Primary Text: Update title
 * - Description: Optional update description
 * - Action: None (updates are informational)
 */

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
  if (item.type === "member-milestone") {
    return item.memberName || "Unknown Person";
  }
  if (item.type === "care-reminder") {
    return item.title;
  }
  return item.title;
};

// Get description text
const getDescriptionText = (item: CalendarEvent) => {
  if (item.type === "member-milestone") {
    // For birthdays, show age if available, otherwise just the milestone
    if (item.milestoneType === "birthday") {
      // Note: Age calculation would need additional data, for now just show milestone
      return "";
    }
    return item.description || "";
  }
  if (item.type === "care-reminder") {
    return ""; // Reminders don't show description in sheet
  }
  return item.description || "";
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
            <!-- Type Label -->
            <span class="sheet-type-label">
              {{ getItemTypeLabel(currentItem) }}
            </span>

            <!-- Primary Text -->
            <h2
              :id="`sheet-title-${currentItem.id}`"
              class="sheet-primary-text"
            >
              {{ getPrimaryText(currentItem) }}
            </h2>

            <!-- Date and Time -->
            <p class="sheet-date">
              {{ formatDate(currentItem.date) }} at
              {{ formatTime(currentItem.date) }}
            </p>

            <!-- Description (for events and milestones) -->
            <p v-if="getDescriptionText(currentItem)" class="sheet-description">
              "{{ getDescriptionText(currentItem) }}"
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

            <!-- Close Button -->
            <div class="sheet-close-section">
              <button
                class="sheet-close-button"
                @click="closeSheet"
                aria-label="Close sheet"
              >
                <span class="close-text">CLOSE</span>
                <Icon name="mdi:calendar-blank-outline" class="close-icon" />
              </button>
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
  padding: 2rem 1.5rem;
  padding-top: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sheet-type-label {
  display: inline-block;
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #5f7d5c;
  background: rgba(122, 155, 118, 0.12);
  padding: 0.375rem 1rem;
  border-radius: 20px;
  margin-bottom: 1.25rem;
}

.sheet-primary-text {
  font-family: "Crimson Pro", serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  max-width: 90%;
}

.sheet-date {
  font-family: "Work Sans", sans-serif;
  font-size: 0.9375rem;
  color: #706c64;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
}

.sheet-description {
  font-family: "Crimson Pro", serif;
  font-size: 1rem;
  font-style: italic;
  color: #706c64;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  max-width: 85%;
}

.sheet-actions {
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.sheet-action-link {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #706c64;
  text-decoration: underline;
  text-decoration-color: rgba(112, 108, 100, 0.3);
  transition: all 0.2s ease;
}

.sheet-action-link:hover {
  color: #5f7d5c;
  text-decoration-color: #5f7d5c;
}

.sheet-close-section {
  width: 100%;
  padding-top: 1.5rem;
  border-top: 1px solid #f0ede8;
  display: flex;
  justify-content: center;
}

.sheet-close-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: opacity 0.2s ease;
  color: #9c8b7a;
}

.sheet-close-button:hover {
  opacity: 0.7;
}

.close-text {
  font-family: "Work Sans", sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
  opacity: 0.6;
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
    padding: 1.5rem 1.25rem;
  }

  .sheet-primary-text {
    font-size: 1.5rem;
    max-width: 95%;
  }

  .sheet-description {
    font-size: 0.9375rem;
    max-width: 90%;
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
