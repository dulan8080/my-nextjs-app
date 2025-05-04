#!/usr/bin/env node

/**
 * This script helps set up MySQL for the printing application.
 * It will install required npm packages and run the database setup.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (question) => new Promise((resolve) => rl.question(question, resolve));

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

async function checkXAMPP() {
  console.log(`${colors.bright}Checking for XAMPP MySQL...${colors.reset}`);
  
  try {
    // Check if XAMPP MySQL is running - slightly different approach
    // Try to connect to MySQL on the default port rather than checking for a service
    const { stdout } = await execAsync('netstat -an | findstr :3306');
    
    if (stdout.includes('LISTENING')) {
      console.log(`${colors.green}✓ XAMPP MySQL is running.${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.yellow}! MySQL port 3306 not found. Please ensure XAMPP MySQL is running.${colors.reset}`);
      
      const startXAMPP = await prompt(`Would you like to start MySQL through XAMPP? (y/n): `);
      if (startXAMPP.toLowerCase() === 'y') {
        console.log(`${colors.yellow}Please open XAMPP Control Panel and start MySQL.${colors.reset}`);
        await prompt(`Press Enter once you've started XAMPP MySQL...`);
        return true;
      } else {
        console.log(`${colors.red}× MySQL is required to continue. Please start it in XAMPP before running this script again.${colors.reset}`);
        return false;
      }
    }
  } catch (error) {
    console.log(`${colors.yellow}! Unable to check MySQL status. Assuming it's not running.${colors.reset}`);
    console.log(`${colors.yellow}Please ensure XAMPP MySQL is running before continuing.${colors.reset}`);
    
    const continueSetup = await prompt(`Have you started MySQL in XAMPP? (y/n): `);
    if (continueSetup.toLowerCase() === 'y') {
      return true;
    } else {
      console.log(`${colors.red}× MySQL is required to continue.${colors.reset}`);
      return false;
    }
  }
}

async function installDependencies() {
  console.log(`${colors.bright}Checking for required npm packages...${colors.reset}`);
  
  // Check if mysql2 is already installed
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const hasMysql2 = packageJson.dependencies && packageJson.dependencies.mysql2;
  
  if (hasMysql2) {
    console.log(`${colors.green}✓ mysql2 package is already installed.${colors.reset}`);
    return true;
  }
  
  console.log(`${colors.yellow}! mysql2 package not found. Installing...${colors.reset}`);
  
  try {
    await execAsync('npm install --save mysql2');
    console.log(`${colors.green}✓ mysql2 package installed successfully.${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}× Failed to install mysql2 package. Error: ${error.message}${colors.reset}`);
    return false;
  }
}

async function setupDatabase() {
  console.log(`${colors.bright}Setting up the database...${colors.reset}`);
  
  try {
    // Run the setup-db.ts script
    await execAsync('npx tsx src/lib/setup-db.ts');
    console.log(`${colors.green}✓ Database setup completed successfully.${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}× Database setup failed. Error: ${error.message}${colors.reset}`);
    return false;
  }
}

async function main() {
  console.log(`\n${colors.cyan}${colors.bright}===========================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}   MySQL Setup for Print Application${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}===========================================${colors.reset}\n`);
  
  // Step 1: Check if MySQL is available
  const isMySQLRunning = await checkXAMPP();
  if (!isMySQLRunning) {
    rl.close();
    process.exit(1);
  }
  
  // Step 2: Install required packages
  const dependenciesInstalled = await installDependencies();
  if (!dependenciesInstalled) {
    rl.close();
    process.exit(1);
  }
  
  // Step 3: Setup database
  const databaseSetup = await setupDatabase();
  if (!databaseSetup) {
    rl.close();
    process.exit(1);
  }
  
  console.log(`\n${colors.green}${colors.bright}===========================================${colors.reset}`);
  console.log(`${colors.green}${colors.bright}   Setup Completed Successfully!${colors.reset}`);
  console.log(`${colors.green}${colors.bright}===========================================${colors.reset}\n`);
  
  console.log(`${colors.cyan}The database has been set up and is ready to use.${colors.reset}`);
  console.log(`${colors.cyan}You can now use the following models in your application:${colors.reset}`);
  console.log(`${colors.cyan}- src/lib/models/mysql-customer.ts${colors.reset}`);
  console.log(`${colors.cyan}- src/lib/models/mysql-job.ts${colors.reset}`);
  console.log(`${colors.cyan}- src/lib/models/mysql-print-queue.ts${colors.reset}\n`);
  
  console.log(`${colors.cyan}To restart the setup process, run:${colors.reset}`);
  console.log(`${colors.bright}npm run setup:mysql${colors.reset}\n`);
  
  rl.close();
}

main().catch(error => {
  console.error(`${colors.red}Unhandled error: ${error.message}${colors.reset}`);
  rl.close();
  process.exit(1);
}); 