import './globals.css'
import type { Metadata } from 'next'
import { CurrencyProvider } from '@/contexts/CurrencyContext'

export const metadata: Metadata = {
  title: 'ZynkPrint - Print Management Solution',
  description: 'Streamline your print shop operations with ZynkPrint',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  )
}
