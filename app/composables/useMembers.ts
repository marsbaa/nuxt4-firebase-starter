import {
  ref as dbRef,
  onValue,
  push,
  set,
  update,
  remove,
  type Database,
} from "firebase/database";

/**
 * Member data interface matching Firebase RTDB structure
 */
export interface Member {
  id?: string;
  name: string;
  birthday: string;
  contact: string;
  email: string;
  suburb: string;
  memberSince: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
  importedAt?: string;
}

/**
 * Parsed name components
 */
export interface ParsedName {
  firstName: string;
  lastName: string;
  fullName: string;
}

interface FirebaseError {
  code: string;
  message: string;
}

/**
 * Convert text to proper case (first letter uppercase, rest lowercase)
 */
const toProperCase = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Parse "LASTNAME, FIRSTNAME" format into components
 * Handles all caps, mixed case, and special characters
 */
export const parseMemberName = (name: string): ParsedName => {
  if (!name || !name.includes(",")) {
    return {
      firstName: "",
      lastName: name || "",
      fullName: name || "",
    };
  }

  const [lastName, firstName] = name.split(",").map((s) => s.trim());

  return {
    firstName: toProperCase(firstName || ""),
    lastName: toProperCase(lastName || ""),
    fullName:
      `${toProperCase(firstName || "")} ${toProperCase(lastName || "")}`.trim(),
  };
};

/**
 * Calculate age from birthday string
 * Handles both "YYYY-MM-DD" and ISO timestamp formats
 */
export const calculateAge = (birthday: string): number => {
  if (!birthday) return 0;

  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Format birthday for display with age
 * Example: "Jan 19, 1945 • Age 81"
 */
export const formatBirthday = (birthday: string): string => {
  if (!birthday) return "No birthday set";

  const date = new Date(birthday);
  const age = calculateAge(birthday);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${formatted} • Age ${age}`;
};

/**
 * Format contact info with fallback
 */
export const formatContact = (contact: string): string => {
  return contact.trim() === "" ? "No contact info" : contact;
};

/**
 * Get member initials for avatar
 * Uses parsed first and last name
 */
export const getMemberInitials = (name: string): string => {
  const { firstName, lastName } = parseMemberName(name);

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (lastName) {
    return lastName.substring(0, 2).toUpperCase();
  }

  return "??";
};

/**
 * Members composable for Firebase RTDB operations
 */
export const useMembers = () => {
  const nuxtApp = useNuxtApp();
  const { user } = useFirebase();
  const toast = useToast();

  // State
  const members = ref<Member[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Get database from the Firebase plugin
  const getDatabase = (): Database | null => {
    return (nuxtApp.$firebase?.rtdb as Database) || null;
  };

  /**
   * Get error message for Firebase errors
   */
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "permission-denied": "You don't have permission to access members data",
      "not-found": "Members data not found",
      unavailable: "The service is temporarily unavailable. Please try again",
      cancelled: "The operation was cancelled",
      "invalid-argument": "Please check the information provided",
    };

    return errorMessages[errorCode] || "Something went wrong. Please try again";
  };

  /**
   * Fetch members list with real-time updates
   */
  const fetchMembers = (): (() => void) => {
    const database = getDatabase();
    if (!database) {
      error.value = "Database not initialized";
      toast.error("Database not initialized");
      isLoading.value = false;
      return () => {};
    }

    isLoading.value = true;
    error.value = null;

    const membersRef = dbRef(database, "members");

    // Set up real-time listener
    const unsubscribe = onValue(
      membersRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          // Convert object to array with IDs
          members.value = Object.entries(data).map(([id, memberData]) => ({
            id,
            ...(memberData as Omit<Member, "id">),
          }));
        } else {
          members.value = [];
        }

        isLoading.value = false;
      },
      (err) => {
        const firebaseError = err as unknown as FirebaseError;
        const errorMessage = getErrorMessage(firebaseError.code);
        error.value = errorMessage;
        toast.error(errorMessage);
        isLoading.value = false;
      },
    );

    return unsubscribe;
  };

  /**
   * Create a new member
   */
  const createMember = async (
    memberData: Omit<Member, "id" | "createdAt" | "createdBy" | "updatedAt">,
  ): Promise<{ success: boolean; error?: string; id?: string }> => {
    try {
      const database = getDatabase();
      if (!database) {
        throw new Error("Database not initialized");
      }

      if (!user.value?.uid) {
        throw new Error("No user is currently logged in");
      }

      const membersRef = dbRef(database, "members");
      const newMemberRef = push(membersRef);
      const now = new Date().toISOString();

      const newMember: Omit<Member, "id"> = {
        ...memberData,
        createdAt: now,
        createdBy: user.value.uid,
        updatedAt: now,
      };

      await set(newMemberRef, newMember);

      toast.success("Member added successfully");
      return { success: true, id: newMemberRef.key || undefined };
    } catch (err) {
      const firebaseError = err as FirebaseError;
      const errorMessage = getErrorMessage(firebaseError.code);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Update an existing member
   */
  const updateMember = async (
    memberId: string,
    memberData: Partial<Omit<Member, "id" | "createdAt" | "createdBy">>,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const database = getDatabase();
      if (!database) {
        throw new Error("Database not initialized");
      }

      if (!user.value?.uid) {
        throw new Error("No user is currently logged in");
      }

      const memberRef = dbRef(database, `members/${memberId}`);
      const now = new Date().toISOString();

      const updates = {
        ...memberData,
        updatedAt: now,
        updatedBy: user.value.uid,
      };

      await update(memberRef, updates);

      toast.success("Member updated successfully");
      return { success: true };
    } catch (err) {
      const firebaseError = err as FirebaseError;
      const errorMessage = getErrorMessage(firebaseError.code);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Delete a member
   */
  const deleteMember = async (
    memberId: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const database = getDatabase();
      if (!database) {
        throw new Error("Database not initialized");
      }

      const memberRef = dbRef(database, `members/${memberId}`);
      await remove(memberRef);

      toast.success("Member deleted successfully");
      return { success: true };
    } catch (err) {
      const firebaseError = err as FirebaseError;
      const errorMessage = getErrorMessage(firebaseError.code);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Search members by name, suburb, or contact
   */
  const searchMembers = (query: string): Member[] => {
    if (!query.trim()) {
      return members.value;
    }

    const searchTerm = query.toLowerCase();

    return members.value.filter((member) => {
      const { fullName } = parseMemberName(member.name);
      return (
        fullName.toLowerCase().includes(searchTerm) ||
        member.suburb.toLowerCase().includes(searchTerm) ||
        member.contact.toLowerCase().includes(searchTerm)
      );
    });
  };

  /**
   * Sort members by name (last name first)
   */
  const sortMembersByName = (membersList: Member[]): Member[] => {
    return [...membersList].sort((a, b) => {
      const nameA = parseMemberName(a.name);
      const nameB = parseMemberName(b.name);

      // Sort by last name, then first name
      const lastNameCompare = nameA.lastName.localeCompare(nameB.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;

      return nameA.firstName.localeCompare(nameB.firstName);
    });
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    members: readonly(members),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    searchMembers,
    sortMembersByName,
    clearError,
  };
};
