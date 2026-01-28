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
      'bg-white rounded-xl border border-stone-200 transition-all duration-200',
      {
        'p-5': padding === 'sm',
        'p-6': padding === 'md' || !padding,
        'p-8': padding === 'lg',
        'p-0': padding === 'none',
        'shadow-sm': shadow,
        'hover:shadow-md hover:border-stone-300': hover,
      },
    ]"
  >
    <div v-if="title || description" class="mb-6">
      <h3
        v-if="title"
        class="text-lg font-medium text-stone-900 leading-relaxed"
      >
        {{ title }}
      </h3>
      <p v-if="description" class="mt-2 text-sm text-stone-600 leading-relaxed">
        {{ description }}
      </p>
    </div>
    <slot />
  </div>
</template>
