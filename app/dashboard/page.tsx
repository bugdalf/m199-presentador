"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-lg text-muted-foreground">Bienvenido de vuelta, {user.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Proyectos</CardTitle>
              <CardDescription className="text-muted-foreground">Tus proyectos activos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">12</div>
              <p className="text-sm text-muted-foreground">+2 este mes</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Usuarios</CardTitle>
              <CardDescription className="text-muted-foreground">Total de usuarios registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">1,234</div>
              <p className="text-sm text-muted-foreground">+180 este mes</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Actividad</CardTitle>
              <CardDescription className="text-muted-foreground">Eventos en las últimas 24h</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">573</div>
              <p className="text-sm text-muted-foreground">+12% vs ayer</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Información de Usuario</CardTitle>
            <CardDescription className="text-muted-foreground">Detalles de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium text-card-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">ID de Usuario:</span>
              <span className="font-mono text-sm text-card-foreground">{user.uid}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Estado:</span>
              <span className="font-medium text-green-500">Activo</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
