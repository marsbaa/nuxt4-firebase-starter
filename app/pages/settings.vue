<script setup lang="ts">
// Use authentication middleware to protect this route
definePageMeta({
  middleware: ["auth"],
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
        <h1 class="page-title">Settings</h1>
        <p class="page-description">
          Manage your account settings and preferences
        </p>
      </header>

      <div class="content-card">
        <div class="placeholder-content">
          <Icon name="mdi:cog-outline" class="placeholder-icon" />
          <h2 class="placeholder-title">Settings Page</h2>
          <p class="placeholder-text">
            This settings page is currently a placeholder. Additional settings
            and preferences will be added here in future updates.
          </p>

          <div class="quick-links">
            <NuxtLink to="/profile" class="quick-link">
              <Icon name="mdi:account" class="link-icon" />
              <span>Go to Profile</span>
              <Icon name="mdi:chevron-right" class="chevron-icon" />
            </NuxtLink>

            <NuxtLink to="/change-password" class="quick-link">
              <Icon name="mdi:lock-reset" class="link-icon" />
              <span>Change Password</span>
              <Icon name="mdi:chevron-right" class="chevron-icon" />
            </NuxtLink>
          </div>
        </div>
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
  padding: 3rem 2.5rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.placeholder-content {
  text-align: center;
}

.placeholder-icon {
  width: 4rem;
  height: 4rem;
  color: #d9bc9b;
  margin: 0 auto 1.5rem;
}

.placeholder-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 1rem 0;
  letter-spacing: -0.01em;
}

.placeholder-text {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #706c64;
  margin: 0 auto 3rem;
  max-width: 500px;
  line-height: 1.6;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
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
  text-align: left;
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
    padding: 2rem 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .placeholder-icon {
    width: 3rem;
    height: 3rem;
  }

  .placeholder-title {
    font-size: 1.5rem;
  }
}
</style>
