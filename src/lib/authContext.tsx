"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { sql } from '@vercel/postgres';

// User type matching database schema
export type User = {
  id: number;
  uid: string;
  email: string | null;
  display_name: string | null;
  email_verified: boolean;
  role: string;
};

// Define the shape of our auth context
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, display_name: string) => Promise<void>;
  logOut: () => Promise<void>;
};

// Default admin user for development
const ADMIN_USER: User = {
  id: 1,
  uid: "admin-user-id",
  email: "admin@zynkprint.com",
  display_name: "Admin User",
  email_verified: true,
  role: "admin"
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, check for session/token from localStorage or cookies
        const savedUser = localStorage.getItem('user');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // For development, automatically sign in as admin
          if (process.env.NODE_ENV === 'development') {
            setUser(ADMIN_USER);
            localStorage.setItem('user', JSON.stringify(ADMIN_USER));
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Trim inputs and convert email to lowercase for consistent comparison
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      
      // In production, this would verify against database hashed passwords
      // For now, we'll use a hardcoded check for the demo account
      if (trimmedEmail === "admin@zynkprint.com" && trimmedPassword === "password") {
        // In a real app with database, we would do:
        // const result = await sql`
        //   SELECT id, uid, email, display_name, email_verified, role 
        //   FROM users 
        //   WHERE email = ${trimmedEmail}
        // `;
        // if (result.rows.length && await comparePasswords(trimmedPassword, result.rows[0].password_hash)) {
        //   const userFromDb = result.rows[0];
        //   setUser(userFromDb);
        //   localStorage.setItem('user', JSON.stringify(userFromDb));
        // }
        
        // For demo, we'll use the hardcoded admin user
        setUser(ADMIN_USER);
        localStorage.setItem('user', JSON.stringify(ADMIN_USER));
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
  const signUp = async (email: string, password: string, display_name: string) => {
    setLoading(true);
    try {
      // In a real app, we would create the user in the database
      // For now, just simulate account creation
      const uid = `user-${Date.now()}`;
      const newUser: User = {
        id: Date.now(), // In DB this would be auto-generated
        uid,
        email: email.trim().toLowerCase(),
        display_name: display_name.trim(),
        email_verified: false,
        role: "customer"
      };
      
      // In a real app with a database
      // const result = await sql`
      //   INSERT INTO users (uid, email, display_name, email_verified, role, password_hash)
      //   VALUES (${uid}, ${email}, ${display_name}, false, 'customer', ${hashedPassword})
      //   RETURNING id, uid, email, display_name, email_verified, role
      // `;
      // const newUser = result.rows[0];

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
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
      setUser(null);
      localStorage.removeItem('user');
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