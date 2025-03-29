"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer", // Default role
  });
  
  const [errors, setErrors] = useState<{
    display_name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear the error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      display_name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      role?: string;
    } = {};
    
    if (!formData.display_name.trim()) {
      newErrors.display_name = "Name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Use the signUp method from the AuthContext
      await signUp(formData.email, formData.password, formData.display_name);
      router.push("/auth/signin");
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                autoComplete="name"
                value={formData.display_name}
                onChange={handleChange}
                aria-invalid={!!errors.display_name}
                aria-describedby={errors.display_name ? "name-error" : undefined}
                className={`relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                  errors.display_name ? "ring-red-500" : "ring-gray-300"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                placeholder="John Doe"
              />
              {errors.display_name && (
                <p className="mt-2 text-sm text-red-600" id="name-error">
                  {errors.display_name}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                  errors.email ? "ring-red-500" : "ring-gray-300"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                  errors.password ? "ring-red-500" : "ring-gray-300"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                className={`relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                  errors.confirmPassword ? "ring-red-500" : "ring-gray-300"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600" id="confirm-password-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? "role-error" : undefined}
                className={`relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                  errors.role ? "ring-red-500" : "ring-gray-300"
                } focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
              >
                <option value="customer">Customer</option>
                <option value="print_staff">Print Section Staff</option>
                <option value="admin">Administrator</option>
              </select>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600" id="role-error">
                  {errors.role}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 