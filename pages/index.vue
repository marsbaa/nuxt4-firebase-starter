<script setup lang="ts">
const { user, isAuthReady } = useFirebase();
const router = useRouter();

// Wait for auth to be ready, then redirect
watchEffect(async () => {
  if (isAuthReady.value) {
    if (user.value) {
      await router.push("/dashboard");
    } else {
      await router.push("/login");
    }
  }
});
</script>

<template>
  <div class="loading-container">
    <div class="loading-content">
      <Icon name="mdi:loading" class="loading-icon" />
      <p class="loading-text">Loading...</p>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500&display=swap");

.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #faf9f7 0%, #f5f3ef 100%);
}

.loading-content {
  text-align: center;
}

.loading-icon {
  width: 3rem;
  height: 3rem;
  color: #d9bc9b;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  color: #706c64;
  margin-top: 1rem;
}
</style>
