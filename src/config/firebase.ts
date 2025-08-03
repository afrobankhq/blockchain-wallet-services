import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App;

export const connectFirebase = async () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Initialize with service account key if provided
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      } else {
        // Initialize with default credentials (for local development)
        firebaseApp = admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      }
    } else {
      firebaseApp = admin.app();
    }

    console.log('✅ Firebase connected');
    return firebaseApp;
  } catch (err) {
    console.error('❌ Firebase connection error:', err);
    throw err;
  }
};

// Get Firestore instance
export const getFirestore = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call connectFirebase() first.');
  }
  return admin.firestore(firebaseApp);
};

// Get Auth instance
export const getAuth = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call connectFirebase() first.');
  }
  return admin.auth(firebaseApp);
}; 