"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock print queue data
const mockPrintJobs = [
  {
    id: "JC-2023-001",
    customerName: "Acme Corp",
    jobType: "Digital Print",
    status: "In Progress",
    priority: "High",
    startTime: new Date(2023, 4, 11, 9, 30),
    estimatedCompletionTime: new Date(2023, 4, 11, 14, 0),
    assignedTo: "Thomas Anderson",
    progress: 65,
    description: "Full color brochures for trade show",
    machineId: "PRINTER-001",
    timeline: [
      { time: new Date(2023, 4, 10, 14, 15), status: "Created", description: "Job created and submitted to queue" },
      { time: new Date(2023, 4, 10, 15, 30), status: "Approved", description: "Job approved for printing" },
      { time: new Date(2023, 4, 11, 9, 30), status: "In Progress", description: "Printing started" },
    ]
  },
  {
    id: "JC-2023-005",
    customerName: "Education Center",
    jobType: "Binding",
    status: "Pending",
    priority: "High",
    startTime: null,
    estimatedCompletionTime: new Date(2023, 4, 16, 12, 0),
    assignedTo: "Emily Wilson",
    progress: 0,
    description: "Academic journals binding, 20 copies",
    machineId: "BINDER-002",
    timeline: [
      { time: new Date(2023, 4, 9, 11, 0), status: "Created", description: "Job created and submitted to queue" },
      { time: new Date(2023, 4, 9, 13, 45), status: "Approved", description: "Job approved for binding" },
    ]
  },
  {
    id: "JC-2023-002",
    customerName: "TechStart Ltd",
    jobType: "Large Format",
    status: "Queued",
    priority: "Medium",
    startTime: null,
    estimatedCompletionTime: new Date(2023, 4, 12, 17, 0),
    assignedTo: "Emily Wilson",
    progress: 0,
    description: "Banner for conference booth",
    machineId: "PRINTER-003",
    timeline: [
      { time: new Date(2023, 4, 8, 10, 25), status: "Created", description: "Job created and submitted to queue" },
      { time: new Date(2023, 4, 8, 14, 15), status: "Approved", description: "Job approved for printing" },
      { time: new Date(2023, 4, 9, 9, 0), status: "Queued", description: "Job queued for production" },
    ]
  },
  {
    id: "JC-2023-003",
    customerName: "Global Industries",
    jobType: "Offset Print",
    status: "Completed",
    priority: "Low",
    startTime: new Date(2023, 4, 8, 8, 0),
    estimatedCompletionTime: new Date(2023, 4, 8, 16, 0),
    assignedTo: "Thomas Anderson",
    progress: 100,
    description: "Corporate letterheads and envelopes",
    machineId: "PRINTER-002",
    timeline: [
      { time: new Date(2023, 4, 6, 9, 10), status: "Created", description: "Job created and submitted to queue" },
      { time: new Date(2023, 4, 6, 11, 30), status: "Approved", description: "Job approved for printing" },
      { time: new Date(2023, 4, 7, 15, 45), status: "Queued", description: "Job queued for production" },
      { time: new Date(2023, 4, 8, 8, 0), status: "In Progress", description: "Printing started" },
      { time: new Date(2023, 4, 8, 15, 30), status: "Completed", description: "Printing completed and ready for pickup" },
    ]
  },
  {
    id: "JC-2023-004",
    customerName: "Local Business",
    jobType: "Digital Print",
    status: "On Hold",
    priority: "Medium",
    startTime: new Date(2023, 4, 9, 10, 0),
    estimatedCompletionTime: null,
    assignedTo: "Sarah Johnson",
    progress: 30,
    description: "Product catalogs with special finishing",
    machineId: "PRINTER-001",
    timeline: [
      { time: new Date(2023, 4, 7, 13, 20), status: "Created", description: "Job created and submitted to queue" },
      { time: new Date(2023, 4, 7, 16, 0), status: "Approved", description: "Job approved for printing" },
      { time: new Date(2023, 4, 8, 9, 30), status: "Queued", description: "Job queued for production" },
      { time: new Date(2023, 4, 9, 10, 0), status: "In Progress", description: "Printing started" },
      { time: new Date(2023, 4, 9, 11, 45), status: "On Hold", description: "Job put on hold - waiting for paper restock" },
    ]
  }
];

