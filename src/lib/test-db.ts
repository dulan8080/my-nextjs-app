import { db } from './db';

async function testConnection() {
  // Skip database operations during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Build time - skipping database connection test');
    return;
  }
  
  console.log('Testing database connection...');
  try {
    if (!db) {
      throw new Error('Database connection not initialized');
    }
    
    const client = await db.connect();
    console.log('Successfully connected to Vercel Postgres database!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as time');
    console.log('Server time:', result.rows[0].time);
    
    // Check if our tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\nDatabase tables:');
    if (tablesResult.rows.length === 0) {
      console.log('No tables found. You may need to run the seed script.');
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`- ${row.table_name}`);
      });
    }
    
    client.release();
  } catch (error) {
    console.error('Error connecting to database:', error);
    console.log('\nPlease check your .env.local file and make sure your Vercel Postgres database is set up correctly.');
    console.log('See README.md for setup instructions.');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to test database connection:', error);
      process.exit(1);
    });
}

export default testConnection; 