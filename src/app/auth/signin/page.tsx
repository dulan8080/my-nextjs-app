"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600">
              <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                <path d="M6.925 16.875Q5.2 16.875 4 15.675Q2.8 14.475 2.8 12.75Q2.8 11.025 4 9.825Q5.2 8.625 6.925 8.625H17.075Q18.8 8.625 20 9.825Q21.2 11.025 21.2 12.75Q21.2 14.475 20 15.675Q18.8 16.875 17.075 16.875H15.9V15.375H17.075Q18.1 15.375 18.825 14.65Q19.55 13.925 19.55 12.9Q19.55 11.875 18.825 11.15Q18.1 10.425 17.075 10.425H6.925Q5.9 10.425 5.175 11.15Q4.45 11.875 4.45 12.9Q4.45 13.925 5.175 14.65Q5.9 15.375 6.925 15.375H9V16.875Z" />
                <path d="M8.5 20.5V5H10V20.5ZM14 20.5V5H15.5V20.5Z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">ZynkPrint</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your print management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950 dark:text-red-300">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="mt-2 text-center text-xs text-gray-600">
            Demo credentials: admin@zynkprint.com / password
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 