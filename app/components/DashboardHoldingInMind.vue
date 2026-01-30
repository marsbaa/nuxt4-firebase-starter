<script setup lang="ts">
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import type { CareReminder } from "~/types/careReminders";
import type { Member } from "~/composables/useMembers";

const { db } = useFirebase();
const { members } = useMembers();
const router = useRouter();

// State
const reminders = ref<CareReminder[]>([]);
const loading = ref(true);
const error = ref<Error | null>(null);

let unsubscribe: Unsubscribe | null = null;

/**
 * Check if a reminder is expired based on its due date
 */
const isReminderExpired = (dueDate: Timestamp | null): boolean => {
  if (!dueDate) return false;

  const due = dueDate.toDate();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  return dueDay < today;
};

/**
 * Get member details for a reminder
 */
const getMemberForReminder = (memberId: string): Member | undefined => {
  return members.value.find((m) => m.id === memberId);
};

/**
 * Format due date for display
 */
const formatDueDate = (dueDate: Timestamp | null): string => {
  if (!dueDate) return "";

  const date = dueDate.toDate();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Check if today
  if (dueDay.getTime() === today.getTime()) {
    return "Today";
  }

  // Check if tomorrow
  if (dueDay.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }

  // Within a week - show day name
  const diffDays = Math.ceil(
    (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays >= 0 && diffDays <= 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  // Further out - show date
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/**
 * Navigate to member's Care Space
 */
const goToMemberCareSpace = (memberId: string) => {
  router.push(`/members/view/${memberId}`);
};

/**
 * Subscribe to upcoming care reminders (next 5, ordered by date)
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
    // Query care reminders ordered by dueDate, limited to 10 (we'll filter client-side)
    const careRemindersQuery = query(
      collection(db, "careReminders"),
      orderBy("dueDate", "asc"),
      limit(10),
    );

    unsubscribe = onSnapshot(
      careRemindersQuery,
      (snapshot) => {
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
            isExpired: isReminderExpired(data.dueDate),
          } as CareReminder;
        });

        // Filter out expired reminders and limit to 5
        const activeReminders = allReminders
          .filter((r) => !r.isExpired)
          .slice(0, 5);

        reminders.value = activeReminders;
        loading.value = false;
        error.value = null;
      },
      (err) => {
        console.error("Error loading care reminders:", err);
        error.value = err as Error;
        loading.value = false;
      },
    );
  } catch (err) {
    console.error("Error setting up care reminders listener:", err);
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
  <div class="dashboard-holding-in-mind">
    <!-- Section header -->
    <div class="section-header">
      <h2 class="section-title">Holding in mind</h2>
      <p class="section-description">People you've intended to care for soon</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="empty-state">
      <p class="empty-text">Loading care reminders...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="empty-state">
      <p class="empty-text">Unable to load reminders</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="reminders.length === 0" class="empty-state">
      <p class="empty-text">This space is ready when you are</p>
      <p class="empty-hint">
        Care reminders you create will appear here as gentle prompts
      </p>
    </div>

    <!-- Reminders list -->
    <div v-else class="reminders-list">
      <button
        v-for="reminder in reminders"
        :key="reminder.id"
        @click="goToMemberCareSpace(reminder.memberId)"
        class="reminder-item"
        type="button"
      >
        <div class="reminder-content">
          <div class="reminder-header">
            <span class="member-name">
              {{
                getMemberForReminder(reminder.memberId)?.name
                  ? parseMemberName(
                      getMemberForReminder(reminder.memberId)!.name,
                    ).fullName
                  : "Unknown"
              }}
            </span>
            <span v-if="reminder.dueDate" class="reminder-date">
              {{ formatDueDate(reminder.dueDate) }}
            </span>
          </div>
          <p class="reminder-text">{{ reminder.text }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.dashboard-holding-in-mind {
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

/* Reminders list */
.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 48rem;
  margin: 0 auto;
}

.reminder-item {
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 0.75rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reminder-item:hover {
  border-color: #c2a47a;
  box-shadow: 0 2px 8px rgba(44, 44, 42, 0.08);
  transform: translateY(-1px);
}

.reminder-item:focus {
  outline: none;
  border-color: #7a9b76;
  box-shadow: 0 0 0 3px rgba(122, 155, 118, 0.1);
}

.reminder-content {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.reminder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.member-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #2d2a26;
}

.reminder-date {
  font-size: 0.8125rem;
  color: #9c8b7a;
  white-space: nowrap;
  flex-shrink: 0;
}

.reminder-text {
  font-size: 0.875rem;
  color: #706c64;
  line-height: 1.625;
  margin: 0;
}
</style>
