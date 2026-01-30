<script setup lang="ts">
// Use authentication middleware to protect this route
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});

const { user } = useAuth();

// Loading state for components
const isLoading = ref(true);

// Simulate initial load (components handle their own data loading)
onMounted(() => {
  // Allow brief loading state for smooth transitions
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
});
</script>

<template>
  <div class="care-dashboard">
    <!-- Loading state -->
    <div v-if="isLoading" class="dashboard-loading">
      <div class="loading-spinner"></div>
    </div>

    <!-- Dashboard content -->
    <div v-else class="dashboard-container">
      <!-- Opening Moment: Greeting, prompt, and search -->
      <section class="dashboard-section opening-moment-section">
        <DashboardOpeningMoment />
      </section>

      <!-- Holding in Mind: Upcoming Care Reminders -->
      <section class="dashboard-section reminders-section">
        <DashboardHoldingInMind />
      </section>

      <!-- Shared Rhythms: Upcoming Calendar Events -->
      <section class="dashboard-section events-section">
        <DashboardSharedRhythms />
      </section>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

/* Care Dashboard Container */
.care-dashboard {
  width: 100%;
  min-height: 100vh;
}

/* Loading state */
.dashboard-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e8e6e1;
  border-top-color: #d9bc9b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Dashboard Container: Single-column, vertically-stacked layout */
.dashboard-container {
  margin: 0 auto;
  background: #f5f4f0;
  min-height: 100vh;
}

/* Dashboard Sections: Minimal spacing between sections */
.dashboard-section {
  margin-bottom: 0;
}

/* Last section has padding at bottom */
.dashboard-section:last-child {
  padding-bottom: 4rem;
}

/* Specific section adjustments */
.opening-moment-section {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.reminders-section {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.events-section {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-section:last-child {
    /* Reduced bottom padding since layout now has bottom nav spacing */
    padding-bottom: 1rem;
  }
}
</style>
