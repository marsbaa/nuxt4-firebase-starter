/**
 * Viewport detection utilities for responsive behavior
 */
export const useViewport = () => {
  /**
   * Check if current viewport is mobile (< 768px)
   */
  const isMobile = (): boolean => {
    if (process.client) {
      return window.innerWidth < 768;
    }
    return false; // Default to desktop on server
  };

  /**
   * Check if current viewport is desktop/tablet (≥ 768px)
   */
  const isDesktop = (): boolean => {
    return !isMobile();
  };

  return {
    isMobile,
    isDesktop,
  };
};
