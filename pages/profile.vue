<script setup lang="ts">
// Use authentication middleware to protect this route
definePageMeta({
  middleware: ["auth"],
});

const { user } = useAuth();
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

      <div class="content-card">
        <div class="profile-info">
          <Icon name="mdi:account-circle" class="profile-icon" />
          <div class="info-group">
            <label class="info-label">Email</label>
            <p class="info-value">{{ user?.email || "Not available" }}</p>
          </div>
          <div class="info-group">
            <label class="info-label">User ID</label>
            <p class="info-value mono">{{ user?.uid || "Not available" }}</p>
          </div>
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

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-icon {
  width: 5rem;
  height: 5rem;
  color: #d9bc9b;
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
