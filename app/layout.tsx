import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CeyloFieldOps — AI Field Service Management',
  description: 'AI-powered field service management for Sri Lankan organizations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}