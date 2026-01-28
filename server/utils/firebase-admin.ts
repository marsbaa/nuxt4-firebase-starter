import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getDatabase, type Database } from "firebase-admin/database";

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;
let adminRtdb: Database;

/**
 * Initialize Firebase Admin SDK with service account credentials
 * @returns Firebase Admin app, auth, and firestore instances
 */
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    const config = useRuntimeConfig();

    // Initialize with service account credentials from environment
    const serviceAccount = {
      projectId: config.firebaseProjectId,
      clientEmail: config.firebaseClientEmail,
      privateKey: config.firebasePrivateKey?.replace(/\\n/g, "\n"),
    };

    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: config.firebaseProjectId,
      databaseURL: config.public.firebaseDatabaseUrl,
    });

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    adminRtdb = getDatabase(adminApp);
  } else {
    adminApp = getApps()[0]!;
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    adminRtdb = getDatabase(adminApp);
  }

  return { adminApp, adminAuth, adminDb, adminRtdb };
}

/**
 * Get Firebase Admin SDK instances
 * Initializes the SDK if not already initialized
 * @returns Firebase Admin app, auth, and firestore instances
 */
export function useFirebaseAdmin() {
  if (!adminApp) {
    return initializeFirebaseAdmin();
  }
  return { adminApp, adminAuth, adminDb, adminRtdb };
}
