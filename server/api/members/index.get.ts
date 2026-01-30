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

    const { adminDb } = useFirebaseAdmin();

    // Query Firestore for all members
    // Note: In V1, all authenticated users can access all members
    const membersSnapshot = await adminDb.collection("members").get();

    if (membersSnapshot.empty) {
      return [];
    }

    // Convert Firestore documents to array with field mapping
    // Firestore schema: firstName, lastName, displayName, city, phone, birthday
    // App expects: name, suburb, contact, birthday
    const members = membersSnapshot.docs.map((doc) => {
      const data = doc.data();

      // Convert birthday from Firestore Timestamp to ISO string if needed
      let birthday = data.birthday;
      if (birthday && typeof birthday.toDate === "function") {
        birthday = birthday.toDate().toISOString();
      } else if (birthday && birthday instanceof Date) {
        birthday = birthday.toISOString();
      }

      // Convert createdAt from Firestore Timestamp to ISO string if needed
      let createdAt = data.createdAt;
      if (createdAt && typeof createdAt.toDate === "function") {
        createdAt = createdAt.toDate().toISOString();
      } else if (createdAt && createdAt instanceof Date) {
        createdAt = createdAt.toISOString();
      } else {
        createdAt = new Date().toISOString();
      }

      // Convert updatedAt from Firestore Timestamp to ISO string if needed
      let updatedAt = data.updatedAt;
      if (updatedAt && typeof updatedAt.toDate === "function") {
        updatedAt = updatedAt.toDate().toISOString();
      } else if (updatedAt && updatedAt instanceof Date) {
        updatedAt = updatedAt.toISOString();
      } else {
        updatedAt = createdAt;
      }

      return {
        id: doc.id,
        // Map Firestore fields to app fields
        name:
          data.lastName && data.firstName
            ? `${data.lastName}, ${data.firstName}`.toUpperCase()
            : data.displayName || "",
        birthday: birthday || "",
        contact: data.phone || "",
        email: data.email || "",
        suburb: data.city || "",
        memberSince: data.notes || "", // Store member since in notes field
        createdAt: createdAt,
        createdBy: data.createdBy || user.uid,
        updatedAt: updatedAt,
        updatedBy: data.updatedBy || "",
      };
    });

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
