<script setup lang="ts">
const { register, isLoading, error, clearError } = useAuth();
const router = useRouter();

// Form state
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const validationErrors = ref<{
  email?: string;
  password?: string;
  confirmPassword?: string;
}>({});

// Validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};

  if (!email.value) {
    errors.email = "Email is required";
  } else if (!validateEmail(email.value)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password.value) {
    errors.password = "Password is required";
  } else {
    const passwordError = validatePassword(password.value);
    if (passwordError) {
      errors.password = passwordError;
    }
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password.value !== confirmPassword.value) {
    errors.confirmPassword = "Passwords do not match";
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Handle registration submission
const handleRegister = async () => {
  clearError();

  if (!validateForm()) {
    return;
  }

  const result = await register(email.value, password.value);

  if (result.success) {
    // Redirect to dashboard after successful registration
    await router.push("/dashboard");
  }
};

// Clear validation error when user types
watch([email, password, confirmPassword], () => {
  validationErrors.value = {};
  clearError();
});
</script>

<template>
  <div class="auth-container">
    <!-- Decorative background elements -->
    <div class="bg-decoration"></div>
    <div class="bg-grain"></div>

    <div class="auth-card">
      <!-- Header -->
      <div class="auth-header">
        <h1 class="auth-title">Create account</h1>
        <p class="auth-subtitle">Start your journey with us today</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="auth-form" novalidate>
        <!-- Email field -->
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div class="input-wrapper">
            <Icon name="mdi:email-outline" class="input-icon" />
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              :class="{ 'input-error': validationErrors.email }"
              placeholder="your@email.com"
              autocomplete="email"
              required
            />
          </div>
          <transition name="error-slide">
            <p v-if="validationErrors.email" class="error-message">
              {{ validationErrors.email }}
            </p>
          </transition>
        </div>

        <!-- Password field -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-wrapper">
            <Icon name="mdi:lock-outline" class="input-icon" />
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'input-error': validationErrors.password }"
              placeholder="••••••••"
              autocomplete="new-password"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <Icon
                :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                class="toggle-icon"
              />
            </button>
          </div>
          <transition name="error-slide">
            <p v-if="validationErrors.password" class="error-message">
              {{ validationErrors.password }}
            </p>
          </transition>
        </div>

        <!-- Confirm Password field -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label"
            >Confirm Password</label
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
              required
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

        <!-- Global error message -->
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
              <Icon name="mdi:account-plus" class="btn-icon" />
              Create account
            </span>
            <span v-else key="loading" class="btn-content">
              <Icon name="mdi:loading" class="btn-icon animate-spin" />
              Creating account...
            </span>
          </transition>
        </button>
      </form>

      <!-- Footer -->
      <div class="auth-footer">
        <p class="footer-text">
          Already have an account?
          <NuxtLink to="/login" class="footer-link">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Import beautiful, distinctive font */
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

.auth-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f7f9fa 0%, #eff3f5 100%);
  overflow: hidden;
}

/* Decorative background */
.bg-decoration {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(
    circle,
    rgba(155, 188, 217, 0.15) 0%,
    rgba(155, 188, 217, 0) 70%
  );
  border-radius: 50%;
  filter: blur(60px);
  animation: float 20s ease-in-out infinite;
}

.bg-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-30px, 30px) scale(1.1);
  }
  66% {
    transform: translate(20px, -20px) scale(0.9);
  }
}

/* Auth card */
.auth-card {
  position: relative;
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.8);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.auth-header {
  margin-bottom: 2.5rem;
  animation: fadeIn 0.8s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.auth-title {
  font-family: "Crimson Pro", serif;
  font-size: 2.25rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.auth-subtitle {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #706c64;
  margin: 0;
  font-weight: 400;
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: fadeIn 0.8s ease-out 0.3s both;
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
  border-color: #9bbcd9;
  box-shadow: 0 0 0 3px rgba(155, 188, 217, 0.1);
}

.form-input:focus + .input-icon,
.form-input:focus ~ .input-icon {
  color: #9bbcd9;
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
  color: #9bbcd9;
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

/* Alert */
.alert-error {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #fff5f5;
  border: 1.5px solid #fecdcd;
  border-radius: 12px;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  color: #dc6b6b;
  animation: fadeIn 0.8s ease-out 0.4s both;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

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
  background: linear-gradient(135deg, #9bbcd9 0%, #7ca6c9 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(155, 188, 217, 0.25);
  animation: fadeIn 0.8s ease-out 0.5s both;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(155, 188, 217, 0.35);
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

/* Footer */
.auth-footer {
  margin-top: 2rem;
  text-align: center;
  animation: fadeIn 0.8s ease-out 0.6s both;
}

.footer-text {
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  color: #706c64;
  margin: 0;
}

.footer-link {
  color: #9bbcd9;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  border-bottom: 1px solid transparent;
}

.footer-link:hover {
  color: #7ca6c9;
  border-bottom-color: currentColor;
}

/* Responsive */
@media (max-width: 640px) {
  .auth-container {
    padding: 1.5rem;
  }

  .auth-card {
    padding: 2rem 1.5rem;
  }

  .auth-title {
    font-size: 1.875rem;
  }
}
</style>
