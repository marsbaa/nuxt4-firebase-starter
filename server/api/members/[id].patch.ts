import { useFirebaseAdmin } from "../../utils/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

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
    const { adminDb } = useFirebaseAdmin();

    // Map app fields to Firestore schema
    // App sends: name, suburb, contact, birthday, email, memberSince
    // Firestore expects: firstName, lastName, displayName, city, phone, birthday, notes
    const updates: any = {
      updatedAt: Timestamp.now(),
      updatedBy: user.uid,
    };

    // Parse and update name if provided
    if (body.name !== undefined) {
      const nameParts = body.name
        ? body.name.split(",").map((s: string) => s.trim())
        : ["", ""];
      updates.lastName = nameParts[0] || "";
      updates.firstName = nameParts[1] || "";
      updates.displayName = body.name || "";
    }

    // Map other fields
    if (body.suburb !== undefined) {
      updates.city = body.suburb;
    }
    if (body.contact !== undefined) {
      updates.phone = body.contact;
    }
    if (body.email !== undefined) {
      updates.email = body.email;
    }
    if (body.memberSince !== undefined) {
      updates.notes = body.memberSince;
    }

    // Convert birthday string to Firestore Timestamp if provided
    if (body.birthday !== undefined) {
      if (body.birthday) {
        try {
          updates.birthday = Timestamp.fromDate(new Date(body.birthday));
        } catch (e) {
          console.error("Error parsing birthday:", e);
        }
      } else {
        updates.birthday = null;
      }
    }

    // Update document in Firestore
    await adminDb.collection("members").doc(memberId).update(updates);

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
