import { NextRequest, NextResponse } from 'next/server';
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from '@/lib/models/mysql-customer';

// GET /api/customers - Get all customers
export async function GET(request: NextRequest) {
  console.log('API - GET /api/customers - Request received');
  try {
    // Check if there's a query parameter for a specific customer
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (id) {
      console.log(`API - GET /api/customers - Fetching customer with ID: ${id}`);
      const customer = await getCustomerById(parseInt(id, 10));
      if (!customer) {
        console.log(`API - GET /api/customers - Customer with ID ${id} not found`);
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
      console.log(`API - GET /api/customers - Customer found:`, customer);
      return NextResponse.json(customer);
    }
    
    // Otherwise return all customers
    console.log('API - GET /api/customers - Fetching all customers');
    const customers = await getCustomers();
    console.log(`API - GET /api/customers - Found ${customers.length} customers`);
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error in customers GET API:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  console.log('API - POST /api/customers - Request received');
  try {
    const body = await request.json();
    console.log('API - POST /api/customers - Request body:', body);
    
    // Validate required fields
    if (!body.name || !body.email) {
      console.log('API - POST /api/customers - Missing required fields');
      return NextResponse.json(
        { error: 'Name and email are required fields' }, 
        { status: 400 }
      );
    }
    
    console.log('API - POST /api/customers - Creating customer with data:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address
    });
    
    const customerId = await createCustomer({
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address
    });
    
    if (!customerId) {
      console.log('API - POST /api/customers - Failed to create customer (null ID returned)');
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
    
    console.log(`API - POST /api/customers - Customer created with ID: ${customerId}`);
    
    // Fetch the newly created customer
    const newCustomer = await getCustomerById(customerId);
    console.log('API - POST /api/customers - New customer details:', newCustomer);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Error in customers POST API:', error);
    
    // Check for duplicate email error from MySQL (error code 1062)
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (
        errorMessage.includes('duplicate') || 
        errorMessage.includes('already exists') || 
        errorMessage.includes('unique constraint') ||
        errorMessage.includes('error: 1062')
      ) {
        console.log('API - POST /api/customers - Duplicate email error identified');
        return NextResponse.json(
          { error: 'A customer with this email already exists in the system' }, 
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to create customer', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/customers/:id - Update a customer
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' }, 
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const success = await updateCustomer(parseInt(id, 10), body);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update customer or customer not found' }, 
        { status: 404 }
      );
    }
    
    // Fetch the updated customer
    const updatedCustomer = await getCustomerById(parseInt(id, 10));
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error in customers PUT API:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

// DELETE /api/customers/:id - Delete a customer
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' }, 
        { status: 400 }
      );
    }
    
    const success = await deleteCustomer(parseInt(id, 10));
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete customer or customer not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in customers DELETE API:', error);
    
    // Check for customer with active jobs error
    if (error instanceof Error && error.message.includes('active jobs')) {
      return NextResponse.json(
        { error: 'Cannot delete customer with active jobs' }, 
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
} 