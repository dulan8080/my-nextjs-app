import { query } from '../mysql';

export interface Job {
  id?: number;
  customer_id: number;
  title: string;
  description?: string;
  job_type: 'offset' | 'digital' | 'large_format';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: Date;
  created_at?: Date;
  updated_at?: Date;
  job_details?: any; // JSON data specific to job type
}

export async function getAllJobs(): Promise<Job[]> {
  try {
    return await query<Job[]>(`
      SELECT jobs.*, customers.name as customer_name
      FROM jobs
      JOIN customers ON jobs.customer_id = customers.id
      ORDER BY jobs.created_at DESC
    `);
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    return [];
  }
}

export async function getPendingJobs(): Promise<Job[]> {
  try {
    return await query<Job[]>(`
      SELECT jobs.*, customers.name as customer_name
      FROM jobs
      JOIN customers ON jobs.customer_id = customers.id
      WHERE jobs.status = 'pending'
      ORDER BY jobs.due_date ASC
    `);
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    return [];
  }
}

export async function getJobById(id: number): Promise<Job | null> {
  try {
    const jobs = await query<Job[]>(`
      SELECT jobs.*, customers.name as customer_name
      FROM jobs
      JOIN customers ON jobs.customer_id = customers.id
      WHERE jobs.id = ?
    `, [id]);
    
    return jobs.length > 0 ? jobs[0] : null;
  } catch (error) {
    console.error(`Error fetching job with ID ${id}:`, error);
    return null;
  }
}

export async function getJobsByCustomerId(customerId: number): Promise<Job[]> {
  try {
    return await query<Job[]>(`
      SELECT * FROM jobs
      WHERE customer_id = ?
      ORDER BY created_at DESC
    `, [customerId]);
  } catch (error) {
    console.error(`Error fetching jobs for customer ${customerId}:`, error);
    return [];
  }
}

export async function createJob(job: Job): Promise<number | null> {
  try {
    // Convert job details to JSON if provided
    const jobDetailsJson = job.job_details ? JSON.stringify(job.job_details) : null;
    
    const result = await query<any>(`
      INSERT INTO jobs (
        customer_id, title, description, job_type, 
        status, due_date, job_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      job.customer_id,
      job.title,
      job.description || null,
      job.job_type,
      job.status || 'pending',
      job.due_date || null,
      jobDetailsJson
    ]);
    
    return result.insertId;
  } catch (error) {
    console.error('Error creating job:', error);
    return null;
  }
}

export async function updateJob(id: number, job: Partial<Job>): Promise<boolean> {
  try {
    // Build dynamic update query based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    
    // Check each possible field and add to update if present
    if (job.customer_id !== undefined) {
      fields.push('customer_id = ?');
      values.push(job.customer_id);
    }
    
    if (job.title !== undefined) {
      fields.push('title = ?');
      values.push(job.title);
    }
    
    if (job.description !== undefined) {
      fields.push('description = ?');
      values.push(job.description);
    }
    
    if (job.job_type !== undefined) {
      fields.push('job_type = ?');
      values.push(job.job_type);
    }
    
    if (job.status !== undefined) {
      fields.push('status = ?');
      values.push(job.status);
    }
    
    if (job.due_date !== undefined) {
      fields.push('due_date = ?');
      values.push(job.due_date);
    }
    
    if (job.job_details !== undefined) {
      fields.push('job_details = ?');
      values.push(JSON.stringify(job.job_details));
    }
    
    if (fields.length === 0) {
      return false; // Nothing to update
    }
    
    fields.push('updated_at = NOW()');
    values.push(id);
    
    const result = await query<any>(`
      UPDATE jobs
      SET ${fields.join(', ')}
      WHERE id = ?
    `, [...values]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating job with ID ${id}:`, error);
    return false;
  }
}

export async function updateJobStatus(id: number, status: Job['status']): Promise<boolean> {
  try {
    const result = await query<any>(`
      UPDATE jobs
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `, [status, id]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating status for job ID ${id}:`, error);
    return false;
  }
}

export async function deleteJob(id: number): Promise<boolean> {
  try {
    // Check if job is in the print queue before deleting
    const queueItems = await query<any[]>(`
      SELECT COUNT(*) as count 
      FROM print_queue 
      WHERE job_id = ?
    `, [id]);
    
    if (queueItems[0].count > 0) {
      throw new Error('Cannot delete job that is in the print queue');
    }
    
    const result = await query<any>(`
      DELETE FROM jobs
      WHERE id = ?
    `, [id]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error deleting job with ID ${id}:`, error);
    return false;
  }
} 