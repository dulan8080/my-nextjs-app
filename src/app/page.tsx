import { Metadata } from 'next';
import Link from 'next/link';
import HydrationGuard from '@/components/HydrationGuard';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'ZynkPrint - Print Management Solution',
  description: 'Streamline your print shop operations with ZynkPrint',
};

export default function HomePage() {
  // Redirect directly to dashboard
  redirect('/dashboard');
}
