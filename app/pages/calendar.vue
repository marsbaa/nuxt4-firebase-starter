<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

// Set page metadata
useHead({
  title: "Care Calendar - Pastoral Care",
  meta: [
    {
      name: "description",
      content:
        "A visual overview of shared communal time within the church community",
    },
  ],
});
</script>

<template>
  <div class="calendar-page">
    <div class="calendar-container">
      <CareCalendar />
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

.calendar-page {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #faf9f7 0%, #f5f3ef 100%);
  position: relative;
}

/* Subtle texture overlay */
.calendar-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* Header */
.calendar-header {
  padding: 2.5rem 2rem 2rem;
  border-bottom: 1px solid rgba(232, 230, 225, 0.6);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-family: "Crimson Pro", serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.page-subtitle {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  font-weight: 500;
  color: #9c8b7a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
}

/* Container */
.calendar-container {
  flex: 1;
  padding: 2rem;
  position: relative;
  z-index: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

/* Footer */
.calendar-footer {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid rgba(232, 230, 225, 0.6);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
}

.footer-tagline {
  font-family: "Crimson Pro", serif;
  font-size: 1rem;
  font-style: italic;
  color: #706c64;
  margin: 0;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .calendar-header {
    padding: 2rem 1.5rem 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .calendar-container {
    padding: 1.5rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .calendar-header {
    padding: 1.5rem 1rem 1rem;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.75rem;
  }

  .calendar-container {
    padding: 1rem;
  }

  .calendar-footer {
    padding: 1.5rem 1rem;
  }

  .footer-tagline {
    font-size: 0.938rem;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
