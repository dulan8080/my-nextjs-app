"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";

// Define a type for the job object
type ApprovalJob = {
  id: string;
  customerName: string;
  jobType: string;
  submittedOn: Date;
  requiredBy: Date;
  description: string;
  status: string;
  estimatedCost: number;
  assignedTo: string | null;
  priority: string;
  notes: string;
  files: string[];
  submittedBy: string;
};

// Mock data for jobs awaiting approval
const mockApprovalJobs: ApprovalJob[] = [
  {
    id: "JC-2023-006",
    customerName: "Metro Communications",
    jobType: "Digital Print",
    submittedOn: new Date(2023, 4, 15, 9, 30),
    requiredBy: new Date(2023, 4, 20, 17, 0),
    description: "Conference banners and signage",
    status: "Awaiting Approval",
    estimatedCost: 450.75,
    assignedTo: null,
    priority: "Medium",
    notes: "Customer has requested rush processing if possible",
    files: ["banner-design.pdf", "logo-assets.zip"],
    submittedBy: "Sarah Johnson",
  },
  {
    id: "JC-2023-007",
    customerName: "Greenfield School",
    jobType: "Offset Print",
    submittedOn: new Date(2023, 4, 16, 13, 15),
    requiredBy: new Date(2023, 4, 25, 12, 0),
    description: "School yearbooks - 200 copies",
    status: "Awaiting Approval",
    estimatedCost: 2150.00,
    assignedTo: null,
    priority: "Low",
    notes: "Special binding requirements detailed in attached specs",
    files: ["yearbook-final.pdf", "printing-specs.docx"],
    submittedBy: "Thomas Anderson",
  },
  {
    id: "JC-2023-008",
    customerName: "Fresh Organic",
    jobType: "Large Format",
    submittedOn: new Date(2023, 4, 16, 15, 45),
    requiredBy: new Date(2023, 4, 19, 9, 0),
    description: "Promotional banners for farmers market",
    status: "Awaiting Approval",
    estimatedCost: 375.25,
    assignedTo: null,
    priority: "High",
    notes: "Customer will provide their own mounting hardware",
    files: ["banner-designs.ai", "logo-vector.eps"],
    submittedBy: "Emily Wilson",
  },
  {
    id: "JC-2023-009",
    customerName: "City Hospital",
    jobType: "Digital Print",
    submittedOn: new Date(2023, 4, 17, 8, 0),
    requiredBy: new Date(2023, 4, 21, 12, 0),
    description: "COVID safety posters - 50 copies, 3 designs",
    status: "Awaiting Approval",
    estimatedCost: 187.50,
    assignedTo: null,
    priority: "Medium",
    notes: "Lamination required for all posters",
    files: ["poster-design-1.pdf", "poster-design-2.pdf", "poster-design-3.pdf"],
    submittedBy: "Sarah Johnson",
  },
  {
    id: "JC-2023-010",
    customerName: "Local Theater",
    jobType: "Digital Print",
    submittedOn: new Date(2023, 4, 17, 10, 30),
    requiredBy: new Date(2023, 4, 24, 17, 0),
    description: "Event programs - 500 copies",
    status: "Awaiting Approval",
    estimatedCost: 625.00,
    assignedTo: null,
    priority: "Low",
    notes: "Folded, saddle-stitched programs",
    files: ["program-final.pdf"],
    submittedBy: "Thomas Anderson",
  }
];

// Format date for display
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

