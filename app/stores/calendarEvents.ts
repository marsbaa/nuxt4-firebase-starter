import { defineStore } from "pinia";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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
  UpdateCommunityGatheringInput,
  CalendarFilters,
} from "~/types/calendarEvents";

export const useCalendarEventsStore = defineStore("calendarEvents", {
  state: () => ({
    communityEvents: [] as CommunityGatheringEvent[],
    memberMilestones: [] as MemberMilestoneEvent[],
    careReminders: [] as CareReminderEvent[],
    loading: false,
    error: null as Error | null,
    filters: {
      selectedMemberId: null as string | null,
      visibleTypes: {
        "community-gathering": true,
        "member-milestone": true,
        "care-reminder": true,
        "care-update": false,
        "liturgical-event": true,
      },
      showCompletedReminders: false,
      searchQuery: "",
    } as CalendarFilters,
    unsubscribeCommunityEvents: null as Unsubscribe | null,
    unsubscribeCareReminders: null as Unsubscribe | null,
  }),

  getters: {
    /**
     * Whether calendar events are currently loading
     */
    isLoading: (state) => state.loading,

    /**
     * Whether there is an error state
     */
    hasError: (state) => state.error !== null,

    /**
     * Get all calendar events combined and filtered
     */
    allEvents: (state): CalendarEvent[] => {
      let events: CalendarEvent[] = [];

      // Add community gatherings if visible
      if (state.filters.visibleTypes["community-gathering"]) {
        events.push(...state.communityEvents);
      }

      // Add member milestones if visible
      if (state.filters.visibleTypes["member-milestone"]) {
        events.push(...state.memberMilestones);
      }

      // Add care reminders if visible
      if (state.filters.visibleTypes["care-reminder"]) {
        const remindersToShow = state.filters.showCompletedReminders
          ? state.careReminders
          : state.careReminders.filter((r) => !r.isExpired);
        events.push(...remindersToShow);
      }

      // Filter by member if selected
      if (state.filters.selectedMemberId) {
        events = events.filter(
          (event) => event.memberId === state.filters.selectedMemberId,
        );
      }

      // Filter by search query
      if (state.filters.searchQuery.trim()) {
        const query = state.filters.searchQuery.toLowerCase();
        events = events.filter(
          (event) =>
            event.title.toLowerCase().includes(query) ||
            event.description?.toLowerCase().includes(query),
        );
      }

      // Sort by date
      events.sort((a, b) => a.date.toMillis() - b.date.toMillis());

      return events;
    },
  },

  actions: {
    /**
     * Subscribe to community gathering events
     */
    subscribeToCommunityEvents() {
      const { db } = useFirebase();

      if (!db) return;

      try {
        const eventsQuery = query(
          collection(db, "calendarEvents"),
          orderBy("date", "asc"),
        );

        this.unsubscribeCommunityEvents = onSnapshot(
          eventsQuery,
          (snapshot) => {
            this.communityEvents = snapshot.docs.map((doc) => {
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
                allDay: data.allDay ?? true,
                startTime: data.startTime,
                endTime: data.endTime,
                recurrence: data.recurrence,
                seriesId: data.seriesId,
                parentSeriesId: data.parentSeriesId,
              } as CommunityGatheringEvent;
            });
          },
          (err) => {
            console.error("Error loading community events:", err);
            this.error = err as Error;
          },
        );
      } catch (err) {
        console.error("Error setting up community events listener:", err);
        this.error = err as Error;
      }
    },

    /**
     * Load member milestones (birthdays, anniversaries)
     */
    async loadMemberMilestones() {
      const { db } = useFirebase();

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

          // Add birthday event if birthday exists
          if (data.birthday) {
            const dob = data.birthday.toDate();
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

        this.memberMilestones = milestones;
      } catch (err) {
        console.error("Error loading member milestones:", err);
        this.error = err as Error;
      }
    },

    /**
     * Subscribe to care reminders for calendar display
     */
    async subscribeToCareReminders() {
      const { db } = useFirebase();

      if (!db) return;

      try {
        // First, get all members to create a lookup map
        const membersQuery = query(collection(db, "members"));
        const membersSnapshot = await getDocs(membersQuery);
        const memberLookup = new Map<string, string>();

        membersSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          memberLookup.set(doc.id, data.displayName || "Unknown Member");
        });

        // Then subscribe to care reminders with member names resolved
        const remindersQuery = query(
          collection(db, "careReminders"),
          orderBy("dueDate", "asc"),
        );

        this.unsubscribeCareReminders = onSnapshot(
          remindersQuery,
          (snapshot) => {
            this.careReminders = snapshot.docs
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
            this.error = err as Error;
          },
        );
      } catch (err) {
        console.error("Error setting up care reminders listener:", err);
        this.error = err as Error;
      }
    },

    /**
     * Initialize all data subscriptions
     */
    async initialize() {
      this.loading = true;
      this.error = null;

      try {
        this.subscribeToCommunityEvents();
        await this.subscribeToCareReminders();
        await this.loadMemberMilestones();
        this.loading = false;
      } catch (err) {
        console.error("Error initializing calendar:", err);
        this.error = err as Error;
        this.loading = false;
        const toast = useToast();
        toast.error("Unable to load calendar. Please try again.");
      }
    },

    /**
     * Add a new community gathering event
     */
    async addCommunityEvent(
      input: CreateCommunityGatheringInput,
    ): Promise<void> {
      const { db, user } = useFirebase();
      const toast = useToast();

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
          allDay: input.allDay,
          startTime: input.startTime
            ? Timestamp.fromDate(input.startTime)
            : null,
          endTime: input.endTime ? Timestamp.fromDate(input.endTime) : null,
          recurrence: input.recurrence || null,
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
    },

    /**
     * Update a community gathering event
     */
    async updateEvent(input: UpdateCommunityGatheringInput): Promise<void> {
      const { db, user } = useFirebase();
      const toast = useToast();

      if (!db) {
        throw new Error("Firestore is not initialized");
      }

      if (!user.value) {
        throw new Error("User must be authenticated to update events");
      }

      if (!input.title?.trim()) {
        toast.error("Please provide an event name");
        throw new Error("Title cannot be empty");
      }

      try {
        const eventRef = doc(db, "calendarEvents", input.id);
        const updateData: any = {};

        if (input.title !== undefined) updateData.title = input.title.trim();
        if (input.date !== undefined)
          updateData.date = Timestamp.fromDate(input.date);
        if (input.description !== undefined)
          updateData.description = input.description?.trim() || null;
        if (input.allDay !== undefined) updateData.allDay = input.allDay;
        if (input.startTime !== undefined)
          updateData.startTime = input.startTime
            ? Timestamp.fromDate(input.startTime)
            : null;
        if (input.endTime !== undefined)
          updateData.endTime = input.endTime
            ? Timestamp.fromDate(input.endTime)
            : null;
        if (input.recurrence !== undefined)
          updateData.recurrence = input.recurrence || null;

        // Handle series scope for recurring events
        const existingEvent = this.communityEvents.find(
          (e) => e.id === input.id,
        );
        if (existingEvent?.recurrence && input.scope === "this") {
          // Create an exception for this occurrence
          const exceptionData = {
            ...updateData,
            parentSeriesId: existingEvent.seriesId || existingEvent.id,
            createdBy: user.value.uid,
            createdByName: user.value.displayName || "Unknown",
            createdAt: serverTimestamp(),
          };
          await addDoc(collection(db, "calendarEvents"), exceptionData);
        } else {
          // Update the existing document
          await updateDoc(eventRef, updateData);
        }

        toast.success("Event updated");
      } catch (err) {
        console.error("Error updating community event:", err);
        toast.error("Unable to update event. Please try again.");
        throw err;
      }
    },

    /**
     * Delete a community gathering event
     */
    async deleteEvent(
      id: string,
      scope?: "this" | "future" | "all",
    ): Promise<void> {
      const { db, user } = useFirebase();
      const toast = useToast();

      if (!db) {
        throw new Error("Firestore is not initialized");
      }

      if (!user.value) {
        throw new Error("User must be authenticated to delete events");
      }

      try {
        const existingEvent = this.communityEvents.find((e) => e.id === id);
        if (!existingEvent) {
          throw new Error("Event not found");
        }

        if (existingEvent.recurrence && scope === "this") {
          // Create a deletion exception for this occurrence
          const exceptionData = {
            title: existingEvent.title,
            date: existingEvent.date,
            description: existingEvent.description,
            allDay: existingEvent.allDay,
            startTime: existingEvent.startTime,
            endTime: existingEvent.endTime,
            recurrence: null, // Mark as deleted
            parentSeriesId: existingEvent.seriesId || existingEvent.id,
            createdBy: user.value.uid,
            createdByName: user.value.displayName || "Unknown",
            createdAt: serverTimestamp(),
          };
          await addDoc(collection(db, "calendarEvents"), exceptionData);
        } else {
          // Delete the document
          await deleteDoc(doc(db, "calendarEvents", id));
        }

        toast.success("Event removed from calendar");
      } catch (err) {
        console.error("Error deleting community event:", err);
        toast.error("Unable to remove event. Please try again.");
        throw err;
      }
    },

    /**
     * Update filter state
     */
    updateFilters(updates: Partial<CalendarFilters>) {
      this.filters = { ...this.filters, ...updates };
    },

    /**
     * Cleanup function to unsubscribe from all snapshot listeners
     */
    cleanup() {
      if (this.unsubscribeCommunityEvents) {
        this.unsubscribeCommunityEvents();
        this.unsubscribeCommunityEvents = null;
      }
      if (this.unsubscribeCareReminders) {
        this.unsubscribeCareReminders();
        this.unsubscribeCareReminders = null;
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
