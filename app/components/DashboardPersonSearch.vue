<script setup lang="ts">
import type { Member } from "~/composables/useMembers";

const { members, isLoading: membersLoading } = useMembers();
const router = useRouter();

// Handle member selection - navigate to Care Space
const handleMemberSelect = (memberId: string) => {
  router.push(`/members/view/${memberId}`);
};
</script>

<template>
  <div class="dashboard-person-search">
    <!-- Section header -->
    <div class="search-header">
      <h2 class="search-title">Who would you like to care for?</h2>
      <p class="search-description">
        Search for a person to view their Care Space and continue their story
      </p>
    </div>

    <!-- Member search -->
    <div class="search-wrapper">
      <MemberSearchInput
        :members="members"
        :members-loading="membersLoading"
        placeholder="Search by name or email..."
        :max-results="6"
        @select="handleMemberSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-person-search {
  width: 100%;
  padding: 3rem 1.5rem;
}

.search-header {
  text-align: center;
  margin-bottom: 2rem;
}

.search-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #2d2a26;
  letter-spacing: 0.01em;
  margin-bottom: 0.75rem;
}

@media (min-width: 640px) {
  .search-title {
    font-size: 1.75rem;
  }
}

.search-description {
  font-size: 0.9375rem;
  color: #706c64;
  line-height: 1.625;
  max-width: 40rem;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .search-description {
    font-size: 1rem;
  }
}

.search-wrapper {
  max-width: 32rem;
  margin: 0 auto;
}
</style>
