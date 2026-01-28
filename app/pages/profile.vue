<script setup lang="ts">
// Use authentication middleware to protect this route
definePageMeta({
  middleware: ["auth"],
});

const { user } = useAuth();
const {
  profile,
  isLoading,
  error,
  getUserInitials,
  fetchProfile,
  updateUserProfile,
  clearError,
} = useProfile();

// Edit mode state
const isEditMode = ref(false);
const displayName = ref("");
const successMessage = ref<string | null>(null);
const validationError = ref<string | null>(null);

// Fetch profile on mount
onMounted(async () => {
  if (user.value?.uid) {
    await fetchProfile(user.value.uid);
    if (profile.value) {
      displayName.value = profile.value.displayName || "";
    }
  }
});

// Watch for user changes
watch(user, async (newUser) => {
  if (newUser?.uid) {
    await fetchProfile(newUser.uid);
    if (profile.value) {
      displayName.value = profile.value.displayName || "";
    }
  }
});

// Toggle edit mode
const toggleEditMode = () => {
  if (isEditMode.value) {
    // Cancel editing - reset form
    displayName.value = profile.value?.displayName || "";
    validationError.value = null;
    clearError();
  }
  isEditMode.value = !isEditMode.value;
  successMessage.value = null;
};

// Handle profile update
const handleUpdateProfile = async () => {
  validationError.value = null;
  clearError();
  successMessage.value = null;

  // Validate display name
  if (!displayName.value.trim()) {
    validationError.value = "Display name cannot be empty";
    return;
  }

  if (displayName.value.length > 50) {
    validationError.value = "Display name must be less than 50 characters";
    return;
  }

  const result = await updateUserProfile({
    displayName: displayName.value.trim(),
  });

  if (result.success) {
    isEditMode.value = false;
    successMessage.value = "Profile updated successfully!";

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
  }
};

// Clear validation error when user types
watch(displayName, () => {
  validationError.value = null;
  clearError();
});

// Get user initials
const userInitials = computed(() => {
  if (user.value?.email) {
    return getUserInitials(
      profile.value?.displayName || user.value?.displayName || "",
      user.value.email,
    );
  }
  return "U";
});
</script>

<template>
  <div class="page-container">
    <div class="page-content">
      <header class="page-header">
        <NuxtLink to="/dashboard" class="back-link">
          <Icon name="mdi:arrow-left" class="back-icon" />
          Back to Dashboard
        </NuxtLink>
        <h1 class="page-title">Profile</h1>
      </header>

      <div v-if="isLoading" class="loading-container">
        <Icon name="mdi:loading" class="loading-icon animate-spin" />
        <p class="loading-text">Loading profile...</p>
      </div>

      <div v-else class="content-card">
        <!-- Avatar -->
        <div class="avatar-container">
          <div class="avatar">{{ userInitials }}</div>
        </div>

        <!-- Success message -->
        <transition name="error-slide">
          <div v-if="successMessage" class="alert-success">
            <Icon name="mdi:check-circle-outline" class="alert-icon" />
            <p>{{ successMessage }}</p>
          </div>
        </transition>

        <!-- Error message -->
        <transition name="error-slide">
          <div v-if="error" class="alert-error">
            <Icon name="mdi:alert-circle-outline" class="alert-icon" />
            <p>{{ error }}</p>
          </div>
        </transition>

        <!-- Profile Information / Edit Form -->
        <div v-if="!isEditMode" class="profile-info">
          <div class="info-group">
            <label class="info-label">Display Name</label>
            <p class="info-value">
              {{ profile?.displayName || user?.displayName || "Not set" }}
            </p>
          </div>

          <div class="info-group">
            <label class="info-label">Email</label>
            <p class="info-value">{{ user?.email || "Not available" }}</p>
          </div>

          <div class="info-group">
            <label class="info-label">User ID</label>
            <p class="info-value mono">{{ user?.uid || "Not available" }}</p>
          </div>
        </div>

        <!-- Edit Form -->
        <form v-else @submit.prevent="handleUpdateProfile" class="edit-form">
          <div class="form-group">
            <label for="displayName" class="form-label">Display Name</label>
            <div class="input-wrapper">
              <Icon name="mdi:account-outline" class="input-icon" />
              <input
                id="displayName"
                v-model="displayName"
                type="text"
                class="form-input"
                :class="{ 'input-error': validationError }"
                placeholder="Enter your display name"
                maxlength="50"
              />
            </div>
            <transition name="error-slide">
              <p v-if="validationError" class="error-message">
                {{ validationError }}
              </p>
            </transition>
          </div>

          <div class="form-group">
            <label class="info-label">Email</label>
            <p class="info-value-readonly">
              {{ user?.email || "Not available" }}
            </p>
            <p class="help-text">Email address cannot be changed</p>
          </div>
        </form>

        <!-- Action Buttons -->
        <div class="button-group">
          <button
            v-if="!isEditMode"
            @click="toggleEditMode"
            class="btn-primary"
            type="button"
          >
            <Icon name="mdi:pencil" class="btn-icon" />
            Edit Profile
          </button>

          <template v-else>
            <button
              @click="handleUpdateProfile"
              class="btn-primary"
              type="button"
              :disabled="isLoading"
            >
              <transition name="fade" mode="out-in">
                <span v-if="!isLoading" key="text" class="btn-content">
                  <Icon name="mdi:content-save" class="btn-icon" />
                  Save Changes
                </span>
                <span v-else key="loading" class="btn-content">
                  <Icon name="mdi:loading" class="btn-icon animate-spin" />
                  Saving...
                </span>
              </transition>
            </button>

            <button
              @click="toggleEditMode"
              class="btn-secondary"
              type="button"
              :disabled="isLoading"
            >
              <Icon name="mdi:close" class="btn-icon" />
              Cancel
            </button>
          </template>
        </div>

        <!-- Quick Links -->
        <div class="quick-links">
          <NuxtLink to="/settings" class="quick-link">
            <Icon name="mdi:lock-reset" class="link-icon" />
            <span>Change Password</span>
            <Icon name="mdi:chevron-right" class="chevron-icon" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap");

