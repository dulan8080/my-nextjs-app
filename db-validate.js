const mysql = require('mysql2/promise');

async function validateDatabase() {
  console.log('=== Database Validation Tool ===');
  
  let connection;
  
  try {
    // Connect to MySQL
    console.log('Connecting to MySQL...');
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    console.log('✓ Connection successful');
    
    // Check if database exists
    console.log('\nChecking for database "dbprint"...');
    const [databases] = await connection.query('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === 'dbprint');
    
    if (!dbExists) {
      console.log('✗ Database "dbprint" does not exist');
      console.log('Creating database...');
      await connection.query('CREATE DATABASE IF NOT EXISTS dbprint');
      console.log('✓ Database created');
    } else {
      console.log('✓ Database exists');
    }
    
    // Connect to the dbprint database
    console.log('\nConnecting to dbprint database...');
    await connection.query('USE dbprint');
    console.log('✓ Connected to dbprint');
    
    // Check tables
    console.log('\nChecking tables...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`Found ${tables.length} tables:`);
    
    const tableNames = tables.map(table => Object.values(table)[0]);
    console.log(tableNames.join(', ') || 'No tables found');
    
    // Check if required tables exist
    const requiredTables = ['customers', 'jobs', 'print_queue', 'users'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.log(`\n✗ Missing tables: ${missingTables.join(', ')}`);
      console.log('Please run the database setup script: npm run db:setup');
    } else {
      console.log('\n✓ All required tables exist');
    }
    
    // Check customers table
    if (tableNames.includes('customers')) {
      console.log('\nChecking customers table...');
      const [customers] = await connection.query('SELECT * FROM customers');
      console.log(`Found ${customers.length} customer records`);
      
      if (customers.length > 0) {
        console.log('\nLatest customers:');
        customers.slice(0, 3).forEach(customer => {
          console.log(`- ID: ${customer.id}, Name: ${customer.name}, Email: ${customer.email}`);
        });
      }
      
      // Test inserting a record
      console.log('\nTesting customer insertion...');
      const testEmail = `test-${Date.now()}@example.com`;
      const [insertResult] = await connection.query(
        'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
        [`Test Customer ${new Date().toLocaleTimeString()}`, testEmail, '123-456-7890', 'Test Address']
      );
      
      if (insertResult.insertId) {
        console.log(`✓ Successfully inserted test customer with ID: ${insertResult.insertId}`);
        
        // Verify the inserted record
        const [inserted] = await connection.query('SELECT * FROM customers WHERE id = ?', [insertResult.insertId]);
        if (inserted.length > 0) {
          console.log('✓ Successfully retrieved the inserted record');
        }
      } else {
        console.log('✗ Failed to insert test customer');
      }
    }
    
    console.log('\n=== Database validation completed ===');
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\nMake sure XAMPP MySQL service is running.');
      console.error('1. Open XAMPP Control Panel');
      console.error('2. Start the MySQL service');
      console.error('3. Try running this script again');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

validateDatabase().catch(console.error); 