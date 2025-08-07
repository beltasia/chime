"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  auth: any;
  db: any;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  error: null,
  auth: null,
  db: null
});

export const useFirebase = () => useContext(FirebaseContext);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<any>(null);
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    // Wait for the browser to be fully ready
    const timer = setTimeout(async () => {
      try {
        // Only run in browser
        if (typeof window === 'undefined') return;

        // Dynamic imports
        const { initializeApp, getApps } = await import('firebase/app');
        const { getAuth, onAuthStateChanged } = await import('firebase/auth');
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

        // Initialize Firebase
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);

        setAuth(authInstance);
        setDb(dbInstance);

        // Set up auth listener
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
          setUser(user);
          setLoading(false);
        });

        return unsubscribe;
      } catch (err: any) {
        console.error('Firebase initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    }, 500); // Wait 500ms for browser to be ready

    return () => clearTimeout(timer);
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading, error, auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
}
