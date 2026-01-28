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

const age = computed(() => {
  if (!member.value?.birthday) return null;
  const birthDate = new Date(member.value.birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

const formattedBirthday = computed(() => {
  if (!member.value?.birthday) return "";
  const date = new Date(member.value.birthday);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

const formattedJoiningDate = computed(() => {
  if (!member.value?.memberSince) return "";
  const date = new Date(member.value.memberSince);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

const handleExportPDF = () => {
  // Placeholder - will be implemented later
  console.log("Export PDF clicked");
};

const handleEditProfile = () => {
  // Navigate to edit page
  router.push(`/members/${memberId.value}`);
};

const handleSendMessage = () => {
  // Placeholder - will be implemented later
  console.log("Send Message clicked");
};

const handleAddNote = () => {
  // Placeholder - will be implemented later
  console.log("Add Note clicked");
};

// Placeholder notes data
const placeholderNotes = [
  {
    id: "1",
    date: "OCT 12, 2023",
    author: "Ray Yee",
    content:
      "Visited Sandra at home today. She mentioned she's recovering well from her knee surgery but would appreciate continued prayer for mobility. She remains in high spirits.",
    avatar: "R",
  },
  {
    id: "2",
    date: "SEP 28, 2023",
    author: "Admin",
    content:
      "Requested meal train support for next week while her family is out of town. Coordination handled by the community team.",
    avatar: "A",
  },
];
</script>

<template>
  <div class="member-detail-page">
    <!-- Back button -->
    <button @click="handleBack" class="back-button">
      <Icon name="mdi:arrow-left" class="back-icon" />
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
        <div class="header-left">
          <h1 class="member-name">{{ parsedName.fullName }}</h1>
          <span class="member-status">ACTIVE MEMBER</span>
        </div>
        <button @click="handleExportPDF" class="export-button">
          <Icon name="mdi:printer" class="button-icon" />
          Export PDF
        </button>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Left Column -->
        <div class="left-column">
          <!-- Profile Card -->
          <div class="profile-card">
            <div class="profile-avatar">
              <div class="avatar-circle">
                {{
                  parsedName.firstName.charAt(0) + parsedName.lastName.charAt(0)
                }}
              </div>
              <div class="avatar-status"></div>
            </div>
            <div class="profile-info">
              <div class="info-item">
                <Icon name="mdi:email-outline" class="info-icon" />
                <span class="info-text">{{ member.email || "No email" }}</span>
              </div>
              <div class="info-item">
                <Icon name="mdi:phone" class="info-icon" />
                <span class="info-text">{{
                  member.contact || "No contact"
                }}</span>
              </div>
              <div class="info-item">
                <Icon name="mdi:map-marker-outline" class="info-icon" />
                <span class="info-text">{{ member.suburb }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions-card">
            <h3 class="section-title">Quick Actions</h3>
            <div class="action-buttons">
              <button @click="handleEditProfile" class="action-button primary">
                <Icon name="mdi:pencil-outline" class="action-icon" />
                Edit Profile
              </button>
              <button @click="handleSendMessage" class="action-button">
                <Icon name="mdi:message-outline" class="action-icon" />
                Send Message
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="right-column">
          <!-- Pastoral Notes -->
          <div class="pastoral-notes-card">
            <div class="notes-header">
              <h2 class="notes-title">Pastoral Notes</h2>
              <button @click="handleAddNote" class="add-note-button">
                + Add Note
              </button>
            </div>

            <div class="notes-list">
              <div
                v-for="note in placeholderNotes"
                :key="note.id"
                class="note-item"
              >
                <div class="note-avatar-container">
                  <div class="note-avatar">{{ note.avatar }}</div>
                </div>
                <div class="note-content">
                  <div class="note-header-row">
                    <span class="note-date">{{ note.date }}</span>
                    <span class="note-author">By {{ note.author }}</span>
                  </div>
                  <p class="note-text">{{ note.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Member Information -->
          <div class="member-info-card">
            <h2 class="info-card-title">Member Information</h2>

            <div class="info-grid">
              <div class="info-section">
                <h3 class="info-label">DATE OF BIRTH</h3>
                <div class="info-value">
                  <Icon name="mdi:cake-variant-outline" class="value-icon" />
                  <span>{{ formattedBirthday }} ({{ age }} years old)</span>
                </div>
              </div>

              <div class="info-section">
                <h3 class="info-label">JOINING DATE</h3>
                <div class="info-value">
                  <Icon name="mdi:calendar-outline" class="value-icon" />
                  <span>{{ formattedJoiningDate }}</span>
                </div>
              </div>

              <div class="info-section">
                <h3 class="info-label">MARITAL STATUS</h3>
                <div class="info-value">
                  <span>Married</span>
                </div>
              </div>

              <div class="info-section">
                <h3 class="info-label">SMALL GROUP</h3>
                <div class="info-value">
                  <span>North Side Fellowship</span>
                </div>
              </div>

              <div class="info-section full-width">
                <h3 class="info-label">EMERGENCY CONTACT</h3>
                <div class="info-value">
                  <span>David Auterson (Husband) - +61 400 999 888</span>
                </div>
              </div>
            </div>
          </div>
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

.header-left {
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

.member-status {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2d2a26;
  background: #f5f4f2;
  border-radius: 0.375rem;
  letter-spacing: 0.05em;
}

.export-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  font-weight: 500;
  color: #2d2a26;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-button:hover {
  background: #f9f8f6;
  border-color: #c2a47a;
  color: #c2a47a;
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 20rem 1fr;
  gap: 2rem;
  align-items: start;
}

/* Left Column */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card {
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(44, 44, 42, 0.05);
  text-align: center;
}

.profile-avatar {
  position: relative;
  margin: 0 auto 1.5rem;
  width: 7.5rem;
  height: 7.5rem;
}

.avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #e8ddd0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #c2a47a;
  text-transform: uppercase;
}

.avatar-status {
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: #4ade80;
  border: 3px solid #ffffff;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9f8f6;
  border-radius: 0.5rem;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #c2a47a;
  flex-shrink: 0;
}

.info-text {
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: #2d2a26;
  text-align: left;
  word-break: break-word;
}

/* Quick Actions */
.quick-actions-card {
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(44, 44, 42, 0.05);
}

.section-title {
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 1rem 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d2a26;
  background: #f9f8f6;
  border: 1px solid #e8e8e5;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: #f5f4f2;
  border-color: #c2a47a;
}

.action-button.primary {
  background: #c2a47a;
  color: #ffffff;
  border-color: #c2a47a;
}

.action-button.primary:hover {
  opacity: 0.9;
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Pastoral Notes */
.pastoral-notes-card {
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(44, 44, 42, 0.05);
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.notes-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d2a26;
  margin: 0;
  letter-spacing: -0.01em;
}

.add-note-button {
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #c2a47a;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.add-note-button:hover {
  opacity: 0.7;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.note-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e8e8e5;
}

.note-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.note-avatar-container {
  flex-shrink: 0;
}

.note-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #f5f4f2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #c2a47a;
}

.note-content {
  flex: 1;
}

.note-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.note-date {
  font-family: "Inter", sans-serif;
  font-size: 0.813rem;
  font-weight: 600;
  color: #2d2a26;
  letter-spacing: 0.05em;
}

.note-author {
  font-family: "Inter", sans-serif;
  font-size: 0.813rem;
  color: #706c64;
}

.note-text {
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #2d2a26;
  line-height: 1.6;
  margin: 0;
}

/* Member Information */
.member-info-card {
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(44, 44, 42, 0.05);
}

.info-card-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d2a26;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.01em;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-section.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-family: "Inter", sans-serif;
  font-size: 0.688rem;
  font-weight: 600;
  color: #706c64;
  margin: 0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.info-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #2d2a26;
}

.value-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #c2a47a;
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

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .export-button {
    width: 100%;
    justify-content: center;
  }

  .pastoral-notes-card,
  .member-info-card {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .notes-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .note-item {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
