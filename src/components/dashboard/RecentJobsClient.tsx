"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

type Job = {
  id: number;
  customer_id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    id: number;
    name: string;
    email: string | null;
    company: string | null;
  };
};

export default function RecentJobsClient() {
  const { formatCurrency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs data');
        }
        
        const data = await response.json();
        setJobs(data.recentJobs || []);
      } catch (err) {
        console.error('Error fetching recent jobs:', err);
        setError('Could not load recent jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentJobs();
  }, []);

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "completed": return "bg-green-500";
      case "in_progress": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "cancelled": return "bg-red-500";
      case "ready_for_pickup": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>
            Your most recent print jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse flex items-center justify-between border-b pb-3">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Jobs</CardTitle>
        <CardDescription>
          Your most recent print jobs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No recent jobs found</p>
          ) : (
            jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{job.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{job.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`${getStatusColor(job.status)} px-2 py-1 rounded-full text-white text-xs`}>
                    {job.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(job.due_date || '')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <Link href="/dashboard/jobs">
          <Button variant="outline" className="mt-4 w-full">
            <FileText className="mr-2 h-4 w-4" />
            View All Jobs
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
} 