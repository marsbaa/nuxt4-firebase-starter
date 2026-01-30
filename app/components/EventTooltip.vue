<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  text: string;
}>();

const showTooltip = ref(false);
const tooltipRef = ref<HTMLElement | null>(null);

const handleMouseEnter = () => {
  showTooltip.value = true;
};

const handleMouseLeave = () => {
  showTooltip.value = false;
};
</script>

<template>
  <div
    class="tooltip-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot />
    <Transition name="tooltip-fade">
      <div v-if="showTooltip" ref="tooltipRef" class="tooltip" role="tooltip">
        {{ text }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  z-index: 1000;
  padding: 0.5rem 0.75rem;
  background: #2d2a26;
  color: #ffffff;
  font-size: 0.813rem;
  line-height: 1.4;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #2d2a26;
}

/* Transition */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}
</style>
