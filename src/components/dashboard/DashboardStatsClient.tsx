"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

type DashboardStats = {
  stats: {
    customerCount: number;
    jobsInProgress: number;
    pendingApprovals: number;
    jobsDueThisWeek: number;
  };
  recentJobs: any[];
};

export default function DashboardStatsClient() {
  const { formatCurrency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Could not load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format the stats data for display
  const statsData = data ? [
    { 
      title: "Total Customers", 
      value: data.stats.customerCount, 
      trend: "up", 
      change: 6 
    },
    { 
      title: "Jobs In Progress", 
      value: data.stats.jobsInProgress, 
      trend: "up", 
      change: 12 
    },
    { 
      title: "Pending Approvals", 
      value: data.stats.pendingApprovals, 
      trend: "up", 
      change: 4 
    },
    { 
      title: "Jobs Due This Week", 
      value: data.stats.jobsDueThisWeek, 
      trend: "down", 
      change: 2 
    }
  ] : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center rounded-full bg-muted p-1`}>
              {stat.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4 transform rotate-180" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.value.toString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.trend === 'up' ? '+' : '-'}{stat.change}% from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 