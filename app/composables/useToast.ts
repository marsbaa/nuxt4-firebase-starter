export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

const toasts = ref<Toast[]>([]);

/**
 * Toast notification composable
 * Provides global toast notifications
 */
export const useToast = () => {
  /**
   * Show a toast notification
   */
  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 5000,
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;

    const toast: Toast = {
      id,
      message,
      type,
      duration,
    };

    toasts.value.push(toast);

    // Auto dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  };

  /**
   * Show success toast
   */
  const success = (message: string, duration?: number) => {
    return showToast(message, "success", duration);
  };

  /**
   * Show error toast
   */
  const error = (message: string, duration?: number) => {
    return showToast(message, "error", duration);
  };

  /**
   * Show info toast
   */
  const info = (message: string, duration?: number) => {
    return showToast(message, "info", duration);
  };

  /**
   * Show warning toast
   */
  const warning = (message: string, duration?: number) => {
    return showToast(message, "warning", duration);
  };

  /**
   * Dismiss a specific toast by ID
   */
  const dismissToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  /**
   * Clear all toasts
   */
  const clearAll = () => {
    toasts.value = [];
  };

  return {
    toasts: readonly(toasts),
    showToast,
    success,
    error,
    info,
    warning,
    dismissToast,
    clearAll,
  };
};
