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

    const memberId = event.context.params?.id;
    if (!memberId) {
      throw createError({
        statusCode: 400,
        message: "Member ID is required",
      });
    }

    const body = await readBody(event);
    const { adminRtdb } = useFirebaseAdmin();

    const now = new Date().toISOString();
    const updates = {
      ...body,
      updatedAt: now,
      updatedBy: user.uid,
    };

    await adminRtdb.ref(`members/${memberId}`).update(updates);

    console.log(`[API] Member updated: ${memberId}`);
    return { success: true };
  } catch (error: any) {
    console.error("[API] Error updating member:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update member",
    });
  }
});
