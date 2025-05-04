import { query } from '@/lib/mysql';

async function getCustomersDirectly() {
  try {
    return await query('SELECT * FROM customers ORDER BY id DESC');
  } catch (error) {
    console.error('Error fetching customers directly:', error);
    return [];
  }
}

export default async function DbDebugPage() {
  const customers = await getCustomersDirectly();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Database Debug Page</h1>
      <div className="bg-white rounded shadow-md overflow-hidden p-4">
        <h2 className="text-xl font-semibold mb-4">Direct Database Query Results</h2>
        <p className="mb-4">This page queries the database directly without using API routes.</p>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-medium mb-2">Customers ({Array.isArray(customers) ? customers.length : 0})</h3>
          
          {Array.isArray(customers) && customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer: any) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.created_at ? new Date(customer.created_at).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No customers found in the database.</p>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Raw Data</h3>
          <pre className="bg-gray-800 text-white p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(customers, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 