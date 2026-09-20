import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'old.xalhexi.wtf — Personal File Hub & Chat',
  description: 'Private, self-hosted file hub, realtime multi-room chat, and document preview platform hosted on old.xalhexi.wtf.',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-[#090a0f] text-zinc-100 min-h-screen selection:bg-violet-500 selection:text-white">
        {children}
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  )
}
