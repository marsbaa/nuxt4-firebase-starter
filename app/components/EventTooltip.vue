<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps<{
  text: string;
}>();

const showTooltip = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);
const tooltipStyle = ref({
  top: "0px",
  left: "0px",
});

const handleMouseEnter = () => {
  showTooltip.value = true;
  updateTooltipPosition();
};

const handleMouseLeave = () => {
  showTooltip.value = false;
};

const updateTooltipPosition = () => {
  nextTick(() => {
    if (wrapperRef.value) {
      const rect = wrapperRef.value.getBoundingClientRect();
      tooltipStyle.value = {
        top: `${rect.top - 8}px`,
        left: `${rect.left + rect.width / 2}px`,
      };
    }
  });
};
</script>

<template>
  <div
    ref="wrapperRef"
    class="tooltip-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot />
  </div>

  <Teleport to="body">
    <Transition name="tooltip-fade">
      <div
        v-if="showTooltip"
        class="tooltip"
        role="tooltip"
        :style="tooltipStyle"
      >
        {{ text }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
  width: 100%;
}

.tooltip {
  position: fixed;
  transform: translate(-50%, -100%);
  z-index: 9999;
  max-width: 300px;
  padding: 0.5rem 0.75rem;
  background: #2d2a26;
  color: #ffffff;
  font-size: 0.813rem;
  line-height: 1.4;
  border-radius: 6px;
  white-space: normal;
  word-wrap: break-word;
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
