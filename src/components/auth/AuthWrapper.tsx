"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/authContext";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no user is found, redirect to login
    if (!loading && !user && !pathname.includes('/login') && !pathname.includes('/register')) {
      router.push('/login');
    }
  }, [loading, user, router, pathname]);

  // If loading, show a loading state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  // If not loading and we have a user, or we're on the login/register page
  return (
    <>
      {children}
    </>
  );
} 