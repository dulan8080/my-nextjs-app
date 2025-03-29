"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PermissionGate from "@/components/PermissionGate";

// Mock roles and departments - in a real app, these would come from an API
const roles = [
  "Administrator",
  "Manager",
  "Print Operator",
  "Customer Service",
  "Finance"
];

const departments = [
  "Management",
  "Operations",
  "Production",
  "Sales",
  "Finance",
  "IT"
];

// Mock fetch user function - in a real app, this would be an API call
const fetchUser = (id: string) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = [
        { 
          id: 1, 
          name: "John Smith", 
          email: "john@printshop.com", 
          role: "Administrator", 
          isActive: true,
          lastLogin: "2023-03-27T08:45:23Z",
          department: "Management",
          phone: "+1 (555) 123-4567",
          dateCreated: "2023-01-15T10:30:00Z",
          lastPasswordReset: "2023-02-20T14:15:30Z",
          notes: "System administrator with full access to all features.",
          loginCount: 42
        },
        { 
          id: 2, 
          name: "Sarah Johnson", 
          email: "sarah@printshop.com", 
          role: "Manager", 
          isActive: true,
          lastLogin: "2023-03-27T09:12:45Z",
          department: "Operations",
          phone: "+1 (555) 234-5678",
          dateCreated: "2023-01-16T11:45:00Z",
          lastPasswordReset: "2023-02-21T09:30:15Z",
          notes: "Operations manager responsible for workflow.",
          loginCount: 38
        },
        { 
          id: 3, 
          name: "Robert Davis", 
          email: "robert@printshop.com", 
          role: "Print Operator", 
          isActive: true,
          lastLogin: "2023-03-27T07:30:10Z",
          department: "Production",
          phone: "+1 (555) 345-6789",
          dateCreated: "2023-01-18T13:20:00Z",
          lastPasswordReset: "2023-02-22T11:45:45Z",
          notes: "Skilled print technician with 5 years experience.",
          loginCount: 56
        },
      ];
      
      const user = users.find(u => u.id === parseInt(id));
      resolve(user || null);
    }, 500);
  });
};

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const userData = await fetchUser(userId);
        if (userData) {
          setUser(userData);
          setEditData(userData);
        } else {
          // Handle user not found
          router.push('/dashboard/settings/users');
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [userId, router]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
      setEditData(user);
      setErrors({});
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!editData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!editData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!editData.role) {
      newErrors.role = "Role is required";
    }
    
    if (!editData.department) {
      newErrors.department = "Department is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsSaving(true);
      
      // Simulate API call to save user
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUser(editData);
      setIsEditing(false);
      setIsSaving(false);
    }
  };

  const handlePasswordResetOpen = () => {
    setIsResettingPassword(true);
    setPasswordData({
      password: "",
      confirmPassword: ""
    });
    setPasswordErrors({});
  };

  const validatePasswordReset = () => {
    const errors: any = {};
    
    if (!passwordData.password) {
      errors.password = "Password is required";
    } else if (passwordData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    if (passwordData.password !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async () => {
    if (validatePasswordReset()) {
      setIsSaving(true);
      
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update last password reset date
      const now = new Date().toISOString();
      setUser((prev: any) => ({
        ...prev,
        lastPasswordReset: now
      }));
      
      setIsResettingPassword(false);
      setIsSaving(false);
      
      // Show success notification
      alert(`Password for ${user.name} has been reset successfully.`);
    }
  };

  const handleToggleStatus = async () => {
    setIsSaving(true);
    
    // Simulate API call to toggle status
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setUser((prev: any) => ({
      ...prev,
      isActive: !prev.isActive
    }));
    
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <PermissionGate permission="settings.users">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">User Details</h1>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/dashboard/settings/users"
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Users
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleEditToggle}
                  >
                    Edit User
                  </button>
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={handlePasswordResetOpen}
                  >
                    Reset Password
                  </button>
                  <button
                    className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 ${
                      user.isActive 
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" 
                        : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    }`}
                    onClick={handleToggleStatus}
                    disabled={isSaving}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={handleEditToggle}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* User Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">User Information</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={editData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-900">{user.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={editData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={editData.phone}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-900">{user.phone || "—"}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  {isEditing ? (
                    <div>
                      <select
                        id="role"
                        name="role"
                        className={`w-full px-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={editData.role}
                        onChange={handleChange}
                      >
                        <option value="">Select a role</option>
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-900">{user.role}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  {isEditing ? (
                    <div>
                      <select
                        id="department"
                        name="department"
                        className={`w-full px-3 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={editData.department}
                        onChange={handleChange}
                      >
                        <option value="">Select a department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-900">{user.department}</p>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Account Information</h3>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Account Status</span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Last Login</span>
                  <p className="text-gray-900">{formatDate(user.lastLogin)}</p>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Account Created</span>
                  <p className="text-gray-900">{formatDate(user.dateCreated)}</p>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Last Password Reset</span>
                  <p className="text-gray-900">{formatDate(user.lastPasswordReset)}</p>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Login Count</span>
                  <p className="text-gray-900">{user.loginCount}</p>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  {isEditing ? (
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={editData.notes}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-900">{user.notes || "—"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Password Modal */}
        {isResettingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
              <h2 className="text-lg font-medium mb-4">Reset Password for {user.name}</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="reset-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password*
                  </label>
                  <input
                    type="password"
                    id="reset-password"
                    className={`w-full px-3 py-2 border ${passwordErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                  />
                  {passwordErrors.password && <p className="mt-1 text-sm text-red-600">{passwordErrors.password}</p>}
                </div>
                <div>
                  <label htmlFor="reset-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password*
                  </label>
                  <input
                    type="password"
                    id="reset-confirm-password"
                    className={`w-full px-3 py-2 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                  {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>}
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={() => setIsResettingPassword(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleResetPassword}
                    disabled={isSaving}
                  >
                    {isSaving ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGate>
  );
} 