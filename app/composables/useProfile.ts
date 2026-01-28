import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { updateProfile, type User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt?: any;
  updatedAt?: any;
}

interface FirestoreError {
  code: string;
  message: string;
}

/**
 * User profile composable providing Firestore profile operations
 * @returns Profile methods and state
 */
export const useProfile = () => {
  const { db, user } = useFirebase();
  const { user: authUser } = useAuth();
  const toast = useToast();

  // Loading and error states
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const profile = ref<UserProfile | null>(null);

  /**
   * Get error message for Firestore errors
   */
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "permission-denied":
        "You don't have permission to access this information",
      "not-found": "We couldn't find your profile",
      unavailable: "The service is temporarily unavailable. Please try again",
      cancelled: "The operation was cancelled",
      "invalid-argument": "Please check the information provided",
    };

    return errorMessages[errorCode] || "Something went wrong. Please try again";
  };

  /**
   * Get user initials for avatar
   */
  const getUserInitials = (displayName: string, email: string): string => {
    if (displayName && displayName.trim()) {
      const names = displayName
        .trim()
        .split(" ")
        .filter((n) => n.length > 0);
      if (names.length >= 2) {
        const first = names[0]?.[0];
        const last = names[names.length - 1]?.[0];
        if (first && last) {
          return `${first}${last}`.toUpperCase();
        }
      }
      const first = names[0]?.[0];
      if (first) {
        return first.toUpperCase();
      }
    }
    // Fall back to email
    const emailFirst = email?.[0];
    return emailFirst?.toUpperCase() || "U";
  };

  /**
   * Create a new profile document in Firestore
   */
  const createProfile = async (
    uid: string,
    email: string,
    displayName: string = "",
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const profileData: UserProfile = {
        uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", uid), profileData);
      return { success: true };
    } catch (err) {
      const firestoreError = err as FirestoreError;
      const errorMessage = getErrorMessage(firestoreError.code);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Fetch user profile from Firestore
   */
  const fetchProfile = async (
    uid?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const userId = uid || user.value?.uid;
      if (!userId) {
        throw new Error("No user ID provided");
      }

      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        profile.value = docSnap.data() as UserProfile;
      } else {
        // Profile doesn't exist, create one
        const email = authUser.value?.email || "";
        const displayName = authUser.value?.displayName || "";
        await createProfile(userId, email, displayName);
        profile.value = {
          uid: userId,
          email,
          displayName,
        };
      }

      return { success: true };
    } catch (err) {
      const firestoreError = err as FirestoreError;
      const errorMessage = getErrorMessage(firestoreError.code);
      error.value = errorMessage;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update user profile in Firestore and Firebase Auth
   */
  const updateUserProfile = async (data: {
    displayName?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const userId = user.value?.uid;
      const currentUser = authUser.value;

      if (!userId || !currentUser) {
        throw new Error("No user is currently logged in");
      }

      // Update Firestore
      const docRef = doc(db, "users", userId);
      const updateData: Partial<UserProfile> = {
        updatedAt: serverTimestamp(),
      };

      if (data.displayName !== undefined) {
        updateData.displayName = data.displayName;
      }

      await updateDoc(docRef, updateData);

      // Update Firebase Auth profile
      if (data.displayName !== undefined) {
        await updateProfile(currentUser, {
          displayName: data.displayName,
        });
      }

      // Update local profile state
      if (profile.value) {
        profile.value = {
          ...profile.value,
          ...data,
        };
      }

      toast.success("Your profile has been updated");
      return { success: true };
    } catch (err) {
      const firestoreError = err as FirestoreError;
      const errorMessage = getErrorMessage(firestoreError.code);
      error.value = errorMessage;
      toast.error(errorMessage);
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
    profile: readonly(profile),
    isLoading: readonly(isLoading),
    error: readonly(error),
    getUserInitials,
    fetchProfile,
    updateUserProfile,
    createProfile,
    clearError,
  };
};
