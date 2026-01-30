<script setup lang="ts">
const { members, isLoading: membersLoading, fetchMembers } = useMembers();
const router = useRouter();

// Handle member selection - navigate to Care Space
const handleMemberSelect = (memberId: string) => {
  router.push(`/members/view/${memberId}`);
};

// Fetch members on mount
onMounted(async () => {
  await fetchMembers();
});
</script>

<template>
  <div class="opening-moment">
    <!-- Main greeting - elegant serif font with italic -->
    <h1 class="greeting">Peace be with you.</h1>

    <!-- Reflective prompt -->
    <p class="prompt">Who is on your heart today?</p>

    <!-- Member search -->
    <div class="search-container">
      <MemberSearchInput
        :members="members"
        :members-loading="membersLoading"
        placeholder="Search for a name..."
        :max-results="6"
        @select="handleMemberSelect"
      />
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500&display=swap");

.opening-moment {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 4rem 1.5rem 3rem;
  text-align: center;
  background: transparent;
}

@media (min-width: 640px) {
  .opening-moment {
    padding: 5rem 2rem 4rem;
  }
}

/* Main greeting - Cormorant Garamond with italic */
.greeting {
  font-family: "Cormorant Garamond", serif;
  font-size: 2rem;
  font-weight: 400;
  font-style: italic;
  color: #2d2a26;
  letter-spacing: 0.01em;
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .greeting {
    font-size: 2.5rem;
  }
}

@media (min-width: 768px) {
  .greeting {
    font-size: 3rem;
  }
}

/* Reflective prompt - Inter */
.prompt {
  font-family: "Inter", sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  color: #706c64;
  line-height: 1.5;
  margin: 0 0 2rem 0;
}

@media (min-width: 640px) {
  .prompt {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
}

/* Search container */
.search-container {
  max-width: 32rem;
  margin: 0 auto;
  position: relative;
  z-index: 50;
}
</style>
