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
  <!-- Only show if there are events -->
  <div
    v-if="!loading && !error && upcomingEvents.length > 0"
    class="dashboard-shared-rhythms"
  >
    <!-- Section header - minimal -->
    <div class="section-header">
      <h2 class="section-title">Shared Rhythms</h2>
    </div>

    <!-- Events list -->
    <div class="events-container">
      <div class="events-list">
        <div v-for="event in upcomingEvents" :key="event.id" class="event-item">
          <div class="event-main">
            <h3 class="event-title">{{ event.title }}</h3>
            <p v-if="event.description" class="event-subtitle">
              {{ event.description }}
            </p>
          </div>
          <div class="event-date">{{ formatEventDate(event.date) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&display=swap");

.dashboard-shared-rhythms {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
  background: transparent;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-family: "Cormorant Garamond", serif;
  font-size: 1.375rem;
  font-weight: 400;
  color: #706c64;
  letter-spacing: 0.02em;
}

@media (min-width: 640px) {
  .section-title {
    font-size: 1.5rem;
  }
}

/* Events container */
.events-container {
  max-width: 42rem;
  margin: 0 auto;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 0;
  background: transparent;
  border: none;
}

.event-main {
  flex: 1;
}

.event-title {
  font-family: "Inter", sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #3d3a34;
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.event-subtitle {
  font-family: "Inter", sans-serif;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #9c8b7a;
  margin: 0;
  line-height: 1.5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-date {
  font-family: "Cormorant Garamond", serif;
  font-size: 0.9375rem;
  font-style: italic;
  color: #706c64;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1.4;
}

@media (min-width: 640px) {
  .dashboard-shared-rhythms {
    padding: 4rem 2rem 5rem;
  }

  .events-list {
    gap: 2.5rem;
  }

  .event-title {
    font-size: 1rem;
  }

  .event-subtitle {
    font-size: 0.875rem;
  }

  .event-date {
    font-size: 1rem;
  }
}
</style>
