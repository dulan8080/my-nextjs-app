"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  FilePlus2,
  Clock,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardStatsClient from "@/components/dashboard/DashboardStatsClient";
import RecentJobsClient from "@/components/dashboard/RecentJobsClient";

export default function DashboardPage() {
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
          <Link href="/dashboard/jobs/create">
            <Button variant="default" size="sm">
              <FilePlus2 className="mr-2 h-4 w-4" />
              New Job
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Real-time stats from Vercel Postgres */}
          <DashboardStatsClient />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent jobs from database */}
            <div className="col-span-3">
              <RecentJobsClient />
            </div>
            
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
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Jobs due in the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    Check the <Link href="/dashboard/jobs" className="text-blue-600 hover:underline">Jobs page</Link> to view all upcoming deadlines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <RecentJobsClient />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed insights and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Analytics will be available in a future update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 