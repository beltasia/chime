"use client";

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

export function useFirebase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    const initializeFirebase = async () => {
      // Wait for next tick to ensure client is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!mounted) return;

      try {
        // Dynamic imports
        const { initializeApp, getApps, getApp } = await import('firebase/app');
        const { getAuth, onAuthStateChanged } = await import('firebase/auth');

        const firebaseConfig = {
          apiKey: "AIzaSyBNChTTSG3j4DXJ7mc_WQ2qqL1q0ohPHss",
          authDomain: "chime-319ad.firebaseapp.com",
          projectId: "chime-319ad",
          storageBucket: "chime-319ad.firebasestorage.app",
          messagingSenderId: "846632378088",
          appId: "1:846632378088:web:6ea5b9549b9edc246c335d",
          measurementId: "G-C2MM1ZJXMW"
        };

        // Initialize Firebase app
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        
        if (!mounted) return;

        // Initialize Auth
        const auth = getAuth(app);
        
        if (!mounted) return;

        // Set up auth state listener
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (mounted) {
            setUser(user);
            setLoading(false);
          }
        });

      } catch (err: any) {
        console.error('Firebase initialization error:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    // Only initialize on client side
    if (typeof window !== 'undefined') {
      initializeFirebase();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { user, loading, error };
}
