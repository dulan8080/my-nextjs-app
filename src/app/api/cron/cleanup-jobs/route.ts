import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// This is a scheduled cron job that runs daily
// It will archive completed jobs older than 30 days
export async function GET(request: Request) {
  // Skip database operations during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ 
      success: true, 
      message: 'Build time - skipping database operation' 
    });
  }
  
  try {
    // In a real implementation, we'd move completed jobs to an archive table
    // or update their status to 'archived'
    // For this example, we'll just count old completed jobs
    
    const result = await executeQuery<{ count: string }[]>({
      query: `
        SELECT COUNT(*) as count 
        FROM jobs 
        WHERE status = 'completed' 
        AND updated_at < NOW() - INTERVAL '30 days'
      `
    });
    
    const count = Number(result[0]?.count || 0);
    
    // Log the number of jobs that would be archived
    console.log(`Found ${count} completed jobs older than 30 days`);
    
    // In a real implementation, you would do something like:
    // await executeQuery({
    //   query: `
    //     UPDATE jobs 
    //     SET status = 'archived' 
    //     WHERE status = 'completed' 
    //     AND updated_at < NOW() - INTERVAL '30 days'
    //   `
    // });
    
    return NextResponse.json({ 
      success: true, 
      message: `Found ${count} completed jobs older than 30 days` 
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to run cleanup job' },
      { status: 500 }
    );
  }
} 