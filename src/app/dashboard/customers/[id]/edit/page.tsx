"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock customer data - in a real app, this would come from an API
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
    notes: "Long-standing client since 2015. Prefers email communication.",
    createdAt: new Date(2015, 3, 15),
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
    notes: "Tech startup with frequent orders for marketing materials.",
    createdAt: new Date(2019, 6, 22),
    jobCount: 8,
    totalSpent: 9240.50
  }
];

// Get status color
const getStatusColor = (status: string) => {
  switch(status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Inactive": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    type: "",
    status: "",
    notes: ""
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
  }>({});

  useEffect(() => {
    // Simulating API call to fetch customer details
    const foundCustomer = mockCustomers.find(c => c.id === customerId);
    
    // Delay to simulate network request
    const timer = setTimeout(() => {
      if (foundCustomer) {
        setCustomer(foundCustomer);
        setFormData({
          name: foundCustomer.name,
          contactPerson: foundCustomer.contactPerson,
          email: foundCustomer.email,
          phone: foundCustomer.phone,
          address: foundCustomer.address,
          type: foundCustomer.type,
          status: foundCustomer.status,
          notes: foundCustomer.notes || ""
        });
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [customerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
    
    if (!formData.contactPerson || formData.contactPerson.length < 2) {
      errors.contactPerson = "Contact person must be at least 2 characters.";
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    
    if (!formData.phone || formData.phone.length < 7) {
      errors.phone = "Please enter a valid phone number.";
    }
    
    if (!formData.address || formData.address.length < 10) {
      errors.address = "Please enter a complete address.";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // In a real app, this would be an API call to update the customer
      // Simulating API call delay
      setTimeout(() => {
        setIsSubmitting(false);
        // Navigate back to customer details page after successful update
        router.push(`/dashboard/customers/${customerId}`);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Customer Not Found</h2>
        <p className="mb-6">The customer you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/customers">
          <Button>Back to Customers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/customers/${customer.id}`}>
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Back to Details
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Edit Customer {customer.id}</h1>
            <Badge className={getStatusColor(customer.status)}>
              {customer.status}
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">Edit customer details below and save changes when done</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company/Customer Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500`}
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
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${formErrors.contactPerson ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500`}
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
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500`}
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
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500`}
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
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
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any important notes about this customer..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Link href={`/dashboard/customers/${customer.id}`}>
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export async function generateStaticParams() {
  // Return all the customer IDs you want to pre-render
  return [
    { id: 'customer1' },
    { id: 'customer2' },
    { id: 'customer3' }
  ];
} 