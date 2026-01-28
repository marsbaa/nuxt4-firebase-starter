import { useFirebaseAdmin } from "../../utils/firebase-admin";

export default defineEventHandler(async (event) => {
  try {
    // Get user from session/auth
    const user = event.context.user;
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized - please log in",
      });
    }

    const { adminRtdb } = useFirebaseAdmin();
    const snapshot = await adminRtdb.ref("members").once("value");
    const data = snapshot.val();

    if (!data) {
      return [];
    }

    // Convert object to array with IDs
    const members = Object.entries(data).map(([id, memberData]) => ({
      id,
      ...(memberData as Record<string, any>),
    }));

    console.log(
      `[API] Retrieved ${members.length} members for user ${user.uid}`,
    );
    return members;
  } catch (error: any) {
    console.error("[API] Error fetching members:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch members",
    });
  }
});
