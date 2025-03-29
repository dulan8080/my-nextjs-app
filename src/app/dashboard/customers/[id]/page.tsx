"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";

// Simple date formatter function
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

// Mock customer data - in a real app, this would come from an API
const mockCustomers = [
  {
    id: "CUST-001",
    name: "Acme Corporation",
    contactPerson: "John Smith",
    email: "john.smith@acme.com",
    phone: "555-123-4567",
    address: "123 Business Ave, Suite 100, New York, NY 10001",
    type: "Corporate",
    status: "Active",
    notes: "Long-standing client since 2015. Prefers email communication.",
    createdAt: new Date(2015, 3, 15),
    jobCount: 12,
    totalSpent: 15750.80,
    recentJobs: [
      {
        id: "JC-2023-001",
        description: "Full color brochures for trade show",
        status: "In Progress",
        dueDate: new Date(2023, 4, 15),
        amount: 1250.50
      },
      {
        id: "JC-2022-045",
        description: "Annual report printing",
        status: "Completed",
        dueDate: new Date(2022, 11, 10),
        amount: 3200.75
      },
      {
        id: "JC-2022-032",
        description: "Marketing materials",
        status: "Completed",
        dueDate: new Date(2022, 8, 20),
        amount: 950.25
      }
    ],
    paymentHistory: [
      {
        id: "PAY-2023-012",
        date: new Date(2023, 3, 5),
        amount: 1250.50,
        method: "Credit Card",
        reference: "INV-2023-001"
      },
      {
        id: "PAY-2022-098",
        date: new Date(2022, 11, 15),
        amount: 3200.75,
        method: "Bank Transfer",
        reference: "INV-2022-045"
      },
      {
        id: "PAY-2022-087",
        date: new Date(2022, 8, 25),
        amount: 950.25,
        method: "Credit Card",
        reference: "INV-2022-032"
      }
    ]
  },
  {
    id: "CUST-002",
    name: "TechStart Ltd",
    contactPerson: "Sarah Johnson",
    email: "sarah@techstart.io",
    phone: "555-987-6543",
    address: "456 Innovation Dr, San Francisco, CA 94107",
    type: "Corporate",
    status: "Active",
    notes: "Tech startup with frequent orders for marketing materials.",
    createdAt: new Date(2019, 6, 22),
    jobCount: 8,
    totalSpent: 9240.50,
    recentJobs: [
      {
        id: "JC-2023-002",
        description: "Banner for conference booth",
        status: "Pending",
        dueDate: new Date(2023, 4, 20),
        amount: 780.00
      },
      {
        id: "JC-2022-050",
        description: "Product brochures",
        status: "Completed",
        dueDate: new Date(2022, 11, 28),
        amount: 1220.75
      }
    ],
    paymentHistory: [
      {
        id: "PAY-2022-099",
        date: new Date(2022, 11, 30),
        amount: 1220.75,
        method: "Credit Card",
        reference: "INV-2022-050"
      },
      {
        id: "PAY-2022-080",
        date: new Date(2022, 7, 15),
        amount: 2450.50,
        method: "PayPal",
        reference: "INV-2022-028"
      }
    ]
  }
];

// Get status color
const getStatusColor = (status: string) => {
  switch(status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Inactive": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Get job status color
const getJobStatusColor = (status: string) => {
  switch(status) {
    case "Completed": return "bg-green-500";
    case "In Progress": return "bg-blue-500";
    case "Pending": return "bg-yellow-500";
    case "Cancelled": return "bg-red-500";
    case "Ready for Pickup": return "bg-purple-500";
    default: return "bg-gray-500";
  }
};

export default function CustomerDetailsPage() {
  const { formatCurrency } = useCurrency();
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Simulating API call to fetch customer details
    const foundCustomer = mockCustomers.find(c => c.id === customerId);
    
    // Delay to simulate network request
    const timer = setTimeout(() => {
      if (foundCustomer) {
        setCustomer(foundCustomer);
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Customer Not Found</h2>
        <p className="mb-6">The customer you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/customers">
          <Button>Back to Customers</Button>
        </Link>
      </div>
    );
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // In a real app, this would be an API call
    const updatedCustomer = {
      ...customer,
      notes: customer.notes + "\n\n" + newNote
    };
    
    setCustomer(updatedCustomer);
    setNewNote("");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/customers">
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <Badge className={getStatusColor(customer.status)}>
              {customer.status}
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">{customer.id} • Customer since {formatDate(customer.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/jobs/new?customer=${customer.id}`}>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Job
            </Button>
          </Link>
          <Link href={`/dashboard/customers/${customer.id}/edit`}>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </Button>
          </Link>
          <Button>Contact Customer</Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="jobs">Job History</TabsTrigger>
          <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer Type</p>
                    <p>{customer.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p>{customer.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Person</p>
                    <p>{customer.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                    <p>{customer.jobCount}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p>{customer.address}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between pb-4 border-b">
                  <span className="font-medium">Customer Since</span>
                  <span>{formatDate(customer.createdAt)}</span>
                </div>
                <div className="flex justify-between pb-4 border-b">
                  <span className="font-medium">Total Jobs</span>
                  <span>{customer.jobCount}</span>
                </div>
                <div className="flex justify-between pb-4 border-b">
                  <span className="font-medium">Total Spent</span>
                  <span className="font-medium text-blue-600">{formatCurrency(customer.totalSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Active Jobs</span>
                  <span>{customer.recentJobs.filter((job: any) => job.status !== "Completed" && job.status !== "Cancelled").length}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/jobs?customer=${customer.id}`}>
                  <Button variant="outline">View All Jobs</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Jobs ordered by this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Job ID</th>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Due Date</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.recentJobs.map((job: any) => (
                      <tr key={job.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{job.id}</td>
                        <td className="py-3 px-4">{job.description}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getJobStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{formatDate(job.dueDate)}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(job.amount)}</td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/dashboard/jobs/${job.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Link href={`/dashboard/jobs/new?customer=${customer.id}`}>
                  <Button className="w-full">Create New Job</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent payments made by this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Transaction ID</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Method</th>
                      <th className="py-3 px-4 text-left">Reference</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.paymentHistory.map((payment: any) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{payment.id}</td>
                        <td className="py-3 px-4">{formatDate(payment.date)}</td>
                        <td className="py-3 px-4">{payment.method}</td>
                        <td className="py-3 px-4">{payment.reference}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(payment.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Spent</span>
                  <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Last payment</span>
                  <span>{customer.paymentHistory.length > 0 ? formatDate(customer.paymentHistory[0].date) : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Customer Notes</CardTitle>
              <CardDescription>Important information about this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md mb-6 whitespace-pre-line">
                {customer.notes || 'No notes available for this customer.'}
              </div>
              
              <div className="mt-6">
                <div>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a note about this customer..."
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <Button onClick={handleAddNote}>Add Note</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 