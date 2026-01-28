<script setup lang="ts">
import type { Member } from "~/composables/useMembers";
import { parseMemberName } from "~/composables/useMembers";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

// Composables
const route = useRoute();
const { members, updateMember, fetchMembers } = useMembers();
const { user } = useFirebase();
const router = useRouter();

// State
const memberId = computed(() => route.params.id as string);
const member = ref<Member | null>(null);
const isLoading = ref(true);

// Form state
const formData = ref({
  name: "",
  email: "",
  contact: "",
  birthday: "",
  suburb: "",
  memberSince: "",
  profilePhoto: null as File | null,
});

const isSubmitting = ref(false);
const errors = ref<Record<string, string>>({});

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

  // Parse name back to display format
  const parsed = parseMemberName(foundMember.name);

  // Initialize form with member data
  const birthdayDate = foundMember.birthday
    ? foundMember.birthday.split("T")[0]
    : "";
  const memberSinceDate = foundMember.memberSince
    ? foundMember.memberSince.split("T")[0]
    : "";

  formData.value = {
    name: parsed.fullName,
    email: foundMember.email,
    contact: foundMember.contact,
    birthday: birthdayDate || "", // Handle both "YYYY-MM-DD" and ISO timestamp
    suburb: foundMember.suburb,
    memberSince: memberSinceDate || "",
    profilePhoto: null,
  };

  isLoading.value = false;
});

// Methods
const handleBack = () => {
  router.push("/members");
};

const validateForm = (): boolean => {
  errors.value = {};

  // Full name is required
  if (!formData.value.name.trim()) {
    errors.value.name = "Full name is required";
  }

  // Birthday is required
  if (!formData.value.birthday) {
    errors.value.birthday = "Date of birth is required";
  }

  // Location is required
  if (!formData.value.suburb.trim()) {
    errors.value.suburb = "Location is required";
  }

  return Object.keys(errors.value).length === 0;
};

const formatNameForDatabase = (fullName: string): string => {
  // Convert "Sandra Auterson" or "sandra auterson" to "AUTERSON, SANDRA"
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) {
    // If only one name provided, use it as is
    return fullName.toUpperCase();
  }

  // Last name is the last part, first name is everything else
  const lastName = parts[parts.length - 1] || "";
  const firstName = parts.slice(0, -1).join(" ");

  return `${lastName.toUpperCase()}, ${firstName.toUpperCase()}`;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const memberData: Partial<Omit<Member, "id" | "createdAt" | "createdBy">> =
      {
        name: formatNameForDatabase(formData.value.name),
        email: formData.value.email.trim(),
        contact: formData.value.contact.trim(),
        birthday: formData.value.birthday,
        suburb: formData.value.suburb.trim(),
        memberSince: formData.value.memberSince || "",
      };

    const result = await updateMember(memberId.value, memberData);

    if (result.success) {
      // Navigate back to members list
      router.push("/members");
    }
  } catch (error) {
    console.error("Error updating member:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push("/members");
};

const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0 && target.files[0]) {
    formData.value.profilePhoto = target.files[0];
  }
};

const removePhoto = () => {
  formData.value.profilePhoto = null;
};
</script>

