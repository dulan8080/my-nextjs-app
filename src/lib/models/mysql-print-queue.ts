import { query } from '../mysql';

export interface PrintQueueItem {
  id?: number;
  job_id: number;
  customer_id: number;
  status: 'queued' | 'printing' | 'completed' | 'failed';
  priority: number;
  added_at?: Date;
  started_at?: Date;
  completed_at?: Date;
  operator_notes?: string;
}

export async function getAllQueueItems(): Promise<PrintQueueItem[]> {
  try {
    return await query<PrintQueueItem[]>(`
      SELECT pq.*, j.title as job_title, c.name as customer_name
      FROM print_queue pq
      JOIN jobs j ON pq.job_id = j.id
      JOIN customers c ON pq.customer_id = c.id
      ORDER BY pq.priority DESC, pq.added_at ASC
    `);
  } catch (error) {
    console.error('Error fetching print queue items:', error);
    return [];
  }
}

export async function getQueueItemById(id: number): Promise<PrintQueueItem | null> {
  try {
    const items = await query<PrintQueueItem[]>(`
      SELECT pq.*, j.title as job_title, c.name as customer_name
      FROM print_queue pq
      JOIN jobs j ON pq.job_id = j.id
      JOIN customers c ON pq.customer_id = c.id
      WHERE pq.id = ?
    `, [id]);
    
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error(`Error fetching print queue item with ID ${id}:`, error);
    return null;
  }
}

export async function getQueueItemsByStatus(status: PrintQueueItem['status']): Promise<PrintQueueItem[]> {
  try {
    return await query<PrintQueueItem[]>(`
      SELECT pq.*, j.title as job_title, c.name as customer_name
      FROM print_queue pq
      JOIN jobs j ON pq.job_id = j.id
      JOIN customers c ON pq.customer_id = c.id
      WHERE pq.status = ?
      ORDER BY pq.priority DESC, pq.added_at ASC
    `, [status]);
  } catch (error) {
    console.error(`Error fetching print queue items with status ${status}:`, error);
    return [];
  }
}

export async function addToQueue(item: Omit<PrintQueueItem, 'id' | 'added_at'>): Promise<number | null> {
  try {
    const result = await query<any>(`
      INSERT INTO print_queue (
        job_id, customer_id, status, priority, operator_notes
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      item.job_id,
      item.customer_id,
      item.status || 'queued',
      item.priority || 1,
      item.operator_notes || null
    ]);
    
    return result.insertId;
  } catch (error) {
    console.error('Error adding item to print queue:', error);
    return null;
  }
}

export async function updateQueueItemStatus(
  id: number, 
  status: PrintQueueItem['status'], 
  notes?: string
): Promise<boolean> {
  try {
    let updateFields = 'status = ?';
    const values = [status];
    
    // Set timestamps based on status
    if (status === 'printing') {
      updateFields += ', started_at = NOW()';
    } else if (status === 'completed' || status === 'failed') {
      updateFields += ', completed_at = NOW()';
    }
    
    // Add notes if provided
    if (notes) {
      updateFields += ', operator_notes = ?';
      values.push(notes);
    }
    
    values.push(id);
    
    const result = await query<any>(`
      UPDATE print_queue
      SET ${updateFields}
      WHERE id = ?
    `, values);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating status for print queue item ID ${id}:`, error);
    return false;
  }
}

export async function updateQueueItemPriority(id: number, priority: number): Promise<boolean> {
  try {
    const result = await query<any>(`
      UPDATE print_queue
      SET priority = ?
      WHERE id = ?
    `, [priority, id]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating priority for print queue item ID ${id}:`, error);
    return false;
  }
}

export async function removeFromQueue(id: number): Promise<boolean> {
  try {
    const result = await query<any>(`
      DELETE FROM print_queue
      WHERE id = ?
    `, [id]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error removing item from print queue with ID ${id}:`, error);
    return false;
  }
} 