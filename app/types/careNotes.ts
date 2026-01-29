import type { Timestamp } from "firebase/firestore";

/**
 * Edit history entry for a care note
 * Preserves previous content when a note is edited
 */
export interface CareNoteHistoryEntry {
  /** Previous content before the edit */
  content: string;
  /** When the edit occurred */
  editedAt: Timestamp;
  /** User ID who made the edit */
  editedBy: string;
  /** Display name of the editor */
  editedByName: string;
}

/**
 * Care Note document structure in Firestore
 * Represents a pastoral care interaction or observation about a member
 */
export interface CareNote {
  /** Firestore document ID */
  id: string;
  /** Reference to member (indexed for queries) */
  memberId: string;
  /** The care note narrative text */
  content: string;
  /** User ID of the note author */
  authorId: string;
  /** Display name of the author */
  authorName: string;
  /** Original creation timestamp (never changes) */
  createdAt: Timestamp;
  /** Last update timestamp */
  updatedAt: Timestamp;
  /** Edit history for integrity and memory */
  history: CareNoteHistoryEntry[];
}

/**
 * Data structure for creating a new care note
 * Omits auto-generated fields (id, timestamps, history)
 */
export interface CreateCareNoteInput {
  memberId: string;
  content: string;
  authorId: string;
  authorName: string;
}

/**
 * Data structure for updating an existing care note
 * Only the content can be updated; history is managed automatically
 */
export interface UpdateCareNoteInput {
  content: string;
}
