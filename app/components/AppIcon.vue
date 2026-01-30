<template>
  <Icon
    :name="name"
    :size="size"
    :class="customClass"
    :aria-label="ariaLabel || label"
    :aria-hidden="decorative ? 'true' : undefined"
    :role="decorative ? 'presentation' : undefined"
  />
</template>

<script setup lang="ts">
/**
 * AppIcon - A reusable icon component wrapper for @nuxt/icon
 *
 * This component wraps the Nuxt Icon component to provide:
 * - Consistent icon usage across the application
 * - Built-in accessibility support
 * - Default size and styling
 *
 * @example
 * <AppIcon name="heroicons:envelope" />
 * <AppIcon name="heroicons:eye" size="20" />
 * <AppIcon name="heroicons:user" label="User profile" />
 */

interface Props {
  /** Icon name from Iconify collection (e.g., 'heroicons:envelope', 'mdi:home') */
  name: string;
  /** Icon size in pixels (default: 24) */
  size?: string | number;
  /** Additional CSS classes */
  customClass?: string;
  /** Accessible label for screen readers */
  label?: string;
  /** Explicit ARIA label (overrides label prop) */
  ariaLabel?: string;
  /** Whether the icon is purely decorative (hides from screen readers) */
  decorative?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: "24",
  customClass: "",
  label: "",
  ariaLabel: "",
  decorative: false,
});
</script>
