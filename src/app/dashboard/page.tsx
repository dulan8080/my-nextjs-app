"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  FileText,
  FilePlus2,
  TrendingUp,
  Users,
  Printer,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCurrency } from "@/contexts/CurrencyContext";

// Mock statistics data
const statsData = [
  { title: "Total Revenue", value: 24389.20, trend: "up", change: 6 },
  { title: "Jobs This Month", value: 124, trend: "up", change: 12 },
  { title: "Avg. Job Value", value: 195.80, trend: "down", change: 2 },
  { title: "Pending Approvals", value: 8, trend: "up", change: 4 }
];

// Mock recent jobs data
const mockRecentJobs = [
  {
    id: "JC-2023-001",
    customerName: "Acme Corp",
    jobType: "Digital Print",
    status: "In Progress",
    priority: "High",
    dueDate: new Date(2023, 4, 15).toLocaleDateString(),
    createdAt: new Date(2023, 4, 10),
    totalAmount: 1250.50,
  },
  {
    id: "JC-2023-002",
    customerName: "TechStart Ltd",
    jobType: "Large Format",
    status: "Pending",
    priority: "Medium",
    dueDate: new Date(2023, 4, 20).toLocaleDateString(),
    createdAt: new Date(2023, 4, 12),
    totalAmount: 780.00,
  },
  {
    id: "JC-2023-003",
    customerName: "Global Industries",
    jobType: "Offset Print",
    status: "Completed",
    priority: "Low",
    dueDate: new Date(2023, 4, 18).toLocaleDateString(),
    createdAt: new Date(2023, 4, 8),
    totalAmount: 3450.75,
  },
  {
    id: "JC-2023-005",
    customerName: "Education Center",
    jobType: "Binding",
    status: "Ready for Pickup",
    priority: "High",
    dueDate: new Date(2023, 4, 16).toLocaleDateString(),
    createdAt: new Date(2023, 4, 9),
    totalAmount: 890.00,
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

export default function DashboardPage() {
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Last 7 Days
          </Button>
          <Button variant="default" size="sm">
            <FilePlus2 className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
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
                    {stat.title.includes("Revenue") || stat.title.includes("Value") 
                      ? formatCurrency(stat.value) 
                      : stat.value.toString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.trend === 'up' ? '+' : '-'}{stat.change}% from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>
                  Your most recent print jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{job.customerName}</p>
                        <p className="text-sm text-muted-foreground">{job.jobType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`${getStatusColor(job.status)} px-2 py-1 rounded-full text-white text-xs`}>
                          {job.status}
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(job.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View All Jobs
                </Button>
              </CardContent>
            </Card>
            
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Job Trends</CardTitle>
                <CardDescription>
                  Job volume and revenue over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Chart visualization would go here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Printing Queue</CardTitle>
                <CardDescription>
                  Current print jobs in queue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Printer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Queue Status</span>
                    </div>
                    <span className="text-sm font-medium text-green-500">Active</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Queue Capacity</span>
                      <span className="text-sm font-medium">12/20</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Job Types</CardTitle>
                <CardDescription>
                  Most requested printing services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Digital Print', 'Large Format', 'Business Cards', 'Binding'].map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{type}</span>
                      <Progress value={[75, 60, 45, 30][index]} className="w-[100px] h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Activity</CardTitle>
                <CardDescription>
                  Recent customer interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentJobs.slice(0, 3).map((job, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="rounded-full bg-gray-100 p-2">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{job.customerName}</p>
                        <p className="text-xs text-muted-foreground">New {job.jobType} order</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>
                All recent print jobs from the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr_1fr_150px_100px_100px_100px] gap-2 p-4 font-medium border-b">
                  <div>Job ID</div>
                  <div>Customer</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Priority</div>
                  <div>Amount</div>
                </div>
                {mockRecentJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="grid grid-cols-[1fr_1fr_150px_100px_100px_100px] gap-2 p-4 border-b last:border-0 hover:bg-muted/50"
                  >
                    <div className="font-medium">{job.id}</div>
                    <div>{job.customerName}</div>
                    <div>{job.jobType}</div>
                    <div>
                      <span className={`${getStatusColor(job.status)} px-2 py-1 rounded-full text-white text-xs`}>
                        {job.status}
                      </span>
                    </div>
                    <div>
                      <span className={`${getPriorityColor(job.priority)} px-2 py-1 rounded-full text-white text-xs`}>
                        {job.priority}
                      </span>
                    </div>
                    <div>{formatCurrency(job.totalAmount)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Job completion and revenue metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="mt-2 text-lg font-medium">Analytics Dashboard</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                  Detailed analytics visualizations would be displayed here, showing job trends, revenue growth, 
                  busiest times, and other key performance indicators.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 