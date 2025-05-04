import fs from 'fs';
import path from 'path';
import { query } from './mysql';

/**
 * Script to set up the offset print jobs schema in the MySQL database
 */
export async function setupOffsetSchema() {
  try {
    console.log('Setting up offset print jobs schema...');

    // Read schema SQL file
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'offset-jobs-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL into individual statements
    // This is a simple split that works for most cases,
    // but more complex SQL with triggers might need a more robust parser
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await query(statement);
      } catch (error: any) {
        // Ignore "table already exists" errors (error 1050)
        if (error.errno === 1050) {
          console.log(`Table already exists: ${error.message}`);
        } else {
          throw error;
        }
      }
    }

    console.log('✅ Offset print jobs schema setup complete');
    
    // Verify tables were created
    const tables = await query<any[]>(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name LIKE 'offset_%'
    `);
    
    console.log('Created tables:');
    tables.forEach(table => {
      console.log(`- ${table.table_name}`);
    });

    return true;
  } catch (error) {
    console.error('Error setting up offset print jobs schema:', error);
    return false;
  }
}

// If this file is run directly (not imported)
if (require.main === module) {
  setupOffsetSchema()
    .then(() => {
      console.log('Setup completed, exiting...');
      process.exit(0);
    })
    .catch(error => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
} 