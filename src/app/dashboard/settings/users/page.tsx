"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data for users
const defaultUsers = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john@printshop.com", 
    role: "Administrator", 
    isActive: true,
    lastLogin: "2023-03-27T08:45:23Z",
    department: "Management"
  },
  { 
    id: 2, 
    name: "Sarah Johnson", 
    email: "sarah@printshop.com", 
    role: "Manager", 
    isActive: true,
    lastLogin: "2023-03-27T09:12:45Z",
    department: "Operations"
  },
  { 
    id: 3, 
    name: "Robert Davis", 
    email: "robert@printshop.com", 
    role: "Print Operator", 
    isActive: true,
    lastLogin: "2023-03-27T07:30:10Z",
    department: "Production"
  },
  { 
    id: 4, 
    name: "Jennifer Wilson", 
    email: "jennifer@printshop.com", 
    role: "Customer Service", 
    isActive: true,
    lastLogin: "2023-03-27T08:50:33Z",
    department: "Sales"
  },
  { 
    id: 5, 
    name: "Michael Brown", 
    email: "michael@printshop.com", 
    role: "Finance", 
    isActive: true,
    lastLogin: "2023-03-26T16:45:20Z",
    department: "Finance"
  },
  { 
    id: 6, 
    name: "Jessica Taylor", 
    email: "jessica@printshop.com", 
    role: "Print Operator", 
    isActive: false,
    lastLogin: "2023-03-20T11:23:45Z",
    department: "Production"
  },
];

// Mock data for roles
const roles = [
  "Administrator",
  "Manager",
  "Print Operator",
  "Customer Service",
  "Finance"
];

// Mock data for departments
const departments = [
  "Management",
  "Operations",
  "Production",
  "Sales",
  "Finance",
  "IT"
];

export default function UsersPage() {
  const [users, setUsers] = useState(defaultUsers);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
    confirmPassword: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [resetPasswordUser, setResetPasswordUser] = useState<any | null>(null);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState<any>({});

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...editingUser } : user
      ));
      setEditingUser(null);
    }
  };

  const validateNewUser = () => {
    const newErrors: any = {};
    
    if (!newUser.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!newUser.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      newErrors.email = "Email is invalid";
    } else if (users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase())) {
      newErrors.email = "Email already exists";
    }
    
    if (!newUser.role) {
      newErrors.role = "Role is required";
    }
    
    if (!newUser.department) {
      newErrors.department = "Department is required";
    }
    
    if (!newUser.password) {
      newErrors.password = "Password is required";
    } else if (newUser.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = () => {
    if (validateNewUser()) {
      const newId = Math.max(0, ...users.map(user => user.id)) + 1;
      const now = new Date().toISOString();
      
      setUsers([...users, { 
        id: newId, 
        name: newUser.name, 
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        isActive: true,
        lastLogin: now
      }]);
      
      setNewUser({
        name: "",
        email: "",
        role: "",
        department: "",
        password: "",
        confirmPassword: ""
      });
      setIsAddingUser(false);
      setErrors({});
    }
  };

  const handleToggleUserStatus = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleOpenResetPassword = (user: any) => {
    setResetPasswordUser(user);
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

  const handleResetPassword = () => {
    if (validatePasswordReset()) {
      // In a real application, you would send this to an API
      // For demo purposes, we'll just show a success message
      alert(`Password for ${resetPasswordUser.name} has been reset successfully.`);
      setResetPasswordUser(null);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Link 
            href="/dashboard/settings"
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Settings
          </Link>
          <Link 
            href="/dashboard/settings/users/password-policy"
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50"
          >
            Password Policy
          </Link>
          <Link 
            href="/dashboard/settings/roles"
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50"
          >
            Manage Roles
          </Link>
          {!isAddingUser && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsAddingUser(true)}
            >
              Add New User
            </button>
          )}
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Users
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, email, role, or department..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Add User Form */}
      {isAddingUser && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fadeIn">
          <h2 className="text-lg font-medium mb-4">Create New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role*
              </label>
              <select
                id="role"
                className={`w-full px-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department*
              </label>
              <select
                id="department"
                className={`w-full px-3 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              >
                <option value="">Select a department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <input
                type="password"
                id="password"
                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password*
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => {
                setIsAddingUser(false);
                setErrors({});
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleAddUser}
            >
              Create User
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
            <h2 className="text-lg font-medium mb-4">Reset Password for {resetPasswordUser.name}</h2>
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
                  onClick={() => setResetPasswordUser(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name/Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className={!user.isActive ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <Link href={`/dashboard/settings/users/${user.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">{user.name}</Link>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser && editingUser.id === user.id ? (
                        <select
                          className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        >
                          {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">{user.role}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser && editingUser.id === user.id ? (
                        <select
                          className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          value={editingUser.department}
                          onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                        >
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">{user.department}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(user.lastLogin)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {editingUser && editingUser.id === user.id ? (
                          <>
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              onClick={() => setEditingUser(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={handleSaveUser}
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/dashboard/settings/users/${user.id}`}
                              className="text-green-600 hover:text-green-900"
                            >
                              View
                            </Link>
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => setEditingUser({ ...user })}
                            >
                              Edit
                            </button>
                            <button
                              className="text-purple-600 hover:text-purple-900"
                              onClick={() => handleOpenResetPassword(user)}
                            >
                              Reset Password
                            </button>
                            <button
                              className={user.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 