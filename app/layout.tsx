import '@/styles/globals.css'
import '@/styles/rewrite.css'

import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { Providers } from '@/components/providers'
import { SwitchBotNav } from '@/components/switch-bot-nav'
import { cn } from '@/lib/utils'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Nova Tech',
  description: 'Nova Tech',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <SwitchBotNav />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
