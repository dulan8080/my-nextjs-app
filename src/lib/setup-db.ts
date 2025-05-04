import fs from 'fs';
import path from 'path';
// Use require for mysql2 to avoid TypeScript issues
const mysql = require('mysql2/promise');

// Read the schema file
const schemaPath = path.join(process.cwd(), 'src/lib/mysql-schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split the schema into separate statements
const statements = schema
  .split(';')
  .filter(statement => statement.trim() !== '')
  .map(statement => statement.trim() + ';');

// XAMPP MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: ''
};

async function setupDatabase() {
  console.log('Setting up the database in XAMPP MySQL...');

  // First create a connection without specifying a database
  const initialConnection = await mysql.createConnection(dbConfig);

  try {
    // First run the CREATE DATABASE statement to ensure the database exists
    // Find the create database statement
    const createDbStatement = statements.find(stmt => 
      stmt.toLowerCase().includes('create database')
    );
    
    if (createDbStatement) {
      console.log('Creating database if not exists...');
      await initialConnection.execute(createDbStatement);
    }
    
    // Close the initial connection
    await initialConnection.end();
    
    // Create a new connection to the specific database
    const connection = await mysql.createConnection({
      ...dbConfig,
      database: 'dbprint',
      multipleStatements: true
    });
    
    // Execute all remaining SQL statements
    console.log('Creating tables and setting up schema...');
    for (const statement of statements) {
      // Skip the CREATE DATABASE statement as we've already run it
      if (!statement.toLowerCase().includes('create database') &&
          !statement.toLowerCase().includes('use dbprint')) {
        try {
          await connection.execute(statement);
        } catch (error) {
          console.error(`Error executing SQL statement: ${statement}`);
          console.error(error);
          // Continue with other statements even if one fails
        }
      }
    }
    
    console.log('Database setup complete.');
    await connection.end();
    
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}

// Execute the function if this file is run directly
if (require.main === module) {
  setupDatabase()
    .then(success => {
      if (success) {
        console.log('Database setup completed successfully in XAMPP MySQL.');
        process.exit(0);
      } else {
        console.error('Database setup failed.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

export default setupDatabase; 