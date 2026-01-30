import { defineStore } from "pinia";
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
  getDoc,
  serverTimestamp,
  arrayUnion,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import type {
  CareNote,
  CreateCareNoteInput,
  UpdateCareNoteInput,
} from "~/types/careNotes";

export const useCareNotesStore = defineStore("careNotes", {
  state: () => ({
    notes: [] as CareNote[],
    loading: false,
    error: null as Error | null,
    currentMemberId: null as string | null,
    unsubscribe: null as Unsubscribe | null,
  }),

  getters: {
    /**
     * Whether care notes are currently loading
     */
    isLoading: (state) => state.loading,

    /**
     * Whether there is an error state
     */
    hasError: (state) => state.error !== null,
  },

  actions: {
    /**
     * Set the current member and subscribe to their care notes
     */
    setMember(memberId: string) {
      if (this.currentMemberId === memberId) return;

      // Unsubscribe from previous member
      this.unsubscribeFromCurrent();

      this.currentMemberId = memberId;
      this.subscribe();
    },

    /**
     * Subscribe to real-time care notes updates for current member
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
        // Query care notes for the member, ordered by creation date (newest first)
        const careNotesQuery = query(
          collection(db, "careNotes"),
          where("memberId", "==", this.currentMemberId),
          orderBy("createdAt", "desc"),
          limit(50),
        );

        // Set up real-time listener
        this.unsubscribe = onSnapshot(
          careNotesQuery,
          (snapshot) => {
            this.notes = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as CareNote[];
            this.loading = false;
            this.error = null;
          },
          (err) => {
            console.error("Error loading care notes:", err);
            this.error = err as Error;
            this.loading = false;
            const toast = useToast();
            toast.error("Unable to load care notes. Please try again.");
          },
        );
      } catch (err) {
        console.error("Error setting up care notes listener:", err);
        this.error = err as Error;
        this.loading = false;
        const toast = useToast();
        toast.error("Unable to load care notes. Please try again.");
      }
    },

    /**
     * Unsubscribe from current member's care notes
     */
    unsubscribeFromCurrent() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
      this.notes = [];
      this.loading = false;
      this.error = null;
    },

    /**
     * Add a new care note
     */
    async addNote(content: string): Promise<void> {
      const { db, user } = useFirebase();
      const toast = useToast();

      if (!db) {
        throw new Error("Firestore is not initialized");
      }

      if (!user.value) {
        throw new Error("User must be authenticated to add care notes");
      }

      if (!this.currentMemberId) {
        throw new Error("No member selected");
      }

      if (!content.trim()) {
        toast.error("Please share a care note");
        throw new Error("Content cannot be empty");
      }

      try {
        const noteData: CreateCareNoteInput = {
          memberId: this.currentMemberId,
          content: content.trim(),
          authorId: user.value.uid,
          authorName: user.value.displayName || user.value.email || "Unknown",
        };

        await addDoc(collection(db, "careNotes"), {
          ...noteData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          history: [],
        });

        toast.success("Care note added");
      } catch (err) {
        console.error("Error adding care note:", err);
        toast.error("Unable to add care note. Please try again.");
        throw err;
      }
    },

    /**
     * Update an existing care note with history preservation
     */
    async updateNote(noteId: string, newContent: string): Promise<void> {
      const { db, user } = useFirebase();
      const toast = useToast();

      if (!db) {
        throw new Error("Firestore is not initialized");
      }

      if (!user.value) {
        throw new Error("User must be authenticated to update care notes");
      }

      if (!newContent.trim()) {
        toast.error("Please share a care note");
        throw new Error("Content cannot be empty");
      }

      try {
        // Get the current note to preserve its content in history
        const noteRef = doc(db, "careNotes", noteId);
        const noteSnap = await getDoc(noteRef);

        if (!noteSnap.exists()) {
          throw new Error("Care note not found");
        }

        const currentData = noteSnap.data();

        // Update the note with history preservation
        await updateDoc(noteRef, {
          content: newContent.trim(),
          updatedAt: serverTimestamp(),
          history: arrayUnion({
            content: currentData.content,
            editedAt: Timestamp.now(),
            editedBy: user.value.uid,
            editedByName:
              user.value.displayName || user.value.email || "Unknown",
          }),
        });

        toast.success("Care note updated");
      } catch (err) {
        console.error("Error updating care note:", err);
        toast.error("Unable to update care note. Please try again.");
        throw err;
      }
    },

    /**
     * Delete a care note
     */
    async deleteNote(noteId: string): Promise<void> {
      const { db, user } = useFirebase();
      const toast = useToast();

      if (!db) {
        throw new Error("Firestore is not initialized");
      }

      if (!user.value) {
        throw new Error("User must be authenticated to delete care notes");
      }

      try {
        await deleteDoc(doc(db, "careNotes", noteId));
        toast.success("Care note removed");
      } catch (err) {
        console.error("Error deleting care note:", err);
        toast.error("Unable to remove care note. Please try again.");
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
