# ZynkPrint - Print Management System

This is a Next.js application for managing print jobs and customers.

## Features

- User authentication
- Customer management
- Job tracking and management
- Approval queue for print jobs
- Dashboard with job status and metrics

## Technology Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel Postgres Database
- Deployed on Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Vercel account (for database and deployment)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd my-nextjs-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
# Vercel Postgres Database
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Environment
NODE_ENV=development
```

### Setting up Vercel Postgres

1. Create a Vercel account if you don't have one: [https://vercel.com/signup](https://vercel.com/signup)

2. Install the Vercel CLI:

```bash
npm install -g vercel
```

3. Login to Vercel:

```bash
vercel login
```

4. Link your project to Vercel:

```bash
vercel link
```

5. Create a new Postgres database from the Vercel dashboard:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Navigate to "Storage" tab
   - Click "Create" and select "Postgres"
   - Follow the steps to create your database

6. After creating the database, you can get the environment variables:
   - In your project's dashboard, go to "Storage" → "Postgres database"
   - Click on ".env.local" tab to see the environment variables
   - Copy these variables to your `.env.local` file

7. Pull the environment variables to your local project:

```bash
vercel env pull .env.local
```

### Database Initialization

To initialize the database with tables and sample data:

```bash
# First, make sure you have the environment variables set up
# Then run the seed script
npx tsx src/lib/seed.ts
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Demo Credentials

- Email: admin@zynkprint.com
- Password: password

## Deployment

The easiest way to deploy this application is using Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project to Vercel
3. Vercel will automatically detect Next.js and deploy with the optimal settings

## License

[MIT](LICENSE)
