<script setup lang="ts">
// Use authentication middleware to protect this route
definePageMeta({
  middleware: ["auth"],
});

const { changePassword, isLoading, error, clearError } = useAuth();

// Form state
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const successMessage = ref<string | null>(null);
const validationErrors = ref<{
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}>({});

// Validate password strength
const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};

// Handle form validation
const validateForm = (): boolean => {
  const errors: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  } = {};

  if (!currentPassword.value) {
    errors.currentPassword = "Current password is required";
  }

  if (!newPassword.value) {
    errors.newPassword = "New password is required";
  } else {
    const passwordError = validatePassword(newPassword.value);
    if (passwordError) {
      errors.newPassword = passwordError;
    }
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = "Please confirm your new password";
  } else if (newPassword.value !== confirmPassword.value) {
    errors.confirmPassword = "Passwords do not match";
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Handle password change submission
const handleChangePassword = async () => {
  clearError();
  successMessage.value = null;

  if (!validateForm()) {
    return;
  }

  const result = await changePassword(currentPassword.value, newPassword.value);

  if (result.success) {
    // Clear form and show success message
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    successMessage.value = "Password changed successfully!";

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
  }
};

// Clear validation error when user types
watch([currentPassword, newPassword, confirmPassword], () => {
  validationErrors.value = {};
  clearError();
  successMessage.value = null;
});
</script>

<template>
  <div class="page-container">
    <div class="page-content">
      <header class="page-header">
        <NuxtLink to="/profile" class="back-link">
          <Icon name="mdi:arrow-left" class="back-icon" />
          Back to Profile
        </NuxtLink>
        <h1 class="page-title">Change Password</h1>
        <p class="page-description">
          Update your account password to keep your account secure
        </p>
      </header>

      <div class="content-card">
        <form @submit.prevent="handleChangePassword" class="password-form">
          <!-- Current Password -->
          <div class="form-group">
            <label for="currentPassword" class="form-label"
              >Current Password</label
            >
            <div class="input-wrapper">
              <Icon name="mdi:lock-outline" class="input-icon" />
              <input
                id="currentPassword"
                v-model="currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'input-error': validationErrors.currentPassword }"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="password-toggle"
                :aria-label="
                  showCurrentPassword ? 'Hide password' : 'Show password'
                "
              >
                <Icon
                  :name="
                    showCurrentPassword
                      ? 'mdi:eye-off-outline'
                      : 'mdi:eye-outline'
                  "
                  class="toggle-icon"
                />
              </button>
            </div>
            <transition name="error-slide">
              <p v-if="validationErrors.currentPassword" class="error-message">
                {{ validationErrors.currentPassword }}
              </p>
            </transition>
          </div>

          <!-- New Password -->
          <div class="form-group">
            <label for="newPassword" class="form-label">New Password</label>
            <div class="input-wrapper">
              <Icon name="mdi:lock-reset" class="input-icon" />
              <input
                id="newPassword"
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'input-error': validationErrors.newPassword }"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="password-toggle"
                :aria-label="
                  showNewPassword ? 'Hide password' : 'Show password'
                "
              >
                <Icon
                  :name="
                    showNewPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'
                  "
                  class="toggle-icon"
                />
              </button>
            </div>
            <transition name="error-slide">
              <p v-if="validationErrors.newPassword" class="error-message">
                {{ validationErrors.newPassword }}
              </p>
            </transition>
          </div>

          <!-- Confirm New Password -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label"
              >Confirm New Password</label
            >
            <div class="input-wrapper">
              <Icon name="mdi:lock-check-outline" class="input-icon" />
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'input-error': validationErrors.confirmPassword }"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="password-toggle"
                :aria-label="
                  showConfirmPassword ? 'Hide password' : 'Show password'
                "
              >
                <Icon
                  :name="
                    showConfirmPassword
                      ? 'mdi:eye-off-outline'
                      : 'mdi:eye-outline'
                  "
                  class="toggle-icon"
                />
              </button>
            </div>
            <transition name="error-slide">
              <p v-if="validationErrors.confirmPassword" class="error-message">
                {{ validationErrors.confirmPassword }}
              </p>
            </transition>
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

          <!-- Submit button -->
          <button type="submit" class="btn-primary" :disabled="isLoading">
            <transition name="fade" mode="out-in">
              <span v-if="!isLoading" key="text" class="btn-content">
                <Icon name="mdi:content-save" class="btn-icon" />
                Update Password
              </span>
              <span v-else key="loading" class="btn-content">
                <Icon name="mdi:loading" class="btn-icon animate-spin" />
                Updating...
              </span>
            </transition>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

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
  max-width: 600px;
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
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-description {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #706c64;
  margin: 0;
  line-height: 1.5;
}

.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* Form */
.password-form {
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

.form-input:focus + .input-icon,
.form-input:focus ~ .input-icon {
  color: #d9bc9b;
}

.form-input.input-error {
  border-color: #dc6b6b;
  background: #fff5f5;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9c9790;
  transition: color 0.2s ease;
  border-radius: 8px;
}

.password-toggle:hover {
  color: #706c64;
}

.password-toggle:focus {
  outline: none;
  color: #d9bc9b;
}

.toggle-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: block;
}

/* Error message */
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

/* Button */
.btn-primary {
  position: relative;
  width: 100%;
  padding: 1rem;
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  background: linear-gradient(135deg, #d9bc9b 0%, #c9a87c 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
}
</style>
