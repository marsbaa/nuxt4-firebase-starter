<script setup lang="ts">
const { user, logout, isLoading: authLoading } = useAuth();
const {
  profile,
  fetchProfile,
  isLoading: profileLoading,
  getUserInitials,
} = useProfile();
const router = useRouter();
const route = useRoute();

// Mobile navigation state
const isMobileMenuOpen = ref(false);

// Load user profile on mount
onMounted(async () => {
  if (user.value?.uid) {
    await fetchProfile(user.value.uid);
  }
});

// Close mobile menu when route changes
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  },
);

// Navigation items
const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "mdi:view-dashboard",
  },
  {
    name: "Members",
    path: "/members",
    icon: "mdi:account-group",
  },
  {
    name: "Your Profile",
    path: "/profile",
    icon: "mdi:account",
  },
  {
    name: "Your Settings",
    path: "/settings",
    icon: "mdi:cog",
  },
];

// Check if a nav item is active
const isActiveRoute = (path: string) => {
  return route.path === path;
};

// Handle logout
const handleLogout = async () => {
  const result = await logout();
  if (result.success) {
    await router.push("/login");
  }
};

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Get display name for welcome message
const displayName = computed(() => {
  return profile.value?.displayName || user.value?.displayName || "there";
});

// Get user initials for avatar
const userInitials = computed(() => {
  if (profile.value) {
    return getUserInitials(profile.value.displayName, profile.value.email);
  }
  return user.value?.email?.[0]?.toUpperCase() || "U";
});

// Get page title from route
const pageTitle = computed(() => {
  const currentNav = navItems.find((item) => item.path === route.path);
  return currentNav?.name || "Dashboard";
});
</script>

<template>
  <div class="dashboard-layout">
    <!-- Mobile header with hamburger menu -->
    <header class="mobile-header">
      <button
        @click="toggleMobileMenu"
        class="mobile-menu-btn"
        aria-label="Toggle navigation menu"
      >
        <Icon
          :name="isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'"
          class="menu-icon"
        />
      </button>
      <h1 class="mobile-title">{{ pageTitle }}</h1>
      <div class="mobile-avatar">
        <div class="avatar-circle">{{ userInitials }}</div>
      </div>
    </header>

    <!-- Sidebar navigation -->
    <nav class="sidebar" :class="{ 'is-open': isMobileMenuOpen }">
      <!-- Sidebar header -->
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <Icon name="heroicons:heart" class="logo-icon" />
          <span class="logo-text">Pastoral Care</span>
        </div>
      </div>

      <!-- User profile section in sidebar -->
      <div class="sidebar-profile">
        <div class="profile-avatar">
          {{ userInitials }}
        </div>
        <div class="profile-info">
          <div class="profile-name">{{ displayName }}</div>
          <div class="profile-email">{{ user?.email }}</div>
        </div>
      </div>

      <!-- Navigation menu -->
      <ul class="nav-menu">
        <li v-for="item in navItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="nav-link"
            :class="{ 'is-active': isActiveRoute(item.path) }"
          >
            <Icon :name="item.icon" class="nav-icon" />
            <span class="nav-text">{{ item.name }}</span>
          </NuxtLink>
        </li>
      </ul>

      <!-- Logout button -->
      <div class="sidebar-footer">
        <button
          @click="handleLogout"
          :disabled="authLoading"
          class="logout-btn"
        >
          <Icon name="mdi:logout" class="nav-icon" />
          <span class="nav-text">Sign out</span>
        </button>
      </div>
    </nav>

    <!-- Mobile menu overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="mobile-overlay"
      @click="toggleMobileMenu"
    ></div>

    <!-- Main content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap");

/* Base layout */
.dashboard-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf9f7 0%, #f5f3ef 100%);
  position: relative;
  display: flex;
}

.dashboard-layout::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

/* Mobile header */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(232, 230, 225, 0.8);
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}

.mobile-menu-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #2d2a26;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.mobile-title {
  font-family: "Crimson Pro", serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0;
}

.mobile-avatar {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d9bc9b 0%, #c9a87c 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Work Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Mobile overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 90;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Sidebar navigation */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #fafaf8;
  border-right: 1px solid #e8e8e5;
  display: flex;
  flex-direction: column;
  z-index: 50;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 15px 0 rgba(44, 44, 42, 0.03);
}

.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e8e8e5;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  color: #d9bc9b;
}

.logo-text {
  font-family: "Crimson Pro", serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2a26;
  letter-spacing: -0.02em;
}

/* Sidebar profile */
.sidebar-profile {
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e8e8e5;
  background: rgba(247, 246, 244, 0.5);
}

.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d9bc9b 0%, #c9a87c 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Work Sans", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  font-weight: 600;
  color: #2d2a26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-email {
  font-family: "Work Sans", sans-serif;
  font-size: 0.813rem;
  color: #706c64;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.25rem;
}

/* Navigation menu */
.nav-menu {
  flex: 1;
  padding: 1.5rem 1rem;
  list-style: none;
  margin: 0;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  font-weight: 500;
  color: #6b6b68;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.nav-link:hover {
  background: rgba(122, 155, 118, 0.08);
  color: #2c2c2a;
}

.nav-link.is-active {
  background: rgba(122, 155, 118, 0.15);
  color: #5f7d5c;
  font-weight: 600;
  box-shadow: 0 1px 2px 0 rgba(122, 155, 118, 0.15);
}

.nav-icon {
  width: 1.375rem;
  height: 1.375rem;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
}

/* Sidebar footer */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #e8e8e5;
  background: rgba(247, 246, 244, 0.5);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 1rem 1.125rem;
  font-family: "Work Sans", sans-serif;
  font-size: 0.938rem;
  font-weight: 500;
  color: #6b6b68;
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover:not(:disabled) {
  background: rgba(156, 139, 122, 0.06);
  border-color: #9c8b7a;
  color: #9c8b7a;
  box-shadow: 0 1px 2px 0 rgba(44, 44, 42, 0.05);
}

.logout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Main content */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 3rem;
  animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .main-content {
    padding: 2.5rem 2rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }

  .sidebar {
    transform: translateX(-100%);
    z-index: 100;
  }

  .sidebar.is-open {
    transform: translateX(0);
  }

  .mobile-overlay {
    display: block;
  }

  .main-content {
    margin-left: 0;
    margin-top: 60px;
    padding: 2rem 1.5rem;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .main-content {
    padding: 1.5rem 1rem;
  }
}
</style>
