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
  type Unsubscribe,
} from "firebase/firestore";
import type {
  CareNote,
  CreateCareNoteInput,
  UpdateCareNoteInput,
} from "~/types/careNotes";

/**
 * Composable for managing Care Notes with Firestore
 * Provides real-time updates via snapshot listener and CRUD operations
 *
 * @param memberId - The ID of the member whose care notes to manage
 * @returns Care notes state, loading state, error state, and CRUD operations
 */
export function useCareNotes(memberId: Ref<string> | string) {
  const { db, user } = useFirebase();
  const toast = useToast();

  // Reactive state
  const notes = ref<CareNote[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  // Unsubscribe function for cleanup
  let unsubscribe: Unsubscribe | null = null;

  // Convert memberId to ref if it's a string
  const memberIdRef = isRef(memberId) ? memberId : ref(memberId);

  /**
   * Subscribe to real-time care notes updates
   * Sets up Firestore snapshot listener for the specified member
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
      // Query care notes for the member, ordered by creation date (newest first)
      const careNotesQuery = query(
        collection(db, "careNotes"),
        where("memberId", "==", memberIdRef.value),
        orderBy("createdAt", "desc"),
        limit(50),
      );

      // Set up real-time listener
      unsubscribe = onSnapshot(
        careNotesQuery,
        (snapshot) => {
          notes.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as CareNote[];
          loading.value = false;
          error.value = null;
        },
        (err) => {
          console.error("Error loading care notes:", err);
          error.value = err as Error;
          loading.value = false;
          toast.error("Unable to load care notes. Please try again.");
        },
      );
    } catch (err) {
      console.error("Error setting up care notes listener:", err);
      error.value = err as Error;
      loading.value = false;
      toast.error("Unable to load care notes. Please try again.");
    }
  };

  /**
   * Add a new care note
   * Creates a new care note document in Firestore
   *
   * @param content - The care note narrative text
   * @returns Promise that resolves when the note is created
   */
  const addNote = async (content: string): Promise<void> => {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    if (!user.value) {
      throw new Error("User must be authenticated to add care notes");
    }

    if (!content.trim()) {
      toast.error("Please share a care note");
      throw new Error("Content cannot be empty");
    }

    try {
      const noteData: CreateCareNoteInput = {
        memberId: memberIdRef.value,
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
  };

  /**
   * Update an existing care note with history preservation
   * Appends the previous content to the history array before updating
   *
   * @param noteId - The ID of the note to update
   * @param newContent - The new content for the note
   * @returns Promise that resolves when the note is updated
   */
  const updateNote = async (
    noteId: string,
    newContent: string,
  ): Promise<void> => {
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
          editedAt: serverTimestamp(),
          editedBy: user.value.uid,
          editedByName: user.value.displayName || user.value.email || "Unknown",
        }),
      });

      toast.success("Care note updated");
    } catch (err) {
      console.error("Error updating care note:", err);
      toast.error("Unable to update care note. Please try again.");
      throw err;
    }
  };

  /**
   * Delete a care note
   * Removes the care note document from Firestore
   *
   * @param noteId - The ID of the note to delete
   * @returns Promise that resolves when the note is deleted
   */
  const deleteNote = async (noteId: string): Promise<void> => {
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
    notes: readonly(notes),
    loading: readonly(loading),
    error: readonly(error),
    addNote,
    updateNote,
    deleteNote,
  };
}
