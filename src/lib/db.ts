import { createPool } from '@vercel/postgres';

// Skip database initialization during build
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Create a connection pool to Vercel Postgres
export const db = isBuildTime 
  ? null 
  : createPool({
      connectionString: process.env.POSTGRES_URL,
    });

// Helper function to execute queries with error handling
export async function executeQuery<T>({ query, values = [] }: { query: string; values?: any[] }): Promise<T> {
  // Return mock data during build time
  if (isBuildTime) {
    console.log('Build time - returning mock data for query');
    return [] as unknown as T;
  }
  
  try {
    if (!db) {
      throw new Error('Database connection not initialized');
    }
    
    const client = await db.connect();
    try {
      const result = await client.query(query, values);
      return result.rows as T;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to execute database query');
  }
} 