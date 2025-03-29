"use client";

import { useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";

// Mock job data
const mockJobs = [
  {
    id: "JC-2023-001",
    customerName: "Acme Corp",
    jobType: "Digital Print",
    status: "In Progress",
    priority: "High",
    dueDate: new Date(2023, 4, 15),
    createdAt: new Date(2023, 4, 10),
    totalAmount: 1250.50
  },
  {
    id: "JC-2023-002",
    customerName: "TechStart Ltd",
    jobType: "Large Format",
    status: "Pending",
    priority: "Medium",
    dueDate: new Date(2023, 4, 20),
    createdAt: new Date(2023, 4, 12),
    totalAmount: 780.00
  },
  {
    id: "JC-2023-003",
    customerName: "Global Industries",
    jobType: "Offset Print",
    status: "Completed",
    priority: "Low",
    dueDate: new Date(2023, 4, 18),
    createdAt: new Date(2023, 4, 8),
    totalAmount: 3450.75
  },
  {
    id: "JC-2023-004",
    customerName: "Local Business",
    jobType: "Digital Print",
    status: "Cancelled",
    priority: "Medium",
    dueDate: new Date(2023, 4, 22),
    createdAt: new Date(2023, 4, 14),
    totalAmount: 560.25
  },
  {
    id: "JC-2023-005",
    customerName: "Education Center",
    jobType: "Binding",
    status: "Ready for Pickup",
    priority: "High",
    dueDate: new Date(2023, 4, 16),
    createdAt: new Date(2023, 4, 9),
    totalAmount: 890.00
  }
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

export default function JobsPage() {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();
  const [jobTypeFilter, setJobTypeFilter] = useState<string | undefined>();

  // Filter jobs based on search and filters
  const filteredJobs = mockJobs.filter(job => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = !statusFilter || job.status === statusFilter;
    
    // Priority filter
    const matchesPriority = !priorityFilter || job.priority === priorityFilter;
    
    // Job type filter
    const matchesJobType = !jobTypeFilter || job.jobType === jobTypeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesJobType;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
    setJobTypeFilter(undefined);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Print Jobs</h1>
        <Link href="/dashboard/jobs/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Create New Job</button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select 
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md w-[150px]"
          >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
          </select>

          <select 
            value={priorityFilter || ""}
            onChange={(e) => setPriorityFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md w-[150px]"
          >
            <option value="">Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            value={jobTypeFilter || ""}
            onChange={(e) => setJobTypeFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md w-[150px]"
          >
            <option value="">Job Type</option>
            <option value="Digital Print">Digital Print</option>
            <option value="Offset Print">Offset Print</option>
            <option value="Large Format">Large Format</option>
            <option value="Binding">Binding</option>
          </select>

          <button 
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{job.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.jobType}</td>
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
                    {job.dueDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">{formatCurrency(job.totalAmount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/jobs/${job.id}`}>
                        <button className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">View</button>
                      </Link>
                      <Link href={`/dashboard/jobs/${job.id}/edit`}>
                        <button className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Edit</button>
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
    </div>
  );
} 