"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Define permissions structure by module
const permissionModules = [
  {
    id: "jobs",
    name: "Jobs Management",
    permissions: [
      { id: "jobs.view", name: "View Jobs" },
      { id: "jobs.create", name: "Create Jobs" },
      { id: "jobs.edit", name: "Edit Jobs" },
      { id: "jobs.delete", name: "Delete Jobs" },
      { id: "jobs.status", name: "Change Job Status" },
      { id: "jobs.price", name: "View Job Pricing" },
      { id: "jobs.editPrice", name: "Edit Job Pricing" },
    ],
  },
  {
    id: "print-queue",
    name: "Print Queue",
    permissions: [
      { id: "print-queue.view", name: "View Print Queue" },
      { id: "print-queue.process", name: "Process Print Jobs" },
      { id: "print-queue.status", name: "Change Print Status" },
    ],
  },
  {
    id: "approval-queue",
    name: "Approval Queue",
    permissions: [
      { id: "approval-queue.view", name: "View Approval Queue" },
      { id: "approval-queue.approve", name: "Approve Jobs" },
      { id: "approval-queue.reject", name: "Reject Jobs" },
      { id: "approval-queue.price", name: "Adjust Pricing" },
    ],
  },
  {
    id: "customers",
    name: "Customers",
    permissions: [
      { id: "customers.view", name: "View Customers" },
      { id: "customers.create", name: "Create Customers" },
      { id: "customers.edit", name: "Edit Customers" },
      { id: "customers.delete", name: "Delete Customers" },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    permissions: [
      { id: "settings.view", name: "View Settings" },
      { id: "settings.job-types", name: "Manage Job Types" },
      { id: "settings.materials", name: "Manage Materials" },
      { id: "settings.pricing", name: "Manage Pricing" },
      { id: "settings.roles", name: "Manage Roles & Permissions" },
      { id: "settings.users", name: "Manage Users" },
    ],
  },
  {
    id: "reports",
    name: "Reports",
    permissions: [
      { id: "reports.view", name: "View Reports" },
      { id: "reports.export", name: "Export Reports" },
      { id: "reports.financial", name: "Financial Reports" },
      { id: "reports.operational", name: "Operational Reports" },
    ],
  },
];

// Default roles with predefined permissions
const defaultRoles = [
  {
    id: 1,
    name: "Administrator",
    description: "Full access to all system features",
    isActive: true,
    permissions: permissionModules.flatMap(module => 
      module.permissions.map(permission => permission.id)
    ),
  },
  {
    id: 2,
    name: "Manager",
    description: "Can manage jobs, customers, and view reports",
    isActive: true,
    permissions: [
      "jobs.view", "jobs.create", "jobs.edit", "jobs.status", "jobs.price", "jobs.editPrice",
      "print-queue.view", "print-queue.status",
      "approval-queue.view", "approval-queue.approve", "approval-queue.reject", "approval-queue.price",
      "customers.view", "customers.create", "customers.edit",
      "settings.view", "settings.job-types", "settings.materials", "settings.pricing",
      "reports.view", "reports.export", "reports.financial", "reports.operational",
    ],
  },
  {
    id: 3,
    name: "Print Operator",
    description: "Can view and process print jobs",
    isActive: true,
    permissions: [
      "jobs.view", "jobs.status",
      "print-queue.view", "print-queue.process", "print-queue.status",
    ],
  },
  {
    id: 4,
    name: "Customer Service",
    description: "Can manage customers and create jobs",
    isActive: true,
    permissions: [
      "jobs.view", "jobs.create", "jobs.status",
      "customers.view", "customers.create", "customers.edit",
    ],
  },
  {
    id: 5,
    name: "Finance",
    description: "Can view financial information and reports",
    isActive: true,
    permissions: [
      "jobs.view", "jobs.price",
      "customers.view",
      "reports.view", "reports.export", "reports.financial",
    ],
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(defaultRoles);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const handlePermissionChange = (permissionId: string, roleId: number) => {
    if (editingRole && editingRole.id === roleId) {
      // Toggle permission in editing mode
      setEditingRole({
        ...editingRole,
        permissions: editingRole.permissions.includes(permissionId)
          ? editingRole.permissions.filter((id: string) => id !== permissionId)
          : [...editingRole.permissions, permissionId],
      });
    } else if (isAddingRole) {
      // Toggle permission for new role
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.includes(permissionId)
          ? newRole.permissions.filter((id) => id !== permissionId)
          : [...newRole.permissions, permissionId],
      });
    }
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id ? { ...editingRole } : role
      ));
      setEditingRole(null);
    }
  };

  const handleAddRole = () => {
    if (newRole.name.trim()) {
      const newId = Math.max(0, ...roles.map(role => role.id)) + 1;
      setRoles([...roles, { 
        id: newId, 
        name: newRole.name, 
        description: newRole.description,
        permissions: newRole.permissions,
        isActive: true
      }]);
      setNewRole({
        name: "",
        description: "",
        permissions: [],
      });
      setIsAddingRole(false);
    }
  };

  const handleToggleRoleStatus = (id: number) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, isActive: !role.isActive } : role
    ));
  };

  const selectAllModulePermissions = (moduleId: string) => {
    if (editingRole) {
      const modulePermissionIds = permissionModules
        .find(module => module.id === moduleId)
        ?.permissions.map(perm => perm.id) || [];
      
      // Check if all permissions in this module are already selected
      const allSelected = modulePermissionIds.every(id => 
        editingRole.permissions.includes(id)
      );
      
      // If all are selected, remove them all; otherwise, add missing ones
      const updatedPermissions = allSelected
        ? editingRole.permissions.filter((id: string) => !modulePermissionIds.includes(id))
        : [...new Set([...editingRole.permissions, ...modulePermissionIds])];
      
      setEditingRole({
        ...editingRole,
        permissions: updatedPermissions,
      });
    } else if (isAddingRole) {
      const modulePermissionIds = permissionModules
        .find(module => module.id === moduleId)
        ?.permissions.map(perm => perm.id) || [];
      
      // Check if all permissions in this module are already selected
      const allSelected = modulePermissionIds.every(id => 
        newRole.permissions.includes(id)
      );
      
      // If all are selected, remove them all; otherwise, add missing ones
      const updatedPermissions = allSelected
        ? newRole.permissions.filter((id: string) => !modulePermissionIds.includes(id))
        : [...new Set([...newRole.permissions, ...modulePermissionIds])];
      
      setNewRole({
        ...newRole,
        permissions: updatedPermissions,
      });
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        <div className="flex gap-2">
          <Link 
            href="/dashboard/settings"
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Settings
          </Link>
          {!isAddingRole && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsAddingRole(true)}
            >
              Add New Role
            </button>
          )}
        </div>
      </div>

      {isAddingRole && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fadeIn">
          <h2 className="text-lg font-medium mb-4">Create New Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Permissions</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              {permissionModules.map((module, index) => (
                <div 
                  key={module.id} 
                  className={`mb-4 ${index !== permissionModules.length - 1 ? 'border-b border-gray-200 pb-4' : ''}`}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`module-${module.id}`}
                      checked={module.permissions.every(perm => 
                        newRole.permissions.includes(perm.id)
                      )}
                      onChange={() => selectAllModulePermissions(module.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label 
                      htmlFor={`module-${module.id}`} 
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      {module.name} (All)
                    </label>
                  </div>
                  <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {module.permissions.map(permission => (
                      <div key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`perm-${permission.id}`}
                          checked={newRole.permissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id, 0)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`perm-${permission.id}`} 
                          className="ml-2 text-sm text-gray-600"
                        >
                          {permission.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setIsAddingRole(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleAddRole}
              disabled={!newRole.name.trim()}
            >
              Create Role
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {roles.map(role => (
            <li 
              key={role.id} 
              className={`border rounded-lg overflow-hidden ${
                editingRole?.id === role.id ? 'ring-2 ring-blue-500' : ''
              } ${!role.isActive ? 'opacity-70' : ''}`}
            >
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-medium">{role.name}</h3>
                <div className="flex items-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      role.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    } mr-2`}
                  >
                    {role.isActive ? "Active" : "Inactive"}
                  </span>
                  <button 
                    className="text-gray-400 hover:text-gray-600" 
                    onClick={() => setActiveTab(activeTab === role.id ? null : role.id)}
                    aria-label="Toggle role details"
                  >
                    {activeTab === role.id ? (
                      <span className="inline-block w-4 h-4">-</span>
                    ) : (
                      <span className="inline-block w-4 h-4">+</span>
                    )}
                  </button>
                </div>
              </div>
              
              <div className={`p-4 ${activeTab === role.id ? 'block' : 'hidden'}`}>
                <div className="text-sm text-gray-600 mb-3">{role.description}</div>
                
                {editingRole?.id === role.id ? (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor={`edit-name-${role.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                        Role Name
                      </label>
                      <input
                        type="text"
                        id={`edit-name-${role.id}`}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                        value={editingRole.name}
                        onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor={`edit-desc-${role.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        id={`edit-desc-${role.id}`}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                        value={editingRole.description}
                        onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                      />
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-700 mb-2">Permissions</h4>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm max-h-60 overflow-y-auto">
                        {permissionModules.map((module, index) => (
                          <div 
                            key={module.id} 
                            className={`mb-3 ${index !== permissionModules.length - 1 ? 'border-b border-gray-200 pb-3' : ''}`}
                          >
                            <div className="flex items-center mb-1">
                              <input
                                type="checkbox"
                                id={`edit-module-${role.id}-${module.id}`}
                                checked={module.permissions.every(perm => 
                                  editingRole.permissions.includes(perm.id)
                                )}
                                onChange={() => selectAllModulePermissions(module.id)}
                                className="h-3 w-3 text-blue-600 focus:ring-blue-500"
                              />
                              <label 
                                htmlFor={`edit-module-${role.id}-${module.id}`} 
                                className="ml-2 text-xs font-medium text-gray-700"
                              >
                                {module.name} (All)
                              </label>
                            </div>
                            <div className="ml-5 grid grid-cols-1 gap-1">
                              {module.permissions.map(permission => (
                                <div key={permission.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`edit-perm-${role.id}-${permission.id}`}
                                    checked={editingRole.permissions.includes(permission.id)}
                                    onChange={() => handlePermissionChange(permission.id, role.id)}
                                    className="h-3 w-3 text-blue-600 focus:ring-blue-500"
                                  />
                                  <label 
                                    htmlFor={`edit-perm-${role.id}-${permission.id}`} 
                                    className="ml-2 text-xs text-gray-600"
                                  >
                                    {permission.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Permissions</h4>
                      <div className="text-xs text-gray-600">
                        {permissionModules.map(module => {
                          const modulePermissions = module.permissions
                            .filter(perm => role.permissions.includes(perm.id))
                            .map(perm => perm.name);
                            
                          if (modulePermissions.length === 0) return null;
                          
                          return (
                            <div key={module.id} className="mb-2">
                              <div className="font-medium text-gray-700">{module.name}</div>
                              <div className="ml-2 flex flex-wrap gap-1">
                                {modulePermissions.map(perm => (
                                  <span 
                                    key={perm}
                                    className="inline-flex px-2 py-1 text-xs bg-gray-100 rounded"
                                  >
                                    {perm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end gap-2">
                  {editingRole?.id === role.id ? (
                    <>
                      <button
                        className="px-2 py-1 text-xs text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => setEditingRole(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleSaveRole}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => setEditingRole(role)}
                      >
                        Edit
                      </button>
                      <button
                        className={`px-2 py-1 text-xs border rounded-md ${
                          role.isActive ? "border-red-300 text-red-600" : "border-green-300 text-green-600"
                        }`}
                        onClick={() => handleToggleRoleStatus(role.id)}
                      >
                        {role.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 