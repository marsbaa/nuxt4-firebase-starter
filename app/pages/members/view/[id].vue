<script setup lang="ts">
import type { Member } from "~/composables/useMembers";
import { parseMemberName } from "~/composables/useMembers";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

// Composables
const route = useRoute();
const { members, fetchMembers } = useMembers();
const router = useRouter();

// State
const memberId = computed(() => route.params.id as string);
const member = ref<Member | null>(null);
const isLoading = ref(true);

// Computed properties
const parsedName = computed(() => {
  if (!member.value) return { firstName: "", lastName: "", fullName: "" };
  return parseMemberName(member.value.name);
});

// Load member data
onMounted(async () => {
  // Ensure members are fetched
  if (members.value.length === 0) {
    await fetchMembers();
  }

  // Find the member
  const foundMember = members.value.find((m) => m.id === memberId.value);
  if (!foundMember) {
    router.push("/members");
    return;
  }

  member.value = foundMember;
  isLoading.value = false;
});

// Methods
const handleBack = () => {
  router.push("/members");
};

const handleEditProfile = () => {
  // Navigate to edit page
  router.push(`/members/${memberId.value}`);
};

const handleSendMessage = () => {
  // Placeholder - will be implemented later
  console.log("Send Message clicked");
};
</script>

<template>
  <div class="member-detail-page">
    <!-- Back button -->
    <button
      @click="handleBack"
      class="back-button"
      aria-label="Back to Members List"
    >
      <Icon name="mdi:arrow-left" class="back-icon" aria-hidden="true" />
      <span>Back to Members List</span>
    </button>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading member details...</p>
    </div>

    <!-- Member Detail -->
    <template v-else-if="member">
      <!-- Page header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="member-name">{{ parsedName.fullName }}</h1>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Left Column: Personal Context -->
        <div class="left-column">
          <PersonalContext
            :member="member"
            @edit-profile="handleEditProfile"
            @send-message="handleSendMessage"
          />
        </div>

        <!-- Right Column: Care Space -->
        <div class="right-column">
          <CareSpace :member-id="memberId" :member-name="parsedName.fullName" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@600;700&family=Inter:wght@400;500;600&display=swap");

/* Page structure */
.member-detail-page {
  max-width: 90rem;
  margin: 0 auto;
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Back button */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #c2a47a;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.back-button:hover {
  opacity: 0.7;
}

.back-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e8e8e5;
  border-top-color: #c2a47a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #706c64;
}

/* Page header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.member-name {
  font-family: "Crimson Pro", serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2d2a26;
  margin: 0;
  letter-spacing: -0.02em;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 20rem 1fr;
  gap: 2.5rem;
  align-items: start;
}

/* Left Column */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
}

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: white;
  border: 1px solid #e7e5e4;
  border-radius: 0.75rem;
  padding: 2.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .left-column {
    order: 2;
  }

  .right-column {
    order: 1;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
