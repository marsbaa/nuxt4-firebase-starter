import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import type {
  CareReminder,
  CreateCareReminderInput,
} from "~/types/careReminders";

/**
 * Composable for managing Care Reminders with Firestore
 *
 * Provides real-time synchronization of care reminders for a specific member.
 * Uses Firestore snapshot listeners for live updates across all connected clients.
 *
 * **Purpose:**
 * Care Reminders are gentle follow-up intentions held in mind for a specific member.
 * They are NOT tasks, obligations, or deadlines—they exist to support memory and pastoral presence.
 *
 * **Features:**
 * - Real-time synchronization via onSnapshot()
 * - Automatic filtering of expired reminders
 * - Display ordering: soonest due date first, undated last
 * - Maximum 3 reminders displayed
 * - Automatic cleanup on component unmount
 * - Reactive memberId support (re-subscribes on change)
 *
 * **Security Model:**
 * - All authenticated users can read all care reminders (pastoral team-only)
 * - All authenticated users can create care reminders
 * - Visibility mirrors the current Care Notes approach (v1 simplification)
 *
 * **Data Flow:**
 * 1. Component mounts → subscribe() called → onSnapshot() listener established
 * 2. Firestore changes → callback triggered → reminders.value updated → Vue reactivity
 * 3. Component unmounts → cleanup() called → listener unsubscribed
 *
 * **Expiry Logic:**
 * - A reminder is considered expired once its dueDate has passed
 * - Only active (non-expired) reminders are displayed
 * - Reminders with null dueDate never expire
 * - Future Calendar feature will surface all reminders for review
 *
 * @param memberId - The ID of the member whose care reminders to manage (can be reactive)
 * @returns Object containing:
 *   - reminders: Readonly ref of care reminders array (max 3, soonest first)
 *   - loading: Readonly ref indicating loading state
 *   - error: Readonly ref containing any error that occurred
 *   - addReminder: Function to create a new care reminder
 *
 * @example
 * ```vue
 * <script setup>
 * const memberId = ref('member-123');
 * const { reminders, loading, error, addReminder } = useCareReminders(memberId);
 *
 * const handleAddReminder = async (text, dueDate) => {
 *   await addReminder(text, dueDate);
 * };
 * </script>
 * ```
 */
