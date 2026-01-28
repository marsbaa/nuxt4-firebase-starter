import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

/**
 * Firebase client initialization plugin
 * Initializes Firebase Authentication and provides auth state management
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Create a reactive user state
  const user = useState<User | null>("firebase-user", () => null);
  const isAuthReady = useState<boolean>("firebase-auth-ready", () => false);

  // Listen to auth state changes
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    if (!isAuthReady.value) {
      isAuthReady.value = true;
    }
  });

  // Provide Firebase services to the app
  return {
    provide: {
      firebase: {
        auth,
        db,
        user,
        isAuthReady,
      },
    },
  };
});