// Priority badge colors
const getPriorityColor = (priority: string) => {
  switch(priority) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function ApprovalQueueClient() {
  const { formatCurrency } = useCurrency();
  const [jobs, setJobs] = useState<ApprovalJob[]>(mockApprovalJobs);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Stats calculation
  const stats = {
    totalJobs: jobs.length,
    highPriority: jobs.filter(job => job.priority === "High").length,
    mediumPriority: jobs.filter(job => job.priority === "Medium").length,
    lowPriority: jobs.filter(job => job.priority === "Low").length,
    totalValue: jobs.reduce((sum, job) => sum + job.estimatedCost, 0)
  };

  const selectedJob = selectedJobId 
    ? jobs.find(job => job.id === selectedJobId) 
    : null;

  const handleApprove = (jobId: string, assignTo: string) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: "Approved",
          assignedTo: assignTo
        };
      }
      return job;
    }));
    setSelectedJobId(null);
  };

  const handleReject = (jobId: string, reason: string) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: "Rejected",
          notes: job.notes + "\n\nRejection reason: " + reason
        };
      }
      return job;
    }));
    setSelectedJobId(null);
  };

  const handleRequestChanges = (jobId: string, changes: string) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: "Changes Requested",
          notes: job.notes + "\n\nRequested changes: " + changes
        };
      }
      return job;
    }));
    setSelectedJobId(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Admin Approval Queue</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print List
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600">Pending Approval</p>
              <p className="text-3xl font-bold mt-1">{stats.totalJobs}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600">High Priority</p>
              <p className="text-3xl font-bold mt-1">{stats.highPriority}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-yellow-600">Medium Priority</p>
              <p className="text-3xl font-bold mt-1">{stats.mediumPriority}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-green-600">Low Priority</p>
              <p className="text-3xl font-bold mt-1">{stats.lowPriority}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-purple-600">Total Value</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md border overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h2 className="font-semibold">Jobs Awaiting Approval</h2>
            </div>
            <div className="divide-y">
              {jobs.filter(job => job.status === "Awaiting Approval").length > 0 ? (
                jobs
                  .filter(job => job.status === "Awaiting Approval")
                  .sort((a, b) => {
                    // Sort by priority (High > Medium > Low) and then by submission date
                    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
                    const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder];
                    const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder];
                    
                    if (priorityA !== priorityB) {
                      return priorityA - priorityB;
                    }
                    return a.submittedOn.getTime() - b.submittedOn.getTime();
                  })
                  .map(job => (
                    <div 
                      key={job.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedJobId === job.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedJobId(job.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{job.id}: {job.description}</h3>
                          <p className="text-sm text-gray-500">{job.customerName}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:justify-between">
                        <div className="text-sm text-gray-500">
                          <span>Submitted: {formatDate(job.submittedOn)}</span>
                          <span className="mx-2">•</span>
                          <span>Type: {job.jobType}</span>
                        </div>
                        <div className="text-sm font-medium text-indigo-600 mt-1 sm:mt-0">
                          {formatCurrency(job.estimatedCost)}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>Required by: {formatDate(job.requiredBy)}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No jobs are currently awaiting approval.
                </div>
              )}
            </div>
          </div>

          {/* Recently Processed Jobs */}
          <div className="bg-white rounded-md border overflow-hidden mt-6">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h2 className="font-semibold">Recently Processed</h2>
            </div>
            <div className="divide-y">
              {jobs.filter(job => job.status !== "Awaiting Approval").length > 0 ? (
                jobs
                  .filter(job => job.status !== "Awaiting Approval")
                  .sort((a, b) => b.submittedOn.getTime() - a.submittedOn.getTime())
                  .map(job => (
                    <div key={job.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{job.id}: {job.description}</h3>
                          <p className="text-sm text-gray-500">{job.customerName}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === "Approved" 
                            ? "bg-green-100 text-green-800" 
                            : job.status === "Rejected" 
                              ? "bg-red-100 text-red-800" 
                              : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>Processed on: {formatDate(new Date())}</span>
                        <span className="mx-2">•</span>
                        <span>Value: {formatCurrency(job.estimatedCost)}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No jobs have been processed recently.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Details and Actions */}
        <div className="lg:col-span-1">
          {selectedJob ? (
            <div className="bg-white rounded-md border overflow-hidden sticky top-6">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h2 className="font-semibold">Job Details</h2>
                <button 
                  onClick={() => setSelectedJobId(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedJob.id}</h3>
                    <p className="text-sm text-gray-500">{selectedJob.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="text-sm font-medium">{selectedJob.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Job Type</p>
                      <p className="text-sm font-medium">{selectedJob.jobType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Submitted On</p>
                      <p className="text-sm font-medium">{formatDate(selectedJob.submittedOn)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Required By</p>
                      <p className="text-sm font-medium">{formatDate(selectedJob.requiredBy)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Priority</p>
                      <p className={`text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${getPriorityColor(selectedJob.priority)}`}>
                        {selectedJob.priority}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estimated Cost</p>
                      <p className="text-sm font-medium">{formatCurrency(selectedJob.estimatedCost)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Notes</p>
                    <p className="text-sm mt-1 whitespace-pre-line">{selectedJob.notes}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Uploaded Files</p>
                    <ul className="text-sm mt-1 space-y-1">
                      {selectedJob.files.map((file, index) => (
                        <li key={index} className="flex items-center text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <span>{file}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Submitted By</p>
                    <p className="text-sm font-medium">{selectedJob.submittedBy}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleApprove(selectedJob.id, "Thomas Anderson")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRequestChanges(selectedJob.id, "Please clarify specifications")}
                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                      >
                        Request Changes
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedJob.id, "Cost exceeds authorized amount")}
                      className="border-red-500 text-red-600 hover:bg-red-50 w-full"
                    >
                      Reject Job
                    </Button>
                    <Link href={`/dashboard/jobs/${selectedJob.id}`} className="block mt-2">
                      <Button variant="outline" className="w-full">
                        View Full Job Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-md border overflow-hidden h-96 flex items-center justify-center">
              <div className="text-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No job selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a job from the list to view details and take action.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 