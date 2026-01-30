import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
  getDocs,
} from "firebase/firestore";
import type {
  CalendarEvent,
  CommunityGatheringEvent,
  MemberMilestoneEvent,
  CareReminderEvent,
  CreateCommunityGatheringInput,
  CalendarFilters,
} from "~/types/calendarEvents";

/**
 * Composable for managing Calendar Events with Firestore
 *
 * Provides real-time synchronization of calendar events across different sources:
 * - Community Gatherings (user-created, stored in Firestore)
 * - Member Milestones (derived from member data)
 * - Care Reminders (read-only view from careReminders collection)
 * - Care Updates (derived from care notes)
 *
 * **Purpose:**
 * The Care Calendar provides a visual overview of shared communal time within the church community.
 * It supports attentiveness over efficiency and avoids task management patterns.
 *
 * **Features:**
 * - Real-time synchronization via onSnapshot()
 * - Aggregates events from multiple sources
 * - Supports filtering by member, event type, and search
 * - Automatic cleanup on component unmount
 * - Pastoral language and patterns throughout
 *
 * **Security Model:**
 * - All authenticated users can read all calendar events (pastoral team-only)
 * - All authenticated users can create community gathering events
 * - Care Reminders and Member Milestones are read-only on calendar
 *
 * @param startDate - Optional start date for filtering events (defaults to current month)
 * @param endDate - Optional end date for filtering events (defaults to current month)
 * @returns Object containing calendar events, loading state, and operations
 */
