import admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;
let initializationAttempted = false;

export function initializeFirestore(): admin.firestore.Firestore | null {
  if (db) {
    return db;
  }

  if (initializationAttempted) {
    return null;
  }

  initializationAttempted = true;

  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccount) {
      console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT not configured - using in-memory storage');
      console.warn('   Add Firebase credentials to enable persistent storage');
      return null;
    }

    // Check if Firebase Admin is already initialized
    if (admin.apps.length === 0) {
      const credentials = JSON.parse(serviceAccount);

      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });
    }

    db = admin.firestore();
    console.log('✓ Firestore initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    console.warn('Falling back to in-memory storage');
    return null;
  }
}

export function getFirestore(): admin.firestore.Firestore | null {
  if (!db && !initializationAttempted) {
    return initializeFirestore();
  }
  return db;
}

export function isFirestoreAvailable(): boolean {
  return db !== null;
}
