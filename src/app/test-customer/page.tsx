'use client';

import { useState } from 'react';

export default function TestCustomerPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createTestCustomer = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create a test customer with a unique email (using timestamp)
      const testCustomer = {
        name: `Test Customer ${new Date().toLocaleTimeString()}`,
        email: `test-${Date.now()}@example.com`,
        phone: '123-456-7890',
        address: 'Test Address'
      };

      console.log('Sending API request with data:', testCustomer);

      // Make the API request
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCustomer)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create customer');
      }

      console.log('API response:', responseData);
      setResult(responseData);

      // Fetch all customers to verify
      const customersResponse = await fetch('/api/customers');
      const customersData = await customersResponse.json();
      console.log('All customers:', customersData);

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Customer Creation</h1>

      <div className="mb-6">
        <button
          onClick={createTestCustomer}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Test Customer'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
          <p><strong>Success!</strong> Customer created:</p>
          <pre className="mt-2 bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Debugging Tips:</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Check the browser console for detailed API request/response logs</li>
          <li>Check the server console for database operation logs</li>
          <li>Verify the database connection in your MySQL setup</li>
          <li>Make sure XAMPP MySQL service is running</li>
        </ul>
      </div>
    </div>
  );
} 