export function useCareReminders(memberId: Ref<string> | string) {
  const { db, user } = useFirebase();
  const toast = useToast();

  // Reactive state
  const reminders = ref<CareReminder[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  // Unsubscribe function for cleanup
  let unsubscribe: Unsubscribe | null = null;

  // Convert memberId to ref if it's a string
  const memberIdRef = isRef(memberId) ? memberId : ref(memberId);

  /**
   * Check if a reminder is expired based on its due date
   * @param dueDate - The due date to check (Timestamp or null)
   * @returns true if the reminder is expired, false otherwise
   */
  const isReminderExpired = (dueDate: Timestamp | null): boolean => {
    if (!dueDate) return false; // Reminders with no due date never expire

    const due = dueDate.toDate();

    // Get start of today in local timezone
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get start of due date in local timezone
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

    // Consider expired only if due date is before today
    return dueDay < today;
  };

  /**
   * Subscribe to real-time care reminders updates
   * Sets up Firestore snapshot listener for the specified member
   *
   * Query logic:
   * - Filters by memberId only in Firestore
   * - All sorting and limiting done client-side for better control
   * - Filters out expired reminders
   * - Sorts dated reminders by soonest first
   * - Places undated reminders last
   * - Limits final result to 3 reminders
   */
  const subscribe = () => {
    if (!db) {
      error.value = new Error("Firestore is not initialized");
      loading.value = false;
      return;
    }

    if (!memberIdRef.value) {
      error.value = new Error("Member ID is required");
      loading.value = false;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      // Query all care reminders for the member (without orderBy)
      // We'll filter and sort client-side to properly handle null dates and expiry
      const careRemindersQuery = query(
        collection(db, "careReminders"),
        where("memberId", "==", memberIdRef.value),
      );

      // Set up real-time listener
      unsubscribe = onSnapshot(
        careRemindersQuery,
        (snapshot) => {
          // Map Firestore documents to CareReminder objects
          const allReminders = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              memberId: data.memberId,
              text: data.text,
              dueDate: data.dueDate,
              authorId: data.authorId,
              authorName: data.authorName,
              createdAt: data.createdAt,
              isExpired: isReminderExpired(data.dueDate),
            } as CareReminder;
          });

          // Filter out expired reminders
          const activeReminders = allReminders.filter((r) => !r.isExpired);

          // Separate reminders with dates and without dates
          const withDates = activeReminders.filter((r) => r.dueDate !== null);
          const withoutDates = activeReminders.filter(
            (r) => r.dueDate === null,
          );

          // Sort dated reminders by due date (soonest first)
          withDates.sort((a, b) => {
            if (!a.dueDate || !b.dueDate) return 0;
            return a.dueDate.toMillis() - b.dueDate.toMillis();
          });

          // Combine: dated first (sorted by soonest), undated last, limit to 3
          reminders.value = [...withDates, ...withoutDates].slice(0, 3);

          loading.value = false;
          error.value = null;
        },
        (err) => {
          console.error("Error loading care reminders:", err);
          error.value = err as Error;
          loading.value = false;
          toast.error("Unable to load care reminders. Please try again.");
        },
      );
    } catch (err) {
      console.error("Error setting up care reminders listener:", err);
      error.value = err as Error;
      loading.value = false;
      toast.error("Unable to load care reminders. Please try again.");
    }
  };

  /**
   * Add a new care reminder
   * Creates a new care reminder document in Firestore
   *
   * @param text - The reminder text describing what to hold in mind
   * @param dueDate - Optional due date when to remember this (Date or null)
   * @returns Promise that resolves when the reminder is created
   */
  const addReminder = async (
    text: string,
    dueDate: Date | null = null,
  ): Promise<void> => {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    if (!user.value) {
      throw new Error("User must be authenticated to add care reminders");
    }

    if (!text.trim()) {
      toast.error("Please share what you'd like to hold in mind");
      throw new Error("Text cannot be empty");
    }

    try {
      const reminderData = {
        memberId: memberIdRef.value,
        text: text.trim(),
        dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
        authorId: user.value.uid,
        authorName: user.value.displayName || user.value.email || "Unknown",
        createdAt: serverTimestamp(),
        isExpired: false,
      };

      await addDoc(collection(db, "careReminders"), reminderData);

      toast.success("Care reminder added");
    } catch (err) {
      console.error("Error adding care reminder:", err);
      toast.error("Unable to add care reminder. Please try again.");
      throw err;
    }
  };

  /**
   * Update an existing care reminder
   * Updates a care reminder document in Firestore
   *
   * @param reminderId - The ID of the reminder to update
   * @param text - The updated reminder text
   * @param dueDate - Optional updated due date (Date or null)
   * @returns Promise that resolves when the reminder is updated
   */
  const updateReminder = async (
    reminderId: string,
    text: string,
    dueDate: Date | null = null,
  ): Promise<void> => {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    if (!user.value) {
      throw new Error("User must be authenticated to update care reminders");
    }

    if (!text.trim()) {
      toast.error("Please share what you'd like to hold in mind");
      throw new Error("Text cannot be empty");
    }

    try {
      const reminderRef = doc(db, "careReminders", reminderId);

      await updateDoc(reminderRef, {
        text: text.trim(),
        dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
      });

      toast.success("Care reminder updated");
    } catch (err) {
      console.error("Error updating care reminder:", err);
      toast.error("Unable to update care reminder. Please try again.");
      throw err;
    }
  };

  /**
   * Delete a care reminder
   * Removes a care reminder document from Firestore
   *
   * @param reminderId - The ID of the reminder to delete
   * @returns Promise that resolves when the reminder is deleted
   */
  const deleteReminder = async (reminderId: string): Promise<void> => {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    if (!user.value) {
      throw new Error("User must be authenticated to delete care reminders");
    }

    try {
      const reminderRef = doc(db, "careReminders", reminderId);
      await deleteDoc(reminderRef);

      toast.success("Care reminder deleted");
    } catch (err) {
      console.error("Error deleting care reminder:", err);
      toast.error("Unable to delete care reminder. Please try again.");
      throw err;
    }
  };

  /**
   * Cleanup function to unsubscribe from the snapshot listener
   */
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  // Set up listener on mount and clean up on unmount
  onMounted(() => {
    subscribe();
  });

  onUnmounted(() => {
    cleanup();
  });

  // Re-subscribe when memberId changes
  watch(memberIdRef, () => {
    cleanup();
    subscribe();
  });

  return {
    reminders: readonly(reminders),
    loading: readonly(loading),
    error: readonly(error),
    addReminder,
    updateReminder,
    deleteReminder,
  };
}
