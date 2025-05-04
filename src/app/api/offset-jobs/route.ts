import { NextRequest, NextResponse } from 'next/server';
import { createOffsetPrintJob, getOffsetPrintJob, updateOffsetPrintJobStatus, listOffsetPrintJobs, deleteOffsetPrintJob, saveOffsetPrintJobFromForm } from '@/lib/models/mysql-offset-job';
import { getCustomerById } from '@/lib/models/mysql-customer';

// GET /api/offset-jobs - Get all offset jobs or a specific one
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    // If an ID is provided, return that specific job
    if (id) {
      const job = await getOffsetPrintJob(parseInt(id, 10));
      
      if (!job) {
        return NextResponse.json({ error: 'Offset print job not found' }, { status: 404 });
      }
      
      return NextResponse.json(job);
    }
    
    // Otherwise, return a paginated list
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const status = url.searchParams.get('status') as any;
    const customerId = url.searchParams.get('customerId') ? parseInt(url.searchParams.get('customerId')!, 10) : undefined;
    
    const result = await listOffsetPrintJobs({ limit, offset, status, customerId });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in offset-jobs GET API:', error);
    return NextResponse.json({ error: 'Failed to fetch offset print jobs' }, { status: 500 });
  }
}

// POST /api/offset-jobs - Create a new offset job
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Check if this is the from-form endpoint
    if (url.searchParams.get('from') === 'form') {
      const body = await request.json();
      
      console.log('Received form submission:', {
        hasFormData: !!body.formData,
        jobId: body.jobId,
        customerId: body.customerId,
        formDataKeys: body.formData ? Object.keys(body.formData) : null
      });
      
      // Validate required fields
      if (!body.formData || !body.jobId || !body.customerId) {
        console.error('Missing required fields:', { 
          hasFormData: !!body.formData, 
          jobId: body.jobId, 
          customerId: body.customerId 
        });
        
        return NextResponse.json(
          { error: 'Missing required fields: formData, jobId, customerId' }, 
          { status: 400 }
        );
      }
      
      // Check if customer exists
      const customer = await getCustomerById(body.customerId);
      if (!customer) {
        console.error('Customer not found:', body.customerId);
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
      
      try {
        // Create the offset print job from form data
        console.log('Calling saveOffsetPrintJobFromForm...');
        const offsetJobId = await saveOffsetPrintJobFromForm(body.formData, body.jobId, body.customerId);
        
        if (!offsetJobId) {
          console.error('Failed to create offset print job - null ID returned');
          return NextResponse.json({ 
            error: 'Failed to create offset print job from form data - null ID returned' 
          }, { status: 500 });
        }
        
        console.log('Successfully created offset job:', offsetJobId);
        
        // Fetch the newly created job
        const newJob = await getOffsetPrintJob(offsetJobId);
        
        return NextResponse.json(newJob, { status: 201 });
      } catch (error) {
        console.error('Error in saveOffsetPrintJobFromForm:', error);
        return NextResponse.json({ 
          error: `Failed to create offset print job from form data: ${error instanceof Error ? error.message : 'Unknown error'}`
        }, { status: 500 });
      }
    }
    
    // Regular POST handling for direct job creation
    const body = await request.json();
    
    // Validate required fields
    if (!body.job_id || !body.customer_id || !body.job_name || !body.quantity || !body.delivery_date) {
      return NextResponse.json(
        { error: 'Missing required fields: job_id, customer_id, job_name, quantity, delivery_date' }, 
        { status: 400 }
      );
    }
    
    // Check if customer exists
    const customer = await getCustomerById(body.customer_id);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    // Create the offset print job
    const jobId = await createOffsetPrintJob(body);
    
    if (!jobId) {
      return NextResponse.json({ error: 'Failed to create offset print job' }, { status: 500 });
    }
    
    // Fetch the newly created job
    const newJob = await getOffsetPrintJob(jobId);
    
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error in offset-jobs POST API:', error);
    return NextResponse.json({ error: 'Failed to create offset print job' }, { status: 500 });
  }
}

// PUT /api/offset-jobs/:id - Update an offset job status
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Offset print job ID is required' }, 
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate status
    if (!body.status || !['pending', 'in_progress', 'completed', 'cancelled'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, in_progress, completed, cancelled' }, 
        { status: 400 }
      );
    }
    
    const success = await updateOffsetPrintJobStatus(parseInt(id, 10), body.status);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update offset print job status or job not found' }, 
        { status: 404 }
      );
    }
    
    // Fetch the updated job
    const updatedJob = await getOffsetPrintJob(parseInt(id, 10));
    
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error in offset-jobs PUT API:', error);
    return NextResponse.json({ error: 'Failed to update offset print job' }, { status: 500 });
  }
}

// DELETE /api/offset-jobs/:id - Delete an offset job
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Offset print job ID is required' }, 
        { status: 400 }
      );
    }
    
    const success = await deleteOffsetPrintJob(parseInt(id, 10));
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete offset print job or job not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in offset-jobs DELETE API:', error);
    return NextResponse.json({ error: 'Failed to delete offset print job' }, { status: 500 });
  }
} 