.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf9f7 0%, #f5f3ef 100%);
  position: relative;
}

.page-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}

.page-content {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  color: #706c64;
  text-decoration: none;
  transition: color 0.2s ease;
  margin-bottom: 1rem;
}

.back-link:hover {
  color: #d9bc9b;
}

.back-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.page-title {
  font-family: "Crimson Pro", serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0;
  letter-spacing: -0.02em;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-icon {
  width: 3rem;
  height: 3rem;
  color: #d9bc9b;
}

.loading-text {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #706c64;
  margin: 0;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Content Card */
.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Avatar */
.avatar-container {
  display: flex;
  justify-content: center;
}

.avatar {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #d9bc9b 0%, #c9a87c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Work Sans", sans-serif;
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(217, 188, 155, 0.3);
}

/* Profile Info */
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #706c64;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-family: "Work Sans", sans-serif;
  font-size: 1.125rem;
  color: #2d2a26;
  margin: 0;
}

.info-value.mono {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.938rem;
  color: #706c64;
}

.info-value-readonly {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #706c64;
  margin: 0;
}

.help-text {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #9c9790;
  margin: 0.25rem 0 0 0;
  font-style: italic;
}

/* Edit Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d2a26;
  letter-spacing: 0.01em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: #9c9790;
  pointer-events: none;
  transition: color 0.2s ease;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #2d2a26;
  background: #fafaf9;
  border: 1.5px solid #e8e6e1;
  border-radius: 12px;
  transition: all 0.2s ease;
  outline: none;
}

.form-input::placeholder {
  color: #b8b5af;
}

.form-input:focus {
  background: #ffffff;
  border-color: #d9bc9b;
  box-shadow: 0 0 0 3px rgba(217, 188, 155, 0.1);
}

.form-input:focus ~ .input-icon,
.input-wrapper:has(.form-input:focus) .input-icon {
  color: #d9bc9b;
}

.form-input.input-error {
  border-color: #dc6b6b;
  background: #fff5f5;
}

.error-message {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #dc6b6b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Alerts */
.alert-success,
.alert-error {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
}

.alert-success {
  background: #f0fdf4;
  border: 1.5px solid #86efac;
  color: #16a34a;
}

.alert-error {
  background: #fff5f5;
  border: 1.5px solid #fecdcd;
  color: #dc6b6b;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.alert-success p,
.alert-error p {
  margin: 0;
  flex: 1;
}

/* Buttons */
.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  position: relative;
  flex: 1;
  min-width: 150px;
  padding: 1rem;
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  color: #ffffff;
  background: linear-gradient(135deg, #d9bc9b 0%, #c9a87c 100%);
  box-shadow: 0 4px 12px rgba(217, 188, 155, 0.25);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(217, 188, 155, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  color: #706c64;
  background: #ffffff;
  border: 1.5px solid #e8e6e1;
}

.btn-secondary:hover:not(:disabled) {
  background: #fafaf9;
  border-color: #d9bc9b;
}

.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Quick Links */
.quick-links {
  border-top: 1px solid #e8e6e1;
  padding-top: 2rem;
  margin-top: 1rem;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #2d2a26;
  text-decoration: none;
  background: #fafaf9;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1.5px solid #e8e6e1;
}

.quick-link:hover {
  background: #ffffff;
  border-color: #d9bc9b;
  transform: translateX(4px);
}

.link-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #d9bc9b;
}

.quick-link span {
  flex: 1;
}

.chevron-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #9c9790;
}

@media (max-width: 640px) {
  .page-content {
    padding: 1.5rem;
  }

  .content-card {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