<template>
  <div class="edit-member-page">
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

    <!-- Form -->
    <template v-else>
      <!-- Page header -->
      <div class="page-header">
        <h1 class="page-title">Edit Member</h1>
        <p class="page-subtitle">
          Update the details for {{ formData.name }} in your pastoral care
          community.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="member-form">
        <!-- Profile Photo Section -->
        <div class="form-section">
          <div class="photo-section">
            <div class="photo-preview">
              <Icon name="mdi:account-outline" class="photo-placeholder-icon" />
              <div v-if="formData.profilePhoto" class="photo-badge">
                <Icon name="mdi:camera" />
              </div>
            </div>
            <div class="photo-info">
              <h3 class="photo-title">Profile Photo</h3>
              <p class="photo-description">
                Upload a photo or use the default initials avatar. Min
                200×200px.
              </p>
              <div class="photo-actions">
                <label class="upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    @change="handlePhotoUpload"
                    class="photo-input"
                  />
                  Upload Image
                </label>
                <button
                  v-if="formData.profilePhoto"
                  @click="removePhoto"
                  type="button"
                  class="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Full Name -->
        <div class="form-group">
          <label for="name" class="form-label">Full Name</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="e.g. Sandra Auterson"
            class="form-input"
            :class="{ 'input-error': errors.name }"
          />
          <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
        </div>

        <!-- Email and Phone -->
        <div class="form-row">
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="sandra@example.com"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="contact" class="form-label">Phone Number</label>
            <input
              id="contact"
              v-model="formData.contact"
              type="tel"
              placeholder="+61 400 000 000"
              class="form-input"
            />
          </div>
        </div>

        <!-- Date of Birth and Location -->
        <div class="form-row">
          <div class="form-group">
            <label for="birthday" class="form-label">Date of Birth</label>
            <div class="date-input-wrapper">
              <Icon name="mdi:calendar" class="input-icon" />
              <input
                id="birthday"
                v-model="formData.birthday"
                type="date"
                class="form-input date-input"
                :class="{ 'input-error': errors.birthday }"
              />
            </div>
            <p v-if="errors.birthday" class="error-message">
              {{ errors.birthday }}
            </p>
          </div>
          <div class="form-group">
            <label for="suburb" class="form-label">Location</label>
            <div class="location-input-wrapper">
              <Icon name="mdi:map-marker-outline" class="input-icon" />
              <input
                id="suburb"
                v-model="formData.suburb"
                type="text"
                placeholder="Suburban Area"
                class="form-input location-input"
                :class="{ 'input-error': errors.suburb }"
              />
            </div>
            <p v-if="errors.suburb" class="error-message">
              {{ errors.suburb }}
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <AppButton @click="handleCancel" type="button" variant="secondary">
            Cancel
          </AppButton>
          <AppButton type="submit" variant="primary" :disabled="isSubmitting">
            <Icon
              v-if="!isSubmitting"
              name="mdi:content-save"
              class="btn-icon"
            />
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Save Changes</span>
          </AppButton>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@600;700&family=Inter:wght@400;500;600&display=swap");

/* Page structure */
.edit-member-page {
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
  margin-bottom: 2rem;
}

.page-title {
  font-family: "Crimson Pro", serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2d2a26;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #706c64;
  margin: 0;
  line-height: 1.6;
}

/* Form */
.member-form {
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(44, 44, 42, 0.05);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e8e8e5;
}

/* Photo section */
.photo-section {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.photo-preview {
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: #f5f4f2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.photo-placeholder-icon {
  width: 3rem;
  height: 3rem;
  color: #c2a47a;
}

.photo-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #c2a47a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border: 3px solid #ffffff;
}

.photo-info {
  flex: 1;
}

.photo-title {
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.375rem 0;
}

.photo-description {
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: #706c64;
  margin: 0 0 1rem 0;
}

.photo-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.photo-input {
  display: none;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #c2a47a;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-button:hover {
  background: #f9f8f6;
  border-color: #c2a47a;
}

.remove-button {
  padding: 0.625rem 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #706c64;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-button:hover {
  background: #f9f8f6;
  color: #dc2626;
  border-color: #dc2626;
}

/* Form groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d2a26;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #2d2a26;
  background: #f9f8f6;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.form-input::placeholder {
  color: #9a9690;
}

.form-input:focus {
  outline: none;
  background: #ffffff;
  border-color: #c2a47a;
  box-shadow: 0 0 0 3px rgba(194, 164, 122, 0.1);
}

.input-error {
  border-color: #dc2626 !important;
}

/* Date and location inputs with icons */
.date-input-wrapper,
.location-input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9a9690;
  pointer-events: none;
}

.date-input,
.location-input {
  padding-left: 3rem;
}

/* Textarea */
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #2d2a26;
  background: #f9f8f6;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  resize: vertical;
}

.form-textarea::placeholder {
  color: #9a9690;
}

.form-textarea:focus {
  outline: none;
  background: #ffffff;
  border-color: #c2a47a;
  box-shadow: 0 0 0 3px rgba(194, 164, 122, 0.1);
}

.form-help-text {
  margin-top: 0.5rem;
  font-family: "Inter", sans-serif;
  font-size: 0.813rem;
  color: #706c64;
  font-style: italic;
}

.error-message {
  margin-top: 0.375rem;
  font-family: "Inter", sans-serif;
  font-size: 0.813rem;
  color: #dc2626;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e8e8e5;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .member-form {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .photo-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .photo-actions {
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
