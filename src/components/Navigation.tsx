"use client";

import { useAuth } from "@/components/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navigation() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xl font-bold text-green-900 hidden sm:block">GreenMind</span>
            </Link>
            
            {user && (
              <div className="flex items-center gap-4 ml-4">
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-green-600">Dashboard</Link>
                <Link href="/scanner" className="text-sm font-medium text-gray-600 hover:text-green-600">Receipt Scanner</Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
