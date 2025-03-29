import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Print Job Card System",
  description: "Log in or register to access the Print Job Card Handling System",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Print Job Card Handling System
          </h1>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Print Job Card System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 