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
const membersStore = useMembersStore();
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
  return membersStore.members.find((m) => m.id === memberId);
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

onMounted(async () => {
  // Fetch members list first if not loaded
  if (membersStore.members.length === 0) {
    await membersStore.fetchMembers();
  }
  // Then subscribe to reminders
  subscribe();
});

onUnmounted(() => {
  cleanup();
});
</script>

<template>
  <!-- Only show if there are reminders -->
  <div
    v-if="!loading && !error && reminders.length > 0"
    class="dashboard-holding-in-mind"
  >
    <!-- Section header - very minimal -->
    <div class="section-header">
      <h2 class="section-title">Holding in mind</h2>
    </div>

    <!-- Reminders grid -->
    <div class="reminders-grid">
      <button
        v-for="reminder in reminders"
        :key="reminder.id"
        @click="goToMemberCareSpace(reminder.memberId)"
        class="reminder-card"
        type="button"
      >
        <h3 class="member-name">
          {{
            getMemberForReminder(reminder.memberId)?.name
              ? parseMemberName(getMemberForReminder(reminder.memberId)!.name)
                  .fullName
              : "Unknown"
          }}
        </h3>
        <p class="reminder-text">{{ reminder.text }}</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&display=swap");

.dashboard-holding-in-mind {
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

/* Reminders grid - auto-fit columns, always centered */
.reminders-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 56rem;
  margin: 0 auto;
  justify-content: center;
}

@media (min-width: 640px) {
  .reminders-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .reminders-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 280px));
    gap: 3rem;
  }
}

.reminder-card {
  background: transparent;
  border: 1px solid #e8e6e1;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reminder-card:hover {
  border-color: #d9bc9b;
}

.reminder-card:hover .member-name {
  color: #2d2a26;
}

.reminder-card:focus {
  outline: none;
  border-color: #c2a47a;
}

.reminder-card:focus .member-name {
  text-decoration: underline;
  text-decoration-color: #c2a47a;
  text-underline-offset: 4px;
}

.member-name {
  font-family: "Inter", sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #3d3a34;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.reminder-text {
  font-family: "Cormorant Garamond", serif;
  font-size: 0.9375rem;
  font-style: italic;
  color: #706c64;
  line-height: 1.6;
  margin: 0;
}

@media (min-width: 640px) {
  .dashboard-holding-in-mind {
    padding: 4rem 2rem 5rem;
  }

  .member-name {
    font-size: 1rem;
  }

  .reminder-text {
    font-size: 1rem;
  }
}
</style>
