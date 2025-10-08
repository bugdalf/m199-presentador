"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <nav className="flex justify-center p-6 relative">

      <Link href="/">
        <Button variant="link">INICIO</Button>
      </Link>
      <Link href="/presentacion">
        <Button variant="link">PRESENTACIÓN</Button>
      </Link>
      {isAuthenticated ? (
        <Button variant="outline" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      ) : (
        <Link href="/login" className="absolute right-2">
          <Button variant="outline">Iniciar Sesión</Button>
        </Link>
      )}
    </nav>
  )
}
