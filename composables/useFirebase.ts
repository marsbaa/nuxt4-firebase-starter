import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Ref } from "vue";

/**
 * Composable to access Firebase services throughout the application
 * @returns Firebase auth, db, user state, and auth ready state
 */
export const useFirebase = () => {
  const { $firebase } = useNuxtApp();

  return {
    auth: $firebase.auth as Auth,
    db: $firebase.db as Firestore,
    user: $firebase.user as Ref<User | null>,
    isAuthReady: $firebase.isAuthReady as Ref<boolean>,
  };
};
