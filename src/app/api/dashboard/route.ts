import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Get counts for dashboard widgets
    const [
      customerCount,
      jobsInProgress,
      pendingApprovals,
      jobsDueThisWeek
    ] = await Promise.all([
      // Total customers
      executeQuery<{ count: string }[]>({
        query: 'SELECT COUNT(*) as count FROM customers'
      }).then(result => Number(result[0]?.count || 0)),
      
      // Jobs in progress
      executeQuery<{ count: string }[]>({
        query: "SELECT COUNT(*) as count FROM jobs WHERE status = 'in_progress'"
      }).then(result => Number(result[0]?.count || 0)),
      
      // Pending approvals
      executeQuery<{ count: string }[]>({
        query: "SELECT COUNT(*) as count FROM approval_queue WHERE status = 'pending'"
      }).then(result => Number(result[0]?.count || 0)),
      
      // Jobs due this week
      executeQuery<{ count: string }[]>({
        query: `
          SELECT COUNT(*) as count FROM jobs 
          WHERE due_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
          AND status != 'completed'
        `
      }).then(result => Number(result[0]?.count || 0))
    ]);
    
    // Get recent jobs with customers
    const recentJobs = await executeQuery({
      query: `
        SELECT 
          j.*,
          json_build_object(
            'id', c.id,
            'name', c.name,
            'email', c.email,
            'company', c.company
          ) as customer
        FROM jobs j
        JOIN customers c ON j.customer_id = c.id
        ORDER BY j.created_at DESC
        LIMIT 5
      `
    });
    
    return NextResponse.json({
      stats: {
        customerCount,
        jobsInProgress,
        pendingApprovals,
        jobsDueThisWeek
      },
      recentJobs
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 