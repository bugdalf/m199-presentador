"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useFullscreen } from "@/hooks/use-fullscreen"
import { KeyRoundIcon, LogOutIcon } from "lucide-react"

export function Navbar() {
  const router = useRouter();
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

  return (
    <div>
      {!isFullscreen && (
        <nav className="flex justify-center py-1 px-6 relative">
          <Link href="/">
            <Button variant="link">INICIO</Button>
          </Link>
          <Link href="/presentacion">
            <Button variant="link">PRESENTACIÓN</Button>
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
