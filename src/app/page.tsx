"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading, onboardingCompleted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!onboardingCompleted) {
        router.push("/assessment");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, loading, onboardingCompleted, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-green-600 drop-shadow-md" />
        <p className="text-green-800 font-medium animate-pulse">Loading your environment...</p>
      </div>
    </div>
  );
}
