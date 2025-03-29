#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Fixing potential hydration issues in Next.js components...');

// Find all layout files in the app directory
const layoutFiles = glob.sync('**/{,src/app/}**/layout.{tsx,jsx,js}', {
  ignore: ['node_modules/**', '.next/**', '.git/**']
});

console.log(`Found ${layoutFiles.length} layout files to check.`);

let fixesApplied = 0;

layoutFiles.forEach(file => {
  const filePath = path.resolve(file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file already has suppressHydrationWarning
  if (content.includes('suppressHydrationWarning')) {
    console.log(`✓ ${file} already has suppressHydrationWarning`);
    return;
  }
  
  // Find html tag
  let updatedContent = content.replace(
    /<html([^>]*)>/g, 
    '<html$1 suppressHydrationWarning>'
  );
  
  // Find body tag
  updatedContent = updatedContent.replace(
    /<body([^>]*)>/g,
    '<body$1 suppressHydrationWarning>'
  );
  
  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✓ Fixed ${file}`);
    fixesApplied++;
  } else {
    console.log(`? Could not apply fix to ${file} automatically`);
  }
});

console.log(`Applied fixes to ${fixesApplied} files.`);
console.log('\nDon\'t forget to check for components using:');
console.log('- Date.now() or Math.random()');
console.log('- typeof window !== "undefined" checks in rendering logic');
console.log('- Browser-only APIs in rendering logic');

console.log('\nConsider using the HydrationGuard component for client-side only rendering:');
console.log(`
import HydrationGuard from '@/components/HydrationGuard';

// In your component
<HydrationGuard>
  {/* Content that should only render on the client */}
</HydrationGuard>
`); 