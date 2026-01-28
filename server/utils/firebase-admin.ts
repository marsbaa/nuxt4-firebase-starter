import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // Initialize with service account credentials from environment
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  } else {
    adminApp = getApps()[0]!;
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  }

  return { adminApp, adminAuth, adminDb };
}

export function useFirebaseAdmin() {
  if (!adminApp) {
    return initializeFirebaseAdmin();
  }
  return { adminApp, adminAuth, adminDb };
}
