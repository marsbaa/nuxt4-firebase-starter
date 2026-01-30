<script setup lang="ts">
// Use authentication middleware to protect this route
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">Your Settings</h1>
      <p class="page-description">Adjust your account preferences</p>
    </header>

    <div class="content-card">
      <div class="placeholder-content">
        <Icon name="mdi:cog-outline" class="placeholder-icon" />
        <h2 class="placeholder-title">More Settings On The Way</h2>
        <p class="placeholder-text">
          We're working on additional settings to help you customize your
          experience. In the meantime, you can update your profile and password
          from the navigation menu.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

/* Page Structure */
.page-container {
  width: 100%;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
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
}

/* Placeholder */
.placeholder-content {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem 0;
}

.placeholder-icon {
  width: 5rem;
  height: 5rem;
  color: #d9bc9b;
  margin: 0 auto 1.5rem;
  opacity: 0.7;
}

.placeholder-title {
  font-family: "Crimson Pro", serif;
  font-size: 2rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 1rem 0;
  letter-spacing: -0.01em;
}

.placeholder-text {
  font-family: "Work Sans", sans-serif;
  font-size: 1.063rem;
  color: #706c64;
  margin: 0;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 640px) {
  .content-card {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .placeholder-content {
    padding: 1rem 0;
  }

  .placeholder-icon {
    width: 4rem;
    height: 4rem;
  }

  .placeholder-title {
    font-size: 1.5rem;
  }

  .placeholder-text {
    font-size: 1rem;
  }
}
</style>
