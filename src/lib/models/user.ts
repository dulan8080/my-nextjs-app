import { sql } from '@vercel/postgres';
import { executeQuery } from '../db';

export type User = {
  id: number;
  uid: string;
  email: string;
  display_name: string | null;
  email_verified: boolean;
  role: string;
  created_at: Date;
  updated_at: Date;
};

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await executeQuery<User[]>({
      query: `
        SELECT * FROM users 
        WHERE email = $1
        LIMIT 1
      `,
      values: [email.toLowerCase()]
    });
    
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const users = await executeQuery<User[]>({
      query: `
        SELECT * FROM users 
        WHERE id = $1
        LIMIT 1
      `,
      values: [id]
    });
    
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function createUser(userData: {
  uid: string;
  email: string;
  display_name?: string;
  role?: string;
  email_verified?: boolean;
}): Promise<User | null> {
  try {
    const { uid, email, display_name, role = 'customer', email_verified = false } = userData;
    
    const result = await sql`
      INSERT INTO users (uid, email, display_name, role, email_verified)
      VALUES (${uid}, ${email.toLowerCase()}, ${display_name || null}, ${role}, ${email_verified})
      RETURNING *
    `;
    
    return result.rows[0] as User;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User | null> {
  try {
    // Build the dynamic part of the query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    // Add fields to update
    for (const [key, value] of Object.entries(userData)) {
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
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const users = await executeQuery<User[]>({
      query,
      values
    });
    
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
} 