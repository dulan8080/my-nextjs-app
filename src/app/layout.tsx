import './globals.css'
import type { Metadata } from 'next'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { AuthProvider } from '@/lib/authContext'
import { PaperTypesProvider } from "@/contexts/PaperTypesContext"
import { BindingTemplatesProvider } from "@/contexts/BindingTemplatesContext"

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
        <AuthProvider>
          <CurrencyProvider>
            <PaperTypesProvider>
              <BindingTemplatesProvider>
                {children}
              </BindingTemplatesProvider>
            </PaperTypesProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
