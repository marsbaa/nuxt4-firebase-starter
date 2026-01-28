/**
 * Authentication middleware to protect routes
 * Redirects unauthenticated users to the login page
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, isAuthReady } = useFirebase();

  // Wait for auth state to be initialized
  while (!isAuthReady.value) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // If user is not authenticated, redirect to login
  if (!user.value) {
    // Store the intended destination for redirect after login
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});
