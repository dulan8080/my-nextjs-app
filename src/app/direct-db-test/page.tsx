import mysql from 'mysql2/promise';

// Function to directly connect to MySQL using environment variables
async function directDatabaseQuery() {
  let connection = null;
  try {
    // Create a direct connection to MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'dbprint'
    });

    // Directly execute SQL queries, bypassing the query helper function
    // Get the customers
    const [customers] = await connection.query('SELECT * FROM customers ORDER BY id DESC');
    
    // Insert a test customer directly
    const testCustomer = {
      name: `Direct Test ${new Date().toLocaleTimeString()}`,
      email: `direct-test-${Date.now()}@example.com`,
      phone: '555-123-4567',
      address: 'Direct Test Address'
    };
    
    const [insertResult] = await connection.query(
      'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [testCustomer.name, testCustomer.email, testCustomer.phone, testCustomer.address]
    );
    
    // Get all customers again to show the new one
    const [updatedCustomers] = await connection.query('SELECT * FROM customers ORDER BY id DESC');
    
    return {
      originalCustomers: customers,
      insertResult: {
        insertId: insertResult.insertId,
        affectedRows: insertResult.affectedRows
      },
      updatedCustomers: updatedCustomers,
      error: null
    };
  } catch (error) {
    console.error('Direct database query error:', error);
    return {
      originalCustomers: [],
      insertResult: null,
      updatedCustomers: [],
      error: {
        message: error.message,
        code: error.code
      }
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export default async function DirectDbTestPage() {
  const result = await directDatabaseQuery();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Direct Database Test</h1>
      
      {result.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          <p className="font-bold">Database Error</p>
          <p>Message: {result.error.message}</p>
          {result.error.code && <p>Code: {result.error.code}</p>}
        </div>
      ) : (
        <>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
            <p className="font-bold">Direct Connection Success!</p>
            {result.insertResult && (
              <p>Successfully inserted a new customer with ID: {result.insertResult.insertId}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded shadow-md p-4">
              <h2 className="text-xl font-semibold mb-3">Original Customers</h2>
              <p className="mb-2">Found {result.originalCustomers.length} customers before insert</p>
              <div className="bg-gray-100 p-3 rounded max-h-96 overflow-auto">
                <pre>{JSON.stringify(result.originalCustomers, null, 2)}</pre>
              </div>
            </div>
            
            <div className="bg-white rounded shadow-md p-4">
              <h2 className="text-xl font-semibold mb-3">Updated Customers</h2>
              <p className="mb-2">Found {result.updatedCustomers.length} customers after insert</p>
              <div className="bg-gray-100 p-3 rounded max-h-96 overflow-auto">
                <pre>{JSON.stringify(result.updatedCustomers, null, 2)}</pre>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
        <h2 className="text-lg font-semibold">MySQL Connection Notes</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>This page uses a direct MySQL connection without any helper functions</li>
          <li>It bypasses all application code to test the raw database connection</li>
          <li>If this works but your main app doesn't, the issue is in your app code</li>
          <li>If this fails, check your XAMPP MySQL connection settings</li>
        </ul>
      </div>
    </div>
  );
} 