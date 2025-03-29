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
// Removing date-fns dependency
// import { format } from "date-fns";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";

// Simple date formatter function to replace date-fns
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Short date format (only date without time)
const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

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
    comments: [
      {
        id: 1,
        user: "Emily Wilson",
        date: new Date(2023, 4, 12),
        text: "Will need to order special materials for this job"
      }
    ],
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

export default function JobDetailsPage() {
  const { formatCurrency } = useCurrency();
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Simulating API call to fetch job details
    const foundJob = mockJobs.find(j => j.id === jobId);
    
    // Delay to simulate network request
    const timer = setTimeout(() => {
      if (foundJob) {
        setJob(foundJob);
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [jobId]);

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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // In a real app, this would be an API call
    const updatedJob = {
      ...job,
      comments: [
        ...job.comments,
        {
          id: job.comments.length + 1,
          user: "Current User", // In a real app, this would be the logged-in user
          date: new Date(),
          text: newComment
        }
      ]
    };
    
    setJob(updatedJob);
    setNewComment("");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/jobs">
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{job.id}</h1>
            <Badge className={getStatusColor(job.status)}>
              {job.status}
            </Badge>
            <Badge className={getPriorityColor(job.priority)}>
              {job.priority}
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">{job.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print
          </Button>
          <Link href={`/dashboard/jobs/${job.id}/edit`}>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </Button>
          </Link>
          <Button>Update Status</Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Job Type</p>
                    <p>{job.jobType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Quantity</p>
                    <p>{job.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Size</p>
                    <p>{job.size}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Paper Type</p>
                    <p>{job.paperType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Print Sides</p>
                    <p>{job.printSides}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                    <p>{formatShortDate(job.dueDate)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Finishing Options</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {job.finishing.map((option: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned To</p>
                  <p>{job.assignedTo}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Name</p>
                  <p>{job.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{job.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{job.customerPhone}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/customers/${job.customerName.replace(/\s+/g, '-').toLowerCase()}`}>
                  <Button variant="outline">View Customer Details</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Job Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-gray-200 ml-4 pl-8 pb-2 space-y-8">
                {job.timeline.map((event: any) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[41px] mt-1.5 h-4 w-4 rounded-full bg-blue-600"></div>
                    <div className="mb-1 flex items-baseline">
                      <p className="font-medium text-gray-900">{event.status}</p>
                      <p className="ml-auto text-sm text-gray-500">
                        {formatDate(event.date)}
                      </p>
                    </div>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Communication history for this job</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {job.comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4 pb-4 border-b border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {comment.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-medium">{comment.user}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(comment.date)}
                        </p>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    U
                  </div>
                  <div className="flex-1">
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a comment..."
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <Button onClick={handleAddComment}>Add Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Job Files</CardTitle>
              <CardDescription>Uploaded files for this print job</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-md mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">job-file.pdf</p>
                    <p className="text-sm text-gray-500">2.4 MB • Uploaded on {formatShortDate(job.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Preview
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload New File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2 border p-4 rounded-md bg-gray-50">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Amount:</span>
                    <span className="font-medium">{formatCurrency(job.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paid Amount:</span>
                    <span className="text-green-600">{formatCurrency(job.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-500">Balance Due:</span>
                    <span className="text-red-600">{formatCurrency(job.totalAmount - job.paidAmount)}</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">Process Payment</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 