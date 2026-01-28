<script setup lang="ts">
// Use authentication middleware to protect this route
definePageMeta({
  middleware: ["auth"],
});

const { user, logout, isLoading } = useAuth();
const router = useRouter();

// Handle logout
const handleLogout = async () => {
  const result = await logout();
  if (result.success) {
    await router.push("/login");
  }
};
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-info">
            <h1 class="dashboard-title">Dashboard</h1>
            <p v-if="user?.email" class="user-email">{{ user.email }}</p>
          </div>

          <button
            @click="handleLogout"
            :disabled="isLoading"
            class="btn-logout"
          >
            <Icon name="mdi:logout" class="btn-icon" />
            Sign out
          </button>
        </div>
      </header>

      <!-- Welcome section -->
      <section class="welcome-section">
        <div class="welcome-card">
          <Icon name="mdi:hand-wave" class="welcome-icon" />
          <h2 class="welcome-title">Welcome back!</h2>
          <p class="welcome-text">
            You're successfully authenticated. This is a protected dashboard
            that requires authentication.
          </p>
        </div>
      </section>

      <!-- Quick links -->
      <section class="links-section">
        <h3 class="section-title">Quick Links</h3>
        <div class="links-grid">
          <NuxtLink to="/profile" class="link-card">
            <Icon name="mdi:account" class="link-icon" />
            <h4 class="link-title">Profile</h4>
            <p class="link-description">View and edit your profile</p>
          </NuxtLink>

          <NuxtLink to="/settings" class="link-card">
            <Icon name="mdi:cog" class="link-icon" />
            <h4 class="link-title">Settings</h4>
            <p class="link-description">Manage your account settings</p>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf9f7 0%, #f5f3ef 100%);
  position: relative;
}

.dashboard-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}

.dashboard-content {
  position: relative;
  max-width: 1200px;
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

/* Header */
.dashboard-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.header-info {
  flex: 1;
}

.dashboard-title {
  font-family: "Crimson Pro", serif;
  font-size: 2rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.user-email {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #706c64;
  margin: 0;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  font-weight: 500;
  color: #706c64;
  background: #fafaf9;
  border: 1.5px solid #e8e6e1;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover:not(:disabled) {
  background: #ffffff;
  border-color: #d9bc9b;
  color: #d9bc9b;
}

.btn-logout:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Welcome section */
.welcome-section {
  margin-bottom: 2rem;
}

.welcome-card {
  background: linear-gradient(135deg, #d9bc9b 0%, #c9a87c 100%);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(217, 188, 155, 0.25);
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

/* Links section */
.links-section {
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

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-logout {
    justify-content: center;
  }

  .dashboard-content {
    padding: 1.5rem;
  }

  .dashboard-header {
    padding: 1.5rem;
  }

  .welcome-card {
    padding: 2rem 1.5rem;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
