import { Metadata } from 'next';
import Link from 'next/link';
import HydrationGuard from '@/components/HydrationGuard';

export const metadata: Metadata = {
  title: 'ZynkPrint - Print Management Solution',
  description: 'Streamline your print shop operations with ZynkPrint',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 text-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="h-14 w-14"
              >
                <path d="M6.925 16.875Q5.2 16.875 4 15.675Q2.8 14.475 2.8 12.75Q2.8 11.025 4 9.825Q5.2 8.625 6.925 8.625H17.075Q18.8 8.625 20 9.825Q21.2 11.025 21.2 12.75Q21.2 14.475 20 15.675Q18.8 16.875 17.075 16.875H15.9V15.375H17.075Q18.1 15.375 18.825 14.65Q19.55 13.925 19.55 12.9Q19.55 11.875 18.825 11.15Q18.1 10.425 17.075 10.425H6.925Q5.9 10.425 5.175 11.15Q4.45 11.875 4.45 12.9Q4.45 13.925 5.175 14.65Q5.9 15.375 6.925 15.375H9V16.875Z" />
                <path d="M8.5 20.5V5H10V20.5ZM14 20.5V5H15.5V20.5Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-700">
            ZynkPrint
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Streamline your print shop operations with our comprehensive management solution
          </p>
          
          <HydrationGuard>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                Go to Dashboard
              </Link>
              <Link
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow transition-colors duration-200"
                href="/auth/signin"
              >
                Login
              </Link>
            </div>
          </HydrationGuard>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Job Management</h3>
            <p className="text-gray-600">Easily create, track, and manage print jobs from start to finish.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
            <p className="text-gray-600">Organize customer information and track their print history.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Reports & Analytics</h3>
            <p className="text-gray-600">Gain insights into your print shop performance with detailed reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
