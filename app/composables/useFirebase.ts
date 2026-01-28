import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Ref } from "vue";

/**
 * Composable to access Firebase services throughout the application
 * @returns Firebase auth, db, user state, and auth ready state
 */
export const useFirebase = () => {
  const nuxtApp = useNuxtApp();

  // Check if Firebase is available (client-side only)
  if (!nuxtApp.$firebase) {
    // Return placeholder values for SSR
    return {
      auth: null as unknown as Auth,
      db: null as unknown as Firestore,
      user: ref<User | null>(null) as Ref<User | null>,
      isAuthReady: ref(false) as Ref<boolean>,
    };
  }

  return {
    auth: nuxtApp.$firebase.auth as Auth,
    db: nuxtApp.$firebase.db as Firestore,
    user: nuxtApp.$firebase.user as Ref<User | null>,
    isAuthReady: nuxtApp.$firebase.isAuthReady as Ref<boolean>,
  };
};
