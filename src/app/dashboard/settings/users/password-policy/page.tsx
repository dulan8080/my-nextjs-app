"use client";

import { useState } from "react";
import Link from "next/link";
import PermissionGate from "@/components/PermissionGate";

// Default password policy settings
const defaultPasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  expiryDays: 90,
  preventReuse: 5,
  lockoutAttempts: 5,
  lockoutDuration: 30, // minutes
};

export default function PasswordPolicyPage() {
  const [passwordPolicy, setPasswordPolicy] = useState(defaultPasswordPolicy);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(defaultPasswordPolicy);
  const [isSaved, setIsSaved] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditingPolicy({...passwordPolicy});
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingPolicy({...passwordPolicy});
  };

  const handleSaveClick = () => {
    setPasswordPolicy({...editingPolicy});
    setIsEditing(false);
    setIsSaved(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setEditingPolicy(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  return (
    <PermissionGate permission="settings.users">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Password Policy</h1>
          <div className="flex gap-2">
            <Link 
              href="/dashboard/settings/users"
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to User Management
            </Link>
          </div>
        </div>

        {isSaved && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md animate-fadeIn">
            Password policy settings have been saved successfully.
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Password Security Settings</h2>
            {!isEditing ? (
              <button 
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Settings
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancelClick}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 border-b pb-2">Password Requirements</h3>
              
              <div className="flex justify-between items-center">
                <label htmlFor="minLength" className="block text-sm font-medium text-gray-700">
                  Minimum Password Length
                </label>
                {isEditing ? (
                  <input 
                    type="number" 
                    id="minLength"
                    name="minLength"
                    min="6"
                    max="30"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-right"
                    value={editingPolicy.minLength}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900">{passwordPolicy.minLength} characters</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label htmlFor="requireUppercase" className="block text-sm font-medium text-gray-700">
                  Require Uppercase Letters
                </label>
                {isEditing ? (
                  <input 
                    type="checkbox" 
                    id="requireUppercase"
                    name="requireUppercase"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={editingPolicy.requireUppercase}
                    onChange={handleChange}
                  />
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    passwordPolicy.requireUppercase ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {passwordPolicy.requireUppercase ? "Required" : "Not Required"}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label htmlFor="requireLowercase" className="block text-sm font-medium text-gray-700">
                  Require Lowercase Letters
                </label>
                {isEditing ? (
                  <input 
                    type="checkbox" 
                    id="requireLowercase"
                    name="requireLowercase"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={editingPolicy.requireLowercase}
                    onChange={handleChange}
                  />
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    passwordPolicy.requireLowercase ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {passwordPolicy.requireLowercase ? "Required" : "Not Required"}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label htmlFor="requireNumbers" className="block text-sm font-medium text-gray-700">
                  Require Numbers
                </label>
                {isEditing ? (
                  <input 
                    type="checkbox" 
                    id="requireNumbers"
                    name="requireNumbers"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={editingPolicy.requireNumbers}
                    onChange={handleChange}
                  />
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    passwordPolicy.requireNumbers ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {passwordPolicy.requireNumbers ? "Required" : "Not Required"}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label htmlFor="requireSpecialChars" className="block text-sm font-medium text-gray-700">
                  Require Special Characters
                </label>
                {isEditing ? (
                  <input 
                    type="checkbox" 
                    id="requireSpecialChars"
                    name="requireSpecialChars"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={editingPolicy.requireSpecialChars}
                    onChange={handleChange}
                  />
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    passwordPolicy.requireSpecialChars ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {passwordPolicy.requireSpecialChars ? "Required" : "Not Required"}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 border-b pb-2">Password Management</h3>
              
              <div className="flex justify-between items-center">
                <label htmlFor="expiryDays" className="block text-sm font-medium text-gray-700">
                  Password Expiry (Days)
                </label>
                {isEditing ? (
                  <input 
                    type="number" 
                    id="expiryDays"
                    name="expiryDays"
                    min="0"
                    max="365"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-right"
                    value={editingPolicy.expiryDays}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900">
                    {passwordPolicy.expiryDays === 0 ? "Never" : `${passwordPolicy.expiryDays} days`}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <label htmlFor="preventReuse" className="block text-sm font-medium text-gray-700">
                  Password History (Prevent Reuse)
                </label>
                {isEditing ? (
                  <input 
                    type="number" 
                    id="preventReuse"
                    name="preventReuse"
                    min="0"
                    max="24"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-right"
                    value={editingPolicy.preventReuse}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900">
                    {passwordPolicy.preventReuse === 0 ? "Not enabled" : `Last ${passwordPolicy.preventReuse} passwords`}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <label htmlFor="lockoutAttempts" className="block text-sm font-medium text-gray-700">
                  Account Lockout After Failed Attempts
                </label>
                {isEditing ? (
                  <input 
                    type="number" 
                    id="lockoutAttempts"
                    name="lockoutAttempts"
                    min="0"
                    max="10"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-right"
                    value={editingPolicy.lockoutAttempts}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900">
                    {passwordPolicy.lockoutAttempts === 0 ? "Disabled" : `${passwordPolicy.lockoutAttempts} attempts`}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <label htmlFor="lockoutDuration" className="block text-sm font-medium text-gray-700">
                  Lockout Duration (Minutes)
                </label>
                {isEditing ? (
                  <input 
                    type="number" 
                    id="lockoutDuration"
                    name="lockoutDuration"
                    min="0"
                    max="1440"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-right"
                    value={editingPolicy.lockoutDuration}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900">
                    {passwordPolicy.lockoutDuration === 0 ? "Until admin unlock" : `${passwordPolicy.lockoutDuration} minutes`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-gray-500">
                <p className="font-medium">Password Policy Tips:</p>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Strong password requirements enhance security but may increase user frustration</li>
                  <li>Password expiry forces regular changes, but too frequent changes may lead to weaker passwords</li>
                  <li>Consider using a password strength meter to give users feedback</li>
                  <li>Account lockout protects against brute force attacks but can be used for denial of service</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </PermissionGate>
  );
} 