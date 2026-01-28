<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      // Size variants
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md' || !size,
        'px-6 py-3 text-lg': size === 'lg',
      },
      // Color variants
      {
        'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500':
          variant === 'primary' || !variant,
        'bg-secondary-200 hover:bg-secondary-300 text-secondary-900 focus:ring-secondary-500':
          variant === 'secondary',
        'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500':
          variant === 'danger',
        'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500':
          variant === 'success',
        'bg-transparent hover:bg-secondary-100 text-secondary-700 focus:ring-secondary-500':
          variant === 'ghost',
      },
      // Full width
      {
        'w-full': fullWidth,
      },
    ]"
    @click="emit('click', $event)"
  >
    <AppIcon
      v-if="loading"
      name="heroicons:arrow-path"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
    />
    <slot />
  </button>
</template>
