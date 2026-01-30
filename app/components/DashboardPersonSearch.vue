<script setup lang="ts">
import type { Member } from "~/composables/useMembers";

const membersStore = useMembersStore();
const router = useRouter();

// Handle member selection - navigate to Care Space
const handleMemberSelect = (memberId: string) => {
  router.push(`/members/view/${memberId}`);
};

// Fetch members on mount if not loaded
onMounted(async () => {
  if (membersStore.members.length === 0) {
    await membersStore.fetchMembers();
  }
});
</script>

<template>
  <div class="dashboard-person-search">
    <!-- Member search - simple, centered -->
    <div class="search-wrapper">
      <MemberSearchInput
        :members="membersStore.members"
        :members-loading="membersStore.isLoading"
        placeholder="Search for a name..."
        :max-results="6"
        @select="handleMemberSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-person-search {
  width: 100%;
  padding: 2rem 1.5rem 3rem;
}

.search-wrapper {
  max-width: 34rem;
  margin: 0 auto;
}
</style>
