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
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md',
      // Size variants - comfortable sizing
      {
        'px-4 py-2 text-sm': size === 'sm',
        'px-5 py-2.5 text-base': size === 'md' || !size,
        'px-6 py-3 text-lg': size === 'lg',
      },
      // Color variants - pastoral earth tones
      {
        'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500':
          variant === 'primary' || !variant,
        'bg-stone-100 hover:bg-stone-200 text-stone-800 focus:ring-stone-400 border border-stone-300':
          variant === 'secondary',
        'bg-danger-500 hover:bg-danger-600 text-white focus:ring-danger-400':
          variant === 'danger',
        'bg-success-500 hover:bg-success-600 text-white focus:ring-success-400':
          variant === 'success',
        'bg-transparent hover:bg-stone-100 text-stone-700 focus:ring-stone-400 shadow-none':
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
