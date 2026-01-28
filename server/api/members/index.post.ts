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
    const { adminRtdb } = useFirebaseAdmin();

    // Generate new member ID
    const newMemberRef = adminRtdb.ref("members").push();
    const now = new Date().toISOString();

    const newMember = {
      ...body,
      createdAt: now,
      createdBy: user.uid,
      updatedAt: now,
    };

    await newMemberRef.set(newMember);

    console.log(`[API] Member created: ${newMemberRef.key}`);
    return {
      success: true,
      id: newMemberRef.key,
      member: { id: newMemberRef.key, ...newMember },
    };
  } catch (error: any) {
    console.error("[API] Error creating member:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create member",
    });
  }
});
