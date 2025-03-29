import { sql } from '@vercel/postgres';
import { executeQuery } from '../db';
import { Customer } from './customer';

export type Job = {
  id: number;
  customer_id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type JobWithCustomer = Job & {
  customer: Customer;
};

export async function getAllJobs(): Promise<Job[]> {
  try {
    return await executeQuery<Job[]>({
      query: `
        SELECT * FROM jobs 
        ORDER BY created_at DESC
      `
    });
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    return [];
  }
}

export async function getJobsWithCustomers(): Promise<JobWithCustomer[]> {
  try {
    return await executeQuery<JobWithCustomer[]>({
      query: `
        SELECT 
          j.*,
          json_build_object(
            'id', c.id,
            'name', c.name,
            'email', c.email,
            'phone', c.phone,
            'company', c.company,
            'address', c.address,
            'notes', c.notes,
            'created_at', c.created_at,
            'updated_at', c.updated_at
          ) as customer
        FROM jobs j
        JOIN customers c ON j.customer_id = c.id
        ORDER BY j.created_at DESC
      `
    });
  } catch (error) {
    console.error('Error fetching jobs with customers:', error);
    return [];
  }
}

export async function getJobById(id: number): Promise<Job | null> {
  try {
    const jobs = await executeQuery<Job[]>({
      query: `
        SELECT * FROM jobs 
        WHERE id = $1
        LIMIT 1
      `,
      values: [id]
    });
    
    return jobs.length > 0 ? jobs[0] : null;
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    return null;
  }
}

export async function getJobWithCustomer(id: number): Promise<JobWithCustomer | null> {
  try {
    const jobs = await executeQuery<JobWithCustomer[]>({
      query: `
        SELECT 
          j.*,
          json_build_object(
            'id', c.id,
            'name', c.name,
            'email', c.email,
            'phone', c.phone,
            'company', c.company,
            'address', c.address,
            'notes', c.notes,
            'created_at', c.created_at,
            'updated_at', c.updated_at
          ) as customer
        FROM jobs j
        JOIN customers c ON j.customer_id = c.id
        WHERE j.id = $1
        LIMIT 1
      `,
      values: [id]
    });
    
    return jobs.length > 0 ? jobs[0] : null;
  } catch (error) {
    console.error('Error fetching job with customer by ID:', error);
    return null;
  }
}

export async function getJobsByCustomerId(customerId: number): Promise<Job[]> {
  try {
    return await executeQuery<Job[]>({
      query: `
        SELECT * FROM jobs 
        WHERE customer_id = $1
        ORDER BY created_at DESC
      `,
      values: [customerId]
    });
  } catch (error) {
    console.error('Error fetching jobs by customer ID:', error);
    return [];
  }
}

export async function createJob(jobData: {
  customer_id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: Date | null;
}): Promise<Job | null> {
  try {
    const { customer_id, title, description, status = 'pending', priority = 'medium', due_date } = jobData;
    
    const result = await sql`
      INSERT INTO jobs (customer_id, title, description, status, priority, due_date)
      VALUES (${customer_id}, ${title}, ${description || null}, ${status}, ${priority}, ${due_date || null})
      RETURNING *
    `;
    
    return result.rows[0] as Job;
  } catch (error) {
    console.error('Error creating job:', error);
    return null;
  }
}

export async function updateJob(id: number, jobData: Partial<Job>): Promise<Job | null> {
  try {
    // Build the dynamic part of the query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    // Add fields to update
    for (const [key, value] of Object.entries(jobData)) {
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
      UPDATE jobs
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const jobs = await executeQuery<Job[]>({
      query,
      values
    });
    
    return jobs.length > 0 ? jobs[0] : null;
  } catch (error) {
    console.error('Error updating job:', error);
    return null;
  }
}

export async function deleteJob(id: number): Promise<boolean> {
  try {
    await executeQuery({
      query: `
        DELETE FROM jobs 
        WHERE id = $1
      `,
      values: [id]
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    return false;
  }
} 