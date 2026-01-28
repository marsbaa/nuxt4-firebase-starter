<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  padding?: "sm" | "md" | "lg" | "none";
  shadow?: boolean;
  hover?: boolean;
}>();
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl border border-secondary-200 transition-all duration-200',
      {
        'p-4': padding === 'sm',
        'p-6': padding === 'md' || !padding,
        'p-8': padding === 'lg',
        'p-0': padding === 'none',
        'shadow-soft': shadow,
        'hover:shadow-soft-lg hover:border-secondary-300': hover,
      },
    ]"
  >
    <div v-if="title || description" class="mb-4">
      <h3 v-if="title" class="text-lg font-semibold text-secondary-900">
        {{ title }}
      </h3>
      <p v-if="description" class="mt-1 text-sm text-secondary-600">
        {{ description }}
      </p>
    </div>
    <slot />
  </div>
</template>
