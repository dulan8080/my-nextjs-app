import { createPool } from '@vercel/postgres';

// Create a connection pool to Vercel Postgres
export const db = createPool({
  connectionString: process.env.POSTGRES_URL,
});

// Helper function to execute queries with error handling
export async function executeQuery<T>({ query, values = [] }: { query: string; values?: any[] }): Promise<T> {
  try {
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