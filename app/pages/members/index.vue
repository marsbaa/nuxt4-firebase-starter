<script setup lang="ts">
import type { Member } from "~/composables/useMembers";
import {
  parseMemberName,
  formatBirthday,
  formatContact,
} from "~/composables/useMembers";

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
  router.push("/members/add");
};

const handleView = (member: Member) => {
  if (!member.id) return;
  router.push(`/members/view/${member.id}`);
};

const handleEdit = (member: Member) => {
  if (!member.id) return;
  router.push(`/members/${member.id}`);
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
    <div v-else>
      <!-- Desktop table view -->
      <div class="table-container desktop-view">
        <MemberTable
          :members="paginatedMembers"
          :start-index="(currentPage - 1) * itemsPerPage"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDeleteClick"
        >
          <template #footer>
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
          </template>
        </MemberTable>
      </div>

      <!-- Mobile card view -->
      <div class="mobile-view">
        <div class="member-cards">
          <div
            v-for="(member, index) in paginatedMembers"
            :key="member.id"
            class="member-card"
          >
            <div class="member-card-header">
              <div class="member-info">
                <MemberAvatar :name="parseMemberName(member.name).fullName" />
                <div class="member-details">
                  <h3 class="member-name">
                    {{ parseMemberName(member.name).fullName }}
                  </h3>
                  <div class="member-meta">
                    <Icon name="mdi:cake-variant" class="meta-icon" />
                    <span class="meta-text">{{
                      formatBirthday(member.birthday)
                    }}</span>
                  </div>
                </div>
              </div>
              <span class="member-number"
                >#{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span
              >
            </div>

            <div class="member-card-body">
              <div v-if="member.contact" class="card-info-row">
                <Icon name="mdi:phone" class="info-icon" />
                <span class="info-text">{{
                  formatContact(member.contact)
                }}</span>
              </div>
              <div v-else class="card-info-row">
                <Icon name="mdi:phone" class="info-icon" />
                <span class="info-text empty">No contact info</span>
              </div>

              <div v-if="member.suburb" class="card-info-row">
                <Icon name="mdi:map-marker" class="info-icon" />
                <span class="info-text">{{ member.suburb }}</span>
              </div>
              <div v-else class="card-info-row">
                <Icon name="mdi:map-marker" class="info-icon" />
                <span class="info-text empty">No location</span>
              </div>
            </div>

            <div class="member-card-actions">
              <button
                @click="handleView(member)"
                class="card-action-btn view"
                aria-label="View member"
              >
                <Icon name="mdi:eye" class="action-icon" />
                <span>View</span>
              </button>
              <button
                @click="handleEdit(member)"
                class="card-action-btn edit"
                aria-label="Edit member"
              >
                <Icon name="mdi:pencil" class="action-icon" />
                <span>Edit</span>
              </button>
              <button
                @click="handleDeleteClick(member)"
                class="card-action-btn delete"
                aria-label="Delete member"
              >
                <Icon name="mdi:delete" class="action-icon" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile pagination -->
        <div class="mobile-pagination">
          <div class="pagination-info">
            Showing {{ displayRange.start }}-{{ displayRange.end }} of
            {{ totalMembers }}
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
  margin-bottom: 1.5rem;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
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

/* Desktop/Mobile view toggle */
.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

/* Mobile card styles */
.member-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-card {
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(44, 44, 42, 0.05);
  transition: all 0.2s ease;
}

.member-card:active {
  transform: scale(0.98);
}

.member-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid #e8e8e5;
  gap: 1rem;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex: 1;
  min-width: 0;
}

.member-details {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #9a9690;
  flex-shrink: 0;
}

.meta-text {
  font-family: "Inter", sans-serif;
  font-size: 0.813rem;
  color: #706c64;
}

.member-number {
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #9a9690;
  flex-shrink: 0;
}

.member-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.card-info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.info-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #c2a47a;
  flex-shrink: 0;
}

.info-text {
  font-family: "Inter", sans-serif;
  font-size: 0.938rem;
  color: #2d2a26;
}

.info-text.empty {
  color: #9a9690;
  font-style: italic;
}

.member-card-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #e8e8e5;
}

.card-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-action-btn:not(:last-child) {
  border-right: 1px solid #e8e8e5;
}

.card-action-btn.view {
  color: #c2a47a;
}

.card-action-btn.view:hover,
.card-action-btn.view:active {
  background: rgba(194, 164, 122, 0.05);
}

.card-action-btn.edit {
  color: #706c64;
}

.card-action-btn.edit:hover,
.card-action-btn.edit:active {
  background: rgba(112, 108, 100, 0.05);
}

.card-action-btn.delete {
  color: #dc2626;
}

.card-action-btn.delete:hover,
.card-action-btn.delete:active {
  background: rgba(220, 38, 38, 0.05);
}

.action-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.mobile-pagination {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.mobile-pagination .pagination-info {
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: #706c64;
  text-align: center;
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
  /* Show mobile view, hide desktop */
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }

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
    margin-bottom: 1.5rem;
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

  .member-card-header {
    padding: 1rem;
  }

  .member-card-body {
    padding: 1rem;
  }

  .member-name {
    font-size: 0.938rem;
  }

  .card-action-btn {
    padding: 0.75rem 0.5rem;
    font-size: 0.813rem;
    gap: 0.375rem;
  }

  .card-action-btn span {
    display: none;
  }

  .action-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
