<script setup lang="ts">
import type { Member } from "~/composables/useMembers";
import { parseMemberName } from "~/composables/useMembers";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

// Composables
const {
  members,
  isLoading,
  error,
  fetchMembers,
  deleteMember,
  searchMembers,
  sortMembersByName,
  clearError,
} = useMembers();
const router = useRouter();
const nuxtApp = useNuxtApp();
const { user } = useFirebase();

// State
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(5);
const showDeleteConfirm = ref(false);
const memberToDelete = ref<Member | null>(null);

// Computed
const filteredMembers = computed(() => {
  const searched = searchMembers(searchQuery.value);
  return sortMembersByName(searched);
});

const totalMembers = computed(() => filteredMembers.value.length);

const totalPages = computed(() => {
  return Math.ceil(totalMembers.value / itemsPerPage.value);
});

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredMembers.value.slice(start, end);
});

const displayRange = computed(() => {
  if (totalMembers.value === 0) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(
    currentPage.value * itemsPerPage.value,
    totalMembers.value,
  );
  return { start, end };
});

// Debounced search implementation
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
const debouncedSearchValue = ref("");

const updateSearch = (value: string) => {
  debouncedSearchValue.value = value;
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery.value = value;
  }, 300);
};

// Watch search query and reset to first page
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
  console.log("[Members Page] Component mounted");
  console.log("[Members Page] User:", user.value);

  // Fetch members data once on mount
  fetchMembers();

  console.log("[Members Page] Fetch initiated, isLoading:", isLoading.value);
});

onUnmounted(() => {
  console.log("[Members Page] Component unmounting");
  clearError();
});

// Methods
const handleNewMember = () => {
  // TODO: Navigate to member creation page or open modal
  console.log("New member clicked");
};

const handleView = (member: Member) => {
  // TODO: Navigate to member detail page
  console.log("View member:", member);
};

const handleEdit = (member: Member) => {
  // TODO: Navigate to member edit page or open modal
  console.log("Edit member:", member);
};

const handleDeleteClick = (member: Member) => {
  memberToDelete.value = member;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!memberToDelete.value?.id) return;

  const result = await deleteMember(memberToDelete.value.id);
  if (result.success) {
    // Adjust current page if needed
    if (paginatedMembers.value.length === 1 && currentPage.value > 1) {
      currentPage.value--;
    }
  }

  showDeleteConfirm.value = false;
  memberToDelete.value = null;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  memberToDelete.value = null;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="members-page">
    <!-- Page header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Members</h1>
        <p class="page-subtitle">Manage and care for your community members</p>
      </div>
      <AppButton
        @click="handleNewMember"
        variant="primary"
        class="new-member-btn"
      >
        <Icon name="mdi:plus" class="btn-icon" />
        <span>New Member</span>
      </AppButton>
    </div>

    <!-- Search and count -->
    <div class="search-section">
      <div class="search-wrapper">
        <Icon name="mdi:magnify" class="search-icon" />
        <input
          v-model="debouncedSearchValue"
          @input="updateSearch(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search by name, email or location..."
          class="search-input"
        />
      </div>
      <div class="member-count">
        <span class="count-number">{{ totalMembers }}</span>
        <span class="count-label"
          >{{ totalMembers === 1 ? "member" : "members" }} total</span
        >
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading members...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <Icon name="mdi:alert-circle-outline" class="error-icon" />
      <p class="error-text">{{ error }}</p>
      <AppButton @click="fetchMembers" variant="secondary">
        Try Again
      </AppButton>
    </div>

    <!-- Empty state -->
    <div v-else-if="totalMembers === 0" class="empty-state">
      <Icon name="mdi:account-group-outline" class="empty-icon" />
      <h3 class="empty-title">No members yet</h3>
      <p class="empty-text">
        {{
          searchQuery
            ? "No members match your search"
            : "Get started by adding your first member to the community"
        }}
      </p>
      <AppButton
        v-if="!searchQuery"
        @click="handleNewMember"
        variant="primary"
        class="empty-action"
      >
        <Icon name="mdi:plus" class="btn-icon" />
        <span>Add First Member</span>
      </AppButton>
    </div>

    <!-- Members table -->
    <div v-else class="table-container">
      <MemberTable
        :members="paginatedMembers"
        :start-index="(currentPage - 1) * itemsPerPage"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          Showing {{ displayRange.start }} to {{ displayRange.end }} of
          {{ totalMembers }} members
        </div>
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalMembers"
          :items-per-page="itemsPerPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <Icon name="mdi:alert-circle-outline" class="modal-icon" />
            <h3 class="modal-title">Confirm Deletion</h3>
          </div>
          <p class="modal-text">
            Are you sure you want to delete
            <strong>{{
              memberToDelete
                ? parseMemberName(memberToDelete.name).fullName
                : ""
            }}</strong
            >? This action cannot be undone.
          </p>
          <div class="modal-actions">
            <AppButton @click="cancelDelete" variant="secondary">
              Cancel
            </AppButton>
            <AppButton @click="confirmDelete" variant="danger">
              Delete Member
            </AppButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@600;700&family=Inter:wght@400;500;600&display=swap");

/* Page structure */
.members-page {
  max-width: 90rem;
  margin: 0 auto;
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Page header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 2rem;
}

.page-title {
  font-family: "Crimson Pro", serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2d2a26;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #706c64;
  margin: 0;
}

.new-member-btn {
  flex-shrink: 0;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

/* Search section */
.search-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 28rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9a9690;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #2d2a26;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: #9a9690;
}

.search-input:focus {
  outline: none;
  border-color: #c2a47a;
  box-shadow: 0 0 0 3px rgba(194, 164, 122, 0.1);
}

.member-count {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.count-number {
  font-family: "Inter", sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d2a26;
}

.count-label {
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #9a9690;
  font-weight: 400;
}

/* Table container */
.table-container {
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(44, 44, 42, 0.05);
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e8e8e5;
  background: rgba(247, 246, 244, 0.5);
}

.pagination-info {
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: #706c64;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e8e8e5;
  border-top-color: #c2a47a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #706c64;
}

/* Error state */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-text {
  margin: 0 0 1.5rem 0;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  color: #706c64;
  text-align: center;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
}

.empty-icon {
  width: 5rem;
  height: 5rem;
  color: #c2a47a;
  opacity: 0.4;
  margin-bottom: 1.5rem;
}

.empty-title {
  margin: 0 0 0.75rem 0;
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2a26;
}

.empty-text {
  margin: 0 0 2rem 0;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  color: #706c64;
  text-align: center;
  max-width: 28rem;
}

.empty-action {
  margin-top: 0.5rem;
}

/* Delete modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.modal-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #dc2626;
  flex-shrink: 0;
}

.modal-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0;
}

.modal-text {
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  color: #706c64;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.modal-text strong {
  color: #2d2a26;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .new-member-btn {
    width: 100%;
  }

  .search-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    max-width: none;
  }

  .member-count {
    align-self: flex-start;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.875rem;
  }

  .pagination-wrapper {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .pagination-info {
    text-align: center;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .page-header {
    gap: 1rem;
  }

  .search-section {
    margin-bottom: 1.5rem;
  }

  .empty-state {
    padding: 3rem 1.5rem;
  }

  .modal-content {
    padding: 1.5rem;
  }
}
</style>
