"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";

// Mock data for reports
const monthlyRevenueData = [
  { month: "Jan", revenue: 15200, jobs: 42 },
  { month: "Feb", revenue: 17800, jobs: 48 },
  { month: "Mar", revenue: 21450, jobs: 55 },
  { month: "Apr", revenue: 19700, jobs: 51 },
  { month: "May", revenue: 25300, jobs: 62 },
  { month: "Jun", revenue: 28450, jobs: 68 },
];

const jobTypeData = [
  { type: "Digital Print", count: 145, revenue: 47500 },
  { type: "Offset Print", count: 52, revenue: 63200 },
  { type: "Large Format", count: 38, revenue: 32400 },
  { type: "Binding", count: 27, revenue: 8900 },
  { type: "Sublimation", count: 14, revenue: 7600 },
];

const customerData = [
  { name: "Acme Corp", revenue: 12450, jobCount: 18 },
  { name: "TechStart Ltd", revenue: 7800, jobCount: 11 },
  { name: "Education Center", revenue: 15200, jobCount: 24 },
  { name: "Global Industries", revenue: 9300, jobCount: 14 },
  { name: "Metro Communications", revenue: 16700, jobCount: 22 },
];

const efficiencyData = [
  { month: "Jan", onTime: 38, delayed: 4 },
  { month: "Feb", onTime: 42, delayed: 6 },
  { month: "Mar", onTime: 49, delayed: 6 },
  { month: "Apr", onTime: 47, delayed: 4 },
  { month: "May", onTime: 55, delayed: 7 },
  { month: "Jun", onTime: 62, delayed: 6 },
];

// Calculate percentage for display
const calculatePercentage = (value: number, total: number) => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

export default function ReportsPage() {
  const { formatCurrency } = useCurrency();
  const [dateRange, setDateRange] = useState("6months");
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate totals for summary cards
  const totalRevenue = monthlyRevenueData.reduce((sum, month) => sum + month.revenue, 0);
  const totalJobs = monthlyRevenueData.reduce((sum, month) => sum + month.jobs, 0);
  const avgRevenuePerJob = totalJobs > 0 ? totalRevenue / totalJobs : 0;
  const onTimeDeliveryPercentage = calculatePercentage(
    efficiencyData.reduce((sum, month) => sum + month.onTime, 0),
    efficiencyData.reduce((sum, month) => sum + month.onTime + month.delayed, 0)
  );

  // Function to generate the revenue chart
  const renderRevenueChart = () => {
    const maxRevenue = Math.max(...monthlyRevenueData.map(month => month.revenue));
    const barHeight = 200; // Maximum height for bars in pixels
    
    return (
      <div className="pt-6">
        <div className="flex justify-between items-end mb-2">
          {monthlyRevenueData.map((month, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <div className="text-xs text-gray-500 mb-1">{formatCurrency(month.revenue)}</div>
              <div className="relative w-full flex justify-center">
                <div 
                  className="bg-blue-500 rounded-t-sm w-12"
                  style={{ 
                    height: `${(month.revenue / maxRevenue) * barHeight}px`,
                    minHeight: '20px'
                  }}
                ></div>
              </div>
              <div className="text-xs font-medium mt-2">{month.month}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to generate the job types chart
  const renderJobTypesChart = () => {
    const totalRevenue = jobTypeData.reduce((sum, type) => sum + type.revenue, 0);
    const totalJobs = jobTypeData.reduce((sum, type) => sum + type.count, 0);
    
    return (
      <div className="space-y-4">
        {jobTypeData.map((jobType, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">{jobType.type}</div>
              <div className="text-sm text-gray-500">
                {jobType.count} jobs ({calculatePercentage(jobType.count, totalJobs)}%)
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${(jobType.revenue / totalRevenue) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatCurrency(jobType.revenue)} ({calculatePercentage(jobType.revenue, totalRevenue)}% of revenue)
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render top customers table
  const renderTopCustomersTable = () => {
    return (
      <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Customer</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Jobs</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Revenue</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Avg. Per Job</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {customerData.map((customer, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{customer.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.jobCount}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(customer.revenue)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(customer.revenue / customer.jobCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Function to generate on-time delivery chart
  const renderOnTimeDeliveryChart = () => {
    return (
      <div className="space-y-4">
        {efficiencyData.map((month, index) => {
          const total = month.onTime + month.delayed;
          const onTimePercentage = calculatePercentage(month.onTime, total);
          
          return (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium">{month.month}</div>
                <div className="text-sm text-gray-500">
                  {onTimePercentage}% on time
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-green-500 h-2.5" 
                  style={{ width: `${onTimePercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {month.onTime} on time, {month.delayed} delayed
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Business Reports</h1>
        <div className="flex gap-2">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
          <Button variant="outline" onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print Report
          </Button>
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">+12.5% from previous period</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Total Jobs</p>
              <p className="text-3xl font-bold mt-1">{totalJobs}</p>
              <p className="text-sm text-green-600 mt-1">+8.3% from previous period</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Avg. Revenue Per Job</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(avgRevenuePerJob)}</p>
              <p className="text-sm text-green-600 mt-1">+3.8% from previous period</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">On-Time Delivery</p>
              <p className="text-3xl font-bold mt-1">{onTimeDeliveryPercentage}%</p>
              <p className="text-sm text-green-600 mt-1">+2.1% from previous period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Revenue Trend</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span className="text-sm text-gray-500">Revenue</span>
                </div>
              </div>
            </div>
            {renderRevenueChart()}
          </CardContent>
        </Card>

        {/* Job Types Distribution */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Job Types Distribution</h3>
              <div className="text-sm text-gray-500">By Revenue</div>
            </div>
            {renderJobTypesChart()}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Top Customers</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            {renderTopCustomersTable()}
          </CardContent>
        </Card>

        {/* On-Time Delivery Performance */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">On-Time Delivery Performance</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-sm text-gray-500">On Time</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-sm text-gray-500">Delayed</span>
                </div>
              </div>
            </div>
            {renderOnTimeDeliveryChart()}
          </CardContent>
        </Card>
      </div>

      {/* Available Reports List */}
      <Card>
        <CardContent className="pt-4">
          <h3 className="text-lg font-medium mb-4">Available Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium">Sales by Job Type</div>
              <p className="text-sm text-gray-500 mt-1">Detailed breakdown of sales performance by job type</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium">Customer Analysis</div>
              <p className="text-sm text-gray-500 mt-1">In-depth analysis of customer spending patterns</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium">Production Efficiency</div>
              <p className="text-sm text-gray-500 mt-1">Analysis of production times and efficiency metrics</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium">Inventory Usage</div>
              <p className="text-sm text-gray-500 mt-1">Report on material usage and inventory turnover</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium">Staff Performance</div>
              <p className="text-sm text-gray-500 mt-1">Productivity and performance analysis by staff member</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium">Financial Summary</div>
              <p className="text-sm text-gray-500 mt-1">Complete P&L and financial performance reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 