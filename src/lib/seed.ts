import { db } from './db';
import fs from 'fs';
import path from 'path';

async function seedDatabase() {
  // Skip database operations during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Build time - skipping database seeding');
    return;
  }
  
  try {
    console.log('Connecting to database...');
    
    if (!db) {
      throw new Error('Database connection not initialized');
    }
    
    const client = await db.connect();

    // Read and execute schema
    console.log('Creating schema...');
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schema);

    console.log('Seeding users...');
    // Seed admin user
    await client.query(`
      INSERT INTO users (uid, email, display_name, email_verified, role)
      VALUES ('admin-user-id', 'admin@zynkprint.com', 'Admin User', true, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);

    // Seed sample customers
    console.log('Seeding customers...');
    await client.query(`
      INSERT INTO customers (name, email, phone, company, address, notes)
      VALUES 
        ('Acme Corporation', 'contact@acmecorp.com', '123-456-7890', 'Acme Corp', '123 Main St, City, Country', 'Regular customer'),
        ('TechStart Inc', 'info@techstart.io', '987-654-3210', 'TechStart', '456 Innovation Ave, Tech City', 'New startup client'),
        ('Global Media Group', 'media@globalmedia.com', '555-123-4567', 'Global Media', '789 Broadcasting Blvd, Mediaville', 'Large media company')
      ON CONFLICT DO NOTHING;
    `);

    // Seed sample jobs
    console.log('Seeding jobs...');
    await client.query(`
      INSERT INTO jobs (customer_id, title, description, status, priority, due_date)
      VALUES 
        (1, 'Business Cards', 'Print 200 business cards', 'in_progress', 'high', NOW() + INTERVAL '3 days'),
        (1, 'Company Brochures', 'Full color tri-fold brochures', 'pending', 'medium', NOW() + INTERVAL '7 days'),
        (2, 'Launch Banners', 'Event banners for product launch', 'pending', 'high', NOW() + INTERVAL '5 days'),
        (3, 'Magazine Inserts', 'Special advertising inserts', 'completed', 'medium', NOW() - INTERVAL '2 days')
      ON CONFLICT DO NOTHING;
    `);

    // Seed sample job items
    console.log('Seeding job items...');
    await client.query(`
      INSERT INTO job_items (job_id, name, quantity, specs, status)
      VALUES 
        (1, 'Executive Cards', 100, '16pt, Matte Finish, 2-sided', 'in_progress'),
        (1, 'Staff Cards', 100, '14pt, Gloss Finish, 2-sided', 'pending'),
        (2, 'Product Brochure', 500, 'Full color, 100lb gloss paper', 'pending'),
        (3, 'Large Banner', 2, '6ft x 3ft, Full color, Vinyl', 'design'),
        (3, 'Table Banner', 3, '2ft x 1ft, Full color, Rollup design', 'pending'),
        (4, 'Magazine Insert A', 1000, '8.5 x 11, Full color, 2-sided', 'completed'),
        (4, 'Magazine Insert B', 1000, '8.5 x 11, Full color, 2-sided', 'completed')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Database seeded successfully!');
    client.release();
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Check if this file is being run directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}

export default seedDatabase; 