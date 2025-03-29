#!/bin/bash

# Install dependencies
npm install

# Install shadcn UI components
npx shadcn@latest add avatar --force
npx shadcn@latest add sheet --force
npx shadcn@latest add scroll-area --force
npx shadcn@latest add progress --force

# Start the development server
echo "Setup complete. Run 'npm run dev' to start the development server." 