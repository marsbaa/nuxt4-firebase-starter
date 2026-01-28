import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User,
} from "firebase/auth";

interface AuthError {
  code: string;
  message: string;
}

/**
 * Authentication composable providing login, logout, and registration functionality
 * @returns Authentication methods and state
 */
export const useAuth = () => {
  const { auth, user, isAuthReady } = useFirebase();
  const router = useRouter();

  // Loading and error states
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Translate Firebase error codes to user-friendly messages
   */
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "auth/invalid-email": "Please enter a valid email address",
      "auth/user-disabled": "This account has been disabled",
      "auth/user-not-found": "No account found with this email",
      "auth/wrong-password": "Incorrect password",
      "auth/invalid-credential": "Invalid email or password",
      "auth/email-already-in-use": "An account with this email already exists",
      "auth/weak-password": "Password should be at least 6 characters",
      "auth/too-many-requests": "Too many attempts. Please try again later",
      "auth/network-request-failed":
        "Network error. Please check your connection",
      "auth/requires-recent-login":
        "Please log out and log back in to perform this action",
    };

    return (
      errorMessages[errorCode] ||
      "An unexpected error occurred. Please try again"
    );
  };

  /**
   * Log in with email and password
   */
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getErrorMessage(authError.code);
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Register a new user with email and password
   */
  const register = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getErrorMessage(authError.code);
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Log out the current user
   */
  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      await signOut(auth);
      await router.push("/login");
      return { success: true };
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getErrorMessage(authError.code);
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Change password for the current user
   */
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error("No user is currently logged in");
      }

      // Reauthenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);
      return { success: true };
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getErrorMessage(authError.code);
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    user: user as Ref<User | null>,
    isAuthenticated: computed(() => !!user.value),
    isAuthReady,
    isLoading: readonly(isLoading),
    error: readonly(error),
    login,
    register,
    logout,
    changePassword,
    clearError,
  };
};
