import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Simple authorization to prevent unauthorized access
  // In production, use a more secure authentication method
  if (authHeader !== `Bearer ${process.env.SETUP_SECRET_KEY || 'setup-secret-key'}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await sql.query(schema);
    
    // Seed the admin user
    await sql`
      INSERT INTO users (uid, email, display_name, email_verified, role)
      VALUES ('admin-user-id', 'admin@zynkprint.com', 'Admin User', true, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `;

    // Seed sample customers
    await sql`
      INSERT INTO customers (name, email, phone, company, address, notes)
      VALUES 
        ('Acme Corporation', 'contact@acmecorp.com', '123-456-7890', 'Acme Corp', '123 Main St, City, Country', 'Regular customer'),
        ('TechStart Inc', 'info@techstart.io', '987-654-3210', 'TechStart', '456 Innovation Ave, Tech City', 'New startup client'),
        ('Global Media Group', 'media@globalmedia.com', '555-123-4567', 'Global Media', '789 Broadcasting Blvd, Mediaville', 'Large media company')
      ON CONFLICT DO NOTHING;
    `;

    // Seed sample jobs
    await sql`
      INSERT INTO jobs (customer_id, title, description, status, priority, due_date)
      VALUES 
        (1, 'Business Cards', 'Print 200 business cards', 'in_progress', 'high', NOW() + INTERVAL '3 days'),
        (1, 'Company Brochures', 'Full color tri-fold brochures', 'pending', 'medium', NOW() + INTERVAL '7 days'),
        (2, 'Launch Banners', 'Event banners for product launch', 'pending', 'high', NOW() + INTERVAL '5 days'),
        (3, 'Magazine Inserts', 'Special advertising inserts', 'completed', 'medium', NOW() - INTERVAL '2 days')
      ON CONFLICT DO NOTHING;
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Database schema and initial data created successfully' 
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { error: 'Failed to set up database', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 