"use client";

import { useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";

// Mock customer data
const mockCustomers = [
  {
    id: "CUST-001",
    name: "Acme Corporation",
    contactPerson: "John Smith",
    email: "john.smith@acme.com",
    phone: "555-123-4567",
    address: "123 Business Ave, Suite 100, New York, NY 10001",
    type: "Corporate",
    status: "Active",
    jobCount: 12,
    totalSpent: 15750.80
  },
  {
    id: "CUST-002",
    name: "TechStart Ltd",
    contactPerson: "Sarah Johnson",
    email: "sarah@techstart.io",
    phone: "555-987-6543",
    address: "456 Innovation Dr, San Francisco, CA 94107",
    type: "Corporate",
    status: "Active",
    jobCount: 8,
    totalSpent: 9240.50
  },
  {
    id: "CUST-003",
    name: "Local Coffee Shop",
    contactPerson: "Mike Brown",
    email: "mike@localcoffee.com",
    phone: "555-456-7890",
    address: "789 Main St, Seattle, WA 98101",
    type: "Small Business",
    status: "Active",
    jobCount: 5,
    totalSpent: 1250.75
  },
  {
    id: "CUST-004",
    name: "Global Education Inc",
    contactPerson: "Lisa Wong",
    email: "lwong@globaledu.org",
    phone: "555-789-0123",
    address: "321 Learning Lane, Boston, MA 02108",
    type: "Non-profit",
    status: "Inactive",
    jobCount: 3,
    totalSpent: 4500.25
  },
  {
    id: "CUST-005",
    name: "Creative Design Studio",
    contactPerson: "David Miller",
    email: "david@creativedesign.co",
    phone: "555-234-5678",
    address: "567 Art Avenue, Portland, OR 97201",
    type: "Small Business",
    status: "Active",
    jobCount: 7,
    totalSpent: 6780.00
  }
];

export default function CustomersPage() {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [customers, setCustomers] = useState(mockCustomers);
  
  // Form state for new customer
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    type: "Small Business",
    status: "Active"
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
  }>({});

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchTerm === "" || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesType = typeFilter === "all" || customer.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};
    
    if (!newCustomer.name || newCustomer.name.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
    
    if (!newCustomer.contactPerson || newCustomer.contactPerson.length < 2) {
      errors.contactPerson = "Contact person must be at least 2 characters.";
    }
    
    if (!newCustomer.email || !/\S+@\S+\.\S+/.test(newCustomer.email)) {
      errors.email = "Please enter a valid email address.";
    }
    
    if (!newCustomer.phone || newCustomer.phone.length < 7) {
      errors.phone = "Please enter a valid phone number.";
    }
    
    if (!newCustomer.address || newCustomer.address.length < 10) {
      errors.address = "Please enter a complete address.";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const customer = {
        id: `CUST-${(customers.length + 1).toString().padStart(3, "0")}`,
        ...newCustomer,
        jobCount: 0,
        totalSpent: 0
      };
      
      setCustomers([...customers, customer]);
      setIsAddDialogOpen(false);
      
      // Reset form
      setNewCustomer({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        type: "Small Business",
        status: "Active"
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button 
          onClick={() => setIsAddDialogOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add New Customer
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, contact person or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-[150px]"
          >
            <option value="all">All Types</option>
            <option value="Corporate">Corporate</option>
            <option value="Small Business">Small Business</option>
            <option value="Non-profit">Non-profit</option>
          </select>

          <button 
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-sm text-gray-500">{customer.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{customer.contactPerson}</span>
                      <span className="text-sm text-gray-500">{customer.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {customer.jobCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/customers/${customer.id}`}>
                        <button className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">View</button>
                      </Link>
                      <Link href={`/dashboard/customers/${customer.id}/edit`}>
                        <button className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Edit</button>
                      </Link>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
                            setCustomers(customers.filter(c => c.id !== customer.id));
                          }
                        }}
                        className="px-2 py-1 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  No customers found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Customer</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsAddDialogOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company/Customer Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person*
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={newCustomer.contactPerson}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border ${formErrors.contactPerson ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {formErrors.contactPerson && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.contactPerson}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={newCustomer.address}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={newCustomer.type}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Small Business">Small Business</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Non-profit">Non-profit</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newCustomer.status}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 