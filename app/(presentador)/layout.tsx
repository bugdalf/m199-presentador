import type { Metadata, Viewport } from 'next'
import "@fontsource/bungee-shade"
import "@fontsource/bungee"
import "@fontsource/poppins"
import "../../styles/globals.css"
import { Navbar } from '@/components/navbar'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'misión 1-99 - presentación',
  description: 'misión 1-99 - presentación',
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // 🔥 necesario para fullscreen en móviles
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-black">
        <main className="min-h-screen bg-background text-foreground">
          <Navbar />
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
