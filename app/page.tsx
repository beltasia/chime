"use client";

import { useAuth } from "@/contexts/auth-context";
import AuthForm from "@/components/auth-form";
import ChatInterface from "@/components/chat-interface";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return user ? <ChatInterface user={user} /> : <AuthForm />;
}
