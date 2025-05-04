import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// POST /api/print-queue - Add a job to the print queue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.job_id || !body.customer_id || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields: job_id, customer_id, status' }, 
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['queued', 'printing', 'completed', 'failed'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, 
        { status: 400 }
      );
    }
    
    // Insert into print queue
    const result = await query<any>(
      `INSERT INTO print_queue (
        job_id, customer_id, status, priority, operator_notes
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        body.job_id,
        body.customer_id,
        body.status,
        body.priority || 1,
        body.operator_notes || null
      ]
    );
    
    if (!result.insertId) {
      return NextResponse.json({ error: 'Failed to add to print queue' }, { status: 500 });
    }
    
    // Return the newly created queue item ID
    return NextResponse.json({ id: result.insertId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error in print-queue POST API:', error);
    return NextResponse.json({ 
      error: 'Failed to add to print queue',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// GET /api/print-queue - Get all print queue items
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    // If an ID is provided, return that specific queue item
    if (id) {
      const item = await query(
        `SELECT pq.*, j.title as job_title, c.name as customer_name
         FROM print_queue pq
         JOIN jobs j ON pq.job_id = j.id
         JOIN customers c ON pq.customer_id = c.id
         WHERE pq.id = ?`,
        [id]
      );
      
      if (!item || !Array.isArray(item) || item.length === 0) {
        return NextResponse.json({ error: 'Print queue item not found' }, { status: 404 });
      }
      
      return NextResponse.json(item[0]);
    }
    
    // Otherwise, return a paginated list
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    
    const whereClause = status ? 'WHERE pq.status = ?' : '';
    const queryParams = status ? [status, limit, offset] : [limit, offset];
    
    const items = await query(
      `SELECT pq.*, j.title as job_title, c.name as customer_name
       FROM print_queue pq
       JOIN jobs j ON pq.job_id = j.id
       JOIN customers c ON pq.customer_id = c.id
       ${whereClause}
       ORDER BY pq.priority DESC, pq.added_at ASC
       LIMIT ? OFFSET ?`,
      queryParams
    );
    
    const countResult = await query<[{ total: number }]>(
      `SELECT COUNT(*) as total FROM print_queue ${status ? 'WHERE status = ?' : ''}`,
      status ? [status] : []
    );
    
    return NextResponse.json({
      items,
      total: countResult[0].total
    });
  } catch (error) {
    console.error('Error in print-queue GET API:', error);
    return NextResponse.json({ error: 'Failed to fetch print queue' }, { status: 500 });
  }
}

// PUT /api/print-queue/:id - Update a print queue item
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Print queue item ID is required' }, 
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate status if provided
    if (body.status) {
      const validStatuses = ['queued', 'printing', 'completed', 'failed'];
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
    
    if (body.status) {
      updates.push('status = ?');
      values.push(body.status);
      
      // Set timestamps based on status
      if (body.status === 'printing') {
        updates.push('started_at = NOW()');
      } else if (body.status === 'completed' || body.status === 'failed') {
        updates.push('completed_at = NOW()');
      }
    }
    
    if (body.priority) {
      updates.push('priority = ?');
      values.push(body.priority);
    }
    
    if (body.operator_notes) {
      updates.push('operator_notes = ?');
      values.push(body.operator_notes);
    }
    
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    // Add ID to values
    values.push(id);
    
    const result = await query<any>(
      `UPDATE print_queue SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Print queue item not found' }, 
        { status: 404 }
      );
    }
    
    // Get updated item
    const updatedItem = await query(
      `SELECT pq.*, j.title as job_title, c.name as customer_name
       FROM print_queue pq
       JOIN jobs j ON pq.job_id = j.id
       JOIN customers c ON pq.customer_id = c.id
       WHERE pq.id = ?`,
      [id]
    );
    
    if (!updatedItem || !Array.isArray(updatedItem) || updatedItem.length === 0) {
      return NextResponse.json({ error: 'Failed to retrieve updated print queue item' }, { status: 500 });
    }
    
    return NextResponse.json(updatedItem[0]);
  } catch (error) {
    console.error('Error in print-queue PUT API:', error);
    return NextResponse.json({ error: 'Failed to update print queue item' }, { status: 500 });
  }
}

// DELETE /api/print-queue/:id - Remove a job from the print queue
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Print queue item ID is required' }, 
        { status: 400 }
      );
    }
    
    const result = await query<any>(
      'DELETE FROM print_queue WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Print queue item not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in print-queue DELETE API:', error);
    return NextResponse.json({ error: 'Failed to delete print queue item' }, { status: 500 });
  }
} 