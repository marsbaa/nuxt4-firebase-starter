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

    const { adminDb } = useFirebaseAdmin();

    // Delete document from Firestore
    await adminDb.collection("members").doc(memberId).delete();

    console.log(`[API] Member deleted: ${memberId}`);
    return { success: true };
  } catch (error: any) {
    console.error("[API] Error deleting member:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to delete member",
    });
  }
});
