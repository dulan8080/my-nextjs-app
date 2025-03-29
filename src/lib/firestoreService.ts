// Import only the mock db from our firebase mock
import { db } from './firebase';

// Generic type for data
export interface FirestoreData {
  id?: string;
  [key: string]: any;
}

// Customer type
export interface Customer extends FirestoreData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

// Job type
export interface Job extends FirestoreData {
  id: string;
  title: string;
  customerId: string;
  status: string;
  quantity: number;
  jobType: string;
  paperType: string;
  dimensions: string;
  doubleSided: boolean;
  color: boolean;
  finishingOptions: string[];
  dueDate: Date;
  completedDate?: Date;
  totalPrice: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  progress: number;
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 'customer1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '555-123-4567',
    address: '123 Business Lane, Corporate Park',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-20')
  },
  {
    id: 'customer2',
    name: 'TechSolutions Inc',
    email: 'info@techsolutions.com',
    phone: '555-987-6543',
    address: '456 Innovation Drive, Tech District',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-05-22')
  },
  {
    id: 'customer3',
    name: 'Global Enterprises',
    email: 'support@globalent.com',
    phone: '555-456-7890',
    address: '789 World Avenue, International Plaza',
    createdAt: new Date('2023-02-05'),
    updatedAt: new Date('2023-07-18')
  }
];

const mockJobs: Job[] = [
  {
    id: 'job1',
    title: 'Corporate Brochures Printing',
    customerId: 'customer1',
    status: 'Completed',
    quantity: 500,
    jobType: 'Brochure',
    paperType: 'Glossy',
    dimensions: '8.5x11',
    doubleSided: true,
    color: true,
    finishingOptions: ['Tri-fold', 'Laminated'],
    dueDate: new Date('2023-07-15'),
    completedDate: new Date('2023-07-12'),
    totalPrice: 1250.00,
    notes: 'Rush order completed ahead of schedule',
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2023-07-12'),
    progress: 100
  },
  {
    id: 'job2',
    title: 'Tech Conference Posters',
    customerId: 'customer2',
    status: 'In Progress',
    quantity: 50,
    jobType: 'Poster',
    paperType: 'Matte',
    dimensions: '24x36',
    doubleSided: false,
    color: true,
    finishingOptions: ['Mounted'],
    dueDate: new Date('2023-08-20'),
    totalPrice: 750.00,
    notes: 'Conference starts August 22nd',
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2023-08-10'),
    progress: 65
  },
  {
    id: 'job3',
    title: 'Global Marketing Flyers',
    customerId: 'customer3',
    status: 'Pending Approval',
    quantity: 1000,
    jobType: 'Flyer',
    paperType: 'Recycled',
    dimensions: '5x7',
    doubleSided: true,
    color: true,
    finishingOptions: [],
    dueDate: new Date('2023-09-05'),
    totalPrice: 650.00,
    notes: 'Waiting for customer approval on final design',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2023-08-18'),
    progress: 30
  }
];

const mockSettings = {
  pricing: {
    id: 'pricing',
    baseRates: {
      brochure: 2.50,
      flyer: 0.65,
      poster: 15.00,
      businessCard: 0.25,
      envelope: 0.45,
      letterhead: 0.75
    },
    paperTypeMultipliers: {
      standard: 1.0,
      recycled: 1.1,
      premium: 1.5,
      glossy: 1.3,
      matte: 1.2,
      cardstock: 1.6
    },
    colorMultipliers: {
      blackAndWhite: 1.0,
      color: 1.75
    },
    finishingOptionPrices: {
      folding: 0.15,
      trimming: 0.10,
      binding: 1.50,
      laminating: 2.00,
      mounting: 5.00
    },
    rushFeePercentage: 25,
    bulkDiscountThresholds: [
      { quantity: 100, discount: 5 },
      { quantity: 500, discount: 10 },
      { quantity: 1000, discount: 15 },
      { quantity: 5000, discount: 20 }
    ],
    updatedAt: new Date('2023-06-01')
  },
  currency: {
    id: 'currency',
    code: 'USD',
    symbol: '$',
    position: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalPlaces: 2,
    updatedAt: new Date('2023-05-15')
  }
};

// Helper function to generate unique IDs
const generateId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Helper function to find item by ID in a collection
const findById = (collection: FirestoreData[], id: string): FirestoreData | undefined => {
  return collection.find(item => item.id === id);
};

// =========================================
// Customer related operations
// =========================================

// Get all customers
export const getCustomers = async (): Promise<FirestoreData[]> => {
  try {
    return [...mockCustomers]; // Return a copy to prevent unintended modifications
  } catch (error) {
    console.error('Error getting customers:', error);
    throw error;
  }
};

