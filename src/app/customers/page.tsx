'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [isDirectLoading, setIsDirectLoading] = useState(false);
  const [directError, setDirectError] = useState<string | null>(null);
  
  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers... (Request URL: /api/customers)');
      setIsLoading(true);
      setError(null);
      
      // Log the fetch request details
      console.log('Starting fetch request with the following config:', { 
        method: 'GET',
        url: '/api/customers',
        headers: {'Content-Type': 'application/json'}
      });
      
      const response = await fetch('/api/customers');
      console.log('API Response status:', response.status, response.statusText);
      console.log('API Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched customers raw data:', data);
      console.log('Data type:', typeof data, Array.isArray(data) ? 'is array' : 'not array');
      console.log('Data length:', Array.isArray(data) ? data.length : 'N/A');
      
      // Ensure we're setting the state with the array of customers
      if (Array.isArray(data)) {
        console.log('Setting customers state with data array of length:', data.length);
        setCustomers(data);
      } else {
        console.error('Expected array of customers but got:', data);
        setError('Received invalid data format from server');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Submitting form with data:', newCustomer);
      setError(null);
      
      // Validate form
      if (!newCustomer.name || !newCustomer.email) {
        setError('Name and email are required fields');
        return;
      }
      
      // Send POST request to create customer
      console.log('Sending API request...');
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCustomer)
      });
      
      // Get the response data
      const responseData = await response.json();
      console.log('API response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create customer');
      }
      
      // Add the new customer to the list
      if (responseData && responseData.id) {
        console.log('Created customer:', responseData);
        
        // Update the customers list with the new customer
        setCustomers(prev => [responseData, ...prev]);
        
        // Reset form
        setNewCustomer({
          name: '',
          email: '',
          phone: '',
          address: ''
        });
      } else {
        console.error('Created customer has invalid format:', responseData);
        throw new Error('Server returned invalid customer data');
      }
    } catch (err) {
      console.error('Error creating customer:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  // Handle customer deletion
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }
    
    try {
      console.log(`Deleting customer with ID: ${id}`);
      const response = await fetch(`/api/customers?id=${id}`, {
        method: 'DELETE'
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to delete customer');
      }
      
      console.log('Customer deleted successfully');
      
      // Remove customer from list
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };
  
  // Direct fetch from debug endpoint as a fallback method
  const fetchDirectCustomers = async () => {
    try {
      console.log('Fetching customers directly from debug endpoint...');
      setIsDirectLoading(true);
      setDirectError(null);
      
      const response = await fetch('/debug-data');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch debug data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched debug data:', data);
      
      // Extract customers from the debug data
      if (data && data.database && Array.isArray(data.database.customers)) {
        console.log('Found customers in debug data:', data.database.customers);
        setCustomers(data.database.customers);
      } else if (data && data.directConnection && Array.isArray(data.directConnection.customers)) {
        console.log('Found customers in direct connection data:', data.directConnection.customers);
        setCustomers(data.directConnection.customers);
      } else {
        console.error('No customers found in debug data');
        setDirectError('No customers found in debug data');
      }
    } catch (err) {
      console.error('Error fetching customers directly:', err);
      setDirectError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsDirectLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
      
      {/* Error alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {/* Add customer form */}
      <div className="bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCustomer.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={newCustomer.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={newCustomer.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Add Customer
          </button>
        </form>
      </div>
      
      {/* Debug info */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-8">
        <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
        <p className="mb-1">Customer count: {customers.length}</p>
        <p className="mb-1">Loading state: {isLoading ? 'Loading...' : 'Loaded'}</p>
        <p className="mb-1">Error state: {error ? `Error: ${error}` : 'No errors'}</p>
        <p className="mb-1">Customer IDs: {customers.map(c => c.id).join(', ') || 'None'}</p>
        
        <div className="mt-3 flex space-x-2">
          <button 
            onClick={fetchCustomers}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          >
            Manually Refresh
          </button>
          
          <button 
            onClick={() => console.log('Current customers state:', customers)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Log Customers to Console
          </button>
          
          <button 
            onClick={fetchDirectCustomers}
            disabled={isDirectLoading}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            {isDirectLoading ? 'Loading...' : 'Load from Debug Data'}
          </button>
        </div>
        
        {directError && (
          <div className="mt-2 text-red-600 text-sm">
            <p>Direct fetch error: {directError}</p>
          </div>
        )}
      </div>
      
      {/* Customers list */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Customers List</h2>
        
        {isLoading ? (
          <div className="p-4 text-center">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No customers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.phone || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => handleDelete(customer.id!)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 