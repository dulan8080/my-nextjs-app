const mysql = require('mysql2/promise');

async function checkDatabase() {
  // Connect to database
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'dbprint'
  });

  try {
    console.log('Checking database tables...\n');
    
    // Show all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables in dbprint database:');
    tables.forEach(table => {
      console.log(`- ${Object.values(table)[0]}`);
    });

    // Check customers table
    const [customers] = await connection.query('SELECT * FROM customers');
    console.log('\nCustomers in database:');
    console.log(JSON.stringify(customers, null, 2));

    // Check table structure
    const [customerStructure] = await connection.query('DESCRIBE customers');
    console.log('\nCustomers table structure:');
    console.log(JSON.stringify(customerStructure, null, 2));

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await connection.end();
  }
}

checkDatabase()
  .then(() => {
    console.log('\nDatabase check completed.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 