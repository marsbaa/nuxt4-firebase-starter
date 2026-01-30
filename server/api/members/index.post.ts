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

    const body = await readBody(event);
    const { adminDb } = useFirebaseAdmin();

    // Parse the name from "LASTNAME, FIRSTNAME" format
    const nameParts = body.name
      ? body.name.split(",").map((s: string) => s.trim())
      : ["", ""];
    const lastName = nameParts[0] || "";
    const firstName = nameParts[1] || "";

    // Convert birthday string to Firestore Timestamp
    let birthdayTimestamp = null;
    if (body.birthday) {
      try {
        birthdayTimestamp = Timestamp.fromDate(new Date(body.birthday));
      } catch (e) {
        console.error("Error parsing birthday:", e);
      }
    }

    const now = Timestamp.now();

    // Map app fields to Firestore schema
    // App sends: name, suburb, contact, birthday, email, memberSince
    // Firestore expects: firstName, lastName, displayName, city, phone, birthday, notes
    const newMember = {
      firstName: firstName,
      lastName: lastName,
      displayName: body.name || "",
      city: body.suburb || "",
      phone: body.contact || "",
      birthday: birthdayTimestamp,
      email: body.email || "",
      notes: body.memberSince || "", // Store memberSince in notes field
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
