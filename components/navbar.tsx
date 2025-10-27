"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useFullscreen } from "@/hooks/use-fullscreen"
import { KeyRoundIcon, LogOutIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isFullscreen = useFullscreen();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div>
      {!isFullscreen && (
        <nav className="flex gap-4 justify-center py-1 px-6 relative mb-2">
          <Link href="/" className={cn(isActive("/") && "border-b-2 border-primary")}>
            <Button variant="link" className="p-0">INICIO</Button>
          </Link>
          <Link href="/presentacion" className={cn(isActive("/presentacion")&& "border-b-2 border-primary")}>
            <Button variant="link" className="p-0">PRESENTACIÓN</Button>
          </Link>
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout} className="absolute right-2">
              <LogOutIcon />
            </Button>
          ) : (
            <Link href="/login" className="absolute right-2">
              <Button variant="outline"><KeyRoundIcon /></Button>
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}