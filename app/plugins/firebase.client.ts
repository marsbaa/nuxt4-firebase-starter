import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase client initialization plugin
 * Initializes Firebase Authentication and provides auth state management
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Initialize Firebase with runtime config
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string,
  };

  // Initialize Firebase only if it hasn't been initialized yet
  const firebaseApp =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

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
