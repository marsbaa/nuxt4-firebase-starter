import { useFirebaseAdmin } from "../utils/firebase-admin";

export default defineEventHandler(async (event) => {
  // Skip auth for some routes
  const path = event.path || "";
  if (path.startsWith("/_nuxt") || path.startsWith("/api/_")) {
    return;
  }

  try {
    // Get the Firebase ID token from the Authorization header
    const authHeader = event.node.req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token provided - allow request to continue but without user context
      event.context.user = null;
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      event.context.user = null;
      return;
    }

    const { adminAuth } = useFirebaseAdmin();

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Add user info to event context
    event.context.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    console.log(`[Auth Middleware] Authenticated user: ${decodedToken.uid}`);
  } catch (error) {
    console.error("[Auth Middleware] Token verification failed:", error);
    event.context.user = null;
  }
});
