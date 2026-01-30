import { defineStore } from "pinia";
import {
  collection,
  query,
  where,
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

export const useCareRemindersStore = defineStore("careReminders", {
  state: () => ({
    reminders: [] as CareReminder[],
    loading: false,
    error: null as Error | null,
    currentMemberId: null as string | null,
    unsubscribe: null as Unsubscribe | null,
  }),

  getters: {
    /**
     * Whether care reminders are currently loading
     */
    isLoading: (state) => state.loading,

    /**
     * Whether there is an error state
     */
    hasError: (state) => state.error !== null,
  },

  actions: {
    /**
     * Check if a reminder is expired based on its due date
     */
    isReminderExpired(dueDate: Timestamp | null): boolean {
      if (!dueDate) return false; // Reminders with no due date never expire

      const due = dueDate.toDate();

      // Get start of today in local timezone
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Get start of due date in local timezone
      const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

      // Consider expired only if due date is before today
      return dueDay < today;
    },

    /**
     * Set the current member and subscribe to their care reminders
     */
    setMember(memberId: string) {
      if (this.currentMemberId === memberId) return;

      // Unsubscribe from previous member
      this.unsubscribeFromCurrent();

      this.currentMemberId = memberId;
      this.subscribe();
    },

    /**
     * Subscribe to real-time care reminders updates for current member
     */
    subscribe() {
      const { db } = useFirebase();

      if (!db) {
        this.error = new Error("Firestore is not initialized");
        this.loading = false;
        return;
      }

      if (!this.currentMemberId) {
        this.error = new Error("Member ID is required");
        this.loading = false;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        // Query all care reminders for the member
        const careRemindersQuery = query(
          collection(db, "careReminders"),
          where("memberId", "==", this.currentMemberId),
        );

        // Set up real-time listener
        this.unsubscribe = onSnapshot(
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
                isExpired: this.isReminderExpired(data.dueDate),
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
            this.reminders = [...withDates, ...withoutDates].slice(0, 3);

            this.loading = false;
            this.error = null;
          },
          (err) => {
            console.error("Error loading care reminders:", err);
            this.error = err as Error;
            this.loading = false;
            const toast = useToast();
            toast.error("Unable to load care reminders. Please try again.");
          },
        );
      } catch (err) {
        console.error("Error setting up care reminders listener:", err);
        this.error = err as Error;
        this.loading = false;
        const toast = useToast();
        toast.error("Unable to load care reminders. Please try again.");
      }
    },

    /**
     * Unsubscribe from current member's care reminders
     */
    unsubscribeFromCurrent() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
      this.reminders = [];
      this.loading = false;
      this.error = null;
    },

    /**
     * Add a new care reminder
     */
    async addReminder(
      text: string,
      dueDate: Date | null = null,
    ): Promise<void> {
      const { db, user } = useFirebase();
      const toast = useToast();

      if (!db) {
        throw new Error("Firestore is not initialized");
      }

      if (!user.value) {
        throw new Error("User must be authenticated to add care reminders");
      }

      if (!this.currentMemberId) {
        throw new Error("No member selected");
      }

      if (!text.trim()) {
        toast.error("Please share what you'd like to hold in mind");
        throw new Error("Text cannot be empty");
      }

      try {
        const reminderData = {
          memberId: this.currentMemberId,
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
    },

    /**
     * Update an existing care reminder
     */
    async updateReminder(
      reminderId: string,
      text: string,
      dueDate: Date | null = null,
    ): Promise<void> {
      const { db, user } = useFirebase();
      const toast = useToast();

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
    },

    /**
     * Delete a care reminder
     */
    async deleteReminder(reminderId: string): Promise<void> {
      const { db, user } = useFirebase();
      const toast = useToast();

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
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null;
    },
  },
});
