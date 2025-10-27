import type { Metadata } from 'next'
import "@fontsource/bungee-shade"
import "@fontsource/bungee"
import "@fontsource/poppins"
import '../styles/globals.css'
import { Navbar } from '@/components/navbar'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'misión 1-99 - presentación',
  description: 'misión 1-99 - presentación',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-black">
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
