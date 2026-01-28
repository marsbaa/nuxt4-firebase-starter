<template>
  <div class="flex items-center justify-between">
    <!-- Results info -->
    <div class="text-sm text-slate-600 dark:text-slate-400">
      Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} members
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center space-x-2">
      <!-- Previous button -->
      <button
        :disabled="currentPage === 1"
        :class="[
          'px-3 py-2 rounded-lg transition-colors flex items-center space-x-1',
          currentPage === 1
            ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700',
        ]"
        aria-label="Previous page"
        @click="goToPreviousPage"
      >
        <AppIcon name="material-symbols:chevron-left" :size="20" decorative />
        <span class="text-sm font-medium">Previous</span>
      </button>

      <!-- Page numbers -->
      <button
        v-for="page in displayedPages"
        :key="page"
        :class="[
          'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
          page === currentPage
            ? 'bg-primary text-white'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
        ]"
        :aria-label="`Page ${page}`"
        :aria-current="page === currentPage ? 'page' : undefined"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <!-- Next button -->
      <button
        :disabled="currentPage === totalPages"
        :class="[
          'px-3 py-2 rounded-lg transition-colors flex items-center space-x-1',
          currentPage === totalPages
            ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700',
        ]"
        aria-label="Next page"
        @click="goToNextPage"
      >
        <span class="text-sm font-medium">Next</span>
        <AppIcon name="material-symbols:chevron-right" :size="20" decorative />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Pagination - Page navigation component
 *
 * Provides controls for navigating through paginated content with
 * page numbers, previous/next buttons, and item count display.
 */

interface Props {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Maximum number of page buttons to show */
  maxPages?: number;
}

const emit = defineEmits<{
  /** Emitted when page changes */
  pageChange: [page: number];
}>();

const props = withDefaults(defineProps<Props>(), {
  maxPages: 5,
});

// Calculate start and end item numbers for display
const startItem = computed(() => {
  if (props.totalItems === 0) return 0;
  return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage;
  return Math.min(end, props.totalItems);
});

// Calculate which page numbers to display
const displayedPages = computed(() => {
  const pages: number[] = [];
  const halfMax = Math.floor(props.maxPages / 2);

  let startPage = Math.max(1, props.currentPage - halfMax);
  let endPage = Math.min(props.totalPages, startPage + props.maxPages - 1);

  // Adjust start if we're near the end
  if (endPage - startPage < props.maxPages - 1) {
    startPage = Math.max(1, endPage - props.maxPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Navigation methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("pageChange", page);
  }
};

const goToPreviousPage = () => {
  if (props.currentPage > 1) {
    emit("pageChange", props.currentPage - 1);
  }
};

const goToNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit("pageChange", props.currentPage + 1);
  }
};
</script>
