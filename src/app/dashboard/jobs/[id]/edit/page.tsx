"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock job data - in a real app, this would come from an API
const mockJobs = [
  {
    id: "JC-2023-001",
    customerName: "Acme Corp",
    customerEmail: "john.smith@acme.com",
    customerPhone: "555-123-4567",
    jobType: "Digital Print",
    description: "Full color brochures for upcoming trade show",
    status: "In Progress",
    priority: "High",
    quantity: 500,
    size: "A4",
    paperType: "Glossy, 170gsm",
    printSides: "Double-sided",
    finishing: ["Stapling", "Folding"],
    dueDate: new Date(2023, 4, 15),
    createdAt: new Date(2023, 4, 10),
    assignedTo: "Thomas Anderson",
    comments: [
      {
        id: 1,
        user: "Sarah Johnson",
        date: new Date(2023, 4, 10),
        text: "Customer has requested rush processing for this order"
      },
      {
        id: 2,
        user: "Thomas Anderson",
        date: new Date(2023, 4, 11),
        text: "Started printing process. Will complete by tomorrow"
      }
    ],
    timeline: [
      {
        id: 1,
        date: new Date(2023, 4, 10),
        status: "Created",
        description: "Job created and pending approval"
      },
      {
        id: 2,
        date: new Date(2023, 4, 10),
        status: "Approved",
        description: "Job approved and ready for processing"
      },
      {
        id: 3,
        date: new Date(2023, 4, 11),
        status: "In Progress",
        description: "Printing started"
      }
    ],
    totalAmount: 1250.50,
    paidAmount: 625.25,
    fileUrl: "https://example.com/files/brochure-design.pdf"
  },
  {
    id: "JC-2023-002",
    customerName: "TechStart Ltd",
    customerEmail: "sarah@techstart.io",
    customerPhone: "555-987-6543",
    jobType: "Large Format",
    description: "Banner for conference booth",
    status: "Pending",
    priority: "Medium",
    quantity: 2,
    size: "2m x 1m",
    paperType: "Vinyl",
    printSides: "Single-sided",
    finishing: ["Grommets"],
    dueDate: new Date(2023, 4, 20),
    createdAt: new Date(2023, 4, 12),
    assignedTo: "Emily Wilson",
    comments: [],
    timeline: [
      {
        id: 1,
        date: new Date(2023, 4, 12),
        status: "Created",
        description: "Job created and pending approval"
      },
      {
        id: 2,
        date: new Date(2023, 4, 12),
        status: "Pending",
        description: "Waiting for materials"
      }
    ],
    totalAmount: 780.00,
    paidAmount: 780.00,
    fileUrl: "https://example.com/files/banner-design.pdf"
  },
];

// Status badge colors
const getStatusColor = (status: string) => {
  switch(status) {
    case "Completed": return "bg-green-500";
    case "In Progress": return "bg-blue-500";
    case "Pending": return "bg-yellow-500";
    case "Cancelled": return "bg-red-500";
    case "Ready for Pickup": return "bg-purple-500";
    default: return "bg-gray-500";
  }
};

// Priority badge colors
const getPriorityColor = (priority: string) => {
  switch(priority) {
    case "High": return "bg-red-500";
    case "Medium": return "bg-yellow-500";
    case "Low": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

// Simple date formatter function
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    description: "",
    status: "",
    priority: "",
    quantity: "",
    size: "",
    paperType: "",
    printSides: "",
    assignedTo: "",
    dueDate: "",
    totalAmount: ""
  });

  useEffect(() => {
    // Simulating API call to fetch job details
    const foundJob = mockJobs.find(j => j.id === jobId);
    
    // Delay to simulate network request
    const timer = setTimeout(() => {
      if (foundJob) {
        setJob(foundJob);
        setFormData({
          customerName: foundJob.customerName,
          customerEmail: foundJob.customerEmail,
          customerPhone: foundJob.customerPhone,
          description: foundJob.description,
          status: foundJob.status,
          priority: foundJob.priority,
          quantity: String(foundJob.quantity),
          size: foundJob.size,
          paperType: foundJob.paperType,
          printSides: foundJob.printSides,
          assignedTo: foundJob.assignedTo,
          dueDate: foundJob.dueDate.toISOString().split('T')[0],
          totalAmount: String(foundJob.totalAmount)
        });
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to update the job
    // Simulating API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate back to job details page after successful update
      router.push(`/dashboard/jobs/${jobId}`);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/jobs/${job.id}`}>
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Back to Details
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Edit Job {job.id}</h1>
            <Badge className={getStatusColor(job.status)}>
              {job.status}
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">Edit job details below and save changes when done</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="paperType" className="block text-sm font-medium text-gray-700 mb-1">
                    Paper Type
                  </label>
                  <input
                    type="text"
                    id="paperType"
                    name="paperType"
                    value={formData.paperType}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="printSides" className="block text-sm font-medium text-gray-700 mb-1">
                    Print Sides
                  </label>
                  <select
                    id="printSides"
                    name="printSides"
                    value={formData.printSides}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  >
                    <option value="Single-sided">Single-sided</option>
                    <option value="Double-sided">Double-sided</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Management Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="totalAmount"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Link href={`/dashboard/jobs/${job.id}`}>
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
} 