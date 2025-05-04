'use client';

import { useState, useEffect } from 'react';

export default function ApiDebugPage() {
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDebugData();
  }, []);

  const fetchDebugData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching debug data...');
      const response = await fetch('/debug-data');
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Debug data received:', data);
      setDebugData(data);
    } catch (err) {
      console.error('Error fetching debug data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Debug Information</h1>
      
      <div className="mb-4">
        <button 
          onClick={fetchDebugData}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Refresh Debug Data'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center p-8">Loading debug data...</div>
      ) : debugData ? (
        <div className="space-y-6">
          {/* Timestamp */}
          <div className="bg-white p-4 rounded shadow">
            <p><strong>Timestamp:</strong> {new Date(debugData.timestamp).toLocaleString()}</p>
            {debugData.environment && (
              <p><strong>Environment:</strong> {debugData.environment.nodeEnv || 'unknown'}</p>
            )}
          </div>
          
          {/* Database Connection */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Database Connection</h2>
            
            {/* Helper Function Connection */}
            <div className="mb-4">
              <h3 className="text-lg font-medium">Helper Function Connection</h3>
              <div className={`p-2 rounded ${debugData.database.connection === 'Success' ? 'bg-green-100' : 'bg-red-100'}`}>
                <p><strong>Status:</strong> {debugData.database.connection}</p>
                {debugData.database.error && (
                  <p><strong>Error:</strong> {debugData.database.error}</p>
                )}
              </div>
            </div>
            
            {/* Direct Connection */}
            <div>
              <h3 className="text-lg font-medium">Direct MySQL Connection</h3>
              <div className={`p-2 rounded ${debugData.directConnection.status === 'Connected' ? 'bg-green-100' : 'bg-red-100'}`}>
                <p><strong>Status:</strong> {debugData.directConnection.status}</p>
                {debugData.directConnection.error && (
                  <p><strong>Error:</strong> {debugData.directConnection.error}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Database Schema */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Database Schema</h2>
            <p><strong>Tables:</strong> {debugData.database.tables.join(', ') || 'No tables found'}</p>
          </div>
          
          {/* Customer Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Helper Function Customers */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Helper Query Customers</h2>
              {debugData.database.customers.length > 0 ? (
                <div className="bg-gray-100 p-2 rounded max-h-96 overflow-auto">
                  <pre>{JSON.stringify(debugData.database.customers, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-gray-500">No customers found</p>
              )}
            </div>
            
            {/* Direct Connection Customers */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Direct Query Customers</h2>
              {debugData.directConnection.customers.length > 0 ? (
                <div className="bg-gray-100 p-2 rounded max-h-96 overflow-auto">
                  <pre>{JSON.stringify(debugData.directConnection.customers, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-gray-500">No customers found</p>
              )}
            </div>
          </div>
          
          {/* MySQL File Info */}
          {debugData.mysqlFile && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">MySQL Configuration File</h2>
              <p><strong>File Exists:</strong> {debugData.mysqlFile.exists ? 'Yes' : 'No'}</p>
              <p><strong>Path:</strong> {debugData.mysqlFile.path}</p>
              
              {debugData.mysqlFile.error && (
                <div className="bg-red-100 p-2 rounded mt-2">
                  <p><strong>Error:</strong> {debugData.mysqlFile.error}</p>
                </div>
              )}
              
              {debugData.mysqlFile.exists && debugData.mysqlFile.content && (
                <div className="mt-2">
                  <h3 className="text-lg font-medium mb-1">File Content:</h3>
                  <div className="bg-gray-100 p-2 rounded max-h-96 overflow-auto">
                    <pre className="text-xs">{debugData.mysqlFile.content}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-8 bg-yellow-50 rounded">No debug data available</div>
      )}
    </div>
  );
} 