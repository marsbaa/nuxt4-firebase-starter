<script setup lang="ts">
import type { Member } from "~/composables/useMembers";
import {
  parseMemberName,
  calculateAge,
  getMemberInitials,
} from "~/composables/useMembers";

const props = defineProps<{
  member: Member;
}>();

const emit = defineEmits<{
  "edit-profile": [];
  "send-message": [];
}>();

// Computed properties
const parsedName = computed(() => parseMemberName(props.member.name));

const initials = computed(() => getMemberInitials(props.member.name));

const age = computed(() => {
  if (!props.member.birthday) return null;
  return calculateAge(props.member.birthday);
});

const formattedBirthday = computed(() => {
  if (!props.member.birthday) return "";
  const date = new Date(props.member.birthday);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

const formattedJoiningDate = computed(() => {
  if (!props.member.memberSince) return "";
  const date = new Date(props.member.memberSince);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});
</script>

<template>
  <div
    class="personal-context"
    role="complementary"
    aria-label="Personal Journey"
  >
    <!-- Profile Section -->
    <div class="profile-section">
      <!-- Avatar -->
      <MemberAvatar :name="member.name" size="lg" class="profile-avatar" />

      <!-- Name -->
      <h2 class="member-name">{{ parsedName.fullName }}</h2>

      <!-- Member Since -->
      <p v-if="formattedJoiningDate" class="member-since">
        Covenanting with us <br />
        since {{ formattedJoiningDate }}
      </p>
    </div>

    <!-- Divider -->
    <div class="context-divider"></div>

    <!-- Contact Details Section (no heading per design) -->
    <div class="context-section">
      <div class="context-items">
        <div class="context-item">
          <AppIcon name="heroicons:envelope" class="item-icon" />
          <span class="item-text">{{ member.email || "No email" }}</span>
        </div>

        <div class="context-item">
          <AppIcon name="heroicons:phone" class="item-icon" />
          <span class="item-text">{{ member.contact || "No contact" }}</span>
        </div>

        <div class="context-item">
          <AppIcon name="heroicons:map-pin" class="item-icon" />
          <span class="item-text">{{ member.suburb }}</span>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="context-divider"></div>

    <!-- Care Intentions Section -->
    <div class="context-section">
      <h3 class="section-heading">Care Intentions</h3>

      <div class="action-buttons">
        <button class="care-action-button" @click="emit('edit-profile')">
          <AppIcon name="heroicons:pencil" class="action-icon" />
          <span>Update her story</span>
        </button>

        <button class="care-action-button" @click="emit('send-message')">
          <AppIcon name="heroicons:chat-bubble-left" class="action-icon" />
          <span>Reach out with a word</span>
        </button>
      </div>
    </div>

    <!-- Divider -->
    <div class="context-divider"></div>

    <!-- Personal Journey Section -->
    <div class="context-section">
      <h3 class="section-heading">Personal Journey</h3>

      <div class="context-items">
        <!-- Date of Birth & Age -->
        <div v-if="formattedBirthday" class="journey-item">
          <div class="journey-label">Day of Birth</div>
          <div class="journey-value">
            <AppIcon name="heroicons:cake" class="value-icon" />
            <span>{{ formattedBirthday }}</span>
            <span v-if="age" class="age-badge">({{ age }} years)</span>
          </div>
        </div>

        <!-- Season of Life (placeholder - not in Member type yet) -->
        <div class="journey-item">
          <div class="journey-label">Season of Life</div>
          <div class="journey-value">
            <span class="placeholder-text">Not specified</span>
          </div>
        </div>

        <!-- Circle of Fellowship (placeholder - not in Member type yet) -->
        <div class="journey-item">
          <div class="journey-label">Circle of Fellowship</div>
          <div class="journey-value">
            <span class="placeholder-text">Not specified</span>
          </div>
        </div>

        <!-- In Case of Need (placeholder - not in Member type yet) -->
        <div class="journey-item">
          <div class="journey-label">In Case of Need</div>
          <div class="journey-value">
            <span class="placeholder-text">Not specified</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.personal-context {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: #fafaf9;
  border: 1px solid #f5f4f2;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.03);
}

/* Profile Section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.profile-avatar {
  margin-bottom: 0.5rem;
}

.member-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #292524;
  margin: 0;
  letter-spacing: -0.025em;
}

.member-since {
  font-size: 0.7rem;
  color: #877e78;
  margin: 0;
  font-style: italic;
}

/* Context Divider */
.context-divider {
  height: 1px;
  background-color: #e7e5e4;
  margin: 0.5rem 0;
}

/* Context Section */
.context-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-heading {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #a8a29e;
  margin: 0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Context Items (Contact) */
.context-items {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0;
}

.item-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #a8a29e;
  flex-shrink: 0;
}

.item-text {
  font-size: 0.875rem;
  color: #292524;
  word-break: break-word;
}

/* Journey Items (Personal Journey) */
.journey-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.journey-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #78716c;
  letter-spacing: 0.025em;
}

.journey-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: #292524;
}

.value-icon {
  width: 1rem;
  height: 1rem;
  color: #a8a29e;
}

.age-badge {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #57534e;
  background-color: #f5f4f2;
  border-radius: 0.25rem;
}

.placeholder-text {
  font-size: 0.875rem;
  color: #a8a29e;
  font-style: italic;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.care-action-button {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0;
  background: #ffffff;
  border: none;
  font-size: 0.875rem;
  color: #57534e;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s ease;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #fcfcfc;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.03);
}

.care-action-button:hover {
  color: #292524;
}

.action-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #a8a29e;
  flex-shrink: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .personal-context {
    padding: 1.5rem;
    gap: 1.25rem;
  }

  .member-name {
    font-size: 1.375rem;
  }

  .profile-section {
    gap: 0.5rem;
  }
}

/* Smooth transitions */
.personal-context * {
  transition: all 0.15s ease;
}
</style>
