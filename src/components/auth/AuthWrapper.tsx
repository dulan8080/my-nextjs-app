"use client";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  // No authentication required - direct access to all pages
  return (
    <>
      {children}
    </>
  );
} 