// Format time for display
const formatTime = (date: Date | null) => {
  if (!date) return "N/A";
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

// Format date for display
const formatDate = (date: Date | null) => {
  if (!date) return "N/A";
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

// Format datetime for display
const formatDateTime = (date: Date | null) => {
  if (!date) return "N/A";
  return `${formatDate(date)}, ${formatTime(date)}`;
};

// Status badge colors
const getStatusColor = (status: string) => {
  switch(status) {
    case "Completed": return "bg-green-500";
    case "In Progress": return "bg-blue-500";
    case "Queued": return "bg-purple-500";
    case "Pending": return "bg-yellow-500";
    case "On Hold": return "bg-red-500";
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

// Calculate queue statistics
const calculateStats = (jobs: typeof mockPrintJobs) => {
  return {
    totalJobs: jobs.length,
    inProgress: jobs.filter(job => job.status === "In Progress").length,
    pending: jobs.filter(job => job.status === "Pending" || job.status === "Queued").length,
    completed: jobs.filter(job => job.status === "Completed").length,
    onHold: jobs.filter(job => job.status === "On Hold").length,
    highPriority: jobs.filter(job => job.priority === "High").length,
  };
};

export default function PrintQueuePage() {
  const [printJobs, setPrintJobs] = useState(mockPrintJobs);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();
  const [selectedJob, setSelectedJob] = useState<typeof mockPrintJobs[0] | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Filter jobs based on filters
  const filteredJobs = printJobs.filter(job => {
    const matchesStatus = !statusFilter || job.status === statusFilter;
    const matchesPriority = !priorityFilter || job.priority === priorityFilter;
    
    return matchesStatus && matchesPriority;
  });

  // Stats based on filtered jobs
  const stats = calculateStats(filteredJobs);

  const handleClearFilters = () => {
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
  };

  const handleViewTimeline = (job: typeof mockPrintJobs[0]) => {
    setSelectedJob(job);
    setIsTimelineOpen(true);
  };

  const handleStatusChange = (jobId: string, newStatus: string) => {
    setPrintJobs(printJobs.map(job => {
      if (job.id === jobId) {
        const updatedJob = { ...job, status: newStatus };
        
        // Add new timeline entry for status change
        updatedJob.timeline = [
          ...job.timeline,
          {
            time: new Date(),
            status: newStatus,
            description: `Status changed to ${newStatus}`
          }
        ];
        
        // Update progress based on status
        if (newStatus === "In Progress") {
          updatedJob.progress = 10;
          updatedJob.startTime = new Date();
        } else if (newStatus === "Completed") {
          updatedJob.progress = 100;
        } else if (newStatus === "On Hold") {
          // Don't change progress
        } else {
          updatedJob.progress = 0;
          updatedJob.startTime = null;
        }
        
        return updatedJob;
      }
      return job;
    }));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Print Queue</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print Schedule
          </Button>
          <Link href="/dashboard/jobs/new">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600">Total Jobs</p>
              <p className="text-3xl font-bold mt-1">{stats.totalJobs}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-indigo-600">In Progress</p>
              <p className="text-3xl font-bold mt-1">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-purple-600">Pending/Queued</p>
              <p className="text-3xl font-bold mt-1">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-3xl font-bold mt-1">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600">On Hold</p>
              <p className="text-3xl font-bold mt-1">{stats.onHold}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-amber-600">High Priority</p>
              <p className="text-3xl font-bold mt-1">{stats.highPriority}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select 
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
          className="px-3 py-2 border border-gray-300 rounded-md w-[150px]"
        >
          <option value="">All Status</option>
          <option value="In Progress">In Progress</option>
          <option value="Queued">Queued</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>

        <select 
          value={priorityFilter || ""}
          onChange={(e) => setPriorityFilter(e.target.value || undefined)}
          className="px-3 py-2 border border-gray-300 rounded-md w-[150px]"
        >
          <option value="">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button 
          onClick={handleClearFilters}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Clear Filters
        </button>
      </div>

      {/* Print Queue Table */}
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Completion</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium">{job.id}</span>
                      <span className="text-sm text-gray-500">{job.customerName}</span>
                      <span className="text-xs text-gray-400">{job.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getPriorityColor(job.priority)}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className={`h-2.5 rounded-full ${
                          job.status === "On Hold" ? "bg-yellow-500" : "bg-blue-600"
                        }`} 
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{job.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.machineId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.estimatedCompletionTime ? (
                      <div className="flex flex-col">
                        <span className="text-sm">{formatDate(job.estimatedCompletionTime)}</span>
                        <span className="text-xs text-gray-500">{formatTime(job.estimatedCompletionTime)}</span>
                      </div>
                    ) : "Not scheduled"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleViewTimeline(job)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Timeline
                      </button>
                      <select 
                        className="text-sm border border-gray-300 rounded-md px-2 py-1"
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Queued">Queued</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <Link href={`/dashboard/jobs/${job.id}`}>
                        <button className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                          Details
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  No jobs found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Timeline Modal */}
      {isTimelineOpen && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Job Timeline: {selectedJob.id}</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsTimelineOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-1">{selectedJob.description}</p>
              <div className="flex gap-2 mb-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(selectedJob.status)}`}>
                  {selectedJob.status}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getPriorityColor(selectedJob.priority)}`}>
                  {selectedJob.priority}
                </span>
              </div>
              <p className="text-sm text-gray-500">Customer: {selectedJob.customerName}</p>
              <p className="text-sm text-gray-500">Assigned to: {selectedJob.assignedTo}</p>
            </div>
            
            <div className="relative border-l-2 border-blue-300 ml-4 pl-8 pb-2 space-y-8">
              {selectedJob.timeline.map((event, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[41px] mt-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                  <div className="mb-1 flex items-baseline">
                    <p className="font-medium text-gray-900">{event.status}</p>
                    <p className="ml-auto text-sm text-gray-500">
                      {formatDateTime(event.time)}
                    </p>
                  </div>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              ))}
              
              {selectedJob.status !== "Completed" && (
                <div className="relative">
                  <div className="absolute -left-[41px] mt-1.5 h-4 w-4 rounded-full bg-gray-300 border-2 border-blue-500"></div>
                  <div className="mb-1 flex items-baseline">
                    <p className="font-medium text-gray-400">Completed</p>
                    <p className="ml-auto text-sm text-gray-400">
                      {selectedJob.estimatedCompletionTime 
                        ? formatDateTime(selectedJob.estimatedCompletionTime) + " (Estimated)" 
                        : "To be determined"}
                    </p>
                  </div>
                  <p className="text-gray-400">Job will be completed and ready for pickup</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setIsTimelineOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 