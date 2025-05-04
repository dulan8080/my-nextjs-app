import { query } from '../mysql';

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    return await query<Customer[]>('SELECT * FROM customers ORDER BY name');
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  try {
    const results = await query<Customer[]>('SELECT * FROM customers WHERE id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error);
    return null;
  }
}

export async function createCustomer(customer: Customer): Promise<number | null> {
  try {
    const result = await query<any>(
      'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [customer.name, customer.email, customer.phone || null, customer.address || null]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

export async function updateCustomer(id: number, customer: Partial<Customer>): Promise<boolean> {
  try {
    // Build dynamic update query based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    
    if (customer.name !== undefined) {
      fields.push('name = ?');
      values.push(customer.name);
    }
    
    if (customer.email !== undefined) {
      fields.push('email = ?');
      values.push(customer.email);
    }
    
    if (customer.phone !== undefined) {
      fields.push('phone = ?');
      values.push(customer.phone);
    }
    
    if (customer.address !== undefined) {
      fields.push('address = ?');
      values.push(customer.address);
    }
    
    if (fields.length === 0) {
      return false; // Nothing to update
    }
    
    fields.push('updated_at = NOW()');
    values.push(id);
    
    const result = await query<any>(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`,
      [...values]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating customer with ID ${id}:`, error);
    return false;
  }
}

export async function deleteCustomer(id: number): Promise<boolean> {
  try {
    // Check if customer has any jobs before deleting
    const jobs = await query<any[]>(
      'SELECT COUNT(*) as count FROM jobs WHERE customer_id = ?',
      [id]
    );
    
    if (jobs[0].count > 0) {
      throw new Error('Cannot delete customer with active jobs');
    }
    
    const result = await query<any>('DELETE FROM customers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error deleting customer with ID ${id}:`, error);
    return false;
  }
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  try {
    const customers = await query<Customer[]>('SELECT * FROM customers WHERE email = ?', [email.toLowerCase()]);
    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error('Error fetching customer by email:', error);
    return null;
  }
}

export async function searchCustomers(searchTerm: string): Promise<Customer[]> {
  try {
    return await query<Customer[]>('SELECT * FROM customers WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR address LIKE ? ORDER BY name ASC LIMIT 20', [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`
    ]);
  } catch (error) {
    console.error('Error searching customers:', error);
    return [];
  }
} 