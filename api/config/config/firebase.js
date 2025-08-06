"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = exports.getFirestore = exports.connectFirebase = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
dotenv_1.default.config();
// Initialize Firebase Admin SDK
let firebaseApp;
const connectFirebase = async () => {
    try {
        // Check if Firebase is already initialized
        if (firebase_admin_1.default.apps.length === 0) {
            // Initialize with service account key if provided
            if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
                firebaseApp = firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert(serviceAccount),
                    projectId: process.env.FIREBASE_PROJECT_ID,
                });
            }
            else {
                // Initialize with default credentials (for local development)
                firebaseApp = firebase_admin_1.default.initializeApp({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                });
            }
        }
        else {
            firebaseApp = firebase_admin_1.default.app();
        }
        console.log('✅ Firebase connected');
        return firebaseApp;
    }
    catch (err) {
        console.error('❌ Firebase connection error:', err);
        throw err;
    }
};
exports.connectFirebase = connectFirebase;
// Get Firestore instance
const getFirestore = () => {
    if (!firebaseApp) {
        throw new Error('Firebase not initialized. Call connectFirebase() first.');
    }
    return firebase_admin_1.default.firestore(firebaseApp);
};
exports.getFirestore = getFirestore;
// Get Auth instance
const getAuth = () => {
    if (!firebaseApp) {
        throw new Error('Firebase not initialized. Call connectFirebase() first.');
    }
    return firebase_admin_1.default.auth(firebaseApp);
};
exports.getAuth = getAuth;
