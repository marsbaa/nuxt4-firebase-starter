<script setup lang="ts">
defineProps<{
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  dismissible?: boolean;
}>();

const emit = defineEmits<{
  dismiss: [];
}>();

const show = ref(true);

const iconMap = {
  success: "heroicons:check-circle",
  error: "heroicons:x-circle",
  warning: "heroicons:exclamation-triangle",
  info: "heroicons:information-circle",
};

const handleDismiss = () => {
  show.value = false;
  emit("dismiss");
};
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 transform scale-95"
    enter-to-class="opacity-100 transform scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 transform scale-100"
    leave-to-class="opacity-0 transform scale-95"
  >
    <div
      v-if="show"
      :class="[
        'rounded-lg p-4 border',
        {
          'bg-success-50 border-success-200 text-success-800':
            type === 'success',
          'bg-danger-50 border-danger-200 text-danger-800': type === 'error',
          'bg-warning-50 border-warning-200 text-warning-800':
            type === 'warning',
          'bg-info-50 border-info-200 text-info-800': type === 'info' || !type,
        },
      ]"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <AppIcon
            :name="iconMap[type || 'info']"
            :class="[
              'h-5 w-5',
              {
                'text-success-500': type === 'success',
                'text-danger-500': type === 'error',
                'text-warning-500': type === 'warning',
                'text-info-500': type === 'info' || !type,
              },
            ]"
          />
        </div>
        <div class="ml-3 flex-1">
          <h3 v-if="title" class="text-sm font-medium">
            {{ title }}
          </h3>
          <div class="text-sm leading-relaxed" :class="{ 'mt-1': title }">
            <slot />
          </div>
        </div>
        <div v-if="dismissible" class="ml-auto pl-3">
          <button
            type="button"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="{
              'text-success-600 hover:bg-success-100 focus:ring-success-500':
                type === 'success',
              'text-danger-600 hover:bg-danger-100 focus:ring-danger-500':
                type === 'error',
              'text-warning-600 hover:bg-warning-100 focus:ring-warning-500':
                type === 'warning',
              'text-info-600 hover:bg-info-100 focus:ring-info-500':
                type === 'info' || !type,
            }"
            @click="handleDismiss"
          >
            <span class="sr-only">Dismiss</span>
            <AppIcon name="heroicons:x-mark" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
