import { defineStore } from "pinia";
import type { Member } from "~/composables/useMembers";
import { parseMemberName, sortMembersByName } from "~/composables/useMembers";

interface FirebaseError {
  code: string;
  message: string;
}

export const useMembersStore = defineStore("members", {
  state: () => ({
    members: [] as Member[],
    isLoading: false,
    error: null as string | null,
    pollTimer: null as NodeJS.Timeout | null,
  }),

  getters: {
    /**
     * Search members by name, suburb, or contact
     */
    searchMembers:
      (state) =>
      (query: string): Member[] => {
        if (!query.trim()) {
          return state.members;
        }

        const searchTerm = query.toLowerCase();

        return state.members.filter((member) => {
          const { fullName } = parseMemberName(member.name);
          return (
            fullName.toLowerCase().includes(searchTerm) ||
            member.suburb.toLowerCase().includes(searchTerm) ||
            member.contact.toLowerCase().includes(searchTerm)
          );
        });
      },

    /**
     * Get sorted members by name (last name first)
     */
    sortedMembers: (state): Member[] => {
      return sortMembersByName(state.members);
    },
  },

  actions: {
    /**
     * Get error message for API errors
     */
    getErrorMessage(errorCode: string): string {
      const errorMessages: Record<string, string> = {
        "permission-denied": "You don't have permission to access members data",
        "not-found": "Members data not found",
        unavailable: "The service is temporarily unavailable. Please try again",
        cancelled: "The operation was cancelled",
        "invalid-argument": "Please check the information provided",
      };

      return (
        errorMessages[errorCode] || "Something went wrong. Please try again"
      );
    },

    /**
     * Get authentication token for API requests
     */
    async getAuthToken(): Promise<string | null> {
      try {
        const { user } = useFirebase();
        if (!user.value) return null;
        // Get the current Firebase ID token
        return await user.value.getIdToken();
      } catch (err) {
        console.error("[useMembersStore] Error getting auth token:", err);
        return null;
      }
    },

    /**
     * Fetch members list from server API
     */
    async fetchMembers(): Promise<void> {
      try {
        this.isLoading = true;
        this.error = null;

        const token = await this.getAuthToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        const data = await $fetch<Member[]>("/api/members", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.members = data || [];
      } catch (err: any) {
        console.error("[useMembersStore] Error fetching members:", err);
        const errorMessage =
          err.data?.message || err.message || "Failed to fetch members";
        this.error = errorMessage;
        const toast = useToast();
        toast.error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Start polling for member updates
     */
    startPolling(): void {
      // Stop existing polling if any
      this.stopPolling();

      // Initial fetch
      this.fetchMembers();

      // Set up polling - poll every 5 seconds
      this.pollTimer = setInterval(() => {
        this.fetchMembers();
      }, 5000);
    },

    /**
     * Stop polling for member updates
     */
    stopPolling(): void {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },

    /**
     * Create a new member
     */
    async createMember(
      memberData: Omit<Member, "id" | "createdAt" | "createdBy" | "updatedAt">,
    ): Promise<{ success: boolean; error?: string; id?: string }> {
      try {
        const token = await this.getAuthToken();
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

        const toast = useToast();
        toast.success("Member added successfully");

        // Refresh members list
        await this.fetchMembers();

        return response;
      } catch (err: any) {
        const errorMessage =
          err.data?.message || err.message || "Failed to create member";
        const toast = useToast();
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },

    /**
     * Update an existing member
     */
    async updateMember(
      memberId: string,
      memberData: Partial<Omit<Member, "id" | "createdAt" | "createdBy">>,
    ): Promise<{ success: boolean; error?: string }> {
      try {
        const token = await this.getAuthToken();
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

        const toast = useToast();
        toast.success("Member updated successfully");

        // Refresh members list
        await this.fetchMembers();

        return { success: true };
      } catch (err: any) {
        const errorMessage =
          err.data?.message || err.message || "Failed to update member";
        const toast = useToast();
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },

    /**
     * Delete a member
     */
    async deleteMember(
      memberId: string,
    ): Promise<{ success: boolean; error?: string }> {
      try {
        const token = await this.getAuthToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        await $fetch(`/api/members/${memberId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const toast = useToast();
        toast.success("Member deleted successfully");

        // Refresh members list
        await this.fetchMembers();

        return { success: true };
      } catch (err: any) {
        const errorMessage =
          err.data?.message || err.message || "Failed to delete member";
        const toast = useToast();
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },

    /**
     * Clear error message
     */
    clearError(): void {
      this.error = null;
    },
  },
});
