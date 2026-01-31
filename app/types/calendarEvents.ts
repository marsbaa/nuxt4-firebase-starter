import type { Timestamp } from "firebase/firestore";

/**
 * Event type classification for the Care Calendar
 * Each type carries pastoral significance and visual distinction
 */
export type CalendarEventType =
  | "community-gathering"
  | "member-milestone"
  | "care-reminder"
  | "care-update"
  | "liturgical-event";

/**
 * Milestone subtype for member milestones
 */
export type MilestoneType = "birthday" | "anniversary";

/**
 * Base calendar event structure
 * All calendar events share these common properties
 */
export interface BaseCalendarEvent {
  /** Firestore document ID */
  id: string;
  /** Event type classification */
  type: CalendarEventType;
  /** Event title or name */
  title: string;
  /** Event date (stored as Timestamp for Firestore compatibility) */
  date: Timestamp;
  /** Optional rich description or context */
  description?: string;
  /** Reference to associated member (if applicable) */
  memberId?: string;
  /** Member name for quick display (denormalized for performance) */
  memberName?: string;
}

/**
 * Recurrence configuration for recurring events
 */
export interface EventRecurrence {
  /** Recurrence type (initially weekly only) */
  type: "weekly";
  /** Days of the week for weekly recurrence */
  daysOfWeek: string[];
  /** End condition for the recurrence */
  endCondition: "never" | { endsOn: Timestamp };
}

/**
 * Community Gathering event
 * Church events, services, picnics, special gatherings
 * These are user-created communal time markers
 */
export interface CommunityGatheringEvent extends BaseCalendarEvent {
  type: "community-gathering";
  /** User ID who created the event */
  createdBy: string;
  /** Display name of the creator */
  createdByName: string;
  /** Creation timestamp */
  createdAt: Timestamp;
  /** Whether this is an all-day event */
  allDay: boolean;
  /** Start time (if not all-day) */
  startTime?: Timestamp;
  /** End time (optional, if not all-day) */
  endTime?: Timestamp;
  /** Recurrence configuration (if recurring) */
  recurrence?: EventRecurrence;
  /** For recurring events, the ID of the series master */
  seriesId?: string;
  /** For exceptions, the ID of the parent series */
  parentSeriesId?: string;
}

/**
 * Member Milestone event
 * Birthdays, anniversaries sourced from member data
 * Read-only, derived from member records
 */
export interface MemberMilestoneEvent extends BaseCalendarEvent {
  type: "member-milestone";
  /** Required: reference to member */
  memberId: string;
  /** Required: member name */
  memberName: string;
  /** Milestone subtype */
  milestoneType: MilestoneType;
}

/**
 * Care Reminder event (read-only on calendar)
 * Sourced from existing Care Reminders on member pages
 * Displayed for awareness; managed through Member Detail pages
 */
export interface CareReminderEvent extends BaseCalendarEvent {
  type: "care-reminder";
  /** Required: reference to member */
  memberId: string;
  /** Required: member name */
  memberName: string;
  /** Reference to the source Care Reminder document */
  reminderId: string;
  /** Whether the reminder is expired (past due date) */
  isExpired: boolean;
}

/**
 * Care Update event (read-only signal)
 * Indicates recent care activity for a member
 * Does not expose note content; only signals care occurred
 */
export interface CareUpdateEvent extends BaseCalendarEvent {
  type: "care-update";
  /** Required: reference to member */
  memberId: string;
  /** Required: member name */
  memberName: string;
  /** Optional: reference to associated Care Note */
  careNoteId?: string;
}

/**
 * Liturgical Event (future enhancement)
 * Seasonal observances, holy days
 */
export interface LiturgicalEvent extends BaseCalendarEvent {
  type: "liturgical-event";
  /** Liturgical season or context */
  liturgicalContext?: string;
}

/**
 * Union type for all calendar events
 */
export type CalendarEvent =
  | CommunityGatheringEvent
  | MemberMilestoneEvent
  | CareReminderEvent
  | CareUpdateEvent
  | LiturgicalEvent;

/**
 * Data structure for creating a new Community Gathering event
 * Omits auto-generated fields (id, timestamps)
 */
export interface CreateCommunityGatheringInput {
  title: string;
  date: Date;
  description?: string;
  createdBy: string;
  createdByName: string;
  allDay: boolean;
  startTime?: Date;
  endTime?: Date;
  recurrence?: EventRecurrence;
}

/**
 * Data structure for updating a Community Gathering event
 */
export interface UpdateCommunityGatheringInput extends Partial<CreateCommunityGatheringInput> {
  id: string;
  scope?: "this" | "future" | "all"; // Scope for recurring event updates
}

/**
 * Calendar view mode
 */
export type CalendarViewMode = "month" | "agenda";

/**
 * Calendar filter state for Focus Panel
 */
export interface CalendarFilters {
  /** Member ID to filter by (null = show all) */
  selectedMemberId: string | null;
  /** Event type visibility toggles */
  visibleTypes: {
    "community-gathering": boolean;
    "member-milestone": boolean;
    "care-reminder": boolean;
    "care-update": boolean;
    "liturgical-event": boolean;
  };
  /** Whether to show completed Care Reminders */
  showCompletedReminders: boolean;
  /** Search query for event titles/descriptions */
  searchQuery: string;
}
