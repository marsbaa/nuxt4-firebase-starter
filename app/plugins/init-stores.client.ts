/**
 * Client-side plugin to initialize Pinia stores on app load
 *
 * This plugin handles:
 * - Initializing members store data on authentication
 * - Fetching members once when user signs in
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
        // User signed in - fetch members once
        console.log("[init-stores] User authenticated, fetching members");
        membersStore.fetchMembers();
      } else if (!newUser && oldUser) {
        // User signed out - clear members data
        console.log("[init-stores] User signed out, clearing members data");
        membersStore.members = [];
      }
    },
    { immediate: true },
  );
});
