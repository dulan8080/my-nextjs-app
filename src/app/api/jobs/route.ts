import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET /api/jobs - Get all jobs or a specific one
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    // If an ID is provided, return that specific job
    if (id) {
      const jobs = await query(
        `SELECT j.*, c.name as customer_name 
         FROM jobs j 
         LEFT JOIN customers c ON j.customer_id = c.id 
         WHERE j.id = ?`,
        [id]
      );
      
      if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      
      return NextResponse.json(jobs[0]);
    }
    
    // Otherwise, return a paginated list
    const status = url.searchParams.get('status');
    const jobType = url.searchParams.get('job_type');
    const customerId = url.searchParams.get('customer_id');
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    
    // Build WHERE clause and parameters
    const conditions = [];
    const params = [];
    
    if (status) {
      conditions.push('j.status = ?');
      params.push(status);
    }
    
    if (jobType) {
      conditions.push('j.job_type = ?');
      params.push(jobType);
    }
    
    if (customerId) {
      conditions.push('j.customer_id = ?');
      params.push(customerId);
    }
    
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Add pagination params
    params.push(limit, offset);
    
    const jobs = await query(
      `SELECT j.*, c.name as customer_name 
       FROM jobs j 
       LEFT JOIN customers c ON j.customer_id = c.id 
       ${whereClause} 
       ORDER BY j.created_at DESC 
       LIMIT ? OFFSET ?`,
      params
    );
    
    // Get total count
    const countParams = params.slice(0, -2); // Remove limit and offset
    const countResult = await query<[{ total: number }]>(
      `SELECT COUNT(*) as total FROM jobs j ${whereClause}`,
      countParams
    );
    
    return NextResponse.json({
      jobs,
      total: countResult[0].total
    });
  } catch (error) {
    console.error('Error in jobs GET API:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer_id || !body.title || !body.job_type) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_id, title, job_type' }, 
        { status: 400 }
      );
    }
    
    // Validate job type
    const validJobTypes = ['offset', 'digital', 'large_format'];
    if (!validJobTypes.includes(body.job_type)) {
      return NextResponse.json(
        { error: `Invalid job_type. Must be one of: ${validJobTypes.join(', ')}` }, 
        { status: 400 }
      );
    }
    
    // Validate status if provided
    if (body.status) {
      const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, 
          { status: 400 }
        );
      }
    }
    
    // Insert job
    const result = await query<any>(
      `INSERT INTO jobs (
        customer_id, title, description, job_type, status, due_date, job_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        body.customer_id,
        body.title,
        body.description || null,
        body.job_type,
        body.status || 'pending',
        body.due_date || null,
        body.job_details ? JSON.stringify(body.job_details) : null
      ]
    );
    
    if (!result.insertId) {
      return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
    
    // Fetch the newly created job
    const jobs = await query(
      `SELECT j.*, c.name as customer_name 
       FROM jobs j 
       LEFT JOIN customers c ON j.customer_id = c.id 
       WHERE j.id = ?`,
      [result.insertId]
    );
    
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json({ error: 'Failed to retrieve created job' }, { status: 500 });
    }
    
    return NextResponse.json(jobs[0], { status: 201 });
  } catch (error) {
    console.error('Error in jobs POST API:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

// PUT /api/jobs/:id - Update a job
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' }, 
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate job type if provided
    if (body.job_type) {
      const validJobTypes = ['offset', 'digital', 'large_format'];
      if (!validJobTypes.includes(body.job_type)) {
        return NextResponse.json(
          { error: `Invalid job_type. Must be one of: ${validJobTypes.join(', ')}` }, 
          { status: 400 }
        );
      }
    }
    
    // Validate status if provided
    if (body.status) {
      const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, 
          { status: 400 }
        );
      }
    }
    
    // Build update query
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(body)) {
      // Skip id
      if (key === 'id') continue;
      
      // Handle job_details as JSON
      if (key === 'job_details') {
        updates.push('job_details = ?');
        values.push(JSON.stringify(value));
      } else {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    // Add updated_at timestamp
    updates.push('updated_at = NOW()');
    
    // Add ID to values
    values.push(id);
    
    const result = await query<any>(
      `UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Job not found' }, 
        { status: 404 }
      );
    }
    
    // Fetch the updated job
    const jobs = await query(
      `SELECT j.*, c.name as customer_name 
       FROM jobs j 
       LEFT JOIN customers c ON j.customer_id = c.id 
       WHERE j.id = ?`,
      [id]
    );
    
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json({ error: 'Could not fetch updated job' }, { status: 500 });
    }
    
    return NextResponse.json(jobs[0]);
  } catch (error) {
    console.error('Error in jobs PUT API:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE /api/jobs/:id - Delete a job
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' }, 
        { status: 400 }
      );
    }
    
    // Check if job has print queue items
    const queueItems = await query<[{ count: number }]>(
      'SELECT COUNT(*) as count FROM print_queue WHERE job_id = ?',
      [id]
    );
    
    if (queueItems[0].count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete job with items in the print queue' }, 
        { status: 409 }
      );
    }
    
    const result = await query<any>(
      'DELETE FROM jobs WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Job not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in jobs DELETE API:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
} 