"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  onboardingCompleted: false,
  setOnboardingCompleted: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Fetch user details from our MongoDB to check onboarding status
          // In a real app you might want to cache this or use custom claims
          const token = await firebaseUser.getIdToken();
          const res = await fetch("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setOnboardingCompleted(data.user?.onboardingCompleted || false);
          }
        } catch (e) {
          console.error("Failed to fetch user state", e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, onboardingCompleted, setOnboardingCompleted }}>
      {children}
    </AuthContext.Provider>
  );
}
