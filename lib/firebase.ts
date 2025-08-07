// This file will be empty initially to prevent server-side initialization
export let auth: any = null;
export let db: any = null;

export const initializeFirebase = async () => {
  if (typeof window === 'undefined') return null;
  
  if (auth && db) return { auth, db };

  try {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');

    const firebaseConfig = {
      apiKey: "AIzaSyBNChTTSG3j4DXJ7mc_WQ2qqL1q0ohPHss",
      authDomain: "chime-319ad.firebaseapp.com",
      projectId: "chime-319ad",
      storageBucket: "chime-319ad.firebasestorage.app",
      messagingSenderId: "846632378088",
      appId: "1:846632378088:web:6ea5b9549b9edc246c335d",
      measurementId: "G-C2MM1ZJXMW"
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);

    return { auth, db };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
};
