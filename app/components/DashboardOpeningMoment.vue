<script setup lang="ts">
import { computed } from "vue";

interface TimeOfDay {
  greeting: string;
  prompt: string;
}

// Get current hour from user's timezone
const getCurrentHour = (): number => {
  return new Date().getHours();
};

// Contextual greeting and prompts based on time of day
const timeOfDayContent = computed<TimeOfDay>(() => {
  const hour = getCurrentHour();

  if (hour < 12) {
    return {
      greeting: "Good morning",
      prompt: "Who might you be called to care for today?",
    };
  } else if (hour < 17) {
    return {
      greeting: "Good afternoon",
      prompt: "Where has care been present today?",
    };
  } else {
    return {
      greeting: "Good evening",
      prompt: "How has your day of caring unfolded?",
    };
  }
});
</script>

<template>
  <div
    class="w-full py-12 sm:py-16 px-6 sm:px-8 text-center bg-gradient-to-b from-stone-50 to-white"
  >
    <!-- Greeting -->
    <h1 class="text-3xl sm:text-4xl font-medium text-stone-800 tracking-wide">
      {{ timeOfDayContent.greeting }}
    </h1>

    <!-- Reflective prompt -->
    <p
      class="mt-6 text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto"
    >
      {{ timeOfDayContent.prompt }}
    </p>
  </div>
</template>
