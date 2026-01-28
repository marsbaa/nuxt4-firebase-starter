<script setup lang="ts">
// Use authentication middleware to protect this route
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});

const { user } = useAuth();
const { profile, fetchProfile, getUserInitials } = useProfile();

// Load user profile on mount
onMounted(async () => {
  if (user.value?.uid) {
    await fetchProfile(user.value.uid);
  }
});

// Get display name for welcome message
const displayName = computed(() => {
  return profile.value?.displayName || user.value?.displayName || "there";
});

// Format account creation date
const accountCreatedDate = computed(() => {
  if (profile.value?.createdAt) {
    try {
      const date = profile.value.createdAt.toDate
        ? profile.value.createdAt.toDate()
        : new Date(profile.value.createdAt);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  }
  return "Recently";
});
</script>

<template>
  <div class="dashboard-content">
    <!-- Welcome section with personalized message -->
    <section class="welcome-section">
      <div class="welcome-card">
        <Icon name="mdi:hand-wave" class="welcome-icon" />
        <h2 class="welcome-title">Welcome back, {{ displayName }}!</h2>
        <p class="welcome-text">
          You're successfully authenticated and accessing your protected
          dashboard.
        </p>
      </div>
    </section>

    <!-- User summary section -->
    <section class="summary-section">
      <h3 class="section-title">Account Summary</h3>
      <div class="summary-grid">
        <div class="summary-card">
          <Icon name="mdi:email" class="summary-icon" />
          <div class="summary-content">
            <div class="summary-label">Email Address</div>
            <div class="summary-value">{{ user?.email }}</div>
          </div>
        </div>
        <div class="summary-card">
          <Icon name="mdi:calendar" class="summary-icon" />
          <div class="summary-content">
            <div class="summary-label">Member Since</div>
            <div class="summary-value">{{ accountCreatedDate }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick links section -->
    <section class="links-section">
      <h3 class="section-title">Quick Links</h3>
      <div class="links-grid">
        <NuxtLink to="/profile" class="link-card">
          <Icon name="mdi:account" class="link-icon" />
          <h4 class="link-title">Profile</h4>
          <p class="link-description">View and edit your profile information</p>
        </NuxtLink>

        <NuxtLink to="/settings" class="link-card">
          <Icon name="mdi:cog" class="link-icon" />
          <h4 class="link-title">Settings</h4>
          <p class="link-description">
            Manage your account settings and preferences
          </p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

/* Dashboard content */
.dashboard-content {
  width: 100%;
}

/* Welcome section */
.welcome-section {
  margin-bottom: 2rem;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-card {
  background: linear-gradient(135deg, #d9bc9b 0%, #c9a87c 100%);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(217, 188, 155, 0.25);
}

.welcome-icon {
  width: 3rem;
  height: 3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  animation: wave 1.5s ease-in-out infinite;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}

.welcome-title {
  font-family: "Crimson Pro", serif;
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.welcome-text {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Summary section */
.summary-section {
  margin-bottom: 2rem;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.section-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.75rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1.5px solid #e8e6e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.summary-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #d9bc9b;
  flex-shrink: 0;
}

.summary-content {
  flex: 1;
  min-width: 0;
}

.summary-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #706c64;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2d2a26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Links section */
.links-section {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1.5px solid #e8e6e1;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.link-card:hover {
  transform: translateY(-4px);
  border-color: #d9bc9b;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.link-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #d9bc9b;
  margin-bottom: 1rem;
}

.link-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
}

.link-description {
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  color: #706c64;
  margin: 0;
  line-height: 1.5;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .welcome-card {
    padding: 2.5rem 2rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .welcome-card {
    padding: 2rem 1.5rem;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .summary-grid,
  .links-grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    padding: 1.5rem;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .welcome-card {
    padding: 1.5rem 1rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }
}
</style>
