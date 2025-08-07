"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mockAuth, User } from '@/lib/mock-auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial auth check
    setTimeout(() => {
      const currentUser = mockAuth.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }, 500);
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    await mockAuth.signUp(email, password, displayName);
    setUser(mockAuth.getCurrentUser());
  };

  const signIn = async (email: string, password: string) => {
    await mockAuth.signIn(email, password);
    setUser(mockAuth.getCurrentUser());
  };

  const signOut = async () => {
    await mockAuth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
