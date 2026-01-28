<script setup lang="ts">
defineProps<{
  modelValue: string;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: string;
  id?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const inputId = computed(
  () => props.id || `input-${Math.random().toString(36).substr(2, 9)}`,
);
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-secondary-700 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500 ml-0.5">*</span>
    </label>
    <div class="relative">
      <div
        v-if="icon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <AppIcon :name="icon" class="h-5 w-5 text-secondary-400" />
      </div>
      <input
        :id="inputId"
        :type="type || 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
          {
            'pl-10': icon,
            'pl-3': !icon,
            'pr-3': true,
            'py-2': true,
            'border-danger-300 text-danger-900 placeholder-danger-300 focus:ring-danger-500 focus:border-danger-500':
              error,
            'border-secondary-300 text-secondary-900 placeholder-secondary-400 focus:ring-primary-500 focus:border-primary-500':
              !error,
            'bg-secondary-100 cursor-not-allowed': disabled,
            'bg-white': !disabled,
          },
        ]"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-danger-600">
      {{ error }}
    </p>
  </div>
</template>
