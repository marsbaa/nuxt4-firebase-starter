import type { CalendarEvent } from "~/types/calendarEvents";

/**
 * State management for the Calendar Item Bottom Sheet
 * Provides global state and methods for opening/closing the sheet
 */
export const useCalendarItemSheet = () => {
  // Sheet visibility state
  const isOpen = ref(false);

  // Current item data
  const currentItem = ref<CalendarEvent | null>(null);

  // Open the sheet with item data
  const openSheet = (item: CalendarEvent) => {
    currentItem.value = item;
    isOpen.value = true;
  };

  // Close the sheet
  const closeSheet = () => {
    isOpen.value = false;
    // Clear item data after animation completes
    setTimeout(() => {
      currentItem.value = null;
    }, 300); // Match transition duration
  };

  return {
    isOpen: readonly(isOpen),
    currentItem: readonly(currentItem),
    openSheet,
    closeSheet,
  };
};
