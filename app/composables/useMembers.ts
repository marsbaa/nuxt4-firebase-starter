// Server API based member management (uses Firebase Admin SDK)

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
 * Members composable for server API operations
 */
export const useMembers = () => {
  const { user } = useFirebase();
  const toast = useToast();

  // State
  const members = ref<Member[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Polling interval (in ms) - poll every 5 seconds for updates
  const POLL_INTERVAL = 5000;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  /**
   * Get error message for API errors
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
   * Get authentication token for API requests
   */
  const getAuthToken = async (): Promise<string | null> => {
    try {
      if (!user.value) return null;
      // Get the current Firebase ID token
      return await user.value.getIdToken();
    } catch (err) {
      console.error("[useMembers] Error getting auth token:", err);
      return null;
    }
  };

  /**
   * Fetch members list from server API
   */
  const fetchMembers = async (): Promise<void> => {
    console.log("[useMembers] fetchMembers called");

    try {
      isLoading.value = true;
      error.value = null;

      const token = await getAuthToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      console.log("[useMembers] Fetching from /api/members");
      const data = await $fetch<Member[]>("/api/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      members.value = data || [];
      console.log("[useMembers] Members loaded:", members.value.length);
    } catch (err: any) {
      console.error("[useMembers] Error fetching members:", err);
      const errorMessage =
        err.data?.message || err.message || "Failed to fetch members";
      error.value = errorMessage;
      toast.error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Start polling for member updates
   */
  const startPolling = (): (() => void) => {
    console.log("[useMembers] Starting polling");

    // Initial fetch
    fetchMembers();

    // Set up polling
    pollTimer = setInterval(() => {
      fetchMembers();
    }, POLL_INTERVAL);

    // Return cleanup function
    return () => {
      console.log("[useMembers] Stopping polling");
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };
  };

  /**
   * Create a new member
   */
  const createMember = async (
    memberData: Omit<Member, "id" | "createdAt" | "createdBy" | "updatedAt">,
  ): Promise<{ success: boolean; error?: string; id?: string }> => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await $fetch<{ success: boolean; id?: string }>(
        "/api/members",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: memberData,
        },
      );

      toast.success("Member added successfully");

      // Refresh members list
      await fetchMembers();

      return response;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to create member";
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
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      await $fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: memberData,
      });

      toast.success("Member updated successfully");

      // Refresh members list
      await fetchMembers();

      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to update member";
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
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      await $fetch(`/api/members/${memberId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Member deleted successfully");

      // Refresh members list
      await fetchMembers();

      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to delete member";
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
    startPolling,
    createMember,
    updateMember,
    deleteMember,
    searchMembers,
    sortMembersByName,
    clearError,
  };
};
