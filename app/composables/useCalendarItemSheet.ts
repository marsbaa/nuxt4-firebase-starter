import type { CalendarEvent } from "~/types/calendarEvents";

// Global state for the sheet (singleton)
const sheetState = reactive({
  isOpen: false,
  currentItem: null as CalendarEvent | null,
});

/**
 * State management for the Calendar Item Bottom Sheet
 * Provides global state and methods for opening/closing the sheet
 */
export const useCalendarItemSheet = () => {
  // Open the sheet with item data
  const openSheet = (item: CalendarEvent) => {
    sheetState.currentItem = item;
    sheetState.isOpen = true;
  };

  // Close the sheet
  const closeSheet = () => {
    sheetState.isOpen = false;
    // Clear item data after animation completes
    setTimeout(() => {
      sheetState.currentItem = null;
    }, 300); // Match transition duration
  };

  return {
    isOpen: readonly(computed(() => sheetState.isOpen)),
    currentItem: readonly(computed(() => sheetState.currentItem)),
    openSheet,
    closeSheet,
  };
};
