import type { Metadata } from 'next'
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google'
import CursorGlow from '@/components/cursor-glow'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  style: ["normal", "italic"],
  variable: "--font-playfair" 
});
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "xalhexi.wtf - Tutorials & Repos",
  description: 'Tutorials, guides, and repository browser by xalhexi-sch',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <CursorGlow />
        {children}
      </body>
    </html>
  )
}
