"use client";

import { useState, useEffect } from "react";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface JobFormSharedProps {
  formData: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    jobType: string;
    notes: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors: {
    customerId?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerAddress?: string;
    jobType?: string;
    notes?: string;
  };
}

// Mock data for now, would come from API in real app
const CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    name: "Acme Corp",
    email: "contact@acme.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: "cust-002",
    name: "TechStart Inc",
    email: "info@techstart.com",
    phone: "555-987-6543",
    address: "456 Tech Blvd, Innovation City, USA",
  },
  {
    id: "cust-003",
    name: "Global Enterprises",
    email: "sales@globalent.com",
    phone: "555-555-5555",
    address: "789 Global Ave, Metropolis, USA",
  },
];

// Mock job types from the system, would be fetched from API
const JOB_TYPES = [
  { id: "digital", name: "Digital Print" },
  { id: "offset", name: "Offset Print" },
  { id: "sublimation", name: "Sublimation" },
];

export const JobFormShared = ({
  formData,
  onChange,
  errors,
}: JobFormSharedProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isExistingCustomer, setIsExistingCustomer] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // Simulate API fetch for customers
    setCustomers(CUSTOMERS);
    setFilteredCustomers(CUSTOMERS);
  }, []);

  useEffect(() => {
    // Filter customers based on search term
    if (searchTerm) {
      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerDropdownOpen(false);
    
    // Create a synthetic event to trigger onChange for all customer fields
    const event = {
      target: { name: "customerId", value: customer.id },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event as any);
    
    // Also update all other customer fields
    const nameEvent = {
      target: { name: "customerName", value: customer.name },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(nameEvent as any);
    
    const emailEvent = {
      target: { name: "customerEmail", value: customer.email },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(emailEvent as any);
    
    const phoneEvent = {
      target: { name: "customerPhone", value: customer.phone },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(phoneEvent as any);
    
    const addressEvent = {
      target: { name: "customerAddress", value: customer.address },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(addressEvent as any);
  };

  const handleCustomerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleCustomerType = () => {
    setIsExistingCustomer(!isExistingCustomer);
    setSelectedCustomer(null);
    
    // Reset customer fields when toggling
    const event = {
      target: { name: "customerId", value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event as any);
    
    const nameEvent = {
      target: { name: "customerName", value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(nameEvent as any);
    
    const emailEvent = {
      target: { name: "customerEmail", value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(emailEvent as any);
    
    const phoneEvent = {
      target: { name: "customerPhone", value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(phoneEvent as any);
    
    const addressEvent = {
      target: { name: "customerAddress", value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(addressEvent as any);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Customer Information
        </h3>
        <div className="mt-2 flex space-x-4">
          <button
            type="button"
            onClick={() => setIsExistingCustomer(true)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              isExistingCustomer
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Existing Customer
          </button>
          <button
            type="button"
            onClick={() => setIsExistingCustomer(false)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              !isExistingCustomer
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            New Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {isExistingCustomer ? (
          <div className="sm:col-span-3">
            <label 
              htmlFor="customerId" 
              className="block text-sm font-medium text-gray-700"
            >
              Select Customer
            </label>
            <div className="mt-1 relative">
              <div className="relative">
                <input
                  type="text"
                  id="customerSearch"
                  name="customerSearch"
                  autoComplete="off"
                  value={searchTerm}
                  onChange={handleCustomerSearch}
                  onFocus={() => setIsCustomerDropdownOpen(true)}
                  placeholder="Search customers..."
                  className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                    errors.customerId ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {isCustomerDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => handleCustomerSelect(customer)}
                        className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <span className="font-medium block truncate">
                            {customer.name}
                          </span>
                        </div>
                        <span className="block truncate text-sm text-gray-500">
                          {customer.email}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                      No customers found
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.customerId && (
              <p className="mt-2 text-sm text-red-600" id="customerId-error">
                {errors.customerId}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="sm:col-span-3">
              <label 
                htmlFor="customerName" 
                className="block text-sm font-medium text-gray-700"
              >
                Customer Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={onChange}
                  className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                    errors.customerName ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                />
              </div>
              {errors.customerName && (
                <p className="mt-2 text-sm text-red-600" id="customerName-error">
                  {errors.customerName}
                </p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label 
                htmlFor="customerEmail" 
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={onChange}
                  className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                    errors.customerEmail ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                />
              </div>
              {errors.customerEmail && (
                <p className="mt-2 text-sm text-red-600" id="customerEmail-error">
                  {errors.customerEmail}
                </p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label 
                htmlFor="customerPhone" 
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={onChange}
                  className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                    errors.customerPhone ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                />
              </div>
              {errors.customerPhone && (
                <p className="mt-2 text-sm text-red-600" id="customerPhone-error">
                  {errors.customerPhone}
                </p>
              )}
            </div>

            <div className="sm:col-span-6">
              <label 
                htmlFor="customerAddress" 
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="customerAddress"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={onChange}
                  className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                    errors.customerAddress ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                />
              </div>
              {errors.customerAddress && (
                <p className="mt-2 text-sm text-red-600" id="customerAddress-error">
                  {errors.customerAddress}
                </p>
              )}
            </div>
          </>
        )}

        {/* Selected customer display (when existing customer is selected) */}
        {isExistingCustomer && selectedCustomer && (
          <div className="sm:col-span-6 bg-gray-50 p-4 rounded-md mt-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Customer:</h4>
            <p className="text-sm text-gray-900">{selectedCustomer.name}</p>
            <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
            <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
            <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
          </div>
        )}

        <div className="sm:col-span-3">
          <label 
            htmlFor="jobType" 
            className="block text-sm font-medium text-gray-700"
          >
            Job Type
          </label>
          <div className="mt-1">
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={onChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                errors.jobType ? "ring-red-500" : "ring-gray-300"
              } focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
            >
              <option value="">Select job type</option>
              {JOB_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          {errors.jobType && (
            <p className="mt-2 text-sm text-red-600" id="jobType-error">
              {errors.jobType}
            </p>
          )}
        </div>

        <div className="sm:col-span-6">
          <label 
            htmlFor="notes" 
            className="block text-sm font-medium text-gray-700"
          >
            Notes / Special Instructions
          </label>
          <div className="mt-1">
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={onChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                errors.notes ? "ring-red-500" : "ring-gray-300"
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
            />
          </div>
          {errors.notes && (
            <p className="mt-2 text-sm text-red-600" id="notes-error">
              {errors.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 