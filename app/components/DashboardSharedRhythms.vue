<script setup lang="ts">
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import type { CalendarEvent } from "~/types/calendarEvents";

const { db } = useFirebase();
const router = useRouter();

// State
const upcomingEvents = ref<CalendarEvent[]>([]);
const loading = ref(true);
const error = ref<Error | null>(null);

let unsubscribe: Unsubscribe | null = null;

/**
 * Format event date for display
 */
const formatEventDate = (date: Timestamp): string => {
  const eventDate = date.toDate();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const eventDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
  );

  // Check if today
  if (eventDay.getTime() === today.getTime()) {
    return "Today";
  }

  // Check if tomorrow
  if (eventDay.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }

  // Within a week - show day name and date
  const diffDays = Math.ceil(
    (eventDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays >= 0 && diffDays <= 7) {
    return eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  // Further out - show full date
  return eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: eventDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

/**
 * Get event type label for display
 */
const getEventTypeLabel = (event: CalendarEvent): string => {
  switch (event.type) {
    case "community-gathering":
      return "Gathering";
    case "member-milestone":
      return "Milestone";
    case "care-reminder":
      return "Care Reminder";
    case "liturgical-event":
      return "Observance";
    default:
      return "";
  }
};

/**
 * Navigate to Care Calendar page
 */
const goToCalendar = () => {
  router.push("/calendar");
};

/**
 * Subscribe to upcoming calendar events (next 3 within 7 days)
 */
const subscribe = () => {
  if (!db) {
    error.value = new Error("Firestore is not initialized");
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Get date range for next 7 days
    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    const startTimestamp = Timestamp.fromDate(now);
    const endTimestamp = Timestamp.fromDate(sevenDaysFromNow);

    // Query calendar events within next 7 days
    const eventsQuery = query(
      collection(db, "calendarEvents"),
      where("date", ">=", startTimestamp),
      where("date", "<=", endTimestamp),
      orderBy("date", "asc"),
      limit(3),
    );

    unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        upcomingEvents.value = snapshot.docs.map((doc) => {
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
          } as CalendarEvent;
        });

        loading.value = false;
        error.value = null;
      },
      (err) => {
        console.error("Error loading calendar events:", err);
        error.value = err as Error;
        loading.value = false;
      },
    );
  } catch (err) {
    console.error("Error setting up calendar events listener:", err);
    error.value = err as Error;
    loading.value = false;
  }
};

const cleanup = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
};

onMounted(() => {
  subscribe();
});

onUnmounted(() => {
  cleanup();
});
</script>

<template>
  <div class="dashboard-shared-rhythms">
    <!-- Section header -->
    <div class="section-header">
      <h2 class="section-title">Coming together</h2>
      <p class="section-description">
        Shared moments in the life of our community
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="empty-state">
      <p class="empty-text">Loading upcoming events...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="empty-state">
      <p class="empty-text">Unable to load events</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="upcomingEvents.length === 0" class="empty-state">
      <p class="empty-text">No upcoming events in the next week</p>
      <p class="empty-hint">
        Community gatherings and milestones will appear here
      </p>
    </div>

    <!-- Events list -->
    <div v-else class="events-container">
      <div class="events-list">
        <div v-for="event in upcomingEvents" :key="event.id" class="event-item">
          <div class="event-content">
            <div class="event-header">
              <span class="event-title">{{ event.title }}</span>
              <span class="event-type">{{ getEventTypeLabel(event) }}</span>
            </div>
            <p v-if="event.description" class="event-description">
              {{ event.description }}
            </p>
            <span class="event-date">{{ formatEventDate(event.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Link to full calendar -->
      <div class="calendar-link">
        <button @click="goToCalendar" class="view-calendar-btn" type="button">
          View full calendar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-shared-rhythms {
  width: 100%;
  padding: 3rem 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #2d2a26;
  letter-spacing: 0.01em;
  margin-bottom: 0.75rem;
}

@media (min-width: 640px) {
  .section-title {
    font-size: 1.75rem;
  }
}

.section-description {
  font-size: 0.9375rem;
  color: #706c64;
  line-height: 1.625;
}

@media (min-width: 640px) {
  .section-description {
    font-size: 1rem;
  }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #9c8b7a;
}

.empty-text {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #706c64;
  margin-bottom: 0.5rem;
}

.empty-hint {
  font-size: 0.875rem;
  color: #9c8b7a;
  line-height: 1.625;
}

/* Events container */
.events-container {
  max-width: 48rem;
  margin: 0 auto;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.event-item {
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 0.75rem;
}

.event-content {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.event-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.event-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #2d2a26;
}

.event-type {
  font-size: 0.75rem;
  color: #9c8b7a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  flex-shrink: 0;
}

.event-description {
  font-size: 0.875rem;
  color: #706c64;
  line-height: 1.625;
  margin: 0;
}

.event-date {
  font-size: 0.8125rem;
  color: #9c8b7a;
}

/* Calendar link */
.calendar-link {
  text-align: center;
}

.view-calendar-btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #706c64;
  background: transparent;
  border: 1px solid #e8e8e5;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-calendar-btn:hover {
  border-color: #c2a47a;
  color: #2d2a26;
  background: #fafaf8;
}

.view-calendar-btn:focus {
  outline: none;
  border-color: #7a9b76;
  box-shadow: 0 0 0 3px rgba(122, 155, 118, 0.1);
}
</style>
