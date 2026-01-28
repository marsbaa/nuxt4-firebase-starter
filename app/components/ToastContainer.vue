<script setup lang="ts">
const { toasts, dismissToast } = useToast();
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        role="alert"
        @click="dismissToast(toast.id)"
      >
        <div class="toast-content">
          <!-- Icon -->
          <Icon
            :name="
              toast.type === 'success'
                ? 'mdi:check-circle'
                : toast.type === 'error'
                  ? 'mdi:alert-circle'
                  : toast.type === 'warning'
                    ? 'mdi:alert'
                    : 'mdi:information'
            "
            class="toast-icon"
          />

          <!-- Message -->
          <p class="toast-message">{{ toast.message }}</p>

          <!-- Close button -->
          <button
            class="toast-close"
            @click.stop="dismissToast(toast.id)"
            :aria-label="`Close ${toast.type} notification`"
          >
            <Icon name="mdi:close" class="close-icon" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap");

.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 420px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.06);
  border: 1.5px solid;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toast:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 50px rgba(0, 0, 0, 0.12),
    0 6px 16px rgba(0, 0, 0, 0.08);
}

/* Toast types */
.toast-success {
  border-color: #86efac;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.toast-error {
  border-color: #fecdcd;
  background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
}

.toast-warning {
  border-color: #fde68a;
  background: linear-gradient(135deg, #ffffff 0%, #fefce8 100%);
}

.toast-info {
  border-color: #bfdbfe;
  background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
}

/* Toast content */
.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
}

.toast-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast-success .toast-icon {
  color: #16a34a;
}

.toast-error .toast-icon {
  color: #dc6b6b;
}

.toast-warning .toast-icon {
  color: #ca8a04;
}

.toast-info .toast-icon {
  color: #2563eb;
}

.toast-message {
  flex: 1;
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  line-height: 1.5;
  margin: 0;
  color: #2d2a26;
}

.toast-close {
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9c9790;
  transition: all 0.2s ease;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-close:hover {
  color: #2d2a26;
  background: rgba(0, 0, 0, 0.05);
}

.close-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Transitions */
.toast-enter-active {
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  animation: slideOut 0.25s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 640px) {
  .toast-container {
    top: 0.75rem;
    right: 0.75rem;
    left: 0.75rem;
    max-width: none;
  }

  .toast-content {
    padding: 0.875rem 1rem;
  }

  .toast-message {
    font-size: 0.875rem;
  }
}
</style>
