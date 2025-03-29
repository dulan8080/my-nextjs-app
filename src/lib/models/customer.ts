import { sql } from '@vercel/postgres';
import { executeQuery } from '../db';

export type Customer = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
};

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    return await executeQuery<Customer[]>({
      query: `
        SELECT * FROM customers 
        ORDER BY name ASC
      `
    });
  } catch (error) {
    console.error('Error fetching all customers:', error);
    return [];
  }
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  try {
    const customers = await executeQuery<Customer[]>({
      query: `
        SELECT * FROM customers 
        WHERE id = $1
        LIMIT 1
      `,
      values: [id]
    });
    
    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    return null;
  }
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  try {
    const customers = await executeQuery<Customer[]>({
      query: `
        SELECT * FROM customers 
        WHERE email = $1
        LIMIT 1
      `,
      values: [email.toLowerCase()]
    });
    
    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error('Error fetching customer by email:', error);
    return null;
  }
}

export async function createCustomer(customerData: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
}): Promise<Customer | null> {
  try {
    const { name, email, phone, company, address, notes } = customerData;
    
    const result = await sql`
      INSERT INTO customers (name, email, phone, company, address, notes)
      VALUES (${name}, ${email || null}, ${phone || null}, ${company || null}, ${address || null}, ${notes || null})
      RETURNING *
    `;
    
    return result.rows[0] as Customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

export async function updateCustomer(id: number, customerData: Partial<Customer>): Promise<Customer | null> {
  try {
    // Build the dynamic part of the query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    // Add fields to update
    for (const [key, value] of Object.entries(customerData)) {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }
    
    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);
    
    // Add the id parameter
    values.push(id);
    
    const query = `
      UPDATE customers
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const customers = await executeQuery<Customer[]>({
      query,
      values
    });
    
    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error('Error updating customer:', error);
    return null;
  }
}

export async function deleteCustomer(id: number): Promise<boolean> {
  try {
    await executeQuery({
      query: `
        DELETE FROM customers 
        WHERE id = $1
      `,
      values: [id]
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting customer:', error);
    return false;
  }
} 