export function useCalendarEvents(
  startDate?: Ref<Date> | Date,
  endDate?: Ref<Date> | Date,
) {
  const { db, user } = useFirebase();
  const toast = useToast();

  // Reactive state
  const communityEvents = ref<CommunityGatheringEvent[]>([]);
  const memberMilestones = ref<MemberMilestoneEvent[]>([]);
  const careReminders = ref<CareReminderEvent[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  // Filters state
  const filters = ref<CalendarFilters>({
    selectedMemberId: null,
    visibleTypes: {
      "community-gathering": true,
      "member-milestone": true,
      "care-reminder": true,
      "care-update": true,
      "liturgical-event": true,
    },
    showCompletedReminders: false,
    searchQuery: "",
  });

  // Unsubscribe functions for cleanup
  let unsubscribeCommunityEvents: Unsubscribe | null = null;
  let unsubscribeCareReminders: Unsubscribe | null = null;

  // Convert dates to refs if they're not already
  const startDateRef = isRef(startDate) ? startDate : ref(startDate);
  const endDateRef = isRef(endDate) ? endDate : ref(endDate);

  /**
   * Subscribe to community gathering events
   * Sets up real-time listener for user-created events
   */
  const subscribeToCommunityEvents = () => {
    if (!db) return;

    try {
      const eventsQuery = query(
        collection(db, "calendarEvents"),
        orderBy("date", "asc"),
      );

      unsubscribeCommunityEvents = onSnapshot(
        eventsQuery,
        (snapshot) => {
          communityEvents.value = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              type: "community-gathering",
              title: data.title,
              date: data.date,
              description: data.description,
              memberId: data.memberId,
              memberName: data.memberName,
              createdBy: data.createdBy,
              createdByName: data.createdByName,
              createdAt: data.createdAt,
            } as CommunityGatheringEvent;
          });
        },
        (err) => {
          console.error("Error loading community events:", err);
          error.value = err as Error;
        },
      );
    } catch (err) {
      console.error("Error setting up community events listener:", err);
      error.value = err as Error;
    }
  };

  /**
   * Load member milestones (birthdays, anniversaries)
   * Transforms member data into calendar events
   */
  const loadMemberMilestones = async () => {
    if (!db) return;

    try {
      const membersQuery = query(collection(db, "members"));
      const snapshot = await getDocs(membersQuery);

      const milestones: MemberMilestoneEvent[] = [];
      const currentYear = new Date().getFullYear();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const memberId = doc.id;
        const memberName = data.displayName || "Unknown Member";

        // Parse name for display
        const parseName = (name: string) => {
          if (!name || !name.includes(",")) {
            return { firstName: name || "", lastName: "" };
          }
          const [lastName, firstName] = name.split(",").map((s) => s.trim());
          return { firstName, lastName };
        };

        const { firstName, lastName } = parseName(memberName);

        // Add birthday event if date of birth exists
        if (data.dateOfBirth) {
          const dob = data.dateOfBirth.toDate();
          const birthdayThisYear = new Date(
            currentYear,
            dob.getMonth(),
            dob.getDate(),
          );

          const shortLastName = lastName ? `${lastName.charAt(0)}.` : "";
          const title = `${firstName} ${shortLastName} Birthday`.trim();

          milestones.push({
            id: `birthday-${memberId}-${currentYear}`,
            type: "member-milestone",
            title,
            date: Timestamp.fromDate(birthdayThisYear),
            memberId,
            memberName,
            milestoneType: "birthday",
          });
        }

        // Add anniversary event if anniversary date exists
        if (data.anniversaryDate) {
          const anniversary = data.anniversaryDate.toDate();
          const anniversaryThisYear = new Date(
            currentYear,
            anniversary.getMonth(),
            anniversary.getDate(),
          );

          const shortLastName = lastName ? `${lastName.charAt(0)}.` : "";
          const title = `${firstName} ${shortLastName} Anniversary`.trim();

          milestones.push({
            id: `anniversary-${memberId}-${currentYear}`,
            type: "member-milestone",
            title,
            date: Timestamp.fromDate(anniversaryThisYear),
            memberId,
            memberName,
            milestoneType: "anniversary",
          });
        }
      });

      memberMilestones.value = milestones;
    } catch (err) {
      console.error("Error loading member milestones:", err);
      error.value = err as Error;
    }
  };

  /**
   * Subscribe to care reminders for calendar display
   * Sets up real-time listener for care reminders
   */
  const subscribeToCareReminders = async () => {
    if (!db) return;

    try {
      // First, get all members to create a lookup map
      const membersQuery = query(collection(db, "members"));
      const membersSnapshot = await getDocs(membersQuery);
      const memberLookup = new Map<string, string>();

      membersSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        // Member.name is in "LASTNAME, FIRSTNAME" format or just a name string
        memberLookup.set(doc.id, data.displayName || "Unknown Member");
      });

      // Then subscribe to care reminders with member names resolved
      const remindersQuery = query(
        collection(db, "careReminders"),
        orderBy("dueDate", "asc"),
      );

      unsubscribeCareReminders = onSnapshot(
        remindersQuery,
        (snapshot) => {
          careReminders.value = snapshot.docs
            .map((doc) => {
              const data = doc.data();

              // Skip reminders without due dates (can't display on calendar)
              if (!data.dueDate) return null;

              // Check if expired
              const dueDate = data.dueDate.toDate();
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isExpired = dueDate < today;

              // Get member name from lookup
              const memberName =
                memberLookup.get(data.memberId) || "Unknown Member";

              return {
                id: `care-reminder-${doc.id}`,
                type: "care-reminder",
                title: data.text,
                date: data.dueDate,
                memberId: data.memberId,
                memberName,
                reminderId: doc.id,
                isExpired,
              } as CareReminderEvent;
            })
            .filter((event): event is CareReminderEvent => event !== null);
        },
        (err) => {
          console.error("Error loading care reminders:", err);
          error.value = err as Error;
        },
      );
    } catch (err) {
      console.error("Error setting up care reminders listener:", err);
      error.value = err as Error;
    }
  };

  /**
   * Get all calendar events combined and filtered
   * Combines events from all sources and applies current filters
   */
  const allEvents = computed<CalendarEvent[]>(() => {
    let events: CalendarEvent[] = [];

    // Add community gatherings if visible
    if (filters.value.visibleTypes["community-gathering"]) {
      events.push(...communityEvents.value);
    }

    // Add member milestones if visible
    if (filters.value.visibleTypes["member-milestone"]) {
      events.push(...memberMilestones.value);
    }

    // Add care reminders if visible
    if (filters.value.visibleTypes["care-reminder"]) {
      const remindersToShow = filters.value.showCompletedReminders
        ? careReminders.value
        : careReminders.value.filter((r) => !r.isExpired);
      events.push(...remindersToShow);
    }

    // Filter by member if selected
    if (filters.value.selectedMemberId) {
      events = events.filter(
        (event) => event.memberId === filters.value.selectedMemberId,
      );
    }

    // Filter by search query
    if (filters.value.searchQuery.trim()) {
      const query = filters.value.searchQuery.toLowerCase();
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query),
      );
    }

    // Filter by date range if provided
    if (startDateRef.value && endDateRef.value) {
      const start = Timestamp.fromDate(startDateRef.value);
      const end = Timestamp.fromDate(endDateRef.value);
      events = events.filter((event) => {
        const eventTime = event.date.toMillis();
        return eventTime >= start.toMillis() && eventTime <= end.toMillis();
      });
    }

    // Sort by date
    events.sort((a, b) => a.date.toMillis() - b.date.toMillis());

    return events;
  });

  /**
   * Add a new community gathering event
   * Creates a new event document in Firestore
   *
   * @param input - Event data (title, date, description)
   * @returns Promise that resolves when the event is created
   */
  const addCommunityEvent = async (
    input: CreateCommunityGatheringInput,
  ): Promise<void> => {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    if (!user.value) {
      throw new Error("User must be authenticated to add events");
    }

    if (!input.title.trim()) {
      toast.error("Please provide an event name");
      throw new Error("Title cannot be empty");
    }

    try {
      const eventData = {
        title: input.title.trim(),
        date: Timestamp.fromDate(input.date),
        description: input.description?.trim() || null,
        createdBy: input.createdBy,
        createdByName: input.createdByName,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "calendarEvents"), eventData);

      toast.success("Event added to calendar");
    } catch (err) {
      console.error("Error adding community event:", err);
      toast.error("Unable to add event. Please try again.");
      throw err;
    }
  };

  /**
   * Update filter state
   * @param updates - Partial filter updates
   */
  const updateFilters = (updates: Partial<CalendarFilters>) => {
    filters.value = { ...filters.value, ...updates };
  };

  /**
   * Cleanup function to unsubscribe from all snapshot listeners
   */
  const cleanup = () => {
    if (unsubscribeCommunityEvents) {
      unsubscribeCommunityEvents();
      unsubscribeCommunityEvents = null;
    }
    if (unsubscribeCareReminders) {
      unsubscribeCareReminders();
      unsubscribeCareReminders = null;
    }
  };

  /**
   * Initialize all data subscriptions
   */
  const initialize = async () => {
    loading.value = true;
    error.value = null;

    try {
      subscribeToCommunityEvents();
      await subscribeToCareReminders();
      await loadMemberMilestones();
      loading.value = false;
    } catch (err) {
      console.error("Error initializing calendar:", err);
      error.value = err as Error;
      loading.value = false;
      toast.error("Unable to load calendar. Please try again.");
    }
  };

  // Set up listeners on mount and clean up on unmount
  onMounted(() => {
    initialize();
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    allEvents: readonly(allEvents),
    communityEvents: readonly(communityEvents),
    memberMilestones: readonly(memberMilestones),
    careReminders: readonly(careReminders),
    filters: readonly(filters),
    loading: readonly(loading),
    error: readonly(error),
    addCommunityEvent,
    updateFilters,
    refresh: initialize,
  };
}
