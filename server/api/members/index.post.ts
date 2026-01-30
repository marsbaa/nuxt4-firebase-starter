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

    const body = await readBody(event);
    const { adminDb } = useFirebaseAdmin();

    const now = new Date().toISOString();

    const newMember = {
      ...body,
      createdAt: now,
      createdBy: user.uid,
      updatedAt: now,
    };

    // Add document to Firestore
    const docRef = await adminDb.collection("members").add(newMember);

    console.log(`[API] Member created: ${docRef.id}`);
    return {
      success: true,
      id: docRef.id,
      member: { id: docRef.id, ...newMember },
    };
  } catch (error: any) {
    console.error("[API] Error creating member:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create member",
    });
  }
});
