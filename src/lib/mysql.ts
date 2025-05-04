import mysql from 'mysql2/promise';

// Create a connection pool for the database
const pool = mysql.createPool({
  host: 'localhost', // XAMPP MySQL default host
  port: 3306,        // XAMPP MySQL default port
  user: 'root',      // XAMPP MySQL default user
  password: '',      // XAMPP MySQL default password (blank)
  database: 'dbprint',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: process.env.NODE_ENV !== 'production' // Enable debug mode in development
});

// Helper function to execute queries with better error handling
export async function query<T>(sql: string, params: any[] = []): Promise<T> {
  try {
    console.log(`Executing SQL: ${sql}`, params);
    const [results] = await pool.execute(sql, params);
    console.log(`Query results:`, results);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Failed SQL:', sql);
    console.error('Failed params:', params);
    throw error;
  }
}

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to XAMPP MySQL database');
    // Test query to verify database is working properly
    return connection.query('SELECT 1 + 1 AS solution')
      .then(([results]) => {
        console.log('MySQL connection test successful. Result:', results);
        connection.release();
      });
  })
  .catch(err => {
    console.error('Error connecting to XAMPP MySQL:', err);
    console.error('Please ensure XAMPP MySQL is running and the database "dbprint" exists.');
  });

export default pool; 