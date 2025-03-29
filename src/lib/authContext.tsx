"use client";

import { createContext, useContext, useState } from "react";

// Mock user type to replace Firebase User
export type MockUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
};

// Define the shape of our auth context
type AuthContextType = {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logOut: () => Promise<void>;
};

// Mock admin user
const ADMIN_USER: MockUser = {
  uid: "admin-user-id",
  email: "admin@zynkprint.com",
  displayName: "Admin User",
  emailVerified: true
};

// Create the auth context with default values for server rendering
const AuthContext = createContext<AuthContextType>({
  user: ADMIN_USER,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

// AuthProvider component that will wrap our app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(ADMIN_USER); // Set to ADMIN_USER by default for development
  const [loading, setLoading] = useState(false);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Trim inputs and convert email to lowercase for consistent comparison
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      
      // Mock authentication logic
      if (trimmedEmail === "admin@zynkprint.com" && trimmedPassword === "password") {
        setUser(ADMIN_USER);
        console.log("Successfully signed in as admin");
      } else {
        console.error(`Login failed: Email "${trimmedEmail}" with password length ${trimmedPassword.length}`);
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      // Mock sign up logic
      const newUser: MockUser = {
        uid: `user-${Date.now()}`,
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        emailVerified: false
      };
      setUser(newUser);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logOut = async () => {
    setLoading(true);
    try {
      // Mock sign out logic
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Provide the auth context to children
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}; 