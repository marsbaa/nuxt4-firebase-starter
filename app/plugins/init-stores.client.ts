/**
 * Client-side plugin to initialize Pinia stores on app load
 *
 * This plugin handles:
 * - Initializing members store data
 * - Starting/stopping polling based on authentication state
 * - Ensuring stores are ready when components mount
 */

export default defineNuxtPlugin(() => {
  const { user } = useFirebase();
  const membersStore = useMembersStore();

  // Watch for authentication state changes
  watch(
    user,
    (newUser, oldUser) => {
      if (newUser && !oldUser) {
        // User signed in - start polling
        console.log(
          "[init-stores] User authenticated, starting members polling",
        );
        membersStore.startPolling();
      } else if (!newUser && oldUser) {
        // User signed out - stop polling
        console.log("[init-stores] User signed out, stopping members polling");
        membersStore.stopPolling();
      }
    },
    { immediate: true },
  );

  // Initialize stores on app load if user is already authenticated
  if (user.value) {
    console.log(
      "[init-stores] App loaded with authenticated user, starting members polling",
    );
    membersStore.startPolling();
  }

  // Cleanup on app unmount (though this is rarely called in SPA mode)
  onUnmounted(() => {
    console.log("[init-stores] App unmounting, stopping members polling");
    membersStore.stopPolling();
  });
});