// Get a customer by ID
export const getCustomerById = async (id: string): Promise<FirestoreData | null> => {
  try {
    const customer = findById(mockCustomers, id);
    return customer ? { ...customer } : null;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
};

// Add a new customer
export const addCustomer = async (customerData: FirestoreData): Promise<string> => {
  try {
    const newId = customerData.id || generateId();
    const newCustomer: Customer = {
      id: newId,
      name: customerData.name || '',
      email: customerData.email || '',
      phone: customerData.phone || '',
      address: customerData.address || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...customerData,
    };
    mockCustomers.push(newCustomer);
    return newId;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

// Update a customer
export const updateCustomer = async (id: string, data: FirestoreData): Promise<void> => {
  try {
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCustomers[index] = {
        ...mockCustomers[index],
        ...data,
        updatedAt: new Date()
      };
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCustomers.splice(index, 1);
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// =========================================
// Job related operations
// =========================================

// Get all jobs
export const getJobs = async (): Promise<FirestoreData[]> => {
  try {
    return [...mockJobs]; // Return a copy to prevent unintended modifications
  } catch (error) {
    console.error('Error getting jobs:', error);
    throw error;
  }
};

// Get jobs filtered by status
export const getJobsByStatus = async (status: string): Promise<FirestoreData[]> => {
  try {
    return mockJobs.filter(job => job.status === status).map(job => ({ ...job }));
  } catch (error) {
    console.error('Error getting jobs by status:', error);
    throw error;
  }
};

// Get jobs for a specific customer
export const getJobsByCustomer = async (customerId: string): Promise<FirestoreData[]> => {
  try {
    return mockJobs.filter(job => job.customerId === customerId).map(job => ({ ...job }));
  } catch (error) {
    console.error('Error getting jobs by customer:', error);
    throw error;
  }
};

// Get a job by ID
export const getJobById = async (id: string): Promise<FirestoreData | null> => {
  try {
    const job = findById(mockJobs, id);
    return job ? { ...job } : null;
  } catch (error) {
    console.error('Error getting job:', error);
    throw error;
  }
};

// Add a new job
export const addJob = async (jobData: FirestoreData): Promise<string> => {
  try {
    const newId = jobData.id || generateId();
    const newJob: Job = {
      id: newId,
      title: jobData.title || '',
      customerId: jobData.customerId || '',
      status: jobData.status || 'Pending',
      quantity: jobData.quantity || 0,
      jobType: jobData.jobType || '',
      paperType: jobData.paperType || '',
      dimensions: jobData.dimensions || '',
      doubleSided: jobData.doubleSided || false,
      color: jobData.color || false,
      finishingOptions: jobData.finishingOptions || [],
      dueDate: jobData.dueDate || new Date(),
      totalPrice: jobData.totalPrice || 0,
      notes: jobData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: jobData.progress || 0,
      ...jobData
    };
    mockJobs.push(newJob);
    return newId;
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
};

// Update a job
export const updateJob = async (id: string, data: FirestoreData): Promise<void> => {
  try {
    const index = mockJobs.findIndex(j => j.id === id);
    if (index !== -1) {
      mockJobs[index] = {
        ...mockJobs[index],
        ...data,
        updatedAt: new Date()
      };
    }
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (id: string): Promise<void> => {
  try {
    const index = mockJobs.findIndex(j => j.id === id);
    if (index !== -1) {
      mockJobs.splice(index, 1);
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// =========================================
// Pricing Configuration
// =========================================

// Get pricing configuration
export const getPricingConfig = async (): Promise<FirestoreData | null> => {
  try {
    return { ...mockSettings.pricing };
  } catch (error) {
    console.error('Error getting pricing config:', error);
    throw error;
  }
};

// Update pricing configuration
export const updatePricingConfig = async (data: FirestoreData): Promise<void> => {
  try {
    mockSettings.pricing = {
      ...mockSettings.pricing,
      ...data,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error updating pricing config:', error);
    throw error;
  }
};

// =========================================
// Currency Settings
// =========================================

// Get currency settings
export const getCurrencySettings = async (): Promise<FirestoreData | null> => {
  try {
    return { ...mockSettings.currency };
  } catch (error) {
    console.error('Error getting currency settings:', error);
    throw error;
  }
};

// Update currency settings
export const updateCurrencySettings = async (data: FirestoreData): Promise<void> => {
  try {
    mockSettings.currency = {
      ...mockSettings.currency,
      ...data,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error updating currency settings:', error);
    throw error;
  }
}; 