"use client";

// Utility functions for Firebase operations
export const getFirebaseInstances = async () => {
  const { initializeApp, getApps, getApp } = await import('firebase/app');
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

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  return { auth, db, app };
};
