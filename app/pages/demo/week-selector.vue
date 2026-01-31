<script setup lang="ts">
import { startOfWeek } from "date-fns";

definePageMeta({
  layout: "default",
});

// Selected week state
const selectedWeekStart = ref<Date>(
  startOfWeek(new Date(), { weekStartsOn: 0 }),
);

// Format selected week for display
const formatSelectedWeek = computed(() => {
  return selectedWeekStart.value.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});
</script>

<template>
  <div class="demo-page">
    <div class="demo-container">
      <h1 class="demo-title">Week Range Selector Component</h1>
      <p class="demo-description">
        A pastoral, calm component for orienting around the present week.
        Designed for mobile-first use with gentle emphasis on the current week.
      </p>

      <!-- Component Demo -->
      <div class="demo-section">
        <h2 class="section-title">Interactive Demo</h2>
        <p class="section-description">
          Click the selector to view available weeks. The current week is
          highlighted, past weeks are de-emphasized, and upcoming weeks are
          clearly available.
        </p>

        <div class="component-wrapper">
          <WeekRangeSelector v-model:selected-week-start="selectedWeekStart" />
        </div>

        <div class="selected-info">
          <p class="info-label">Selected Week Starts:</p>
          <p class="info-value">{{ formatSelectedWeek }}</p>
        </div>
      </div>

      <!-- Design Principles -->
      <div class="demo-section">
        <h2 class="section-title">Design Principles</h2>
        <ul class="principles-list">
          <li>
            <strong>Orientation Control:</strong> Helps locate yourself in
            shared communal time, not for productivity planning
          </li>
          <li>
            <strong>Limited Range:</strong> Shows 2 past weeks, current week,
            and 3 upcoming weeks (no infinite scrolling)
          </li>
          <li>
            <strong>Visual Hierarchy:</strong> Current week is emphasized, past
            weeks are de-emphasized, upcoming weeks are available
          </li>
          <li>
            <strong>Calm Interaction:</strong> Gentle transitions, spacious
            layout, pastoral color palette
          </li>
          <li>
            <strong>Mobile-First:</strong> Designed for brief, repeated mobile
            use with touch-friendly targets
          </li>
        </ul>
      </div>

      <!-- States -->
      <div class="demo-section">
        <h2 class="section-title">Component States</h2>
        <div class="states-grid">
          <div class="state-card">
            <h3 class="state-title">Collapsed (Current Week)</h3>
            <p class="state-description">
              Shows "CURRENT WEEK" label with check icon when the current week
              is selected
            </p>
          </div>
          <div class="state-card">
            <h3 class="state-title">Collapsed (Other Week)</h3>
            <p class="state-description">
              Shows only the week range when a past or future week is selected
            </p>
          </div>
          <div class="state-card">
            <h3 class="state-title">Expanded</h3>
            <p class="state-description">
              Dropdown showing all available weeks with status labels (RECENT,
              CURRENT WEEK, UPCOMING)
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600&family=Work+Sans:wght@400;500;600&display=swap");

.demo-page {
  min-height: 100vh;
  background: #fafaf9;
  padding: 2rem 1rem;
}

.demo-container {
  max-width: 48rem;
  margin: 0 auto;
}

.demo-title {
  font-family: "Crimson Pro", serif;
  font-size: 2.5rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
  text-align: center;
}

.demo-description {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #666666;
  text-align: center;
  margin: 0 0 3rem 0;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.demo-section {
  background: #ffffff;
  border: 1px solid #e8e6e3;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.75rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 0.75rem 0;
}

.section-description {
  font-family: "Work Sans", sans-serif;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #666666;
  margin: 0 0 2rem 0;
}

.component-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.selected-info {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f8f7;
  border-radius: 0.5rem;
  text-align: center;
}

.info-label {
  font-family: "Work Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #999999;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
}

.info-value {
  font-family: "Crimson Pro", serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
}

.principles-list {
  font-family: "Work Sans", sans-serif;
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #2d2a26;
  margin: 0;
  padding-left: 1.5rem;
}

.principles-list li {
  margin-bottom: 0.75rem;
}

.principles-list strong {
  color: #1a1a1a;
  font-weight: 600;
}

.states-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .states-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.state-card {
  padding: 1.25rem;
  background: #f9f8f7;
  border: 1px solid #e8e6e3;
  border-radius: 0.75rem;
}

.state-title {
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.state-description {
  font-family: "Work Sans", sans-serif;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #666666;
  margin: 0;
}
</style>
