import type { Timestamp } from "firebase/firestore";

/**
 * Care Reminder document structure in Firestore
 * Represents a gentle follow-up intention held in mind for a specific member
 *
 * Care Reminders are NOT tasks, obligations, or deadlines.
 * They exist to support memory and pastoral presence.
 */
export interface CareReminder {
  /** Firestore document ID */
  id: string;
  /** Reference to member (indexed for queries) */
  memberId: string;
  /** The reminder text describing what to hold in mind */
  text: string;
  /** Optional due date when to remember this (Timestamp or null for undated) */
  dueDate: Timestamp | null;
  /** User ID of the reminder author */
  authorId: string;
  /** Display name of the author (shown as "Held by [Name]") */
  authorName: string;
  /** Creation timestamp */
  createdAt: Timestamp;
  /** Whether the reminder is expired (past due date) */
  isExpired: boolean;
}

/**
 * Data structure for creating a new care reminder
 * Omits auto-generated fields (id, timestamps, isExpired)
 */
export interface CreateCareReminderInput {
  memberId: string;
  text: string;
  dueDate: Date | null;
  authorId: string;
  authorName: string;
}
