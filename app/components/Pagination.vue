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
      <template
        v-for="(page, index) in displayedPagesWithEllipsis"
        :key="index"
      >
        <span v-if="page === '...'" class="px-3 py-1 text-sm text-slate-400">
          ...
        </span>
        <button
          v-else
          :class="[
            'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
            page === currentPage
              ? 'bg-primary text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
          ]"
          :aria-label="`Page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </button>
      </template>

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

// Calculate which page numbers to display with ellipsis
const displayedPagesWithEllipsis = computed(() => {
  const pages: (number | string)[] = [];

  if (props.totalPages <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (props.currentPage <= 3) {
      // Near the start: show 1, 2, 3, ..., last
      pages.push(2, 3, "...", props.totalPages);
    } else if (props.currentPage >= props.totalPages - 2) {
      // Near the end: show 1, ..., last-2, last-1, last
      pages.push(
        "...",
        props.totalPages - 2,
        props.totalPages - 1,
        props.totalPages,
      );
    } else {
      // Middle: show 1, ..., current, ..., last
      pages.push("...", props.currentPage, "...", props.totalPages);
    }
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
