import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    database: {
      connection: null,
      tables: [],
      customers: [],
      error: null
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      nextPhase: process.env.NEXT_PHASE
    },
    directConnection: {
      status: null,
      error: null,
      customers: []
    }
  };
  
  // Test helper function
  try {
    console.log('DEBUG: Testing query helper function');
    const customers = await query('SELECT * FROM customers LIMIT 5');
    debugInfo.database.connection = 'Success';
    debugInfo.database.customers = customers;
  } catch (error) {
    console.error('DEBUG: Error testing query helper function:', error);
    debugInfo.database.connection = 'Failed';
    debugInfo.database.error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  // Direct connection test
  try {
    console.log('DEBUG: Testing direct MySQL connection');
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'dbprint'
    });
    
    debugInfo.directConnection.status = 'Connected';
    
    // Check tables
    const [tables] = await connection.query('SHOW TABLES');
    debugInfo.database.tables = (tables as any[]).map(table => Object.values(table)[0]);
    
    // Get direct customers
    const [customers] = await connection.query('SELECT * FROM customers LIMIT 5');
    debugInfo.directConnection.customers = customers;
    
    // Close connection
    await connection.end();
  } catch (error) {
    console.error('DEBUG: Error with direct MySQL connection:', error);
    debugInfo.directConnection.status = 'Failed';
    debugInfo.directConnection.error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  // Debug mysql.ts file
  let mysqlFilePath = '';
  try {
    // Try to get the source of the mysql.ts file to check configuration
    const { resolve } = require('path');
    mysqlFilePath = resolve(process.cwd(), 'src/lib/mysql.ts');
    const fs = require('fs');
    if (fs.existsSync(mysqlFilePath)) {
      const mysqlFileContent = fs.readFileSync(mysqlFilePath, 'utf8');
      debugInfo.mysqlFile = {
        exists: true,
        path: mysqlFilePath,
        // Don't include the actual content in production for security reasons
        content: process.env.NODE_ENV === 'development' ? mysqlFileContent : 'Hidden in production'
      };
    } else {
      debugInfo.mysqlFile = {
        exists: false,
        path: mysqlFilePath
      };
    }
  } catch (error) {
    console.error('DEBUG: Error reading mysql.ts file:', error);
    debugInfo.mysqlFile = {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      path: mysqlFilePath
    };
  }
  
  return NextResponse.json(debugInfo);
} 