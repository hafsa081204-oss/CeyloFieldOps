import Providers from './providers'
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'CeyloFieldOps',
  description: 'AI-Powered Field Service Management for Sri Lanka',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0A0A0A' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}